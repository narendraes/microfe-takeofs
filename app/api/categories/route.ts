import { NextResponse } from 'next/server';
import { CategoryManager } from '@/app/config/category-manager';
import { ProductContent } from '@/app/config/product-content-types';

export async function GET() {
  try {
    const categoryManager = new CategoryManager();
    const categories = categoryManager.getValidCategories();
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { categoryId, content } = body;
    
    if (!categoryId || !content) {
      return NextResponse.json(
        { error: 'Missing categoryId or content' },
        { status: 400 }
      );
    }

    const categoryManager = new CategoryManager();
    
    // Check if category already exists
    if (categoryManager.getValidCategories().includes(categoryId)) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 409 }
      );
    }
    
    const success = categoryManager.createCategory(categoryId, content as ProductContent);
    
    if (success) {
      return NextResponse.json({ success: true, categoryId });
    } else {
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
} 