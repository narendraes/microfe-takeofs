import { NextResponse } from 'next/server';
import { CategoryManager } from '@/app/config/category-manager';

/**
 * Truncates a string to a specified length and adds ellipsis if needed
 */
function truncateDescription(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export async function GET() {
  try {
    const categoryManager = new CategoryManager();
    const homePageCategories = categoryManager.getHomePageCategories();
    
    // Format the response to include only the necessary data for the home page
    const formattedCategories = homePageCategories.map(({ id, content }) => ({
      id,
      href: `/tickets/${id}`,
      title: content.title,
      description: truncateDescription(content.description),
      color: content.displaySettings?.tileColor || 'blue',
      disabled: false,
      openInNewTab: false
    }));
    
    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching home page categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch home page categories' },
      { status: 500 }
    );
  }
} 