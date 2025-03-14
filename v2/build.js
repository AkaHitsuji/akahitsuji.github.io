const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const frontMatter = require('front-matter');
const { globSync } = require('glob');
const chokidar = require('chokidar');

// Paths
const CONTENT_DIR = path.join(__dirname, 'content');
const TIMELINE_DIR = path.join(CONTENT_DIR, 'timeline');
const OUTPUT_DIR = __dirname;
const TEMPLATE_PATH = path.join(__dirname, 'templates', 'index.template.html');

// Create templates directory if it doesn't exist
fs.ensureDirSync(path.join(__dirname, 'templates'));

// Extract the current index.html as a template
function extractTemplate() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.log('Creating template from index.html...');
    const indexContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    
    // Replace the timeline items with a placeholder
    const templateContent = indexContent.replace(
      /<div class="timeline">([\s\S]*?)<\/div>(\s*)<\/div>(\s*)<\/section>/,
      '<div class="timeline">{{TIMELINE_ITEMS}}</div>$2</div>$3</section>'
    );
    
    fs.writeFileSync(TEMPLATE_PATH, templateContent);
  }
}

// Process timeline Markdown files
function processTimelineFiles() {
  const timelineFiles = globSync(path.join(TIMELINE_DIR, '*.md'));
  const timelineItems = [];

  timelineFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const { attributes, body } = frontMatter(content);
    
    if (!attributes.date || !attributes.title) {
      console.warn(`Warning: ${file} is missing required frontmatter (date or title)`);
      return;
    }

    const htmlContent = marked(body);
    const hasContent = body.trim().length > 0;
    
    // Create timeline item HTML
    const timelineItem = `
    <div class="timeline-item">
        <div class="timeline-date">
            <i class="fas fa-calendar"></i>
            ${attributes.date}
        </div>
        <div class="timeline-content">
            <div class="timeline-image">
                <img src="${attributes.image || 'img/placeholder.svg'}" alt="${attributes.title}">
                <div class="timeline-image-overlay"></div>
                <div class="timeline-mobile-date">
                    <i class="fas fa-calendar"></i>
                    ${attributes.date}
                </div>
                <div class="timeline-hashtags">
                    ${(attributes.hashtags || []).map(tag => `
                    <span class="tag">
                        <i class="fas fa-hashtag"></i>
                        ${tag}
                    </span>
                    `).join('')}
                </div>
            </div>
            <div class="timeline-content-inner">
                <h3>${attributes.title}</h3>
                <p>${attributes.summary || ''}</p>
                ${hasContent && attributes.detailPage ? `
                <div class="timeline-footer">
                  <a href="${attributes.detailPage}" class="read-more">Read more</a>
                </div>` : ``}
            </div>
        </div>
    </div>`;
    
    timelineItems.push({
      date: new Date(attributes.date),
      html: timelineItem
    });
    
    // If there's a detail page and content, generate it
    if (hasContent && attributes.detailPage) {
      generateDetailPage(attributes, htmlContent);
    }
  });

  // Sort timeline items by date (newest first)
  timelineItems.sort((a, b) => b.date - a.date);
  
  return timelineItems.map(item => item.html).join('\n');
}

