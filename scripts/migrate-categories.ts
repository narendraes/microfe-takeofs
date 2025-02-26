/**
 * Migration script to convert the monolithic product-content.ts file
 * into individual JSON files for each category.
 * 
 * Run with: npx ts-node scripts/migrate-categories.ts
 */

import fs from 'fs';
import path from 'path';
import { productContent } from '../app/config/product-content';

const categoriesDir = path.join(process.cwd(), 'app', 'config', 'categories');

// Ensure the categories directory exists
if (!fs.existsSync(categoriesDir)) {
  fs.mkdirSync(categoriesDir, { recursive: true });
  console.log(`Created categories directory: ${categoriesDir}`);
}

// Migrate each category to a separate JSON file
let migratedCount = 0;
Object.entries(productContent).forEach(([categoryId, content]) => {
  const filePath = path.join(categoriesDir, `${categoryId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
  migratedCount++;
  console.log(`Migrated category: ${categoryId}`);
});

console.log(`Successfully migrated ${migratedCount} categories to individual JSON files.`);
console.log(`Files are stored in: ${categoriesDir}`);

// Create a README file with instructions
const readmePath = path.join(categoriesDir, 'README.md');
const readmeContent = `# Category Configuration Files

This directory contains JSON configuration files for each product category.

## File Structure

Each category is defined in a separate JSON file with the following structure:

\`\`\`json
{
  "title": "Category Title",
  "description": "Description of the category",
  "sections": [
    {
      "title": "Section Title",
      "content": "Section content text",
      "subsections": [
        {
          "title": "Subsection Title",
          "items": [
            "Item 1",
            "Item 2",
            "Item 3"
          ]
        }
      ]
    }
  ],
  "guidelines": {
    "title": "Guidelines Title",
    "items": [
      "Guideline 1",
      "Guideline 2",
      "Guideline 3"
    ]
  },
  "contactInfo": {
    "name": "Contact Name",
    "role": "Contact Role",
    "email": "contact.email@example.com"
  }
}
\`\`\`

## Adding a New Category

To add a new category:

1. Create a new JSON file with the category ID as the filename (e.g., \`new-category.json\`)
2. Follow the structure above to define the category content
3. The system will automatically detect and display the new category

## Editing Categories

Simply edit the corresponding JSON file to update a category's content.
`;

fs.writeFileSync(readmePath, readmeContent, 'utf8');
console.log(`Created README file with instructions: ${readmePath}`); 