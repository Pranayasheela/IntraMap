import { useState, useEffect, useRef } from "react";
import "./App.css";
import FloorPlanRouter from "./FloorPlanRouter";
import LHTCFloorPlanRouter from "./LHTCFloorPlanRouter";

// ─── CC Building Data ─────────────────────────────────────────────────────────
const CC_BUILDING = {
  id: "cc",
  name: "Computer Center and Library",
  short: "CC",
  image: "/building.png",
  floors: [
    {
      number: 3, label: "3rd Floor", short: "3",
      rooms: [
        { name: "Dr.DS" }, { name: "Dr.MKB" }, { name: "Dr.SKM" },
        { name: "Computing Lab",    isBookable: true, capacity: 40 },
        { name: "MTech Study Room", isBookable: true, capacity: 30 },
        { name: "Store Room" },
        { name: "PG LAB1",          isBookable: true, capacity: 30 },
        { name: "Research LAB1",    isBookable: true, capacity: 20 },
        { name: "Room Head CSE" }, { name: "Office Asst of CC" },
      ],
    },
    {
      number: 2, label: "2nd Floor", short: "2",
      rooms: [
        { name: "Dr.AP" }, { name: "Dr.NA" }, { name: "Dr.SHM" }, { name: "Prof.PK" },
        { name: "IOT / Embedded System Engineering Lab", isBookable: true, capacity: 35 },
        { name: "Tinkering Lab",    isBookable: true, capacity: 25 },
        { name: "Dr.MS" }, { name: "Dr.ND" }, { name: "Dr.RKR" }, { name: "Dr.AS" },
        { name: "Research LAB2",    isBookable: true, capacity: 20 },
        { name: "Seminar Hall",     isBookable: true, capacity: 80 },
        { name: "CC Staff" },
      ],
    },
    {
      number: 1, label: "1st Floor", short: "1",
      rooms: [
        { name: "Computer Lab2",                   isBookable: true, capacity: 50 },
        { name: "Image and Visual Processing Lab", isBookable: true, capacity: 30 },
        { name: "Prof.PK" }, { name: "Dr.AOJHA" },
      ],
    },
    {
      number: 0, label: "Ground Floor", short: "G",
      rooms: [
        { name: "Staff Room of CC" },
        { name: "Library",       isBookable: true, capacity: 100 },
        { name: "Study Room",    isBookable: true, capacity: 60 },
        { name: "Computer Lab1", isBookable: true, capacity: 50 },
        { name: "System Administration Room" }, { name: "Servers Room" },
      ],
    },
  ],
};

// ─── LHTC Building Data ───────────────────────────────────────────────────────
const LHTC_BUILDING = {
  id: "lhtc",
  name: "Lecture Hall & Training Centre",
  short: "LHTC",
  image: "/lhtc_building.jpeg",
  floors: [
    {
      number: 1, label: "1st Floor", short: "1",
      rooms: [
        { name: "DR.NKJ Cabin" },
        { name: "L202",         isBookable: true, capacity: 60 },
        { name: "DR.NKM" }, { name: "DR.YSK" }, { name: "DR.HSN" },
        { name: "Liberal Arts", isBookable: true, capacity: 80 },
        { name: "CR202",        isBookable: true, capacity: 60 },
        { name: "L201",         isBookable: true, capacity: 60 },
        { name: "CR201",        isBookable: true, capacity: 60 },
        { name: "Attendents Room" },
        { name: "L207",         isBookable: true, capacity: 60 },
        { name: "CR208",        isBookable: true, capacity: 60 },
        { name: "CR207",        isBookable: true, capacity: 60 },
      ],
    },
    {
      number: 0, label: "Ground Floor", short: "G",
      rooms: [
        { name: "CR110",        isBookable: true, capacity: 60 },
        { name: "CR109",        isBookable: true, capacity: 60 },
        { name: "CR108",        isBookable: true, capacity: 60 },
        { name: "L107",         isBookable: true, capacity: 60 },
        { name: "L106",         isBookable: true, capacity: 60 },
        { name: "Maths Lab",    isBookable: true, capacity: 40 },
        { name: "LKB Cabin" }, { name: "AKK Cabin" },
        { name: "L105",         isBookable: true, capacity: 60 },
        { name: "L104",         isBookable: true, capacity: 60 },
        { name: "Green Room" }, { name: "Lamba Cabin" },
        { name: "L103",         isBookable: true, capacity: 60 },
        { name: "Design Studio",isBookable: true, capacity: 50 },
        { name: "CR104",        isBookable: true, capacity: 60 },
        { name: "CR103",        isBookable: true, capacity: 60 },
        { name: "CR102",        isBookable: true, capacity: 60 },
        { name: "CR101",        isBookable: true, capacity: 60 },
        { name: "L102",         isBookable: true, capacity: 60 },
      ],
    },
  ],
};

