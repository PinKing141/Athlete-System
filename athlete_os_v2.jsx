import { useState, useEffect, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, AreaChart, Area } from "recharts";

// ── PERSISTENCE ───────────────────────────────────────────────────────────────
function usePersist(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [val, key]);
  return [val, setVal];
}

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const C = {
  bg: "#07101A", card: "#0C1920", border: "#162433", borderHover: "#243550",
  orange: "#E85D04", orangeDim: "#E85D0420", gold: "#FFB703",
  green: "#22C55E", greenDim: "#22C55E20", greenDark: "#15803D",
  blue: "#3B82F6", purple: "#A78BFA", red: "#EF4444",
  text: "#E2E8F0", textMid: "#94A3B8", textDim: "#475569",
  W1: "#E85D04", W2: "#2563EB", W3: "#16A34A", W4: "#7C3AED",
};

const TYPE_C = {
  Barbell:["#1E3A5C","#60A5FA"], Dumbbell:["#14532D","#4ADE80"],
  Machine:["#1F2937","#9CA3AF"], Explosive:["#431407","#FB923C"],
  Bodyweight:["#1A2E1A","#86EFAC"], Cable:["#2E1A4A","#C084FC"],
  Aesthetic:["#3D2B00","#FCD34D"], Core:["#1E1B4B","#818CF8"],
};

// ── WORKOUT DATA ──────────────────────────────────────────────────────────────
const WORKOUTS = {
  W1:{ label:"Workout 1", sub:"Upper Strength + Power", color:C.W1,
    exercises:[
      {name:"Push Press",type:"Barbell",sets:4,reps:"4",rest:"2 min",kg:true},
      {name:"Bench Press",type:"Barbell",sets:4,reps:"5–6",rest:"2–3 min",kg:true},
      {name:"Assisted Pull-Up Machine",type:"Machine",sets:4,reps:"6–8",rest:"2 min",kg:true},
      {name:"Barbell Rows",type:"Barbell",sets:3,reps:"8",rest:"90 sec",kg:true},
      {name:"Landmine Rotational Press",type:"Barbell",sets:3,reps:"6/side",rest:"90 sec",kg:true},
      {name:"Face Pulls",type:"Cable",sets:3,reps:"15",rest:"45 sec",kg:true},
      {name:"Farmer Carries",type:"Dumbbell",sets:3,reps:"35m",rest:"90 sec",kg:true},
      {name:"EZ Bar Bicep Curl",type:"Aesthetic",sets:3,reps:"10",rest:"60 sec",kg:true},
      {name:"Tricep Pushdown",type:"Aesthetic",sets:3,reps:"12",rest:"60 sec",kg:true},
      {name:"Lateral Raise",type:"Aesthetic",sets:3,reps:"15",rest:"45 sec",kg:true},
      {name:"Dumbbell Shrug",type:"Aesthetic",sets:3,reps:"15",rest:"45 sec",kg:true},
      {name:"Back Extension",type:"Core",sets:3,reps:"12",rest:"60 sec",kg:false},
      {name:"Bird Dog",type:"Core",sets:3,reps:"8/side",rest:"60 sec",kg:false},
    ]},
  W2:{ label:"Workout 2", sub:"Lower Force + Braking", color:C.W2,
    exercises:[
      {name:"Box Jump — Step Down",type:"Explosive",sets:4,reps:"4",rest:"2 min",kg:false},
      {name:"Back Squat",type:"Barbell",sets:4,reps:"5",rest:"3 min",kg:true},
      {name:"Romanian Deadlift",type:"Barbell",sets:3,reps:"6",rest:"2 min",kg:true},
      {name:"Bulgarian Split Squat",type:"Dumbbell",sets:3,reps:"8/leg",rest:"90 sec",kg:true},
      {name:"Hip Abductor Machine",type:"Machine",sets:3,reps:"15",rest:"60 sec",kg:true},
      {name:"Hip Adductor Machine",type:"Machine",sets:3,reps:"15",rest:"60 sec",kg:true},
      {name:"Snap Down — Stick",type:"Explosive",sets:3,reps:"5",rest:"Full",kg:false},
      {name:"Tibialis Raises",type:"Bodyweight",sets:3,reps:"15–20",rest:"45 sec",kg:false},
      {name:"Leg Extension Machine",type:"Machine",sets:3,reps:"12",rest:"60 sec",kg:true},
      {name:"Standing Calf Raise",type:"Aesthetic",sets:4,reps:"15",rest:"45 sec",kg:true},
      {name:"Leg Curl Machine",type:"Aesthetic",sets:3,reps:"12",rest:"60 sec",kg:true},
      {name:"Dead Bug",type:"Core",sets:3,reps:"8/side",rest:"60 sec",kg:false},
      {name:"Pallof Press",type:"Core",sets:3,reps:"10/side",rest:"60 sec",kg:true},
    ]},
  W3:{ label:"Workout 3", sub:"Lower Elasticity + Reactivity", color:C.W3,
    exercises:[
      {name:"Approach Verticals",type:"Explosive",sets:7,reps:"Max",rest:"Full",kg:false},
      {name:"Linear Pogos",type:"Explosive",sets:3,reps:"20",rest:"60 sec",kg:false},
      {name:"Lateral Bounds",type:"Explosive",sets:3,reps:"8/side",rest:"90 sec",kg:false},
      {name:"Goblet Squat",type:"Dumbbell",sets:3,reps:"5–6",rest:"2 min",kg:true},
      {name:"Walking Lunges",type:"Dumbbell",sets:3,reps:"10/leg",rest:"90 sec",kg:true},
      {name:"Single Leg RDL",type:"Dumbbell",sets:3,reps:"6/leg",rest:"90 sec",kg:true},
      {name:"Split Squat Iso Hold",type:"Bodyweight",sets:2,reps:"35–45 sec",rest:"Full",kg:false},
      {name:"Slow Calf Raises — Single Leg",type:"Bodyweight",sets:3,reps:"12",rest:"45 sec",kg:false},
      {name:"Seated Calf Raise",type:"Aesthetic",sets:3,reps:"20",rest:"45 sec",kg:true},
      {name:"Hollow Body Hold",type:"Core",sets:2,reps:"20 sec",rest:"30 sec",kg:false},
      {name:"Front Plank",type:"Core",sets:1,reps:"45 sec",rest:"30 sec",kg:false},
      {name:"Leg Drops",type:"Core",sets:2,reps:"10",rest:"30 sec",kg:false},
    ]},
  W4:{ label:"Workout 4", sub:"Upper Structure + Aesthetics", color:C.W4,
    exercises:[
      {name:"Incline DB Press",type:"Dumbbell",sets:3,reps:"8–10",rest:"2 min",kg:true},
      {name:"Assisted Pull-Up — Negatives",type:"Machine",sets:4,reps:"5–6",rest:"2 min",kg:true},
      {name:"Lat Pulldown Machine",type:"Machine",sets:3,reps:"10–12",rest:"90 sec",kg:true},
      {name:"Seated Row Machine",type:"Machine",sets:3,reps:"10–12",rest:"90 sec",kg:true},
      {name:"Shoulder Press Machine",type:"Machine",sets:3,reps:"10–12",rest:"90 sec",kg:true},
      {name:"Single Arm DB Press",type:"Dumbbell",sets:3,reps:"8/side",rest:"90 sec",kg:true},
      {name:"Face Pulls",type:"Cable",sets:3,reps:"15",rest:"45 sec",kg:true},
      {name:"Dead Hangs",type:"Bodyweight",sets:3,reps:"30–45 sec",rest:"Full",kg:false},
      {name:"Straight Arm Pulldown",type:"Aesthetic",sets:3,reps:"12",rest:"60 sec",kg:true},
      {name:"Cable Fly",type:"Aesthetic",sets:3,reps:"12",rest:"60 sec",kg:true},
      {name:"Rear Delt Fly",type:"Aesthetic",sets:3,reps:"15",rest:"45 sec",kg:true},
      {name:"Hammer Curl",type:"Aesthetic",sets:3,reps:"10/side",rest:"60 sec",kg:true},
      {name:"Overhead Tricep Extension",type:"Aesthetic",sets:3,reps:"12",rest:"60 sec",kg:true},
      {name:"Med Ball Rotational Throw",type:"Core",sets:4,reps:"6/side",rest:"Full",kg:false},
      {name:"Cable Woodchop",type:"Core",sets:3,reps:"8/side",rest:"60 sec",kg:true},
      {name:"Seated Russian Twist",type:"Core",sets:3,reps:"10/side",rest:"60 sec",kg:true},
    ]},
};

// ── SHOT CHART COURT GEOMETRY ─────────────────────────────────────────────────
// viewBox 500 × 470. Basket: (250, 417.5). 1ft = 10px. Verified intersections.
const SC_VW = 500, SC_VH = 470;
const SC_BX = 250, SC_BY = 417.5;
const SC_R3 = 237.5;
const SC_CY = 328.02;
const SC_CL = 30, SC_CR = 470;
const SC_PL = 170, SC_PR = 330;
const SC_FY = 280;
const SC_TY = 193.88;
const SC_AFL = 56.35, SC_AFR = 443.65;
const SC_CHR = 40, SC_FTR = 60;

const SC_A1 = Math.atan2(SC_CY - SC_BY, SC_CR - SC_BX);
const SC_A2 = -65 * Math.PI / 180;
const SC_A3 = -115 * Math.PI / 180;
const SC_A4 = Math.atan2(SC_CY - SC_BY, SC_CL - SC_BX);
const SC_R1 = 55, SC_R2 = 145;
const SC_P = (r, a) => `${(SC_BX + r * Math.cos(a)).toFixed(2)},${(SC_BY + r * Math.sin(a)).toFixed(2)}`;

const SC_dyBase = SC_VH - SC_BY;
const SC_dxR2 = Math.sqrt(SC_R2*SC_R2 - SC_dyBase*SC_dyBase);
const SC_intR2_R_x = (SC_BX + SC_dxR2).toFixed(2);
const SC_intR2_L_x = (SC_BX - SC_dxR2).toFixed(2);
const SC_dxR1 = Math.sqrt(SC_R1*SC_R1 - SC_dyBase*SC_dyBase);
const SC_intR1_R_x = (SC_BX + SC_dxR1).toFixed(2);
const SC_intR1_L_x = (SC_BX - SC_dxR1).toFixed(2);

const SC_E1_y = (417.5 + (250 / Math.cos(SC_A1)) * Math.sin(SC_A1)).toFixed(2);
const SC_E4_y = SC_E1_y;
const SC_E2_x = (250 + (-417.5 / Math.sin(SC_A2)) * Math.cos(SC_A2)).toFixed(2);
const SC_E3_x = (250 - (SC_E2_x - 250)).toFixed(2);

function scSlice(rIn, rOut, aStart, aEnd) {
  return [
    `M ${SC_P(rIn, aStart)}`,
    `L ${SC_P(rOut, aStart)}`,
    `A ${rOut},${rOut} 0 0,0 ${SC_P(rOut, aEnd)}`,
    `L ${SC_P(rIn, aEnd)}`,
    `A ${rIn},${rIn} 0 0,1 ${SC_P(rIn, aStart)}`,
    `Z`
  ].join(" ");
}

