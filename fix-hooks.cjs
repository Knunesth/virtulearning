const fs = require('fs');
const path = require('path');
const hooksDir = path.join('src', 'hooks');

const files = fs.readdirSync(hooksDir).filter(f => f.endsWith('.ts'));

for (const file of files) {
  const filePath = path.join(hooksDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('useQuery') && !content.includes('enabled: isAuthenticated')) {
    if (!content.includes('useAuthStore')) {
      content = content.replace(/import (.*) from '@tanstack\/react-query';/, "import { useAuthStore } from '../store/useAuthStore';\nimport $1 from '@tanstack/react-query';");
    }

    content = content.replace(/(export const use[A-Za-z0-9_]+ = [^{]*\{)/g, "$1\n  const { isAuthenticated } = useAuthStore();");
    content = content.replace(/useQuery(<[^>]+>)?\(\{/g, "$&\n    enabled: isAuthenticated,");

    fs.writeFileSync(filePath, content);
    console.log('Modified', file);
  }
}
