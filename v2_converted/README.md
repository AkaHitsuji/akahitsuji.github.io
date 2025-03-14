# Markdown-Based Static Site Generator

This is a simple static site generator that converts Markdown files into HTML pages for my personal website. It preserves the existing design and functionality while allowing for easier content management.

## Features

- Markdown-based content management
- Automatic generation of timeline entries from Markdown files
- Support for detail pages with rich content
- Preserves existing design, styles, and functionality
- Compatible with GitHub Pages

## Directory Structure

```
.
├── content/               # Markdown content files
│   └── timeline/          # Timeline entry Markdown files
├── css/                   # CSS stylesheets
├── img/                   # Image assets
├── js/                    # JavaScript files
├── templates/             # HTML templates
├── webfonts/              # Web fonts
├── build.js               # Build script
├── index.html             # Generated main page
└── pages/                 # Generated detail pages
```

## Content Format

### Timeline Entries

Timeline entries are Markdown files in the `content/timeline/` directory. Each file should have frontmatter with the following fields:

```markdown
---
title: Entry Title
date: Month YYYY
image: path/to/image.jpg
tags:
  - Tag1
  - Tag2
hashtags:
  - Hashtag1
  - Hashtag2
summary: A brief summary of the entry.
detailPage: pages/detail-page.html  # Optional, for entries with detail pages
---

Content of the entry in Markdown format...
```

## Usage

### Installation

```bash
npm install
```

### Building the Site

```bash
npm run build
```

This will process all Markdown files and generate the HTML pages.

### Development Mode

```bash
npm run dev
```

This will start a watch process that rebuilds the site whenever content files change.

## Deployment

The site can be deployed to GitHub Pages by pushing the contents of this directory to your GitHub repository.

## Adding New Content

1. Create a new Markdown file in the appropriate content directory (e.g., `content/timeline/`)
2. Add the required frontmatter fields
3. Write your content in Markdown format
4. Run `npm run build` to regenerate the site

## Customization

- Edit CSS files in the `css/` directory to change the styling
- Modify the templates in the `templates/` directory to change the HTML structure
- Update JavaScript files in the `js/` directory to change the functionality 