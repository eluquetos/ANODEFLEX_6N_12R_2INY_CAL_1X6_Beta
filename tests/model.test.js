const assert=require("node:assert/strict");
const model=require("../docs/model.js");

const currents={11:1.2,12:1,21:.9,22:.9,31:.8,32:.7,41:.6,42:.5,51:.5,52:.4,61:.4,62:.3};
const cables={Rc1:.4,Rc2:.3,Rc3:.25,Rc4:.2,Rc5:.15,Rc6:.1};
const nominal=model.dimension({VA:24,VB:24,...cables,currents});
assert.deepEqual(model.NODES,[1,2,3,4,5,6]);
assert.equal(model.IDS.length,12);
const expectedVoltages={1:21.8,2:20.81,3:20.435,4:23.46,5:23.22,6:23.15};
for(const node of model.NODES)assert.ok(Math.abs(nominal.voltages[node]-expectedVoltages[node])<1e-10,`calibración V${node}`);
for(const id of model.IDS)assert.ok(Math.abs(nominal.fixed[id]*currents[id]-nominal.voltages[Number(id[0])])<1e-10,`calibración R${id}`);
assert.equal(nominal.sides.A.It,5.5);
assert.ok(Math.abs(nominal.sides.B.It-2.7)<1e-12);

const zero=Object.fromEntries(model.IDS.map(id=>[id,0]));
const operating=model.simulate({V:24,...cables,fixed:nominal.fixed,rheostats:zero});
for(const node of model.NODES){
  const outgoing=operating.currents[`${node}1`]+operating.currents[`${node}2`]+(node<6?operating.trunks[node+1]:0);
  assert.ok(Math.abs(operating.trunks[node]-outgoing)<1e-10,`KCL nodo ${node}`);
  const source=node===1?operating.V:operating.voltages[node-1];
  assert.ok(Math.abs(source-operating.voltages[node]-operating.trunks[node]*operating.cables[node])<1e-10,`KVL nodo ${node}`);
}
assert.ok(Math.abs(operating.pError)<1e-10,"balance de potencia");
assert.ok(Math.abs(operating.It-nominal.It)>1e-3,"la regulación usa una fuente, distinta de las dos mediciones");

const targets=Object.fromEntries(model.IDS.map(id=>[id,.2]));
const adjusted=model.adjust({...cables,fixed:nominal.fixed,targets,maxReo:1000});
assert.equal(adjusted.feasible,true);
assert.ok(adjusted.zero.length>=1);assert.equal(Math.min(...Object.values(adjusted.rheostats)),0);
const solved=model.simulate({V:adjusted.V,...cables,fixed:nominal.fixed,rheostats:adjusted.rheostats});
for(const id of model.IDS)assert.ok(Math.abs(solved.currents[id]-targets[id])<1e-10,`objetivo I${id}`);
const over=model.adjust({...cables,fixed:nominal.fixed,targets,maxReo:1});
assert.equal(over.feasible,false);assert.ok(over.over.length>0);
assert.throws(()=>model.dimension({VA:1,VB:24,...cables,currents}),error=>error.message==="voltage-exhausted"&&error.side==="A");
assert.throws(()=>model.dimension({VA:24,VB:.1,...cables,currents}),error=>error.message==="voltage-exhausted"&&error.side==="B");
console.log("Modelo ANODEFLEX 3 + 3 / 6 nodos: correcto");
