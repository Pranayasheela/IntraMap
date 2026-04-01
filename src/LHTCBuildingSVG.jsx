// LHTCBuildingSVG.jsx
// Interactive SVG illustration of the LHTC building.
// Props:
//   litFloor      — floor number to highlight (0 = Ground, 1 = 1st), or null
//   onFloorClick  — (floorNumber: number) => void
//   onFloorHover  — (floorNumber: number | null) => void

export default function LHTCBuildingSVG({ litFloor, onFloorClick, onFloorHover }) {
  const winFill  = (fn) => litFloor === fn ? "#ff6820" : "#2a2a38";
  const winClass = (fn) => litFloor === fn ? "lhtc-win svglit" : "lhtc-win";

  return (
    <svg
      viewBox="0 0 900 500"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <style>{`
        @keyframes winPulse { 0%,100%{opacity:0.85} 50%{opacity:1} }
        .lhtc-win { transition: fill 0.25s; }
        .svglit    { animation: winPulse 1.4s ease-in-out infinite; filter: drop-shadow(0 0 6px #ff6820); }
        .fzone     { cursor: pointer; }
        .fzone:hover { opacity: 0.01; }
      `}</style>

      {/* Sky */}
      <rect width="900" height="500" fill="#c8c0b8"/>
      {/* Ground */}
      <rect x="0" y="390" width="900" height="110" fill="#b8a898"/>
      {/* Grass */}
      <ellipse cx="95"  cy="396" rx="115" ry="14" fill="#7db360"/>
      <ellipse cx="805" cy="396" rx="115" ry="14" fill="#7db360"/>

      {/* Wings */}
      <rect x="40"  y="148" width="270" height="245" fill="#c8a888"/>
      <rect x="590" y="148" width="270" height="245" fill="#c8a888"/>
      {/* Center */}
      <rect x="295" y="118" width="310" height="275" fill="#c0a07a"/>

      {/* Floor bands */}
      <rect x="40"  y="145" width="820" height="8"  fill="#9a7048"/>
      <rect x="40"  y="270" width="820" height="8"  fill="#a07858"/>
      <rect x="40"  y="386" width="820" height="7"  fill="#9a7048"/>

      {/* Center glass — 1st floor */}
      <rect x="310" y="130" width="280" height="132" rx="2" fill="#1e2535"/>
      {/* Center glass — ground floor */}
      <rect x="310" y="278" width="280" height="108" rx="2" fill="#181e2c"/>
      {/* Center pillars */}
      <rect x="310" y="130" width="12"  height="258" fill="#9a7048"/>
      <rect x="578" y="130" width="12"  height="258" fill="#9a7048"/>
      {/* Center grid lines top */}
      <line x1="360" y1="130" x2="360" y2="260" stroke="#2a3245" strokeWidth="1.5"/>
      <line x1="408" y1="130" x2="408" y2="260" stroke="#2a3245" strokeWidth="1.5"/>
      <line x1="450" y1="130" x2="450" y2="260" stroke="#2a3245" strokeWidth="1.5"/>
      <line x1="496" y1="130" x2="496" y2="260" stroke="#2a3245" strokeWidth="1.5"/>
      <line x1="542" y1="130" x2="542" y2="260" stroke="#2a3245" strokeWidth="1.5"/>
      <line x1="322" y1="190" x2="578" y2="190" stroke="#2a3245" strokeWidth="1.5"/>
      {/* Center grid lines bottom */}
      <line x1="360" y1="278" x2="360" y2="386" stroke="#1e2535" strokeWidth="1.5"/>
      <line x1="408" y1="278" x2="408" y2="386" stroke="#1e2535" strokeWidth="1.5"/>
      <line x1="450" y1="278" x2="450" y2="386" stroke="#1e2535" strokeWidth="1.5"/>
      <line x1="496" y1="278" x2="496" y2="386" stroke="#1e2535" strokeWidth="1.5"/>
      <line x1="542" y1="278" x2="542" y2="386" stroke="#1e2535" strokeWidth="1.5"/>
      <line x1="322" y1="332" x2="578" y2="332" stroke="#1e2535" strokeWidth="1.5"/>

      {/* Canopy + steps */}
      <rect x="350" y="386" width="200" height="12" rx="2" fill="#8a6848"/>
      <rect x="360" y="398" width="180" height="7"  rx="1" fill="#7a5838"/>
      <rect x="365" y="405" width="170" height="8"  rx="1" fill="#b09070"/>
      <rect x="372" y="413" width="156" height="8"  rx="1" fill="#a08060"/>
      <rect x="380" y="421" width="140" height="8"  rx="1" fill="#907050"/>

      {/* 1st floor windows — left 6 */}
      {["w1f1","w1f2","w1f3","w1f4","w1f5","w1f6"].map((id, i) => (
        <rect key={id} id={id} className={winClass(1)} x={55 + i * 45} y="162" width="34" height="80" rx="2" fill={winFill(1)}/>
      ))}
      {/* 1st floor windows — right 6 */}
      {["w1f7","w1f8","w1f9","w1f10","w1f11","w1f12"].map((id, i) => (
        <rect key={id} id={id} className={winClass(1)} x={594 + i * 45} y="162" width="34" height="80" rx="2" fill={winFill(1)}/>
      ))}

      {/* Ground floor windows — left 6 */}
      {["wgf1","wgf2","wgf3","wgf4","wgf5","wgf6"].map((id, i) => (
        <rect key={id} id={id} className={winClass(0)} x={55 + i * 45} y="284" width="34" height="80" rx="2" fill={winFill(0)}/>
      ))}
      {/* Ground floor windows — right 6 */}
      {["wgf7","wgf8","wgf9","wgf10","wgf11","wgf12"].map((id, i) => (
        <rect key={id} id={id} className={winClass(0)} x={594 + i * 45} y="284" width="34" height="80" rx="2" fill={winFill(0)}/>
      ))}

      {/* Trees — left side */}
      <rect x="10"  y="300" width="10" height="90" rx="3" fill="#6b4c2a"/>
      <circle cx="15"  cy="285" r="38" fill="#4e8c36"/>
      <circle cx="2"   cy="305" r="22" fill="#428a2a"/>
      <circle cx="30"  cy="302" r="22" fill="#5a9940"/>

      <rect x="90"  y="325" width="9" height="68" rx="3" fill="#6b4c2a"/>
      <circle cx="94"  cy="312" r="32" fill="#4e8c36"/>
      <circle cx="78"  cy="323" r="20" fill="#428a2a"/>
      <circle cx="110" cy="321" r="20" fill="#5a9940"/>

      <rect x="185" y="332" width="9" height="58" rx="3" fill="#6b4c2a"/>
      <circle cx="189" cy="320" r="28" fill="#4e8c36"/>
      <circle cx="173" cy="330" r="18" fill="#428a2a"/>

      {/* Trees — right side */}
      <rect x="706" y="332" width="9" height="58" rx="3" fill="#6b4c2a"/>
      <circle cx="710" cy="320" r="28" fill="#4e8c36"/>
      <circle cx="724" cy="329" r="18" fill="#5a9940"/>

      <rect x="800" y="325" width="9" height="68" rx="3" fill="#6b4c2a"/>
      <circle cx="804" cy="312" r="32" fill="#4e8c36"/>
      <circle cx="820" cy="321" r="20" fill="#5a9940"/>
      <circle cx="788" cy="323" r="20" fill="#428a2a"/>

      <rect x="878" y="300" width="10" height="90" rx="3" fill="#6b4c2a"/>
      <circle cx="883" cy="285" r="38" fill="#4e8c36"/>
      <circle cx="866" cy="302" r="22" fill="#428a2a"/>
      <circle cx="898" cy="305" r="22" fill="#5a9940"/>

      {/* Flags */}
      <rect x="408" y="108" width="16" height="10" rx="1" fill="#3a8c3a"/>
      <rect x="432" y="105" width="14" height="10" rx="1" fill="#d4b820"/>
      <rect x="454" y="108" width="14" height="10" rx="1" fill="#c22020"/>

      {/* Floor badges */}
      <rect x="250" y="188" width="38" height="20" rx="5" fill="rgba(0,0,0,0.55)"/>
      <text x="269" y="202" textAnchor="middle" fontFamily="'Segoe UI',sans-serif" fontSize="11" fill="#ff8c5a" fontWeight="700">1F</text>
      <rect x="250" y="308" width="38" height="20" rx="5" fill="rgba(0,0,0,0.55)"/>
      <text x="269" y="322" textAnchor="middle" fontFamily="'Segoe UI',sans-serif" fontSize="11" fill="#ff8c5a" fontWeight="700">GF</text>

      {/* Tooltip label when a floor is lit */}
      {litFloor !== null && (
        <g>
          <rect x="300" y="456" width="300" height="30" rx="8" fill="#ff5a1e"/>
          <text x="450" y="475" textAnchor="middle" fontFamily="'Segoe UI',sans-serif" fontSize="12" fill="#fff" fontWeight="700">
            {litFloor === 1 ? "1st Floor" : "Ground Floor"} — highlighted
          </text>
        </g>
      )}

      {/* Building watermark */}
      <text x="450" y="492" textAnchor="middle" fontFamily="'Segoe UI',sans-serif" fontSize="10" fill="rgba(0,0,0,0.2)" letterSpacing="2">LHTC BUILDING — IIITDMJ CAMPUS</text>

      {/* Invisible click / hover zones */}
      <rect
        className="fzone" x="40" y="145" width="820" height="128" fill="transparent"
        onClick={() => onFloorClick(1)}
        onMouseEnter={() => onFloorHover(1)}
        onMouseLeave={() => onFloorHover(null)}
      />
      <rect
        className="fzone" x="40" y="273" width="820" height="116" fill="transparent"
        onClick={() => onFloorClick(0)}
        onMouseEnter={() => onFloorHover(0)}
        onMouseLeave={() => onFloorHover(null)}
      />
    </svg>
  );
}