// ── SHOT CHART COURT GEOMETRY ─────────────────────────────────────────────────
// viewBox 500 × 470. Basket: (250, 417.5). 1ft = 10px. Verified intersections.
export const SC_VW = 500, SC_VH = 470;
export const SC_BX = 250, SC_BY = 417.5;
export const SC_R3 = 237.5;
export const SC_CY = 328.02;
export const SC_CL = 30, SC_CR = 470;
export const SC_PL = 170, SC_PR = 330;
export const SC_FY = 280;
export const SC_TY = 193.88;
export const SC_AFL = 56.35, SC_AFR = 443.65;
export const SC_CHR = 40, SC_FTR = 60;

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

export const SC_ZPATHS = {
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
export const SHOT_ZONES = [
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

export function zoneColorFn(pct) {
  if (pct === null) return { fill:"#081624", op:0.80, text:"#15304A" };
  if (pct < 0.25)   return { fill:"#1E3A8A", op:0.88, text:"#93C5FD" };
  if (pct < 0.33)   return { fill:"#7F1D1D", op:0.88, text:"#FCA5A5" };
  if (pct < 0.42)   return { fill:"#C2410C", op:0.88, text:"#FED7AA" };
  if (pct < 0.50)   return { fill:"#CA8A04", op:0.88, text:"#FEF08A" };
  if (pct < 0.58)   return { fill:"#166534", op:0.90, text:"#86EFAC" };
  return              { fill:"#14532D", op:0.93, text:"#4ADE80" };
}

export function HotZoneMapCourtLines() {
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
