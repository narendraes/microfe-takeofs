import { NextResponse } from 'next/server';
import { CategoryManager } from '@/app/config/category-manager';

export async function GET() {
  try {
    const categoryManager = new CategoryManager();
    const homePageCategories = categoryManager.getHomePageCategories();
    
    // Format the response to include only the necessary data for the home page
    const formattedCategories = homePageCategories.map(({ id, content }) => ({
      id,
      title: content.title,
      href: `/tickets/${id}`,
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