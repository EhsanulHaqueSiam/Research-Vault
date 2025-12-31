
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(process.cwd(), 'app/src');
const IGNORE_PATTERNS = [
    'vite-env.d.ts',
    'main.tsx',
    'test',
    'types',
    '.test.',
    '.spec.',
    'stories'
];

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if ((file.endsWith('.ts') || file.endsWith('.tsx')) && !file.endsWith('.d.ts')) {
                arrayOfFiles.push(path.join(dirPath, file));
            }
        }
    });

    return arrayOfFiles;
}

function getImports(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    // Regex to match imports and exports with sources
    // Matches:
    // import ... from '...'
    // export ... from '...'
    // import('...')
    // require('...')
    const importRegex = /(?:import|export)\s+(?:[\s\S]*?from\s+)?['"]([^'"]+)['"]|require\(['"]([^'"]+)['"]\)|import\(['"]([^'"]+)['"]\)/g;

    const imports = [];
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1] || match[2] || match[3];
        if (importPath && !importPath.startsWith('.')) {
            // Handle alias imports if needed, but for now focus on relative to catch local orphans
            if (importPath.startsWith('@/')) {
                imports.push(importPath);
            }
        } else if (importPath) {
            imports.push(importPath);
        }
    }
    return imports;
}

function resolveImport(sourceFile, importPath) {
    let targetPath = '';

    if (importPath.startsWith('@/')) {
        targetPath = path.join(ROOT_DIR, importPath.substring(2));
    } else {
        targetPath = path.resolve(path.dirname(sourceFile), importPath);
    }

    // Try extensions
    const extensions = ['', '.ts', '.tsx', '/index.ts', '/index.tsx'];
    for (const ext of extensions) {
        const fullPath = targetPath + ext;
        if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
            return fullPath;
        }
    }
    return null;
}

const allFiles = getAllFiles(ROOT_DIR, []);
const fileSet = new Set(allFiles);
const importedFiles = new Set();

// Always assume main.tsx is used (entry point)
const entryPoint = path.join(ROOT_DIR, 'main.tsx');
importedFiles.add(entryPoint);

allFiles.forEach(file => {
    const imports = getImports(file);
    imports.forEach(imp => {
        const resolved = resolveImport(file, imp);
        if (resolved) {
            importedFiles.add(resolved);
        }
    });
});

const unusedFiles = allFiles.filter(file => !importedFiles.has(file));

console.log('--- ORPHANED FILES REPORT ---');
console.log(`Total Files Scanned: ${allFiles.length}`);
console.log(`Orphaned Files Found: ${unusedFiles.length}`);
console.log('\nList of Orphaned Files (Potential Disconnects):');
unusedFiles.forEach(file => {
    // Filter out some common false positives like index.ts files that might be entry points for libraries
    // But for an app, usually everything should be reachable from main.tsx
    const relative = path.relative(ROOT_DIR, file);
    if (!IGNORE_PATTERNS.some(p => relative.includes(p))) {
        console.log(relative);
    }
});
