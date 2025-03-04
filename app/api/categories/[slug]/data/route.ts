import { NextResponse } from 'next/server';
import { CategoryManager } from '@/app/config/category-manager';

/**
 * Truncates a string to a specified length and adds ellipsis if needed
 */
function truncateDescription(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const categoryId = params.slug;
    const categoryManager = new CategoryManager();
    const categoryContent = categoryManager.getCategoryContent(categoryId);
    
    if (!categoryContent) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Format the response to include only the necessary data for the tile
    const formattedCategory = {
      id: categoryId,
      href: `/tickets/${categoryId}`,
      title: categoryContent.title,
      description: truncateDescription(categoryContent.description),
      color: categoryContent.displaySettings?.tileColor || 'blue',
      disabled: false,
      openInNewTab: false
    };
    
    return NextResponse.json(formattedCategory);
  } catch (error) {
    console.error(`Error fetching category data for ID ${params.slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch category data' },
      { status: 500 }
    );
  }
} 