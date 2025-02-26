import { NextResponse } from 'next/server';
import { CategoryManager } from '@/app/config/category-manager';
import { ProductContent } from '@/app/config/product-content-types';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const categoryManager = new CategoryManager();
    const category = categoryManager.getCategoryContent(params.slug);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error(`Error fetching category ${params.slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const categoryManager = new CategoryManager();
    
    // Check if category exists
    if (!categoryManager.getValidCategories().includes(params.slug)) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    const success = categoryManager.saveCategoryContent(params.slug, body);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to update category' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Error updating category ${params.slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
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