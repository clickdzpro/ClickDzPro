# Deployment Instructions for Glitch

This directory contains all the files needed to deploy the Academic Assistant Chatbot to Glitch.

## Option 1: Import via ZIP file

1. Create a ZIP file of this entire `deploy` directory
2. Go to your Glitch project
3. Click on "Tools" in the bottom left corner
4. Select "Import / Export"
5. Choose "Import from GitHub"
6. Click on "Upload a GitHub .zip file"
7. Upload the ZIP file you created
8. Wait for the import to complete

## Option 2: Manual File Upload

1. Go to your Glitch project
2. Click on "New File" for each file you want to add
3. Copy the contents of each file from this directory to the corresponding file in Glitch
4. Make sure to maintain the same directory structure

## Option 3: Using the Glitch CLI

If you have the Glitch CLI installed, you can use the following commands:

```bash
# Install the Glitch CLI if you haven't already
npm install -g glitch-cli

# Log in to your Glitch account
glitch login

# Clone your Glitch project
glitch clone your-project-name

# Copy all files from the deploy directory to the cloned project
# (Do this manually)

# Push the changes back to Glitch
glitch push
```

## Important Notes

1. Make sure the server is configured to use the `build` directory as the base directory
2. The `.env` file contains sensitive information, ensure it's properly set up in Glitch
3. After deployment, you may need to restart the Glitch project for changes to take effect

## Troubleshooting

If you encounter issues after deployment:

1. Check the Glitch logs for any errors
2. Ensure all files were properly uploaded
3. Verify that the server is running and listening on the correct port
4. Clear your browser cache to ensure you're seeing the latest version
