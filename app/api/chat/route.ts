// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText, smoothStream, createDataStreamResponse } from 'ai';
import { Pool } from 'pg';
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { Message } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Initialize OpenAI client
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: 'postgresql://Data_owner:JsxygNDC15IO@ep-cool-hill-a5k13m05-pooler.us-east-2.aws.neon.tech/Data?sslmode=require'
});

async function checkRelevance(query: string, chatHistory: Message[]) {
  const result = streamText({
    model: openai('gpt-4o-2024-11-20'),
    system: 'You are a chat relevance checker.',
    messages: [{
      role: 'user',
      content: `Given this question and chat history, determine if it is:
      1. A greeting/send-off (GREETING)
      2. Related to woodworking/tools/company (RELEVANT)
      3. Inappropriate content (INAPPROPRIATE)
      4. Unrelated (NOT_RELEVANT)
      Chat History: ${JSON.stringify(chatHistory.slice(-5))}
      Current Question: ${query}
      Response (GREETING, RELEVANT, INAPPROPRIATE, or NOT_RELEVANT):`
    }],
  });

  let response = '';
  for await (const textPart of result.textStream) {
    response += textPart;
  }
  return response.trim();
}

async function rewriteQuery(query: string, chatHistory: Message[]) {
  const result = streamText({
    model: openai('gpt-4o-2024-11-20'),
    system: `You are bent's woodworks assistant so question will be related to wood shop. 
    Rewrites user query to make them more specific and searchable, taking into account 
    the chat history if provided. Only return the rewritten query without any explanations.`,
    messages: [{
      role: 'user',
      content: `Original query: ${query}
      Chat history: ${JSON.stringify(chatHistory)}
      Rewritten query:`
    }],
    experimental_transform: smoothStream(),
  });

  let response = '';
  for await (const textPart of result.textStream) {
    response += textPart;
  }
  return response.trim();
}

async function generateEmbedding(text: string) {
  const response = await openaiClient.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  
  return response.data[0].embedding;
}

async function vectorSearch(embedding: number[], limit: number = 5) {
  const tableName = 'bents_transcripts';
  const query = `
    SELECT 
      id, 
      text, 
      title, 
      url, 
      chunk_id,
      1 - (vector <=> $1::vector) as similarity_score
    FROM ${tableName}
    WHERE vector IS NOT NULL
    ORDER BY vector <=> $1::vector
    LIMIT $2;
  `;
  
  const result = await pool.query(query, [JSON.stringify(embedding), limit]);
  
  return result.rows.map(row => ({
    id: row.id,
    text: row.text,
    title: row.title,
    url: row.url,
    chunk_id: row.chunk_id,
    similarity_score: row.similarity_score
  }));
}

