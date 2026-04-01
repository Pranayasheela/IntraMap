import { useState } from "react";
import BuildingViewer from "./BuildingViewer";

const floorSections = [
  {
    name: "Ground Floor", short: "G", color: "#0d9488",
    rooms: [
      { id: "GF-101", name: "Mtech Lecture Room 1",  floor: 0, type: "Lecture Hall", capacity: 60,  status: "Available",  glb: "/Untitled.glb", icon: "📖", desc: "Spacious lecture hall equipped with projector and smart board." },
      { id: "GF-102", name: "Mtech Lecture Room 2",  floor: 0, type: "Lecture Hall", capacity: 60,  status: "Occupied",   glb: "/Untitled.glb", icon: "📖", desc: "Large lecture hall with tiered seating and audio system." },
      { id: "GF-103", name: "Pharmacology Lab 1",    floor: 0, type: "Lab",          capacity: 30,  status: "Available",  glb: "/Untitled.glb", icon: "🔬", desc: "Well-equipped pharmacology lab with safety cabinets." },
      { id: "GF-104", name: "Microbiology Lab",      floor: 0, type: "Lab",          capacity: 28,  status: "Available",  glb: "/Untitled.glb", icon: "🦠", desc: "Microbiology lab with biosafety equipment and microscopes." },
      { id: "GF-105", name: "Balance Room",          floor: 0, type: "Technical",    capacity: 10,  status: "Restricted", glb: "/Untitled.glb", icon: "⚖️", desc: "Precision balance room for pharmaceutical measurements." },
      { id: "GF-106", name: "Store Room 1",          floor: 0, type: "Storage",      capacity: 5,   status: "Restricted", glb: "/Untitled.glb", icon: "📦", desc: "Chemical and material storage for ground floor labs." },
      { id: "GF-107", name: "Staff Room",            floor: 0, type: "Office",       capacity: 15,  status: "Available",  glb: "/Untitled.glb", icon: "🪑", desc: "Faculty staff room with workstations and lounge area." },
      { id: "GF-108", name: "Director Office",       floor: 0, type: "Office",       capacity: 5,   status: "Occupied",   glb: "/Untitled.glb", icon: "👔", desc: "Director's office with attached meeting room." },
    ],
  },
  {
    name: "First Floor", short: "1", color: "#2563eb",
    rooms: [
      { id: "FF-201", name: "Pharmaceutics Lab 1",         floor: 1, type: "Lab",          capacity: 30, status: "Available",  glb: "/Untitled.glb", icon: "💊", desc: "Pharmaceutics lab for drug formulation and testing." },
      { id: "FF-202", name: "Pharmaceutics Lab 2",         floor: 1, type: "Lab",          capacity: 30, status: "Available",  glb: "/Untitled.glb", icon: "💊", desc: "Secondary pharmaceutics lab for research work." },
      { id: "FF-203", name: "Pharmaceutical Analysis Lab", floor: 1, type: "Lab",          capacity: 25, status: "Occupied",   glb: "/Untitled.glb", icon: "⚗️", desc: "Analytical lab with HPLC and spectroscopy equipment." },
      { id: "FF-204", name: "Lecture Hall 1",              floor: 1, type: "Lecture Hall", capacity: 80, status: "Available",  glb: "/Untitled.glb", icon: "📖", desc: "Large lecture hall on first floor with modern AV setup." },
      { id: "FF-205", name: "Lecture Hall 2",              floor: 1, type: "Lecture Hall", capacity: 80, status: "Occupied",   glb: "/Untitled.glb", icon: "📖", desc: "First floor lecture hall with 80-seat capacity." },
      { id: "FF-206", name: "Museum & Pharmacy Practice",  floor: 1, type: "Museum",       capacity: 50, status: "Available",  glb: "/Untitled.glb", icon: "🏛️", desc: "Pharmacy museum and practice lab for students." },
      { id: "FF-207", name: "Central Instrumentation",     floor: 1, type: "Technical",    capacity: 20, status: "Restricted", glb: "/Untitled.glb", icon: "🔭", desc: "Houses advanced analytical instruments." },
      { id: "FF-208", name: "HOD Office",                  floor: 1, type: "Office",       capacity: 4,  status: "Occupied",   glb: "/Untitled.glb", icon: "🏆", desc: "Head of Department office." },
    ],
  },
  {
    name: "Second Floor", short: "2", color: "#7c3aed",
    rooms: [
      { id: "SF-301", name: "Pharmacology Lab 2",            floor: 2, type: "Lab",          capacity: 30, status: "Available",  glb: "/Untitled.glb", icon: "🔬", desc: "Advanced pharmacology research lab." },
      { id: "SF-302", name: "Pharmacology Lab 3 (Molecular)",floor: 2, type: "Lab",          capacity: 25, status: "Occupied",   glb: "/Untitled.glb", icon: "🧬", desc: "Molecular pharmacology lab with PCR equipment." },
      { id: "SF-303", name: "Pharmacognosy Lab 1",           floor: 2, type: "Lab",          capacity: 28, status: "Available",  glb: "/Untitled.glb", icon: "🌿", desc: "Pharmacognosy lab for herbal drug analysis." },
      { id: "SF-304", name: "Pharmacognosy Lab 2",           floor: 2, type: "Lab",          capacity: 28, status: "Available",  glb: "/Untitled.glb", icon: "🌿", desc: "Secondary pharmacognosy lab." },
      { id: "SF-305", name: "Lecture Hall 3",                floor: 2, type: "Lecture Hall", capacity: 80, status: "Available",  glb: "/Untitled.glb", icon: "📖", desc: "Second floor large lecture hall." },
      { id: "SF-306", name: "Lecture Hall 4",                floor: 2, type: "Lecture Hall", capacity: 80, status: "Occupied",   glb: "/Untitled.glb", icon: "📖", desc: "Second floor lecture hall with projector system." },
      { id: "SF-307", name: "Pharmacology Research Lab",     floor: 2, type: "Lab",          capacity: 20, status: "Restricted", glb: "/Untitled.glb", icon: "🔭", desc: "Research lab for advanced pharmacology studies." },
      { id: "SF-308", name: "Store Room 2",                  floor: 2, type: "Storage",      capacity: 5,  status: "Restricted", glb: "/Untitled.glb", icon: "📦", desc: "Second floor material storage room." },
    ],
  },
  {
    name: "Third Floor", short: "3", color: "#dc2626",
    rooms: [
      { id: "TF-401", name: "Pharmaceutical Chemistry Lab 1",    floor: 3, type: "Lab",          capacity: 30,  status: "Available",  glb: "/Untitled.glb", icon: "⚗️", desc: "Organic chemistry lab for pharmaceutical synthesis." },
      { id: "TF-402", name: "Pharmaceutical Chemistry Lab 2",    floor: 3, type: "Lab",          capacity: 30,  status: "Occupied",   glb: "/Untitled.glb", icon: "⚗️", desc: "Second pharmaceutical chemistry lab." },
      { id: "TF-403", name: "Pharmaceutical Chemistry Lab 3",    floor: 3, type: "Lab",          capacity: 25,  status: "Available",  glb: "/Untitled.glb", icon: "⚗️", desc: "Advanced synthesis and analytical chemistry lab." },
      { id: "TF-404", name: "Pharmaceutical Chemistry Research", floor: 3, type: "Lab",          capacity: 15,  status: "Restricted", glb: "/Untitled.glb", icon: "🔭", desc: "Dedicated research lab for faculty." },
      { id: "TF-405", name: "Lecture Hall 5",                    floor: 3, type: "Lecture Hall", capacity: 80,  status: "Available",  glb: "/Untitled.glb", icon: "📖", desc: "Third floor lecture hall." },
      { id: "TF-406", name: "Lecture Hall 6",                    floor: 3, type: "Lecture Hall", capacity: 80,  status: "Available",  glb: "/Untitled.glb", icon: "📖", desc: "Third floor lecture hall with full AV equipment." },
      { id: "TF-407", name: "Machine Room",                      floor: 3, type: "Technical",    capacity: 10,  status: "Available",  glb: "/Untitled.glb", icon: "⚙️", desc: "Houses pharmaceutical machinery and equipment." },
      { id: "TF-408", name: "Seminar Hall",                      floor: 3, type: "Seminar",      capacity: 100, status: "Available",  glb: "/Untitled.glb", icon: "🎓", desc: "Large seminar hall for events and presentations." },
    ],
  },
  {
    name: "Fourth Floor", short: "4", color: "#b45309",
    rooms: [
      { id: "FOF-501", name: "Pharmacology Lab 4", floor: 4, type: "Lab",          capacity: 25, status: "Available",  glb: "/Untitled.glb", icon: "🔬", desc: "Fourth floor pharmacology lab." },
      { id: "FOF-502", name: "Conference Room",    floor: 4, type: "Conference",   capacity: 20, status: "Available",  glb: "/Untitled.glb", icon: "🎯", desc: "Conference room with video conferencing setup." },
      { id: "FOF-503", name: "Library",            floor: 4, type: "Library",      capacity: 80, status: "Available",  glb: "/Untitled.glb", icon: "📚", desc: "Main building library with digital access terminals." },
      { id: "FOF-504", name: "Computer Lab",       floor: 4, type: "Lab",          capacity: 40, status: "Occupied",   glb: "/Untitled.glb", icon: "💻", desc: "Computer lab with 40 high-spec workstations." },
      { id: "FOF-505", name: "Lecture Hall 510",   floor: 4, type: "Lecture Hall", capacity: 60, status: "Available",  glb: "/Untitled.glb", icon: "📖", desc: "Top floor lecture hall." },
      { id: "FOF-506", name: "Lecture Hall 511",   floor: 4, type: "Lecture Hall", capacity: 60, status: "Occupied",   glb: "/Untitled.glb", icon: "📖", desc: "Fourth floor lecture hall." },
      { id: "FOF-507", name: "Research Center",    floor: 4, type: "Lab",          capacity: 20, status: "Restricted", glb: "/Untitled.glb", icon: "🧪", desc: "Main research center for postgraduate students." },
    ],
  },
];

