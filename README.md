# 🗺️ IntraMap — Campus Room Navigation

> **Instantly find any room in the CC & LHTC buildings at IIITDMJ Campus.**

![IntraMap Banner](public/lhtc_hero.png)

---

## 📌 Overview

**IntraMap** is a smart, interactive campus navigation web app built for students, faculty, and visitors of **IIIT Jabalpur (IIITDMJ)**. It allows users to search for any room across the **Computer Center (CC)** and **Lecture Hall & Training Centre (LHTC)** buildings and instantly see its location, floor, and a 2D floor plan.

No more wandering around campus looking for a room — just search and go! 🚀

---

## ✨ Features

- 🔍 **Live Room Search** — Search any room name across both buildings with instant dropdown suggestions
- 🏢 **CC Building Viewer** — Hover over floors on the real building photo to highlight windows and see rooms
- 🏫 **LHTC Building SVG** — Interactive illustrated building with animated window highlights per floor
- 🗂️ **Room Panel** — Side panel listing all rooms on the hovered/selected floor
- 🗺️ **2D Floor Plan Viewer** — Click any floor to reveal a detailed floor plan layout
- ✨ **Smooth Animations** — Typewriter hero text, fade-up transitions, pulsing window highlights
- 📱 **Responsive Design** — Works on desktop and mobile browsers
- 🎨 **Dark Theme UI** — Sleek dark interface with orange accent colors

---

## 🏛️ Buildings Covered

### 🏢 Computer Center & Library (CC)
| Floor | Rooms Include |
|-------|--------------|
| 3rd Floor | Dr.DS, Dr.MKB, Dr.SKM, Computing Lab, PG LAB1, Research LAB1 … |
| 2nd Floor | Dr.AP, Dr.NA, IOT Lab, Tinkering Lab, Seminar Hall, Research LAB2 … |
| 1st Floor | Computer Lab2, Image & Visual Processing Lab … |
| Ground Floor | Library, Study Room, Computer Lab1, Servers Room … |

### 🏫 Lecture Hall & Training Centre (LHTC)
| Floor | Rooms Include |
|-------|--------------|
| 1st Floor | DR.NKJ Cabin, L202, DR.NKM, DR.YSK, Liberal Arts, CR202, L201 … |
| Ground Floor | CR110–CR101, L102–L107, Maths Lab, Design Studio, Green Room … |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React.js** | Frontend UI framework |
| **SVG** | Interactive LHTC building illustration |
| **CSS Animations** | Window pulse effects, fade transitions |
| **JavaScript (ES6+)** | Logic, state management |
| **CSS (App.css)** | Global styling and dark theme |

---

## 📁 Project Structure

```
my-app/
├── public/
│   ├── index.html
│   ├── logo.png              # IntraMap logo
│   ├── image.png             # Hero background image
│   ├── lhtc_hero.png         # LHTC hero image
│   └── building.png          # CC building photo
├── src/
│   ├── App.js                # App entry point
│   ├── App.css               # Global styles
│   ├── LandingPage.jsx       # Main merged landing page (CC + LHTC)
│   ├── FloorPlanRouter.jsx   # CC floor plan renderer
│   ├── LHTCFloorPlanRouter.jsx  # LHTC floor plan renderer
│   └── index.js
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or above)
- npm (comes with Node.js)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Pranayasheela/IntraMap.git
```

**2. Navigate into the project folder**
```bash
cd IntraMap/my-app
```

**3. Install dependencies**
```bash
npm install
```

**4. Start the development server**
```bash
npm start
```

**5. Open in browser**
```
http://localhost:3000
```

---

## 🖥️ Usage

1. **Search a room** — Type any room name (e.g. `Library`, `L202`, `CR101`) in the search bar
2. **Select from suggestions** — Click a result from the dropdown
3. **View room details** — See the room name, floor, and building in the detail card
4. **Explore the building** — Hover over floors on the building to see rooms in the side panel
5. **See the floor plan** — Click a floor on the building to load the 2D floor plan below

---

## 📸 Screenshots

| Hero Search | LHTC Building View | Floor Plan |
|-------------|-------------------|------------|
| Search any room across CC & LHTC | Interactive SVG with highlighted floors | Detailed 2D layout per floor |

---

## 🔮 Future Plans

- [ ] 3D building walkthroughs
- [ ] Turn-by-turn indoor navigation
- [ ] Add more campus buildings (Admin Block, Hostel, etc.)
- [ ] Mobile app version
- [ ] QR code room scanning
- [ ] Real-time room availability status

---

## 👨‍💻 Contributing

Contributions are welcome! Here's how:

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "Add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

- **IIIT Jabalpur** — for the campus and inspiration
- All students and faculty who helped map the rooms
- Built with ❤️ for the IIITDMJ community

---

<div align="center">

**© 2026 IntraMap | CC & LHTC · IIITDMJ Campus**

⭐ If you found this useful, please star the repo!

</div>
