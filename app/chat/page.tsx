'use client';

import React, { useEffect, useRef, useState, FormEvent } from 'react';
import { useChat } from '@ai-sdk/react';
import { Send, Loader2, Search, ExternalLink } from 'lucide-react';
import MicIcon from '../components/icons/MicIcon';
import ClipboardIcon from '../components/icons/ClipboardIcon';
import ReactMarkdown, { Components } from 'react-markdown';
import Sidebar from '../components/Sidebar';
import ChatWelcome from '../components/ChatWelcome';

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

  const LoadingSkeleton = () => (
    <div className="max-w-3xl mx-auto animate-pulse">
      <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded-md w-5/6 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded-md w-4/6 mb-6"></div>
      
      <div className="flex space-x-4 mb-6">
        <div className="h-20 bg-gray-200 rounded-md w-1/3"></div>
        <div className="h-20 bg-gray-200 rounded-md w-1/3"></div>
        <div className="h-20 bg-gray-200 rounded-md w-1/3"></div>
      </div>
      
      <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded-md w-5/6 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded-md w-4/6"></div>
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
    ),
    ul: ({ node, children }) => (
      <ul className="list-disc pl-6 mb-4">
        {children}
      </ul>
    ),
    ol: ({ node, children }) => (
      <ol className="list-decimal pl-6 mb-4">
        {children}
      </ol>
    ),
    li: ({ node, children }) => (
      <li className="mb-1">
        {children}
      </li>
    ),
    h1: ({ node, children }) => (
      <h1 className="text-xl font-bold mb-2 mt-4">
        {children}
      </h1>
    ),
    h2: ({ node, children }) => (
      <h2 className="text-lg font-bold mb-2 mt-3">
        {children}
      </h2>
    ),
    h3: ({ node, children }) => (
      <h3 className="text-md font-bold mb-2 mt-3">
        {children}
      </h3>
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

  const MessageActions = () => (
    <div className="flex space-x-2 mt-2">
      <button className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
        <ClipboardIcon size={16} />
      </button>
      <button className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
        <ExternalLink size={16} />
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar activeTab="chat" />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Chat Content */}
        <div 
          ref={messageContainerRef} 
          className="flex-1 overflow-y-auto p-6"
        >
          {messages.length === 0 ? (
            <ChatWelcome />
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div key={index} className="max-w-3xl mx-auto">
                  {message.role === 'user' ? (
                    <div className="flex items-start mb-4">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          S
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>
                        <div className="flex space-x-2 mt-1">
                          <button className="text-gray-400 hover:text-gray-600">
                            <ClipboardIcon size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start mb-4">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                          <img 
                            src="/bents-image.jpg" 
                            alt="Bent's Woodworking Assistant" 
                            className="w-8 h-8 object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown components={markdownComponents}>
                            {processMarkdown(message.content)}
                          </ReactMarkdown>
                        </div>
                        <MessageActions />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {showProcessing && !isStreaming && <LoadingSkeleton />}
              <div ref={messagesEndRef} className="h-1" />
            </div>
          )}
        </div>
        
        {/* Chat Input */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={onSubmit} className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="What do you want to know?"
                className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isLoading}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <MicIcon size={18} />
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Search size={18} />
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-2 text-blue-500 hover:text-blue-700"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </form>
          
          {/* Terms and Privacy */}
          <div className="max-w-3xl mx-auto mt-2 text-xs text-gray-500 text-center">
            By messaging, you agree to our <a href="#" className="text-gray-600 hover:underline">Terms</a> and <a href="#" className="text-gray-600 hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}
