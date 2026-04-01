import { useState } from "react";
import LHTCLandingPage from "./LHTCLandingPage";

export default function LHTCBuildingPage({ onBack }) {
  const [entered, setEntered] = useState(false);

  if (entered) return <LHTCLandingPage onBack={() => setEntered(false)} />;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d1b2a 0%, #111827 60%, #1a2535 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes pulse  { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.08)} }
        .enter-btn:hover  { transform:scale(1.06) !important; box-shadow:0 0 40px rgba(255,90,30,0.5) !important; }
        .enter-btn        { transition: transform 0.22s, box-shadow 0.22s !important; }
        .back-btn:hover   { color: #ff8c5a !important; }
      `}</style>

      {/* Ambient blobs */}
      <div style={{ position:"absolute", top:"10%", left:"8%",  width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle, rgba(255,90,30,0.08) 0%, transparent 70%)", animation:"pulse 5s ease-in-out infinite" }}/>
      <div style={{ position:"absolute", bottom:"12%", right:"6%", width:260, height:260, borderRadius:"50%", background:"radial-gradient(circle, rgba(255,140,60,0.06) 0%, transparent 70%)", animation:"pulse 6s ease-in-out infinite 1.5s" }}/>

      {/* Back */}
      <button className="back-btn" onClick={onBack} style={{ position:"absolute", top:28, left:36, background:"none", border:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:14, fontFamily:"'Segoe UI',sans-serif", transition:"color 0.2s" }}>
        ← Back to Campus
      </button>

      {/* Card */}
      <div style={{ animation:"fadeUp 0.7s ease", textAlign:"center", padding:"60px 72px", borderRadius:28, background:"rgba(255,255,255,0.03)", border:"1.5px solid rgba(255,90,30,0.2)", boxShadow:"0 0 80px rgba(255,90,30,0.08)", maxWidth:520 }}>

        {/* Building Icon */}
        <div style={{ fontSize:72, marginBottom:24, animation:"float 4s ease-in-out infinite" }}>🏫</div>

        <div style={{ fontSize:10, color:"#ff5a1e", fontWeight:700, letterSpacing:"4px", textTransform:"uppercase", marginBottom:12 }}>IIITDMJ Campus</div>
        <h1 style={{ fontSize:36, fontWeight:800, color:"#f1f5f9", margin:"0 0 8px", letterSpacing:"-0.5px" }}>LHTC Building</h1>
        <p style={{ fontSize:15, color:"rgba(255,255,255,0.4)", margin:"0 0 32px", lineHeight:1.7 }}>
          Lecture Hall &amp; Training Centre<br/>2 Floors · 32 Rooms
        </p>

        {/* Stats row */}
        <div style={{ display:"flex", justifyContent:"center", gap:32, marginBottom:40 }}>
          {[["2","Floors"],["32","Rooms"],["12","Windows/Floor"]].map(([num, label]) => (
            <div key={label} style={{ textAlign:"center" }}>
              <div style={{ fontSize:28, fontWeight:800, color:"#ff8c5a" }}>{num}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:2 }}>{label}</div>
            </div>
          ))}
        </div>

        <button className="enter-btn" onClick={() => setEntered(true)} style={{
          padding:"16px 56px", borderRadius:50, border:"none", cursor:"pointer",
          background:"linear-gradient(135deg,#ff5a1e,#ff8c5a)",
          color:"#fff", fontSize:16, fontWeight:700, letterSpacing:"0.5px",
          boxShadow:"0 0 24px rgba(255,90,30,0.3)",
        }}>
          Enter Building →
        </button>

        <p style={{ fontSize:11, color:"rgba(255,255,255,0.18)", marginTop:20 }}>
          Click to explore rooms &amp; floor plans
        </p>
      </div>
    </div>
  );
}