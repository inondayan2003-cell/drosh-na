#!/usr/bin/env node
/*
  data.js (web) is the single source of truth for DROSH_DATA.
  This script regenerates mobile/src/data/droshData.js from it, so content
  is only ever authored once. Run after every edit to data.js:

    node scripts/sync-data.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'data.js');
const OUT = path.join(ROOT, 'mobile', 'src', 'data', 'droshData.js');

const src = fs.readFileSync(SRC, 'utf8');
const m = src.match(/window\.DROSH_DATA\s*=\s*([\s\S]*?);\s*$/);
if (!m) {
  console.error('Could not find "window.DROSH_DATA = {...};" in data.js');
  process.exit(1);
}

// eslint-disable-next-line no-new-func
const DROSH_DATA = new Function(`return (${m[1]});`)();

const parashaCount = Object.keys(DROSH_DATA.parashot).length;
const topicCount = DROSH_DATA.topics.length;
const holidayCount = DROSH_DATA.holidays ? Object.keys(DROSH_DATA.holidays).length : 0;

function serialize(value, indent) {
  return JSON.stringify(value, null, 2)
    .split('\n')
    .join('\n' + ' '.repeat(0))
    .replace(/^/gm, indent === 0 ? '' : '');
}

const header = `/*
  מאגר הדרשות של דרוש-נא — נוצר אוטומטית מ-data.js (המקור היחיד).
  אל תערוך קובץ זה ידנית — הרץ \`node scripts/sync-data.js\` מהשורש אחרי כל עריכה ב-data.js.
*/
export const DROSH_DATA = `;

const body = JSON.stringify(DROSH_DATA, null, 2) + ';\n';

fs.writeFileSync(OUT, header + body);

console.log(`Synced ${parashaCount} parashot, ${topicCount} topics, ${holidayCount} holidays -> ${path.relative(ROOT, OUT)}`);
