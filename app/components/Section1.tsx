'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare, Search, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-center">
    <div className="text-blue-500 mb-4 flex justify-center">
      {icon}
    </div>
    <h3 className="text-black text-xl font-semibold mb-2">
      {title}
    </h3>
    <p className="text-gray-600 text-sm">
      {description}
    </p>
  </div>
);

const Section1 = () => {
  const primaryButtonClasses = "inline-block bg-blue-500 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors";
  const secondaryButtonClasses = "inline-block bg-white text-black font-medium py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors";

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-[#f8f0ff] py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl font-bold mb-4">
                <span className="text-gray-800">Welcome to Bent's</span>
                <br />
                <span className="text-blue-500">Woodworking</span> Assistant
              </h1>
              <p className="text-gray-600 mb-8 max-w-lg">
                Your AI-powered companion for all things woodworking. Get expert advice, tool recommendations, and shop improvement tips.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/chat" className={primaryButtonClasses}>
                  Talk to AI Chat
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <Image
                src="/bents-new-1.png"
                alt="Woodworking Illustration"
                width={350}
                height={350}
                priority
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-12 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<MessageSquare size={32} />}
              title="Expert Advice"
              description="Get expert answers to your woodworking questions that are AI-accurate."
            />
            <FeatureCard 
              icon={<Search size={32} />}
              title="Tool Recommendations"
              description="Discover the best tools for your projects with personalized suggestions."
            />
            <FeatureCard 
              icon={<LayoutDashboard size={32} />}
              title="Shop Improvement"
              description="Learn how to optimize your workspace for better efficiency and safety."
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
              <h2 className="text-2xl font-bold mb-6">
                About Bent's<br />Woodworking Assistant
              </h2>
              <p className="text-gray-600 mb-4">
                Bent's Woodworking Assistant is an AI-powered tool designed to help woodworkers of all skill levels. Whether you're a beginner looking for guidance or an experienced craftsman seeking to optimize your workflow, our assistant is here to help.
              </p>
              <p className="text-gray-600">
                With a vast knowledge base covering techniques, tools, and shop management, we're your go-to resource for all things woodworking.
              </p>
            </div>
            <div className="md:w-1/2">
              <Image
                src="/bents-image.jpg"
                alt="Woodworking Workshop"
                width={600}
                height={400}
                className="rounded-lg shadow-md"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-[#f8f0ff] py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <form className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-6">How can we help you?</h3>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm text-gray-600 mb-1">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Your name"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm text-gray-600 mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Your email address"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm text-gray-600 mb-1">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Your subject"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm text-gray-600 mb-1">Your Message</label>
                  <textarea 
                    id="message" 
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter your message"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <h3 className="text-2xl font-bold mb-6">How can we help you?</h3>
              <p className="text-gray-600 mb-6">
                Have a question or project in mind? Need a support? Drop us a line and our team will get back to you promptly.
              </p>
              <div className="flex items-center mb-4">
                <div className="mr-4 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <a href="mailto:help@bentswoodworks.com" className="text-blue-500 hover:underline">help@bentswoodworks.com</a>
              </div>
              <div className="flex items-center mb-4">
                <div className="mr-4 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <span className="text-gray-600">+1 (123) 456-7890</span>
              </div>
              <div className="flex items-center">
                <div className="mr-4 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-600">123 Street, NY, USA</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Section1;
