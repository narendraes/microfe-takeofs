# Category Sync Process

This document describes the automated process for syncing category data from production to GitHub.

## Overview

The category sync process:

1. Fetches the latest category data from the production API
2. Updates the local JSON files in the `app/config/categories` directory
3. Commits and pushes the changes to GitHub

## Automated Sync

The sync process runs automatically via GitHub Actions:

- Scheduled to run daily at midnight UTC
- Can be manually triggered via the GitHub Actions UI

## Configuration

The sync process requires the following environment variables:

- `PRODUCTION_API_URL`: The URL of the production API endpoint
- `PRODUCTION_API_KEY`: The API key for authenticating with the production API

These are stored as GitHub Secrets and are automatically used by the GitHub Actions workflow.

## Manual Sync

To run the sync process manually:

1. Set the required environment variables:
   ```bash
   export PRODUCTION_API_URL="https://your-production-api.com/api/categories"
   export PRODUCTION_API_KEY="your-api-key"
   ```

2. Run the TypeScript script:
   ```bash
   npx ts-node scripts/sync-categories.ts
   ```

   Or the JavaScript version:
   ```bash
   node scripts/sync-categories.js
   ```

## Troubleshooting

If the sync process fails, check the following:

1. Ensure the production API is accessible
2. Verify the API key is valid and has the necessary permissions
3. Check the GitHub Actions logs for detailed error messages

## Implementation Details

The sync process is implemented in:

- `scripts/sync-categories.ts` (TypeScript version)
- `scripts/sync-categories.js` (JavaScript version)
- `.github/workflows/sync-categories.yml` (GitHub Actions workflow)

The TypeScript version is the primary implementation and should be maintained as the source of truth. 