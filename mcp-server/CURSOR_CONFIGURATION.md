# Cursor MCP Server Configuration ✅

## Configuration Complete!

The Mermaid Diagram MCP Server has been added to your Cursor settings.

### Configuration Location
```
~/Library/Application Support/Cursor/User/settings.json
```

### Configuration Added
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

## Next Steps

1. **Restart Cursor** - Close and reopen Cursor for the MCP server to be loaded
2. **Verify Connection** - After restart, the MCP server should be available
3. **Test It** - Try asking Cursor:
   ```
   "Validate this Mermaid code:
   sequenceDiagram
       participant A
       participant B
       A->>B: Hello"
   ```

## Available Tools

Once configured, you can use these tools through Cursor:

1. **render_mermaid_to_html** - Get standalone HTML file
2. **render_mermaid_to_svg** - Get SVG string
3. **render_mermaid_to_pdf** - Get PDF (base64 encoded)
4. **validate_mermaid_code** - Validate Mermaid syntax

## Troubleshooting

If the MCP server doesn't appear after restart:

1. Check Node.js is installed: `node --version` (should be 18+)
2. Verify the server file exists at the configured path
3. Check Cursor's output/logs for MCP connection errors
4. Try running the server manually:
   ```bash
   cd /Users/curlingai/Documents/Piyush/mermaid-diagram-editor/mcp-server
   node index.js
   ```
   (It should start and wait for stdio input - this is normal)

## Alternative Configuration Methods

If the above doesn't work, Cursor might use a different configuration location. Try:

1. **Cursor Settings UI**: Open Cursor → Settings → Search for "MCP"
2. **Command Palette**: Cmd+Shift+P → "MCP: Configure Servers"
3. **Workspace Settings**: Some versions use `.cursor/mcp.json` in workspace
