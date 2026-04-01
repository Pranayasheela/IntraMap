import "./App.css";
import { useState, useEffect, useRef } from "react";
import FloorPlanRouter from "./FloorPlanRouter";
import LHTCFloorPlanRouter from "./LHTCFloorPlanRouter";

// ─── Building data ────────────────────────────────────────────────────────────

const BUILDINGS = [
  {
    id: "cc",
    name: "Computer Center and Library",
    short: "CC",
    floors: [
      {
        number: 3, label: "3rd Floor", short: "3",
        rooms: [
          { name: "Dr.DS" }, { name: "Dr.MKB" }, { name: "Dr.SKM" },
          { name: "Computing Lab" }, { name: "MTech Study Room" }, { name: "Store Room" },
          { name: "PG LAB1" }, { name: "Research LAB1" },
          { name: "Room Head CSE" }, { name: "Office Asst of CC" },
        ],
      },
      {
        number: 2, label: "2nd Floor", short: "2",
        rooms: [
          { name: "Dr.AP" }, { name: "Dr.NA" }, { name: "Dr.SHM" }, { name: "Prof.PK" },
          { name: "IOT / Embedded System Engineering Lab" }, { name: "Tinkering Lab" },
          { name: "Dr.MS" }, { name: "Dr.ND" }, { name: "Dr.RKR" }, { name: "Dr.AS" },
          { name: "Research LAB2" }, { name: "Seminar Hall" }, { name: "CC Staff" },
        ],
      },
      {
        number: 1, label: "1st Floor", short: "1",
        rooms: [
          { name: "Computer Lab2" }, { name: "Image and Visual Processing Lab" },
          { name: "Prof.PK" }, { name: "Dr.AOJHA" },
        ],
      },
      {
        number: 0, label: "Ground Floor", short: "G",
        rooms: [
          { name: "Staff Room of CC" }, { name: "Library" }, { name: "Study Room" },
          { name: "Computer Lab1" }, { name: "System Administration Room" }, { name: "Servers Room" },
        ],
      },
    ],
  },
  {
    id: "lhtc",
    name: "LHTC Building",
    short: "LHTC",
    floors: [
      {
        number: 1, label: "1st Floor", short: "1",
        rooms: [
          { name: "DR.NKJ Cabin" }, { name: "L202" }, { name: "DR.NKM" },
          { name: "DR.YSK" }, { name: "DR.HSN" }, { name: "Liberal Arts" },
          { name: "CR202" }, { name: "L201" }, { name: "CR201" },
          { name: "Attendents Room" }, { name: "L207" }, { name: "CR208" }, { name: "CR207" },
        ],
      },
      {
        number: 0, label: "Ground Floor", short: "G",
        rooms: [
          { name: "CR110" }, { name: "CR109" }, { name: "CR108" },
          { name: "L107" }, { name: "L106" }, { name: "Maths Lab" },
          { name: "LKB Cabin" }, { name: "AKK Cabin" }, { name: "L105" },
          { name: "L104" }, { name: "Green Room" }, { name: "Lamba Cabin" },
          { name: "L103" }, { name: "Design Studio" }, { name: "CR104" },
          { name: "CR103" }, { name: "CR102" }, { name: "CR101" }, { name: "L102" },
        ],
      },
    ],
  },
];

// Flat list of ALL rooms across ALL buildings for search
const ALL_ROOMS = BUILDINGS.flatMap((b) =>
  b.floors.flatMap((f) =>
    f.rooms.map((r) => ({
      ...r,
      floor: f.number,
      floorLabel: f.label,
      building: b.name,
      buildingId: b.id,
      buildingShort: b.short,
    }))
  )
);

// ─── CC building floor hover zones (image-based) ─────────────────────────────

const CC_FLOOR_WINDOWS = {
  3: [
    { top: "30%", left: "24%", w: "5.5%", h: "8%" },
    { top: "30%", left: "32%", w: "5.5%", h: "8%" },
    { top: "31%", left: "60%", w: "5.5%", h: "8%" },
    { top: "31%", left: "68%", w: "5.5%", h: "8%" },
  ],
  2: [
    { top: "38%", left: "24%", w: "5.5%", h: "8%" },
    { top: "38%", left: "32%", w: "5.5%", h: "8%" },
    { top: "38%", left: "60%", w: "5.5%", h: "8%" },
    { top: "38%", left: "68%", w: "5.5%", h: "8%" },
  ],
  1: [
    { top: "44%", left: "24%", w: "5.5%", h: "8%" },
    { top: "44%", left: "32%", w: "5.5%", h: "8%" },
    { top: "44%", left: "60%", w: "5.5%", h: "8%" },
    { top: "44%", left: "68%", w: "5.5%", h: "8%" },
  ],
  0: [
    { top: "51%", left: "24%", w: "5.5%", h: "8%" },
    { top: "51%", left: "32%", w: "5.5%", h: "8%" },
    { top: "51%", left: "60%", w: "5.5%", h: "8%" },
    { top: "51%", left: "68%", w: "5.5%", h: "8%" },
  ],
};