const SC_ZPATHS = {
  corner3_r: [`M ${SC_CR},${SC_VH}`,`L ${SC_VW},${SC_VH}`,`L ${SC_VW},${SC_E1_y}`,`L ${SC_CR},${SC_CY}`,`Z`].join(" "),
  wing3_r:   [`M ${SC_CR},${SC_CY}`,`L ${SC_VW},${SC_E1_y}`,`L ${SC_VW},0`,`L ${SC_E2_x},0`,`L ${SC_P(SC_R3,SC_A2)}`,`A ${SC_R3},${SC_R3} 0 0,1 ${SC_CR},${SC_CY}`,`Z`].join(" "),
  top3:      [`M ${SC_P(SC_R3,SC_A2)}`,`L ${SC_E2_x},0`,`L ${SC_E3_x},0`,`L ${SC_P(SC_R3,SC_A3)}`,`A ${SC_R3},${SC_R3} 0 0,1 ${SC_P(SC_R3,SC_A2)}`,`Z`].join(" "),
  wing3_l:   [`M ${SC_P(SC_R3,SC_A3)}`,`L ${SC_E3_x},0`,`L 0,0`,`L 0,${SC_E4_y}`,`L ${SC_CL},${SC_CY}`,`A ${SC_R3},${SC_R3} 0 0,1 ${SC_P(SC_R3,SC_A3)}`,`Z`].join(" "),
  corner3_l: [`M ${SC_CL},${SC_CY}`,`L 0,${SC_E4_y}`,`L 0,${SC_VH}`,`L ${SC_CL},${SC_VH}`,`Z`].join(" "),
  mid_base_r:[`M ${SC_intR2_R_x},${SC_VH}`,`L ${SC_CR},${SC_VH}`,`L ${SC_CR},${SC_CY}`,`L ${SC_P(SC_R2,SC_A1)}`,`A ${SC_R2},${SC_R2} 0 0,1 ${SC_intR2_R_x},${SC_VH}`,`Z`].join(" "),
  mid_wing_r:scSlice(SC_R2, SC_R3, SC_A1, SC_A2),
  mid_top:   scSlice(SC_R2, SC_R3, SC_A2, SC_A3),
  mid_wing_l:scSlice(SC_R2, SC_R3, SC_A3, SC_A4),
  mid_base_l:[`M ${SC_CL},${SC_VH}`,`L ${SC_intR2_L_x},${SC_VH}`,`A ${SC_R2},${SC_R2} 0 0,1 ${SC_P(SC_R2,SC_A4)}`,`L ${SC_CL},${SC_CY}`,`Z`].join(" "),
  close_r:   [`M ${SC_intR1_R_x},${SC_VH}`,`L ${SC_intR2_R_x},${SC_VH}`,`A ${SC_R2},${SC_R2} 0 0,0 ${SC_P(SC_R2,SC_A2)}`,`L ${SC_P(SC_R1,SC_A2)}`,`A ${SC_R1},${SC_R1} 0 0,1 ${SC_intR1_R_x},${SC_VH}`,`Z`].join(" "),
  close_c:   scSlice(SC_R1, SC_R2, SC_A2, SC_A3),
  close_l:   [`M ${SC_P(SC_R1,SC_A3)}`,`L ${SC_P(SC_R2,SC_A3)}`,`A ${SC_R2},${SC_R2} 0 0,0 ${SC_intR2_L_x},${SC_VH}`,`L ${SC_intR1_L_x},${SC_VH}`,`A ${SC_R1},${SC_R1} 0 0,1 ${SC_P(SC_R1,SC_A3)}`,`Z`].join(" "),
  under_basket:[`M ${SC_intR1_L_x},${SC_VH}`,`A ${SC_R1},${SC_R1} 0 1,1 ${SC_intR1_R_x},${SC_VH}`,`Z`].join(" "),
};

// Zone metadata: centroids for labels + display names
const SHOT_ZONES = [
  { id:"top3",          label:"Top 3",          cx:SC_BX,  cy:135  },
  { id:"wing3_l",       label:"Wing 3 Left",     cx:50,     cy:225  },
  { id:"wing3_r",       label:"Wing 3 Right",    cx:450,    cy:225  },
  { id:"corner3_l",     label:"Corner 3 Left",   cx:15,     cy:417  },
  { id:"corner3_r",     label:"Corner 3 Right",  cx:485,    cy:417  },
  { id:"mid_top",       label:"Mid Top",         cx:SC_BX,  cy:225  },
  { id:"mid_wing_l",    label:"Mid Wing Left",   cx:115,    cy:285  },
  { id:"mid_wing_r",    label:"Mid Wing Right",  cx:385,    cy:285  },
  { id:"mid_base_l",    label:"Mid Base Left",   cx:65,     cy:385  },
  { id:"mid_base_r",    label:"Mid Base Right",  cx:435,    cy:385  },
  { id:"close_c",       label:"Close Mid",       cx:SC_BX,  cy:317  },
  { id:"close_l",       label:"Close Left",      cx:180,    cy:345  },
  { id:"close_r",       label:"Close Right",     cx:320,    cy:345  },
  { id:"under_basket",  label:"Rim",             cx:SC_BX,  cy:390  },
];

function zoneColorFn(pct) {
  if (pct === null) return { fill:"#081624", op:0.80, text:"#15304A" };
  if (pct < 0.25)   return { fill:"#1E3A8A", op:0.88, text:"#93C5FD" };
  if (pct < 0.33)   return { fill:"#7F1D1D", op:0.88, text:"#FCA5A5" };
  if (pct < 0.42)   return { fill:"#C2410C", op:0.88, text:"#FED7AA" };
  if (pct < 0.50)   return { fill:"#CA8A04", op:0.88, text:"#FEF08A" };
  if (pct < 0.58)   return { fill:"#166534", op:0.90, text:"#86EFAC" };
  return              { fill:"#14532D", op:0.93, text:"#4ADE80" };
}

// ── SEED DATA ─────────────────────────────────────────────────────────────────
const SEED_GYM = [
  {id:1,wk:"W2",date:"2026-03-02",time:"07:30",dur:75,energy:7,inj:{a:2,s:2,h:2},note:"Good session|Shoulder clicked|Monitor shoulder",sets:{"Back Squat":{1:{w:"100",r:"5",f:"4"},2:{w:"100",r:"5",f:"4"},3:{w:"100",r:"4",f:"3"},4:{w:"100",r:"4",f:"3"}},"Romanian Deadlift":{1:{w:"110",r:"6",f:"4"},2:{w:"110",r:"6",f:"4"},3:{w:"110",r:"5",f:"3"}},"Bulgarian Split Squat":{1:{w:"32",r:"8",f:"3"},2:{w:"32",r:"7",f:"3"},3:{w:"30",r:"8",f:"3"}}}},
  {id:2,wk:"W1",date:"2026-03-04",time:"08:00",dur:80,energy:8,inj:{a:1,s:1,h:3},note:"Felt strong|Hip tight on split squat|Ice hip tonight",sets:{"Bench Press":{1:{w:"90",r:"6",f:"4"},2:{w:"90",r:"6",f:"4"},3:{w:"90",r:"5",f:"3"}},"Push Press":{1:{w:"70",r:"4",f:"4"},2:{w:"70",r:"4",f:"4"},3:{w:"70",r:"4",f:"4"},4:{w:"70",r:"3",f:"3"}},"Barbell Rows":{1:{w:"80",r:"8",f:"4"},2:{w:"80",r:"8",f:"4"},3:{w:"80",r:"7",f:"3"}}}},
  {id:3,wk:"W3",date:"2026-03-06",time:"06:45",dur:70,energy:6,inj:{a:2,s:1,h:2},note:"Lateral bounds felt good|Floaters inconsistent|More floater work next court day",sets:{"Goblet Squat":{1:{w:"32",r:"6",f:"4"},2:{w:"32",r:"6",f:"4"},3:{w:"32",r:"5",f:"3"}},"Walking Lunges":{1:{w:"24",r:"10",f:"4"},2:{w:"24",r:"10",f:"3"},3:{w:"24",r:"9",f:"3"}},"Single Leg RDL":{1:{w:"20",r:"6",f:"3"},2:{w:"20",r:"6",f:"3"},3:{w:"20",r:"5",f:"3"}}}},
];

const SEED_SHOTS = [
  {id:1,date:"2026-03-02",drill:"Catch and Shoot — 5 Spot",att:50,made:18,zone:"wing3_l",type:"catch",note:"Release still slow"},
  {id:2,date:"2026-03-04",drill:"Catch and Shoot — 5 Spot",att:50,made:21,zone:"wing3_r",type:"catch",note:"Right side better"},
  {id:3,date:"2026-03-06",drill:"Pull-Up Jumper",att:30,made:14,zone:"mid_wing_l",type:"off-dribble",note:"Footwork improving"},
  {id:4,date:"2026-03-07",drill:"Floater Series",att:25,made:8,zone:"close_c",type:"floater",note:"Close mid still inconsistent"},
  {id:5,date:"2026-03-08",drill:"Corner 3 Series",att:40,made:17,zone:"corner3_r",type:"catch",note:"Right corner comfortable"},
  {id:6,date:"2026-03-08",drill:"Floater Series",att:30,made:19,zone:"under_basket",type:"floater",note:"Elite at the rim"},
  {id:7,date:"2026-03-09",drill:"Mid-Range Series",att:20,made:7,zone:"mid_top",type:"pull-up",note:"Footwork needs work"},
];

const SEED_GAMES = [
  {id:1,date:"2026-02-20",opp:"Team A",res:"W",mins:18,pts:8,reb:4,ast:2,stl:1,blk:1,to:2,fgm:3,fga:8,ftm:2,fta:2,pm:"+4"},
  {id:2,date:"2026-02-27",opp:"Team B",res:"L",mins:12,pts:4,reb:2,ast:1,stl:0,blk:0,to:1,fgm:2,fga:7,ftm:0,fta:1,pm:"-6"},
  {id:3,date:"2026-03-05",opp:"Team C",res:"W",mins:22,pts:14,reb:6,ast:3,stl:2,blk:1,to:2,fgm:5,fga:11,ftm:4,fta:5,pm:"+8"},
];

const SEED_ATH = [
  {id:1,date:"2026-02-20",vert:28,s10:1.82,s20:3.12,wt:215,bf:16.0},
  {id:2,date:"2026-03-07",vert:29,s10:1.80,s20:3.08,wt:214,bf:15.8},
];

