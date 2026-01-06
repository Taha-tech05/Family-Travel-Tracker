/**
 * Helper script to copy SVG paths from index.ejs to WorldMap.jsx
 * 
 * INSTRUCTIONS:
 * 1. Open views/index.ejs
 * 2. Find the <svg> tag (around line 31)
 * 3. Copy all <path> elements (from line 33 to line 385)
 * 4. Paste them into WorldMap.jsx inside the <svg> tag
 * 
 * Each path looks like:
 * <path id="US" title="United States" d="M109.249,279.8L..." />
 * 
 * The 'id' attribute is the country code (e.g., "US", "FR", "CA")
 * The 'd' attribute contains the SVG path data
 * 
 * There are approximately 200+ country paths to copy.
 */

// Alternatively, you can use this Node.js script to extract the paths:

const fs = require('fs');
const path = require('path');

const ejsFilePath = path.join(__dirname, '..', '..', 'views', 'index.ejs');
const outputPath = path.join(__dirname, 'extracted_svg_paths.txt');

try {
    const ejsContent = fs.readFileSync(ejsFilePath, 'utf-8');

    // Extract SVG content between <svg> and </svg>
    const svgMatch = ejsContent.match(/<svg[\s\S]*?<\/svg>/);

    if (svgMatch) {
        // Extract all path elements
        const pathMatches = svgMatch[0].match(/<path[^>]*\/>/g);

        if (pathMatches) {
            const formattedPaths = pathMatches.join('\n        ');
            fs.writeFileSync(outputPath, formattedPaths);
            console.log(`✅ Extracted ${pathMatches.length} country paths to ${outputPath}`);
            console.log('Copy the content from extracted_svg_paths.txt to WorldMap.jsx');
        }
    }
} catch (error) {
    console.error('Error:', error.message);
    console.log('\n📝 Manual steps:');
    console.log('1. Open views/index.ejs');
    console.log('2. Copy all <path> elements (lines 33-385)');
    console.log('3. Paste into client/src/WorldMap.jsx inside the <svg> tag');
}
