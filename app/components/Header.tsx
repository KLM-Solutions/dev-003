'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import Image from 'next/image';

const Header = () => {
  const pathname = usePathname();
  
  const navLinkClasses = "text-gray-700 hover:text-blue-600 font-medium";
  const activeNavLinkClasses = "text-blue-600 font-medium";

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="w-full px-4 sm:px-12">
        <div className="flex items-center justify-between h-16">
          <div>
            <Link href="/">
              <Image
                src="/bents-logo.jpg"
                alt="Bent's Woodworking"
                width={40}
                height={40}
                priority
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={cn(
                navLinkClasses,
                pathname === '/' && activeNavLinkClasses
              )}
            >
              HOME
            </Link>
            <Link 
              href="/about" 
              className={cn(
                navLinkClasses,
                pathname === '/about' && activeNavLinkClasses
              )}
            >
              ABOUT
            </Link>
            <Link 
              href="/contact" 
              className={cn(
                navLinkClasses,
                pathname === '/contact' && activeNavLinkClasses
              )}
            >
              CONTACT
            </Link>
            <Link 
              href="/get-started" 
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              GET STARTED
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
