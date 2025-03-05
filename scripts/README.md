# Migration Scripts

This directory contains scripts for data migration and other one-time operations.

## Subsection Migration Script

The `migrate-subsections.ts` script converts subsection data into rich text content within the main content field of each section.

### Purpose

This script was created to migrate from a data structure where sections had separate subsections to a simplified structure where all content is contained within the rich text editor.

### How to Use

1. Make sure you have ts-node installed:
   ```
   npm install -g ts-node typescript
   ```

2. Run the script:
   ```
   npx ts-node scripts/migrate-subsections.ts > updated-content.ts
   ```

3. Review the generated `updated-content.ts` file to ensure the content was migrated correctly.

4. Replace the content in `app/config/product-content.ts` with the content from `updated-content.ts`.

### What the Script Does

- Reads the existing product content data
- For each section, converts any subsections into HTML format
- Appends this HTML to the main content field
- Outputs a new version of the product content without the subsections property 