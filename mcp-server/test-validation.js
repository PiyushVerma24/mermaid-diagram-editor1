#!/usr/bin/env node

/**
 * Quick validation test for Mermaid code
 */

const testCode = `sequenceDiagram
    participant A
    participant B  
    A->>B: Hello`;

console.log('🧪 Validating Mermaid Code:\n');
console.log(testCode);
console.log('\n---\n');

// Basic syntax validation
const checks = {
  hasSequenceDiagram: testCode.includes('sequenceDiagram'),
  hasParticipants: testCode.includes('participant'),
  hasArrows: testCode.includes('->>'),
  hasMessage: testCode.includes(':'),
  validStructure: true
};

// Check for common errors
const errors = [];
if (!testCode.trim().startsWith('sequenceDiagram')) {
  errors.push('Must start with sequenceDiagram');
}

const participantCount = (testCode.match(/participant/g) || []).length;
if (participantCount < 2) {
  errors.push('Need at least 2 participants');
}

const arrowCount = (testCode.match(/->>/g) || []).length;
if (arrowCount === 0) {
  errors.push('No arrows found');
}

console.log('✅ Syntax Check Results:');
console.log('  - Has sequenceDiagram:', checks.hasSequenceDiagram ? '✅' : '❌');
console.log('  - Has participants:', checks.hasParticipants ? '✅' : '❌');
console.log('  - Has arrows:', checks.hasArrows ? '✅' : '❌');
console.log('  - Participant count:', participantCount);
console.log('  - Arrow count:', arrowCount);

if (errors.length === 0) {
  console.log('\n✅ Code appears to be valid Mermaid syntax!');
  console.log('\n📝 Note: Full validation requires MCP server connection.');
  console.log('   Restart Cursor to enable MCP server tools.');
} else {
  console.log('\n❌ Issues found:');
  errors.forEach(err => console.log('  -', err));
}
