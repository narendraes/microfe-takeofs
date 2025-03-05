/**
 * Type definitions for product content
 */

export type ProductContent = {
  title: string;
  description: string;
  sections: {
    title: string;
    content: string;
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
  displaySettings?: {
    showOnHomePage: boolean;
    displayOrder: number;
    tileColor?: string;
  };
  submitButton?: {
    text: string;
    url: string;
  };
} 