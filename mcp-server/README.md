# Mermaid Diagram MCP Server

An MCP (Model Context Protocol) server that renders Mermaid diagrams. Pass Mermaid code to the server and get rendered HTML, SVG, or PDF output.

## Features

- ✅ **Render to HTML**: Get standalone HTML files with embedded diagrams
- ✅ **Render to SVG**: Get raw SVG output
- ✅ **Render to PDF**: Get PDF documents with diagrams
- ✅ **Validate Code**: Check if Mermaid code is valid before rendering

## Installation

```bash
cd mcp-server
npm install
```

## Usage

### Running the Server

```bash
npm start
```

The server runs on stdio and communicates via the Model Context Protocol.

### Available Tools

#### 1. `render_mermaid_to_html`
Renders Mermaid code to a standalone HTML file.

**Input:**
```json
{
  "mermaidCode": "sequenceDiagram\n    participant A\n    participant B\n    A->>B: Hello",
  "diagramName": "My Diagram",
  "includeCode": true
}
```

**Output:** HTML string that can be saved to a file.

#### 2. `render_mermaid_to_svg`
Renders Mermaid code to SVG format.

**Input:**
```json
{
  "mermaidCode": "graph TD\n    A-->B\n    B-->C"
}
```

**Output:** SVG string.

#### 3. `render_mermaid_to_pdf`
Renders Mermaid code to PDF.

**Input:**
```json
{
  "mermaidCode": "sequenceDiagram\n    participant A\n    participant B",
  "diagramName": "My Diagram"
}
```

**Output:** Base64-encoded PDF data.

#### 4. `validate_mermaid_code`
Validates Mermaid code syntax.

**Input:**
```json
{
  "mermaidCode": "graph TD\n    A-->B"
}
```

**Output:** Validation result with `valid: true/false` and error message if invalid.

## Configuration for Cursor IDE

Add this to your Cursor MCP settings (usually in `~/.cursor/mcp.json` or Cursor settings):

```json
{
  "mcpServers": {
    "mermaid-diagram-server": {
      "command": "node",
      "args": ["/path/to/mermaid-diagram-editor/mcp-server/index.js"],
      "env": {}
    }
  }
}
```

Or if using npm script:

```json
{
  "mcpServers": {
    "mermaid-diagram-server": {
      "command": "npm",
      "args": ["start"],
      "cwd": "/path/to/mermaid-diagram-editor/mcp-server"
    }
  }
}
```

## Configuration for Other MCP Clients

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mermaid-diagram-server": {
      "command": "node",
      "args": ["/path/to/mermaid-diagram-editor/mcp-server/index.js"]
    }
  }
}
```

### VS Code with MCP Extension

Configure in your VS Code settings to use this MCP server.

## Example Usage

Once configured, you can use it in your AI assistant like:

```
"Please render this Mermaid code to HTML:
sequenceDiagram
    autonumber
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob!
    B-->>A: Hello Alice!"
```

The AI assistant will call the MCP server and return the rendered HTML.

## Requirements

- Node.js 18+
- npm or yarn
- Puppeteer (automatically installed, downloads Chromium)

## Troubleshooting

### Puppeteer Issues
If Puppeteer fails to download Chromium, you may need to:
```bash
npm install puppeteer --unsafe-perm=true
```

### Permission Issues
On Linux, you might need:
```bash
sudo apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  wget \
  xdg-utils
```

## License

MIT
