// app/api/shop/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Types
interface Product {
  id: string;
  title: string;
  tags: string;
  link: string;
  image_data: Buffer | null;
}

interface ProcessedProduct extends Omit<Product, 'tags' | 'image_data'> {
  tags: string[];
  groupTags: string[];
  image_data: string | null;
}

// Database configuration with connection pooling
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  maxUses: 7500
});

// Process product data
const processProduct = (product: Product): ProcessedProduct => ({
  ...product,
  image_data: product.image_data?.toString('base64') ?? null,
  tags: product.tags.split(',').map(tag => tag.trim()),
  groupTags: product.tags.split(',').map(tag => tag.trim()).slice(0, -1)
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sortOption = searchParams.get('sort') || 'default';
    
    const query = `
      SELECT id, title, tags, link, image_data 
      FROM products
      ${sortOption === 'video' ? 'ORDER BY tags' : ''}
    `;
    
    const { rows } = await pool.query<Product>(query);
    const products = rows.map(processProduct);

    if (sortOption === 'video') {
      const groupedProducts = products.reduce((acc, product) => {
        product.groupTags.forEach(tag => {
          acc[tag] = acc[tag] || [];
          acc[tag].push(product);
        });
        return acc;
      }, {} as Record<string, ProcessedProduct[]>);
      
      return NextResponse.json({ groupedProducts, sortOption });
    }

    return NextResponse.json({ products, sortOption });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        message: 'Server error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}