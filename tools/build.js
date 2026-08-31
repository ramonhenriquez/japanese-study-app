// Dependency-free bundler. Wraps each ES module in its own scope and resolves imports
// through a tiny registry, so the whole app collapses into one file that runs from
// file:// with no server, no build tools and no network.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src');
const DIST = path.join(__dirname, '..', 'dist');

const modules = new Map();     // 'engine/srs.js' -> transformed source

function resolve(from, spec) {
  const dir = path.dirname(from);
  return path.normalize(path.join(dir, spec)).split(path.sep).join('/');
}

function transform(rel) {
  if (modules.has(rel)) return;
  modules.set(rel, null);                                  // reserve (guards cycles)
  // Collapse multi-line import/export blocks so the line-based transform below sees one statement per line.
  const src = fs.readFileSync(path.join(SRC, rel), 'utf8')
    .replace(/^(import|export)\s*\{[\s\S]*?\}\s*(from\s*['"][^'"]+['"])?;?/gm,
             m => m.replace(/\s*\n\s*/g, ' ').replace(/\{\s+/, '{ ').replace(/\s+\}/, ' }'));
  const exported = new Set();
  const deps = [];

  const out = src.split('\n').map(line => {
    let m;
    if ((m = line.match(/^import\s*\{([^}]*)\}\s*from\s*['"]([^'"]+)['"];?\s*$/))) {
      const dep = resolve(rel, m[2]); deps.push(dep);
      return `const {${m[1].trim()}} = __req(${JSON.stringify(dep)});`;
    }
    if ((m = line.match(/^import\s+\*\s+as\s+(\w+)\s+from\s*['"]([^'"]+)['"];?\s*$/))) {
      const dep = resolve(rel, m[2]); deps.push(dep);
      return `const ${m[1]} = __req(${JSON.stringify(dep)});`;
    }
    if ((m = line.match(/^import\s+['"]([^'"]+)['"];?\s*$/))) {
      const dep = resolve(rel, m[1]); deps.push(dep);
      return `__req(${JSON.stringify(dep)});`;
    }
    if ((m = line.match(/^export\s+const\s+(\w+)/)))    { exported.add(m[1]); return line.replace(/^export\s+/, ''); }
    if ((m = line.match(/^export\s+let\s+(\w+)/)))      { exported.add(m[1]); return line.replace(/^export\s+/, ''); }
    if ((m = line.match(/^export\s+function\s+(\w+)/))) { exported.add(m[1]); return line.replace(/^export\s+/, ''); }
    if ((m = line.match(/^export\s+class\s+(\w+)/)))    { exported.add(m[1]); return line.replace(/^export\s+/, ''); }
    if ((m = line.match(/^export\s*\{([^}]*)\};?\s*$/))) {
      for (const n of m[1].split(',')) {
        const name = n.trim().split(/\s+as\s+/).pop().trim();
        if (name) exported.add(name);
      }
      return '';
    }
    if (/^export\s+default/.test(line)) throw new Error(`${rel}: default exports are not supported by this bundler`);
    if (/^\s*import\s/.test(line) && !/^\s*\/\//.test(line)) throw new Error(`${rel}: unhandled import form → ${line}`);
    return line;
  }).join('\n');

  for (const d of deps) transform(d);

  const tail = exported.size
    ? `\n__exports.__set({${[...exported].join(', ')}});\n`
    : '\n';
  modules.set(rel, `__def(${JSON.stringify(rel)}, function(__req, __exports){\n${out}${tail}});`);
}

transform('app.js');

const runtime = `
(function(){
  var __factories = {}, __cache = {};
  function __def(id, fn){ __factories[id] = fn; }
  function __req(id){
    if (__cache[id]) return __cache[id].values;
    var box = { values: {} };
    box.values.__set = function(o){ for (var k in o) box.values[k] = o[k]; };
    __cache[id] = box;
    __factories[id](__req, box.values);
    delete box.values.__set;
    return box.values;
  }
  __RUNTIME_BODY__
  __req('app.js');
})();
`;

const body = [...modules.values()].join('\n\n');
const bundle = runtime.replace('__RUNTIME_BODY__', body);
const css = fs.readFileSync(path.join(SRC, 'styles.css'), 'utf8');
const html = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');

const head = html.match(/<link rel="icon"[^>]*>/)[0];
const fonts = html.match(/<link rel="stylesheet" href="https:\/\/fonts[^>]*>/)[0];
const preconnects = (html.match(/<link rel="preconnect"[^>]*>/g) || []).join('\n');

fs.mkdirSync(DIST, { recursive: true });

// 1. standalone document — double-click to run, works offline from file://
fs.writeFileSync(path.join(DIST, 'index.html'), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#2F4B7C">
${head}
<title>日本語 — Japanese study</title>
${preconnects}
${fonts}
<style>
${css}
</style>
</head>
<body>
<div id="app"></div>
<script>
${bundle}
</script>
</body>
</html>
`);

// 2. artifact flavour — the host supplies the document skeleton
fs.writeFileSync(path.join(DIST, 'artifact.html'), `<title>日本語 Study</title>
${preconnects}
${fonts}
<style>
${css}
</style>
<div id="app"></div>
<script>
${bundle}
</script>
`);

const kb = f => (fs.statSync(path.join(DIST, f)).size / 1024).toFixed(0) + ' KB';
console.log(`bundled ${modules.size} modules`);
console.log(`  dist/index.html    ${kb('index.html')}  (standalone, opens from file://)`);
console.log(`  dist/artifact.html ${kb('artifact.html')}`);
