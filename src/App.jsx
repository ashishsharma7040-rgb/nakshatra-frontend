import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// THEME ENGINE  — auto-switches by local time
// ─────────────────────────────────────────────────────────────────────────────
function detectTheme() {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return "morning";
  if (h >= 12 && h < 17) return "day";
  if (h >= 17 && h < 20) return "evening";
  return "night";
}

const THEMES = {
  morning: {
    key: "morning",
    label: "🌅 Morning",
    dark: false,
    bg:      "#fffbf2",
    deep:    "#fff7e8",
    card:    "#fffef9",
    border:  "rgba(180,110,20,0.14)",
    gold:    "#b8720a",
    gold2:   "#d4900f",
    rose:    "#b54060",
    sky:     "#2e6ea6",
    text:    "#1e1005",
    muted:   "rgba(30,16,5,0.50)",
    glow:    "rgba(200,140,30,0.15)",
    bodyBg:  "linear-gradient(160deg,#fff8ec 0%,#fff3d8 55%,#ffecd0 100%)",
    scrollBg:"#fff7e8",
  },
  day: {
    key: "day",
    label: "☀️ Day",
    dark: false,
    bg:      "#f3efff",
    deep:    "#eceaff",
    card:    "#f9f8ff",
    border:  "rgba(90,50,170,0.13)",
    gold:    "#6630c0",
    gold2:   "#8850e0",
    rose:    "#b83878",
    sky:     "#2858a8",
    text:    "#160830",
    muted:   "rgba(22,8,48,0.50)",
    glow:    "rgba(120,70,200,0.12)",
    bodyBg:  "linear-gradient(160deg,#ede8ff 0%,#e6eeff 55%,#f0f8ff 100%)",
    scrollBg:"#eceaff",
  },
  evening: {
    key: "evening",
    label: "🌆 Evening",
    dark: true,
    bg:      "#160d22",
    deep:    "#100818",
    card:    "#1e1030",
    border:  "rgba(220,140,70,0.14)",
    gold:    "#e08840",
    gold2:   "#f0a858",
    rose:    "#d06088",
    sky:     "#6080c0",
    text:    "#f0e8d8",
    muted:   "rgba(240,232,216,0.50)",
    glow:    "rgba(220,140,70,0.14)",
    bodyBg:  "linear-gradient(160deg,#160d22 0%,#1c0e10 55%,#160c08 100%)",
    scrollBg:"#100818",
  },
  night: {
    key: "night",
    label: "🌙 Night",
    dark: true,
    bg:      "#09090f",
    deep:    "#0f0f1e",
    card:    "#16162a",
    border:  "rgba(255,255,255,0.07)",
    gold:    "#c9a96e",
    gold2:   "#e8cc9a",
    rose:    "#c97b9a",
    sky:     "#7ba8c9",
    text:    "#e8e4da",
    muted:   "rgba(232,228,218,0.45)",
    glow:    "rgba(201,169,110,0.18)",
    bodyBg:  "#09090f",
    scrollBg:"#0f0f1e",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const PLANET_SYMBOLS = {
  sun:"☉", moon:"☽", mercury:"☿", venus:"♀", mars:"♂",
  jupiter:"♃", saturn:"♄", rahu:"☊", ketu:"☋",
};
const SIGN_GLYPHS = {
  Aries:"♈",Taurus:"♉",Gemini:"♊",Cancer:"♋",Leo:"♌",Virgo:"♍",
  Libra:"♎",Scorpio:"♏",Sagittarius:"♐",Capricorn:"♑",Aquarius:"♒",Pisces:"♓",
};
const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo",
               "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];

const PLANS = [
  { id:"starter", name:"Seeker",  price:"₹99",  priceNum:99,  questions:5,   note:"Great for a quick reading", tag:null,         colorKey:"sky"  },
  { id:"popular", name:"Devotee", price:"₹299", priceNum:299, questions:20,  note:"Most popular choice",       tag:"POPULAR",    colorKey:"gold" },
  { id:"sage",    name:"Sage",    price:"₹999", priceNum:999, questions:"∞", note:"Unlimited for 30 days",     tag:"BEST VALUE", colorKey:"rose" },
];

const ASTRO_FACTS = [
  "A mere 4-minute difference in your birth time can change your planetary calculations and predictions entirely.",
  "Your Sun sign represents your soul, Moon sign your mind, and Rising sign your physical self and how others see you.",
  "Mercury goes retrograde 3–4 times a year — famous for causing miscommunications and tech glitches.",
  "The Moon changes its zodiac sign every 2.5 days, making it the fastest-moving celestial body in astrology.",
  "Vedic astrology (Jyotish) is the 'Science of Light' — it focuses heavily on the Moon and Nakshatras (lunar mansions).",
  "Jupiter is the planet of luck and expansion, taking 12 years to complete a full journey through all 12 zodiac signs.",
  "Saturn Return happens around age 29, marking a major period of life lessons and stepping into true adulthood.",
  "There are 27 Nakshatras in Vedic astrology, each offering deep insights into your personality and destiny.",
];

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const LS = {
  get:     k     => { try { return localStorage.getItem(k); }                    catch { return null; } },
  set:     (k,v) => { try { localStorage.setItem(k,v); }                         catch {} },
  getJ:    k     => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):null; } catch { return null; } },
  setJ:    (k,v) => { try { localStorage.setItem(k,JSON.stringify(v)); }         catch {} },
  remove:  k     => { try { localStorage.removeItem(k); }                        catch {} },
  clearAll:()    => {
    ["nakshatra_token","nakshatra_user","nakshatra_credits",
     "nakshatra_chart","nakshatra_dob","nakshatra_time","nakshatra_birthplace"]
    .forEach(k => { try { localStorage.removeItem(k); } catch {} });
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// API
// ─────────────────────────────────────────────────────────────────────────────
const API_URL = () => process.env.REACT_APP_API_URL || "https://nakshatra-backend-a7co.onrender.com";

async function apiFetch(path, opts = {}) {
  const token = LS.get("nakshatra_token");
  const headers = { "Content-Type": "application/json", ...(opts.headers||{}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL()}${path}`, { ...opts, headers });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

// ─────────────────────────────────────────────────────────────────────────────
// DATE HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const todayStr  = () => new Date().toISOString().slice(0,10);
const nowDTStr  = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}T${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
};
const minDOB    = () => { const d=new Date(); d.setFullYear(d.getFullYear()-120); return d.toISOString().slice(0,10); };

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL STYLES  — reactive to theme
// ─────────────────────────────────────────────────────────────────────────────
const GlobalStyles = ({ T }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

    :root {
      --bg:     ${T.bg};
      --deep:   ${T.deep};
      --card:   ${T.card};
      --border: ${T.border};
      --gold:   ${T.gold};
      --gold2:  ${T.gold2};
      --rose:   ${T.rose};
      --sky:    ${T.sky};
      --glow:   ${T.glow};
      --text:   ${T.text};
      --muted:  ${T.muted};
      --radius: 16px;
    }

    body {
      background: ${T.bodyBg};
      color: var(--text);
      font-family: 'Jost', sans-serif;
      transition: background 1s ease, color 0.4s ease;
      min-height: 100vh;
    }

    .cinzel     { font-family: 'Cinzel Decorative', serif; }
    .cormorant  { font-family: 'Cormorant Garamond', serif; }

    ::-webkit-scrollbar       { width:4px; }
    ::-webkit-scrollbar-track { background: ${T.scrollBg}; }
    ::-webkit-scrollbar-thumb { background: var(--gold); border-radius:2px; }

    @keyframes twinkle   { 0%,100%{opacity:0.2;transform:scale(1)}  50%{opacity:1;transform:scale(1.5)} }
    @keyframes fadeUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes shimmer   { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
    @keyframes spin      { to{transform:rotate(360deg)} }
    @keyframes float     { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-7px)} }
    @keyframes messageIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes dotPulse  { 0%,80%,100%{transform:scale(0);opacity:0.3} 40%{transform:scale(1);opacity:1} }
    @keyframes sunRise   { from{opacity:0;transform:translateY(30px) scale(0.85)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes factFade  { 0%{opacity:0;transform:translateY(6px)} 15%,85%{opacity:1;transform:translateY(0)} 100%{opacity:0} }

    .fade-up  { animation: fadeUp 0.55s ease forwards; }
    .float    { animation: float 4s ease-in-out infinite; }

    .glass {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      backdrop-filter: blur(12px);
      transition: background 0.5s, border-color 0.5s;
    }
    .divider {
      height:1px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
      opacity:0.35;
      margin: 20px 0;
    }

    /* ── Inputs ── */
    .input-label {
      display:block; font-size:11px; letter-spacing:0.12em; text-transform:uppercase;
      color:var(--gold); margin-bottom:7px; font-family:'Jost',sans-serif; font-weight:500;
    }
    .input-field {
      width:100%;
      background: ${T.dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"};
      border: 1px solid ${T.dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.12)"};
      border-radius:10px; padding:13px 16px;
      color:var(--text); font-family:'Jost',sans-serif; font-size:15px; font-weight:300;
      outline:none; transition:border-color 0.2s, box-shadow 0.2s, background 0.5s;
    }
    .input-field:focus {
      border-color:var(--gold);
      box-shadow: 0 0 0 3px var(--glow);
    }
    .input-field::placeholder { color:var(--muted); }
    .input-field[type="date"],
    .input-field[type="time"]  { color-scheme: ${T.dark ? "dark" : "light"}; }
    .input-field[type="date"]::-webkit-calendar-picker-indicator,
    .input-field[type="time"]::-webkit-calendar-picker-indicator {
      filter: ${T.dark ? "invert(0.7) sepia(1) saturate(2) hue-rotate(10deg)" : "none"};
      cursor:pointer;
    }

    /* ── Buttons ── */
    .btn-gold {
      width:100%; padding:15px;
      background: linear-gradient(135deg, ${T.dark ? "#b8924a,#c9a96e,#e8cc9a,#c9a96e" : "#9a5c00,#c07a10,#d49020,#c07a10"});
      background-size:300% 300%;
      border:none; border-radius:12px;
      color: ${T.dark ? "#09090f" : "#fff"};
      font-family:'Cinzel Decorative',serif; font-size:13px; font-weight:700; letter-spacing:0.08em;
      cursor:pointer; transition:transform 0.2s, box-shadow 0.2s;
      animation: shimmer 3s linear infinite;
    }
    .btn-gold:hover:not(:disabled) {
      transform:translateY(-2px);
      box-shadow: 0 8px 24px rgba(180,120,20,0.35);
    }
    .btn-gold:disabled { opacity:0.45; cursor:not-allowed; }

    .btn-ghost {
      background:transparent;
      border:1px solid var(--border); border-radius:10px;
      color:var(--muted); font-family:'Jost',sans-serif; font-size:13px;
      padding:10px 20px; cursor:pointer; transition:all 0.2s; width:100%;
    }
    .btn-ghost:hover { border-color:var(--gold); color:var(--gold); }

    /* ── Chat bubbles ── */
    .bubble-ai {
      background:var(--card); border:1px solid var(--border);
      border-radius:4px 16px 16px 16px; padding:14px 18px; max-width:82%;
      font-family:'Cormorant Garamond',serif; font-size:16px; line-height:1.65; font-weight:300;
      animation: messageIn 0.35s ease forwards;
    }
    .bubble-user {
      background: linear-gradient(135deg, rgba(201,169,110,0.15), rgba(201,169,110,0.06));
      border:1px solid rgba(201,169,110,0.22);
      border-radius:16px 4px 16px 16px; padding:12px 18px; max-width:75%;
      font-size:14px; align-self:flex-end;
      animation: messageIn 0.35s ease forwards;
    }

    /* ── Nav ── */
    .nav-tab {
      display:flex; flex-direction:column; align-items:center; gap:3px;
      padding:8px 12px; cursor:pointer; border:none; background:none;
      color:var(--muted); font-family:'Jost',sans-serif;
      font-size:9px; letter-spacing:0.07em; text-transform:uppercase; transition:color 0.2s;
    }
    .nav-tab.active { color:var(--gold); }
    .nav-tab svg { width:20px; height:20px; }

    /* ── Misc ── */
    .credit-badge {
      display:inline-flex; align-items:center; gap:6px;
      background: ${T.dark ? "rgba(201,169,110,0.10)" : "rgba(150,90,0,0.08)"};
      border: 1px solid ${T.dark ? "rgba(201,169,110,0.25)" : "rgba(150,90,0,0.20)"};
      border-radius:100px; padding:5px 12px;
      font-size:12px; color:var(--gold2); font-family:'Jost',sans-serif;
    }
    .scroll-area {
      overflow-y:auto; scrollbar-width:thin;
      scrollbar-color: var(--gold) ${T.scrollBg};
    }
    .plan-card {
      border:1px solid var(--border); border-radius:var(--radius);
      padding:20px; cursor:pointer; transition:all 0.25s;
      position:relative; overflow:hidden; background:var(--card);
    }
    .plan-card:hover   { border-color:var(--gold); transform:translateY(-2px); }
    .plan-card.selected{ border-color:var(--gold); background: ${T.dark ? "rgba(201,169,110,0.07)" : "rgba(160,100,0,0.05)"}; }
    .plan-badge {
      position:absolute; top:12px; right:12px;
      background:var(--gold); color:${T.dark ? "#09090f" : "#fff"};
      font-size:9px; font-weight:700; letter-spacing:0.10em; text-transform:uppercase;
      padding:3px 8px; border-radius:100px;
    }
    .dot { width:6px; height:6px; border-radius:50%; background:var(--gold); display:inline-block; animation:dotPulse 1.4s ease-in-out infinite; }
    .dot:nth-child(2){animation-delay:0.2s}
    .dot:nth-child(3){animation-delay:0.4s}

    /* ── Kundli ── */
    .kundli-wrap {
      display:grid; grid-template-columns:repeat(4,1fr); grid-template-rows:repeat(4,1fr);
      gap:1px; background:var(--gold);
      border:2px solid var(--gold); border-radius:6px;
      aspect-ratio:1/1; width:100%; max-width:360px; margin:0 auto;
    }
    .k-cell {
      background:var(--card); display:flex; flex-direction:column;
      align-items:center; justify-content:center;
      padding:3px; min-height:52px; position:relative;
    }
    .k-cell .hn { position:absolute; top:2px; left:4px; font-size:7px; color:var(--gold); opacity:0.6; }
    .k-cell .sg { font-size:13px; color:var(--gold); line-height:1; }
    .k-cell .sn { font-size:7px; color:var(--muted); margin-top:1px; }
    .k-cell .pl { font-size:9px; color:var(--text); margin-top:2px; text-align:center; line-height:1.4; }
    .k-center   { background:var(--deep) !important; }

    /* ── Error box ── */
    .err-box {
      background:rgba(220,80,80,0.10); border:1px solid rgba(220,80,80,0.30);
      border-radius:10px; padding:12px 16px; font-size:13px;
      color:#e07070; line-height:1.5; margin-bottom:14px;
    }
    .ok-box {
      background:rgba(60,180,80,0.10); border:1px solid rgba(60,180,80,0.30);
      border-radius:10px; padding:12px 16px; font-size:13px;
      color:#50b868; line-height:1.5; margin-bottom:14px;
    }
  `}</style>
);

// ─────────────────────────────────────────────────────────────────────────────
// BACKGROUND LAYER
// ─────────────────────────────────────────────────────────────────────────────
function BgLayer({ T }) {
  const stars = Array.from({ length: T.dark ? 90 : 18 }, (_, i) => ({
    id: i,
    left: `${(Math.sin(i*7.3)*50+50).toFixed(1)}%`,
    top:  `${(Math.cos(i*4.1)*50+50).toFixed(1)}%`,
    size: T.dark ? 0.5+((i*3)%2.5) : 3+((i*2)%5),
    delay: `${(i*0.27)%5}s`,
    dur:   `${2+((i*0.31)%3)}s`,
    opacity: T.dark ? 0.6 : 0.15,
    color: T.dark ? "#fff" : T.gold,
  }));

  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position:"absolute", borderRadius:"50%",
          left:s.left, top:s.top,
          width:s.size, height:s.size,
          background:s.color, opacity:s.opacity,
          animation:`twinkle ${s.dur} ${s.delay} ease-in-out infinite`,
        }} />
      ))}
      {/* ambient glow blobs */}
      <div style={{ position:"absolute", top:"10%", right:"5%", width:360, height:360, borderRadius:"50%", background:`radial-gradient(circle, ${T.glow} 0%, transparent 70%)`, filter:"blur(50px)" }} />
      <div style={{ position:"absolute", bottom:"15%", left:"0%", width:300, height:300, borderRadius:"50%", background:`radial-gradient(circle, ${T.glow} 0%, transparent 70%)`, filter:"blur(60px)", opacity:0.6 }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ASTRO FACT TICKER
// ─────────────────────────────────────────────────────────────────────────────
function AstroFact({ T }) {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * ASTRO_FACTS.length));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % ASTRO_FACTS.length);
        setVisible(true);
      }, 400);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ margin:"16px 0", padding:"14px 18px", borderRadius:12,
      background: T.dark ? "rgba(201,169,110,0.06)" : "rgba(160,100,0,0.05)",
      border: `1px solid ${T.dark ? "rgba(201,169,110,0.18)" : "rgba(160,100,0,0.14)"}`,
      transition:"opacity 0.4s", opacity:visible?1:0 }}>
      <div style={{ fontSize:10, color:"var(--gold)", letterSpacing:"0.10em", textTransform:"uppercase", marginBottom:7 }}>✦ Did You Know?</div>
      <p className="cormorant" style={{ fontSize:15, color:"var(--muted)", lineHeight:1.65, fontStyle:"italic" }}>
        {ASTRO_FACTS[idx]}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NORTH INDIAN KUNDLI CHART
