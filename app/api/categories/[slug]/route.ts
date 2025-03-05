import { NextResponse } from 'next/server';
import { CategoryManager } from '@/app/config/category-manager';
import { ProductContent } from '@/app/config/product-content-types';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  
  try {
    const categoryManager = new CategoryManager();
    const category = categoryManager.getCategoryContent(slug);
    
    if (!category) {
      return new Response(JSON.stringify({ error: 'Category not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify(category), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    return new Response(JSON.stringify({ error: 'Failed to fetch category' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  
  try {
    const categoryManager = new CategoryManager();
    
    // Validate that the category exists
    if (!categoryManager.getValidCategories().includes(slug)) {
      return new Response(JSON.stringify({ error: 'Category not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const body = await request.json();
    const success = categoryManager.saveCategoryContent(slug, body);
    
    if (!success) {
      return new Response(JSON.stringify({ error: 'Failed to update category' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Error updating category ${slug}:`, error);
    return new Response(JSON.stringify({ error: 'Failed to update category' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const { displaySettings } = body;
    
    if (!displaySettings) {
      return NextResponse.json(
        { error: 'Missing displaySettings' },
        { status: 400 }
      );
    }

    const categoryManager = new CategoryManager();
    
    // Check if category exists
    if (!categoryManager.getValidCategories().includes(params.slug)) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    const success = categoryManager.updateDisplaySettings(params.slug, displaySettings);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to update display settings' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Error updating display settings for ${params.slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to update display settings' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const categoryManager = new CategoryManager();
    
    // Check if category exists
    if (!categoryManager.getValidCategories().includes(slug)) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    const success = categoryManager.deleteCategory(slug);
    
    if (success) {
      return NextResponse.json({ success: true, message: `Category ${slug} deleted successfully` });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete category' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Error deleting category ${params.slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
} 