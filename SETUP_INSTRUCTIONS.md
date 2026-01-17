# Setup Instructions for GitHub Repository

## Step 1: Create GitHub Repository

Since GitHub CLI is not installed, you need to create the repository manually:

1. Go to https://github.com/new
2. Repository name: `mermaid-diagram-editor`
3. Owner: `piyushverma24`
4. Description: "Web-based Mermaid diagram editor with HTML and PDF export"
5. Make it **Public** (required for free GitHub Pages)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Run these in the project directory:

```bash
cd "/Users/curlingai/Documents/Piyush/mermaid-diagram-editor"
git remote add origin https://github.com/piyushverma24/mermaid-diagram-editor.git
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository: https://github.com/piyushverma24/mermaid-diagram-editor
2. Click on **Settings** tab
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - **Deploy from a branch**: `main`
   - **Branch**: `main` / `(root)`
5. Click **Save**

## Step 4: Verify Deployment

- The GitHub Actions workflow will automatically deploy when you push
- Your site will be available at: `https://piyushverma24.github.io/mermaid-diagram-editor/`
- It may take 1-2 minutes for the first deployment

## Alternative: Quick Setup Script

If you have GitHub CLI installed later, you can use:

```bash
gh repo create piyushverma24/mermaid-diagram-editor --public --source=. --remote=origin --push
```
