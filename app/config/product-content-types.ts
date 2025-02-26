/**
 * Type definitions for product content
 */

export type ProductContent = {
  title: string;
  description: string;
  sections: {
    title: string;
    content: string;
    subsections?: {
      title: string;
      items: string[];
    }[];
  }[];
  guidelines: {
    title: string;
    items: string[];
  };
  contactInfo: {
    name: string;
    role: string;
    email: string;
  };
} 