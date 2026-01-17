#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import puppeteer from 'puppeteer';

class MermaidMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'mermaid-diagram-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    this.browser = null;
  }

  setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'render_mermaid_to_html',
          description: 'Renders Mermaid diagram code to standalone HTML. Returns HTML string that can be saved or displayed.',
          inputSchema: {
            type: 'object',
            properties: {
              mermaidCode: {
                type: 'string',
                description: 'The Mermaid diagram code to render',
              },
              diagramName: {
                type: 'string',
                description: 'Optional name for the diagram (default: "mermaid-diagram")',
                default: 'mermaid-diagram',
              },
              includeCode: {
                type: 'boolean',
                description: 'Whether to include the Mermaid code in the output HTML (default: true)',
                default: true,
              },
            },
            required: ['mermaidCode'],
          },
        },
        {
          name: 'render_mermaid_to_svg',
          description: 'Renders Mermaid diagram code to SVG. Returns SVG string.',
          inputSchema: {
            type: 'object',
            properties: {
              mermaidCode: {
                type: 'string',
                description: 'The Mermaid diagram code to render',
              },
            },
            required: ['mermaidCode'],
          },
        },
        {
          name: 'render_mermaid_to_pdf',
          description: 'Renders Mermaid diagram code to PDF. Returns base64-encoded PDF data.',
          inputSchema: {
            type: 'object',
            properties: {
              mermaidCode: {
                type: 'string',
                description: 'The Mermaid diagram code to render',
              },
              diagramName: {
                type: 'string',
                description: 'Optional name for the diagram (default: "mermaid-diagram")',
                default: 'mermaid-diagram',
              },
            },
            required: ['mermaidCode'],
          },
        },
        {
          name: 'validate_mermaid_code',
          description: 'Validates Mermaid diagram code syntax. Returns validation result.',
          inputSchema: {
            type: 'object',
            properties: {
              mermaidCode: {
                type: 'string',
                description: 'The Mermaid diagram code to validate',
              },
            },
            required: ['mermaidCode'],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'render_mermaid_to_html':
            return await this.renderToHTML(args);
          case 'render_mermaid_to_svg':
            return await this.renderToSVG(args);
          case 'render_mermaid_to_pdf':
            return await this.renderToPDF(args);
          case 'validate_mermaid_code':
            return await this.validateCode(args);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing tool ${name}: ${error.message}`
        );
      }
    });
  }

  async getBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
    return this.browser;
  }

  async renderToHTML(args) {
    const { mermaidCode, diagramName = 'mermaid-diagram', includeCode = true } = args;

    if (!mermaidCode || typeof mermaidCode !== 'string') {
      throw new Error('mermaidCode is required and must be a string');
    }

    const browser = await this.getBrowser();
    const page = await browser.newPage();

    // Create HTML page with Mermaid
    const html = `<!DOCTYPE html>
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

    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Wait for mermaid to render
    await page.waitForTimeout(2000);
    
    // Get the rendered SVG
    const svg = await page.evaluate(() => {
      const mermaidElement = document.querySelector('.mermaid svg');
      return mermaidElement ? mermaidElement.outerHTML : '';
    });

    await page.close();

    // Escape HTML for code display
    const escapedCode = mermaidCode
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/`/g, '&#96;');
    const escapedName = diagramName
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Create standalone HTML
    const html = `<!DOCTYPE html>
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
        ${includeCode ? `
        <div class="code-section">
            <h3>Mermaid Code:</h3>
            <pre><code>${escapedCode}</code></pre>
        </div>
        ` : ''}
    </div>
    <script>
        mermaid.initialize({ startOnLoad: true, theme: 'default', securityLevel: 'loose' });
    </script>
</body>
</html>`;

    return {
      content: [
        {
          type: 'text',
          text: html,
        },
      ],
    };
  }

  async renderToSVG(args) {
    const { mermaidCode } = args;

    if (!mermaidCode || typeof mermaidCode !== 'string') {
      throw new Error('mermaidCode is required and must be a string');
    }

    const browser = await this.getBrowser();
    const page = await browser.newPage();

    // Create HTML page with Mermaid
    const html = `<!DOCTYPE html>
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

    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Wait for mermaid to render
    await page.waitForTimeout(2000);
    
    // Get the rendered SVG
    const svg = await page.evaluate(() => {
      const mermaidElement = document.querySelector('.mermaid svg');
      return mermaidElement ? mermaidElement.outerHTML : '';
    });

    await page.close();

    return {
      content: [
        {
          type: 'text',
          text: svg,
        },
      ],
    };
  }

  async renderToPDF(args) {
    const { mermaidCode, diagramName = 'mermaid-diagram' } = args;

    if (!mermaidCode || typeof mermaidCode !== 'string') {
      throw new Error('mermaidCode is required and must be a string');
    }

    const browser = await this.getBrowser();
    const page = await browser.newPage();

    // Create HTML page with Mermaid
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            padding: 0;
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
        }
        .mermaid {
            display: flex;
            justify-content: center;
        }
    </style>
</head>
<body>
    <h1>${diagramName}</h1>
    <div class="mermaid">
${mermaidCode}
    </div>
    <script>
        mermaid.initialize({ startOnLoad: true, theme: 'default', securityLevel: 'loose' });
    </script>
</body>
</html>`;

    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Wait for mermaid to render
    await page.waitForTimeout(2000);
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
    });

    await page.close();

    // Convert to base64
    const base64Pdf = pdf.toString('base64');

    return {
      content: [
        {
          type: 'text',
          text: `PDF generated successfully. Base64 encoded PDF data:\n\n${base64Pdf}`,
        },
      ],
    };
  }

  async validateCode(args) {
    const { mermaidCode } = args;

    if (!mermaidCode || typeof mermaidCode !== 'string') {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              valid: false,
              error: 'mermaidCode is required and must be a string',
            }),
          },
        ],
      };
    }

    try {
      const browser = await this.getBrowser();
      const page = await browser.newPage();

      // Create HTML page with Mermaid
      const html = `<!DOCTYPE html>
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

      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      // Wait for mermaid to render
      await page.waitForTimeout(2000);
      
      // Check if rendering was successful
      const hasError = await page.evaluate(() => {
        const errorElement = document.querySelector('.mermaid .error-icon, .mermaid .error-text');
        return errorElement !== null;
      });

      await page.close();

      if (hasError) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                valid: false,
                error: 'Mermaid code failed to render',
              }),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              valid: true,
              message: 'Mermaid code is valid',
            }),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              valid: false,
              error: error.message,
            }),
          },
        ],
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Mermaid MCP Server running on stdio');
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Handle cleanup on exit
const server = new MermaidMCPServer();
server.run().catch(console.error);

process.on('SIGINT', async () => {
  await server.cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await server.cleanup();
  process.exit(0);
});
