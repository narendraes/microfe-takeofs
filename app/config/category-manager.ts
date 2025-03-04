import 'server-only';
import fs from 'fs';
import path from 'path';
import { ProductContent } from './product-content-types';

/**
 * CategoryManager provides utilities for managing product categories
 * and their configurations.
 */
export class CategoryManager {
  private categoriesDir: string;
  private archiveDir: string;
  private categoriesCache: Record<string, ProductContent> | null = null;
  
  constructor(
    categoriesDir = path.join(process.cwd(), 'app', 'config', 'categories'),
    archiveDir = path.join(process.cwd(), 'app', 'config', 'archived-categories')
  ) {
    this.categoriesDir = categoriesDir;
    this.archiveDir = archiveDir;
    
    // Ensure archive directory exists
    if (!fs.existsSync(this.archiveDir)) {
      fs.mkdirSync(this.archiveDir, { recursive: true });
    }
  }
  
  /**
   * Gets a list of all valid category IDs
   */
  public getValidCategories(): string[] {
    try {
      const categories = fs.readdirSync(this.categoriesDir)
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
      
      return categories;
    } catch (error) {
      console.error('Error reading categories directory:', error);
      return [];
    }
  }
  
  /**
   * Loads all category configurations
   */
  public getAllCategories(): Record<string, ProductContent> {
    if (this.categoriesCache) {
      return this.categoriesCache;
    }
    
    const categories: Record<string, ProductContent> = {};
    const validCategories = this.getValidCategories();
    
    for (const category of validCategories) {
      try {
        const categoryData = this.getCategoryContent(category);
        if (categoryData) {
          categories[category] = categoryData;
        }
      } catch (error) {
        console.error(`Error loading category ${category}:`, error);
      }
    }
    
    this.categoriesCache = categories;
    return categories;
  }
  
  /**
   * Gets configuration for a specific category
   */
  public getCategoryContent(categoryId: string): ProductContent | null {
    try {
      const filePath = path.join(this.categoriesDir, `${categoryId}.json`);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent) as ProductContent;
    } catch (error) {
      console.error(`Error loading category ${categoryId}:`, error);
      return null;
    }
  }
  
  /**
   * Saves configuration for a specific category
   */
  public saveCategoryContent(categoryId: string, content: ProductContent): boolean {
    try {
      const filePath = path.join(this.categoriesDir, `${categoryId}.json`);
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
      // Clear cache after saving
      this.categoriesCache = null;
      return true;
    } catch (error) {
      console.error(`Error saving category ${categoryId}:`, error);
      return false;
    }
  }
  
  /**
   * Creates a new category
   */
  public createCategory(categoryId: string, content: ProductContent): boolean {
    if (this.getValidCategories().includes(categoryId)) {
      console.error(`Category ${categoryId} already exists`);
      return false;
    }
    
    return this.saveCategoryContent(categoryId, content);
  }
  
  /**
   * Deletes a category by archiving it to the archived-categories directory
   */
  public deleteCategory(categoryId: string): boolean {
    try {
      const sourceFilePath = path.join(this.categoriesDir, `${categoryId}.json`);
      
      // Check if the file exists
      if (!fs.existsSync(sourceFilePath)) {
        console.error(`Category file ${categoryId}.json does not exist`);
        return false;
      }
      
      // Read the category content
      const categoryContent = fs.readFileSync(sourceFilePath, 'utf8');
      
      // Create a timestamped filename for the archive
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const archiveFilePath = path.join(this.archiveDir, `${categoryId}-${timestamp}.json`);
      
      // Write to archive
      fs.writeFileSync(archiveFilePath, categoryContent, 'utf8');
      
      // Delete the original file
      fs.unlinkSync(sourceFilePath);
      
      // Clear cache after deleting
      this.categoriesCache = null;
      
      console.log(`Category ${categoryId} archived to ${archiveFilePath}`);
      return true;
    } catch (error) {
      console.error(`Error archiving category ${categoryId}:`, error);
      return false;
    }
  }
  
  /**
   * Gets a category by its slug/id
   */
  public getCategoryBySlug(slug: string): ProductContent | null {
    return this.getCategoryContent(slug);
  }

  /**
   * Gets categories that should be displayed on the home page
   * sorted by their display order
   */
  public getHomePageCategories(): Array<{ id: string; content: ProductContent }> {
    const allCategories = this.getAllCategories();
    const homePageCategories = Object.entries(allCategories)
      .filter(([_, content]) => content.displaySettings?.showOnHomePage)
      .map(([id, content]) => ({ id, content }))
      .sort((a, b) => {
        const orderA = a.content.displaySettings?.displayOrder || 999;
        const orderB = b.content.displaySettings?.displayOrder || 999;
        return orderA - orderB;
      });
    
    return homePageCategories;
  }

  /**
   * Updates the display settings for a category
   */
  public updateDisplaySettings(
    categoryId: string, 
    settings: { showOnHomePage: boolean; displayOrder: number; tileColor?: string }
  ): boolean {
    const category = this.getCategoryContent(categoryId);
    if (!category) {
      return false;
    }

    category.displaySettings = settings;
    return this.saveCategoryContent(categoryId, category);
  }
} 