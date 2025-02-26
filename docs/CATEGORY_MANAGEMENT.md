# Category Management System

This documentation explains how to manage categories in the product platform.

## Overview

The category management system has been redesigned to make it easier to:

1. Add new categories
2. Edit existing categories
3. Maintain category content separately from application code
4. Automatically detect new categories without code changes
5. Configure home page display settings for categories
6. Customize "Submit New Idea" buttons for each category

## How It Works

Categories are now stored as individual JSON files in the `app/config/categories` directory. The system automatically scans this directory to find and load categories.

### Key Components

- **JSON Files**: Each category is defined in a separate JSON file (e.g., `bank.json`, `mobile-apps.json`)
- **CategoryManager**: A utility class that handles loading and managing categories
- **Admin Interface**: A simple admin page for viewing and managing categories

## Admin Authentication

The admin interface is protected by a simple authentication mechanism:

1. All admin routes are protected by the middleware in `middleware.ts`
2. To access any admin page, append `?admin=true` to the URL
3. Example: `http://localhost:3001/admin/categories?admin=true`

> **Note**: This is a simplified authentication mechanism for demonstration purposes. In a production environment, you should implement proper authentication with user accounts, sessions, and secure login.

### Admin Routes

The following admin routes are available:

- `/admin/categories?admin=true` - List and manage all categories
- `/admin/categories/[categoryId]?admin=true` - Edit a specific category
- `/admin/categories/new?admin=true` - Create a new category

If you attempt to access these routes without the `?admin=true` parameter, you will be redirected to the home page with an error message.

## Adding a New Category

To add a new category:

1. Navigate to `/admin/categories?admin=true`
2. Click the "Create New Category" button
3. Fill in the required fields:
   - Category ID (lowercase, no spaces, use hyphens)
   - Title and description
   - Sections, guidelines, and contact information
   - Home page display settings
   - Custom submit button text and URL

Alternatively, you can create a new JSON file in the `app/config/categories` directory manually.

## Category JSON Structure

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
  },
  "displaySettings": {
    "showOnHomePage": true,
    "displayOrder": 1,
    "tileColor": "blue"
  },
  "submitButton": {
    "text": "Submit New Idea",
    "url": "https://example.com/submit"
  }
}
```

## Home Page Display Settings

Each category can be configured to appear on the home page with the following settings:

1. **Show on Home Page**: Toggle to show/hide the category on the home page
2. **Display Order**: Set the order in which the category appears (lower numbers appear first)
3. **Tile Color**: Choose a color for the category tile (blue, green, red, yellow, purple, gray, indigo, teal)

These settings can be managed through the admin interface at `/admin/categories?admin=true`.

## Custom Submit Buttons

Each category can have a custom "Submit New Idea" button with:

1. **Custom Text**: Change the button text from the default "Submit New Idea"
2. **Custom URL**: Set a specific URL for the button to link to

This allows different categories to direct users to different submission forms or tools.

## Editing Categories

To edit an existing category:

1. Navigate to `/admin/categories?admin=true`
2. Find the category you want to edit and click "View/Edit"
3. Make your changes and click "Save Changes"

Changes will be reflected immediately when the page is refreshed.

## API Endpoints

The following API endpoints are available for managing categories:

- `GET /api/categories` - Get a list of all category IDs
- `GET /api/categories/[slug]` - Get details for a specific category
- `PUT /api/categories/[slug]` - Update a category
- `PATCH /api/categories/[slug]` - Update display settings for a category
- `DELETE /api/categories/[slug]` - Delete a category
- `POST /api/categories` - Create a new category
- `GET /api/categories/home` - Get categories configured for the home page

## Migration

The original category definitions from the monolithic file have been migrated to individual JSON files. If you need to run the migration again, use:

```bash
npm run migrate-categories
```

## Technical Details

- The `CategoryManager` class in `app/config/category-manager.ts` handles loading categories from the filesystem
- The category page dynamically loads content based on the URL parameter
- The system uses Next.js's file-based routing system
- The middleware in `middleware.ts` protects admin routes

## Troubleshooting

If a category is not appearing:

1. Check that the JSON file is correctly formatted
2. Verify the file is in the correct location
3. Check for any errors in the server logs
4. Ensure display settings are correctly configured if it should appear on the home page

## Future Improvements

Planned improvements include:

1. Proper authentication with user accounts and secure login
2. Category preview mode
3. Version history for category changes
4. Support for Markdown content
5. Image management for category content
6. Advanced analytics for category usage 