const BUILDINGS = [CC_BUILDING, LHTC_BUILDING];

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

// ─── CC hover zones ───────────────────────────────────────────────────────────
const CC_FLOOR_WINDOWS = {
  3: [
    { top:"30%", left:"24%", w:"5.5%", h:"8%" }, { top:"30%", left:"32%", w:"5.5%", h:"8%" },
    { top:"31%", left:"60%", w:"5.5%", h:"8%" }, { top:"31%", left:"68%", w:"5.5%", h:"8%" },
  ],
  2: [
    { top:"38%", left:"24%", w:"5.5%", h:"8%" }, { top:"38%", left:"32%", w:"5.5%", h:"8%" },
    { top:"38%", left:"60%", w:"5.5%", h:"8%" }, { top:"38%", left:"68%", w:"5.5%", h:"8%" },
  ],
  1: [
    { top:"44%", left:"24%", w:"5.5%", h:"8%" }, { top:"44%", left:"32%", w:"5.5%", h:"8%" },
    { top:"44%", left:"60%", w:"5.5%", h:"8%" }, { top:"44%", left:"68%", w:"5.5%", h:"8%" },
  ],
  0: [
    { top:"51%", left:"24%", w:"5.5%", h:"8%" }, { top:"51%", left:"32%", w:"5.5%", h:"8%" },
    { top:"51%", left:"60%", w:"5.5%", h:"8%" }, { top:"51%", left:"68%", w:"5.5%", h:"8%" },
  ],
};

const CC_FLOOR_HOVER_ZONES = {
  3: { top:"28%", h:"10%" },
  2: { top:"38%", h:"8%"  },
  1: { top:"44%", h:"8%"  },
  0: { top:"51%", h:"12%" },
};

// ─── Client-side expiry filter ────────────────────────────────────────────────
function filterExpired(list) {
  const now      = new Date();
  const todayStr = now.toLocaleDateString("en-CA");
  const nowTime  = now.toTimeString().slice(0, 8);
  return list.filter((b) => {
    if (b.date < todayStr) return false;
    if (b.date === todayStr && b.end_time <= nowTime) return false;
    return true;
  });
}