// House order in NI style (grid 4×4, centre 2×2 is logo):
//  House:  2  1  12  11
//          3  ──  ── 10
//          4  ──  ──  9
//          5   6   7  8
// ─────────────────────────────────────────────────────────────────────────────
const NI_LAYOUT = [
  // [gridRow, gridCol, houseNumber]  (1-indexed)
  {r:1,c:1,h:2},{r:1,c:2,h:1},{r:1,c:3,h:12},{r:1,c:4,h:11},
  {r:2,c:1,h:3},                               {r:2,c:4,h:10},
  {r:3,c:1,h:4},                               {r:3,c:4,h:9},
  {r:4,c:1,h:5},{r:4,c:2,h:6},{r:4,c:3,h:7}, {r:4,c:4,h:8},
];

function KundliChart({ chart, T }) {
  const { ascendant = {}, planets = {} } = chart || {};
  const ascIdx = ascendant.signIndex ?? (SIGNS.indexOf(ascendant.sign) >= 0 ? SIGNS.indexOf(ascendant.sign) : 0);

  const houseSign  = h => SIGNS[(ascIdx + h - 1) % 12];
  const housePlanets = h => Object.entries(planets)
    .filter(([, d]) => d.house === h)
    .map(([n]) => PLANET_SYMBOLS[n] || n.slice(0,2));

  // Build 4×4 grid: 16 cells, centre 2×2 = logo
  const cells = [];
  for (let r = 1; r <= 4; r++) {
    for (let c = 1; c <= 4; c++) {
      const isCenter = (r === 2 || r === 3) && (c === 2 || c === 3);
      if (isCenter) { cells.push({ r, c, center: true, skip: !(r===2&&c===2) }); continue; }
      const layout = NI_LAYOUT.find(l => l.r === r && l.c === c);
      cells.push({ r, c, house: layout?.h });
    }
  }

  return (
    <div style={{ padding:"0 16px 20px" }}>
      <div style={{ fontSize:10, color:"var(--gold)", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:12, textAlign:"center" }}>
        North Indian Style · Lahiri Ayanamsa · Whole Sign Houses
      </div>
      <div className="kundli-wrap">
        {cells.map(({ r, c, center, skip, house }) => {
          if (skip) return null;
          if (center) return (
            <div key={`${r}${c}`} className="k-cell k-center"
              style={{ gridRow:"2/4", gridColumn:"2/4", flexDirection:"column", gap:4 }}>
              <div style={{ fontSize:22, color:"var(--gold)" }}>✦</div>
              <div className="cinzel" style={{ fontSize:7, color:"var(--gold)", textAlign:"center", lineHeight:1.5 }}>Nakshatra<br/>AI</div>
            </div>
          );
          const sign = houseSign(house);
          const pls  = housePlanets(house);
          return (
            <div key={`${r}${c}`} className="k-cell">
              <span className="hn">{house}</span>
              <span className="sg">{SIGN_GLYPHS[sign] || ""}</span>
              <span className="sn">{sign?.slice(0,3)}</span>
              {pls.length > 0 && <span className="pl">{pls.join(" ")}</span>}
            </div>
          );
        })}
      </div>

      {/* Planet legend */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:"6px 12px", marginTop:14, justifyContent:"center" }}>
        {Object.entries(PLANET_SYMBOLS).map(([n, s]) => (
          <span key={n} style={{ fontSize:10, color:"var(--muted)", display:"flex", alignItems:"center", gap:3 }}>
            <span style={{ color:"var(--gold)" }}>{s}</span>
            {n.charAt(0).toUpperCase() + n.slice(1)}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG ICONS
// ─────────────────────────────────────────────────────────────────────────────
const I = {
  home:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M3 10L12 3l9 7v10a1 1 0 01-1 1H4a1 1 0 01-1-1V10z"/><path d="M9 21V12h6v9"/></svg>,
  chart:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><circle cx="12" cy="12" r="9"/><path d="M12 3v9l5 3"/><path d="M3.6 15h16.8M4.9 9h14.2"/></svg>,
  chat:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  wallet: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><rect x="2" y="5" width="20" height="15" rx="2"/><path d="M2 10h20M15 15h2"/></svg>,
  send:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>,
  check:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M5 13l4 4L19 7"/></svg>,
  back:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M11 6l-6 6 6 6"/></svg>,
  logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
};

// ─────────────────────────────────────────────────────────────────────────────
// SPLASH SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function SplashScreen({ onRegister, onLogin, T }) {
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", padding:"32px 24px", textAlign:"center", position:"relative", zIndex:1 }}>

      <div className="float" style={{ marginBottom:36 }}>
        <div style={{ width:96, height:96, borderRadius:"50%", margin:"0 auto 20px",
          background:`radial-gradient(circle at 35% 35%, ${T.gold2}, ${T.gold}, ${T.dark?"#9a6830":"#8a5200"})`,
          boxShadow:`0 0 60px ${T.gold}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:42 }}>
          ✦
        </div>
        <h1 className="cinzel" style={{ fontSize:28, color:"var(--gold)", letterSpacing:"0.05em", lineHeight:1.3, marginBottom:6 }}>
          Nakshatra<br/><span style={{ fontSize:17, fontWeight:400 }}>AI Jyotish</span>
        </h1>
        <div style={{ fontSize:10, color:"var(--muted)", letterSpacing:"0.14em", textTransform:"uppercase", marginTop:8 }}>{T.label} Mode</div>
      </div>

      <p className="cormorant" style={{ fontSize:20, color:"var(--muted)", lineHeight:1.75, maxWidth:300, marginBottom:28, fontStyle:"italic" }}>
        Ancient wisdom decoded by AI.<br/>Your cosmic blueprint awaits.
      </p>

      <div style={{ display:"flex", gap:28, marginBottom:32, justifyContent:"center" }}>
        {[["♈","Vedic Charts"],["☽","AI Insights"],["✦","Daily Guidance"]].map(([sym,lab]) => (
          <div key={lab} style={{ textAlign:"center" }}>
            <div style={{ fontSize:26, color:"var(--gold)", marginBottom:5 }}>{sym}</div>
            <div style={{ fontSize:10, color:"var(--muted)", letterSpacing:"0.08em", textTransform:"uppercase" }}>{lab}</div>
          </div>
        ))}
      </div>

      <AstroFact T={T} />

      <button className="btn-gold" style={{ maxWidth:300, marginBottom:12 }} onClick={onRegister}>
        Begin Your Journey ✦
      </button>
      <button className="btn-ghost" style={{ maxWidth:300 }} onClick={onLogin}>
        Already have an account? Sign In →
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function LoginScreen({ onDone, onNewUser, T }) {
  const [email, setEmail]       = useState("");
  const [pass,  setPass]        = useState("");
  const [err,   setErr]         = useState("");
  const [loading, setLoading]   = useState(false);

  const submit = async () => {
    setErr("");
    if (!email.trim() || !pass) { setErr("Please enter your email and password."); return; }
    setLoading(true);
    const { ok, data } = await apiFetch("/api/auth/login", { method:"POST", body:JSON.stringify({ email:email.trim(), password:pass }) });
    if (!ok) { setErr(data.error || "Login failed."); setLoading(false); return; }
    LS.set("nakshatra_token", data.token);
    LS.setJ("nakshatra_user", data.user);
    LS.set("nakshatra_credits", String(data.credits ?? 5));
    // Try to load chart
    const cr = await apiFetch("/api/chart/me");
    if (cr.ok) {
      const ch = cr.data?.chart?.chart_data || cr.data?.chart;
      if (ch) {
        LS.setJ("nakshatra_chart", ch);
        if (cr.data.chart?.dob)         LS.set("nakshatra_dob",        cr.data.chart.dob);
        if (cr.data.chart?.birth_time)  LS.set("nakshatra_time",       cr.data.chart.birth_time);
        if (cr.data.chart?.birth_place) LS.set("nakshatra_birthplace", cr.data.chart.birth_place);
      }
    }
    setLoading(false);
    onDone();
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", padding:"24px", position:"relative", zIndex:1 }}>
      <div style={{ width:"100%", maxWidth:400 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:40, marginBottom:10 }}>✦</div>
          <h2 className="cinzel" style={{ fontSize:22, color:"var(--gold)", marginBottom:6 }}>Welcome Back</h2>
          <p className="cormorant" style={{ fontSize:16, color:"var(--muted)", fontStyle:"italic" }}>Sign in to your cosmic profile</p>
        </div>

        {err && <div className="err-box">⚠ {err}</div>}

        <div className="glass" style={{ padding:24, marginBottom:14 }}>
          <div style={{ marginBottom:14 }}>
            <label className="input-label">Email Address</label>
            <input className="input-field" type="email" placeholder="your@email.com"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="input-label">Password</label>
            <input className="input-field" type="password" placeholder="Your password"
              value={pass} onChange={e => setPass(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
        </div>

        <button className="btn-gold" onClick={submit} disabled={loading} style={{ marginBottom:12 }}>
          {loading ? "⟳ Signing In…" : "✦ Sign In"}
        </button>
        <button className="btn-ghost" onClick={onNewUser}>New here? Create account →</button>

        <AstroFact T={T} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER + BIRTH DETAILS  (with OTP email verification)
// ─────────────────────────────────────────────────────────────────────────────
function RegisterScreen({ onDone, onLogin, T }) {
  const [form, setForm]    = useState({ name:"", email:"", password:"", dob:"", time:"", place:"" });
  const [phase,    setPhase]   = useState("form");
  const [progress, setProgress]= useState(0);
  const [status,   setStatus]  = useState("");
  const [err,      setErr]     = useState("");

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // ── Validation ──
  const validate = () => {
    if (!form.name.trim())           return "Full name is required.";
    if (!form.email.trim() || !form.email.includes("@")) return "Valid email is required.";
    if (form.password.length < 6)    return "Password must be at least 6 characters.";
    if (!form.dob)                   return "Date of birth is required.";
    if (!form.time)                  return "Time of birth is required.";
    if (!form.place.trim())          return "Place of birth is required.";
    const dt = new Date(`${form.dob}T${form.time}`);
    if (dt >= new Date())            return "Date and time of birth cannot be in the future.";
    const age = (Date.now() - new Date(form.dob)) / (365.25*24*3600*1000);
    if (age > 120)                   return "Date of birth cannot be more than 120 years ago.";
    return null;
  };

  // ── Submit chart generation ──
  const submit = async () => {
    const e = validate();
    if (e) { setErr(e); return; }
    setErr(""); setPhase("loading"); setProgress(10);

    // 1. Register
    setStatus("Creating your account…"); setProgress(20);
    let token, user;
    const reg = await apiFetch("/api/auth/register", {
      method:"POST", body:JSON.stringify({ name:form.name.trim(), email:form.email.trim(), password:form.password })
    });
    if (reg.ok) {
      token = reg.data.token; user = reg.data.user;
    } else if (reg.status === 409) {
      // Account exists — try login
      const log = await apiFetch("/api/auth/login", {
        method:"POST", body:JSON.stringify({ email:form.email.trim(), password:form.password })
      });
      if (!log.ok) { setErr(log.data.error || "Login failed."); setPhase("form"); return; }
      token = log.data.token; user = log.data.user;
    } else {
      setErr(reg.data.error || reg.data.errors?.[0]?.msg || "Registration failed.");
      setPhase("form"); return;
    }

    LS.set("nakshatra_token", token);
    LS.setJ("nakshatra_user", user);
    LS.set("nakshatra_dob",        form.dob);
    LS.set("nakshatra_time",       form.time);
    LS.set("nakshatra_birthplace", form.place.trim());
    setProgress(40);

    // 2. Generate chart
    setStatus("Locating birth coordinates…"); setProgress(50);
    // Override token for this call since apiFetch reads from LS
    const ch = await apiFetch("/api/chart/generate", {
      method:"POST",
      body:JSON.stringify({ dob:form.dob, time:form.time, location:form.place.trim() })
    });
    if (!ch.ok) {
      setErr(ch.data.error || ch.data.errors?.[0]?.msg || "Chart generation failed. Check your birth details.");
      setPhase("form"); return;
    }
    setProgress(75);
    setStatus("Mapping Nakshatras and Dashas…");
    LS.setJ("nakshatra_chart", ch.data.chart);
    if (ch.data.birthPlace)        LS.set("nakshatra_birthplace", ch.data.birthPlace);
    if (typeof ch.data.credits === "number") LS.set("nakshatra_credits", String(ch.data.credits));
    else LS.set("nakshatra_credits", "5");

    setProgress(95);
    setStatus("Your chart is ready ✦");
    await new Promise(r => setTimeout(r, 500));
    setProgress(100);
    await new Promise(r => setTimeout(r, 300));
    onDone();
  };

  // ── Loading phase ──
  if (phase === "loading") return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", padding:32, position:"relative", zIndex:1 }}>
      <div style={{ textAlign:"center", maxWidth:320, width:"100%" }}>
        <div style={{ width:72, height:72, borderRadius:"50%",
          border:`2px solid var(--gold)`, borderTopColor:"transparent",
          margin:"0 auto 28px", animation:"spin 1.1s linear infinite" }} />
        <h2 className="cinzel" style={{ fontSize:16, color:"var(--gold)", marginBottom:10 }}>Reading the Stars</h2>
        <p className="cormorant" style={{ fontSize:17, color:"var(--muted)", marginBottom:24, fontStyle:"italic" }}>{status}</p>
        <div style={{ height:3, background:"rgba(128,128,128,0.2)", borderRadius:2, overflow:"hidden", marginBottom:20 }}>
          <div style={{ height:"100%", width:`${progress}%`,
            background:`linear-gradient(90deg, var(--gold), var(--gold2))`,
            borderRadius:2, transition:"width 0.4s ease" }} />
        </div>
        <AstroFact T={T} />
      </div>
    </div>
  );

  const canSubmit = form.name && form.email && form.password.length >= 6 && form.dob && form.time && form.place;

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", position:"relative", zIndex:1 }}>
      <div style={{ padding:"48px 24px 12px", textAlign:"center" }}>
        <div style={{ fontSize:10, color:"var(--gold)", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:10 }}>Your Cosmic Profile</div>
        <h2 className="cinzel" style={{ fontSize:20, color:"var(--gold)", lineHeight:1.4 }}>Enter Birth Details</h2>
        <p className="cormorant" style={{ fontSize:15, color:"var(--muted)", marginTop:6, fontStyle:"italic" }}>Precise time & place = accurate chart</p>
      </div>

      <div style={{ flex:1, padding:"0 20px 40px", maxWidth:440, margin:"0 auto", width:"100%" }}>
        {err  && <div className="err-box">⚠ {err}</div>}
        {note && !err && <div className="ok-box">{note}</div>}

        <div className="glass" style={{ padding:22, marginBottom:16 }}>

          {/* Name */}
          <div style={{ marginBottom:14 }}>
            <label className="input-label">Full Name *</label>
            <input className="input-field" placeholder="e.g. Ashish Sharma"
              value={form.name} onChange={e => f("name", e.target.value)} />
          </div>

          {/* Email */}
          <div style={{ marginBottom:14 }}>
            <label className="input-label">Email Address *</label>
            <input className="input-field" type="email" placeholder="your@email.com"
              value={form.email} onChange={e => f("email", e.target.value)} />
          </div>

          {/* Password */}
          <div style={{ marginBottom:14 }}>
            <label className="input-label">Password * <span style={{ color:"var(--muted)", fontSize:10, textTransform:"none", letterSpacing:0 }}>(min 6 chars — save this!)</span></label>
            <input className="input-field" type="password" placeholder="Create a strong password"
              value={form.password} onChange={e => f("password", e.target.value)} />
          </div>

          {/* DOB */}
          <div style={{ marginBottom:14 }}>
            <label className="input-label">Date of Birth * <span style={{ color:"var(--muted)", fontSize:10, textTransform:"none", letterSpacing:0 }}>(not future)</span></label>
            <input className="input-field" type="date"
              min={minDOB()} max={todayStr()}
              value={form.dob}
              onChange={e => {
                const v = e.target.value;
                if (v > todayStr()) { setErr("Date of birth cannot be in the future."); return; }
                setErr(""); f("dob", v);
              }} />
          </div>

          {/* Time */}
          <div style={{ marginBottom:14 }}>
            <label className="input-label">Time of Birth * <span style={{ color:"var(--muted)", fontSize:10, textTransform:"none", letterSpacing:0 }}>(as accurate as possible)</span></label>
            <input className="input-field" type="time" value={form.time}
              onChange={e => {
                const t = e.target.value;
                if (form.dob === todayStr()) {
                  const nowTime = `${String(new Date().getHours()).padStart(2,"0")}:${String(new Date().getMinutes()).padStart(2,"0")}`;
                  if (t > nowTime) { setErr("Birth time cannot be in the future."); return; }
                }
                setErr(""); f("time", t);
              }} />
          </div>

          {/* Place */}
          <div>
            <label className="input-label">Place of Birth *</label>
            <input className="input-field" placeholder="e.g. Mumbai, Maharashtra, India"
              value={form.place} onChange={e => f("place", e.target.value)} />
            <div style={{ fontSize:11, color:"var(--muted)", marginTop:6 }}>Include city, state and country for highest accuracy</div>
          </div>
        </div>

        <div className="divider" />
        <AstroFact T={T} />

        {/* Submit */}
        <button className="btn-gold" onClick={submit}
          disabled={!canSubmit}
          style={{ opacity:!canSubmit ? 0.45 : 1, marginBottom:12 }}>
          ✦ Generate My Birth Chart
        </button>
        <button className="btn-ghost" style={{ marginTop:8 }} onClick={onLogin}>
          Already have an account? Sign In →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHART SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function ChartScreen({ onAskAI, T }) {
  const [tab,     setTab]     = useState("kundli");
  const [chart,   setChart]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [err,     setErr]     = useState("");

  const userName   = LS.getJ("nakshatra_user")?.name || LS.get("nakshatra_user_name") || "Seeker";
  const dob        = LS.get("nakshatra_dob")        || "";
  const time       = LS.get("nakshatra_time")        || "";
  const birthPlace = LS.get("nakshatra_birthplace")  || "";

  useEffect(() => {
    const cached = LS.getJ("nakshatra_chart");
    if (cached) { setChart(cached); setLoading(false); return; }
    apiFetch("/api/chart/me").then(({ ok, data }) => {
      if (ok) {
        const c = data?.chart?.chart_data || data?.chart;
        if (c) { setChart(c); LS.setJ("nakshatra_chart", c); }
        else setErr("No chart found. Please regenerate your chart.");
      } else setErr("Could not load chart.");
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      flexDirection:"column", gap:20, position:"relative", zIndex:1 }}>
      <div style={{ width:50, height:50, borderRadius:"50%", border:"2px solid var(--gold)",
        borderTopColor:"transparent", animation:"spin 1s linear infinite" }} />
      <p className="cormorant" style={{ color:"var(--muted)", fontStyle:"italic" }}>Loading your chart…</p>
      <div style={{ maxWidth:320, width:"100%", padding:"0 20px" }}><AstroFact T={T} /></div>
    </div>
  );

  if (!chart) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      padding:32, position:"relative", zIndex:1 }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:16 }}>⚠</div>
        <p style={{ color:"var(--muted)", fontSize:15 }}>{err || "Chart not available."}</p>
      </div>
    </div>
  );

  const asc      = chart.ascendant || {};
  const planets  = chart.planets   || {};
  const dasha    = chart.currentDasha || null;
  const dashaSeq = chart.dashaSequence || [];
  const planetList = Object.entries(planets);

  const TABS = ["kundli","planets","nakshatras","dasha"];

  return (
    <div style={{ position:"relative", zIndex:1, paddingBottom:90 }}>
      {/* Header */}
      <div style={{ padding:"52px 20px 16px",
        background: T.dark ? "rgba(9,9,15,0.88)" : "rgba(255,251,240,0.88)",
        backdropFilter:"blur(12px)", borderBottom:"1px solid var(--border)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
          <div>
            <div style={{ fontSize:10, color:"var(--gold)", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:4 }}>Vedic Birth Chart</div>
            <h2 className="cinzel" style={{ fontSize:18, color:"var(--gold)" }}>{userName}</h2>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:10, color:"var(--gold)" }}>Lahiri · Whole Sign</div>
            <div style={{ fontSize:9, color:"var(--muted)", marginTop:2 }}>{asc?.nakshatra?.name || ""}</div>
          </div>
        </div>
        <div style={{ fontSize:12, color:"var(--muted)" }}>
          {dob}{time ? ` · ${time}` : ""}{birthPlace ? ` · ${birthPlace}` : ""}
        </div>
      </div>

      {/* Key signs */}
      <div style={{ padding:"14px 16px 0" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
          {[
            { label:"Ascendant", value:asc?.sign,          sym:SIGN_GLYPHS[asc?.sign]         || "✦" },
            { label:"Moon Sign", value:planets?.moon?.sign, sym:SIGN_GLYPHS[planets?.moon?.sign] || "☽" },
            { label:"Sun Sign",  value:planets?.sun?.sign,  sym:SIGN_GLYPHS[planets?.sun?.sign]  || "☉" },
          ].map(item => (
            <div key={item.label} className="glass" style={{ padding:"13px 8px", textAlign:"center" }}>
              <div style={{ fontSize:20, color:"var(--gold)", marginBottom:5 }}>{item.sym}</div>
              <div className="cinzel" style={{ fontSize:9, color:"var(--gold)", marginBottom:3 }}>{item.value || "—"}</div>
              <div style={{ fontSize:8, color:"var(--muted)", letterSpacing:"0.07em", textTransform:"uppercase" }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Dasha */}
      {dasha && (
        <div style={{ margin:"12px 16px 0" }}>
          <div className="glass" style={{ padding:"13px 16px", borderColor:`${T.rose}33` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:9, color:"var(--rose)", letterSpacing:"0.10em", textTransform:"uppercase", marginBottom:5 }}>Current Dasha</div>
                <div className="cormorant" style={{ fontSize:18, color:"var(--text)", fontWeight:500 }}>{dasha.planet} Mahadasha</div>
                <div style={{ fontSize:11, color:"var(--muted)", marginTop:3 }}>{planets?.moon?.nakshatra?.name || ""} Nakshatra</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:10, color:"var(--muted)" }}>Ends</div>
                <div style={{ fontSize:12, color:"var(--gold)", marginTop:2 }}>{dasha.endDate || "—"}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ padding:"14px 16px 10px" }}>
        <div style={{ display:"flex", gap:8 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex:1, padding:"9px 0", borderRadius:10, border:`1px solid ${tab===t ? "var(--gold)" : "var(--border)"}`,
                background: tab===t ? (T.dark ? "rgba(201,169,110,0.08)" : "rgba(160,100,0,0.06)") : "transparent",
                color:tab===t ? "var(--gold)" : "var(--muted)",
                fontSize:8, letterSpacing:"0.08em", textTransform:"uppercase", cursor:"pointer",
                fontFamily:"Jost", transition:"all 0.2s" }}>
              {t === "kundli" ? "Kundli" : t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {tab === "kundli" && <KundliChart chart={chart} T={T} />}

      {tab === "planets" && (
        <div style={{ padding:"0 16px", display:"flex", flexDirection:"column", gap:8 }}>
          {planetList.map(([name, d]) => (
            <div key={name} className="glass" style={{ padding:"11px 14px", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:34, height:34, borderRadius:"50%", flexShrink:0,
                background:`radial-gradient(circle at 35% 35%, ${T.gold2}, ${T.gold}55)`,
                border:`1px solid ${T.gold}44`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
                {PLANET_SYMBOLS[name] || "•"}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div className="cormorant" style={{ fontSize:14, color:"var(--text)", fontWeight:500, textTransform:"capitalize" }}>{name}</div>
                <div style={{ fontSize:12, color:"var(--muted)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {d.formatted || `${d.sign || "—"}${d.degrees != null ? ` ${d.degrees.toFixed(2)}°` : ""}`}
                </div>
                {d.nakshatra && (
                  <div style={{ fontSize:11, color:"var(--sky)" }}>
                    {d.nakshatra.name} · Pada {d.nakshatra.pada}
                    {d.nakshatra.lord ? ` · ${d.nakshatra.lord}` : ""}
                  </div>
                )}
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:11, color:"var(--gold)",
                  background: T.dark ? "rgba(201,169,110,0.08)" : "rgba(160,100,0,0.06)",
                  padding:"3px 9px", borderRadius:20 }}>
                  H{d.house || "—"}
                </div>
                {d.retrograde && <div style={{ fontSize:9, color:"var(--rose)", marginTop:3 }}>℞ Retro</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "nakshatras" && (
        <div style={{ padding:"0 16px" }}>
          <div className="glass" style={{ padding:18 }}>
            {[["Ascendant", asc?.nakshatra], ["Moon", planets?.moon?.nakshatra], ["Sun", planets?.sun?.nakshatra]]
              .filter(([, n]) => n)
              .map(([label, nak]) => (
                <div key={label} style={{ padding:"13px 0", borderBottom:"1px solid var(--border)" }}>
                  <div style={{ fontSize:9, color:"var(--gold)", letterSpacing:"0.10em", textTransform:"uppercase", marginBottom:5 }}>{label} Nakshatra</div>
                  <div className="cormorant" style={{ fontSize:20, color:"var(--text)", fontWeight:500, marginBottom:3 }}>{nak.name}</div>
                  <div style={{ fontSize:12, color:"var(--muted)" }}>
                    {nak.pada ? `Pada ${nak.pada}` : ""}
                    {nak.lord  ? ` · Ruled by ${nak.lord}` : ""}
                    {nak.deity ? ` · Deity: ${nak.deity}`  : ""}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {tab === "dasha" && (
        <div style={{ padding:"0 16px" }}>
          <div className="glass" style={{ padding:18 }}>
            <div style={{ fontSize:9, color:"var(--gold)", letterSpacing:"0.10em", textTransform:"uppercase", marginBottom:14 }}>Vimshottari Dasha Sequence</div>
            {dashaSeq.map((d, i) => {
              const now = new Date();
              const active = new Date(d.startDate) <= now && now < new Date(d.endDate);
              return (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                  padding:"10px 0", borderBottom:"1px solid var(--border)", opacity:active?1:0.55 }}>
                  <div>
                    <span className="cormorant" style={{ fontSize:16, color:active?"var(--gold)":"var(--text)", fontWeight:active?500:300 }}>{d.planet}</span>
                    {active && <span style={{ marginLeft:8, fontSize:8, background:"var(--gold)", color:T.dark?"#09090f":"#fff", padding:"2px 7px", borderRadius:20, fontWeight:700 }}>NOW</span>}
                    {d.years && <div style={{ fontSize:10, color:"var(--muted)", marginTop:2 }}>{d.years} yrs</div>}
                  </div>
                  <div style={{ textAlign:"right", fontSize:11, color:"var(--muted)" }}>
                    <div>{String(d.startDate||"").slice(0,7)} → {String(d.endDate||"").slice(0,7)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      <div style={{ margin:"20px 16px 0" }}>
        <button className="btn-gold" onClick={onAskAI}>✦ Open Celestial Guide · AI Consultation</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CELESTIAL GUIDE (formerly Ask AI)
// ─────────────────────────────────────────────────────────────────────────────
const SUGGESTIONS = [
  "How will my career progress in the next 2 years?",
  "What does my chart say about love and marriage?",
  "Which business suits my planetary chart?",
  "Tell me about my health based on my planets.",
];

function ChatScreen({ credits, setCredits, onBuyCredits, T }) {
  const userName = LS.getJ("nakshatra_user")?.name || "Seeker";
  const [messages, setMessages] = useState([{
    role:"ai",
    text:`Namaste ✦ I have your complete Vedic birth chart, ${userName}. Ask anything about your cosmic path — career, relationships, timing, or spiritual growth.`
  }]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [localCr, setLocalCr] = useState(() => {
    const s = LS.get("nakshatra_credits");
    if (!s) return 5;
    if (s === "∞") return "∞";
    const n = parseInt(s, 10);
    return isNaN(n) ? 5 : n;
  });
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);

  const send = async (text) => {
    const q = text.trim();
    if (!q || loading || localCr === 0) return;
    setMessages(p => [...p, { role:"user", text:q }]);
    setInput("");
    setLoading(true);

    const { ok, status, data } = await apiFetch("/api/ai/ask", {
      method:"POST", body:JSON.stringify({ question:q })
    });

    if (!ok) {
      let msg;
      if (status === 402)           msg = "You have used all your credits. Please purchase more to continue.";
      else if (data.error==="NO_CHART") msg = "Please generate your birth chart first before asking questions.";
      else                           msg = `Error: ${data.error || "Something went wrong. Please try again."}`;
      setMessages(p => [...p, { role:"ai", text:msg }]);
      if (status === 402) { setLocalCr(0); LS.set("nakshatra_credits", "0"); if (setCredits) setCredits(0); }
    } else {
      setMessages(p => [...p, { role:"ai", text:data.answer }]);
      const rem = typeof data.creditsRemaining === "number" ? data.creditsRemaining
        : (localCr === "∞" ? "∞" : Math.max(0, Number(localCr) - 1));
      setLocalCr(rem); LS.set("nakshatra_credits", String(rem));
      if (setCredits) setCredits(rem);
    }
    setLoading(false);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", position:"relative", zIndex:1 }}>

      {/* Header */}
      <div style={{ padding:"52px 20px 14px",
        background: T.dark ? "rgba(9,9,15,0.90)" : "rgba(255,251,240,0.90)",
        backdropFilter:"blur(14px)", borderBottom:"1px solid var(--border)",
        display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
        <div>
          <div className="cinzel" style={{ fontSize:14, color:"var(--gold)" }}>✦ Celestial Guide</div>
          <div style={{ fontSize:10, color:"var(--muted)", marginTop:2 }}>Chart-aware · Vedic AI · Gemini</div>
        </div>
        <button className="credit-badge" onClick={onBuyCredits} style={{ cursor:"pointer", border:"none" }}>
          ✦ {localCr === "∞" ? "∞ credits" : `${localCr} credit${localCr !== 1 ? "s" : ""}`}
        </button>
      </div>

      {/* Messages */}
      <div className="scroll-area" style={{
        flex:1, padding:"16px 16px 0", display:"flex", flexDirection:"column", gap:14,
        overflowY:"auto",
        /* Leave space for input bar + nav */
        paddingBottom:130,
      }}>
        {/* Suggestion chips — only when 1 message */}
        {messages.length === 1 && (
          <div style={{ marginBottom:8 }}>
            <div style={{ fontSize:9, color:"var(--muted)", letterSpacing:"0.10em", textTransform:"uppercase", marginBottom:10, textAlign:"center" }}>
              Suggested questions
            </div>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => send(s)}
                style={{ display:"block", width:"100%", background:"transparent",
                  border:"1px solid var(--border)", borderRadius:12, padding:"11px 16px",
                  color:"var(--muted)", textAlign:"left", cursor:"pointer", marginBottom:8,
                  fontSize:14, fontFamily:"Cormorant Garamond", lineHeight:1.5, transition:"all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(201,169,110,0.35)"; e.currentTarget.style.color="var(--text)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--muted)"; }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ display:"flex", flexDirection:m.role==="user"?"row-reverse":"row", alignItems:"flex-start", gap:10 }}>
            {m.role === "ai" && (
              <div style={{ width:30, height:30, borderRadius:"50%", flexShrink:0, marginTop:2,
                background:`radial-gradient(circle, ${T.gold2}, ${T.gold})`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>✦</div>
            )}
            {m.role === "ai"
              ? <div className="bubble-ai" style={{ whiteSpace:"pre-line" }}>{m.text}</div>
              : <div className="bubble-user">{m.text}</div>
            }
          </div>
        ))}

        {loading && (
          <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
            <div style={{ width:30, height:30, borderRadius:"50%", flexShrink:0,
              background:`radial-gradient(circle, ${T.gold2}, ${T.gold})`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>✦</div>
            <div className="bubble-ai" style={{ display:"flex", alignItems:"center", gap:6, padding:"16px 20px" }}>
              <div className="dot"/><div className="dot"/><div className="dot"/>
            </div>
          </div>
        )}

        {localCr === 0 && !loading && (
          <div style={{ textAlign:"center", padding:"24px 16px" }}>
            <div style={{ fontSize:28, marginBottom:10 }}>✦</div>
            <div className="cinzel" style={{ fontSize:13, color:"var(--gold)", marginBottom:8 }}>Credits Exhausted</div>
            <p className="cormorant" style={{ fontSize:15, color:"var(--muted)", marginBottom:16, fontStyle:"italic" }}>Purchase credits to continue your reading</p>
            <button className="btn-gold" style={{ maxWidth:200 }} onClick={onBuyCredits}>Buy Credits</button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input bar — FIXED above nav, never overlaps ── */}
      {localCr !== 0 && (
        <div style={{
          position:"fixed", bottom:62, left:0, right:0, zIndex:60,
          padding:"10px 16px 10px",
          background: T.dark ? "rgba(9,9,15,0.97)" : "rgba(255,251,240,0.97)",
          backdropFilter:"blur(16px)",
          borderTop:"1px solid var(--border)",
        }}>
          <div style={{ display:"flex", gap:10, alignItems:"center", maxWidth:600, margin:"0 auto" }}>
            <input className="input-field"
              style={{ flex:1, borderRadius:24, padding:"12px 18px", margin:0 }}
              placeholder="Ask the stars anything…"
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }} />
            <button onClick={() => send(input)} disabled={loading || !input.trim()}
              style={{ width:44, height:44, borderRadius:"50%", flexShrink:0, border:"none", cursor:"pointer",
                background:`linear-gradient(135deg, var(--gold), var(--gold2))`,
                color: T.dark ? "#09090f" : "#fff",
                display:"flex", alignItems:"center", justifyContent:"center",
                opacity:(loading || !input.trim()) ? 0.45 : 1, transition:"opacity 0.2s" }}>
              {I.send}
            </button>
          </div>
          <div style={{ textAlign:"center", marginTop:5, fontSize:10, color:"var(--muted)" }}>
            1 credit per question · Powered by Google Gemini AI
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CREDITS / PAYMENT SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function CreditsScreen({ onClose, onPurchased, T }) {
  const [selected,   setSelected]   = useState("popular");
  const [processing, setProcessing] = useState(false);
  const [done,       setDone]       = useState(false);
  const [err,        setErr]        = useState("");
  const plan = PLANS.find(p => p.id === selected);

  const buy = async () => {
    setErr(""); setProcessing(true);
    try {
      // 1. Create order on backend
      const { ok, data } = await apiFetch("/api/payments/create-order", {
        method:"POST", body:JSON.stringify({ planId:selected })
      });
      if (!ok) throw new Error(data.error || "Could not create order.");

      // 2. Open Razorpay
      const paymentResult = await new Promise((resolve, reject) => {
        const keyId = process.env.REACT_APP_RAZORPAY_KEY_ID || "";
        if (!keyId || typeof window.Razorpay === "undefined") {
          // Dev mode — simulate
          console.warn("Razorpay not loaded — simulating payment.");
          resolve({ simulated:true });
          return;
        }
        const rzp = new window.Razorpay({
          key:        keyId,
          amount:     data.amount,
          currency:   "INR",
          name:       "Nakshatra AI Jyotish",
          description:`${plan?.name} Plan`,
          order_id:   data.orderId,
          prefill:    { name: LS.getJ("nakshatra_user")?.name || "" },
          theme:      { color: T.gold },
          handler:    r => resolve(r),
          modal:      { ondismiss: () => reject(new Error("Payment cancelled.")) },
        });
        rzp.open();
      });

      if (paymentResult.simulated) {
        // Simulate credit addition locally for dev/testing
        const existingCr = LS.get("nakshatra_credits");
        const add = plan?.questions === "∞" ? 9999 : (plan?.questions || 0);
        const newTotal = (existingCr === "∞") ? "∞" : String(parseInt(existingCr||"0",10) + Number(add));
        LS.set("nakshatra_credits", newTotal);
        setDone(true); setProcessing(false);
        setTimeout(() => { if (onPurchased) onPurchased(newTotal); onClose(); }, 1400);
        return;
      }

      // 3. Verify on backend
      const { ok:vok, data:vd } = await apiFetch("/api/payments/verify", {
        method:"POST",
        body:JSON.stringify({
          razorpay_order_id:   paymentResult.razorpay_order_id,
          razorpay_payment_id: paymentResult.razorpay_payment_id,
          razorpay_signature:  paymentResult.razorpay_signature,
        })
      });
      if (!vok) throw new Error(vd.error || "Payment verification failed.");
      LS.set("nakshatra_credits", String(vd.credits));
      setDone(true); setProcessing(false);
      setTimeout(() => { if (onPurchased) onPurchased(vd.credits); onClose(); }, 1400);

    } catch (e) {
      setProcessing(false);
      if (e.message !== "Payment cancelled.") setErr(e.message);
    }
  };

  return (
    <div style={{ minHeight:"100vh", position:"relative", zIndex:1, paddingBottom:40 }}>
      <div style={{ padding:"52px 20px 20px", textAlign:"center", position:"relative" }}>
        <button onClick={onClose}
          style={{ position:"absolute", top:52, left:20, background:"none", border:"none",
            color:"var(--muted)", cursor:"pointer", width:32, height:32,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
          {I.back}
        </button>
        <div style={{ fontSize:36, marginBottom:10 }}>✦</div>
        <h2 className="cinzel" style={{ fontSize:18, color:"var(--gold)", marginBottom:6 }}>Unlock AI Wisdom</h2>
        <p className="cormorant" style={{ fontSize:16, color:"var(--muted)", fontStyle:"italic" }}>Each credit = one in-depth AI reading</p>
      </div>

      {err && <div className="err-box" style={{ margin:"0 16px 16px" }}>⚠ {err}</div>}

      <div style={{ padding:"0 16px", display:"flex", flexDirection:"column", gap:12, marginBottom:24 }}>
        {PLANS.map(p => (
          <div key={p.id} className={`plan-card${selected===p.id?" selected":""}`}
            onClick={() => setSelected(p.id)}>
            {p.tag && <div className="plan-badge">{p.tag}</div>}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div className="cinzel" style={{ fontSize:13, color:`var(--${p.colorKey})`, marginBottom:5 }}>{p.name}</div>
                <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                  <span className="cinzel" style={{ fontSize:28, color:"var(--text)" }}>{p.questions}</span>
                  <span style={{ fontSize:13, color:"var(--muted)" }}>
                    {p.questions === "∞" ? "questions / 30 days" : `question${p.questions!==1?"s":""}`}
                  </span>
                </div>
                {p.note && <div style={{ fontSize:11, color:`var(--${p.colorKey})`, marginTop:4 }}>{p.note}</div>}
              </div>
              <div style={{ textAlign:"right" }}>
                <div className="cinzel" style={{ fontSize:24, color:"var(--text)" }}>{p.price}</div>
                {selected === p.id && (
                  <div style={{ marginTop:6, color:`var(--${p.colorKey})`, display:"flex", justifyContent:"flex-end" }}>{I.check}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding:"0 16px" }}>
        {done ? (
          <div style={{ textAlign:"center", padding:"18px 0" }}>
            <div style={{ fontSize:32, color:"var(--gold)", marginBottom:8 }}>✓</div>
            <div className="cinzel" style={{ fontSize:13, color:"var(--gold)" }}>Credits Added Successfully!</div>
          </div>
        ) : (
          <button className="btn-gold" onClick={buy} disabled={processing}>
            {processing ? "Processing…" : `Pay ${plan?.price} via Razorpay →`}
          </button>
        )}
        <div style={{ display:"flex", justifyContent:"center", gap:20, marginTop:18 }}>
          {["Razorpay","UPI","Net Banking","Cards","Wallets"].map(m => (
            <span key={m} style={{ fontSize:11, color:"var(--muted)", letterSpacing:"0.05em" }}>{m}</span>
          ))}
        </div>
        <p style={{ textAlign:"center", fontSize:11, color:"var(--muted)", marginTop:14, lineHeight:1.6, opacity:0.55 }}>
          Secured by Razorpay · No subscription · Credits never expire (except Sage)
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function HomeScreen({ onTab, T }) {
  const user = LS.getJ("nakshatra_user");
  const name = user?.name || "Seeker";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : hour < 20 ? "Good Evening" : "Namaste";
  const today    = new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long" });

  return (
    <div style={{ position:"relative", zIndex:1, paddingBottom:90 }}>
      {/* Header */}
      <div style={{ padding:"52px 20px 20px" }}>
        <div style={{ fontSize:11, color:"var(--muted)", letterSpacing:"0.09em", textTransform:"uppercase", marginBottom:6 }}>
          {today} · {T.label}
        </div>
        <h2 className="cinzel" style={{ fontSize:20, color:"var(--gold)", marginBottom:4 }}>
          {greeting}, {name}
        </h2>
        <p className="cormorant" style={{ fontSize:16, color:"var(--muted)", fontStyle:"italic" }}>
          The stars have messages for you today
        </p>
      </div>

      {/* Daily wisdom card */}
      <div style={{ margin:"0 16px 18px" }}>
        <div className="glass" style={{ padding:20, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-10, right:-10, fontSize:90, opacity:0.04, pointerEvents:"none" }}>☽</div>
          <div style={{ fontSize:9, color:"var(--gold)", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10 }}>
            Today's Cosmic Guidance
          </div>
          <p className="cormorant" style={{ fontSize:18, color:"var(--text)", lineHeight:1.7, fontWeight:300 }}>
            "Open your birth chart to see your personalised planetary positions, or consult the Celestial Guide for wisdom tailored to your unique cosmic blueprint."
          </p>
          <div style={{ marginTop:14, display:"flex", gap:10, flexWrap:"wrap" }}>
            <button onClick={() => onTab("chart")} style={{ background:"none", border:`1px solid ${T.gold}55`, borderRadius:20, padding:"6px 14px", color:"var(--gold)", fontSize:13, fontFamily:"Cormorant Garamond", cursor:"pointer" }}>View Chart ✦</button>
            <button onClick={() => onTab("chat")}  style={{ background:"none", border:`1px solid ${T.rose}55`,  borderRadius:20, padding:"6px 14px", color:"var(--rose)", fontSize:13, fontFamily:"Cormorant Garamond", cursor:"pointer" }}>Celestial Guide ✦</button>
          </div>
        </div>
      </div>

      {/* Astro fact */}
      <div style={{ padding:"0 16px" }}>
        <AstroFact T={T} />
      </div>

      {/* Quick actions */}
      <div style={{ padding:"4px 16px 0" }}>
        <div style={{ fontSize:9, color:"var(--muted)", letterSpacing:"0.10em", textTransform:"uppercase", marginBottom:12 }}>Quick Actions</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {[
            { icon:"⟢", label:"View Birth Chart",   tab:"chart",   color:"var(--gold)" },
            { icon:"✦", label:"Celestial Guide",    tab:"chat",    color:"var(--rose)" },
            { icon:"◈", label:"Dasha Timeline",     tab:"chart",   color:"var(--sky)"  },
            { icon:"◉", label:"Buy Credits",        tab:"credits", color:"var(--gold)" },
          ].map(a => (
            <button key={a.label} onClick={() => onTab(a.tab)} className="glass"
              style={{ padding:"18px 14px", textAlign:"left", border:"1px solid var(--border)",
                borderRadius:16, cursor:"pointer", transition:"all 0.2s", background:"none" }}>
              <div style={{ fontSize:22, color:a.color, marginBottom:8 }}>{a.icon}</div>
              <div style={{ fontSize:13, color:"var(--text)", lineHeight:1.45, fontFamily:"Jost", fontWeight:400 }}>{a.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Auspicious elements */}
      <div style={{ margin:"16px 16px 0" }}>
        <div className="glass" style={{ padding:18 }}>
          <div style={{ fontSize:9, color:"var(--gold)", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:14 }}>Today's Auspicious Elements</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
            {[["Color","Cream & Blue","◉"],["Number","6 & 9","◈"],["Direction","North-East","⟢"]].map(([k,v,sym]) => (
              <div key={k} style={{ textAlign:"center" }}>
                <div style={{ fontSize:18, color:"var(--gold)", marginBottom:5 }}>{sym}</div>
                <div style={{ fontSize:9, color:"var(--muted)", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>{k}</div>
                <div className="cormorant" style={{ fontSize:15, color:"var(--text)" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BOTTOM NAV
// ─────────────────────────────────────────────────────────────────────────────
function BottomNav({ tab, onTab, T }) {
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:100,
      background: T.dark ? "rgba(9,9,15,0.97)" : "rgba(255,251,240,0.97)",
      backdropFilter:"blur(20px)", borderTop:"1px solid var(--border)",
      display:"flex", justifyContent:"space-around", padding:"8px 0 18px" }}>
      {[
        { id:"home",    label:"Home",    icon:I.home   },
        { id:"chart",   label:"Chart",   icon:I.chart  },
        { id:"chat",    label:"Guide",   icon:I.chat   },
        { id:"credits", label:"Credits", icon:I.wallet },
      ].map(item => (
        <button key={item.id} className={`nav-tab${tab===item.id?" active":""}`} onClick={() => onTab(item.id)}>
          {item.icon}{item.label}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  // Auto theme
  const [themeKey, setThemeKey] = useState(detectTheme);
  const T = THEMES[themeKey];

  // Update theme every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => setThemeKey(detectTheme()), 60_000);
    return () => clearInterval(interval);
  }, []);

  // Screen state
  const getInitial = () => {
    const token = LS.get("nakshatra_token");
    const chart = LS.getJ("nakshatra_chart");
    if (token && chart) return "app";
    return "splash";
  };

  const [screen,  setScreen]  = useState(getInitial);
  const [tab,     setTab]     = useState("home");
  const [credits, setCredits] = useState(() => {
    const s = LS.get("nakshatra_credits");
    if (!s) return 5;
    if (s === "∞") return "∞";
    const n = parseInt(s, 10);
    return isNaN(n) ? 5 : n;
  });

  const goTab = (t) => {
    if (t === "credits") { setScreen("credits"); return; }
    setTab(t);
    if (screen !== "app") setScreen("app");
  };

  const logout = () => {
    LS.clearAll();
    setScreen("splash"); setTab("home"); setCredits(5);
  };

  // ── Render ──
  const wrap = (children) => (
    <>
      <GlobalStyles T={T} />
      <BgLayer T={T} />
      {children}
    </>
  );

  if (screen === "splash")  return wrap(<SplashScreen  onRegister={() => setScreen("register")} onLogin={() => setScreen("login")} T={T} />);
  if (screen === "login")   return wrap(<LoginScreen   onDone={() => { setScreen("app"); setTab("chart"); }} onNewUser={() => setScreen("register")} T={T} />);
  if (screen === "register")return wrap(<RegisterScreen onDone={() => { setScreen("app"); setTab("chart"); }} onLogin={() => setScreen("login")} T={T} />);
  if (screen === "credits") return wrap(<CreditsScreen onClose={() => setScreen("app")} onPurchased={n => { setCredits(n); }} T={T} />);

  return wrap(
    <div style={{ position:"relative", minHeight:"100vh" }}>
      {/* Logout button */}
      <button onClick={logout} title="Log out"
        style={{ position:"fixed", top:14, right:14, zIndex:200,
          background: T.dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
          border:"1px solid var(--border)", borderRadius:10,
          padding:"6px 10px", cursor:"pointer", color:"var(--muted)",
          display:"flex", alignItems:"center", gap:5, fontSize:11, fontFamily:"Jost" }}>
        {I.logout}<span>Logout</span>
      </button>

      {tab === "home"  && <HomeScreen  onTab={goTab} T={T} />}
      {tab === "chart" && <ChartScreen onAskAI={() => goTab("chat")} T={T} />}
      {tab === "chat"  && <ChatScreen  credits={credits} setCredits={setCredits} onBuyCredits={() => setScreen("credits")} T={T} />}

      <BottomNav tab={tab} onTab={goTab} T={T} />
    </div>
  );
}
