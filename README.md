# Product Feedback Portal

A Next.js application for collecting and managing product feedback across different categories.

## Overview

This application provides a platform for users to:

- Browse different product categories
- View detailed information about each product area
- Submit feedback and ideas for specific product categories
- Contact product owners directly

For administrators, the system offers:
- A comprehensive admin interface for managing categories
- Tools to customize how categories appear on the home page
- Ability to configure custom submission buttons for each category

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/product-feedback-portal.git
cd product-feedback-portal
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Admin Access

The admin interface is protected by a simple authentication mechanism:

1. To access any admin page, append `?admin=true` to the URL
2. Example: `http://localhost:3000/admin/categories?admin=true`

Available admin routes:
- `/admin/categories?admin=true` - List and manage all categories
- `/admin/categories/[categoryId]?admin=true` - Edit a specific category
- `/admin/categories/new?admin=true` - Create a new category

> **Note**: This is a simplified authentication mechanism for demonstration purposes. In a production environment, you should implement proper authentication with user accounts, sessions, and secure login.

## Key Features

### Dynamic Category Management

- Categories are stored as individual JSON files
- New categories can be added without code changes
- Each category has its own dedicated page

### Home Page Configuration

- Control which categories appear on the home page
- Set display order for categories
- Choose custom colors for category tiles

### Custom Submission Buttons

- Each category can have a custom "Submit New Idea" button
- Customize button text and destination URL
- Direct users to different submission forms based on category

### Responsive Design

- Works on desktop, tablet, and mobile devices
- Dark mode support
- Accessible UI components

## Project Structure

The project is organized as follows:

```
├── app/                   # Next.js 13+ app directory
│   ├── admin/             # Admin interface pages
│   ├── api/               # API routes
│   ├── config/            # Configuration files
│   │   ├── categories/    # Category JSON files
│   │   └── category-manager.ts # Category management utility
│   ├── idea-contributor-access/ # Idea contributor guide
│   ├── tickets/           # Category pages
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
├── middleware.ts          # Authentication middleware
├── public/                # Static assets
└── docs/                  # Documentation
    └── CATEGORY_MANAGEMENT.md # Detailed category management docs
```

## Documentation

For more detailed information about the category management system, see [CATEGORY_MANAGEMENT.md](docs/CATEGORY_MANAGEMENT.md).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat(component): add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# OFS - Micro Frontend Application

This project is a micro frontend OFS built with Next.js, featuring dynamic tabs, dark mode, and an admin panel for configuration.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Running Locally](#running-locally)
- [Building for Production](#building-for-production)
- [Deploying to Production](#deploying-to-production)
- [Project Structure](#project-structure)
- [Managing Markdown Content](#managing-markdown-content)
- [Adding New Micro Frontends](#adding-new-micro-frontends)
- [Configuring API Tokens](#configuring-api-tokens)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later) or yarn (v1.22.0 or later)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install required Tailwind plugins:
   ```bash
   npm install -D @tailwindcss/typography
   ```

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Managing Markdown Content

The application includes markdown-based content pages for documentation and guides. These pages are located in the `app` directory:

### Editing Markdown Pages

1. Navigate to the respective page directory:
   - Idea Contributor Access: `app/idea-contributor-access/page.tsx`

2. The content is structured using TypeScript/React components with Tailwind CSS styling.

3. Each page follows this structure:
   - Navigation (Back to Home link)
   - Main heading
   - Sections with subheadings
   - Ordered and unordered lists
   - Support links

4. Styling is handled through Tailwind Typography plugin:
   - Uses `prose` classes for consistent typography
   - Maintains responsive design
   - Ensures proper spacing and hierarchy

### Adding New Markdown Pages

1. Create a new directory in `app` for your page:
   ```bash
   mkdir app/your-page-name
   ```

2. Create a new `page.tsx` file:
   ```bash
   touch app/your-page-name/page.tsx
   ```

3. Use the existing pages as templates, following the structure:
   ```typescript
   import Link from 'next/link'

   export default function YourPage() {
     return (
       <main className="container mx-auto px-4 py-8 prose prose-slate max-w-none">
         <Link href="/" className="inline-flex items-center mb-8 text-sm hover:text-primary no-underline">
           ← Back to Home
         </Link>
         
         <h1>Your Page Title</h1>
         // Add your content here
       </main>
     )
   }
   ```

## Running Locally

1. Navigate to the project directory:
   ```bash
   cd corporate-portal
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev -- -p 7788
   ```
4. Visit http://localhost:7788 in your browser

## Building for Production

1. Ensure all dependencies are installed:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Test the production build locally:
   ```bash
   npm run start -- -p 7788
   ```

## Deploying to Production

### Deploy to Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com).

1. Push your code to a Git repository
2. Import your project to Vercel
3. Configure environment variables if needed
4. Vercel will automatically deploy your application

### Manual Deployment

For manual deployment to your own server:

1. Prepare your environment:
   ```bash
   # Install dependencies
   npm install

   # Build the application
   npm run build
   ```

2. Set up environment variables:
   - Create a `.env.production` file
   - Add necessary environment variables
   - Set PORT=7788 in your environment variables

3. Start the production server:
   ```bash
   # Start with PM2 (recommended)
   pm2 start npm --name "corporate-portal" -- start -- -p 7788

   # Or start directly
   npm start -- -p 7788
   ```

4. Configure your web server (Nginx example):
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;

     location / {
       proxy_pass http://localhost:7788;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

5. Set up SSL with Let's Encrypt (recommended)

### Deployment Checklist

- [ ] All dependencies are installed
- [ ] Environment variables are configured
- [ ] Build completes successfully
- [ ] Static assets are properly served
- [ ] SSL certificate is installed
- [ ] Domain DNS is configured
- [ ] Application health monitoring is set up

## Project Structure

The project is organized as follows:

```
├── app/                   # Next.js 13+ app directory
│   ├── admin/             # Admin interface pages
│   ├── api/               # API routes
│   ├── config/            # Configuration files
│   │   ├── categories/    # Category JSON files
│   │   └── category-manager.ts # Category management utility
│   ├── idea-contributor-access/ # Idea contributor guide
│   ├── tickets/           # Category pages
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
├── middleware.ts          # Authentication middleware
├── public/                # Static assets
└── docs/                  # Documentation
    └── CATEGORY_MANAGEMENT.md # Detailed category management docs
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Adding New Micro Frontends

To add a new micro frontend, follow these steps:

1. Create a new directory in the `src/microfrontends` folder
2. Create a new file in the directory with the micro frontend code
3. Register the micro frontend in the `src/microfrontends/index.js` file

## Configuring API Tokens

To configure API tokens, follow these steps:

1. Create a new file in the `config` folder named `apiTokens.js`
2. Add your API tokens to the file

