/**
 * One-time script to migrate subsection content into the rich text editor content
 * 
 * This script reads the product content data and merges subsection content into
 * the main content field for each section, then outputs the updated content.
 * 
 * Run with: npx ts-node scripts/migrate-subsections.ts > updated-content.ts
 */

import { productContent } from '../app/config/product-content';

// Function to convert subsection data to HTML
function subsectionsToHtml(subsections: any[] | undefined): string {
  if (!subsections || subsections.length === 0) return '';
  
  let html = '';
  
  subsections.forEach(subsection => {
    html += `<h3>${subsection.title}</h3>\n<ul>`;
    subsection.items.forEach((item: string) => {
      html += `\n  <li>${item}</li>`;
    });
    html += '\n</ul>\n';
  });
  
  return html;
}

// Process each product content entry
const updatedContent: any = {};

Object.entries(productContent).forEach(([key, content]: [string, any]) => {
  const updatedSections = content.sections.map((section: any) => {
    // Merge subsection content into the main content
    const subsectionHtml = subsectionsToHtml(section.subsections);
    const updatedContent = section.content + (subsectionHtml ? '\n\n' + subsectionHtml : '');
    
    // Return the updated section without subsections
    return {
      title: section.title,
      content: updatedContent
    };
  });
  
  // Create updated content entry
  updatedContent[key] = {
    ...content,
    sections: updatedSections
  };
});

// Output the updated content in a format that can be copied to product-content.ts
console.log('export const productContent = ' + JSON.stringify(updatedContent, null, 2) + ';'); 