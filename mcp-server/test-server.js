#!/usr/bin/env node

/**
 * Simple test script to verify the MCP server works
 * This simulates MCP protocol calls
 */

import { spawn } from 'child_process';
import { readFileSync } from 'fs';

// Test Mermaid code
const testMermaidCode = `sequenceDiagram
    autonumber
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob!
    B-->>A: Hello Alice!`;

console.log('🧪 Testing Mermaid MCP Server\n');
console.log('Test Mermaid Code:');
console.log(testMermaidCode);
console.log('\n---\n');

// Start the MCP server
const server = spawn('node', ['index.js'], {
  cwd: process.cwd(),
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let errorOutput = '';

server.stdout.on('data', (data) => {
  output += data.toString();
  console.log('📤 Server output:', data.toString());
});

server.stderr.on('data', (data) => {
  errorOutput += data.toString();
  console.error('⚠️  Server error:', data.toString());
});

server.on('close', (code) => {
  console.log(`\n✅ Server process exited with code ${code}`);
  if (errorOutput.includes('error') || code !== 0) {
    console.error('❌ Server test failed');
    process.exit(1);
  } else {
    console.log('✅ Server test passed');
    process.exit(0);
  }
});

// Send a test MCP request after a short delay
setTimeout(() => {
  console.log('\n📨 Sending test request...\n');
  
  // MCP protocol: List tools request
  const listToolsRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: {}
  };
  
  server.stdin.write(JSON.stringify(listToolsRequest) + '\n');
  
  // Wait a bit, then send a call tool request
  setTimeout(() => {
    const validateRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'validate_mermaid_code',
        arguments: {
          mermaidCode: testMermaidCode
        }
      }
    };
    
    server.stdin.write(JSON.stringify(validateRequest) + '\n');
    
    // Close after getting response
    setTimeout(() => {
      server.stdin.end();
    }, 2000);
  }, 1000);
}, 2000);

// Handle errors
server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
