#!/usr/bin/env node

/**
 * Auto-generate documentation using Claude API
 *
 * This script reads docs.config.json and generates documentation
 * based on the descriptions provided and the current codebase.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { execSync } from 'child_process';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const FORCE_REGENERATE = process.env.FORCE_REGENERATE === 'true';

if (!ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY is required');
  process.exit(1);
}

// Load the docs configuration
function loadConfig() {
  const configPath = join(process.cwd(), 'docs.config.json');
  if (!existsSync(configPath)) {
    console.log('ℹ️  No docs.config.json found, skipping documentation generation');
    process.exit(0);
  }
  return JSON.parse(readFileSync(configPath, 'utf-8'));
}

// Get changed files from git (comparing to base branch)
function getChangedFiles() {
  try {
    // Get the base branch (usually main or master)
    const baseBranch = execSync('git remote show origin | grep "HEAD branch" | cut -d: -f2 | tr -d " "', { encoding: 'utf-8' }).trim() || 'main';

    // Fetch the base branch
    try {
      execSync(`git fetch origin ${baseBranch}`, { stdio: 'pipe' });
    } catch {
      // May fail in some CI environments, continue anyway
    }

    // Get diff
    const diff = execSync(`git diff --name-only origin/${baseBranch}...HEAD 2>/dev/null || git diff --name-only HEAD~10...HEAD`, { encoding: 'utf-8' });
    return diff.split('\n').filter(f => f.trim());
  } catch (error) {
    console.log('⚠️  Could not get changed files, will analyze full codebase');
    return null;
  }
}

// Recursively get all source files
function getAllSourceFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx', '.md']) {
  const files = [];
  const ignoreDirs = ['node_modules', '.next', '.git', 'dist', 'build', '.github'];

  function walk(currentDir) {
    const entries = readdirSync(currentDir);
    for (const entry of entries) {
      const fullPath = join(currentDir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        if (!ignoreDirs.includes(entry)) {
          walk(fullPath);
        }
      } else if (extensions.some(ext => entry.endsWith(ext))) {
        files.push(relative(process.cwd(), fullPath));
      }
    }
  }

  walk(dir);
  return files;
}

// Read file contents for context
function readFileContents(files, maxSize = 100000) {
  const contents = [];
  let totalSize = 0;

  for (const file of files) {
    const filePath = join(process.cwd(), file);
    if (!existsSync(filePath)) continue;

    try {
      const content = readFileSync(filePath, 'utf-8');
      if (totalSize + content.length > maxSize) {
        console.log(`⚠️  Reached context limit, included ${contents.length} files`);
        break;
      }
      contents.push({ path: file, content });
      totalSize += content.length;
    } catch {
      // Skip files that can't be read
    }
  }

  return contents;
}

// Call Claude API
async function callClaude(prompt, systemPrompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

// Generate documentation for a single target
async function generateDoc(target, codeContext, config) {
  console.log(`\n📝 Generating: ${target.output}`);

  const systemPrompt = `You are a technical documentation writer. Generate clear, accurate documentation based on the provided code context.

Project: ${config.projectName || 'Unknown Project'}
${config.projectDescription ? `Description: ${config.projectDescription}` : ''}

Rules:
- Be accurate and base documentation ONLY on the actual code provided
- Match the requested output format exactly (markdown, TSX component, etc.)
- Keep documentation concise but comprehensive
- Use proper formatting and structure
- If generating a TSX page component, ensure it's a valid Next.js page component
- Do not invent features that don't exist in the code`;

  const prompt = `Generate documentation for: ${target.description}

Output format: ${target.format || 'markdown'}
Output file: ${target.output}

${target.template ? `Use this as a template/structure guide:\n${target.template}\n` : ''}
${target.instructions ? `Additional instructions:\n${target.instructions}\n` : ''}

Here is the relevant code context:

${codeContext.map(f => `--- ${f.path} ---\n${f.content}`).join('\n\n')}

Generate the documentation now. Output ONLY the file contents, no explanations or markdown code blocks around it.`;

  const content = await callClaude(prompt, systemPrompt);

  // Clean up any accidental code blocks
  let cleanContent = content;
  if (cleanContent.startsWith('```')) {
    cleanContent = cleanContent.replace(/^```\w*\n/, '').replace(/\n```$/, '');
  }

  return cleanContent;
}

// Check if a doc target should be regenerated based on changed files
function shouldRegenerate(target, changedFiles) {
  if (FORCE_REGENERATE) return true;
  if (!changedFiles) return true;

  // Check if the output file was changed (skip regenerating if manually edited)
  if (changedFiles.includes(target.output)) {
    console.log(`⏭️  Skipping ${target.output} (manually modified in this PR)`);
    return false;
  }

  // Check if any watched paths were changed
  if (target.watchPaths) {
    const watchPatterns = target.watchPaths;
    for (const changed of changedFiles) {
      for (const pattern of watchPatterns) {
        // Simple glob matching
        const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
        if (regex.test(changed)) {
          return true;
        }
      }
    }
    console.log(`⏭️  Skipping ${target.output} (no relevant changes)`);
    return false;
  }

  // If no watchPaths specified, regenerate if any code changed
  return changedFiles.some(f =>
    f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx')
  );
}

// Main execution
async function main() {
  console.log('🚀 Starting documentation generation...\n');

  const config = loadConfig();
  const changedFiles = FORCE_REGENERATE ? null : getChangedFiles();

  if (changedFiles) {
    console.log(`📊 Detected ${changedFiles.length} changed files`);
  }

  // Get relevant source files for context
  const sourceFiles = getAllSourceFiles(process.cwd());
  console.log(`📁 Found ${sourceFiles.length} source files\n`);

  // Filter and prioritize files
  const priorityFiles = sourceFiles.filter(f =>
    f.includes('lib/') ||
    f.includes('app/') ||
    f.endsWith('page.tsx') ||
    f.includes('components/') ||
    f === 'README.md' ||
    f === 'AGENTS.md'
  );

  const codeContext = readFileContents(priorityFiles);

  let generatedCount = 0;

  for (const target of config.targets || []) {
    if (!shouldRegenerate(target, changedFiles)) {
      continue;
    }

    try {
      // Filter context based on target's sourcePaths if specified
      let targetContext = codeContext;
      if (target.sourcePaths) {
        targetContext = codeContext.filter(f =>
          target.sourcePaths.some(pattern => {
            const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
            return regex.test(f.path);
          })
        );
      }

      const content = await generateDoc(target, targetContext, config);

      // Write the output file
      const outputPath = join(process.cwd(), target.output);
      writeFileSync(outputPath, content, 'utf-8');
      console.log(`✅ Generated: ${target.output}`);
      generatedCount++;

      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 1000));

    } catch (error) {
      console.error(`❌ Failed to generate ${target.output}: ${error.message}`);
    }
  }

  console.log(`\n🎉 Documentation generation complete! Generated ${generatedCount} files.`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
