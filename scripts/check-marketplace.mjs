#!/usr/bin/env node
/**
 * Fast, dependency-free marketplace checks.
 * Fails if skill or command frontmatter, description length, command references,
 * marketplace sources, or plugin folders drift.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const MAX_DESCRIPTION = 300;

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

function commandFiles(pluginName) {
  const root = join(repoRoot, 'plugins', pluginName, 'commands');
  if (!isDir(root)) return [];
  const files = [];
  for (const name of readdirSync(root).sort()) {
    if (name.startsWith('.')) continue;
    if (statSync(join(root, name)).isDirectory() || !name.endsWith('.md')) {
      fail(`commands must be flat .md files: plugins/${pluginName}/commands/${name}`);
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
const counts = {};
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
    else if (fields.name !== skillName) fail(`${rel}: name "${fields.name}" does not match folder`);
    if (!fields.description) fail(`${rel}: frontmatter missing description`);
    else if (fields.description.length > MAX_DESCRIPTION) {
      fail(
        `${rel}: description is ${fields.description.length} chars (max ${MAX_DESCRIPTION}). ` +
          'It is in context on every turn — cut it to the trigger.',
      );
    }
  }

}

const allSkills = new Set(dirs.flatMap(skillFolders));
const commandsByPlugin = Object.fromEntries(dirs.map((p) => [p, commandFiles(p)]));
const allCommands = new Set(Object.values(commandsByPlugin).flat().map((f) => f.replace(/\.md$/, '')));
let commandCount = 0;

for (const [pluginName, files] of Object.entries(commandsByPlugin)) {
  commandCount += files.length;
  for (const file of files) {
    const rel = `plugins/${pluginName}/commands/${file}`;
    const body = readFileSync(join(repoRoot, rel), 'utf8');
    const name = file.replace(/\.md$/, '');
    const fields = parseFrontmatter(body);
    if (!fields) {
      fail(`${rel}: missing YAML frontmatter`);
      continue;
    }
    if (!fields.description) fail(`${rel}: frontmatter missing description`);
    if (fields['disable-model-invocation'] !== 'true') {
      fail(
        `${rel}: needs \`disable-model-invocation: true\` so its description stays out of the ` +
          'model context until the user runs it.',
      );
    }
    if (allSkills.has(name)) {
      fail(`${rel}: command "${name}" shares a skill's name and would shadow it — rename the command.`);
    }
    if (/`skills\/[^`]*SKILL\.md`/.test(body)) {
      fail(`${rel}: points at a relative SKILL.md path, which resolves against the user's project. Name the skill.`);
    }
    for (const [, ref] of body.matchAll(/the `([a-z0-9-]+)` skill/g)) {
      if (!allSkills.has(ref)) fail(`${rel}: references skill \`${ref}\`, which does not exist.`);
    }
    for (const [, ref] of body.matchAll(/the `([a-z0-9-]+)` command/g)) {
      if (!allCommands.has(ref)) fail(`${rel}: references command \`${ref}\`, which does not exist.`);
    }
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
  const cmds = commandsByPlugin[pluginName].length;
  console.log(`  ${pluginName}: ${count} skill${count === 1 ? '' : 's'}, ${cmds} command${cmds === 1 ? '' : 's'}`);
}
console.log(`total skills: ${skillCount}`);
console.log(`total commands: ${commandCount}`);

if (errors.length) {
  console.error('\ncheck-marketplace failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('ok');
