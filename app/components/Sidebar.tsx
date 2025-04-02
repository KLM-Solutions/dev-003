'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import ClockIcon from './icons/ClockIcon';
import SettingsIcon from './icons/SettingsIcon';
import HelpCircleIcon from './icons/HelpCircleIcon';

interface SidebarProps {
  activeTab?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'chat' }) => {
  return (
    <div className="w-[160px] bg-white h-screen flex flex-col border-r border-gray-200">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <Link href="/">
          <Image
            src="/bents-logo.jpg"
            alt="Bent's Woodworking"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 py-4">
        <Link 
          href="/chat"
          className={`flex items-center px-4 py-2 mb-1 text-sm ${activeTab === 'chat' ? 'bg-gray-100 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
        >
          <MessageCircle size={16} className="mr-3" />
          <span>New Chat</span>
        </Link>
        
        <Link 
          href="/products"
          className={`flex items-center px-4 py-2 mb-1 text-sm ${activeTab === 'products' ? 'bg-gray-100 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
        >
          <ShoppingBag size={16} className="mr-3" />
          <span>Products</span>
        </Link>
        
        <Link 
          href="/history"
          className={`flex items-center px-4 py-2 mb-1 text-sm ${activeTab === 'history' ? 'bg-gray-100 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
        >
          <ClockIcon size={16} className="mr-3" />
          <span>History</span>
        </Link>
        
        <Link 
          href="/settings"
          className={`flex items-center px-4 py-2 mb-1 text-sm ${activeTab === 'settings' ? 'bg-gray-100 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
        >
          <SettingsIcon size={16} className="mr-3" />
          <span>Settings</span>
        </Link>
        
        <Link 
          href="/help"
          className={`flex items-center px-4 py-2 mb-1 text-sm ${activeTab === 'help' ? 'bg-gray-100 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
        >
          <HelpCircleIcon size={16} className="mr-3" />
          <span>Help & support</span>
        </Link>
      </div>
      
      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-2">
            S
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-medium text-gray-900 truncate">Smith Jones</p>
            <p className="text-xs text-gray-500 truncate">smithjones22@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
