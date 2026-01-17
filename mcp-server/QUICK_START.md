# Quick Start Guide - Testing the MCP Server

## ✅ Installation Complete!

The MCP server is installed and ready. Here's how to test it:

## Step 1: Verify Installation

```bash
cd /Users/curlingai/Documents/Piyush/mermaid-diagram-editor/mcp-server
node simple-test.js
```

You should see: ✅ Ready to test with MCP client!

## Step 2: Configure in Cursor

1. Open Cursor Settings
2. Go to MCP Servers (or Extensions → MCP)
3. Add this configuration:

```json
{
  "mcpServers": {
    "mermaid-diagram-server": {
      "command": "node",
      "args": [
        "/Users/curlingai/Documents/Piyush/mermaid-diagram-editor/mcp-server/index.js"
      ],
      "env": {}
    }
  }
}
```

4. **Restart Cursor** for the changes to take effect

## Step 3: Test in Cursor

Once configured, try asking in Cursor:

```
"Please validate this Mermaid code:
sequenceDiagram
    participant A
    participant B
    A->>B: Hello"
```

Or:

```
"Render this Mermaid diagram to HTML:
graph TD
    A[Start] --> B[Process]
    B --> C[End]"
```

## Available Tools

1. **render_mermaid_to_html** - Get standalone HTML file
2. **render_mermaid_to_svg** - Get SVG string  
3. **render_mermaid_to_pdf** - Get PDF (base64)
4. **validate_mermaid_code** - Check if code is valid

## Troubleshooting

- If server doesn't start: Check Node.js version (`node --version` should be 18+)
- If Puppeteer fails: It may need to download Chromium on first run
- If MCP not showing: Restart Cursor after configuration

## Next Steps

After testing here, we'll move to a different code area and install it there!
