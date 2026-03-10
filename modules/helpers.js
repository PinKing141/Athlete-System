import { C } from "./constants";

// ── HELPERS ───────────────────────────────────────────────────────────────────
export const injC = (v) => v<=1?"#22C55E":v===2?"#86EFAC":v===3?C.gold:v===4?"#F97316":C.red;
export const pctC = (p) => p>=0.45?C.green:p>=0.35?C.gold:C.red;
export const fmt = (v,d=1) => isNaN(v)||v===null?"—":Number(v).toFixed(d);
export const avg = (arr,fn) => arr.length?arr.reduce((a,x)=>a+(fn(x)||0),0)/arr.length:0;

export function calcVolume(sets) {
  let v = 0;
  Object.values(sets||{}).forEach(ex => Object.values(ex||{}).forEach(s => { v += (Number(s.w)||0)*(Number(s.r)||0); }));
  return v;
}

export function findPRs(sessions) {
  const prs = {};
  sessions.forEach(s => {
    Object.entries(s.sets||{}).forEach(([ex,sets]) => {
      Object.values(sets||{}).forEach(set => {
        const w = Number(set.w)||0;
        if (!prs[ex] || w > prs[ex].w) prs[ex] = { w, date:s.date };
      });
    });
  });
  return prs;
}

export function getReadiness(wellness) {
  if (!wellness) return null;
  return Math.round(((6-wellness.fatigue)+(6-wellness.soreness)+(6-wellness.stress)+wellness.motivation+wellness.sleep)/5*20);
}

export function detectFatigue(gymSessions, wellnessSessions) {
  if (gymSessions.length < 2) return { score:0, flags:[] };
  const last3gym = gymSessions.slice(-3);
  const lastWell = wellnessSessions.slice(-1)[0];
  const flags = [];
  const avgInj = avg(last3gym, s=>(s.inj.a+s.inj.s+s.inj.h)/3);
  const avgEnergy = avg(last3gym, s=>s.energy);
  if (avgInj > 3) flags.push({ type:"warn", text:"Injury scores elevated. Reduce plyometric volume by 30%." });
  if (avgEnergy < 5) flags.push({ type:"warn", text:"Energy consistently low. Check sleep. Consider a deload day." });
  if (lastWell && lastWell.fatigue >= 4) flags.push({ type:"warn", text:"Fatigue score critical. Active recovery only today." });
  if (lastWell && lastWell.sleep <= 2) flags.push({ type:"warn", text:"Poor sleep logged. Avoid max effort training today." });
  return { score:Math.round(avgInj*20+Math.max(0,5-avgEnergy)*10), flags };
}
