const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('docs/index.html','utf8'),elements={};
function element(id){return elements[id]??=( {id,_value:'',get value(){return this._value},set value(v){this._value=String(v)},textContent:'',innerHTML:'',className:'',hidden:false,addEventListener(){},click(){}} )}
for(const m of html.matchAll(/<input id="([^"]+)"[^>]*value="([^"]*)"/g))element(m[1]).value=m[2];
const store={};const sandbox={document:{getElementById:element},window:{addEventListener(){},print(){}},navigator:{},localStorage:{setItem(k,v){store[k]=v},getItem(k){return store[k]}},AnodeflexModel:require('../docs/model.js'),FileReader:class{readAsText(file){this.result=file;this.onload()}},console};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync('docs/app.js','utf8'),sandbox);
let saved=vm.runInContext('caseData()',sandbox);assert.equal(saved.format,'anodeflex-6n-voltajes-beta-case');assert.equal(saved.calibration.voltages[3],20.435);assert.ok(Math.abs(saved.calibration.cables[3]-.25)<1e-10);
element('nom-v1').value='23';element('nom-v2').value='24';vm.runInContext('computeFixed()',sandbox);assert.match(element('message').textContent,/supera/);
sandbox.file=JSON.stringify(saved);vm.runInContext('loadCase(file)',sandbox);assert.equal(element('nom-v1').value,'21.8');assert.equal(element('nom-v3').value,'20.435');assert.match(element('cable-r3').textContent,/0,250/);assert.match(element('message').textContent,/importado/);
const after=vm.runInContext('caseData()',sandbox);assert.equal(after.calibration.VA,saved.calibration.VA);assert.equal(after.calibration.VB,saved.calibration.VB);assert.equal(after.calibration.voltages[3],saved.calibration.voltages[3]);assert.ok(Math.abs(after.calibration.cables[3]-saved.calibration.cables[3])<1e-12);
console.log('Calibración, validación y exportación/importación: correctas');


const targets=Array.from({length:6},(_,i)=>[`${i+1}1`,`${i+1}2`]).flat();
element('reo-11').value='2.5';element('common-current').value='0.325';vm.runInContext('applyCommonCurrent()',sandbox);
for(const id of targets)assert.equal(element('target-'+id).value,'0.325');assert.equal(element('reo-11').value,'2.5');
for(const value of ['', '0', '-1']){element('common-current').value=value;vm.runInContext('applyCommonCurrent()',sandbox);assert.match(element('common-current-message').textContent,/mayor que cero/);for(const id of targets)assert.equal(element('target-'+id).value,'0.325')}
vm.runInContext('assistedAdjustment()',sandbox);assert.match(element('message').textContent,/Ajuste calculado/);for(const id of targets)assert.ok(Math.abs(vm.runInContext(`state.op.currents["${id}"]`,sandbox)-.325)<.0002,`corriente ${id}`);
