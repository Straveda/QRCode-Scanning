const fs = require('fs');
const path = require('path');

const TARGET_DIR = './'; // Current directory or specify
const BASE_HREF = '<base href="/qr/">';

function traverseDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                traverseDirectory(fullPath);
            }
        } else if (path.extname(file) === '.html') {
            processHtmlFile(fullPath);
        }
    });
}

function processHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Add <base> tag
    if (!content.includes('<base')) {
        if (content.includes('<head>')) {
            content = content.replace('<head>', `<head>\n    ${BASE_HREF}`);
            modified = true;
            console.log(`[FIXED] Added <base> to ${filePath}`);
        } else {
            console.warn(`[WARN] No <head> tag found in ${filePath}`);
        }
    } else {
        // Update existing base?
        console.log(`[SKIP] <base> already exists in ${filePath}`);
    }

    // 2. Remove duplicate scripts (simple case: same line or exact match)
    // Note: This only handles exact duplicate lines for now
    const lines = content.split('\n');
    const uniqueLines = new Set();
    const newLines = [];
    
    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('<script') && trimmed.includes('src=')) {
            if (uniqueLines.has(trimmed)) {
                console.log(`[REMOVED] Duplicate script in ${filePath}: ${trimmed}`);
                modified = true;
                return; // Skip duplicate
            }
            uniqueLines.add(trimmed);
        }
        newLines.push(line);
    });
    
    if (modified) {
        content = newLines.join('\n'); // Reassemble if scripts removed
        // Re-inject base if we split lines (base injection was string replace)
        // Actually, my base injection was before split.
        // If I split, I need to make sure I don't lose the base.
        // Better: do base injection AFTER duplicate removal locally, or handle carefully.
        
        // Let's re-run base injection logic on the clean content
        if (!content.includes('<base') && content.includes('<head>')) {
             content = content.replace('<head>', `<head>\n    ${BASE_HREF}`);
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

// Run
traverseDirectory(TARGET_DIR);