async function fetchProductsByVideoIds(videoIds: string[]) {
  if (!videoIds.length) return [];
  
  const videoIdConditions = videoIds.map(id => `video_id LIKE '%${id}%'`).join(' OR ');
  
  const query = `
    SELECT 
      title as product_title,
      tags,
      link as product_link,
      id as product_id,
      video_id
    FROM products
    WHERE ${videoIdConditions}
    LIMIT 20;
  `;
  
  try {
    const result = await pool.query(query);
    return result.rows.map(row => ({
      product_title: row.product_title,
      tags: row.tags,
      product_link: row.product_link,
      product_id: row.product_id,
      video_id: row.video_id
    }));
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

// Format transcript content for the LLM
const formatTranscriptForLLM = (searchResults: any[]) => {
  return searchResults.map((result: any) => `
Content: ${result.text}
Title: ${result.title}
URL: ${result.url}
Chunk ID: ${result.chunk_id}
Similarity: ${result.similarity_score.toFixed(4)}
---
  `.trim()).join('\n\n');
};

// Format product headings for the LLM
const formatProductHeadingsForLLM = (products: any[]) => {
  if (!products.length) return "No related products found.";
  
  // Create a list of product headings with markdown hyperlinks
  const productLinks = products
    .filter(product => product.product_title && product.product_link)
    .map(product => `- [${product.product_title.trim()}](${product.product_link})`)
    .join('\n');
  
  return `
### **Related Products**

${productLinks}
  `.trim();
};

// Function to format video data for frontend (timestamp extraction)
const formatVideoData = (searchResults: any[]) => {
  return searchResults
    .map((result: any) => {
      const extractedTimestamps = extractTimestamps(result.text, result.url);
      
      return {
        id: result.id,
        title: result.title,
        url: result.url,
        text: result.text,
        timestamps: extractedTimestamps
      };
    })
    .filter((video: any, index: number, self: any) => 
      index === self.findIndex((v: any) => v.url === video.url)
    );
};

function timeToSeconds(timestamp: string): number {
  const parts = timestamp.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

function createTimestampUrl(videoUrl: string, timestamp: string): string {
  const seconds = timeToSeconds(timestamp);
  
  if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
    try {
      // Handle youtu.be short links
      if (videoUrl.includes('youtu.be/')) {
        const videoId = videoUrl.split('youtu.be/')[1].split('?')[0].split('#')[0];
        return `https://www.youtube.com/watch?v=${videoId}&t=${seconds}`;
      }
      
      // Handle regular youtube.com links
      if (videoUrl.includes('youtube.com/watch')) {
        const url = new URL(videoUrl);
        const videoId = url.searchParams.get('v');
        if (videoId) {
          return `https://www.youtube.com/watch?v=${videoId}&t=${seconds}`;
        }
      }
      
      // Handle embed links
      if (videoUrl.includes('/embed/')) {
        const videoIdMatch = videoUrl.match(/\/embed\/([^/?&#]+)/);
        if (videoIdMatch && videoIdMatch[1]) {
          return `https://www.youtube.com/watch?v=${videoIdMatch[1]}&t=${seconds}`;
        }
      }
    } catch (error) {
      console.error('Error processing YouTube URL:', error);
    }
    
    // Fallback for YouTube URLs if parsing fails
    return `${videoUrl.split('&')[0]}${videoUrl.includes('?') ? '&' : '?'}t=${seconds}`;
  }
  
  // For non-YouTube URLs
  return `${videoUrl}#t=${seconds}`;
}

function extractTimestamps(text: string, videoUrl: string): Array<{time: string, text: string, url: string}> {
  const timestamps: Array<{time: string, text: string, url: string}> = [];
  const regex = /\[(\d{2}:\d{2})\](.*?)(?=\[\d{2}:\d{2}\]|$)/g;
  
  let match;
  while ((match = regex.exec(text)) !== null) {
    const timestamp = match[1];
    const textContent = match[2].trim();
    const timestampUrl = createTimestampUrl(videoUrl, timestamp);
    
    timestamps.push({
      time: timestamp,
      text: textContent,
      url: timestampUrl
    });
  }
  
  return timestamps;
}

// Modified POST handler
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const currentMessage = messages[messages.length - 1].content;
    const chatHistory = messages.slice(0, -1);

    // Step 1: Check relevance
    const relevance = await checkRelevance(currentMessage, chatHistory);
    
    // Handle different relevance types
    if (relevance === 'GREETING') {
      return streamText({
        model: openai('gpt-4o-2024-11-20'),
        system: `You are Jason Bent's woodworking AI assistant.`,
        messages: [{
          role: 'user',
          content: `Generate a friendly greeting as Jason Bent's woodworking AI assistant.`
        }],
      }).toDataStreamResponse();
    }

    if (relevance === 'INAPPROPRIATE') {
      return streamText({
        model: openai('gpt-4o-2024-11-20'),
        system: `You are Jason Bent's woodworking AI assistant.`,
        messages: [{ 
          role: 'user',
          content: `Please respond with the following message: "I apologize, but I cannot assist with inappropriate content or queries that could cause harm. I'm here to help with woodworking and furniture making questions only."`
        }],
        temperature: 0
      }).toDataStreamResponse();
    }
    
    if (relevance === 'NOT_RELEVANT') {
      return streamText({
        model: openai('gpt-4o-2024-11-20'),
        system: `You are Jason Bent's woodworking AI assistant.`,
        messages: [{
          role: 'user',
          content: `The following question is not directly related to woodworking or the assistant's expertise. Provide a direct response that:
          1. Politely acknowledges the question
          2. Explains that you are specialized in woodworking and Jason Bent's content
          3. Asks them to rephrase their question to relate to woodworking topics
          Question: ${currentMessage}`
        }],
        experimental_transform: smoothStream(),
      }).toDataStreamResponse();
    }
    
    // Step 2: Rewrite query for better search
    const rewrittenQuery = await rewriteQuery(currentMessage, chatHistory);

    // Step 3: Generate embedding for the rewritten query
    const embedding = await generateEmbedding(rewrittenQuery || currentMessage);

    // Step 4: Search vector database for top 5 results
    const searchResults = await vectorSearch(embedding, 5);
    
    // Step 5: Extract video IDs from transcripts
    const videoIds = searchResults
      .map(result => result.id)
      .filter((id, index, self) => self.indexOf(id) === index);
    
    // Step 6: Fetch related products using the video IDs (without images)
    const relatedProducts = await fetchProductsByVideoIds(videoIds);
    
    // Step 7: Format transcript content and product headings for the LLM
    const transcriptsForLLM = formatTranscriptForLLM(searchResults);
    const productHeadingsForLLM = formatProductHeadingsForLLM(relatedProducts);
    
    // Combine transcript content and product headings for the LLM
    const contextForLLM = `
${transcriptsForLLM}

# After you answer the user's question, please include the following product links section exactly as written:

${productHeadingsForLLM}
    `.trim();
    
    console.log("Product Headings:", productHeadingsForLLM);
    
    // Prepare video data for frontend
    const videoData = formatVideoData(searchResults);
    console.log("Video Data:", videoData);
    
    // System configuration
    const JASON_BENT_SYSTEM_CONFIG = {
      role: 'system',
      content: `You are an AI assistant representing Jason Bent's woodworking expertise. Your role is to:
1. Analyze woodworking documents and provide clear, natural responses that sound like Jason Bent is explaining the concepts.
2. Convert technical content into conversational, easy-to-understand explanations.
3. Focus on explaining the core concepts and techniques rather than quoting directly from transcripts.
4. Always maintain a friendly, professional tone as if Jason Bent is speaking directly to the user.
5. Organize multi-part responses clearly with natural transitions.
6. Keep responses concise and focused on the specific question asked.
7. If information isn't available in the provided context, clearly state that.
8. Always respond in English, regardless of the input language.
9. Avoid using phrases like "in the video" or "the transcript shows" - instead, speak directly about the techniques and concepts.
10. At the end of your answer, include the Related Products section with hyperlinks EXACTLY as provided.

Response Structure and Formatting:
   - Use markdown formatting with clear hierarchical structure
   - Format section headers as: ### **Title Here**
   - Use bullet points (-) for detailed explanations under each section
   - Each bullet point must contain 2-3 sentences minimum with examples
   - Add blank lines between major sections only
   - Indent bullet points with proper spacing
   - Do NOT use bold formatting (**) or line breaks within bullet point content
   - Bold formatting should ONLY be used in section headers
   - Keep all content within a bullet point on the same line
   - Any asterisks (*) in the content should be treated as literal characters, not formatting
   - Include the "Related Products" section at the end EXACTLY as provided

Remember:
- You are speaking as Jason Bent's AI assistant and so if you are mentioning Jason Bent, you should use the word "Jason Bent" instead of "I" like "Jason Bent will suggest that you..."
- Focus on analyzing the transcripts and explaining the concepts naturally rather than quoting transcripts
- Keep responses clear, practical, and focused on woodworking expertise
- DO NOT mention videos or explain the product links - simply include them as provided at the end of your response`
    };
    
    // Step 8: Create response stream with transcript and product headings
    const response = await streamText({
      model: openai('gpt-4o-2024-11-20'),
      system: JASON_BENT_SYSTEM_CONFIG.content,
      messages: [...chatHistory, {
        role: 'user',
        content: `${contextForLLM}\n\nUse the above information to answer the following question:\n${currentMessage}`
      }],
    });
    
    // Return the DataStream as a response
    return response.toDataStreamResponse();

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}