// app/shop/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, ExternalLink, Search } from 'lucide-react';

// Types
interface Product {
  id: string;
  title: string;
  link: string;
  image_data?: string;
  groupTags: string[];
}

interface GroupedProducts {
  [key: string]: Product[];
}

interface ApiResponse {
  products?: Product[];
  groupedProducts?: GroupedProducts;
  sortOption: string;
  error?: string;
}

// ProductCard Component - Memoized to prevent unnecessary re-renders
const ProductCard = React.memo(({ product }: { product: Product }) => {
  const imageUrl = product.image_data
    ? `data:image/jpeg;base64,${product.image_data}`
    : '/default-image.jpg';

  return (
    <Card className="w-full flex flex-col h-full bg-white rounded-lg border border-gray-300">
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="w-full h-48 relative mb-4">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
            priority={false}
          />
        </div>
        <h3 className="font-semibold text-lg text-center">{product.title}</h3>
      </CardContent>
      <CardFooter className="p-4 flex justify-center">
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-500 hover:text-blue-600 text-sm font-medium"
        >
          View Product <ExternalLink size={12} className="ml-1" />
        </a>
      </CardFooter>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

// Main Page Component
export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/shop?sort=${sortOption}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();

        if (data.sortOption === 'video' && data.groupedProducts) {
          setGroupedProducts(data.groupedProducts);
          setProducts([]);
        } else if (data.products) {
          setProducts(data.products);
          setGroupedProducts({});
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sortOption]);

  const filterProducts = (productsToFilter: Product[]) => {
    const searchLower = searchTerm.toLowerCase();
    return productsToFilter.filter(product =>
      product.title.toLowerCase().includes(searchLower) ||
      product.groupTags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  };

  if (error) {
    return (
      <div className="text-center mt-8 text-red-500" role="alert">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-4 max-w-7xl mt-16 md:mt-24">
      <header className="mb-8">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-6">
          Recommended Products
        </h1>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-full sm:w-[200px] bg-white">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Sort by</SelectItem>
              <SelectItem value="video">Sort by Video Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <main>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : sortOption === 'video' ? (
          Object.entries(groupedProducts).map(([tag, tagProducts]) => (
            <div key={tag} className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{tag}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filterProducts(tagProducts).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filterProducts(products).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        {!loading && filterProducts(products).length === 0 && 
         Object.keys(groupedProducts).length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No products found matching your search.
          </p>
        )}
      </main>
    </div>
  );
}