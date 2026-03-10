// ── SEED DATA ─────────────────────────────────────────────────────────────────
export const SEED_GYM = [
  {id:1,wk:"W2",date:"2026-03-02",time:"07:30",dur:75,energy:7,inj:{a:2,s:2,h:2},note:"Good session|Shoulder clicked|Monitor shoulder",sets:{"Back Squat":{1:{w:"100",r:"5",f:"4"},2:{w:"100",r:"5",f:"4"},3:{w:"100",r:"4",f:"3"},4:{w:"100",r:"4",f:"3"}},"Romanian Deadlift":{1:{w:"110",r:"6",f:"4"},2:{w:"110",r:"6",f:"4"},3:{w:"110",r:"5",f:"3"}},"Bulgarian Split Squat":{1:{w:"32",r:"8",f:"3"},2:{w:"32",r:"7",f:"3"},3:{w:"30",r:"8",f:"3"}}}},
  {id:2,wk:"W1",date:"2026-03-04",time:"08:00",dur:80,energy:8,inj:{a:1,s:1,h:3},note:"Felt strong|Hip tight on split squat|Ice hip tonight",sets:{"Bench Press":{1:{w:"90",r:"6",f:"4"},2:{w:"90",r:"6",f:"4"},3:{w:"90",r:"5",f:"3"}},"Push Press":{1:{w:"70",r:"4",f:"4"},2:{w:"70",r:"4",f:"4"},3:{w:"70",r:"4",f:"4"},4:{w:"70",r:"3",f:"3"}},"Barbell Rows":{1:{w:"80",r:"8",f:"4"},2:{w:"80",r:"8",f:"4"},3:{w:"80",r:"7",f:"3"}}}},
  {id:3,wk:"W3",date:"2026-03-06",time:"06:45",dur:70,energy:6,inj:{a:2,s:1,h:2},note:"Lateral bounds felt good|Floaters inconsistent|More floater work next court day",sets:{"Goblet Squat":{1:{w:"32",r:"6",f:"4"},2:{w:"32",r:"6",f:"4"},3:{w:"32",r:"5",f:"3"}},"Walking Lunges":{1:{w:"24",r:"10",f:"4"},2:{w:"24",r:"10",f:"3"},3:{w:"24",r:"9",f:"3"}},"Single Leg RDL":{1:{w:"20",r:"6",f:"3"},2:{w:"20",r:"6",f:"3"},3:{w:"20",r:"5",f:"3"}}}},
];

export const SEED_SHOTS = [
  {id:1,date:"2026-03-02",drill:"Catch and Shoot — 5 Spot",att:50,made:18,zone:"wing3_l",type:"catch",note:"Release still slow"},
  {id:2,date:"2026-03-04",drill:"Catch and Shoot — 5 Spot",att:50,made:21,zone:"wing3_r",type:"catch",note:"Right side better"},
  {id:3,date:"2026-03-06",drill:"Pull-Up Jumper",att:30,made:14,zone:"mid_wing_l",type:"off-dribble",note:"Footwork improving"},
  {id:4,date:"2026-03-07",drill:"Floater Series",att:25,made:8,zone:"close_c",type:"floater",note:"Close mid still inconsistent"},
  {id:5,date:"2026-03-08",drill:"Corner 3 Series",att:40,made:17,zone:"corner3_r",type:"catch",note:"Right corner comfortable"},
  {id:6,date:"2026-03-08",drill:"Floater Series",att:30,made:19,zone:"under_basket",type:"floater",note:"Elite at the rim"},
  {id:7,date:"2026-03-09",drill:"Mid-Range Series",att:20,made:7,zone:"mid_top",type:"pull-up",note:"Footwork needs work"},
];

export const SEED_GAMES = [
  {id:1,date:"2026-02-20",opp:"Team A",res:"W",mins:18,pts:8,reb:4,ast:2,stl:1,blk:1,to:2,fgm:3,fga:8,ftm:2,fta:2,pm:"+4"},
  {id:2,date:"2026-02-27",opp:"Team B",res:"L",mins:12,pts:4,reb:2,ast:1,stl:0,blk:0,to:1,fgm:2,fga:7,ftm:0,fta:1,pm:"-6"},
  {id:3,date:"2026-03-05",opp:"Team C",res:"W",mins:22,pts:14,reb:6,ast:3,stl:2,blk:1,to:2,fgm:5,fga:11,ftm:4,fta:5,pm:"+8"},
];

export const SEED_ATH = [
  {id:1,date:"2026-02-20",vert:28,s10:1.82,s20:3.12,wt:215,bf:16.0},
  {id:2,date:"2026-03-07",vert:29,s10:1.80,s20:3.08,wt:214,bf:15.8},
];

export const SEED_WELLNESS = [
  {id:1,date:"2026-03-07",sleep:3,soreness:3,stress:2,motivation:4,fatigue:3},
  {id:2,date:"2026-03-08",sleep:4,soreness:2,stress:2,motivation:5,fatigue:2},
];
