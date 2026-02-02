#!/usr/bin/env node

/**
 * Direct Mermaid rendering script (without MCP server)
 */

import puppeteer from 'puppeteer';

const mermaidCode = `sequenceDiagram
    participant A
    participant B  
    A->>B: Hello`;

const diagramName = 'Test Diagram';

async function renderToHTML() {
  console.log('🎨 Rendering Mermaid diagram to HTML...\n');
  console.log('Input code:');
  console.log(mermaidCode);
  console.log('\n---\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Create HTML page with Mermaid
    const renderHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
</head>
<body>
    <div class="mermaid">
${mermaidCode}
    </div>
    <script>
        mermaid.initialize({ startOnLoad: true, theme: 'default', securityLevel: 'loose' });
    </script>
</body>
</html>`;

    await page.setContent(renderHtml, { waitUntil: 'networkidle0' });
    
    // Wait for mermaid to render
    await page.waitForTimeout(2000);
    
    // Get the rendered SVG
    const svg = await page.evaluate(() => {
      const mermaidElement = document.querySelector('.mermaid svg');
      return mermaidElement ? mermaidElement.outerHTML : '';
    });

    if (!svg) {
      throw new Error('Failed to render diagram - no SVG found');
    }

    // Escape HTML for code display
    const escapedCode = mermaidCode
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/`/g, '&#96;');
    const escapedName = diagramName
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Create standalone HTML output
    const outputHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapedName}</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .mermaid {
            display: flex;
            justify-content: center;
            overflow-x: auto;
            margin: 20px 0;
        }
        .code-section {
            margin-top: 30px;
            padding: 15px;
            background: #f9f9f9;
            border-radius: 4px;
            border: 1px solid #ddd;
        }
        .code-section h3 {
            margin-top: 0;
            color: #555;
        }
        pre {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${escapedName}</h1>
        <div class="mermaid">
            ${svg}
        </div>
        <div class="code-section">
            <h3>Mermaid Code:</h3>
            <pre><code>${escapedCode}</code></pre>
        </div>
    </div>
    <script>
        mermaid.initialize({ startOnLoad: true, theme: 'default', securityLevel: 'loose' });
    </script>
</body>
</html>`;

    await page.close();
    await browser.close();

    // Save to file
    const fs = await import('fs');
    const filename = 'rendered-diagram.html';
    fs.writeFileSync(filename, outputHtml, 'utf-8');

    console.log('✅ Successfully rendered diagram!');
    console.log(`📄 HTML saved to: ${filename}`);
    console.log(`📁 Full path: ${process.cwd()}/${filename}`);
    console.log('\n✅ Validation: Code is valid and rendered successfully!');
    
    return filename;
  } catch (error) {
    await browser.close();
    console.error('❌ Error rendering diagram:', error.message);
    throw error;
  }
}

renderToHTML().catch(console.error);
