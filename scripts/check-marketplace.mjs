#!/usr/bin/env node
/**
 * Fast, dependency-free marketplace checks.
 * Fails if skill frontmatter, command frontmatter, marketplace sources, or plugin folders drift.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

function fail(message) {
  errors.push(message);
}

function isDir(path) {
  return existsSync(path) && statSync(path).isDirectory();
}

function readJson(relPath) {
  const abs = join(repoRoot, relPath);
  if (!existsSync(abs)) {
    fail(`missing JSON: ${relPath}`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(abs, 'utf8'));
  } catch (err) {
    fail(`invalid JSON: ${relPath} (${err.message})`);
    return null;
  }
}

function parseFrontmatter(text) {
  const normalized = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) return null;
  const end = normalized.indexOf('\n---', 4);
  if (end === -1) return null;
  const yaml = normalized.slice(4, end);
  const fields = {};
  for (const line of yaml.split('\n')) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    fields[match[1]] = value;
  }
  return fields;
}

function resolveSource(source) {
  if (typeof source !== 'string' || source.trim() === '') return null;
  return resolve(repoRoot, source);
}

function pluginDirs() {
  const root = join(repoRoot, 'plugins');
  if (!isDir(root)) {
    fail('missing plugins/ directory');
    return [];
  }
  return readdirSync(root)
    .filter((name) => !name.startsWith('.') && isDir(join(root, name)))
    .sort();
}

function skillFolders(pluginName) {
  const skillsRoot = join(repoRoot, 'plugins', pluginName, 'skills');
  if (!isDir(skillsRoot)) return [];
  return readdirSync(skillsRoot)
    .filter((name) => !name.startsWith('.') && isDir(join(skillsRoot, name)))
    .sort();
}

function commandMarkdownFiles(pluginName) {
  const commandsRoot = join(repoRoot, 'plugins', pluginName, 'commands');
  if (!isDir(commandsRoot)) return [];
  const files = [];
  for (const name of readdirSync(commandsRoot).sort()) {
    if (name.startsWith('.')) continue;
    const abs = join(commandsRoot, name);
    if (statSync(abs).isDirectory()) {
      fail(`commands must be flat .md files: plugins/${pluginName}/commands/${name}/`);
      continue;
    }
    if (!name.endsWith('.md')) {
      fail(`commands must be .md files: plugins/${pluginName}/commands/${name}`);
      continue;
    }
    files.push(name);
  }
  return files;
}

function loadMarketplace(relPath) {
  const data = readJson(relPath);
  if (!data) return { relPath, plugins: [] };
  if (!Array.isArray(data.plugins)) {
    fail(`${relPath}: plugins must be an array`);
    return { relPath, plugins: [] };
  }
  return { relPath, plugins: data.plugins };
}

const cursorMarket = loadMarketplace('.cursor-plugin/marketplace.json');
const claudeMarket = loadMarketplace('.claude-plugin/marketplace.json');
const dirs = pluginDirs();
const dirSet = new Set(dirs);

function checkMarketplace({ relPath, plugins }) {
  const names = [];
  const sources = [];
  for (const plugin of plugins) {
    const name = plugin?.name;
    const source = plugin?.source;
    if (!name) fail(`${relPath}: plugin missing name`);
    else names.push(name);
    const abs = resolveSource(source);
    if (!abs) {
      fail(`${relPath}: plugin ${name ?? '(unnamed)'} missing source`);
      continue;
    }
    sources.push(abs);
    if (!isDir(abs)) {
      fail(`${relPath}: source does not exist: ${source}`);
      continue;
    }
    const folder = abs.slice(resolve(repoRoot, 'plugins').length).replace(/^[/\\]/, '');
    if (!dirSet.has(folder)) {
      fail(`${relPath}: source ${source} is not a plugins/* folder`);
    }
    if (!existsSync(join(abs, '.cursor-plugin', 'plugin.json'))) {
      fail(`${relPath}: ${source} missing .cursor-plugin/plugin.json`);
    }
    if (!existsSync(join(abs, '.claude-plugin', 'plugin.json'))) {
      fail(`${relPath}: ${source} missing .claude-plugin/plugin.json`);
    }
    if (!isDir(join(abs, 'skills'))) {
      fail(`${relPath}: ${source} missing skills/`);
    }
  }
  return { names: new Set(names), sources };
}

const cursor = checkMarketplace(cursorMarket);
const claude = checkMarketplace(claudeMarket);

for (const name of cursor.names) {
  if (!claude.names.has(name)) fail(`plugin ${name} is in Cursor marketplace but not Claude`);
}
for (const name of claude.names) {
  if (!cursor.names.has(name)) fail(`plugin ${name} is in Claude marketplace but not Cursor`);
}

function foldersFrom(market) {
  const folders = new Set();
  for (const plugin of market.plugins) {
    const abs = resolveSource(plugin?.source);
    if (!abs || !isDir(abs)) continue;
    const folder = abs.slice(resolve(repoRoot, 'plugins').length).replace(/^[/\\]/, '');
    if (folder) folders.add(folder);
  }
  return folders;
}

const cursorFolders = foldersFrom(cursorMarket);
const claudeFolders = foldersFrom(claudeMarket);

for (const dir of dirs) {
  if (!cursorFolders.has(dir)) fail(`plugins/${dir} is not listed in the Cursor marketplace`);
  if (!claudeFolders.has(dir)) fail(`plugins/${dir} is not listed in the Claude marketplace`);
}

let skillCount = 0;
let commandCount = 0;
const counts = {};
const commandCounts = {};
for (const pluginName of dirs) {
  const skills = skillFolders(pluginName);
  counts[pluginName] = skills.length;
  skillCount += skills.length;
  for (const skillName of skills) {
    const skillMd = join(repoRoot, 'plugins', pluginName, 'skills', skillName, 'SKILL.md');
    const rel = `plugins/${pluginName}/skills/${skillName}/SKILL.md`;
    if (!existsSync(skillMd)) {
      fail(`skill folder missing SKILL.md: ${rel}`);
      continue;
    }
    const fields = parseFrontmatter(readFileSync(skillMd, 'utf8'));
    if (!fields) {
      fail(`${rel}: missing YAML frontmatter`);
      continue;
    }
    if (!fields.name) fail(`${rel}: frontmatter missing name`);
    if (!fields.description) fail(`${rel}: frontmatter missing description`);
  }

  const commands = commandMarkdownFiles(pluginName);
  commandCounts[pluginName] = commands.length;
  commandCount += commands.length;
  for (const file of commands) {
    const rel = `plugins/${pluginName}/commands/${file}`;
    const fields = parseFrontmatter(readFileSync(join(repoRoot, rel), 'utf8'));
    if (!fields) {
      fail(`${rel}: missing YAML frontmatter`);
      continue;
    }
    if (!fields.description) fail(`${rel}: frontmatter missing description`);
  }
}

if (cursorFolders.size !== dirs.length) {
  fail(
    `Cursor marketplace plugin folders (${cursorFolders.size}) do not match plugins/ (${dirs.length})`,
  );
}
if (claudeFolders.size !== dirs.length) {
  fail(
    `Claude marketplace plugin folders (${claudeFolders.size}) do not match plugins/ (${dirs.length})`,
  );
}

if (cursor.names.size !== dirs.length) {
  fail(
    `Cursor marketplace plugin count (${cursor.names.size}) does not match plugins/ folders (${dirs.length})`,
  );
}
if (claude.names.size !== dirs.length) {
  fail(
    `Claude marketplace plugin count (${claude.names.size}) does not match plugins/ folders (${dirs.length})`,
  );
}

console.log('plugins:', dirs.join(', ') || '(none)');
for (const [pluginName, count] of Object.entries(counts)) {
  const cmds = commandCounts[pluginName] ?? 0;
  const cmdPart = cmds ? `, ${cmds} command${cmds === 1 ? '' : 's'}` : '';
  console.log(`  ${pluginName}: ${count} skill${count === 1 ? '' : 's'}${cmdPart}`);
}
console.log(`total skills: ${skillCount}`);
console.log(`total commands: ${commandCount}`);

if (errors.length) {
  console.error('\ncheck-marketplace failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('ok');
