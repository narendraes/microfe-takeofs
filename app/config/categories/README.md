# Category Configuration Files

This directory contains JSON configuration files for each product category.

## File Structure

Each category is defined in a separate JSON file with the following structure:

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

## Adding a New Category

To add a new category:

1. Create a new JSON file with the category ID as the filename (e.g., `new-category.json`)
2. Follow the structure above to define the category content
3. The system will automatically detect and display the new category

## Editing Categories

Simply edit the corresponding JSON file to update a category's content.