const CC_FLOOR_HOVER_ZONES = {
  3: { top: "28%", h: "10%" },
  2: { top: "38%", h: "8%"  },
  1: { top: "44%", h: "8%"  },
  0: { top: "51%", h: "12%" },
};

// ─── Main LandingPage component ───────────────────────────────────────────────

export default function LandingPage() {
  const [displayText, setDisplayText]     = useState("");
  const [query, setQuery]                 = useState("");
  const [suggestions, setSuggestions]     = useState([]);
  const [showDrop, setShowDrop]           = useState(false);
  const [selectedRoom, setSelectedRoom]   = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [animFloor, setAnimFloor]         = useState(false);
  // litFloor drives LHTC SVG window highlighting (hover OR click)
  const [litFloor, setLitFloor]           = useState(null);
  const detailRef    = useRef(null);
  const floorViewRef = useRef(null);
  const fullText     = "Welcome to IntraMap";

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(t);
    }, 100);
    return () => clearInterval(t);
  }, []);

  // Search suggestions (across both buildings)
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setSuggestions([]); return; }
    setSuggestions(
      ALL_ROOMS.filter((r) => r.name.toLowerCase().includes(q)).slice(0, 8)
    );
  }, [query]);

  const handleSelectRoom = (room) => {
    setQuery(room.name);
    setSelectedRoom(room);
    setSuggestions([]);
    setShowDrop(false);
    const building = BUILDINGS.find((b) => b.id === room.buildingId);
    const fd = building?.floors.find((f) => f.number === room.floor);
    setSelectedFloor(fd ? { ...fd, buildingId: room.buildingId } : null);
    setLitFloor(room.floor);
    setAnimFloor(true);
    setTimeout(
      () => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      100
    );
  };

  const handleSearch = () => {
    const match =
      suggestions[0] ||
      ALL_ROOMS.find((r) => r.name.toLowerCase() === query.toLowerCase());
    if (match) handleSelectRoom(match);
  };

  const handleFloorClick = (floor, buildingId) => {
    setSelectedFloor({ ...floor, buildingId });
    setLitFloor(floor.number);
    setAnimFloor(false);
    setTimeout(() => setAnimFloor(true), 50);
    setTimeout(
      () => floorViewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      200
    );
  };

  const activeBuildingId = selectedRoom?.buildingId || selectedFloor?.buildingId;

  return (
    <div className="app">
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
        @keyframes winPulse { 0%,100%{opacity:0.80} 50%{opacity:1} }
        @keyframes svgPulse { 0%,100%{opacity:0.85} 50%{opacity:1} }
        .sugg-item:hover      { background:#f0f4f8 !important; }
        .room-chip-item       { transition:transform 0.18s; cursor:default; }
        .room-chip-item:hover { transform:translateY(-2px); }
        .lhtc-win { transition: fill 0.25s; }
        .svglit   { animation: svgPulse 1.4s ease-in-out infinite;
                    filter: drop-shadow(0 0 6px #ff6820); }
        .fzone    { cursor: pointer; }
      `}</style>

      {/* ── NAVBAR ── */}
      <div className="navbar">
        <div className="logoSection">
          <img src="/logo.png" alt="logo" className="logoImg" />
          <h2 className="siteName">IntraMap</h2>
        </div>
        <div className="navLinks">
          <a href="#about">About</a>
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="hero" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/image.png)` }}>
        <div className="heroOverlay" />
        <div className="heroContent">
          <h1 className="welcomeText">👋 {displayText}</h1>
          <p className="heroSub">Explore the CC &amp; LHTC Campus effortlessly</p>

          <div style={{ position: "relative", width: 450, maxWidth: "90%" }}>
            <div
              className="searchBox"
              style={{
                borderRadius: showDrop && suggestions.length > 0 ? "25px 25px 0 0" : "50px",
                transition: "border-radius 0.2s",
              }}
            >
              <input
                type="text"
                placeholder="🔍 Search room name..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowDrop(true); }}
                onFocus={() => setShowDrop(true)}
                onBlur={() => setTimeout(() => setShowDrop(false), 160)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{
                  flex: 1, border: "none", outline: "none",
                  padding: "15px 20px", fontSize: 16,
                  borderRadius: "50px 0 0 50px", color: "#333",
                }}
              />
              <button onClick={handleSearch}>Search</button>
            </div>

            {showDrop && suggestions.length > 0 && (
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0, zIndex: 999,
                background: "#fff", borderRadius: "0 0 20px 20px",
                boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
                overflow: "hidden", maxHeight: 320, overflowY: "auto",
              }}>
                {suggestions.map((room, i) => (
                  <div
                    key={`${room.buildingId}-${room.name}-${i}`}
                    className="sugg-item"
                    onMouseDown={() => handleSelectRoom(room)}
                    style={{
                      padding: "14px 32px",
                      borderBottom: i < suggestions.length - 1 ? "1px solid #f0f0f0" : "none",
                      cursor: "pointer", background: "#fff",
                    }}
                  >
                    <div style={{ fontSize: 17, fontWeight: 500, color: "#4a5568", fontFamily: "'Segoe UI',sans-serif" }}>
                      {room.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                      {room.floorLabel} · <span style={{ color: "#ff8c5a", fontWeight: 600 }}>{room.buildingShort}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="floatingShape shape1" />
        <div className="floatingShape shape2" />
        <div className="floatingShape shape3" />
      </div>

      {/* ── DETAIL SECTION ── */}
      {selectedRoom && (
        <div
          ref={detailRef}
          style={{
            background: "linear-gradient(180deg,#0d1b2a 0%,#111827 100%)",
            padding: "70px 48px 60px",
            animation: "fadeUp 0.6s ease",
          }}
        >
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>

            {/* Room detail card */}
            <div style={{
              textAlign: "center", padding: "40px 56px", borderRadius: 24,
              background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,90,30,0.3)",
              boxShadow: "0 0 60px rgba(255,90,30,0.1)", maxWidth: 560,
              margin: "0 auto 56px", animation: "fadeUp 0.5s ease",
            }}>
              {[
                ["Room Name", selectedRoom.name],
                ["Floor",     selectedRoom.floorLabel],
                ["Building",  selectedRoom.building],
              ].map(([label, val]) => (
                <div key={label} style={{
                  display: "flex", alignItems: "baseline",
                  justifyContent: "center", gap: 10, marginBottom: 20,
                }}>
                  <span style={{ fontSize: 22, fontWeight: 600, color: "#ff8c5a", minWidth: 140, textAlign: "right", fontFamily: "'Segoe UI',sans-serif" }}>
                    {label}:
                  </span>
                  <span style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Segoe UI',sans-serif" }}>
                    {val}
                  </span>
                </div>
              ))}
            </div>

            {/* Building viewer — CC (image) or LHTC (SVG) */}
            {activeBuildingId === "cc" ? (
              <CCBuildingViewer
                selectedFloor={selectedFloor}
                onFloorClick={(floor) => handleFloorClick(floor, "cc")}
              />
            ) : (
              <LHTCBuildingViewer
                selectedFloor={selectedFloor}
                litFloor={litFloor}
                setLitFloor={setLitFloor}
                onFloorClick={(floor) => handleFloorClick(floor, "lhtc")}
              />
            )}

            {/* Floor plan viewer */}
            {selectedFloor && (
              <div
                ref={floorViewRef}
                style={{
                  marginTop: 28, borderRadius: 20, overflow: "hidden",
                  border: "1.5px solid rgba(255,90,30,0.28)",
                  animation: animFloor ? "fadeUp 0.5s ease" : "none",
                  opacity: animFloor ? 1 : 0, transition: "opacity 0.4s",
                }}
              >
                <div style={{
                  padding: "16px 28px",
                  background: "linear-gradient(135deg,rgba(255,90,30,0.15),rgba(255,90,30,0.05))",
                  borderBottom: "1px solid rgba(255,90,30,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div>
                    <div style={{ fontSize: 9, color: "#ff5a1e", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 3, fontFamily: "'Segoe UI',sans-serif" }}>
                      Floor Plan — 2D View
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 18, color: "#f1f5f9", fontFamily: "'Segoe UI',sans-serif" }}>
                      {selectedFloor.label} · {activeBuildingId === "cc" ? "Computer Center and Library" : "Lecture Hall & Training Centre"}
                    </div>
                  </div>
                  <div style={{ padding: "5px 14px", borderRadius: 7, background: "rgba(255,90,30,0.18)", border: "1px solid rgba(255,90,30,0.38)", fontSize: 12, color: "#ff8c5a", fontWeight: 600, fontFamily: "'Segoe UI',sans-serif" }}>
                    Floor {selectedFloor.short}
                  </div>
                </div>

                <div style={{ height: 500 }}>
                  {activeBuildingId === "cc" ? (
                    <FloorPlanRouter
                      floorNumber={selectedFloor.number}
                      floorLabel={`${selectedFloor.label} · Computer Center and Library`}
                    />
                  ) : (
                    <LHTCFloorPlanRouter
                      floorNumber={selectedFloor.number}
                      floorLabel={`${selectedFloor.label} · Lecture Hall & Training Centre`}
                    />
                  )}
                </div>

                <div style={{ padding: "10px 28px 12px", background: "rgba(255,90,30,0.04)", borderTop: "1px solid rgba(255,90,30,0.1)", fontSize: 10, color: "rgba(255,255,255,0.18)", letterSpacing: "1.5px", fontFamily: "'Segoe UI',sans-serif", textAlign: "center" }}>
                  {selectedFloor.label.toUpperCase()} · {activeBuildingId === "cc" ? "COMPUTER CENTER AND LIBRARY" : "LECTURE HALL & TRAINING CENTRE"} · IIITDMJ CAMPUS
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ABOUT ── */}
      <div className="about" id="about">
        <h2>About IntraMap</h2>
        <p className="aboutIntro">
          IntraMap helps students, faculty and visitors easily navigate the CC and LHTC buildings
          at IIITDMJ Campus by searching and locating rooms quickly.
        </p>
        <div className="features">
          <div className="featureCard"><h3>🗺 Smart Navigation</h3><p>Instantly locate any room.</p></div>
          <div className="featureCard"><h3>🏢 Two Buildings</h3><p>CC and LHTC covered.</p></div>
          <div className="featureCard"><h3>⚡ Fast Search</h3><p>Find rooms in seconds.</p></div>
          <div className="featureCard"><h3>🎓 Student Friendly</h3><p>Helpful for new students.</p></div>
          <div className="featureCard"><h3>📱 Clean Interface</h3><p>Simple modern design.</p></div>
          <div className="featureCard"><h3>🚀 Future Ready</h3><p>Interactive maps coming soon.</p></div>
        </div>
      </div>

      <div className="footer"><p>© 2026 IntraMap | CC &amp; LHTC · IIITDMJ Campus</p></div>
    </div>
  );
}

// ─── CC Building viewer (image + hover zones) ────────────────────────────────

function CCBuildingViewer({ selectedFloor, onFloorClick }) {
  const [hoveredFloor, setHoveredFloor] = useState(null);
  const ccBuilding = BUILDINGS.find((b) => b.id === "cc");

  return (
    <div style={{
      display: "flex", borderRadius: 20, overflow: "hidden",
      boxShadow: "0 8px 48px rgba(0,0,0,0.55)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}>
      <div
        style={{ flex: 1, position: "relative", height: 500, background: "#111", overflow: "hidden" }}
        onMouseLeave={() => setHoveredFloor(null)}
      >
        <img
          src={`${process.env.PUBLIC_URL}/building.png`}
          alt="CC Building"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none", userSelect: "none" }}
          onError={(e) => { e.target.style.display = "none"; }}
        />

        {/* Invisible hover zones per floor */}
        {ccBuilding.floors.map((floor) => {
          const z = CC_FLOOR_HOVER_ZONES[floor.number];
          return (
            <div
              key={floor.number}
              onMouseEnter={() => setHoveredFloor(floor)}
              onClick={() => onFloorClick(floor)}
              style={{ position: "absolute", top: z.top, left: 0, right: 0, height: z.h, zIndex: 3, cursor: "pointer" }}
            />
          );
        })}

        {/* Glowing window overlays */}
        {hoveredFloor && CC_FLOOR_WINDOWS[hoveredFloor.number]?.map((win, wi) => (
          <div
            key={wi}
            style={{
              position: "absolute", top: win.top, left: win.left,
              width: win.w, height: win.h,
              background: "#ff5a1e", borderRadius: 3,
              boxShadow: "0 0 14px rgba(255,90,30,0.95), 0 0 5px rgba(255,140,60,0.8)",
              animation: "winPulse 1.6s ease infinite",
              animationDelay: `${wi * 0.12}s`,
              pointerEvents: "none", zIndex: 4, opacity: 0.9,
            }}
          />
        ))}

        {hoveredFloor && (
          <div style={{
            position: "absolute", bottom: 48, left: "50%", transform: "translateX(-50%)",
            padding: "6px 20px", borderRadius: 8, background: "#ff5a1e", color: "#fff",
            fontWeight: 700, fontSize: 13, boxShadow: "0 4px 18px rgba(255,90,30,0.6)",
            fontFamily: "'Segoe UI',sans-serif", pointerEvents: "none", zIndex: 5, whiteSpace: "nowrap",
          }}>
            {hoveredFloor.label} · click to explore
          </div>
        )}

        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "32px 20px 10px",
          background: "linear-gradient(to top,rgba(0,0,0,0.7),transparent)",
          fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "1.5px",
          fontFamily: "'Segoe UI',sans-serif", pointerEvents: "none", zIndex: 2,
        }}>
          CC BUILDING — IIITDMJ CAMPUS
        </div>
      </div>

      <RoomPanel hoveredFloor={hoveredFloor} selectedFloor={selectedFloor} icon="🏢" />
    </div>
  );
}

// ─── LHTC Building viewer ─────────────────────────────────────────────────────
// Manages hover state locally so the SVG can light up on hover AND the right
// panel can preview that floor's rooms — exactly like the original LHTCLandingPage.

function LHTCBuildingViewer({ selectedFloor, litFloor, setLitFloor, onFloorClick }) {
  const [hoveredFloorNum, setHoveredFloorNum] = useState(null);
  const lhtcBuilding = BUILDINGS.find((b) => b.id === "lhtc");

  const handleHoverEnter = (floorNum) => {
    setHoveredFloorNum(floorNum);
    setLitFloor(floorNum);           // light up SVG windows immediately on hover
  };

  const handleHoverLeave = () => {
    setHoveredFloorNum(null);
    // Revert SVG windows to the last clicked floor (or null if nothing selected)
    setLitFloor(selectedFloor?.number ?? null);
  };

  const handleFloorClick = (floorNum) => {
    const fd = lhtcBuilding.floors.find((f) => f.number === floorNum);
    if (fd) onFloorClick(fd);
  };

  const hoveredFloor = hoveredFloorNum !== null
    ? lhtcBuilding.floors.find((f) => f.number === hoveredFloorNum)
    : null;

  return (
    <div style={{
      display: "flex", borderRadius: 20, overflow: "hidden",
      boxShadow: "0 8px 48px rgba(0,0,0,0.55)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}>
      <div style={{ flex: 1, position: "relative", height: 500, background: "#0a0f1a", overflow: "hidden" }}>
        <LHTCBuildingSVG
          litFloor={litFloor}
          onFloorClick={handleFloorClick}
          onFloorHoverEnter={handleHoverEnter}
          onFloorHoverLeave={handleHoverLeave}
        />
      </div>

      <RoomPanel
        hoveredFloor={hoveredFloor}
        selectedFloor={selectedFloor}
        icon="🏫"
        hint={"Click a floor\non the building\nto see rooms"}
      />
    </div>
  );
}

// ─── LHTC SVG building (inline — no separate file import needed) ──────────────
// Props:
//   litFloor          — floor number whose windows should glow (null = none)
//   onFloorClick      — called with floor number when a zone is clicked
//   onFloorHoverEnter — called with floor number when mouse enters a zone
//   onFloorHoverLeave — called when mouse leaves any zone

function LHTCBuildingSVG({ litFloor, onFloorClick, onFloorHoverEnter, onFloorHoverLeave }) {
  const winFill  = (floorNum) => litFloor === floorNum ? "#ff6820" : "#2a2a38";
  const winClass = (floorNum) => litFloor === floorNum ? "lhtc-win svglit" : "lhtc-win";

  return (
    <svg
      viewBox="0 0 900 500" width="100%" height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
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
      {/* Center grid lines — top */}
      <line x1="360" y1="130" x2="360" y2="260" stroke="#2a3245" strokeWidth="1.5"/>
      <line x1="408" y1="130" x2="408" y2="260" stroke="#2a3245" strokeWidth="1.5"/>
      <line x1="450" y1="130" x2="450" y2="260" stroke="#2a3245" strokeWidth="1.5"/>
      <line x1="496" y1="130" x2="496" y2="260" stroke="#2a3245" strokeWidth="1.5"/>
      <line x1="542" y1="130" x2="542" y2="260" stroke="#2a3245" strokeWidth="1.5"/>
      <line x1="322" y1="190" x2="578" y2="190" stroke="#2a3245" strokeWidth="1.5"/>
      {/* Center grid lines — bottom */}
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

      {/* 1st floor windows — left wing */}
      {["w1f1","w1f2","w1f3","w1f4","w1f5","w1f6"].map((id, i) => (
        <rect key={id} id={id} className={winClass(1)} x={55 + i * 45} y="162" width="34" height="80" rx="2" fill={winFill(1)}/>
      ))}
      {/* 1st floor windows — right wing */}
      {["w1f7","w1f8","w1f9","w1f10","w1f11","w1f12"].map((id, i) => (
        <rect key={id} id={id} className={winClass(1)} x={594 + i * 45} y="162" width="34" height="80" rx="2" fill={winFill(1)}/>
      ))}

      {/* Ground floor windows — left wing */}
      {["wgf1","wgf2","wgf3","wgf4","wgf5","wgf6"].map((id, i) => (
        <rect key={id} id={id} className={winClass(0)} x={55 + i * 45} y="284" width="34" height="80" rx="2" fill={winFill(0)}/>
      ))}
      {/* Ground floor windows — right wing */}
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

      {/* Tooltip when a floor is lit */}
      {litFloor !== null && (
        <g>
          <rect x="300" y="456" width="300" height="30" rx="8" fill="#ff5a1e"/>
          <text x="450" y="475" textAnchor="middle" fontFamily="'Segoe UI',sans-serif" fontSize="12" fill="#fff" fontWeight="700">
            {litFloor === 1 ? "1st Floor" : "Ground Floor"} · click to explore
          </text>
        </g>
      )}

      {/* Building watermark */}
      <text x="450" y="492" textAnchor="middle" fontFamily="'Segoe UI',sans-serif" fontSize="10" fill="rgba(0,0,0,0.2)" letterSpacing="2">LHTC BUILDING — IIITDMJ CAMPUS</text>

      {/* ── Invisible click/hover zones — MUST be last so they sit on top ── */}
      <rect
        className="fzone"
        x="40" y="145" width="820" height="128"
        fill="transparent"
        onClick={() => onFloorClick(1)}
        onMouseEnter={() => onFloorHoverEnter(1)}
        onMouseLeave={onFloorHoverLeave}
      />
      <rect
        className="fzone"
        x="40" y="273" width="820" height="116"
        fill="transparent"
        onClick={() => onFloorClick(0)}
        onMouseEnter={() => onFloorHoverEnter(0)}
        onMouseLeave={onFloorHoverLeave}
      />
    </svg>
  );
}

// ─── Shared right-panel component ────────────────────────────────────────────

function RoomPanel({ hoveredFloor, selectedFloor, icon = "🏢", hint = "Hover over a floor\non the building\nto see rooms" }) {
  const active = hoveredFloor || selectedFloor;

  return (
    <div style={{
      width: 300, flexShrink: 0, height: 500,
      background: "#0f1923", borderLeft: "1px solid rgba(255,255,255,0.07)",
      padding: "24px 18px", display: "flex", flexDirection: "column", overflowY: "auto",
    }}>
      {active ? (
        <>
          <div style={{ fontSize: 10, color: "#ff5a1e", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 4, fontFamily: "'Segoe UI',sans-serif" }}>
            Floor {active.short}
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Segoe UI',sans-serif", marginBottom: 6 }}>
            {active.label}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", fontFamily: "'Segoe UI',sans-serif", marginBottom: 16 }}>
            {active.rooms.length} rooms
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7, overflowY: "auto" }}>
            {active.rooms.map((r, idx) => (
              <div
                key={idx}
                className="room-chip-item"
                style={{ padding: "10px 14px", borderRadius: 9, background: "rgba(255,90,30,0.1)", border: "1px solid rgba(255,90,30,0.28)" }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: "#ff8c5a", fontFamily: "'Segoe UI',sans-serif" }}>
                  {r.name}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, textAlign: "center" }}>
          <div style={{ fontSize: 40, opacity: 0.12 }}>{icon}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.2)", fontFamily: "'Segoe UI',sans-serif", lineHeight: 1.7 }}>
            {hint.split("\n").map((line, i) => <span key={i}>{line}<br /></span>)}
          </div>
        </div>
      )}
    </div>
  );
}
