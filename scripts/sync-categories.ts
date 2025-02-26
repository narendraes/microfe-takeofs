/**
 * Script to sync JSON category content from production to GitHub
 * 
 * This script:
 * 1. Fetches the updated categories from production
 * 2. Updates local JSON files
 * 3. Commits the changes to GitHub
 * 
 * Run with: npx ts-node scripts/sync-categories.ts
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import https from 'https';
import { ProductContent } from '../app/config/product-content-types';

// Configuration
const PRODUCTION_API_URL = process.env.PRODUCTION_API_URL || 'https://your-production-api.com/api/categories';
const PRODUCTION_API_KEY = process.env.PRODUCTION_API_KEY; // Should be set as an environment variable
const CATEGORIES_DIR = path.join(process.cwd(), 'app', 'config', 'categories');

// Ensure the categories directory exists
if (!fs.existsSync(CATEGORIES_DIR)) {
  fs.mkdirSync(CATEGORIES_DIR, { recursive: true });
  console.log(`Created categories directory: ${CATEGORIES_DIR}`);
}

/**
 * Fetch categories from production API
 */
async function fetchCategoriesFromProduction(): Promise<Record<string, ProductContent>> {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Authorization': `Bearer ${PRODUCTION_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    console.log(`Fetching categories from production: ${PRODUCTION_API_URL}`);
    
    const req = https.get(PRODUCTION_API_URL, options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`API request failed with status code ${res.statusCode}`));
        return;
      }

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const categories = JSON.parse(data) as Record<string, ProductContent>;
          console.log(`Successfully fetched ${Object.keys(categories).length} categories from production`);
          resolve(categories);
        } catch (error) {
          reject(new Error(`Failed to parse API response: ${(error as Error).message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`API request error: ${error.message}`));
    });

    req.end();
  });
}

/**
 * Update local JSON files with fetched categories
 */
function updateLocalCategories(categories: Record<string, ProductContent>): { updatedCount: number; newCount: number } {
  let updatedCount = 0;
  let newCount = 0;

  Object.entries(categories).forEach(([categoryId, content]) => {
    const filePath = path.join(CATEGORIES_DIR, `${categoryId}.json`);
    const exists = fs.existsSync(filePath);
    
    // Format JSON with 2 spaces indentation
    const formattedContent = JSON.stringify(content, null, 2);
    
    // Write the file
    fs.writeFileSync(filePath, formattedContent, 'utf8');
    
    if (exists) {
      updatedCount++;
      console.log(`Updated category: ${categoryId}`);
    } else {
      newCount++;
      console.log(`Created new category: ${categoryId}`);
    }
  });

  console.log(`\nSummary: Updated ${updatedCount} categories, created ${newCount} new categories`);
  return { updatedCount, newCount };
}

/**
 * Commit changes to GitHub
 */
function commitChangesToGit(): boolean {
  try {
    // Check if there are changes to commit
    const status = execSync('git status --porcelain').toString();
    
    if (!status.trim()) {
      console.log('No changes to commit');
      return false;
    }
    
    // Add all changes in the categories directory
    execSync(`git add ${CATEGORIES_DIR}`);
    console.log('Added changes to git staging area');
    
    // Create a commit with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    execSync(`git commit -m "feat(categories): sync categories from production ${timestamp}"`);
    console.log('Committed changes to local repository');
    
    // Push changes to remote repository
    execSync('git push');
    console.log('Pushed changes to remote repository');
    
    return true;
  } catch (error) {
    console.error('Error committing changes to git:', (error as Error).message);
    return false;
  }
}

/**
 * Main function to run the sync process
 */
async function syncCategories(): Promise<void> {
  try {
    // Check if API key is set
    if (!PRODUCTION_API_KEY) {
      throw new Error('PRODUCTION_API_KEY environment variable is not set');
    }
    
    console.log('Starting category sync process...');
    
    // Fetch categories from production
    const categories = await fetchCategoriesFromProduction();
    
    // Update local JSON files
    const { updatedCount, newCount } = updateLocalCategories(categories);
    
    // Commit and push changes if any updates were made
    if (updatedCount > 0 || newCount > 0) {
      const committed = commitChangesToGit();
      if (committed) {
        console.log('\nSuccessfully synced categories from production to GitHub');
      }
    } else {
      console.log('\nNo changes to commit');
    }
  } catch (error) {
    console.error(`\nError syncing categories: ${(error as Error).message}`);
    process.exit(1);
  }
}

// Run the sync process
syncCategories(); 