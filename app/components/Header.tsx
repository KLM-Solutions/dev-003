'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, MessageCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import Image from 'next/image';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 bg-black z-50">
      <div className="w-full px-4 sm:px-12">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <div>
              <button 
                onClick={() => {}} 
                className="bg-[rgba(23,155,215,255)] text-white px-4 py-2 rounded-md hover:bg-[rgba(20,139,193,255)]"
              >
                Sign In
              </button>
            </div>

            <Link href="/">
              <Image
                src="/bents-logo.jpg"
                alt="Bent's Woodworking"
                width={150}
                height={50}
                priority
                className="h-12 w-auto"
              />
            </Link>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-6">
            <Link 
              href="/chat" 
              className={cn(
                "text-white hover:text-[rgba(23,155,215,255)]",
                pathname === '/chat' && "text-[rgba(23,155,215,255)]"
              )}
            >
              <MessageCircle className="w-7 h-7 sm:w-6 sm:h-6" />
            </Link>

            <Link 
              href="/shop" 
              className={cn(
                "text-white hover:text-[rgba(23,155,215,255)]",
                pathname === '/shop' && "text-[rgba(23,155,215,255)]"
              )}
            >
              <ShoppingBag className="w-7 h-7 sm:w-6 sm:h-6" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;