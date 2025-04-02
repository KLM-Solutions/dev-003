'use client';

import React, { useState } from 'react';
import { Send, Loader2, Search, ExternalLink } from 'lucide-react';
import MicIcon from '@/app/components/icons/MicIcon';
import ClipboardIcon from '@/app/components/icons/ClipboardIcon';
import ReactMarkdown from 'react-markdown';
import Sidebar from '@/app/components/Sidebar';
import ChatWelcome from '@/app/components/ChatWelcome';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      createdAt: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `### 1. **Woodworking Joints**

- There are several effective ways to join two pieces of wood, with the best method depending on your specific project requirements, the type of wood, and the desired strength and appearance of the joint. Common joinery methods include butt joints with screws or nails for simple projects, dowel joints for alignment and strength, and mortise and tenon joints for traditional furniture making.
        
- For beginners, pocket hole joinery is highly recommended as it creates strong joints with minimal specialized tools. This technique involves drilling angled holes into one piece of wood and then joining it to another piece with screws, creating a clean appearance from the visible side.

- More advanced woodworkers often prefer dovetail joints for drawers and boxes due to their exceptional strength and distinctive appearance. These joints interlock the wood pieces and rely primarily on the mechanical connection rather than glue for strength.

### 2. **Factors to Consider When Choosing a Joint**

- The intended use of your project should guide your joint selection. For items that will bear weight or experience stress, stronger joints like mortise and tenon or dovetails are preferable, while decorative pieces might use simpler joints like miters with splines.

- Consider the tools you have available and your skill level. Some joints require specialized equipment and practice to execute properly, while others can be made with basic tools and are more forgiving for beginners.

- The wood species also matters when selecting a joint. Hardwoods generally hold fasteners better and create stronger glue bonds than softwoods, which might influence your joinery choice for different materials.

### **Related Products**

- [Kreg Pocket Hole Jig 720PRO](https://www.kregtool.com/shop/pocket-hole-joinery/pocket-hole-jigs/720pro-pocket-hole-jig/KPHJ720PRO.html)
- [WoodRiver Dovetail Jig](https://www.woodcraft.com/products/woodriver-dovetail-jig)
- [Titebond III Ultimate Wood Glue](https://www.titebond.com/product/wood-glues/4c0ca5e5-ecfb-4a2e-a5d1-cf8a9d18488d)
- [DEWALT 20V MAX XR Drill/Driver Kit](https://www.dewalt.com/product/dcd791d2/20v-max-xr-brushless-compact-drilldriver-kit)`,
        createdAt: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar activeTab="chat" />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto p-6">
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
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <img 
                            src="/bents-logo.jpg" 
                            alt="Bent's Assistant" 
                            className="w-6 h-6 rounded-full"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <button className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                            <ClipboardIcon size={16} />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                            <ExternalLink size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="animate-pulse max-w-3xl mx-auto">
                  <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-5/6 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-4/6 mb-6"></div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Chat Input */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
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
                  type="button"
                  disabled={isLoading}
                  className="p-2 text-blue-500 hover:text-blue-700"
                  onClick={handleSendMessage}
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
