'use client';

import React, { useEffect, useRef, useCallback, useState, FormEvent } from 'react';
import { useChat } from '@ai-sdk/react';
import { Send, Loader2, Search, Brain, Cpu } from 'lucide-react';
import ReactMarkdown, { Components } from 'react-markdown';

export default function QuestionAnswerChat() {
  const { messages, handleSubmit, input, handleInputChange, isLoading } = useChat({
    api: '/api/chat',
  });
  
  const [showProcessing, setShowProcessing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageLengthRef = useRef<number>(0);
  const lastMessageContentRef = useRef<string>('');

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant') {
      const currentContent = lastMessage.content;
      if (currentContent !== lastMessageContentRef.current) {
        lastMessageContentRef.current = currentContent;
        if (!isStreaming) {
          setIsStreaming(true);
          setShowProcessing(false);
        }
      }
    }
  }, [messages]);

  useEffect(() => {
    if (isLoading) {
      setShowProcessing(true);
      setIsStreaming(false);
    } else {
      setShowProcessing(false);
      setIsStreaming(false);
    }
  }, [isLoading]);

  const scrollToBottom = useCallback(() => {
    if (messageContainerRef.current) {
      const container = messageContainerRef.current;
      const isScrolledNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      if (isScrolledNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length && messages.length !== lastMessageLengthRef.current) {
      lastMessageLengthRef.current = messages.length;
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setShowProcessing(true);
    setIsStreaming(false);
    await handleSubmit(e);
  };

  const ProcessingCard = () => (
    <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100 mb-4 animate-fade-in">
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
            <Search className="w-4 h-4 text-blue-600 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Analyzing Query</p>
            <p className="text-xs text-gray-500">Processing your question...</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
            <Brain className="w-4 h-4 text-purple-600 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Searching Knowledge Base</p>
            <p className="text-xs text-gray-500">Finding relevant information...</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
            <Cpu className="w-4 h-4 text-green-600 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Generating Response</p>
            <p className="text-xs text-gray-500">Crafting your answer...</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  );

  // Add custom components configuration
  const markdownComponents: Components = {
    a: ({ node, children, href }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        {children}
      </a>
    )
  };

  // Update the processMarkdown function
  const processMarkdown = (content: string) => {
    // First, normalize line endings
    const normalized = content.replace(/\r\n/g, '\n');
    
    // Split into paragraphs (double line breaks)
    const paragraphs = normalized.split(/\n\s*\n/);
    
    // Process each paragraph while preserving markdown links
    const processed = paragraphs.map(para => {
      // Temporarily replace markdown links with a placeholder
      const links: string[] = [];
      const withPlaceholders = para.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match) => {
        links.push(match);
        return `{{LINK${links.length - 1}}}`;
      });
      
      // Remove extra spaces
      const cleaned = withPlaceholders.replace(/\s+/g, ' ').trim();
      
      // Restore links
      return cleaned.replace(/{{LINK(\d+)}}/g, (_, index) => links[parseInt(index)]);
    });
    
    // Join paragraphs with double line break
    return processed.join('\n\n');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-3xl mx-auto p-4 bg-white rounded-2xl shadow-lg">
        <div className="border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-800">AI Chat Assistant</h1>
          <p className="text-gray-500">Ask me anything about woodworking!</p>
        </div>
        <div ref={messageContainerRef} className="space-y-4 mb-4 max-h-[500px] overflow-y-auto scroll-smooth px-2">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`relative p-3 rounded-2xl max-w-[80%] shadow-sm ${message.role === 'user' ? 'bg-blue-500 text-white ml-12' : 'bg-gray-100 text-gray-800 mr-12'} transform transition-all duration-300 hover:scale-[1.02]`}>
                <div className={`absolute top-0 ${message.role === 'user' ? '-right-10' : '-left-10'} w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-blue-600' : 'bg-gray-200'}`}>
                  {message.role === 'user' ? 'Y' : 'A'}
                </div>
                <div className="text-sm whitespace-pre-wrap markdown-content">
                  <ReactMarkdown components={markdownComponents}>
                    {processMarkdown(message.content)}
                  </ReactMarkdown>
                </div>
                <div className={`absolute bottom-0 ${message.role === 'user' ? '-right-2' : '-left-2'} w-4 h-4 transform rotate-45 ${message.role === 'user' ? 'bg-blue-500' : 'bg-gray-100'}`} />
              </div>
            </div>
          ))}
          {showProcessing && !isStreaming && <ProcessingCard />}
          <div ref={messagesEndRef} className="h-1" />
        </div>
        <form onSubmit={onSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="w-full px-6 py-3 bg-gray-50 rounded-full pr-16 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300 placeholder:text-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-300 transition-all duration-300 ease-in-out hover:shadow-lg disabled:hover:shadow-none"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
        {isLoading && (
          <div className="flex items-center space-x-2 mt-2 text-gray-400 text-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span>AI is typing...</span>
          </div>
        )}
      </div>
    </div>
  );
}