// Generate a detail page for a timeline entry
function generateDetailPage(attributes, content) {
  if (!attributes.detailPage) return;
  
  const detailPagePath = path.join(__dirname, attributes.detailPage);
  const detailPageDir = path.dirname(detailPagePath);
  
  fs.ensureDirSync(detailPageDir);
  
  const detailPageContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${attributes.title} - Yang Ang</title>
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="../css/theme.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="../js/theme.js" defer></script>
    <script src="../js/main.js" defer></script>
</head>
<body>
    <header class="navbar">
        <div class="container">
            <a href="../index.html#home" class="logo">Yang Ang</a>
            <nav class="desktop-nav">
                <a href="../index.html#home" class="nav-link">Home</a>
                <a href="../index.html#timeline" class="nav-link">Timeline</a>
                <a href="../index.html#blog" class="nav-link">Blog</a>
                <div class="theme-toggle-container">
                    <button class="theme-toggle" aria-label="Toggle theme">
                        <svg class="theme-icon sun-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                        <svg class="theme-icon moon-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z"/></svg>
                        <svg class="theme-icon palette-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="19" cy="13" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="10" cy="18.5" r="2.5"/></svg>
                    </button>
                    <div class="theme-dropdown">
                        <button class="theme-option" data-theme="light">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                            <span>Light</span>
                        </button>
                        <button class="theme-option" data-theme="dark">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z"/></svg>
                            <span>Dark</span>
                        </button>
                        <button class="theme-option" data-theme="purple">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="19" cy="13" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="10" cy="18.5" r="2.5"/></svg>
                            <span>Purple</span>
                        </button>
                        <button class="theme-option" data-theme="system">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                            <span>System</span>
                        </button>
                    </div>
                </div>
            </nav>
            <div class="mobile-nav">
                <div class="theme-toggle-container">
                    <button class="theme-toggle" aria-label="Toggle theme">
                        <svg class="theme-icon sun-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                        <svg class="theme-icon moon-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z"/></svg>
                        <svg class="theme-icon palette-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="19" cy="13" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="10" cy="18.5" r="2.5"/></svg>
                    </button>
                    <div class="theme-dropdown">
                        <button class="theme-option" data-theme="light">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                            <span>Light</span>
                        </button>
                        <button class="theme-option" data-theme="dark">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z"/></svg>
                            <span>Dark</span>
                        </button>
                        <button class="theme-option" data-theme="purple">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="19" cy="13" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="10" cy="18.5" r="2.5"/></svg>
                            <span>Purple</span>
                        </button>
                        <button class="theme-option" data-theme="system">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                            <span>System</span>
                        </button>
                    </div>
                </div>
                <button class="menu-toggle" aria-label="Toggle menu">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                </button>
            </div>
        </div>
        <div class="mobile-menu">
            <nav>
                <a href="../index.html#home" class="nav-link">Home</a>
                <a href="../index.html#timeline" class="nav-link">Timeline</a>
                <a href="../index.html#blog" class="nav-link">Blog</a>
            </nav>
        </div>
    </header>

    <main class="detail-page">
        <div class="container">
            <button class="back-link" onclick="handleBack(event)">
                <i class="fas fa-arrow-left"></i> Back to timeline
            </button>
            
            <div id="detail-content" class="detail-content-wrapper">
                <div class="detail-header">
                    <div class="detail-image-container">
                        <img src="${attributes.image ? '../' + attributes.image : '../img/placeholder.svg'}" alt="${attributes.title}" class="detail-image">
                        <div class="detail-image-overlay"></div>
                        <div class="detail-title-container">
                            <div class="detail-date-badge">
                                <i class="fas fa-calendar"></i>
                                ${attributes.date}
                            </div>
                            <h1>${attributes.title}</h1>
                        </div>
                    </div>
                </div>
                
                <div class="detail-meta">
                    ${attributes.tags ? `
                    <div class="detail-tags">
                        ${attributes.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>` : ''}
                </div>
                
                <div class="detail-content">
                    ${content}
                </div>
                
                <div class="detail-footer">
                    <button class="back-link" onclick="handleBack(event)">
                        <i class="fas fa-arrow-left"></i> Back to timeline
                    </button>
                </div>
            </div>
        </div>
    </main>

    <script>
        // Add entrance animation on page load
        document.addEventListener('DOMContentLoaded', function() {
            const detailContent = document.getElementById('detail-content');
            setTimeout(() => {
                detailContent.classList.add('animate-in');
            }, 100);
        });
        
        // Handle back button click with animation
        function handleBack(e) {
            e.preventDefault();
            const detailContent = document.getElementById('detail-content');
            detailContent.classList.remove('animate-in');
            detailContent.classList.add('animate-out');
            
            setTimeout(() => {
                window.location.href = '../index.html#timeline';
            }, 300);
        }
    </script>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 Yang Ang. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;

  fs.writeFileSync(detailPagePath, detailPageContent);
}

// Build the site
function buildSite() {
  console.log('Building site...');
  
  // Extract template if it doesn't exist
  extractTemplate();
  
  // Process timeline files
  const timelineItemsHtml = processTimelineFiles();
  
  // Read template
  const templateContent = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  
  // Replace timeline items placeholder with actual content
  const outputContent = templateContent.replace('{{TIMELINE_ITEMS}}', timelineItemsHtml);
  
  // Write output
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), outputContent);
  
  console.log('Site built successfully!');
}

// Watch for changes in development mode
function watchFiles() {
  console.log('Watching for changes...');
  
  const watcher = chokidar.watch([
    path.join(CONTENT_DIR, '**/*.md'),
    path.join(__dirname, 'templates', '*.html')
  ], {
    persistent: true
  });
  
  watcher.on('change', path => {
    console.log(`File ${path} changed. Rebuilding...`);
    buildSite();
  });
}

// Main function
function main() {
  // Create necessary directories
  fs.ensureDirSync(CONTENT_DIR);
  fs.ensureDirSync(TIMELINE_DIR);
  
  // Build the site
  buildSite();
  
  // Watch for changes if in watch mode
  if (process.argv.includes('--watch')) {
    watchFiles();
  }
}

main(); 