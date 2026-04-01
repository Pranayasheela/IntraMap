import LHTCFloorPlanViewer1 from "./LHTCFloorPlanViewer1";

import LHTCFloorPlanViewer2 from "./LHTCFloorPlanViewer2";

export default function LHTCFloorPlanRouter({ floorNumber, floorLabel }) {
  switch (floorNumber) {
    case 1:
      return <LHTCFloorPlanViewer1 floorLabel={floorLabel} />;
    case 0:
       return <LHTCFloorPlanViewer2 floorLabel={floorLabel} />;
     default:
      return (
        <div style={{
          width:"100%", height:"100%", display:"flex", alignItems:"center",
          justifyContent:"center", background:"#0a0f1a",
          color:"rgba(255,255,255,0.2)", fontFamily:"'Segoe UI',sans-serif", fontSize:14,
        }}>
          Floor plan not available for floor {floorNumber}
        </div>
      );
  }
}