// ─── backend endpoint per building ───────────────────────────────────────────
function endpoint(buildingId) {
  return buildingId === "cc" ? "/backend/booking.php" : "/backend/lhtc_booking.php";
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AdminPage({ onLogout }) {
  const [displayText, setDisplayText]     = useState("");
  const [query, setQuery]                 = useState("");
  const [suggestions, setSuggestions]     = useState([]);
  const [showDrop, setShowDrop]           = useState(false);
  const [selectedRoom, setSelectedRoom]   = useState(null);
  const [activeBuildingId, setActiveBuildingId] = useState(null);
  const [hoveredFloor, setHoveredFloor]   = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [animFloor, setAnimFloor]         = useState(false);
  const [bookings, setBookings]           = useState({});
  const [modal, setModal]                 = useState(null);   // { room, buildingId, floorLabel }
  const [form, setForm]                   = useState({ date:"", startTime:"", endTime:"", bookedBy:"", purpose:"" });
  const [formErr, setFormErr]             = useState("");
  const [toast, setToast]                 = useState("");
  const [viewRoom, setViewRoom]           = useState(null);   // { name, buildingId }
  const [activeBuilding, setActiveBuilding] = useState("cc"); // tab switcher
  const detailRef    = useRef(null);
  const floorViewRef = useRef(null);

  // Typewriter
  useEffect(() => {
    const full = "Welcome to IntraMap";
    let i = 0;
    const t = setInterval(() => {
      setDisplayText(full.slice(0, i + 1));
      i++;
      if (i >= full.length) clearInterval(t);
    }, 100);
    return () => clearInterval(t);
  }, []);

  // Search suggestions (both buildings)
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setSuggestions([]); return; }
    setSuggestions(ALL_ROOMS.filter((r) => r.name.toLowerCase().includes(q)).slice(0, 8));
  }, [query]);

  // ── Fetch + poll bookings when floor selected ─────────────────────────────
  useEffect(() => {
    if (!selectedFloor || !activeBuildingId) return;
    const api = endpoint(activeBuildingId);

    const fetchAll = async () => {
      const bookableRooms = selectedFloor.rooms.filter((r) => r.isBookable);
      for (const room of bookableRooms) {
        try {
          const res  = await fetch(`${api}?room=${encodeURIComponent(room.name)}`);
          const data = await res.json();
          if (data.status === "success") {
            setBookings((prev) => ({ ...prev, [room.name]: filterExpired(data.bookings) }));
          }
        } catch (err) { console.error(err); }
      }
    };

    fetchAll();
    const iv = setInterval(fetchAll, 10000);
    return () => clearInterval(iv);
  }, [selectedFloor, activeBuildingId]);

  // ── Client-side expiry sweep ──────────────────────────────────────────────
  useEffect(() => {
    if (!selectedFloor) return;
    const iv = setInterval(() => {
      setBookings((prev) => {
        const next = {};
        for (const [k, v] of Object.entries(prev)) next[k] = filterExpired(v);
        return next;
      });
    }, 10000);
    return () => clearInterval(iv);
  }, [selectedFloor]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3200); };

  const handleSelectRoom = (room) => {
    setQuery(room.name);
    setSelectedRoom(room);
    setActiveBuildingId(room.buildingId);
    setSuggestions([]);
    setShowDrop(false);
    const building = BUILDINGS.find((b) => b.id === room.buildingId);
    const fd = building.floors.find((f) => f.number === room.floor);
    setSelectedFloor(fd);
    setAnimFloor(true);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 100);
  };

  const handleSearch = () => {
    const match = suggestions[0] || ALL_ROOMS.find((r) => r.name.toLowerCase() === query.toLowerCase());
    if (match) handleSelectRoom(match);
  };

  const handleFloorClick = (floor, buildingId) => {
    setSelectedFloor(floor);
    setActiveBuildingId(buildingId);
    setAnimFloor(false);
    setTimeout(() => setAnimFloor(true), 50);
    setTimeout(() => floorViewRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 200);
  };

  const openBook = (room, buildingId, floorLabel) => {
    setModal({ room, buildingId, floorLabel });
    setForm({ date:"", startTime:"", endTime:"", bookedBy:"", purpose:"" });
    setFormErr("");
  };

  const submitBooking = async () => {
    const { date, startTime, endTime, bookedBy, purpose } = form;
    if (!date || !startTime || !endTime || !bookedBy || !purpose) { setFormErr("All fields are required."); return; }
    if (endTime <= startTime) { setFormErr("End time must be after start time."); return; }
    try {
      const api = endpoint(modal.buildingId);
      const res = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_name:  modal.room.name,
          floor:      modal.floorLabel,
          date,
          start_time: startTime,
          end_time:   endTime,
          booked_by:  bookedBy,
          purpose,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        const r2 = await fetch(`${api}?room=${encodeURIComponent(modal.room.name)}`);
        const d2 = await r2.json();
        if (d2.status === "success") setBookings((prev) => ({ ...prev, [modal.room.name]: filterExpired(d2.bookings) }));
        setModal(null);
        showToast(`✅ "${modal.room.name}" booked for ${date} · ${startTime} – ${endTime}`);
      } else { setFormErr(data.message); }
    } catch (err) { setFormErr("Network error. Please try again."); }
  };

  const cancelBooking = async (roomName, bookingId, buildingId) => {
    try {
      const api = endpoint(buildingId);
      const res = await fetch(api, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookingId }),
      });
      const data = await res.json();
      if (data.status === "success") {
        const r2 = await fetch(`${api}?room=${encodeURIComponent(roomName)}`);
        const d2 = await r2.json();
        if (d2.status === "success") setBookings((prev) => ({ ...prev, [roomName]: filterExpired(d2.bookings) }));
        showToast("🗑 Booking cancelled.");
      } else { showToast("❌ Failed to cancel."); }
    } catch { showToast("❌ Network error."); }
  };

  // ─── Building tab selector (for building viewer area) ─────────────────────
  const currentBuilding = BUILDINGS.find((b) => b.id === (activeBuildingId || activeBuilding));

  return (
    <div className="app">
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
        @keyframes winPulse { 0%,100%{opacity:0.80} 50%{opacity:1} }
        @keyframes slideIn  { from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)} }
        .sugg-item:hover       { background:#f0f4f8 !important; }
        .room-chip-item        { transition:transform 0.18s; cursor:default; }
        .room-chip-item:hover  { transform:translateY(-2px); }
        .admin-room-card       { transition:transform 0.18s, box-shadow 0.18s; }
        .admin-room-card:hover { transform:translateY(-3px); box-shadow:0 8px 28px rgba(0,0,0,0.4) !important; }
        .bldg-tab              { transition: background 0.2s, color 0.2s; }
        .bldg-tab:hover        { background:rgba(255,90,30,0.18) !important; }
      `}</style>

      {/* TOAST */}
      {toast && (
        <div style={{
          position:"fixed", top:24, right:24, zIndex:9999,
          background:"#1e293b", border:"1px solid rgba(255,90,30,0.5)",
          color:"#f1f5f9", padding:"12px 24px", borderRadius:12,
          fontSize:14, fontWeight:600, boxShadow:"0 8px 32px rgba(0,0,0,0.4)",
          animation:"slideIn 0.3s ease", fontFamily:"'Segoe UI',sans-serif",
        }}>{toast}</div>
      )}

      {/* NAVBAR */}
      <div className="navbar">
        <div className="logoSection">
          <img src="/logo.png" alt="logo" className="logoImg" />
          <h2 className="siteName">IntraMap</h2>
          <span style={{
            marginLeft:8, padding:"2px 10px", borderRadius:6,
            background:"rgba(255,90,30,0.2)", border:"1px solid rgba(255,90,30,0.45)",
            fontSize:11, color:"#ff8c5a", fontWeight:700, letterSpacing:"1px",
          }}>ADMIN</span>
        </div>
        <div className="navLinks">
          <a href="#about">About</a>
          <button onClick={onLogout} style={{
            padding:"7px 18px", borderRadius:8,
            background:"rgba(255,90,30,0.15)", border:"1px solid rgba(255,90,30,0.35)",
            color:"#ff8c5a", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit",
          }}>Logout</button>
        </div>
      </div>

      {/* HERO */}
      <div className="hero" style={{ backgroundImage:`url(${process.env.PUBLIC_URL}/image.png)` }}>
        <div className="heroOverlay" />
        <div className="heroContent">
          <h1 className="welcomeText">👋 {displayText}</h1>
          <p className="heroSub">Admin Panel · Manage CC &amp; LHTC Rooms</p>

          <div style={{ position:"relative", width:450, maxWidth:"90%" }}>
            <div className="searchBox" style={{
              borderRadius: showDrop && suggestions.length > 0 ? "25px 25px 0 0" : "50px",
              transition:"border-radius 0.2s",
            }}>
              <input
                type="text"
                placeholder="🔍 Search any room (CC or LHTC)..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowDrop(true); }}
                onFocus={() => setShowDrop(true)}
                onBlur={() => setTimeout(() => setShowDrop(false), 160)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{ flex:1, border:"none", outline:"none", padding:"15px 20px",
                  fontSize:16, borderRadius:"50px 0 0 50px", color:"#333" }}
              />
              <button onClick={handleSearch}>Search</button>
            </div>

            {showDrop && suggestions.length > 0 && (
              <div style={{
                position:"absolute", top:"100%", left:0, right:0, zIndex:999,
                background:"#fff", borderRadius:"0 0 20px 20px",
                boxShadow:"0 16px 40px rgba(0,0,0,0.25)",
                overflow:"hidden", maxHeight:320, overflowY:"auto",
              }}>
                {suggestions.map((room, i) => (
                  <div key={`${room.buildingId}-${room.name}-${i}`} className="sugg-item"
                    onMouseDown={() => handleSelectRoom(room)}
                    style={{
                      padding:"14px 32px",
                      borderBottom: i < suggestions.length - 1 ? "1px solid #f0f0f0" : "none",
                      cursor:"pointer", background:"#fff",
                    }}
                  >
                    <div style={{ fontSize:17, fontWeight:500, color:"#4a5568", fontFamily:"'Segoe UI',sans-serif" }}>
                      {room.name}
                    </div>
                    <div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>
                      {room.floorLabel} · <span style={{ color:"#ff8c5a", fontWeight:700 }}>{room.buildingShort}</span>
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

      {/* DETAIL SECTION */}
      {selectedRoom && (
        <div ref={detailRef} style={{
          background:"linear-gradient(180deg,#0d1b2a 0%,#111827 100%)",
          padding:"70px 48px 60px", animation:"fadeUp 0.6s ease",
        }}>
          <div style={{ maxWidth:1160, margin:"0 auto" }}>

            {/* Room info card */}
            <div style={{
              textAlign:"center", padding:"40px 56px", borderRadius:24,
              background:"rgba(255,255,255,0.04)", border:"1.5px solid rgba(255,90,30,0.3)",
              boxShadow:"0 0 60px rgba(255,90,30,0.1)", maxWidth:560,
              margin:"0 auto 56px", animation:"fadeUp 0.5s ease",
            }}>
              {[
                ["Room Name", selectedRoom.name],
                ["Floor",     selectedRoom.floorLabel],
                ["Building",  selectedRoom.building],
              ].map(([label, val]) => (
                <div key={label} style={{ display:"flex", alignItems:"baseline", justifyContent:"center", gap:10, marginBottom:20 }}>
                  <span style={{ fontSize:22, fontWeight:600, color:"#ff8c5a", minWidth:140, textAlign:"right", fontFamily:"'Segoe UI',sans-serif" }}>{label}:</span>
                  <span style={{ fontSize:24, fontWeight:700, color:"#f1f5f9", fontFamily:"'Segoe UI',sans-serif" }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Building viewer — CC (image) or LHTC (image) */}
            <BuildingImageViewer
              building={BUILDINGS.find((b) => b.id === activeBuildingId)}
              selectedFloor={selectedFloor}
              onFloorClick={(floor) => handleFloorClick(floor, activeBuildingId)}
              hoveredFloor={hoveredFloor}
              setHoveredFloor={setHoveredFloor}
            />

            {/* Floor rooms + booking cards */}
            {selectedFloor && (
              <div ref={floorViewRef} style={{
                marginTop:28, borderRadius:20, overflow:"hidden",
                border:"1.5px solid rgba(255,90,30,0.28)",
                animation: animFloor ? "fadeUp 0.5s ease" : "none",
                opacity: animFloor ? 1 : 0, transition:"opacity 0.4s",
              }}>
                {/* Header */}
                <div style={{
                  padding:"16px 28px",
                  background:"linear-gradient(135deg,rgba(255,90,30,0.15),rgba(255,90,30,0.05))",
                  borderBottom:"1px solid rgba(255,90,30,0.18)",
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                }}>
                  <div>
                    <div style={{ fontSize:9, color:"#ff5a1e", fontWeight:700, letterSpacing:"3px", textTransform:"uppercase", marginBottom:3, fontFamily:"'Segoe UI',sans-serif" }}>
                      Room Details &amp; Booking
                    </div>
                    <div style={{ fontWeight:700, fontSize:18, color:"#f1f5f9", fontFamily:"'Segoe UI',sans-serif" }}>
                      {selectedFloor.label} · {activeBuildingId === "cc" ? "Computer Center and Library" : "Lecture Hall & Training Centre"}
                    </div>
                  </div>
                  <div style={{ padding:"5px 14px", borderRadius:7, background:"rgba(255,90,30,0.18)", border:"1px solid rgba(255,90,30,0.38)", fontSize:12, color:"#ff8c5a", fontWeight:600, fontFamily:"'Segoe UI',sans-serif" }}>
                    Floor {selectedFloor.short}
                  </div>
                </div>

                {/* Room cards */}
                <div style={{ background:"#111827", padding:"24px 28px", display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
                  {selectedFloor.rooms.map((room, idx) => {
                    const roomBookings = bookings[room.name] || [];
                    const nextBooking  = roomBookings[0];
                    return (
                      <div key={idx} className="admin-room-card" style={{
                        borderRadius:14, overflow:"hidden",
                        background: room.isBookable ? "rgba(255,90,30,0.07)" : "rgba(255,255,255,0.03)",
                        border: room.isBookable ? "1px solid rgba(255,90,30,0.3)" : "1px solid rgba(255,255,255,0.07)",
                      }}>
                        {/* Card header */}
                        <div style={{
                          padding:"14px 16px 10px",
                          background: room.isBookable
                            ? "linear-gradient(135deg,rgba(255,90,30,0.12),rgba(255,90,30,0.04))"
                            : "rgba(255,255,255,0.02)",
                          borderBottom:"1px solid rgba(255,255,255,0.05)",
                          display:"flex", alignItems:"flex-start", justifyContent:"space-between",
                        }}>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:14, fontWeight:700, color:"#f1f5f9", lineHeight:1.3, fontFamily:"'Segoe UI',sans-serif" }}>{room.name}</div>
                            <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:3, fontFamily:"'Segoe UI',sans-serif" }}>{selectedFloor.label}</div>
                          </div>
                          {room.isBookable && (
                            <span style={{
                              padding:"3px 9px", borderRadius:6, marginLeft:8, flexShrink:0,
                              background:"rgba(255,90,30,0.18)", border:"1px solid rgba(255,90,30,0.35)",
                              fontSize:10, color:"#ff8c5a", fontWeight:700, fontFamily:"'Segoe UI',sans-serif",
                            }}>
                              {activeBuildingId === "lhtc" ? "ROOM" : "LAB"}
                            </span>
                          )}
                        </div>

                        {/* Card body */}
                        <div style={{ padding:"12px 16px 14px" }}>
                          {room.isBookable ? (
                            <>
                              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                                <span style={{ fontSize:15 }}>👥</span>
                                <div>
                                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", fontFamily:"'Segoe UI',sans-serif", marginBottom:1 }}>Capacity</div>
                                  <div style={{ fontSize:15, fontWeight:700, color:"#ff8c5a", fontFamily:"'Segoe UI',sans-serif" }}>{room.capacity} people</div>
                                </div>
                              </div>

                              {nextBooking && (
                                <div style={{ padding:"7px 10px", borderRadius:8, marginBottom:10, background:"rgba(255,90,30,0.08)", border:"1px solid rgba(255,90,30,0.2)" }}>
                                  <div style={{ fontSize:9, color:"#ff5a1e", fontWeight:700, letterSpacing:"1px", marginBottom:2, fontFamily:"'Segoe UI',sans-serif" }}>NEXT BOOKING</div>
                                  <div style={{ fontSize:12, color:"#f1f5f9", fontWeight:600, fontFamily:"'Segoe UI',sans-serif" }}>
                                    {nextBooking.date} · {nextBooking.start_time} – {nextBooking.end_time}
                                  </div>
                                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:1, fontFamily:"'Segoe UI',sans-serif" }}>
                                    {nextBooking.booked_by} — {nextBooking.purpose}
                                  </div>
                                </div>
                              )}

                              <div style={{ display:"flex", gap:8 }}>
                                <button onClick={() => openBook(room, activeBuildingId, selectedFloor.label)} style={{
                                  flex:1, padding:"9px 0", borderRadius:8, cursor:"pointer",
                                  background:"linear-gradient(135deg,#c0392b,#e74c3c)",
                                  border:"none", color:"#fff", fontWeight:700, fontSize:13,
                                  fontFamily:"'Segoe UI',sans-serif",
                                  boxShadow:"0 3px 12px rgba(192,57,43,0.35)",
                                }}>📅 Book Room</button>

                                {roomBookings.length > 0 && (
                                  <button onClick={() => setViewRoom({ name: room.name, buildingId: activeBuildingId })} style={{
                                    padding:"9px 12px", borderRadius:8, cursor:"pointer",
                                    background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)",
                                    color:"rgba(255,255,255,0.6)", fontWeight:600, fontSize:12,
                                    fontFamily:"'Segoe UI',sans-serif",
                                  }}>
                                    {roomBookings.length} booking{roomBookings.length > 1 ? "s" : ""}
                                  </button>
                                )}
                              </div>
                            </>
                          ) : (
                            <div style={{ fontSize:12, color:"rgba(255,255,255,0.25)", fontStyle:"italic", fontFamily:"'Segoe UI',sans-serif" }}>
                              Faculty / Office room — booking not available
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Floor plan viewer */}
                <div style={{ borderTop:"1px solid rgba(255,90,30,0.15)", height:500 }}>
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

                {/* Footer */}
                <div style={{ padding:"10px 28px 12px", background:"rgba(255,90,30,0.04)", borderTop:"1px solid rgba(255,90,30,0.1)", fontSize:10, color:"rgba(255,255,255,0.18)", letterSpacing:"1.5px", fontFamily:"'Segoe UI',sans-serif", textAlign:"center" }}>
                  {selectedFloor.label.toUpperCase()} · {activeBuildingId === "cc" ? "COMPUTER CENTER AND LIBRARY" : "LECTURE HALL & TRAINING CENTRE"} · IIITDMJ CAMPUS
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABOUT */}
      <div className="about" id="about">
        <h2>About IntraMap</h2>
        <p className="aboutIntro">IntraMap helps students, faculty and visitors navigate the CC and LHTC buildings at IIITDMJ Campus.</p>
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

      {/* ── BOOK MODAL ── */}
      {modal && (
        <div style={{
          position:"fixed", inset:0, zIndex:1000,
          background:"rgba(0,0,0,0.7)", backdropFilter:"blur(4px)",
          display:"flex", alignItems:"center", justifyContent:"center", padding:24,
        }} onClick={() => setModal(null)}>
          <div style={{
            background:"#1a2535", borderRadius:20,
            border:"1px solid rgba(255,90,30,0.3)",
            padding:"32px 36px", width:"100%", maxWidth:440,
            boxShadow:"0 24px 80px rgba(0,0,0,0.6)",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize:11, color:"#ff5a1e", fontWeight:700, letterSpacing:"3px", textTransform:"uppercase", marginBottom:6, fontFamily:"'Segoe UI',sans-serif" }}>
              Book Room · <span style={{ color:"#ff8c5a" }}>{modal.buildingId.toUpperCase()}</span>
            </div>
            <div style={{ fontSize:20, fontWeight:800, color:"#f1f5f9", marginBottom:4, fontFamily:"'Segoe UI',sans-serif" }}>{modal.room.name}</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.3)", marginBottom:24, fontFamily:"'Segoe UI',sans-serif" }}>
              Capacity: {modal.room.capacity} people · {modal.floorLabel}
            </div>

            {[
              { label:"Date", key:"date", type:"date" },
            ].map(({ label, key, type }) => (
              <div key={key} style={{ marginBottom:16 }}>
                <label style={{ fontSize:12, color:"rgba(255,255,255,0.45)", fontWeight:600, display:"block", marginBottom:6, fontFamily:"'Segoe UI',sans-serif" }}>{label}</label>
                <input type={type} value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  style={{ width:"100%", padding:"10px 14px", borderRadius:8, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:"#f1f5f9", fontSize:14, outline:"none", fontFamily:"'Segoe UI',sans-serif", boxSizing:"border-box" }}
                />
              </div>
            ))}

            <div style={{ display:"flex", gap:12, marginBottom:16 }}>
              {[["Start Time","startTime"],["End Time","endTime"]].map(([label, key]) => (
                <div key={key} style={{ flex:1 }}>
                  <label style={{ fontSize:12, color:"rgba(255,255,255,0.45)", fontWeight:600, display:"block", marginBottom:6, fontFamily:"'Segoe UI',sans-serif" }}>{label}</label>
                  <input type="time" value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    style={{ width:"100%", padding:"10px 14px", borderRadius:8, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:"#f1f5f9", fontSize:14, outline:"none", fontFamily:"'Segoe UI',sans-serif", boxSizing:"border-box" }}
                  />
                </div>
              ))}
            </div>

            {[["Your Name","bookedBy","text","e.g. Prof. Sharma"],["Purpose","purpose","text","e.g. Mid-Sem Exam"]].map(([label, key, type, ph]) => (
              <div key={key} style={{ marginBottom:16 }}>
                <label style={{ fontSize:12, color:"rgba(255,255,255,0.45)", fontWeight:600, display:"block", marginBottom:6, fontFamily:"'Segoe UI',sans-serif" }}>{label}</label>
                <input type={type} placeholder={ph} value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  style={{ width:"100%", padding:"10px 14px", borderRadius:8, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:"#f1f5f9", fontSize:14, outline:"none", fontFamily:"'Segoe UI',sans-serif", boxSizing:"border-box" }}
                />
              </div>
            ))}

            {formErr && (
              <div style={{ padding:"10px 14px", borderRadius:8, marginBottom:16, background:"rgba(192,57,43,0.15)", border:"1px solid rgba(192,57,43,0.4)", fontSize:13, color:"#ff8c5a", fontFamily:"'Segoe UI',sans-serif" }}>{formErr}</div>
            )}

            <div style={{ display:"flex", gap:10, marginTop:8 }}>
              <button onClick={submitBooking} style={{ flex:1, padding:"11px 0", borderRadius:9, cursor:"pointer", background:"linear-gradient(135deg,#c0392b,#e74c3c)", border:"none", color:"#fff", fontWeight:700, fontSize:14, fontFamily:"'Segoe UI',sans-serif", boxShadow:"0 4px 16px rgba(192,57,43,0.4)" }}>Confirm Booking</button>
              <button onClick={() => setModal(null)} style={{ padding:"11px 20px", borderRadius:9, cursor:"pointer", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)", fontWeight:600, fontSize:14, fontFamily:"'Segoe UI',sans-serif" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW BOOKINGS MODAL ── */}
      {viewRoom && (
        <div style={{
          position:"fixed", inset:0, zIndex:1000,
          background:"rgba(0,0,0,0.7)", backdropFilter:"blur(4px)",
          display:"flex", alignItems:"center", justifyContent:"center", padding:24,
        }} onClick={() => setViewRoom(null)}>
          <div style={{
            background:"#1a2535", borderRadius:20,
            border:"1px solid rgba(255,90,30,0.3)",
            padding:"32px 36px", width:"100%", maxWidth:500,
            maxHeight:"80vh", overflowY:"auto",
            boxShadow:"0 24px 80px rgba(0,0,0,0.6)",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize:11, color:"#ff5a1e", fontWeight:700, letterSpacing:"3px", textTransform:"uppercase", marginBottom:6, fontFamily:"'Segoe UI',sans-serif" }}>All Bookings</div>
            <div style={{ fontSize:20, fontWeight:800, color:"#f1f5f9", marginBottom:4, fontFamily:"'Segoe UI',sans-serif" }}>{viewRoom.name}</div>
            <div style={{ fontSize:12, color:"#ff8c5a", marginBottom:20, fontFamily:"'Segoe UI',sans-serif" }}>{viewRoom.buildingId.toUpperCase()} Building</div>

            {(bookings[viewRoom.name] || []).length === 0 ? (
              <div style={{ color:"rgba(255,255,255,0.3)", fontSize:14, fontFamily:"'Segoe UI',sans-serif" }}>No bookings yet.</div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {(bookings[viewRoom.name] || []).map((b) => (
                  <div key={b.id} style={{
                    padding:"14px 16px", borderRadius:10,
                    background:"rgba(255,90,30,0.07)", border:"1px solid rgba(255,90,30,0.2)",
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                  }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:"#f1f5f9", fontFamily:"'Segoe UI',sans-serif" }}>{b.date} · {b.start_time} – {b.end_time}</div>
                      <div style={{ fontSize:12, color:"#ff8c5a", marginTop:2, fontFamily:"'Segoe UI',sans-serif" }}>{b.booked_by}</div>
                      <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:1, fontFamily:"'Segoe UI',sans-serif" }}>{b.purpose}</div>
                    </div>
                    <button onClick={() => cancelBooking(viewRoom.name, b.id, viewRoom.buildingId)} style={{
                      padding:"6px 12px", borderRadius:7, cursor:"pointer",
                      background:"rgba(192,57,43,0.15)", border:"1px solid rgba(192,57,43,0.35)",
                      color:"#ff8c5a", fontWeight:600, fontSize:12,
                      fontFamily:"'Segoe UI',sans-serif", marginLeft:12,
                    }}>Cancel</button>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => setViewRoom(null)} style={{ marginTop:24, width:"100%", padding:"10px 0", borderRadius:9, cursor:"pointer", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)", fontWeight:600, fontSize:14, fontFamily:"'Segoe UI',sans-serif" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Building image viewer (works for both CC and LHTC) ──────────────────────
function BuildingImageViewer({
  building,
  selectedFloor,
  onFloorClick,
  hoveredFloor,
  setHoveredFloor
}) {
  if (!building) return null;

  const isCC = building.id === "cc";
  const LHTC_FLOOR_HOVER_ZONES = {
  1: { top: "25%", h: "20%" },  // adjust based on image
  0: { top: "50%", h: "25%" },
};


  return (
    <div
      style={{
        display: "flex",
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* LEFT: IMAGE */}
      <div
        style={{
          flex: 1,
          height: 500,
          position: "relative",
          background: "#000",
        }}
        onMouseLeave={() => setHoveredFloor(null)}
      >
        <img
          src={building.image} // IMPORTANT
          alt={building.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            console.error("❌ Image not found:", e.target.src);
          }}
        />

        {/* CC HOVER ZONES */}
        {isCC &&
          building.floors.map((floor) => {
            const z = CC_FLOOR_HOVER_ZONES[floor.number];
            return (
              <div
                key={floor.number}
                onMouseEnter={() => setHoveredFloor(floor)}
                onClick={() => onFloorClick(floor)}
                style={{
                  position: "absolute",
                  top: z.top,
                  left: 0,
                  right: 0,
                  height: z.h,
                  cursor: "pointer",
                }}
              />
            );
          })}

        {/* LHTC FLOOR BUTTONS */}
        {/* LHTC HOVER ZONES */}
{!isCC &&
  building.floors.map((floor) => {
    const z = LHTC_FLOOR_HOVER_ZONES[floor.number];
    return (
      <div
        key={floor.number}
        onMouseEnter={() => setHoveredFloor(floor)}
        onClick={() => onFloorClick(floor)}
        style={{
          position: "absolute",
          top: z.top,
          left: 0,
          right: 0,
          height: z.h,
          cursor: "pointer",
        }}
      />
    );
  })}


        {/* TOOLTIP */}
        {hoveredFloor && (
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#ff5a1e",
              padding: "6px 12px",
              borderRadius: 6,
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            {hoveredFloor.label}
          </div>
        )}
      </div>

      {/* RIGHT: ROOMS PANEL */}
      <div
        style={{
          width: 260,
          background: "#111",
          color: "#fff",
          padding: 16,
          overflowY: "auto",
        }}
      >
        {(hoveredFloor || selectedFloor) ? (
          <>
            <h3>{(hoveredFloor || selectedFloor).label}</h3>
            {(hoveredFloor || selectedFloor).rooms.map((r, i) => (
              <div key={i} style={{ padding: "6px 0" }}>
                {r.name}
              </div>
            ))}
          </>
        ) : (
          <p>Hover a floor</p>
        )}
      </div>
    </div>
  );
}