const SEED_WELLNESS = [
  {id:1,date:"2026-03-07",sleep:3,soreness:3,stress:2,motivation:4,fatigue:3},
  {id:2,date:"2026-03-08",sleep:4,soreness:2,stress:2,motivation:5,fatigue:2},
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const injC = (v) => v<=1?"#22C55E":v===2?"#86EFAC":v===3?C.gold:v===4?"#F97316":C.red;
const pctC = (p) => p>=0.45?C.green:p>=0.35?C.gold:C.red;
const fmt = (v,d=1) => isNaN(v)||v===null?"—":Number(v).toFixed(d);
const avg = (arr,fn) => arr.length?arr.reduce((a,x)=>a+(fn(x)||0),0)/arr.length:0;

function calcVolume(sets) {
  let v = 0;
  Object.values(sets||{}).forEach(ex => Object.values(ex||{}).forEach(s => { v += (Number(s.w)||0)*(Number(s.r)||0); }));
  return v;
}

function findPRs(sessions) {
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

function getReadiness(wellness) {
  if (!wellness) return null;
  return Math.round(((6-wellness.fatigue)+(6-wellness.soreness)+(6-wellness.stress)+wellness.motivation+wellness.sleep)/5*20);
}

function detectFatigue(gymSessions, wellnessSessions) {
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

// ── PROGRESSION LOGIC ─────────────────────────────────────────────────────────
function getSuggestion(exercise, lastSets) {
  if (!lastSets || Object.keys(lastSets).length === 0) return null;
  const targetRepsStr = exercise.reps.split("–")[0].replace(/\D.*/, "");
  const target = parseInt(targetRepsStr);
  if (isNaN(target)) return null;
  const vals = Object.values(lastSets);
  const allHit = vals.every(s => Number(s.r) >= target);
  const lastW = vals.map(s=>Number(s.w)||0).filter(Boolean);
  if (!lastW.length) return null;
  const maxW = Math.max(...lastW);
  if (allHit) return { text:`All sets hit. Increase to ${maxW + 2.5} kg`, type:"up" };
  return { text:`Repeat ${maxW} kg`, type:"hold" };
}

// ── WEEKLY LOAD ───────────────────────────────────────────────────────────────
function calcACWR(gymSessions) {
  if (gymSessions.length < 4) return null;
  const vols = gymSessions.map(s => calcVolume(s.sets));
  const acute = vols.slice(-7).reduce((a,v)=>a+v,0) / 7;
  const chronic = vols.reduce((a,v)=>a+v,0) / vols.length;
  if (!chronic) return null;
  return (acute / chronic).toFixed(2);
}

// ── CALENDAR HEATMAP ──────────────────────────────────────────────────────────
function CalendarHeatmap({ gymSessions, shotSessions }) {
  const today = new Date("2026-03-09");
  const days = Array.from({ length:56 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 55 + i);
    const ds = d.toISOString().split("T")[0];
    const gym = gymSessions.filter(s=>s.date===ds).length;
    const shots = shotSessions.filter(s=>s.date===ds).length;
    return { date:ds, day:d.getDate(), month:d.getMonth(), gym, shots };
  });
  const weeks = [];
  for (let i=0; i<days.length; i+=7) weeks.push(days.slice(i,i+7));
  return (
    <div>
      <div style={{display:"flex",gap:3}}>
        {weeks.map((week,wi) => (
          <div key={wi} style={{display:"flex",flexDirection:"column",gap:3}}>
            {week.map(d => {
              const active = d.gym > 0 || d.shots > 0;
              const bg = d.gym>0 ? C.orange : d.shots>0 ? C.blue : C.border;
              return (
                <div key={d.date} title={`${d.date}${d.gym?" · Gym":""}${d.shots?" · Shooting":""}`}
                  style={{width:14,height:14,borderRadius:2,background:bg,opacity:active?1:0.4,cursor:"default"}}>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:12,marginTop:8}}>
        {[[C.orange,"Gym"],[C.blue,"Shooting"],[C.border,"Rest"]].map(([col,l])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:10,height:10,borderRadius:2,background:col}}/>
            <span style={{fontSize:9,color:C.textDim}}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── HOT ZONE MAP ──────────────────────────────────────────────────────────────
function HotZoneMapCourtLines() {
  const s = "rgba(255,255,255,0.18)";
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x={1} y={1} width={SC_VW-2} height={SC_VH-2} stroke={s} strokeWidth={1.1}/>
      <line x1={SC_CL} y1={SC_VH} x2={SC_CL} y2={SC_CY} stroke={s} strokeWidth={1.1}/>
      <line x1={SC_CR} y1={SC_VH} x2={SC_CR} y2={SC_CY} stroke={s} strokeWidth={1.1}/>
      <path d={`M ${SC_CL},${SC_CY} A ${SC_R3},${SC_R3} 0 0,1 ${SC_CR},${SC_CY}`} stroke={s} strokeWidth={1.1}/>
      <rect x={SC_PL} y={SC_FY} width={SC_PR-SC_PL} height={SC_VH-SC_FY} stroke={s} strokeWidth={1.1}/>
      <path d={`M ${SC_PL},${SC_FY} A ${SC_FTR},${SC_FTR} 0 0,1 ${SC_PR},${SC_FY}`} stroke={s} strokeWidth={1.1}/>
      <path d={`M ${SC_PL},${SC_FY} A ${SC_FTR},${SC_FTR} 0 0,0 ${SC_PR},${SC_FY}`} stroke={s} strokeWidth={1.1} strokeDasharray="6 6"/>
      <path d={`M ${SC_BX-SC_CHR},430 L ${SC_BX-SC_CHR},${SC_BY} A ${SC_CHR},${SC_CHR} 0 0,1 ${SC_BX+SC_CHR},${SC_BY} L ${SC_BX+SC_CHR},430`} stroke={s} strokeWidth={1.1}/>
      <rect x={SC_BX-30} y={430} width={60} height={2} fill={s} stroke="none"/>
      <circle cx={SC_BX} cy={SC_BY} r={11.25} stroke="rgba(255,120,0,0.80)" strokeWidth={2.5}/>
      {[400,390,360,330].map((ty,i) => (
        <g key={i}>
          <line x1={SC_PL} y1={ty} x2={SC_PL-8} y2={ty} stroke={s} strokeWidth={1.1}/>
          <line x1={SC_PR} y1={ty} x2={SC_PR+8} y2={ty} stroke={s} strokeWidth={1.1}/>
        </g>
      ))}
    </g>
  );
}

function HotZoneMap({ shotsByZone }) {
  const [hov, setHov] = useState(null);
  const hovZ = hov ? SHOT_ZONES.find(z => z.id === hov) : null;
  const hovD = hov ? (shotsByZone[hov] || {a:0,m:0}) : null;

  return (
    <div>
      {/* Live hover readout */}
      <div style={{minHeight:20,marginBottom:4,display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
        {hovZ && hovD && hovD.a > 0 ? (
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:800,color:zoneColorFn(hovD.m/hovD.a).text}}>
            {hovZ.label} — {Math.round(hovD.m/hovD.a*100)}% ({hovD.m}/{hovD.a})
          </span>
        ) : (
          <span style={{fontSize:9,color:C.textDim}}>Hover a zone</span>
        )}
      </div>
      <svg
        viewBox={`0 0 ${SC_VW} ${SC_VH}`}
        style={{width:"100%",display:"block",borderRadius:4}}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="hzplanks" patternUnits="userSpaceOnUse" width="8" height={SC_VH}>
            <rect width="8" height={SC_VH} fill="#3B1D07"/>
            <line x1="4" y1="0" x2="4" y2={SC_VH} stroke="rgba(0,0,0,0.25)" strokeWidth="7"/>
          </pattern>
        </defs>
        <rect width={SC_VW} height={SC_VH} fill="url(#hzplanks)"/>
        <rect width={SC_VW} height={SC_VH} fill="rgba(3,8,18,0.60)"/>

        {/* Zone fills */}
        {SHOT_ZONES.map(({ id }) => {
          if (!SC_ZPATHS[id]) return null;
          const zd = shotsByZone[id] || {a:0,m:0};
          const pct = zd.a > 0 ? zd.m / zd.a : null;
          const { fill, op } = zoneColorFn(pct);
          const isH = hov === id;
          return (
            <path key={id} d={SC_ZPATHS[id]}
              fill={fill} fillOpacity={isH ? Math.min(1, op+0.15) : op}
              stroke={isH ? "rgba(255,255,255,0.80)" : "rgba(255,255,255,0.30)"}
              strokeWidth={isH ? 2.5 : 1.2}
              strokeLinejoin="round"
              style={{cursor:"default",transition:"all 0.12s ease"}}
              onMouseEnter={() => setHov(id)} onMouseLeave={() => setHov(null)}
            />
          );
        })}

        <HotZoneMapCourtLines/>

        {/* Zone labels */}
        {SHOT_ZONES.map(z => {
          const zd = shotsByZone[z.id] || {a:0,m:0};
          const pct = zd.a > 0 ? zd.m / zd.a : null;
          const { text } = zoneColorFn(pct);
          if (!zd.a) return (
            <text key={`e-${z.id}`} x={z.cx} y={z.cy} textAnchor="middle" dominantBaseline="middle"
              fill="rgba(255,255,255,0.10)" fontSize={8} fontFamily="'Barlow',sans-serif">
              {z.label}
            </text>
          );
          return (
            <g key={`l-${z.id}`} style={{pointerEvents:"none"}}>
              <text x={z.cx} y={z.cy-1} textAnchor="middle" dominantBaseline="middle"
                fill={text} fontSize={12} fontWeight={800}
                fontFamily="'Barlow Condensed',sans-serif"
                style={{filter:"drop-shadow(0 1px 4px rgba(0,0,0,0.95))"}}>
                {Math.round(pct*100)}%
              </text>
              <text x={z.cx} y={z.cy+13} textAnchor="middle" dominantBaseline="middle"
                fill={text} fontSize={8.5} fontFamily="'Barlow',sans-serif" opacity={0.70}
                style={{filter:"drop-shadow(0 1px 3px rgba(0,0,0,0.95))"}}>
                {zd.m}/{zd.a}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{display:"flex",gap:10,marginTop:8,flexWrap:"wrap"}}>
        {[["<25%","#1E3A8A","#93C5FD"],["25–33%","#7F1D1D","#FCA5A5"],["33–42%","#C2410C","#FED7AA"],["42–50%","#CA8A04","#FEF08A"],["50–58%","#166534","#86EFAC"],["58%+","#14532D","#4ADE80"]].map(([l,bg,bdr])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:9,height:9,borderRadius:2,background:bg,boxShadow:`0 0 0 1px ${bdr}40`}}/>
            <span style={{fontSize:8,color:C.textDim,fontWeight:600}}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── STAT CARD ─────────────────────────────────────────────────────────────────
const StatCard = ({label,value,unit="",sub,color=C.orange,size=28}) => (
  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"14px 16px",textAlign:"center"}}>
    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:size,fontWeight:900,color,lineHeight:1}}>{value}<span style={{fontSize:size*0.45,color:C.textDim}}>{unit}</span></div>
    {sub && <div style={{fontSize:9,color:C.textDim,marginTop:2}}>{sub}</div>}
    <div style={{fontSize:9,color:C.textDim,textTransform:"uppercase",letterSpacing:1,marginTop:sub?1:3}}>{label}</div>
  </div>
);

// ── FIELD / INPUT ─────────────────────────────────────────────────────────────
const S = { lbl:{fontSize:9,fontWeight:700,letterSpacing:1.5,color:C.textDim,textTransform:"uppercase",marginBottom:5} };
const inp = {background:"#06101A",border:`1px solid ${C.border}`,borderRadius:3,color:C.text,padding:"8px 10px",fontSize:12,width:"100%",fontFamily:"'Barlow',sans-serif",outline:"none",transition:"border-color 0.15s",WebkitAppearance:"none"};
const Field = ({label,value,onChange,type="text",ph=""}) => (
  <div>
    <div style={S.lbl}>{label}</div>
    <input type={type} value={value} placeholder={ph} onChange={e=>onChange(e.target.value)}
      style={inp} onFocus={e=>e.target.style.borderColor=C.orange} onBlur={e=>e.target.style.borderColor=C.border}/>
  </div>
);
const Sel = ({label,value,onChange,opts}) => (
  <div>
    <div style={S.lbl}>{label}</div>
    <select value={value} onChange={e=>onChange(e.target.value)} style={{...inp,cursor:"pointer"}}>
      {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
    </select>
  </div>
);
const Btn = ({label,onClick,variant="primary",sm}) => {
  const styles = {
    primary:{bg:C.orange,fg:"#fff",br:"none"},
    success:{bg:"#14532D",fg:C.green,br:`1px solid ${C.green}`},
    ghost:{bg:"transparent",fg:C.textMid,br:`1px solid ${C.border}`},
  };
  const s = styles[variant]||styles.primary;
  return <button onClick={onClick} style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:sm?10:12,letterSpacing:2,textTransform:"uppercase",padding:sm?"6px 14px":"10px 24px",background:s.bg,color:s.fg,border:s.br,borderRadius:3,cursor:"pointer",outline:"none",transition:"all 0.15s"}}>{label}</button>;
};

const ChartBox = ({title,children,h=180,note}) => (
  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"16px 18px",marginBottom:12}}>
    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",color:C.orange,marginBottom:note?4:14}}>{title}</div>
    {note && <div style={{fontSize:9,color:C.textDim,marginBottom:12}}>{note}</div>}
    <ResponsiveContainer width="100%" height={h}>{children}</ResponsiveContainer>
  </div>
);

const tt = {background:C.card,border:`1px solid ${C.border}`,borderRadius:4,fontSize:11,color:C.text};

// ── SECTION DIVIDER ───────────────────────────────────────────────────────────
const SecHead = ({label,color=C.orange}) => (
  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:800,letterSpacing:2,textTransform:"uppercase",padding:"6px 10px",margin:"12px 0 5px",borderLeft:`3px solid ${color}`,color,background:"rgba(255,255,255,0.025)",borderRadius:"0 3px 3px 0"}}>{label}</div>
);

// ── EXERCISE ROW ──────────────────────────────────────────────────────────────
function ExRow({ ex, logs, setLogs, lastSession }) {
  const [open, setOpen] = useState(false);
  const n = typeof ex.sets==="number" ? ex.sets : 4;
  const [bg, fg] = TYPE_C[ex.type] || ["#222","#888"];
  const lg = logs[ex.name] || {};
  const lastSets = lastSession?.sets?.[ex.name];
  const suggestion = ex.kg ? getSuggestion(ex, lastSets) : null;

  const log = (s,f,v) => setLogs(p=>({...p,[ex.name]:{...(p[ex.name]||{}),[s]:{...(p[ex.name]?.[s]||{}),[f]:v}}}));

  return (
    <div style={{background:"#08131C",border:`1px solid ${C.border}`,borderRadius:4,marginBottom:5,overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 12px",cursor:"pointer"}} onClick={()=>setOpen(!open)}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:12,fontWeight:600,color:C.text}}>{ex.name}</span>
          <span style={{fontSize:8,fontWeight:700,letterSpacing:1,padding:"2px 6px",borderRadius:2,background:bg,color:fg,textTransform:"uppercase"}}>{ex.type}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {suggestion && <span style={{fontSize:9,background:suggestion.type==="up"?C.greenDim:C.orangeDim,color:suggestion.type==="up"?C.green:C.gold,border:`1px solid ${suggestion.type==="up"?C.green:C.gold}30`,borderRadius:2,padding:"1px 6px"}}>{suggestion.type==="up"?"↑":"→"} {suggestion.text}</span>}
          <span style={{fontSize:9,background:"#0A1F2E",border:`1px solid ${C.border}`,borderRadius:2,padding:"2px 7px",color:C.textDim}}>{ex.sets}×{ex.reps}</span>
          <span style={{color:C.textDim,fontSize:11}}>{open?"▲":"▼"}</span>
        </div>
      </div>
      {open && (
        <div style={{padding:"0 12px 12px",borderTop:`1px solid #0D1E2D`}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.orange,margin:"7px 0 10px"}}>
            <span>Target: {ex.sets}×{ex.reps}</span>
            <span>Rest: {ex.rest}</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:`28px ${ex.kg?"1fr":"2fr"} 1fr 1fr`,gap:5,marginBottom:4}}>
            <div/>
            {ex.kg && <div style={{fontSize:8,fontWeight:700,letterSpacing:1,color:C.textDim,textAlign:"center"}}>WEIGHT</div>}
            <div style={{fontSize:8,fontWeight:700,letterSpacing:1,color:C.textDim,textAlign:"center"}}>REPS</div>
            <div style={{fontSize:8,fontWeight:700,letterSpacing:1,color:C.textDim,textAlign:"center"}}>FEEL</div>
          </div>
          {Array.from({length:n},(_,i)=>i+1).map(s => {
            const prev = lastSets?.[s];
            return (
              <div key={s} style={{display:"grid",gridTemplateColumns:`28px ${ex.kg?"1fr":"2fr"} 1fr 1fr`,gap:5,marginBottom:4}}>
                <div style={{fontFamily:"monospace",fontSize:11,fontWeight:700,color:C.orange,textAlign:"center",lineHeight:"30px"}}>S{s}</div>
                {ex.kg && (
                  <input placeholder={prev?.w||"kg"} value={lg[s]?.w||""} onChange={e=>log(s,"w",e.target.value)}
                    style={{...inp,padding:"5px 4px",fontSize:12,textAlign:"center"}}
                    onFocus={e=>e.target.style.borderColor=C.orange} onBlur={e=>e.target.style.borderColor=C.border}/>
                )}
                <input placeholder={prev?.r||ex.reps} value={lg[s]?.r||""} onChange={e=>log(s,"r",e.target.value)}
                  style={{...inp,padding:"5px 4px",fontSize:12,textAlign:"center"}}
                  onFocus={e=>e.target.style.borderColor=C.orange} onBlur={e=>e.target.style.borderColor=C.border}/>
                <input placeholder="1–5" value={lg[s]?.f||""} onChange={e=>log(s,"f",e.target.value)}
                  style={{...inp,padding:"5px 4px",fontSize:12,textAlign:"center"}}
                  onFocus={e=>e.target.style.borderColor=C.orange} onBlur={e=>e.target.style.borderColor=C.border}/>
              </div>
            );
          })}
          {prev && (
            <div style={{marginTop:6,fontSize:9,color:C.textDim,borderTop:`1px solid ${C.border}`,paddingTop:6}}>
              Last session: {Object.values(lastSets||{}).map(s=>`${s.w}kg×${s.r}`).join(", ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState("home");
  const [gymSessions, setGymSessions] = usePersist("ohal_gym", SEED_GYM);
  const [shotSessions, setShotSessions] = usePersist("ohal_shots", SEED_SHOTS);
  const [gameSessions, setGameSessions] = usePersist("ohal_games", SEED_GAMES);
  const [athSessions, setAthSessions] = usePersist("ohal_ath", SEED_ATH);
  const [wellnessSessions, setWellnessSessions] = usePersist("ohal_well", SEED_WELLNESS);

  // GYM FORM
  const [step, setStep] = useState(1);
  const [selW, setSelW] = useState("W1");
  const [gymInfo, setGymInfo] = useState({date:new Date().toISOString().split("T")[0],time:new Date().toTimeString().slice(0,5),dur:"",energy:7});
  const [gymLogs, setGymLogs] = useState({});
  const [gymInj, setGymInj] = useState({a:1,s:1,h:1});
  const [gymNote, setGymNote] = useState({well:"",imp:"",nxt:""});
  const [gymSaved, setGymSaved] = useState(false);
  const [exFilter, setExFilter] = useState("ALL");

  // SHOT FORM
  const [shotForm, setShotForm] = useState({date:new Date().toISOString().split("T")[0],drill:"Catch and Shoot — 5 Spot",att:"",made:"",zone:"wing3_l",type:"catch",note:""});
  const [shotSaved, setShotSaved] = useState(false);

  // GAME FORM
  const [gameForm, setGameForm] = useState({date:new Date().toISOString().split("T")[0],opp:"",res:"W",mins:"",pts:"",reb:"",ast:"",stl:"",blk:"",to:"",fgm:"",fga:"",ftm:"",fta:"",pm:""});
  const [gameSaved, setGameSaved] = useState(false);

  // ATH FORM
  const [athForm, setAthForm] = useState({date:new Date().toISOString().split("T")[0],vert:"",s10:"",s20:"",wt:"",bf:""});
  const [athSaved, setAthSaved] = useState(false);

  // WELLNESS FORM
  const [wellForm, setWellForm] = useState({date:new Date().toISOString().split("T")[0],sleep:3,soreness:3,stress:3,motivation:3,fatigue:3});
  const [wellSaved, setWellSaved] = useState(false);

  const W = WORKOUTS[selW];
  const lastSameWorkout = [...gymSessions].reverse().find(s=>s.wk===selW);

  const grouped = useMemo(()=>{
    const g={Perf:[],Aes:[],Core:[]};
    W.exercises.forEach(e=>{ if(e.type==="Aesthetic")g.Aes.push(e); else if(e.type==="Core")g.Core.push(e); else g.Perf.push(e); });
    return g;
  },[selW]);

  // ANALYTICS
  const shotsByZone = useMemo(()=>{
    const z={};
    shotSessions.forEach(s=>{ if(!z[s.zone])z[s.zone]={a:0,m:0}; z[s.zone].a+=s.att; z[s.zone].m+=s.made; });
    return z;
  },[shotSessions]);

  const prs = useMemo(()=>findPRs(gymSessions),[gymSessions]);
  const acwr = useMemo(()=>calcACWR(gymSessions),[gymSessions]);
  const { flags: fatigueFlags } = useMemo(()=>detectFatigue(gymSessions,wellnessSessions),[gymSessions,wellnessSessions]);
  const latestWell = wellnessSessions.slice(-1)[0];
  const readiness = latestWell ? getReadiness(latestWell) : null;
  const latestAth = [...athSessions].sort((a,b)=>b.date>a.date?1:-1)[0];

  const gameAvgs = useMemo(()=>{
    if(!gameSessions.length) return {};
    const n=gameSessions.length;
    const sum=(fn)=>gameSessions.reduce((a,g)=>a+(fn(g)||0),0);
    const totalFGA=sum(g=>g.fga);
    return {
      pts:fmt(sum(g=>g.pts)/n), reb:fmt(sum(g=>g.reb)/n), ast:fmt(sum(g=>g.ast)/n),
      to:fmt(sum(g=>g.to)/n), stl:fmt(sum(g=>g.stl)/n), blk:fmt(sum(g=>g.blk)/n),
      mins:fmt(sum(g=>g.mins)/n), fg:totalFGA>0?fmt(sum(g=>g.fgm)/totalFGA*100):"—",
    };
  },[gameSessions]);

  const overallShotPct = useMemo(()=>{
    const ta=shotSessions.reduce((a,s)=>a+s.att,0);
    const tm=shotSessions.reduce((a,s)=>a+s.made,0);
    return ta>0?tm/ta:0;
  },[shotSessions]);

  const gymChartData = useMemo(()=>gymSessions.map((s,i)=>({
    s:`S${i+1}`,energy:s.energy,vol:Math.round(calcVolume(s.sets)/100)*100,ank:s.inj.a,sho:s.inj.s,hip:s.inj.h,
  })),[gymSessions]);

  const shotChartData = useMemo(()=>shotSessions.map((s,i)=>({
    s:`S${i+1}`,pct:s.att>0?Math.round(s.made/s.att*100):0,vol:s.att,
  })),[shotSessions]);

  const athChartData = useMemo(()=>athSessions.map((s,i)=>({s:`T${i+1}`,vert:s.vert,s10:s.s10,wt:s.wt})),[athSessions]);

  const gameChartData = useMemo(()=>gameSessions.map((g,i)=>({s:`G${i+1}`,pts:g.pts,reb:g.reb,ast:g.ast,to:g.to,fg:g.fga>0?Math.round(g.fgm/g.fga*100):0})),[gameSessions]);

  const coachingAlerts = useMemo(()=>{
    const alerts = [...fatigueFlags];
    if(overallShotPct > 0 && overallShotPct < 0.32) alerts.push({type:"warn",text:"Shooting below 32%. Return to form shooting before volume work."});
    if(overallShotPct >= 0.43) alerts.push({type:"good",text:"Shooting trending up. Add movement or a defender to increase difficulty."});
    const wingShooting = shotsByZone["wing3_l"]||{a:0,m:0};
    const chargeShooting = shotsByZone["close_c"]||{a:0,m:0};
    if(chargeShooting.a > 10 && chargeShooting.m/chargeShooting.a < 0.25) alerts.push({type:"warn",text:"Close mid / floater zone is your biggest weakness. Add 20 floaters per court session."});
    if(athSessions.length>=2) {
      const sorted=[...athSessions].sort((a,b)=>a.date>b.date?1:-1);
      if(sorted[sorted.length-1].vert > sorted[sorted.length-2].vert) alerts.push({type:"good",text:`Vertical improving. W3 elasticity sessions are working — protect that training block.`});
    }
    if(gameSessions.length>=2) {
      const last2=gameSessions.slice(-2);
      if(avg(last2,g=>g.to)>2.5) alerts.push({type:"warn",text:"Turnovers averaging above 2.5 in recent games. Film study — identify the patterns."});
    }
    if(!alerts.length) alerts.push({type:"good",text:"All systems green. Stay consistent. Log more sessions to unlock detailed feedback."});
    return alerts;
  },[fatigueFlags,overallShotPct,shotsByZone,athSessions,gameSessions]);

  // SAVE HANDLERS
  const saveGym = () => {
    const vol = calcVolume(gymLogs);
    setGymSessions(p=>[...p,{id:Date.now(),wk:selW,date:gymInfo.date,time:gymInfo.time,dur:parseInt(gymInfo.dur)||0,energy:gymInfo.energy,inj:{...gymInj},note:`${gymNote.well}|${gymNote.imp}|${gymNote.nxt}`,sets:{...gymLogs},vol}]);
    setGymSaved(true);
    setTimeout(()=>{setGymSaved(false);setStep(1);setGymLogs({});setGymNote({well:"",imp:"",nxt:""});setGymInj({a:1,s:1,h:1});},1600);
  };

  const saveShot = () => {
    setShotSessions(p=>[...p,{id:Date.now(),...shotForm,att:Number(shotForm.att),made:Number(shotForm.made)}]);
    setShotSaved(true);
    setTimeout(()=>{setShotSaved(false);setShotForm(p=>({...p,att:"",made:"",note:""}));},1400);
  };

  const saveGame = () => {
    const n=(v)=>Number(v)||0;
    setGameSessions(p=>[...p,{id:Date.now(),...gameForm,mins:n(gameForm.mins),pts:n(gameForm.pts),reb:n(gameForm.reb),ast:n(gameForm.ast),stl:n(gameForm.stl),blk:n(gameForm.blk),to:n(gameForm.to),fgm:n(gameForm.fgm),fga:n(gameForm.fga),ftm:n(gameForm.ftm),fta:n(gameForm.fta)}]);
    setGameSaved(true);
    setTimeout(()=>{setGameSaved(false);setGameForm({date:new Date().toISOString().split("T")[0],opp:"",res:"W",mins:"",pts:"",reb:"",ast:"",stl:"",blk:"",to:"",fgm:"",fga:"",ftm:"",fta:"",pm:""});},1400);
  };

  const saveAth = () => {
    const n=(v)=>Number(v)||0;
    setAthSessions(p=>[...p,{id:Date.now(),...athForm,vert:n(athForm.vert),s10:n(athForm.s10),s20:n(athForm.s20),wt:n(athForm.wt),bf:n(athForm.bf)}]);
    setAthSaved(true);
    setTimeout(()=>{setAthSaved(false);setAthForm({date:new Date().toISOString().split("T")[0],vert:"",s10:"",s20:"",wt:"",bf:""});},1400);
  };

  const saveWell = () => {
    setWellnessSessions(p=>[...p,{id:Date.now(),...wellForm}]);
    setWellSaved(true);
    setTimeout(()=>setWellSaved(false),1400);
  };

  // NAV
  const navItems = [["home","HOME"],["gym","GYM"],["shooting","SHOOTING"],["games","GAMES"],["athlete","ATHLETE"],["analytics","ANALYTICS"],["coach","COACH"]];

  return (
    <div style={{fontFamily:"'Barlow',sans-serif",background:C.bg,minHeight:"100vh",color:C.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:3px;height:3px}::-webkit-scrollbar-thumb{background:${C.orange}}input,textarea,select{font-family:'Barlow',sans-serif}input[type=date]::-webkit-calendar-picker-indicator,input[type=time]::-webkit-calendar-picker-indicator{filter:invert(0.4)}`}</style>

      {/* ── HEADER ── */}
      <div style={{background:"#080F18",borderBottom:`2px solid ${C.orange}`,padding:"0 14px",display:"flex",alignItems:"center",justifyContent:"space-between",height:54,position:"sticky",top:0,zIndex:100}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:900,color:C.text,letterSpacing:2}}>
          COACH <span style={{color:C.orange}}>ORION</span> HALE
        </div>
        <div style={{display:"flex",gap:2,flexWrap:"wrap",justifyContent:"flex-end"}}>
          {navItems.map(([k,l])=>(
            <button key={k} onClick={()=>setView(k)} style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:700,letterSpacing:1.5,padding:"6px 11px",border:"none",cursor:"pointer",borderRadius:2,textTransform:"uppercase",background:view===k?C.orange:"transparent",color:view===k?"#fff":C.textDim,outline:"none",transition:"all 0.15s"}}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"18px 12px 60px"}}>

        {/* ══ HOME ══ */}
        {view==="home" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
              <div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900,color:C.text,letterSpacing:2}}>ATHLETE OPERATING SYSTEM</div>
                <div style={{fontSize:11,color:C.textDim,marginTop:2}}>Position: SG/SF · 6'3"–6'5" · 201–220 lbs · Wing Prototype · 21 years old</div>
              </div>
              {readiness !== null && (
                <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"10px 16px",textAlign:"center",minWidth:90}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:30,fontWeight:900,color:readiness>=70?C.green:readiness>=50?C.gold:C.red}}>{readiness}</div>
                  <div style={{fontSize:9,color:C.textDim,textTransform:"uppercase",letterSpacing:1}}>Readiness</div>
                </div>
              )}
            </div>

            {/* Coaching alerts */}
            <div style={{marginBottom:18}}>
              {coachingAlerts.slice(0,2).map((a,i)=>(
                <div key={i} style={{background:C.card,border:`1px solid ${a.type==="good"?C.green+"44":C.orange+"44"}`,borderLeft:`3px solid ${a.type==="good"?C.green:C.orange}`,borderRadius:4,padding:"10px 14px",marginBottom:8,display:"flex",alignItems:"flex-start",gap:10}}>
                  <span style={{fontSize:14,lineHeight:1}}>{a.type==="good"?"✓":"⚠"}</span>
                  <div>
                    <div style={{fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:a.type==="good"?C.green:C.orange,marginBottom:3}}>{a.type==="good"?"Signal":"Flag"}</div>
                    <div style={{fontSize:12,color:C.text,lineHeight:1.5}}>{a.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick stats */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:18}}>
              <StatCard label="Gym Sessions" value={gymSessions.length} color={C.W1}/>
              <StatCard label="Shot Sessions" value={shotSessions.length} color={C.W2}/>
              <StatCard label="Games Logged" value={gameSessions.length} color={C.W3}/>
              <StatCard label="Overall FG%" value={fmt(overallShotPct*100)} unit="%" color={pctC(overallShotPct)} size={24}/>
            </div>

            {/* Activity heatmap */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"14px 16px",marginBottom:12}}>
              <div style={{...S.lbl,color:C.orange,marginBottom:12}}>Activity — Last 8 Weeks</div>
              <CalendarHeatmap gymSessions={gymSessions} shotSessions={shotSessions}/>
            </div>

            {/* Game averages + last ath test */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"14px 16px"}}>
                <div style={{...S.lbl,color:C.orange,marginBottom:10}}>Game Averages ({gameSessions.length} games)</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                  {[["PPG",gameAvgs.pts,""],["RPG",gameAvgs.reb,""],["APG",gameAvgs.ast,""],["TOPG",gameAvgs.to,""],["FG%",gameAvgs.fg,"%"],["MPG",gameAvgs.mins,""]].map(([l,v,u])=>(
                    <div key={l} style={{textAlign:"center"}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:C.text}}>{v}{u}</div>
                      <div style={{fontSize:9,color:C.textDim,textTransform:"uppercase",letterSpacing:1}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"14px 16px"}}>
                <div style={{...S.lbl,color:C.orange,marginBottom:10}}>Latest Athleticism Test</div>
                {latestAth ? (
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                    {[["Vertical",latestAth.vert,'"'],["10m Sprint",latestAth.s10,"s"],["Weight",latestAth.wt,"lbs"]].map(([l,v,u])=>(
                      <div key={l} style={{textAlign:"center"}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:C.text}}>{v}{u}</div>
                        <div style={{fontSize:9,color:C.textDim,textTransform:"uppercase",letterSpacing:1}}>{l}</div>
                      </div>
                    ))}
                  </div>
                ) : <div style={{fontSize:11,color:C.textDim}}>No test logged yet.</div>}
              </div>
            </div>

            {/* Personal records */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"14px 16px"}}>
              <div style={{...S.lbl,color:C.orange,marginBottom:10}}>Personal Records</div>
              {Object.keys(prs).length===0 && <div style={{fontSize:11,color:C.textDim}}>Log gym sessions with weights to track PRs.</div>}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2px 20px"}}>
                {Object.entries(prs).sort((a,b)=>b[1].w-a[1].w).slice(0,10).map(([ex,{w,date}])=>(
                  <div key={ex} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${C.border}`}}>
                    <span style={{fontSize:11,color:C.textMid}}>{ex}</span>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:C.orange}}>{w} kg</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ GYM ══ */}
        {view==="gym" && (
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:900,color:C.text,letterSpacing:2,marginBottom:2}}>GYM SESSION LOG</div>
            <div style={{fontSize:11,color:C.textDim,marginBottom:18}}>Auto-progression suggestions · Volume tracking · PR detection · Injury monitoring</div>

            {/* Steps */}
            <div style={{display:"flex",alignItems:"center",marginBottom:20}}>
              {[["1","Workout"],["2","Exercises"],["3","Finish"]].map(([n,l],i)=>{
                const st=step>i+1?"done":step===i+1?"active":"idle";
                return (<div key={n} style={{display:"flex",alignItems:"center",flex:i<2?1:"none"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:10,background:st==="done"?C.orange:st==="active"?C.text:C.border,color:st==="active"?C.bg:C.text}}>{st==="done"?"✓":n}</div>
                    <span style={{fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:st==="active"?C.text:C.textDim}}>{l}</span>
                  </div>
                  {i<2&&<div style={{flex:1,height:1,background:C.border,margin:"0 8px"}}/>}
                </div>);
              })}
            </div>

            {step===1 && (
              <div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
                  {Object.entries(WORKOUTS).map(([k,w])=>(
                    <div key={k} onClick={()=>setSelW(k)} style={{background:C.card,border:`2px solid ${selW===k?w.color:C.border}`,borderRadius:4,padding:"12px 14px",cursor:"pointer",transition:"border-color 0.15s"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:w.color}}/>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:800,color:C.text,letterSpacing:1}}>{w.label}</span>
                      </div>
                      <div style={{fontSize:10,color:C.textDim}}>{w.sub}</div>
                      <div style={{fontSize:9,color:C.textDim,marginTop:4}}>{gymSessions.filter(s=>s.wk===k).length} sessions logged</div>
                    </div>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
                  <Field label="Date" value={gymInfo.date} onChange={v=>setGymInfo(p=>({...p,date:v}))} type="date"/>
                  <Field label="Time" value={gymInfo.time} onChange={v=>setGymInfo(p=>({...p,time:v}))} type="time"/>
                  <Field label="Duration (min)" value={gymInfo.dur} onChange={v=>setGymInfo(p=>({...p,dur:v}))} type="number" ph="75"/>
                </div>
                <div style={S.lbl}>Energy Level</div>
                <div style={{display:"flex",gap:5,marginBottom:16}}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n=>(
                    <button key={n} onClick={()=>setGymInfo(p=>({...p,energy:n}))} style={{width:30,height:30,borderRadius:3,border:`1px solid ${gymInfo.energy===n?C.orange:C.border}`,background:gymInfo.energy===n?C.orange:C.card,color:gymInfo.energy===n?"#fff":C.textDim,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,cursor:"pointer",outline:"none"}}>{n}</button>
                  ))}
                </div>
                <Btn label="Continue to Exercises →" onClick={()=>setStep(2)}/>
              </div>
            )}

            {step===2 && (
              <div>
                <div style={{background:C.card,border:`1px solid ${W.color}`,borderRadius:4,padding:"10px 14px",marginBottom:12}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:W.color}}>{W.label} — {W.sub}</div>
                  <div style={{fontSize:10,color:C.textDim,marginTop:1}}>{gymInfo.date} · {gymInfo.time} · Volume so far: {Math.round(calcVolume(gymLogs))} kg total</div>
                </div>
                <div style={{padding:"7px 10px",background:"#08180F",border:`1px solid ${C.green}30`,borderRadius:3,fontSize:10,color:C.green,marginBottom:12}}>⚑ PREHAB FIRST — 15 min · Ankle rocks · Hip switches · Band pull-aparts · Wall slides · Glute walks</div>

                <div style={{display:"flex",gap:5,marginBottom:12}}>
                  {["ALL","Perf","Aes","Core"].map(f=>(
                    <button key={f} onClick={()=>setExFilter(f)} style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,fontWeight:700,letterSpacing:1,padding:"4px 10px",border:`1px solid ${exFilter===f?C.orange:C.border}`,background:exFilter===f?C.orange:"transparent",color:exFilter===f?"#fff":C.textDim,cursor:"pointer",borderRadius:2,outline:"none",textTransform:"uppercase"}}>{f}</button>
                  ))}
                </div>

                {[["Perf","▶ Performance Block","#3B82F6"],["Aes","✦ Aesthetic Finisher",C.gold],["Core","◆ Core Block","#818CF8"]].map(([gk,gl,gc])=>{
                  const exs = grouped[gk].filter(e=>exFilter==="ALL"||exFilter===gk);
                  if(!exs.length) return null;
                  return (
                    <div key={gk}>
                      <SecHead label={gl} color={gc}/>
                      {exs.map(ex=><ExRow key={ex.name} ex={ex} logs={gymLogs} setLogs={setGymLogs} lastSession={lastSameWorkout}/>)}
                    </div>
                  );
                })}

                <div style={{display:"flex",gap:8,marginTop:14}}>
                  <Btn label="← Back" onClick={()=>setStep(1)} variant="ghost"/>
                  <Btn label="Continue to Finish →" onClick={()=>setStep(3)}/>
                </div>
              </div>
            )}

            {step===3 && (
              <div>
                <div style={S.lbl}>Injury Check — 1 = Fine · 5 = Bad</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
                  {[["a","Left Ankle"],["s","Left Shoulder"],["h","Left Hip"]].map(([k,l])=>(
                    <div key={k} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:4,padding:12}}>
                      <div style={{...S.lbl,marginBottom:8}}>{l}</div>
                      <div style={{display:"flex",gap:3}}>
                        {[1,2,3,4,5].map(n=>{const sel=gymInj[k]===n;const col=injC(n);return<button key={n} onClick={()=>setGymInj(p=>({...p,[k]:n}))} style={{flex:1,height:26,borderRadius:2,border:`1px solid ${sel?col:C.border}`,background:sel?col+"22":"transparent",color:sel?col:C.textDim,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,cursor:"pointer",outline:"none"}}>{n}</button>;})}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{display:"grid",gap:8,marginBottom:16}}>
                  {[["well","What went well?"],["imp","What needs work?"],["nxt","Adjustment for next session?"]].map(([k,ph])=>(
                    <textarea key={k} rows={2} placeholder={ph} value={gymNote[k]} onChange={e=>setGymNote(p=>({...p,[k]:e.target.value}))}
                      style={{...inp,resize:"none"}} onFocus={e=>e.target.style.borderColor=C.orange} onBlur={e=>e.target.style.borderColor=C.border}/>
                  ))}
                </div>
                <div style={{background:"#08180F",border:`1px solid ${C.green}30`,borderRadius:4,padding:"10px 14px",marginBottom:16,fontSize:11,color:C.textMid}}>
                  Session volume: <span style={{color:C.orange,fontWeight:600}}>{Math.round(calcVolume(gymLogs)).toLocaleString()} kg</span> total lifted
                </div>
                <div style={{display:"flex",gap:8}}>
                  <Btn label="← Back" onClick={()=>setStep(2)} variant="ghost"/>
                  <Btn label={gymSaved?"✓ Saved!":"Save Session →"} onClick={saveGym} variant={gymSaved?"success":"primary"}/>
                </div>
              </div>
            )}

            {/* Recent sessions */}
            <div style={{marginTop:24}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:800,letterSpacing:2,color:C.orange,marginBottom:10}}>RECENT SESSIONS</div>
              {[...gymSessions].reverse().slice(0,5).map(s=>{
                const w=WORKOUTS[s.wk];
                return (
                  <div key={s.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:4,padding:"10px 14px",marginBottom:6,display:"grid",gridTemplateColumns:"4px 1fr auto",gap:12,alignItems:"start"}}>
                    <div style={{background:w?.color||C.border,borderRadius:2,alignSelf:"stretch",minHeight:38}}/>
                    <div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:800,color:w?.color||C.text}}>{w?.label} — {w?.sub}</div>
                      <div style={{fontSize:10,color:C.textDim,marginTop:1}}>{s.date} · {s.time} · {Math.round(calcVolume(s.sets)).toLocaleString()} kg vol</div>
                      {s.note&&s.note!="||"&&<div style={{fontSize:9,color:C.textDim,marginTop:4,fontStyle:"italic"}}>{s.note.split("|")[0]}</div>}
                    </div>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      <div style={{textAlign:"center"}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:C.text}}>{s.energy}<span style={{fontSize:9,color:C.textDim}}>/10</span></div>
                        <div style={{fontSize:8,color:C.textDim,textTransform:"uppercase",letterSpacing:1}}>Energy</div>
                      </div>
                      <div style={{display:"flex",gap:3}}>
                        {[s.inj.a,s.inj.s,s.inj.h].map((v,i)=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:injC(v)}}/>)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ SHOOTING ══ */}
        {view==="shooting" && (
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:900,color:C.text,letterSpacing:2,marginBottom:2}}>SHOOTING TRACKER</div>
            <div style={{fontSize:11,color:C.textDim,marginBottom:18}}>Hot zone map · Session logs · Percentage trends · Zone breakdown</div>

            <div style={{marginBottom:14}}>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"14px 16px",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{...S.lbl,color:C.orange,margin:0}}>HOT ZONE MAP</div>
                  <div style={{display:"flex",gap:16}}>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:900,color:C.orange}}>{shotSessions.length}</div>
                      <div style={{fontSize:8,color:C.textDim,textTransform:"uppercase",letterSpacing:1}}>Sessions</div>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:900,color:C.blue}}>{shotSessions.reduce((a,s)=>a+s.att,0)}</div>
                      <div style={{fontSize:8,color:C.textDim,textTransform:"uppercase",letterSpacing:1}}>Total Shots</div>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:900,color:pctC(overallShotPct)}}>{fmt(overallShotPct*100)}%</div>
                      <div style={{fontSize:8,color:C.textDim,textTransform:"uppercase",letterSpacing:1}}>Overall FG%</div>
                    </div>
                  </div>
                </div>
                <HotZoneMap shotsByZone={shotsByZone}/>
              </div>

              {/* Zone stat pills */}
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"10px 12px",marginBottom:10,display:"flex",gap:5,flexWrap:"wrap",justifyContent:"center"}}>
                {[
                  {id:"under_basket",label:"Rim"},{id:"close_l",label:"Cls L"},{id:"close_c",label:"Cls C"},{id:"close_r",label:"Cls R"},
                  {id:"mid_base_l",label:"Mid BL"},{id:"mid_wing_l",label:"Mid WL"},{id:"mid_top",label:"Mid Top"},{id:"mid_wing_r",label:"Mid WR"},{id:"mid_base_r",label:"Mid BR"},
                  {id:"corner3_l",label:"Cor3 L"},{id:"wing3_l",label:"Wing3 L"},{id:"top3",label:"Top 3"},{id:"wing3_r",label:"Wing3 R"},{id:"corner3_r",label:"Cor3 R"},
                ].map(({id,label})=>{
                  const zd=shotsByZone[id]||{a:0,m:0};
                  if(!zd.a) return null;
                  const pct=zd.m/zd.a;
                  const {fill,text}=zoneColorFn(pct);
                  return (
                    <div key={id} style={{background:fill,borderRadius:3,padding:"4px 8px"}}>
                      <div style={{fontSize:7,color:text,opacity:0.7,fontWeight:700,letterSpacing:0.5,textTransform:"uppercase"}}>{label}</div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:800,color:text}}>{Math.round(pct*100)}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"14px 16px"}}>
                <div style={{...S.lbl,color:C.orange,marginBottom:12}}>LOG SHOOTING SESSION</div>
                <div style={{display:"grid",gap:9}}>
                  <Field label="Date" value={shotForm.date} onChange={v=>setShotForm(p=>({...p,date:v}))} type="date"/>
                  <Sel label="Drill" value={shotForm.drill} onChange={v=>setShotForm(p=>({...p,drill:v}))} opts={[["Catch and Shoot — 5 Spot","Catch and Shoot — 5 Spot"],["Pull-Up Jumper","Pull-Up Jumper"],["Off Screen Shooting","Off Screen Shooting"],["Corner 3 Series","Corner 3 Series"],["Free Throws","Free Throws"],["Mid-Range Series","Mid-Range Series"],["One Dribble Pull-Up","One Dribble Pull-Up"],["Floater Series","Floater Series"],["Form Shooting","Form Shooting"]]}/>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <Field label="Attempts" value={shotForm.att} onChange={v=>setShotForm(p=>({...p,att:v}))} type="number" ph="50"/>
                    <Field label="Made" value={shotForm.made} onChange={v=>setShotForm(p=>({...p,made:v}))} type="number" ph="20"/>
                  </div>
                  <Sel label="Zone" value={shotForm.zone} onChange={v=>setShotForm(p=>({...p,zone:v}))} opts={SHOT_ZONES.map(z=>[z.id,z.label])}/>
                  <Sel label="Shot Type" value={shotForm.type} onChange={v=>setShotForm(p=>({...p,type:v}))} opts={[["catch","Catch and Shoot"],["off-dribble","Off the Dribble"],["floater","Floater"],["free-throw","Free Throw"],["pull-up","Pull-Up"]]}/>
                  <Field label="Notes" value={shotForm.note} onChange={v=>setShotForm(p=>({...p,note:v}))} ph="Session notes..."/>
                  <Btn label={shotSaved?"✓ Saved!":"Add Session →"} onClick={saveShot} variant={shotSaved?"success":"primary"}/>
                </div>
              </div>

              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"14px 16px",overflowY:"auto",maxHeight:420}}>
                <div style={{...S.lbl,color:C.orange,marginBottom:10}}>SESSION LOG</div>
                {[...shotSessions].reverse().map(s=>{
                  const pct=s.att>0?s.made/s.att:0;
                  return (
                    <div key={s.id} style={{display:"grid",gridTemplateColumns:"1fr auto auto",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`,gap:12}}>
                      <div>
                        <div style={{fontSize:12,fontWeight:600,color:C.text}}>{s.drill}</div>
                        <div style={{fontSize:10,color:C.textDim}}>{s.date} · {SHOT_ZONES.find(z=>z.id===s.zone)?.label||s.zone} · {s.type}</div>
                        {s.note&&<div style={{fontSize:9,color:C.textDim,fontStyle:"italic",marginTop:2}}>{s.note}</div>}
                      </div>
                      <div style={{textAlign:"center"}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:C.text}}>{s.made}/{s.att}</div>
                        <div style={{fontSize:8,color:C.textDim}}>M/A</div>
                      </div>
                      <div style={{textAlign:"center",minWidth:44}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:pctC(pct)}}>{Math.round(pct*100)}%</div>
                        <div style={{fontSize:8,color:C.textDim}}>FG%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <ChartBox title="SHOOTING % PER SESSION" h={170} note="Target: 40%+">
              <LineChart data={shotChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                <XAxis dataKey="s" tick={{fill:C.textDim,fontSize:10}}/>
                <YAxis domain={[0,100]} tick={{fill:C.textDim,fontSize:10}}/>
                <Tooltip contentStyle={tt} formatter={v=>[`${v}%`,"FG%"]}/>
                <Line type="monotone" dataKey="pct" stroke={C.orange} strokeWidth={2} dot={{fill:C.orange,r:4}} name="FG%"/>
              </LineChart>
            </ChartBox>
          </div>
        )}

        {/* ══ GAMES ══ */}
        {view==="games" && (
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:900,color:C.text,letterSpacing:2,marginBottom:2}}>GAME PERFORMANCE</div>
            <div style={{fontSize:11,color:C.textDim,marginBottom:18}}>Track every game · Monitor your impact · See trends over the season</div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:7,marginBottom:14}}>
              {[["PPG",gameAvgs.pts,""],["RPG",gameAvgs.reb,""],["APG",gameAvgs.ast,""],["TOPG",gameAvgs.to,""],["FG%",gameAvgs.fg,"%"],["MPG",gameAvgs.mins,""]].map(([l,v,u])=>(
                <StatCard key={l} label={l} value={v||"—"} unit={u} size={22}/>
              ))}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"14px 16px"}}>
                <div style={{...S.lbl,color:C.orange,marginBottom:12}}>LOG GAME</div>
                <div style={{display:"grid",gap:8}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <Field label="Date" value={gameForm.date} onChange={v=>setGameForm(p=>({...p,date:v}))} type="date"/>
                    <Field label="Opponent" value={gameForm.opp} onChange={v=>setGameForm(p=>({...p,opp:v}))} ph="Team name"/>
                  </div>
                  <div>
                    <div style={S.lbl}>Result</div>
                    <div style={{display:"flex",gap:6}}>
                      {["W","L"].map(r=><button key={r} onClick={()=>setGameForm(p=>({...p,res:r}))} style={{flex:1,padding:"7px",borderRadius:3,border:`1px solid ${gameForm.res===r?(r==="W"?C.green:C.red):C.border}`,background:gameForm.res===r?(r==="W"?C.greenDim:"#4A001020"):"transparent",color:gameForm.res===r?(r==="W"?C.green:C.red):C.textDim,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:13,cursor:"pointer",outline:"none"}}>{r}</button>)}
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7}}>
                    {[["Minutes","mins"],["Points","pts"],["Rebounds","reb"],["Assists","ast"],["Steals","stl"],["Blocks","blk"],["Turnovers","to"],["FG Made","fgm"],["FG Att","fga"]].map(([l,k])=>(
                      <Field key={k} label={l} value={gameForm[k]} onChange={v=>setGameForm(p=>({...p,[k]:v}))} type="number" ph="0"/>
                    ))}
                  </div>
                  <Btn label={gameSaved?"✓ Saved!":"Add Game →"} onClick={saveGame} variant={gameSaved?"success":"primary"}/>
                </div>
              </div>

              <div>
                <ChartBox title="POINTS + REBOUNDS TREND" h={170}>
                  <BarChart data={gameChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                    <XAxis dataKey="s" tick={{fill:C.textDim,fontSize:10}}/>
                    <YAxis tick={{fill:C.textDim,fontSize:10}}/>
                    <Tooltip contentStyle={tt}/>
                    <Legend wrapperStyle={{fontSize:10}}/>
                    <Bar dataKey="pts" fill={C.orange} radius={[2,2,0,0]} name="Points"/>
                    <Bar dataKey="reb" fill={C.blue} radius={[2,2,0,0]} name="Rebounds"/>
                  </BarChart>
                </ChartBox>
                <ChartBox title="FG% PER GAME" h={130}>
                  <LineChart data={gameChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                    <XAxis dataKey="s" tick={{fill:C.textDim,fontSize:10}}/>
                    <YAxis domain={[0,100]} tick={{fill:C.textDim,fontSize:10}}/>
                    <Tooltip contentStyle={tt} formatter={v=>[`${v}%`,"FG%"]}/>
                    <Line type="monotone" dataKey="fg" stroke={C.green} strokeWidth={2} dot={{r:3}} name="FG%"/>
                  </LineChart>
                </ChartBox>
              </div>
            </div>

            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"14px 16px"}}>
              <div style={{...S.lbl,color:C.orange,marginBottom:10}}>GAME LOG</div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead>
                    <tr>{["DATE","OPP","RES","MIN","PTS","REB","AST","STL","BLK","TO","FG%"].map(h=><th key={h} style={{fontSize:8,fontWeight:700,letterSpacing:1,color:C.textDim,textTransform:"uppercase",padding:"4px 8px",textAlign:"center",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {[...gameSessions].reverse().map((g,i)=>(
                      <tr key={g.id} style={{background:i%2===0?"transparent":C.card+"80"}}>
                        {[g.date,g.opp,<span style={{color:g.res==="W"?C.green:C.red,fontWeight:700}}>{g.res}</span>,g.mins,g.pts,g.reb,g.ast,g.stl,g.blk,g.to,<span style={{color:g.fga>0?pctC(g.fgm/g.fga):C.textDim}}>{g.fga>0?Math.round(g.fgm/g.fga*100):0}%</span>].map((v,j)=>(
                          <td key={j} style={{padding:"6px 8px",textAlign:"center",fontFamily:j>=3?"'Barlow Condensed',sans-serif":"inherit",fontSize:j>=3?14:11,fontWeight:j>=3?700:400}}>{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══ ATHLETE ══ */}
        {view==="athlete" && (
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:900,color:C.text,letterSpacing:2,marginBottom:2}}>ATHLETE MONITORING</div>
            <div style={{fontSize:11,color:C.textDim,marginBottom:18}}>Athleticism tests · Daily wellness · Readiness score · Body metrics</div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              {/* Athleticism log */}
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"14px 16px"}}>
                <div style={{...S.lbl,color:C.orange,marginBottom:12}}>LOG ATHLETICISM TEST</div>
                <div style={{display:"grid",gap:8}}>
                  <Field label="Date" value={athForm.date} onChange={v=>setAthForm(p=>({...p,date:v}))} type="date"/>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <Field label='Vertical Jump (in")' value={athForm.vert} onChange={v=>setAthForm(p=>({...p,vert:v}))} type="number" ph="28"/>
                    <Field label="10m Sprint (sec)" value={athForm.s10} onChange={v=>setAthForm(p=>({...p,s10:v}))} type="number" ph="1.82"/>
                    <Field label="20m Sprint (sec)" value={athForm.s20} onChange={v=>setAthForm(p=>({...p,s20:v}))} type="number" ph="3.10"/>
                    <Field label="Weight (lbs)" value={athForm.wt} onChange={v=>setAthForm(p=>({...p,wt:v}))} type="number" ph="215"/>
                    <Field label="Body Fat %" value={athForm.bf} onChange={v=>setAthForm(p=>({...p,bf:v}))} type="number" ph="15"/>
                  </div>
                  <Btn label={athSaved?"✓ Saved!":"Log Results →"} onClick={saveAth} variant={athSaved?"success":"primary"}/>
                </div>
              </div>

              {/* Wellness check */}
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"14px 16px"}}>
                <div style={{...S.lbl,color:C.orange,marginBottom:12}}>DAILY WELLNESS CHECK</div>
                {readiness !== null && (
                  <div style={{background:readiness>=70?C.greenDim:readiness>=50?C.orangeDim:"#4A001020",border:`1px solid ${readiness>=70?C.green:readiness>=50?C.orange:C.red}`,borderRadius:4,padding:"8px 12px",marginBottom:12,textAlign:"center"}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,color:readiness>=70?C.green:readiness>=50?C.gold:C.red}}>{readiness}</div>
                    <div style={{fontSize:9,color:C.textDim,textTransform:"uppercase",letterSpacing:1}}>Today's Readiness Score</div>
                  </div>
                )}
                <div style={{display:"grid",gap:10}}>
                  <Field label="Date" value={wellForm.date} onChange={v=>setWellForm(p=>({...p,date:v}))} type="date"/>
                  {[["sleep","Sleep Quality (1–5)"],["soreness","Muscle Soreness (1–5)"],["stress","Stress Level (1–5)"],["motivation","Motivation (1–5)"],["fatigue","Fatigue Level (1–5)"]].map(([k,l])=>(
                    <div key={k}>
                      <div style={S.lbl}>{l}</div>
                      <div style={{display:"flex",gap:4}}>
                        {[1,2,3,4,5].map(n=>{
                          const sel=wellForm[k]===n;
                          return <button key={n} onClick={()=>setWellForm(p=>({...p,[k]:n}))} style={{flex:1,height:28,borderRadius:2,border:`1px solid ${sel?C.orange:C.border}`,background:sel?C.orange:"transparent",color:sel?"#fff":C.textDim,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer",outline:"none"}}>{n}</button>;
                        })}
                      </div>
                    </div>
                  ))}
                  <Btn label={wellSaved?"✓ Saved!":"Log Wellness →"} onClick={saveWell} variant={wellSaved?"success":"primary"}/>
                </div>
              </div>
            </div>

            {latestAth && (
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:14}}>
                {[["Vertical",latestAth.vert,'"'],["10m Sprint",latestAth.s10,"s"],["20m Sprint",latestAth.s20,"s"],["Weight",latestAth.wt,"lbs"],["Body Fat",latestAth.bf,"%"]].map(([l,v,u])=>(
                  <StatCard key={l} label={l} value={v||"—"} unit={u} size={22}/>
                ))}
              </div>
            )}

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <ChartBox title="VERTICAL JUMP PROGRESS" h={160}>
                <LineChart data={athChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                  <XAxis dataKey="s" tick={{fill:C.textDim,fontSize:10}}/>
                  <YAxis domain={['auto','auto']} tick={{fill:C.textDim,fontSize:10}}/>
                  <Tooltip contentStyle={tt} formatter={v=>[`${v}"`,"Vertical"]}/>
                  <Line type="monotone" dataKey="vert" stroke={C.orange} strokeWidth={2} dot={{fill:C.orange,r:4}} name="Vertical"/>
                </LineChart>
              </ChartBox>
              <ChartBox title="SPRINT SPEED — 10M" h={160}>
                <LineChart data={athChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                  <XAxis dataKey="s" tick={{fill:C.textDim,fontSize:10}}/>
                  <YAxis domain={['auto','auto']} tick={{fill:C.textDim,fontSize:10}}/>
                  <Tooltip contentStyle={tt} formatter={v=>[`${v}s`,"10m"]}/>
                  <Line type="monotone" dataKey="s10" stroke={C.green} strokeWidth={2} dot={{r:4}} name="10m Sprint"/>
                </LineChart>
              </ChartBox>
            </div>
          </div>
        )}

        {/* ══ ANALYTICS ══ */}
        {view==="analytics" && (
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:900,color:C.text,letterSpacing:2,marginBottom:2}}>ANALYTICS DASHBOARD</div>
            <div style={{fontSize:11,color:C.textDim,marginBottom:18}}>Volume · Injury trends · Workload · Shooting · Personal records</div>

            {acwr && (
              <div style={{background:Number(acwr)<0.8?C.greenDim:Number(acwr)<1.3?C.orangeDim:"#4A001020",border:`1px solid ${Number(acwr)<0.8?C.green:Number(acwr)<1.3?C.orange:C.red}`,borderRadius:4,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
                <div style={{textAlign:"center",minWidth:60}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,color:Number(acwr)<0.8?C.green:Number(acwr)<1.3?C.gold:C.red}}>{acwr}</div>
                  <div style={{fontSize:9,color:C.textDim,textTransform:"uppercase",letterSpacing:1}}>ACWR</div>
                </div>
                <div style={{fontSize:11,color:C.textMid,lineHeight:1.5}}>
                  <strong style={{color:C.text}}>Acute:Chronic Workload Ratio</strong> — {Number(acwr)<0.8?"Below optimal. Increase training load.":Number(acwr)<1.3?"Optimal training zone. Maintain.":"High injury risk. Reduce volume immediately."}
                </div>
              </div>
            )}

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <ChartBox title="GYM ENERGY TREND" h={170}>
                <LineChart data={gymChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                  <XAxis dataKey="s" tick={{fill:C.textDim,fontSize:10}}/>
                  <YAxis domain={[0,10]} tick={{fill:C.textDim,fontSize:10}}/>
                  <Tooltip contentStyle={tt}/>
                  <Line type="monotone" dataKey="energy" stroke={C.orange} strokeWidth={2} dot={{r:3}} name="Energy"/>
                </LineChart>
              </ChartBox>
              <ChartBox title="TRAINING VOLUME" h={170} note="kg total lifted per session">
                <AreaChart data={gymChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                  <XAxis dataKey="s" tick={{fill:C.textDim,fontSize:10}}/>
                  <YAxis tick={{fill:C.textDim,fontSize:10}}/>
                  <Tooltip contentStyle={tt}/>
                  <Area type="monotone" dataKey="vol" stroke={C.orange} fill={C.orangeDim} strokeWidth={2} name="Volume"/>
                </AreaChart>
              </ChartBox>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <ChartBox title="INJURY TRACKING — Left Side" h={160} note="Lower = better (1–5 scale)">
                <LineChart data={gymChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                  <XAxis dataKey="s" tick={{fill:C.textDim,fontSize:10}}/>
                  <YAxis domain={[1,5]} tick={{fill:C.textDim,fontSize:10}}/>
                  <Tooltip contentStyle={tt}/>
                  <Legend wrapperStyle={{fontSize:10}}/>
                  <Line type="monotone" dataKey="ank" stroke={C.green} strokeWidth={2} dot={{r:2}} name="Ankle"/>
                  <Line type="monotone" dataKey="sho" stroke={C.gold} strokeWidth={2} dot={{r:2}} name="Shoulder"/>
                  <Line type="monotone" dataKey="hip" stroke="#F97316" strokeWidth={2} dot={{r:2}} name="Hip"/>
                </LineChart>
              </ChartBox>
              <ChartBox title="SHOOTING % TREND" h={160}>
                <LineChart data={shotChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                  <XAxis dataKey="s" tick={{fill:C.textDim,fontSize:10}}/>
                  <YAxis domain={[0,100]} tick={{fill:C.textDim,fontSize:10}}/>
                  <Tooltip contentStyle={tt} formatter={v=>[`${v}%`,"FG%"]}/>
                  <Line type="monotone" dataKey="pct" stroke={C.orange} strokeWidth={2} dot={{r:3}} name="FG%"/>
                </LineChart>
              </ChartBox>
            </div>

            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"14px 16px",marginBottom:14}}>
              <div style={{...S.lbl,color:C.orange,marginBottom:12}}>PERSONAL RECORDS</div>
              {Object.keys(prs).length===0 && <div style={{fontSize:11,color:C.textDim}}>Log gym sets with weights to track PRs.</div>}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"2px 16px"}}>
                {Object.entries(prs).sort((a,b)=>b[1].w-a[1].w).map(([ex,{w,date}])=>(
                  <div key={ex} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${C.border}`}}>
                    <span style={{fontSize:10,color:C.textMid}}>{ex}</span>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:C.orange}}>{w}kg</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"14px 16px"}}>
              <div style={{...S.lbl,color:C.orange,marginBottom:10}}>ACTIVITY HEATMAP</div>
              <CalendarHeatmap gymSessions={gymSessions} shotSessions={shotSessions}/>
            </div>
          </div>
        )}

        {/* ══ COACH ══ */}
        {view==="coach" && (
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:900,color:C.text,letterSpacing:2,marginBottom:2}}>SMART COACHING PANEL</div>
            <div style={{fontSize:11,color:C.textDim,marginBottom:18}}>Automated feedback from your data · Flags · Progress targets · Radar</div>

            {/* Coaching flags */}
            <div style={{marginBottom:20}}>
              {coachingAlerts.map((a,i)=>(
                <div key={i} style={{background:C.card,border:`1px solid ${a.type==="good"?C.green+"33":C.orange+"33"}`,borderLeft:`3px solid ${a.type==="good"?C.green:C.orange}`,borderRadius:4,padding:"10px 14px",marginBottom:8,display:"flex",alignItems:"flex-start",gap:10}}>
                  <span style={{fontSize:14,lineHeight:1.4}}>{a.type==="good"?"✓":"⚠"}</span>
                  <div>
                    <div style={{fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:a.type==="good"?C.green:C.orange,marginBottom:3}}>{a.type==="good"?"Positive Signal":"Action Required"}</div>
                    <div style={{fontSize:12,color:C.text,lineHeight:1.5}}>{a.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Your shot chart analysis */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"14px 16px",marginBottom:14}}>
              <div style={{...S.lbl,color:C.orange,marginBottom:12}}>HOT ZONE BREAKDOWN — COACH ANALYSIS</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {SHOT_ZONES.map(z=>{
                  const zd=shotsByZone[z.id]||{a:0,m:0};
                  const pct=zd.a>0?zd.m/zd.a:null;
                  if(!zd.a) return null;
                  return (
                    <div key={z.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
                      <span style={{fontSize:11,color:C.textMid}}>{z.label}</span>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:10,color:C.textDim}}>{zd.m}/{zd.a}</span>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:pctC(pct)}}>{Math.round(pct*100)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Radar */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"16px 18px",marginBottom:14}}>
              <div style={{...S.lbl,color:C.orange,marginBottom:14}}>ATHLETE DEVELOPMENT RADAR</div>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={[
                  {m:"Consistency",v:Math.min(100,gymSessions.length*10)},
                  {m:"Shooting %",v:Math.round(overallShotPct*100)},
                  {m:"Game Impact",v:gameAvgs.pts?Math.min(100,Number(gameAvgs.pts)*4):0},
                  {m:"Vertical",v:latestAth?Math.min(100,latestAth.vert*2.6):0},
                  {m:"Ankle Health",v:gymSessions.length?Math.round((1-(avg(gymSessions,s=>s.inj.a)-1)/4)*100):50},
                  {m:"Readiness",v:readiness||50},
                ]}>
                  <PolarGrid stroke={C.border}/>
                  <PolarAngleAxis dataKey="m" tick={{fill:C.textDim,fontSize:10}}/>
                  <Radar dataKey="v" stroke={C.orange} fill={C.orange} fillOpacity={0.2}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* 12 week targets */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"14px 16px"}}>
              <div style={{...S.lbl,color:C.orange,marginBottom:14}}>12-WEEK DEVELOPMENT TARGETS</div>
              {[
                ["Catch-and-Shoot %","Current: "+fmt(overallShotPct*100)+"%","Target: 40%",Math.min(100,Math.round(overallShotPct*100/40*100))],
                ["Vertical Jump","Current: "+(latestAth?.vert||"—")+'"',"Target: 36\"",latestAth?Math.min(100,Math.round(latestAth.vert/36*100)):5],
                ["Gym Sessions","Logged: "+gymSessions.length,"Target: 36 sessions",Math.min(100,Math.round(gymSessions.length/36*100))],
                ["Game Impact","PPG: "+(gameAvgs.pts||"—"),"Target: 15 PPG",gameAvgs.pts?Math.min(100,Math.round(Number(gameAvgs.pts)/15*100)):5],
                ["Minutes Per Game","MPG: "+(gameAvgs.mins||"—"),"Target: 25+ MPG",gameAvgs.mins?Math.min(100,Math.round(Number(gameAvgs.mins)/25*100)):5],
              ].map(([t,cur,tar,pct])=>(
                <div key={t} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontSize:12,fontWeight:600,color:C.text}}>{t}</span>
                    <span style={{fontSize:10,color:C.textDim}}>{cur} → {tar}</span>
                  </div>
                  <div style={{height:5,background:C.border,borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:pct>=80?C.green:pct>=40?C.orange:C.red,borderRadius:3,transition:"width 0.6s"}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
