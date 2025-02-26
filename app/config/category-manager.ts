import fs from 'fs';
import path from 'path';
import { ProductContent } from './product-content-types';

/**
 * CategoryManager provides utilities for managing product categories
 * and their configurations.
 */
export class CategoryManager {
  private categoriesDir: string;
  private categoriesCache: Record<string, ProductContent> | null = null;
  
  constructor(categoriesDir = path.join(process.cwd(), 'app', 'config', 'categories')) {
    this.categoriesDir = categoriesDir;
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
   * Deletes a category
   */
  public deleteCategory(categoryId: string): boolean {
    try {
      const filePath = path.join(this.categoriesDir, `${categoryId}.json`);
      fs.unlinkSync(filePath);
      // Clear cache after deleting
      this.categoriesCache = null;
      return true;
    } catch (error) {
      console.error(`Error deleting category ${categoryId}:`, error);
      return false;
    }
  }
} 