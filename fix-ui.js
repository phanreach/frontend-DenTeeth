const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const replaceMap = {
  'mx-auto w-full space-y-6 px-4 pt-4 pb-24 lg:px-6 lg:pb-10': 'space-y-8 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-10',
  'indigo-600': 'primary',
  'indigo-700': 'primary',
  'indigo-500': 'primary',
  'indigo-400': 'primary',
  'indigo-800': 'primary',
  'indigo-50': 'primary/5',
  'dark:text-primary': '', // Since primary adapts to dark mode automatically
  'dark:bg-primary': '',
  'dark:border-primary': '',
  'dark:hover:text-primary': '',
  'dark:hover:bg-primary': '',
  'dark:focus:border-primary': '',
  'dark:focus:ring-primary': '',
  'shadow-indigo-600': 'shadow-primary'
};

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Layout changes
  content = content.replace(/mx-auto w-full space-y-6 px-4 pt-4 pb-24 lg:px-6 lg:pb-10/g, 'space-y-8 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-10');

  // Color changes
  content = content.replace(/indigo-600/g, 'primary');
  content = content.replace(/indigo-700/g, 'primary');
  content = content.replace(/indigo-500/g, 'primary');
  content = content.replace(/indigo-400/g, 'primary');
  content = content.replace(/indigo-800/g, 'primary');
  content = content.replace(/indigo-50/g, 'primary/5');

  // Cleanup dark specific variants since primary adapts automatically
  // Use regex to replace `dark:[a-z]+-primary(/\d+)?` with empty or just remove it.
  content = content.replace(/\bdark:[a-z:-]+primary(?:\/\d+)?\b/g, '');

  // Cleanup multiple spaces
  content = content.replace(/  +/g, ' ');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

walkDir('./src/dentist', processFile);
walkDir('./src/components/dentist', processFile);
processFile('./src/components/side-bar.tsx');

console.log("Done.");
