import FloorPlanViewer  from './FloorPlanViewer';   // Ground Floor (0)
import FloorPlanViewer1 from './FloorPlanViewer1';  // 1st Floor    (1)
import FloorPlanViewer2 from './FloorPlanViewer2';  // 2nd Floor    (2)
import FloorPlanViewer3 from './FloorPlanViewer3';  // 3rd Floor    (3)

export default function FloorPlanRouter({ floorNumber, floorLabel }) {
  const label = floorLabel || 'Floor Plan';
  switch (floorNumber) {
    case 0:  return <FloorPlanViewer  floorLabel={label} />;
    case 1:  return <FloorPlanViewer1 floorLabel={label} />;
    case 2:  return <FloorPlanViewer2 floorLabel={label} />;
    case 3:  return <FloorPlanViewer3 floorLabel={label} />;
    default: return (
      <div style={{width:'100%',height:'100%',background:'#111827',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{fontSize:14,color:'rgba(255,255,255,0.25)',fontFamily:"'Segoe UI',sans-serif",textAlign:'center'}}>
          Floor plan not available<br/><span style={{color:'#ff5a1e',fontWeight:600}}>{label}</span>
        </div>
      </div>
    );
  }
}