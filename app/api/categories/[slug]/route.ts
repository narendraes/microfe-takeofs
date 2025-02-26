import { NextResponse } from 'next/server';
import { CategoryManager } from '@/app/config/category-manager';
import { ProductContent } from '@/app/config/product-content-types';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const categoryManager = new CategoryManager();
    const category = categoryManager.getCategoryBySlug(slug);
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error(`Error fetching category ${params.slug}:`, error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();
    const content = body as ProductContent;
    
    if (!content) {
      return NextResponse.json(
        { error: 'Missing content' },
        { status: 400 }
      );
    }

    const categoryManager = new CategoryManager();
    
    // Check if category exists
    if (!categoryManager.getValidCategories().includes(slug)) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    const success = categoryManager.saveCategoryContent(slug, content);
    
    if (success) {
      return NextResponse.json({ success: true, categoryId: slug });
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