const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"../docs"),html=fs.readFileSync(path.join(root,"index.html"),"utf8"),app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const ids=["11","12","21","22","31","32","41","42","51","52","61","62"];
for(const file of ["styles.css","model.js","app.js","manifest.webmanifest","favicon.svg","icon-192.svg","icon-512.svg","sw.js"])assert.ok(fs.existsSync(path.join(root,file)),`${file} ausente`);
for(const id of ["nom-va","nom-vb","live-v","calculate-fixed","assist","save-case","load-case","print-report","install-app",...Array.from({length:6},(_,i)=>`nom-v${i+1}`),...ids.map(id=>`nom-i${id}`),...ids.map(id=>`fixed-r${id}`)])assert.ok(html.includes(`id="${id}"`),`${id} ausente`);
for(const id of ["nom-va","nom-vb","live-v",...ids.map(id=>`nom-i${id}`)])assert.match(html,new RegExp(`id="${id}"[^>]*step="0\\.01"`),`${id} debe variar en centésimas`);
for(const node of [2,3,4,5,6])assert.ok(html.includes(`id="res-i${node}"`));
for(const node of [1,2,3,4,5,6])assert.ok(html.includes(`id="res-dv${node}"`));
assert.ok(html.includes("Nodos 1, 2 y 3")&&html.includes("Nodos 4, 5 y 6"));
assert.ok(html.includes("Una sola inyección alimenta los seis nodos"));
assert.ok(app.includes('const ids=nodes.flatMap(node=>[`${node}1`,`${node}2`])'));
assert.ok(app.includes('id="system-r-${id}"')&&app.includes('id="reo-power-${id}"'));
assert.ok(!html.includes('type="range"'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,"manifest.webmanifest"),"utf8"));
assert.equal(manifest.display,"standalone");assert.equal(manifest.short_name,"ANODEFLEX Beta");
assert.ok(app.includes('$("live-v").value=result.V'));assert.ok(html.includes("la aplicación calcula el voltaje mínimo y los reóstatos"));
for(const file of ["styles.css","app.js"])assert.ok(html.includes(`${file}?v=5`));assert.ok(html.includes("model.js?v=4"));
assert.ok(fs.readFileSync(path.join(root,"sw.js"),"utf8").includes("anodeflex-6n-voltajes-beta-v2"));
console.log("Archivos de la app ANODEFLEX 3 + 3: correctos");

for(const node of [1,2,3,4,5,6]){assert.ok(html.includes(`id="cable-r${node}"`));assert.ok(!html.includes(`id="rc${node}"`));}
