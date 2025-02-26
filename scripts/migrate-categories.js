/**
 * Migration script to convert the monolithic product-content.ts file
 * into individual JSON files for each category.
 * 
 * Run with: node scripts/migrate-categories.js
 */

const fs = require('fs');
const path = require('path');

// Import the product content from the TS file
// Note: This is a workaround - in a real application, you might want to use a more robust approach
const productContentPath = path.join(__dirname, '../app/config/product-content.ts');
const productContentText = fs.readFileSync(productContentPath, 'utf8');

// Extract the product content object using regex
const productContentMatch = productContentText.match(/export const productContent: Record<string, ProductContent> = ({[\s\S]*})\s*$/m);
if (!productContentMatch) {
  console.error('Could not extract product content from file');
  process.exit(1);
}

// Convert the extracted text to a JavaScript object
// WARNING: This uses eval which is generally not recommended for security reasons
// In a production environment, use a more secure approach like a proper TypeScript transpiler
let productContent;
try {
  // Replace TypeScript types with empty objects to make it valid JavaScript
  const jsText = productContentMatch[1].replace(/: ProductContent/g, '');
  productContent = eval(`(${jsText})`);
} catch (error) {
  console.error('Failed to parse product content:', error);
  process.exit(1);
}

const categoriesDir = path.join(__dirname, '../app/config/categories');

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