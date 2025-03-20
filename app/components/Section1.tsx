'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ToolRecommendationLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 5L21 3V19L14 21V5Z" fill="#4A5568" stroke="#2D3748" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 5L10 3V19L3 21V5Z" fill="#4A5568" stroke="#2D3748" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 12H21" stroke="#2D3748" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="9" r="1" fill="#2D3748" />
    <circle cx="17" cy="15" r="1" fill="#2D3748" />
  </svg>
);

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="bg-gray-100 p-6 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-transparent hover:border-blue-200 group">
    <div className="text-black mb-4 transform group-hover:scale-110 group-hover:text-blue-600 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-black text-xl font-semibold mb-2 group-hover:text-blue-700 transition-colors duration-300">
      {title}
    </h3>
    <p className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
      {description}
    </p>
  </div>
);

const Section1 = () => {
  const buttonClasses = cn(
    "inline-block bg-[rgba(23,155,215,255)] text-black font-semibold",
    "py-3 px-6 w-full sm:w-48 rounded-lg",
    "hover:bg-[rgba(20,139,193,255)] active:bg-[rgba(18,125,174,255)]",
    "transform transition-all duration-300",
    "hover:scale-105 active:scale-95",
    "hover:shadow-lg",
    "focus:outline-none focus:ring-2 focus:ring-blue-400"
  );

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-black text-white">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center min-h-[calc(50vh-4rem)]">
          <h1 className="text-[rgba(23,155,215,255)] text-3xl md:text-4xl lg:text-4xl font-bold mb-6">
            <div className="flex flex-col sm:block">
              <span>Welcome to</span>
              <span className="sm:ml-2">Bent's Woodworking Assistant</span>
            </div>
          </h1>
          <p className="text-white text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl">
            Your AI-powered companion for all things woodworking. Get expert advice, tool recommendations, and shop improvement tips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/chat" className={buttonClasses}>
              Start Chatting
            </Link>
            <Link href="/shop" className={cn(buttonClasses, "bg-black text-white border-2 border-white hover:bg-white hover:text-black")}>
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-black text-3xl md:text-4xl font-bold mb-12 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<MessageSquare size={40} />}
              title="Expert Advice"
              description="Get instant answers to your woodworking questions from our AI assistant."
            />
            <FeatureCard 
              icon={<ToolRecommendationLogo className="w-10 h-10" />}
              title="Tool Recommendations"
              description="Discover the best tools for your projects with personalized suggestions."
            />
            <FeatureCard 
              icon={<LayoutDashboard size={40} />}
              title="Shop Improvement"
              description="Learn how to optimize your workspace for better efficiency and safety."
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-200 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0">
              <h2 className="text-black text-3xl md:text-4xl font-bold mb-6">
                About Bent's Woodworking Assistant
              </h2>
              <p className="text-black text-lg leading-relaxed">
                Bent's Woodworking Assistant is an AI-powered tool designed to help woodworkers of all skill levels. Whether you're a beginner looking for guidance or an experienced craftsman seeking to optimize your workflow, our assistant is here to help.
              </p>
              <p className="text-black text-lg leading-relaxed mt-4">
                With a vast knowledge base covering techniques, tools, and shop management, we're your go-to resource for all things woodworking.
              </p>
            </div>
            <div className="lg:w-1/2">
              <Image
                src="/bents-image.jpg"
                alt="Woodworking Workshop"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Section1;
