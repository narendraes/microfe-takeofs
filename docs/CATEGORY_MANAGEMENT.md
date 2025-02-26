# Category Management System

This documentation explains how to manage categories in the product platform.

## Overview

The category management system has been redesigned to make it easier to:

1. Add new categories
2. Edit existing categories
3. Maintain category content separately from application code
4. Automatically detect new categories without code changes

## How It Works

Categories are now stored as individual JSON files in the `app/config/categories` directory. The system automatically scans this directory to find and load categories.

### Key Components

- **JSON Files**: Each category is defined in a separate JSON file (e.g., `bank.json`, `mobile-apps.json`)
- **CategoryManager**: A utility class that handles loading and managing categories
- **Admin Interface**: A simple admin page for viewing and managing categories

## Adding a New Category

To add a new category:

1. Create a new JSON file in the `app/config/categories` directory
2. Name the file with the category ID (e.g., `new-category.json`)
3. Follow the standard category JSON structure (see template below)
4. The system will automatically detect and display the new category

No code changes are required! The category will be automatically available at `/tickets/new-category`.

### Category JSON Template

```json
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
```

## Editing Categories

To edit an existing category, simply modify the corresponding JSON file. The changes will be reflected immediately when the page is refreshed.

## Admin Interface

An admin interface is available for managing categories:

- URL: `/admin/categories?admin=true`
- Features:
  - View all categories
  - Access links to edit individual categories
  - Preview category pages

## Migration

The original category definitions from the monolithic file have been migrated to individual JSON files. If you need to run the migration again, use:

```bash
npm run migrate-categories
```

## Technical Details

- The `CategoryManager` class in `app/config/category-manager.ts` handles loading categories from the filesystem
- The category page dynamically loads content based on the URL parameter
- The system uses Next.js's file-based routing system

## Troubleshooting

If a category is not appearing:

1. Check that the JSON file is correctly formatted
2. Verify the file is in the correct location
3. Check for any errors in the server logs

## Future Improvements

Planned improvements include:

1. Full CRUD operations in the admin interface
2. Category preview mode
3. Version history for category changes
4. Support for Markdown content
5. Image management for category content 