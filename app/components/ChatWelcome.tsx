import React from 'react';
import Image from 'next/image';

const ChatWelcome = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="mb-6">
        <Image 
          src="/bents-image.jpg" 
          alt="Woodworking Illustration" 
          width={300} 
          height={300}
          className="max-w-full h-auto object-cover"
        />
      </div>
      <h1 className="text-2xl font-semibold mb-2">
        Welcome to <span className="text-blue-500">Bent's Woodworking Assistant!</span>
      </h1>
      <p className="text-gray-600 max-w-md">
        Your AI-powered woodworking companion. Ask me anything about tools, techniques, or project ideas—I'm here to help!
      </p>
    </div>
  );
};

export default ChatWelcome;
