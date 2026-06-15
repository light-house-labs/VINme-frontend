const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /\[#080808\]/g, replacement: 'void-black' },
  { regex: /\[#111111\]/g, replacement: 'carbon' },
  { regex: /\[#1a1a1a\]/g, replacement: 'gunmetal' },
  { regex: /\[#222222\]/g, replacement: 'soot' },
  { regex: /\[#333330\]/g, replacement: 'soot' },
  { regex: /\[#888880\]/g, replacement: 'ash' },
  { regex: /\[#f0ede8\]/g, replacement: 'bone-white' },
  { regex: /\[#F4B400\]/g, replacement: 'signal-amber' },
  
  // Also handle non-bracketed hex codes used in standard inline styles or SVGs
  { regex: /#080808/g, replacement: 'var(--color-void-black)' },
  { regex: /#111111/g, replacement: 'var(--color-carbon)' },
  { regex: /#1a1a1a/g, replacement: 'var(--color-gunmetal)' },
  { regex: /#222222/g, replacement: 'var(--color-soot)' },
  { regex: /#333330/g, replacement: 'var(--color-soot)' },
  { regex: /#888880/g, replacement: 'var(--color-ash)' },
  { regex: /#f0ede8/g, replacement: 'var(--color-bone-white)' },
  { regex: /#F4B400/g, replacement: 'var(--color-signal-amber)' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Before running the raw replacements, handle the Tailwind bracket syntax
      // E.g. bg-[#080808] -> bg-void-black
      content = content.replace(/bg-\[#080808\]/g, 'bg-void-black');
      content = content.replace(/bg-\[#111111\]/g, 'bg-carbon');
      content = content.replace(/bg-\[#1a1a1a\]/g, 'bg-gunmetal');
      content = content.replace(/bg-\[#222222\]/g, 'bg-soot');
      content = content.replace(/bg-\[#333330\]/g, 'bg-soot');
      content = content.replace(/bg-\[#888880\]/g, 'bg-ash');
      content = content.replace(/bg-\[#f0ede8\]/g, 'bg-bone-white');
      content = content.replace(/bg-\[#F4B400\]/g, 'bg-signal-amber');

      content = content.replace(/text-\[#080808\]/g, 'text-void-black');
      content = content.replace(/text-\[#111111\]/g, 'text-carbon');
      content = content.replace(/text-\[#1a1a1a\]/g, 'text-gunmetal');
      content = content.replace(/text-\[#222222\]/g, 'text-soot');
      content = content.replace(/text-\[#333330\]/g, 'text-soot');
      content = content.replace(/text-\[#888880\]/g, 'text-ash');
      content = content.replace(/text-\[#f0ede8\]/g, 'text-bone-white');
      content = content.replace(/text-\[#F4B400\]/g, 'text-signal-amber');
      
      content = content.replace(/border-\[#080808\]/g, 'border-void-black');
      content = content.replace(/border-\[#111111\]/g, 'border-carbon');
      content = content.replace(/border-\[#1a1a1a\]/g, 'border-gunmetal');
      content = content.replace(/border-\[#222222\]/g, 'border-soot');
      content = content.replace(/border-\[#333330\]/g, 'border-soot');
      content = content.replace(/border-\[#888880\]/g, 'border-ash');
      content = content.replace(/border-\[#f0ede8\]/g, 'border-bone-white');
      content = content.replace(/border-\[#F4B400\]/g, 'border-signal-amber');
      
      content = content.replace(/from-\[#080808\]/g, 'from-void-black');
      content = content.replace(/via-\[#080808\]/g, 'via-void-black');
      content = content.replace(/to-\[#080808\]/g, 'to-void-black');
      
      // Also some specific strings used in styling:
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDirectory(path.join(__dirname, 'components'));
processDirectory(path.join(__dirname, 'app'));

console.log('Colors replaced successfully.');