const allRooms = floorSections.flatMap((s) =>
  s.rooms.map((r) => ({ ...r, section: s.name, sectionColor: s.color }))
);

const infoItems = [
  { label: "Year Built",   value: "2019",        icon: "🏗️" },
  { label: "Total Floors", value: "5",           icon: "⬆️" },
  { label: "Total Rooms",  value: "40+",         icon: "🚪" },
  { label: "Capacity",     value: "1000+",       icon: "👥" },
  { label: "Area",         value: "25,000 sqft", icon: "📐" },
  { label: "Status",       value: "Operational", icon: "✅" },
];

const NAV_ITEMS = ["Rooms", "Floors", "About"];

export default function BuildingPage() {
  const [query, setQuery]                 = useState("");
  const [searchResult, setSearchResult]   = useState(null);
  const [loading, setLoading]             = useState(false);
  const [notFound, setNotFound]           = useState(false);
  const [animateCard, setAnimateCard]     = useState(false);
  const [activeNav, setActiveNav]         = useState("Rooms");
  const [infoHovered, setInfoHovered]     = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSearch = (q = query) => {
    const val = (typeof q === "string" ? q : query).trim();
    if (!val) return;
    setLoading(true);
    setSearchResult(null);
    setNotFound(false);
    setAnimateCard(false);
    setTimeout(() => {
      const found = allRooms.find(
        (r) =>
          r.id.toLowerCase() === val.toLowerCase() ||
          r.name.toLowerCase().includes(val.toLowerCase())
      );
      setLoading(false);
      if (found) { setSearchResult(found); setTimeout(() => setAnimateCard(true), 50); }
      else setNotFound(true);
    }, 1200);
  };

  const totalAvailable = allRooms.filter((r) => r.status === "Available").length;
  const floorLabel = (n) => ["Ground Floor","1st Floor","2nd Floor","3rd Floor","4th Floor"][n] ?? `${n}th Floor`;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(150deg, #e4e8ee 0%, #dde2ea 40%, #e0e5ec 100%)",
      fontFamily: "'Outfit', 'Segoe UI', sans-serif",
      color: "#1e293b",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { opacity:0; transform:translateY(28px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes glow    { 0%,100%{opacity:.6;} 50%{opacity:1;} }
        .nav-btn { background:transparent; border:none; cursor:pointer; font-family:'Outfit',sans-serif; transition:all 0.2s; border-radius:8px; }
        .nav-btn:hover { background:rgba(255,255,255,0.25) !important; color:#0f172a !important; }
        .nav-btn.active { background:rgba(255,255,255,0.35) !important; color:#0f172a !important; font-weight:700 !important; }
        .chip:hover { background:rgba(13,148,136,0.1) !important; border-color:rgba(13,148,136,0.45) !important; color:#0d9488 !important; }
        .room-tag { display:inline-flex; align-items:center; padding:5px 13px; border-radius:7px; font-size:12px; font-weight:500; cursor:pointer; transition:all 0.18s; border:1.5px solid; margin:3px; font-family:'Outfit',sans-serif; letter-spacing:0.3px; }
        .room-tag:hover { transform:translateY(-2px); box-shadow:0 4px 14px rgba(0,0,0,0.13); }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background:rgba(0,0,0,0.1); border-radius:4px; }
      `}</style>

      {/* Background orbs */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }}>
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.04 }}>
          <defs><pattern id="g" width="52" height="52" patternUnits="userSpaceOnUse"><path d="M 52 0 L 0 0 0 52" fill="none" stroke="#64748b" strokeWidth="0.6"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#g)" />
        </svg>
        <div style={{ position:"absolute", top:"-10%", right:"-5%", width:"36vw", height:"36vw", borderRadius:"50%", background:"radial-gradient(circle,rgba(13,148,136,0.1) 0%,transparent 70%)" }} />
        <div style={{ position:"absolute", bottom:"-8%", left:"-4%", width:"30vw", height:"30vw", borderRadius:"50%", background:"radial-gradient(circle,rgba(37,99,235,0.07) 0%,transparent 70%)" }} />
      </div>

      {/* ══ HEADER — slate-blue gradient, not white ══ */}
      <header style={{
        position:"relative", zIndex:100,
        display:"flex", alignItems:"center",
        padding:"0 44px", height:64,
        background:"linear-gradient(135deg, #1e3a5f 0%, #1a4f6e 50%, #0f4c5c 100%)",
        boxShadow:"0 2px 16px rgba(0,0,0,0.18)",
      }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:11, marginRight:48 }}>
          <div style={{
            width:38, height:38, borderRadius:11,
            background:"linear-gradient(135deg,#0d9488,#06b6d4)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:18, boxShadow:"0 0 20px rgba(6,182,212,0.45)",
          }}>⬡</div>
          <div>
            <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:16, letterSpacing:"1px", color:"#f0f9ff" }}>NEXUS</div>
            <div style={{ fontSize:8.5, color:"rgba(186,230,253,0.6)", letterSpacing:"2.5px", marginTop:1 }}>BUILDING OS</div>
          </div>
        </div>

        {/* Nav — centered with larger font */}
<nav style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, flex:1 }}>
  {NAV_ITEMS.map((n) => (
    <button key={n} className={`nav-btn ${activeNav===n?"active":""}`} onClick={()=>setActiveNav(n)}
      style={{
        padding:"8px 28px",
        color: activeNav===n ? "#f0f9ff" : "rgba(186,230,253,0.65)",
        fontSize:15.5, fontWeight: activeNav===n ? 700 : 500,
        letterSpacing:"0.4px",
      }}
    >{n}</button>
  ))}
</nav>

        {/* Right side */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {/* Live badge */}
          <div style={{
            display:"flex", alignItems:"center", gap:7, padding:"6px 14px", borderRadius:8,
            background:"rgba(6,182,212,0.15)", border:"1px solid rgba(6,182,212,0.3)",
          }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#06b6d4", display:"inline-block", animation:"glow 2s ease infinite" }} />
            <span style={{ fontSize:12, color:"#67e8f9", fontWeight:600 }}>All Systems Live</span>
          </div>

          {/* Notification */}
          <button style={{
            width:38, height:38, borderRadius:10,
            background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:16, cursor:"pointer", transition:"background 0.2s",
          }}
            onMouseEnter={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.15)"}
            onMouseLeave={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.08)"}
          >🔔</button>

          {/* Avatar */}
          <div style={{
            width:38, height:38, borderRadius:10,
            background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:14, cursor:"pointer", fontWeight:800, color:"#fff",
            boxShadow:"0 2px 10px rgba(99,102,241,0.4)",
          }}>A</div>
        </div>
      </header>

      {/* ══ MAIN ══ */}
      <div style={{
        position:"relative", zIndex:1,
        display:"flex", gap:22, padding:"24px 44px 28px",
        flex:1, alignItems:"flex-start",
      }}>

        {/* ═══ LEFT COLUMN ═══ */}
        <div style={{ width:330, flexShrink:0, display:"flex", flexDirection:"column", gap:14 }}>

          {/* 3D Viewer */}
          <div style={{
            borderRadius:16, overflow:"hidden",
            background:"rgba(255,255,255,0.55)",
            border:"1px solid rgba(255,255,255,0.7)",
            boxShadow:"0 4px 20px rgba(0,0,0,0.09)",
            backdropFilter:"blur(8px)",
          }}>
            <div style={{ padding:"14px 16px 0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:9, color:"#0d9488", fontWeight:700, letterSpacing:"3px", textTransform:"uppercase", marginBottom:3 }}>Live 3D Model</div>
                <div style={{ fontSize:15, fontWeight:700, fontFamily:"'Outfit',sans-serif", color:"#0f172a" }}>CC Building</div>
              </div>
              <div style={{
                padding:"3px 10px", borderRadius:20,
                background:"rgba(13,148,136,0.1)", border:"1px solid rgba(13,148,136,0.25)",
                fontSize:10, color:"#0d9488", fontWeight:600,
                display:"flex", alignItems:"center", gap:5,
              }}>
                <span style={{ width:5, height:5, borderRadius:"50%", background:"#0d9488", animation:"glow 2s infinite" }} />LIVE
              </div>
            </div>
            <div style={{ height:250, marginTop:8 }}>
              <BuildingViewer glbPath="/Untitled.glb" height="250px" autoRotate={true} />
            </div>
            <div style={{ padding:"8px 16px 12px", display:"flex", gap:16, borderTop:"1px solid rgba(0,0,0,0.06)" }}>
              {[["⟳","Auto-rotating"],["⊕","Zoom"],["⊙","Drag orbit"]].map(([ic,lb])=>(
                <span key={lb} style={{ fontSize:10, color:"#94a3b8", display:"flex", alignItems:"center", gap:3 }}>
                  <span style={{ fontSize:12, color:"#cbd5e1" }}>{ic}</span>{lb}
                </span>
              ))}
            </div>
          </div>

          {/* Building Info Box */}
          <div
            onMouseEnter={()=>setInfoHovered(true)}
            onMouseLeave={()=>setInfoHovered(false)}
            style={{
              borderRadius:16, padding:"20px",
              background: infoHovered
                ? "linear-gradient(145deg,rgba(13,148,136,0.14),rgba(8,145,178,0.1))"
                : "rgba(255,255,255,0.55)",
              border: infoHovered ? "1.5px solid rgba(13,148,136,0.35)" : "1px solid rgba(255,255,255,0.7)",
              boxShadow: infoHovered ? "0 0 36px rgba(13,148,136,0.15)" : "0 4px 20px rgba(0,0,0,0.09)",
              backdropFilter:"blur(8px)",
              transition:"all 0.4s ease",
              cursor:"default",
            }}
          >
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:"3px", textTransform:"uppercase", color:infoHovered?"#0d9488":"#94a3b8", transition:"color 0.3s" }}>Building Info</div>
              <div style={{
                width:28, height:28, borderRadius:8, fontSize:14,
                background:infoHovered?"rgba(13,148,136,0.12)":"rgba(0,0,0,0.05)",
                border:infoHovered?"1px solid rgba(13,148,136,0.28)":"1px solid rgba(0,0,0,0.08)",
                display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.3s",
              }}>🏢</div>
            </div>

            <div style={{
              padding:"11px 14px", borderRadius:10, marginBottom:14,
              background:infoHovered?"rgba(13,148,136,0.08)":"rgba(0,0,0,0.03)",
              border:infoHovered?"1px solid rgba(13,148,136,0.18)":"1px solid rgba(0,0,0,0.07)",
              transition:"all 0.3s",
            }}>
              <div style={{ fontWeight:800, fontSize:15, color:"#0f172a" }}>CC Building</div>
              <div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>123 Innovation Ave, Tech District</div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:7, marginBottom:12 }}>
              {infoItems.map((item)=>(
                <div key={item.label} style={{
                  padding:"10px 8px", borderRadius:9, textAlign:"center",
                  background:infoHovered?"rgba(13,148,136,0.06)":"rgba(0,0,0,0.03)",
                  border:infoHovered?"1px solid rgba(13,148,136,0.15)":"1px solid rgba(0,0,0,0.07)",
                  transition:"all 0.3s",
                }}>
                  <div style={{ fontSize:14, marginBottom:3 }}>{item.icon}</div>
                  <div style={{ fontSize:12.5, fontWeight:700, color:infoHovered?"#0f172a":"#334155" }}>{item.value}</div>
                  <div style={{ fontSize:8, color:"#94a3b8", marginTop:1, letterSpacing:"0.4px" }}>{item.label.toUpperCase()}</div>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", gap:6 }}>
              {[["🅿️","Parking"],["♿","Access"],["🔒","Secured"],["📶","WiFi"]].map(([ic,lb])=>(
                <div key={lb} style={{
                  flex:1, padding:"7px 4px", borderRadius:8, textAlign:"center",
                  background:infoHovered?"rgba(13,148,136,0.06)":"rgba(0,0,0,0.03)",
                  border:infoHovered?"1px solid rgba(13,148,136,0.12)":"1px solid rgba(0,0,0,0.07)",
                  transition:"all 0.3s",
                }}>
                  <div style={{ fontSize:13 }}>{ic}</div>
                  <div style={{ fontSize:7.5, color:"#94a3b8", marginTop:2, letterSpacing:"0.5px" }}>{lb.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ RIGHT COLUMN ═══ */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:16, minWidth:0 }}>

          {/* Title */}
          <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:800, fontSize:26, color:"#0f172a" }}>Room Explorer</div>
              <div style={{ fontSize:13, color:"#64748b", marginTop:2 }}>Search, locate and book rooms in real-time</div>
            </div>
            <div style={{
              padding:"5px 14px", borderRadius:8,
              background:"rgba(255,255,255,0.55)", border:"1px solid rgba(255,255,255,0.7)",
              backdropFilter:"blur(8px)",
              fontSize:12, color:"#475569", fontWeight:500,
              boxShadow:"0 1px 6px rgba(0,0,0,0.07)",
            }}>
              {totalAvailable}/{allRooms.length} Available
            </div>
          </div>

          {/* Search */}
          <div style={{
            borderRadius:14,
            background: searchFocused ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)",
            border: searchFocused ? "1.5px solid rgba(13,148,136,0.3)" : "1px solid rgba(255,255,255,0.75)",
            backdropFilter:"blur(8px)",
            padding:"18px 20px",
            boxShadow: searchFocused ? "0 0 0 4px rgba(13,148,136,0.08), 0 4px 16px rgba(0,0,0,0.09)" : "0 4px 16px rgba(0,0,0,0.08)",
            transition:"all 0.25s",
          }}>
            <div style={{ display:"flex", gap:10 }}>
              <div style={{ flex:1, position:"relative" }}>
                <div style={{
                  position:"absolute", left:13, top:"50%", transform:"translateY(-50%)",
                  color:searchFocused?"#0d9488":"#94a3b8", transition:"color 0.2s", pointerEvents:"none",
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                </div>
                <input
                  value={query}
                  onChange={(e)=>setQuery(e.target.value)}
                  onKeyDown={(e)=>e.key==="Enter"&&handleSearch()}
                  onFocus={()=>setSearchFocused(true)}
                  onBlur={()=>setSearchFocused(false)}
                  placeholder="Search by room code (GF-101) or name…"
                  style={{
                    width:"100%", padding:"11px 14px 11px 40px",
                    borderRadius:9, border:"1px solid rgba(0,0,0,0.09)",
                    background:"rgba(248,250,252,0.85)", color:"#1e293b", fontSize:13.5,
                    outline:"none", boxSizing:"border-box", fontFamily:"'Outfit',sans-serif",
                  }}
                />
              </div>
              <button onClick={()=>handleSearch()} style={{
                padding:"11px 26px", borderRadius:9, border:"none",
                background:"linear-gradient(135deg,#0d9488,#0891b2)",
                color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer",
                fontFamily:"'Outfit',sans-serif",
                boxShadow:"0 3px 14px rgba(13,148,136,0.3)",
                transition:"all 0.2s", whiteSpace:"nowrap",
              }}
                onMouseEnter={(e)=>{ e.target.style.transform="translateY(-1px)"; e.target.style.boxShadow="0 6px 20px rgba(13,148,136,0.4)"; }}
                onMouseLeave={(e)=>{ e.target.style.transform=""; e.target.style.boxShadow="0 3px 14px rgba(13,148,136,0.3)"; }}
              >Search</button>
            </div>
            <div style={{ display:"flex", gap:5, marginTop:11, flexWrap:"wrap", alignItems:"center" }}>
              <span style={{ fontSize:9.5, color:"#94a3b8", letterSpacing:"1.5px", marginRight:4 }}>QUICK ACCESS</span>
              {["GF-101","FF-204","SF-305","TF-408","FOF-503"].map((id)=>{
                const r = allRooms.find(x=>x.id===id);
                return r ? (
                  <button key={id} className="chip"
                    onClick={()=>{ setQuery(id); handleSearch(id); }}
                    style={{
                      padding:"3px 10px", borderRadius:6,
                      border:"1px solid rgba(0,0,0,0.1)", background:"rgba(0,0,0,0.03)",
                      color:"#475569", fontSize:11, cursor:"pointer", fontFamily:"'Outfit',sans-serif",
                    }}
                  ><span style={{ color:r.sectionColor, marginRight:4 }}>●</span>{id}</button>
                ) : null;
              })}
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div style={{
              flex:1, minHeight:280,
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16,
              borderRadius:14,
              background:"rgba(255,255,255,0.6)", backdropFilter:"blur(8px)",
              border:"1px solid rgba(255,255,255,0.75)",
              boxShadow:"0 4px 16px rgba(0,0,0,0.08)",
              animation:"fadeUp 0.3s ease",
            }}>
              <div style={{
                width:44, height:44,
                border:"2.5px solid rgba(13,148,136,0.18)",
                borderTop:"2.5px solid #0d9488",
                borderRadius:"50%", animation:"spin 0.75s linear infinite",
              }} />
              <div>
                <div style={{ color:"#475569", fontSize:14, fontWeight:500, textAlign:"center", fontFamily:"'Outfit',sans-serif" }}>Locating room…</div>
                <div style={{ color:"#94a3b8", fontSize:11, textAlign:"center", marginTop:3, letterSpacing:"1px" }}>SCANNING FLOOR PLAN</div>
              </div>
            </div>
          )}

          {/* NOT FOUND */}
          {notFound && !loading && (
            <div style={{
              flex:1, minHeight:280,
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              borderRadius:14,
              background:"rgba(255,255,255,0.6)", backdropFilter:"blur(8px)",
              border:"1px solid rgba(239,68,68,0.18)",
              boxShadow:"0 4px 16px rgba(0,0,0,0.08)",
              animation:"fadeUp 0.4s ease",
            }}>
              <div style={{ fontSize:36, opacity:0.3, marginBottom:12 }}>⊘</div>
              <div style={{ fontWeight:700, fontSize:16, color:"#1e293b", fontFamily:"'Outfit',sans-serif" }}>No Room Found</div>
              <div style={{ color:"#94a3b8", marginTop:5, fontSize:13, fontFamily:"'Outfit',sans-serif" }}>
                No match for <span style={{ color:"#475569", fontWeight:600 }}>"{query}"</span>
              </div>
              <div style={{ color:"#cbd5e1", fontSize:11, marginTop:3 }}>Try GF-101, FF-204, TF-408…</div>
            </div>
          )}

          {/* RESULT CARD */}
          {searchResult && !loading && (
            <div style={{
              borderRadius:14,
              background:"rgba(255,255,255,0.75)",
              backdropFilter:"blur(10px)",
              border:`1.5px solid ${searchResult.sectionColor}32`,
              overflow:"hidden",
              boxShadow:`0 6px 30px ${searchResult.sectionColor}18`,
              animation:animateCard?"slideIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards":"none",
              opacity:animateCard?1:0,
            }}>
              <div style={{ height:3, background:`linear-gradient(90deg,${searchResult.sectionColor},${searchResult.sectionColor}55,transparent)` }} />
              <div style={{ display:"flex" }}>
                <div style={{
                  width:300, flexShrink:0, position:"relative",
                  background:"rgba(224,229,236,0.6)",
                  borderRight:`1px solid ${searchResult.sectionColor}18`,
                }}>
                  <div style={{ height:310 }}>
                    <BuildingViewer glbPath={searchResult.glb} height="310px" autoRotate={false} />
                  </div>
                  <div style={{
                    position:"absolute", bottom:0, left:0, right:0,
                    padding:"18px 12px 9px",
                    background:"linear-gradient(to top,rgba(224,229,236,0.85),transparent)",
                    fontSize:9, color:"#94a3b8", textAlign:"center", letterSpacing:"1.5px",
                  }}>DRAG · SCROLL · ORBIT</div>
                </div>

                <div style={{ flex:1, padding:"22px 24px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                    <span style={{
                      padding:"3px 11px", borderRadius:6,
                      background:searchResult.sectionColor, color:"#fff",
                      fontSize:10, fontWeight:700, letterSpacing:"1px",
                    }}>{searchResult.section.toUpperCase()}</span>
                    <span style={{
                      padding:"3px 11px", borderRadius:6, fontSize:10, fontWeight:600,
                      background: searchResult.status==="Available"?"rgba(5,150,105,0.1)":searchResult.status==="Occupied"?"rgba(239,68,68,0.1)":"rgba(245,158,11,0.1)",
                      color: searchResult.status==="Available"?"#059669":searchResult.status==="Occupied"?"#ef4444":"#d97706",
                      border:`1px solid ${searchResult.status==="Available"?"#05966928":searchResult.status==="Occupied"?"#ef444428":"#d9770628"}`,
                    }}>{searchResult.status.toUpperCase()}</span>
                  </div>

                  {/* Room Name / No / Floor */}
                  <div style={{
                    padding:"14px 16px", borderRadius:11, marginBottom:14,
                    background:`${searchResult.sectionColor}09`,
                    border:`1.5px solid ${searchResult.sectionColor}24`,
                  }}>
                    {[
                      ["Room Name", searchResult.name],
                      ["Room No",   searchResult.id],
                      ["Floor",     floorLabel(searchResult.floor)],
                    ].map(([label, val], i)=>(
                      <div key={label} style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom: i<2 ? 9 : 0 }}>
                        <span style={{ fontSize:13, color:searchResult.sectionColor, fontWeight:600, minWidth:80, fontFamily:"'Outfit',sans-serif" }}>{label}:</span>
                        <span style={{ fontSize:14, color:"#0f172a", fontWeight:700, fontFamily:"'Outfit',sans-serif" }}>{val}</span>
                      </div>
                    ))}
                  </div>

                  <p style={{ color:"#64748b", fontSize:13, lineHeight:1.7, marginBottom:14, fontFamily:"'Outfit',sans-serif" }}>{searchResult.desc}</p>

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
                    {[
                      { label:"TYPE",     value:searchResult.type },
                      { label:"CAPACITY", value:`${searchResult.capacity} people` },
                    ].map((s)=>(
                      <div key={s.label} style={{
                        padding:"10px 14px", borderRadius:9,
                        background:`${searchResult.sectionColor}08`,
                        border:`1px solid ${searchResult.sectionColor}20`,
                      }}>
                        <div style={{ fontSize:8.5, color:"#94a3b8", letterSpacing:"1.5px", marginBottom:4 }}>{s.label}</div>
                        <div style={{ fontSize:14, fontWeight:700, color:"#1e293b", fontFamily:"'Outfit',sans-serif" }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display:"flex", gap:8 }}>
                    <button style={{
                      flex:1, padding:"10px", borderRadius:9, border:"none",
                      background:`linear-gradient(135deg,${searchResult.sectionColor},${searchResult.sectionColor}cc)`,
                      color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer",
                      boxShadow:`0 3px 14px ${searchResult.sectionColor}32`,
                      transition:"transform 0.2s", fontFamily:"'Outfit',sans-serif",
                    }}
                      onMouseEnter={(e)=>e.target.style.transform="translateY(-1px)"}
                      onMouseLeave={(e)=>e.target.style.transform=""}
                    >📅 Book This Room</button>
                    <button style={{
                      padding:"10px 16px", borderRadius:9,
                      border:`1.5px solid ${searchResult.sectionColor}32`,
                      background:"transparent", color:searchResult.sectionColor,
                      fontWeight:600, fontSize:13, cursor:"pointer",
                      transition:"background 0.2s", fontFamily:"'Outfit',sans-serif",
                    }}
                      onMouseEnter={(e)=>e.target.style.background=`${searchResult.sectionColor}0e`}
                      onMouseLeave={(e)=>e.target.style.background="transparent"}
                    >View Details</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ROOM SECTIONS */}
          {!searchResult && !loading && !notFound && (
            <div style={{
              borderRadius:14, padding:"22px 24px",
              background:"rgba(255,255,255,0.6)",
              backdropFilter:"blur(8px)",
              border:"1px solid rgba(255,255,255,0.75)",
              boxShadow:"0 4px 16px rgba(0,0,0,0.08)",
            }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:800, fontSize:18, color:"#0f172a" }}>Available Rooms with Codes</div>
                <div style={{ fontSize:11, color:"#94a3b8" }}>Click any room to explore →</div>
              </div>

              {floorSections.map((section, si)=>(
                <div key={section.name} style={{ marginBottom: si < floorSections.length-1 ? 20 : 0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                    <div style={{
                      width:28, height:28, borderRadius:7,
                      background:section.color, color:"#fff",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:12, fontWeight:800, flexShrink:0,
                    }}>{section.short}</div>
                    <span style={{ fontWeight:700, fontSize:13.5, color:"#1e293b", fontFamily:"'Outfit',sans-serif" }}>{section.name}</span>
                    <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${section.color}35,transparent)` }} />
                    <span style={{ fontSize:11, color:"#94a3b8" }}>
                      {section.rooms.filter(r=>r.status==="Available").length}/{section.rooms.length} available
                    </span>
                  </div>

                  <div style={{ display:"flex", flexWrap:"wrap", paddingLeft:4 }}>
                    {section.rooms.map((room)=>{
                      const isAvail = room.status==="Available";
                      const isOccup = room.status==="Occupied";
                      return (
                        <button key={room.id} className="room-tag"
                          onClick={()=>{ setQuery(room.id); handleSearch(room.id); }}
                          style={{
                            background: isAvail?"rgba(255,255,255,0.85)":isOccup?"rgba(239,68,68,0.07)":"rgba(245,158,11,0.07)",
                            borderColor: isAvail?"rgba(0,0,0,0.13)":isOccup?"rgba(239,68,68,0.35)":"rgba(245,158,11,0.42)",
                            color: isAvail?"#334155":isOccup?"#ef4444":"#d97706",
                          }}
                        >{room.id}</button>
                      );
                    })}
                  </div>

                  {si < floorSections.length-1 && <div style={{ height:1, background:"rgba(0,0,0,0.05)", marginTop:18 }} />}
                </div>
              ))}

              <div style={{ display:"flex", gap:16, marginTop:18, paddingTop:14, borderTop:"1px solid rgba(0,0,0,0.05)" }}>
                {[
                  { bc:"rgba(0,0,0,0.13)",    bg:"rgba(255,255,255,0.85)", label:"Available" },
                  { bc:"rgba(239,68,68,0.35)", bg:"rgba(239,68,68,0.07)",  label:"Occupied"  },
                  { bc:"rgba(245,158,11,0.42)",bg:"rgba(245,158,11,0.07)", label:"Restricted" },
                ].map((l)=>(
                  <div key={l.label} style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:28, height:18, borderRadius:5, border:`1.5px solid ${l.bc}`, background:l.bg }} />
                    <span style={{ fontSize:11, color:"#64748b", fontFamily:"'Outfit',sans-serif" }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
