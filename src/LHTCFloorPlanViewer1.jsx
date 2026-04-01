import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

const COLORS = {
  bg: "#0a0d13",
  panel: "#10141c",
  border: "#1e2530",
  accent: "#4a9eff",
  accent2: "#3ecf6e",
  accent3: "#f0c040",
  dim: "#5a6472",
  text: "#dde4ee",
};

// ─── Ground Floor SVG ─────────────────────────────────────────────────────────
function FloorPlan2D_Ground() {
  return (
    <svg
      viewBox="0 0 1100 480"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <rect width="1100" height="480" fill="#e8f4f8" />
      <rect x="30" y="30" width="1040" height="420" fill="#5c4a2e" rx="1" />
      <rect x="52" y="52" width="996" height="376" fill="#d4c9a8" />
      {/* Washroom block */}
      <rect x="52" y="52" width="295" height="215" fill="#5c4a2e" />
      <rect x="62" y="62" width="275" height="200" fill="#d4c9a8" />
      <rect x="62" y="165" width="275" height="10" fill="#5c4a2e" />
      <rect x="295" y="52" width="10" height="215" fill="#5c4a2e" />
      <rect x="242" y="62" width="53" height="95" fill="#c8bc98" />
      <rect x="242" y="62" width="53" height="8" fill="#7a6145" />
      <ellipse cx="268" cy="120" rx="18" ry="22" fill="white" stroke="#888" strokeWidth="1.5" />
      <ellipse cx="268" cy="108" rx="10" ry="8" fill="#ddd" stroke="#888" strokeWidth="1" />
      <rect x="242" y="175" width="53" height="77" fill="#c8bc98" />
      <rect x="242" y="175" width="53" height="8" fill="#7a6145" />
      <ellipse cx="268" cy="222" rx="18" ry="20" fill="white" stroke="#888" strokeWidth="1.5" />
      <ellipse cx="268" cy="213" rx="10" ry="7" fill="#ddd" stroke="#888" strokeWidth="1" />
      <rect x="68" y="90" width="160" height="22" fill="rgba(200,188,152,0.9)" rx="2" />
      <text x="148" y="105" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#2a1f0e">BOYS' WASHROOM</text>
      <rect x="68" y="195" width="163" height="22" fill="rgba(200,188,152,0.9)" rx="2" />
      <text x="150" y="210" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#2a1f0e">GIRLS' WASHROOM</text>
      {/* L-207 BG */}
      <rect x="305" y="52" width="175" height="220" fill="#5c4a2e" />
      <rect x="315" y="62" width="155" height="205" fill="#d4c9a8" />
      <rect x="315" y="160" width="155" height="10" fill="#5c4a2e" />
      <rect x="340" y="192" width="100" height="28" fill="rgba(200,188,152,0.9)" rx="2" />
      <text x="390" y="207" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2a1f0e">L-207</text>
      <text x="390" y="219" textAnchor="middle" fontSize="10" fill="#3a2e1a">(BG)</text>
      <path d="M 370 267 A 35 35 0 0 0 405 267" fill="rgba(212,201,168,0.4)" stroke="#e8a020" strokeWidth="1.5" />
      <rect x="480" y="52" width="10" height="215" fill="#5c4a2e" />
      <rect x="490" y="62" width="145" height="155" fill="#d4c9a8" />
      <rect x="635" y="52" width="10" height="215" fill="#5c4a2e" />
      <rect x="590" y="88" width="62" height="22" fill="rgba(200,188,152,0.9)" rx="2" />
      <text x="621" y="103" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2a1f0e">L-207</text>
      <path d="M 550 267 A 35 35 0 0 0 585 267" fill="rgba(212,201,168,0.4)" stroke="#e8a020" strokeWidth="1.5" />
      {/* Center Staircase */}
      <rect x="645" y="52" width="135" height="180" fill="#5c4a2e" />
      <rect x="655" y="62" width="115" height="155" fill="#b8a882" />
      <g fill="#a09070" stroke="#8a7a5a" strokeWidth="0.5">
        {[0,1,2,3,4,5,6,7,8,9].map(i=><rect key={i} x={660+i*5} y={68+i*14} width={105-i*10} height="14"/>)}
      </g>
      <defs>
        <marker id="arrG" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,8 L4,0 L8,8" fill="none" stroke="white" strokeWidth="1.2"/>
        </marker>
      </defs>
      <line x1="712" y1="200" x2="712" y2="75" stroke="white" strokeWidth="1.5" markerEnd="url(#arrG)"/>
      <rect x="655" y="200" width="115" height="22" fill="rgba(90,70,40,0.85)" rx="2"/>
      <text x="712" y="215" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f5e6c0">DOWNSTAIRS</text>
      {/* L-206 BG */}
      <rect x="780" y="52" width="12" height="215" fill="#5c4a2e"/>
      <rect x="792" y="52" width="155" height="220" fill="#5c4a2e"/>
      <rect x="802" y="62" width="135" height="205" fill="#d4c9a8"/>
      <rect x="802" y="155" width="135" height="10" fill="#5c4a2e"/>
      <rect x="826" y="90" width="90" height="28" fill="rgba(200,188,152,0.9)" rx="2"/>
      <text x="871" y="105" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2a1f0e">L-206</text>
      <text x="871" y="117" textAnchor="middle" fontSize="10" fill="#3a2e1a">(BG)</text>
      <path d="M 830 267 A 35 35 0 0 0 865 267" fill="rgba(212,201,168,0.4)" stroke="#e8a020" strokeWidth="1.5"/>
      <rect x="835" y="180" width="70" height="22" fill="rgba(200,188,152,0.9)" rx="2"/>
      <text x="870" y="195" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2a1f0e">L-206</text>
      <path d="M 900 267 A 35 35 0 0 0 935 267" fill="rgba(212,201,168,0.4)" stroke="#e8a020" strokeWidth="1.5"/>
      {/* NE Staircase */}
      <rect x="947" y="52" width="10" height="215" fill="#5c4a2e"/>
      <rect x="957" y="52" width="91" height="180" fill="#5c4a2e"/>
      <rect x="967" y="62" width="71" height="155" fill="#b8a882"/>
      <g fill="#a09070" stroke="#8a7a5a" strokeWidth="0.5">
        {[0,1,2,3,4,5,6].map(i=><rect key={i} x={972+i*4} y={68+i*12} width={61-i*8} height="12"/>)}
      </g>
      <line x1="1002" y1="155" x2="1002" y2="72" stroke="white" strokeWidth="1.5" markerEnd="url(#arrG)"/>
      <rect x="957" y="200" width="91" height="22" fill="rgba(90,70,40,0.85)" rx="2"/>
      <text x="1002" y="215" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#f5e6c0">DOWNSTAIRS</text>
      {/* Corridor */}
      <rect x="52" y="267" width="996" height="15" fill="#7a6145"/>
      {/* South rooms */}
      <rect x="52" y="282" width="130" height="146" fill="#5c4a2e"/>
      <rect x="62" y="292" width="110" height="126" fill="#d4c9a8"/>
      <rect x="63" y="354" width="108" height="30" fill="rgba(200,188,152,0.9)" rx="2"/>
      <text x="117" y="367" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2a1f0e">ATTENDENTS' ROOM</text>
      <text x="117" y="380" textAnchor="middle" fontSize="8.5" fill="#4a3a1e">(BACK DOOR)</text>
      <rect x="182" y="282" width="145" height="146" fill="#5c4a2e"/>
      <rect x="192" y="292" width="125" height="126" fill="#d4c9a8"/>
      <rect x="198" y="354" width="113" height="22" fill="rgba(200,188,152,0.9)" rx="2"/>
      <text x="255" y="368" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#2a1f0e">ATTENDENTS' ROOM</text>
      <rect x="327" y="282" width="175" height="146" fill="#5c4a2e"/>
      <rect x="337" y="292" width="155" height="126" fill="#d4c9a8"/>
      <rect x="340" y="350" width="150" height="35" fill="rgba(200,188,152,0.9)" rx="2"/>
      <text x="415" y="363" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#2a1f0e">ATTENDENTS' ROOM</text>
      <text x="415" y="377" textAnchor="middle" fontSize="8.5" fill="#4a3a1e">(BACK DOOR)</text>
      <rect x="502" y="282" width="145" height="146" fill="#5c4a2e"/>
      <rect x="512" y="292" width="125" height="126" fill="#d4c9a8"/>
      <rect x="514" y="354" width="123" height="22" fill="rgba(200,188,152,0.9)" rx="2"/>
      <text x="575" y="368" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#2a1f0e">ATTENDENTS' ROOM</text>
      <rect x="647" y="282" width="125" height="146" fill="#5c4a2e"/>
      <rect x="657" y="292" width="105" height="126" fill="#d4c9a8"/>
      <rect x="660" y="350" width="98" height="28" fill="rgba(200,188,152,0.9)" rx="2"/>
      <text x="709" y="365" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2a1f0e">CR-208</text>
      <text x="709" y="377" textAnchor="middle" fontSize="10" fill="#3a2e1a">(BG)</text>
      <rect x="772" y="282" width="115" height="146" fill="#5c4a2e"/>
      <rect x="782" y="292" width="95" height="126" fill="#d4c9a8"/>
      <rect x="786" y="354" width="87" height="22" fill="rgba(200,188,152,0.9)" rx="2"/>
      <text x="829" y="368" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2a1f0e">CR-208</text>
      <rect x="887" y="282" width="115" height="146" fill="#5c4a2e"/>
      <rect x="897" y="292" width="95" height="126" fill="#d4c9a8"/>
      <rect x="901" y="354" width="87" height="22" fill="rgba(200,188,152,0.9)" rx="2"/>
      <text x="944" y="368" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2a1f0e">CR-207</text>
      <rect x="1002" y="282" width="46" height="146" fill="#5c4a2e"/>
      <rect x="1002" y="292" width="36" height="126" fill="#d4c9a8"/>
      <rect x="1003" y="350" width="43" height="28" fill="rgba(200,188,152,0.9)" rx="2"/>
      <text x="1024" y="363" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#2a1f0e">CR-207</text>
      <text x="1024" y="374" textAnchor="middle" fontSize="7.5" fill="#3a2e1a">(BG)</text>
      {/* Compass */}
      <g transform="translate(1065,430)">
        <circle r="22" fill="rgba(30,30,30,0.7)" stroke="#58a6ff" strokeWidth="1"/>
        <text x="0" y="-10" textAnchor="middle" fontSize="9" fill="#58a6ff" fontWeight="bold">N</text>
        <text x="0" y="16" textAnchor="middle" fontSize="9" fill="#8b949e">S</text>
        <text x="-15" y="4" textAnchor="middle" fontSize="9" fill="#8b949e">W</text>
        <text x="15" y="4" textAnchor="middle" fontSize="9" fill="#8b949e">E</text>
        <line x1="0" y1="0" x2="0" y2="-8" stroke="#58a6ff" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="0" y1="0" x2="0" y2="8" stroke="#555" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

// ─── Second Floor SVG ─────────────────────────────────────────────────────────
function FloorPlan2D_Second() {
  return (
    <svg
      viewBox="0 0 1160 520"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "100%",
        height: "auto",
        display: "block",
        fontFamily: "'Share Tech Mono', monospace"
      }}
    >
      <defs>
        <marker id="arr2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,8 L4,0 L8,8" fill="none" stroke="white" strokeWidth="1.2"/>
        </marker>
      </defs>
      <rect width="1160" height="520" fill="#e8f4f8"/>
      <rect x="28" y="28" width="1104" height="444" fill="#5c4a2e" rx="1"/>
      <rect x="50" y="50" width="1060" height="400" fill="#d4c9a8"/>
      {/* NW Staircase */}
      <rect x="50" y="50" width="105" height="210" fill="#5c4a2e"/>
      <rect x="60" y="60" width="85" height="195" fill="#b8a882"/>
      <g fill="#a09070" stroke="#8a7a5a" strokeWidth=".5">
        {[0,1,2,3,4,5,6,7,8,9].map(i=><rect key={i} x={65+i*3} y={65+i*13} width={75-i*6} height="14"/>)}
      </g>
      <line x1="102" y1="230" x2="102" y2="68" stroke="white" strokeWidth="1.5" markerEnd="url(#arr2)"/>
      <rect x="60" y="230" width="85" height="20" fill="rgba(60,40,10,.85)" rx="2"/>
      <text x="102" y="244" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#f5e6c0">DOWNSTAIRS</text>
      {/* L-202 west */}
      <rect x="155" y="50" width="130" height="130" fill="#5c4a2e"/>
      <rect x="165" y="60" width="110" height="115" fill="#d4c9a8"/>
      <path d="M 200 178 A 45 45 0 0 0 245 178" fill="rgba(212,201,168,.4)" stroke="#e8a020" strokeWidth="1.5" transform="rotate(180,222,178)"/>
      <rect x="194" y="100" width="78" height="22" fill="rgba(200,188,152,.9)" rx="2"/>
      <text x="233" y="115" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2a1f0e">L-202</text>
      {/* Faculty Cabin Block */}
      <rect x="155" y="185" width="405" height="200" fill="#5c4a2e"/>
      <rect x="168" y="198" width="379" height="174" fill="#d4c9a8"/>
      <rect x="275" y="198" width="12" height="174" fill="#5c4a2e"/>
      <rect x="168" y="285" width="107" height="10" fill="#5c4a2e"/>
      <rect x="175" y="322" width="90" height="22" fill="rgba(200,188,152,.9)" rx="2"/>
      <text x="220" y="337" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2a1f0e">DR. NKM</text>
      <path d="M 198 285 A 38 38 0 0 1 236 285" fill="rgba(212,201,168,.4)" stroke="#e8a020" strokeWidth="1.5"/>
      <rect x="380" y="198" width="12" height="174" fill="#5c4a2e"/>
      <rect x="287" y="285" width="93" height="10" fill="#5c4a2e"/>
      <rect x="290" y="322" width="82" height="22" fill="rgba(200,188,152,.9)" rx="2"/>
      <text x="331" y="337" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2a1f0e">DR. YSK</text>
      <path d="M 303 285 A 36 36 0 0 1 339 285" fill="rgba(212,201,168,.4)" stroke="#e8a020" strokeWidth="1.5"/>
      <rect x="547" y="198" width="12" height="174" fill="#5c4a2e"/>
      <rect x="392" y="285" width="155" height="10" fill="#5c4a2e"/>
      <rect x="415" y="322" width="88" height="22" fill="rgba(200,188,152,.9)" rx="2"/>
      <text x="459" y="337" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2a1f0e">DR. HSN</text>
      <path d="M 420 285 A 44 44 0 0 1 464 285" fill="rgba(212,201,168,.4)" stroke="#e8a020" strokeWidth="1.5"/>
      {/* L-202 center */}
      <rect x="560" y="50" width="130" height="130" fill="#5c4a2e"/>
      <rect x="572" y="60" width="106" height="115" fill="#d4c9a8"/>
      <rect x="596" y="100" width="78" height="22" fill="rgba(200,188,152,.9)" rx="2"/>
      <text x="635" y="115" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2a1f0e">L-202</text>
      <path d="M 590 178 A 45 45 0 0 0 635 178" fill="rgba(212,201,168,.4)" stroke="#e8a020" strokeWidth="1.5" transform="rotate(180,612,178)"/>
      {/* Center Staircase */}
      <rect x="690" y="50" width="120" height="210" fill="#5c4a2e"/>
      <rect x="702" y="60" width="96" height="193" fill="#b8a882"/>
      <g fill="#a09070" stroke="#8a7a5a" strokeWidth=".5">
        {[0,1,2,3,4,5,6,7,8,9].map(i=><rect key={i} x={707+i*4} y={65+i*13} width={86-i*8} height="14"/>)}
      </g>
      <line x1="750" y1="228" x2="750" y2="68" stroke="white" strokeWidth="1.5" markerEnd="url(#arr2)"/>
      <rect x="702" y="228" width="96" height="20" fill="rgba(60,40,10,.85)" rx="2"/>
      <text x="750" y="242" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#f5e6c0">DOWNSTAIRS</text>
      {/* L-201 */}
      <rect x="810" y="50" width="130" height="150" fill="#5c4a2e"/>
      <rect x="822" y="60" width="106" height="133" fill="#d4c9a8"/>
      <rect x="843" y="100" width="75" height="22" fill="rgba(200,188,152,.9)" rx="2"/>
      <text x="880" y="115" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2a1f0e">L-201</text>
      <path d="M 840 193 A 45 45 0 0 1 885 193" fill="rgba(212,201,168,.4)" stroke="#e8a020" strokeWidth="1.5" transform="rotate(180,862,193)"/>
      <rect x="835" y="240" width="88" height="28" fill="rgba(200,188,152,.9)" rx="2"/>
      <text x="879" y="253" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#2a1f0e">L-201</text>
      <text x="879" y="265" textAnchor="middle" fontSize="9.5" fill="#3a2e1a">(BG)</text>
      <rect x="940" y="50" width="12" height="350" fill="#5c4a2e"/>
      {/* NE Utility Block */}
      <rect x="952" y="50" width="158" height="400" fill="#5c4a2e"/>
      <rect x="964" y="62" width="134" height="120" fill="#d4c9a8"/>
      <ellipse cx="1010" cy="125" rx="20" ry="24" fill="white" stroke="#888" strokeWidth="1.5"/>
      <ellipse cx="1010" cy="111" rx="11" ry="9" fill="#ddd" stroke="#888" strokeWidth="1"/>
      <rect x="964" y="90" width="130" height="22" fill="rgba(200,188,152,.9)" rx="2"/>
      <text x="1029" y="105" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#2a1f0e">BOYS' WASHROOM</text>
      <rect x="952" y="182" width="158" height="10" fill="#5c4a2e"/>
      <rect x="964" y="192" width="134" height="70" fill="#c8dce8"/>
      <rect x="990" y="200" width="82" height="54" fill="#a8c4d8" rx="4"/>
      <circle cx="1031" cy="218" r="10" fill="#7aafcc" stroke="#5580a0" strokeWidth="1"/>
      <rect x="964" y="210" width="130" height="22" fill="rgba(180,200,220,.9)" rx="2"/>
      <text x="1029" y="225" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#1a3050">WATER COOLER</text>
      <rect x="952" y="262" width="158" height="10" fill="#5c4a2e"/>
      <rect x="964" y="272" width="134" height="120" fill="#d4c9a8"/>
      <ellipse cx="1010" cy="337" rx="20" ry="24" fill="white" stroke="#888" strokeWidth="1.5"/>
      <ellipse cx="1010" cy="323" rx="11" ry="9" fill="#ddd" stroke="#888" strokeWidth="1"/>
      <rect x="964" y="300" width="130" height="22" fill="rgba(200,188,152,.9)" rx="2"/>
      <text x="1029" y="315" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#2a1f0e">GIRLS' WASHROOM</text>
      {/* South rooms */}
      <rect x="50" y="390" width="98" height="60" fill="#5c4a2e"/>
      <rect x="60" y="395" width="78" height="50" fill="#d4c9a8"/>
      <rect x="62" y="415" width="74" height="22" fill="rgba(200,188,152,.9)" rx="2"/>
      <text x="99" y="430" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2a1f0e">DR. NKJ</text>
      <rect x="155" y="390" width="210" height="60" fill="#5c4a2e"/>
      <rect x="165" y="395" width="190" height="50" fill="#d4c9a8"/>
      <rect x="192" y="413" width="110" height="22" fill="rgba(200,188,152,.9)" rx="2"/>
      <text x="247" y="428" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2a1f0e">LIBERAL ARTS</text>
      <rect x="365" y="390" width="195" height="60" fill="#5c4a2e"/>
      <rect x="375" y="395" width="175" height="50" fill="#d4c9a8"/>
      <rect x="385" y="408" width="155" height="26" fill="rgba(200,188,152,.9)" rx="2"/>
      <text x="463" y="420" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#2a1f0e">LIBERAL ARTS</text>
      <text x="463" y="432" textAnchor="middle" fontSize="9.5" fill="#3a2e1a">RESEARCH</text>
      <rect x="560" y="390" width="130" height="60" fill="#5c4a2e"/>
      <rect x="570" y="395" width="110" height="50" fill="#d4c9a8"/>
      <rect x="578" y="413" width="92" height="22" fill="rgba(200,188,152,.9)" rx="2"/>
      <text x="624" y="428" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2a1f0e">LAR (BG)</text>
      <rect x="690" y="390" width="120" height="60" fill="#5c4a2e"/>
      <rect x="700" y="395" width="100" height="50" fill="#d4c9a8"/>
      <rect x="706" y="413" width="88" height="22" fill="rgba(200,188,152,.9)" rx="2"/>
      <text x="750" y="428" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2a1f0e">CR-202</text>
      <rect x="810" y="390" width="110" height="60" fill="#5c4a2e"/>
      <rect x="820" y="395" width="90" height="50" fill="#d4c9a8"/>
      <rect x="824" y="410" width="92" height="28" fill="rgba(200,188,152,.9)" rx="2"/>
      <text x="870" y="422" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2a1f0e">CR-202</text>
      <text x="870" y="434" textAnchor="middle" fontSize="9" fill="#3a2e1a">(BG)</text>
      <rect x="920" y="390" width="90" height="60" fill="#5c4a2e"/>
      <rect x="930" y="395" width="70" height="50" fill="#d4c9a8"/>
      <rect x="933" y="413" width="74" height="22" fill="rgba(200,188,152,.9)" rx="2"/>
      <text x="970" y="428" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2a1f0e">CR-201</text>
      <rect x="1010" y="390" width="100" height="60" fill="#5c4a2e"/>
      <rect x="1020" y="395" width="80" height="50" fill="#d4c9a8"/>
      <rect x="1022" y="410" width="87" height="28" fill="rgba(200,188,152,.9)" rx="2"/>
      <text x="1066" y="422" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2a1f0e">CR-201</text>
      <text x="1066" y="434" textAnchor="middle" fontSize="9" fill="#3a2e1a">(BG)</text>
      {/* Compass */}
      <g transform="translate(1118,468)">
        <circle r="22" fill="rgba(30,30,30,.7)" stroke="#58a6ff" strokeWidth="1"/>
        <text x="0" y="-9" textAnchor="middle" fontSize="9" fill="#58a6ff" fontWeight="bold">N</text>
        <text x="0" y="15" textAnchor="middle" fontSize="9" fill="#8b949e">S</text>
        <text x="-14" y="4" textAnchor="middle" fontSize="9" fill="#8b949e">W</text>
        <text x="14" y="4" textAnchor="middle" fontSize="9" fill="#8b949e">E</text>
        <line x1="0" y1="0" x2="0" y2="-8" stroke="#58a6ff" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="0" y1="0" x2="0" y2="8" stroke="#555" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

// ─── 3D Scene ─────────────────────────────────────────────────────────────────
function ThreeScene({ floor }) {
  const containerRef = useRef(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    const container = containerRef.current;
    const W = container.clientWidth, H = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(floor === "ground" ? 0x1a1f2e : 0x151c28);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(floor === "ground" ? 0x1a1f2e : 0x151c28, 0.015);

    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 500);
    camera.position.set(0, 30, 44);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffeedd, 0.62));
    const sun = new THREE.DirectionalLight(0xfff5e0, 1.15);
    sun.position.set(16, 32, 20); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -62; sun.shadow.camera.right = 62;
    sun.shadow.camera.top = 35; sun.shadow.camera.bottom = -35;
    sun.shadow.camera.far = 130; scene.add(sun);
    const fill = new THREE.DirectionalLight(0xaaccff, 0.3);
    fill.position.set(-12, 22, -18); scene.add(fill);

    const MAT = {
      outer: new THREE.MeshLambertMaterial({ color: 0x5c4a2e }),
      inner: new THREE.MeshLambertMaterial({ color: 0x7a6145 }),
      floor: new THREE.MeshLambertMaterial({ color: 0xd4c9a8 }),
      stair: new THREE.MeshLambertMaterial({ color: 0xa09070 }),
      toilet: new THREE.MeshLambertMaterial({ color: 0xffffff }),
      cooler: new THREE.MeshLambertMaterial({ color: 0x7aafcc }),
    };
    const HW = 3.5;

    function addBox(cx, cz, w, d, h, mat, yo = 0) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(cx, yo + h / 2, cz);
      m.castShadow = true; m.receiveShadow = true; scene.add(m);
    }

    function sv(sx, sz, sw, sd, h, mat, OX, OZ, SW, SH, SC, yo = 0) {
      addBox((sx + sw/2 - OX - SW/2)*SC, (sz + sd/2 - OZ - SH/2)*SC, sw*SC, sd*SC, h, mat, yo);
    }

    function makeLabel(text, x3, z3) {
      const lines = text.split("\n");
      const CW = 512, CH = lines.length > 1 ? 140 : 100;
      const cv = document.createElement("canvas"); cv.width = CW; cv.height = CH;
      const ctx = cv.getContext("2d");
      ctx.fillStyle = "rgba(8,5,1,0.9)";
      const r2 = 14;
      ctx.beginPath(); ctx.moveTo(r2,0); ctx.lineTo(CW-r2,0); ctx.quadraticCurveTo(CW,0,CW,r2);
      ctx.lineTo(CW,CH-r2); ctx.quadraticCurveTo(CW,CH,CW-r2,CH);
      ctx.lineTo(r2,CH); ctx.quadraticCurveTo(0,CH,0,CH-r2);
      ctx.lineTo(0,r2); ctx.quadraticCurveTo(0,0,r2,0); ctx.closePath(); ctx.fill();
      ctx.fillStyle="#f0c040"; ctx.fillRect(r2,0,CW-2*r2,3);
      const fs = lines.length > 1 ? 36 : 44;
      ctx.font=`900 ${fs}px Arial,sans-serif`; ctx.textAlign="center"; ctx.textBaseline="middle";
      const lh=fs+10, sy=CH/2-((lines.length-1)*lh)/2;
      lines.forEach((l,i)=>{ ctx.fillStyle="#f0c040"; ctx.fillText(l,CW/2+1,sy+i*lh+1); ctx.fillStyle="#fff"; ctx.fillText(l,CW/2,sy+i*lh); });
      const tex=new THREE.CanvasTexture(cv); tex.needsUpdate=true;
      const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false,depthWrite:false,sizeAttenuation:true}));
      const asp=CW/CH, sh=2.1; sp.scale.set(sh*asp,sh,1); sp.renderOrder=999;
      sp.position.set(x3,HW+1.8,z3); scene.add(sp);
      const pl=new THREE.Mesh(new THREE.PlaneGeometry(sh*asp*0.65,sh*0.65),new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:0.88,depthWrite:false,side:THREE.DoubleSide}));
      pl.rotation.x=-Math.PI/2; pl.position.set(x3,0.22,z3); pl.renderOrder=998; scene.add(pl);
    }

    function toilet3D(cx,cz) {
      const bm=new THREE.Mesh(new THREE.CylinderGeometry(0.38,0.42,0.2,16),MAT.toilet);
      bm.position.set(cx,0.1,cz); scene.add(bm);
      const tm=new THREE.Mesh(new THREE.BoxGeometry(0.45,0.3,0.16),MAT.toilet);
      tm.position.set(cx,0.25,cz-0.38); scene.add(tm);
    }

    if (floor === "ground") {
      const OX=30,OZ=30,SW=1040,SH=420,SC=0.052;
      const s=(sx,sz,sw,sd,h,mat,yo=0)=>sv(sx,sz,sw,sd,h,mat,OX,OZ,SW,SH,SC,yo);
      const c=(svgX,svgZ)=>[(svgX-OX-SW/2)*SC,(svgZ-OZ-SH/2)*SC];
      const lbl=(txt,svgX,svgZ)=>{const[x,z]=c(svgX,svgZ);makeLabel(txt,x,z);};

      s(30,30,1040,420,0.18,MAT.floor);
      s(30,30,1040,22,HW,MAT.outer); s(30,428,1040,22,HW,MAT.outer);
      s(30,30,22,420,HW,MAT.outer); s(1048,30,22,420,HW,MAT.outer);
      s(52,267,243,12,HW,MAT.outer); s(295,52,12,215,HW,MAT.outer);
      s(62,162,243,10,HW*.85,MAT.inner); s(242,52,8,215,HW*.85,MAT.inner);
      toilet3D(...c(268,120)); toilet3D(...c(268,222));
      s(305,52,10,220,HW,MAT.inner); s(480,52,10,220,HW,MAT.inner);
      s(315,157,165,10,HW*.85,MAT.inner); s(315,267,165,10,HW,MAT.inner);
      s(490,52,10,215,HW,MAT.inner); s(635,52,10,215,HW,MAT.inner);
      s(490,267,145,10,HW,MAT.inner);
      s(645,52,10,215,HW,MAT.inner); s(780,52,12,215,HW,MAT.inner);
      s(645,232,135,10,HW,MAT.inner);
      for(let i=0;i<10;i++) s(655+i*5,62+i*14,115-i*10,14,0.15+i*.15,MAT.stair);
      s(792,52,10,220,HW,MAT.inner); s(947,52,10,220,HW,MAT.inner);
      s(802,152,135,10,HW*.85,MAT.inner); s(802,267,135,10,HW,MAT.inner);
      s(957,52,10,180,HW,MAT.inner); s(957,232,91,10,HW,MAT.inner);
      for(let i=0;i<7;i++) s(967+i*4,62+i*12,71-i*8,12,0.15+i*.18,MAT.stair);
      [[52,282,10,146],[182,282,10,146],[327,282,10,146],[502,282,10,146],
       [647,282,10,146],[772,282,10,146],[887,282,10,146],[1002,282,10,146],
       [52,428,130,10],[182,428,145,10],[327,428,175,10],[502,428,145,10],
       [647,428,125,10],[772,428,115,10],[887,428,115,10],[1002,428,46,10]
      ].forEach(([x,z,w,d])=>s(x,z,w,d,HW,MAT.inner));

      lbl("BOYS'\nWASHROOM",148,110); lbl("GIRLS'\nWASHROOM",148,220);
      lbl("L-207\n(BG)",390,215); lbl("L-207",570,115);
      lbl("DOWNSTAIRS",712,155); lbl("DOWNSTAIRS",1002,155);
      lbl("L-206\n(BG)",871,110); lbl("L-206",871,195);
      lbl("ATTENDENTS'\nROOM",117,360); lbl("ATTENDENTS'\nROOM",255,360);
      lbl("ATTENDENTS'\nROOM",415,360); lbl("ATTENDENTS'\nROOM",575,360);
      lbl("CR-208\n(BG)",709,360); lbl("CR-208",829,360);
      lbl("CR-207",944,360); lbl("CR-207\n(BG)",1030,360);
    } else {
      const OX=50,OZ=50,SW=1060,SH=400,SC=0.05;
      const s=(sx,sz,sw,sd,h,mat,yo=0)=>sv(sx,sz,sw,sd,h,mat,OX,OZ,SW,SH,SC,yo);
      const c=(svgX,svgZ)=>[(svgX-OX-SW/2)*SC,(svgZ-OZ-SH/2)*SC];
      const lbl=(txt,svgX,svgZ)=>{const[x,z]=c(svgX,svgZ);makeLabel(txt,x,z);};

      s(50,50,1060,400,0.18,MAT.floor);
      s(28,28,1104,22,HW,MAT.outer); s(28,450,1104,22,HW,MAT.outer);
      s(28,28,22,444,HW,MAT.outer); s(1110,28,22,444,HW,MAT.outer);
      s(50,50,12,210,HW,MAT.outer); s(155,50,12,210,HW,MAT.inner);
      s(50,260,105,12,HW,MAT.inner);
      for(let i=0;i<10;i++) s(60+i*4,60+i*13,85-i*8,13,0.12+i*.16,MAT.stair);
      s(155,50,130,12,HW,MAT.outer); s(285,50,12,130,HW,MAT.inner);
      s(155,178,130,12,HW,MAT.inner);
      s(155,185,405,12,HW,MAT.inner); s(155,185,12,200,HW,MAT.inner);
      s(559,185,12,200,HW,MAT.inner); s(155,385,405,12,HW,MAT.inner);
      s(275,185,12,200,HW*.8,MAT.inner); s(390,185,12,200,HW*.8,MAT.inner);
      s(155,285,405,12,HW*.7,MAT.inner);
      s(560,50,130,12,HW,MAT.outer); s(560,50,12,130,HW,MAT.inner);
      s(690,50,12,130,HW,MAT.inner); s(560,178,130,12,HW,MAT.inner);
      s(690,50,12,210,HW,MAT.inner); s(810,50,12,210,HW,MAT.inner);
      s(690,260,120,12,HW,MAT.inner);
      for(let i=0;i<10;i++) s(702+i*4,60+i*13,96-i*8,13,0.12+i*.16,MAT.stair);
      s(810,50,130,12,HW,MAT.outer); s(810,50,12,150,HW,MAT.inner);
      s(940,50,12,350,HW,MAT.inner); s(810,200,130,12,HW,MAT.inner);
      s(952,50,158,12,HW,MAT.outer); s(952,50,12,400,HW,MAT.inner);
      s(952,182,158,10,HW*.8,MAT.inner); s(952,262,158,10,HW*.8,MAT.inner);
      toilet3D(...c(1010,125)); toilet3D(...c(1010,337));
      const wc=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.9,0.55),MAT.cooler);
      const[wcx,wcz]=c(1031,225); wc.position.set(wcx,0.45,wcz); scene.add(wc);
      [[50,390,12,60],[155,390,12,60],[365,390,12,60],[560,390,12,60],
       [690,390,12,60],[810,390,12,60],[920,390,12,60],[1010,390,12,60],
       [50,450,1060,12]
      ].forEach(([x,z,w,d])=>s(x,z,w,d,HW,MAT.inner));

      lbl("DOWNSTAIRS",102,195); lbl("L-202",220,112);
      lbl("DR. NKM",215,315); lbl("DR. YSK",330,315); lbl("DR. HSN",465,315);
      lbl("L-202",625,112); lbl("DOWNSTAIRS",750,195);
      lbl("L-201",875,112); lbl("L-201\n(BG)",875,270);
      lbl("BOYS'\nWASHROOM",1029,112); lbl("WATER\nCOOLER",1029,225);
      lbl("GIRLS'\nWASHROOM",1029,335);
      lbl("DR. NKJ",99,420); lbl("LIBERAL\nARTS",260,420);
      lbl("LIBERAL ARTS\nRESEARCH",460,420); lbl("LAR (BG)",625,420);
      lbl("CR-202",750,420); lbl("CR-202\n(BG)",865,420);
      lbl("CR-201",965,420); lbl("CR-201\n(BG)",1060,420);
    }

    let drag=false,isPan=false,prevX=0,prevY=0,theta=0.38,phi=0.82,radius=48,panX=0,panZ=0;
    function updateCam() {
      camera.position.set(panX+radius*Math.sin(phi)*Math.sin(theta),radius*Math.cos(phi),panZ+radius*Math.sin(phi)*Math.cos(theta));
      camera.lookAt(panX,0,panZ);
    }
    updateCam();
    const el=renderer.domElement;
    el.addEventListener("mousedown",e=>{drag=true;isPan=e.button===2;prevX=e.clientX;prevY=e.clientY;});
    window.addEventListener("mouseup",()=>drag=false);
    window.addEventListener("mousemove",e=>{
      if(!drag)return;
      const dx=e.clientX-prevX,dy=e.clientY-prevY;
      if(isPan){panX-=dx*.04;panZ-=dy*.04;}
      else{theta-=dx*.007;phi=Math.max(.12,Math.min(Math.PI/2-.04,phi-dy*.007));}
      prevX=e.clientX;prevY=e.clientY;updateCam();
    });
    el.addEventListener("wheel",e=>{radius=Math.max(8,Math.min(95,radius+e.deltaY*.05));updateCam();});
    el.addEventListener("contextmenu",e=>e.preventDefault());
    let touches=[];
    el.addEventListener("touchstart",e=>{touches=[...e.touches];},{passive:true});
    el.addEventListener("touchmove",e=>{
      if(e.touches.length===1&&touches.length===1){
        theta-=(e.touches[0].clientX-touches[0].clientX)*.007;
        phi=Math.max(.12,Math.min(Math.PI/2-.04,phi-(e.touches[0].clientY-touches[0].clientY)*.007));
        updateCam();
      }else if(e.touches.length===2&&touches.length===2){
        const d0=Math.hypot(touches[0].clientX-touches[1].clientX,touches[0].clientY-touches[1].clientY);
        const d1=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
        radius=Math.max(8,Math.min(95,radius-(d1-d0)*.08));updateCam();
      }
      touches=[...e.touches];
    },{passive:true});
    const animate=()=>{requestAnimationFrame(animate);renderer.render(scene,camera);};
    animate();
    const onResize=()=>{const W2=container.clientWidth,H2=container.clientHeight;camera.aspect=W2/H2;camera.updateProjectionMatrix();renderer.setSize(W2,H2);};
    window.addEventListener("resize",onResize);
    return ()=>{window.removeEventListener("resize",onResize);renderer.dispose();};
  }, [floor]);

  return (
    <div ref={containerRef} style={{ width:"100%", height:600, borderRadius:10, overflow:"hidden", border:`1px solid ${COLORS.border}`, background:COLORS.bg }} />
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function LHTCFloorPlan() {
  const [activeFloor, setActiveFloor] = useState("ground");
  const [activeView, setActiveView] = useState("2d");
  const [show3d, setShow3d] = useState({ ground: false, second: false });

  const handleViewSwitch = v => {
    setActiveView(v);
    if (v === "3d") setShow3d(s => ({ ...s, [activeFloor]: true }));
  };
  const handleFloorSwitch = f => { setActiveFloor(f); setActiveView("2d"); };

  const groundLegend = [
    {color:"#5c4a2e",label:"Outer Wall"},{color:"#7a6145",label:"Inner Partition"},
    {color:"#d4c9a8",label:"Floor / Room"},{color:"#b8a882",label:"Staircase"},{color:"#e8a020",label:"Door Arc"},
  ];
  const secondLegend = [
    {color:"#5c4a2e",label:"Outer Wall"},{color:"#7a6145",label:"Inner Partition"},
    {color:"#d4c9a8",label:"Floor / Room"},{color:"#b8a882",label:"Staircase"},
    {color:"#c8dce8",label:"Water Cooler"},{color:"#e8a020",label:"Door Arc"},
  ];
  const legend = activeFloor === "ground" ? groundLegend : secondLegend;

  const tabBtn = (id, label, isActive, onClick) => (
    <button key={id} onClick={onClick} style={{
      padding:"11px 26px", border:"none", borderBottom:`2px solid ${isActive ? COLORS.accent : "transparent"}`,
      background:"none", cursor:"pointer", color: isActive ? COLORS.accent : COLORS.dim,
      fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"0.77rem", letterSpacing:"0.1em",
      textTransform:"uppercase", transition:"color 0.2s,border-color 0.2s",
    }}>{label}</button>
  );

  const floorBtn = (id, label, sub, isActive, onClick) => (
    <button key={id} onClick={onClick} style={{
      padding:"11px 22px", border:"none", borderBottom:`3px solid ${isActive ? COLORS.accent3 : "transparent"}`,
      background:"none", cursor:"pointer", color: isActive ? COLORS.accent3 : COLORS.dim,
      fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"0.77rem", letterSpacing:"0.06em",
      textTransform:"uppercase", transition:"all 0.2s", display:"flex", flexDirection:"column", alignItems:"center", gap:2,
    }}>
      {label}
      <span style={{fontSize:"0.6rem", opacity:0.7}}>{sub}</span>
    </button>
  );

  return (
    <div style={{ minHeight:"100vh", background:COLORS.bg, color:COLORS.text, fontFamily:"'Syne',sans-serif", display:"flex", flexDirection:"column" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Syne:wght@400;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:${COLORS.panel}}::-webkit-scrollbar-thumb{background:${COLORS.border};border-radius:3px}`}</style>

      {/* Header */}
      <div style={{background:COLORS.panel,borderBottom:`1px solid ${COLORS.border}`,padding:"0 28px",display:"flex",alignItems:"center",justifyContent:"space-between",height:42,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:34,height:34,background:`linear-gradient(135deg,${COLORS.accent},${COLORS.accent2})`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:900,color:"#fff",letterSpacing:"0.05em"}}>LH</div>
          <div>
            <div style={{fontSize:"0.98rem",fontWeight:800,letterSpacing:"0.08em",color:COLORS.accent,textTransform:"uppercase"}}>LHTC Architectural Plan</div>
            <div style={{fontSize:"0.66rem",color:COLORS.dim,fontFamily:"'Share Tech Mono',monospace"}}>Ground Floor (Right Wing) &amp; Second Floor (Left Wing)</div>
          </div>
        </div>
        <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.68rem",color:COLORS.dim,background:COLORS.border,padding:"4px 10px",borderRadius:4}}>MERGED · v2.0</div>
      </div>

      {/* Floor tabs */}
      <div style={{background:COLORS.panel,borderBottom:`1px solid ${COLORS.border}`,display:"flex",alignItems:"center",padding:"0 28px",gap:0}}>
        <span style={{fontSize:"0.64rem",color:COLORS.dim,fontFamily:"'Share Tech Mono',monospace",marginRight:14,letterSpacing:"0.1em",flexShrink:0}}>FLOOR ▸</span>
        {floorBtn("ground","First Floor","Right Wing",activeFloor==="ground",()=>handleFloorSwitch("ground"))}
        {floorBtn("second","First Floor","Left Wing",activeFloor==="second",()=>handleFloorSwitch("second"))}
      </div>

      {/* View tabs */}
      <div style={{background:COLORS.panel,borderBottom:`1px solid ${COLORS.border}`,display:"flex",padding:"0 28px",gap:0}}>
        {tabBtn("2d","⊞  2D Floor Plan",activeView==="2d",()=>handleViewSwitch("2d"))}
        {tabBtn("3d","⬡  3D Interior View",activeView==="3d",()=>handleViewSwitch("3d"))}
      </div>

      {/* Content */}
      <div style={{ padding:"12px 20px", flex:1 }}>
        {activeView==="2d" && (
          <div>
            <div style={{
  background:"#e8f4f8",
  borderRadius:10,
  padding:"8px",
  boxShadow:`0 0 0 2px ${COLORS.border},0 8px 40px rgba(0,0,0,0.5)`,
  width:"100%",
  height:"70vh",        // 🔥 important
  overflow:"auto",      // 🔥 enable scroll
}}>

              {activeFloor==="ground" ? <FloorPlan2D_Ground/> : <FloorPlan2D_Second/>}
            </div>
            <div style={{display:"flex",gap:18,flexWrap:"wrap",marginTop:16,fontFamily:"'Share Tech Mono',monospace",fontSize:"0.68rem",color:COLORS.dim}}>
              {legend.map(l=>(
                <div key={l.label} style={{display:"flex",alignItems:"center",gap:7}}>
                  <div style={{width:12,height:12,borderRadius:2,background:l.color,border:"1px solid rgba(255,255,255,0.15)"}}/>
                  {l.label}
                </div>
              ))}
            </div>
          </div>
        )}
        {activeView==="3d" && (
          <div>
            {activeFloor==="ground" && show3d.ground && <ThreeScene key="ground-3d" floor="ground"/>}
            {activeFloor==="second" && show3d.second && <ThreeScene key="second-3d" floor="second"/>}
            <p style={{marginTop:10,fontFamily:"'Share Tech Mono',monospace",fontSize:"0.7rem",color:COLORS.dim,textAlign:"center"}}>
              🖱 Left-drag: Rotate &nbsp;·&nbsp; Right-drag: Pan &nbsp;·&nbsp; Scroll: Zoom &nbsp;·&nbsp; Pinch: Zoom (touch)
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{background:COLORS.panel,borderTop:`1px solid ${COLORS.border}`,padding:"9px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.65rem",color:COLORS.dim}}>
          {activeFloor==="ground"?"Ground Floor · Right Wing":"Second Floor · Left Wing"} &nbsp;·&nbsp;
          <span style={{color:COLORS.accent2}}>{activeView==="2d"?"2D Plan":"3D View"}</span>
        </span>
        <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.65rem",color:COLORS.dim}}>LHTC · Architectural Visualization</span>
      </div>
    </div>
  );
}