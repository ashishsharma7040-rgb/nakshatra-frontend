import { useState, useEffect, useRef } from "react";

// ── Time-based Theme Engine ───────────────────────────────────────────────────
function getTimeTheme() {
  const h = new Date().getHours();
  if (h >= 5  && h < 8)  return 'dawn';
  if (h >= 8  && h < 17) return 'morning';
  if (h >= 17 && h < 20) return 'evening';
  return 'night';
}

const THEMES = {
  dawn: {
    bg:'linear-gradient(160deg,#fce4ec 0%,#f8bbd0 40%,#e8a8c8 70%,#d090b8 100%)',
    midnight:'#fce4ec', deep:'#f8d0e0', card:'rgba(255,245,250,0.94)',
    border:'rgba(160,80,120,0.2)', text:'#280a1e', muted:'rgba(40,10,30,0.5)',
    gold:'#9a5020', gold2:'#c07038', rose:'#b03060', sky:'#404898', glow:'rgba(154,80,32,0.12)',
    navBg:'rgba(40,10,30,0.92)', navBorder:'rgba(200,130,160,0.3)', navText:'#f8d0e0', navActive:'#f0a060',
    headerBg:'rgba(40,10,30,0.88)', aiBg:'rgba(255,245,250,0.96)', aiText:'#280a1e',
    userBg:'rgba(40,10,30,0.12)', userText:'#280a1e', inputBg:'rgba(255,245,250,0.9)', inputText:'#280a1e',
    inputPlaceholder:'rgba(40,10,30,0.4)', btnBg:'linear-gradient(135deg,#9a5020,#c07038)', btnText:'#fff',
    utilBg:'rgba(40,10,30,0.15)', utilText:'#280a1e', utilBorder:'rgba(40,10,30,0.2)', label:'🌸 Dawn',
  },
  morning: {
    bg:'linear-gradient(160deg,#fdf6ec 0%,#f5e8d0 40%,#ece0c4 70%,#e4d4b4 100%)',
    midnight:'#fdf6ec', deep:'#f5e8d8', card:'rgba(255,252,244,0.95)',
    border:'rgba(140,100,50,0.18)', text:'#241404', muted:'rgba(36,20,4,0.45)',
    gold:'#8a5818', gold2:'#b07830', rose:'#904050', sky:'#304880', glow:'rgba(138,88,24,0.1)',
    navBg:'rgba(30,18,4,0.90)', navBorder:'rgba(180,130,60,0.3)', navText:'#f5e8d0', navActive:'#f0b050',
    headerBg:'rgba(30,18,4,0.86)', aiBg:'rgba(255,252,244,0.97)', aiText:'#241404',
    userBg:'rgba(36,20,4,0.09)', userText:'#241404', inputBg:'rgba(255,252,244,0.93)', inputText:'#241404',
    inputPlaceholder:'rgba(36,20,4,0.38)', btnBg:'linear-gradient(135deg,#8a5818,#b07830)', btnText:'#fff',
    utilBg:'rgba(36,20,4,0.1)', utilText:'#241404', utilBorder:'rgba(36,20,4,0.18)', label:'☀️ Morning',
  },
  evening: {
    bg:'linear-gradient(160deg,#0e0500 0%,#2a0e00 20%,#6b2800 45%,#c05020 70%,#e88030 88%,#f0b060 100%)',
    midnight:'#0e0500', deep:'#1c0900', card:'rgba(28,12,0,0.90)',
    border:'rgba(220,140,50,0.22)', text:'#f5daa8', muted:'rgba(245,218,168,0.48)',
    gold:'#f0a020', gold2:'#f5c050', rose:'#e04860', sky:'#6070b0', glow:'rgba(240,160,32,0.18)',
    navBg:'rgba(14,5,0,0.96)', navBorder:'rgba(240,160,50,0.3)', navText:'#f5daa8', navActive:'#f5c050',
    headerBg:'rgba(14,5,0,0.94)', aiBg:'rgba(36,16,0,0.94)', aiText:'#f5daa8',
    userBg:'rgba(245,218,168,0.09)', userText:'#f5daa8', inputBg:'rgba(28,12,0,0.88)', inputText:'#f5daa8',
    inputPlaceholder:'rgba(245,218,168,0.35)', btnBg:'linear-gradient(135deg,#c05020,#f0a020)', btnText:'#0e0500',
    utilBg:'rgba(245,218,168,0.08)', utilText:'#f5daa8', utilBorder:'rgba(240,160,50,0.25)', label:'🌅 Evening',
  },
  night: {
    bg:'linear-gradient(160deg,#09090f 0%,#0f0f1e 50%,#13131f 100%)',
    midnight:'#09090f', deep:'#0f0f1e', card:'#16162a',
    border:'rgba(255,255,255,0.07)', text:'#e8e4da', muted:'rgba(232,228,218,0.45)',
    gold:'#c9a96e', gold2:'#e8cc9a', rose:'#c97b9a', sky:'#7ba8c9', glow:'rgba(201,169,110,0.18)',
    navBg:'rgba(9,9,15,0.97)', navBorder:'rgba(255,255,255,0.08)', navText:'#e8e4da', navActive:'#c9a96e',
    headerBg:'rgba(9,9,15,0.92)', aiBg:'rgba(22,22,42,0.96)', aiText:'#e8e4da',
    userBg:'rgba(255,255,255,0.06)', userText:'#e8e4da', inputBg:'rgba(22,22,42,0.85)', inputText:'#e8e4da',
    inputPlaceholder:'rgba(232,228,218,0.32)', btnBg:'linear-gradient(135deg,#c9a96e,#e8cc9a)', btnText:'#09090f',
    utilBg:'rgba(255,255,255,0.05)', utilText:'rgba(232,228,218,0.6)', utilBorder:'rgba(255,255,255,0.08)', label:'🌙 Night',
  },
};
let _theme = 'night';
const getT = () => THEMES[_theme] || THEMES.night;


// ── Google Fonts ──────────────────────────────────────────────────────────────
const GlobalStyles = ({ theme = 'night' }) => {
  _theme = theme;
  const t = THEMES[theme] || THEMES.night;
  return <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --midnight: #09090f;
      --deep:     #0f0f1e;
      --void:     #13131f;
      --card:     #16162a;
      --border:   rgba(255,255,255,0.07);
      --gold:     #c9a96e;
      --gold2:    #e8cc9a;
      --rose:     #c97b9a;
      --sky:      #7ba8c9;
      --glow:     rgba(201,169,110,0.18);
      --text:     #e8e4da;
      --muted:    rgba(232,228,218,0.45);
      --radius:   16px;
    }

    body { background: var(--midnight); color: var(--text); font-family: 'Jost', sans-serif; }
    .cinzel { font-family: 'Cinzel Decorative', serif; }
    .cormorant { font-family: 'Cormorant Garamond', serif; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--deep); }
    ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }

    @keyframes twinkle {
      0%,100% { opacity: 0.2; transform: scale(1); }
      50%      { opacity: 1;   transform: scale(1.4); }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position:  400px 0; }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes float {
      0%,100% { transform: translateY(0px); }
      50%      { transform: translateY(-6px); }
    }
    @keyframes messageIn {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes dotPulse {
      0%,80%,100% { transform: scale(0); opacity: 0.3; }
      40%          { transform: scale(1);   opacity: 1; }
    }

    .fade-up { animation: fadeUp 0.6s ease forwards; }
    .float   { animation: float 4s ease-in-out infinite; }

    .glass {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      backdrop-filter: blur(12px);
    }
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
      opacity: 0.4;
      margin: 24px 0;
    }
    .input-wrap { position: relative; margin-bottom: 16px; }
    .input-label {
      display: block;
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 8px;
      font-family: 'Jost', sans-serif;
      font-weight: 500;
    }
    .input-field {
      width: 100%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      padding: 13px 16px;
      color: var(--text);
      font-family: 'Jost', sans-serif;
      font-size: 15px;
      font-weight: 300;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .input-field:focus {
      border-color: var(--gold);
      box-shadow: 0 0 0 3px rgba(201,169,110,0.1);
    }
    .input-field::placeholder { color: var(--muted); }
    /* Date/time inputs - force dark styling */
    .input-field[type="date"],
    .input-field[type="time"] {
      color-scheme: dark;
      appearance: none;
      -webkit-appearance: none;
    }
    .input-field[type="date"]::-webkit-calendar-picker-indicator,
    .input-field[type="time"]::-webkit-calendar-picker-indicator {
      filter: invert(0.7) sepia(1) saturate(2) hue-rotate(10deg);
      cursor: pointer;
    }

    .btn-gold {
      width: 100%;
      padding: 15px;
      background: linear-gradient(135deg, #b8924a, #c9a96e, #e8cc9a, #c9a96e);
      background-size: 300% 300%;
      border: none;
      border-radius: 12px;
      color: #09090f;
      font-family: 'Cinzel Decorative', serif;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.08em;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      animation: shimmer 3s linear infinite;
    }
    .btn-gold:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(201,169,110,0.35);
    }
    .btn-gold:disabled { opacity: 0.45; cursor: not-allowed; }
    .btn-ghost {
      background: transparent;
      border: 1px solid var(--border);
      border-radius: 10px;
      color: var(--muted);
      font-family: 'Jost', sans-serif;
      font-size: 13px;
      padding: 10px 20px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-ghost:hover { border-color: var(--gold); color: var(--gold); }

    .bubble-ai {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 4px 16px 16px 16px;
      padding: 14px 18px;
      max-width: 82%;
      font-family: 'Cormorant Garamond', serif;
      font-size: 16px;
      line-height: 1.65;
      font-weight: 300;
      animation: messageIn 0.4s ease forwards;
    }
    .bubble-user {
      background: linear-gradient(135deg, rgba(201,169,110,0.15), rgba(201,169,110,0.06));
      border: 1px solid rgba(201,169,110,0.2);
      border-radius: 16px 4px 16px 16px;
      padding: 12px 18px;
      max-width: 72%;
      font-size: 14px;
      align-self: flex-end;
      animation: messageIn 0.4s ease forwards;
    }
    .nav-tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 8px 16px;
      cursor: pointer;
      border: none;
      background: none;
      color: var(--muted);
      font-family: 'Jost', sans-serif;
      font-size: 10px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      transition: color 0.2s;
    }
    .nav-tab.active { color: var(--gold); }
    .nav-tab svg { width: 20px; height: 20px; }
    .credit-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(201,169,110,0.1);
      border: 1px solid rgba(201,169,110,0.25);
      border-radius: 100px;
      padding: 5px 12px;
      font-size: 12px;
      color: var(--gold2);
      font-family: 'Jost', sans-serif;
    }
    .stars-bg {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }
    .star {
      position: absolute;
      border-radius: 50%;
      background: #fff;
    }
    .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); display: inline-block; animation: dotPulse 1.4s ease-in-out infinite; }
    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }
    .scroll-area { overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--gold) var(--deep); }
    .plan-card {
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
      cursor: pointer;
      transition: all 0.25s;
      position: relative;
      overflow: hidden;
      background: var(--card);
    }
    .plan-card:hover { border-color: var(--gold); transform: translateY(-2px); }
    .plan-card.selected { border-color: var(--gold); background: rgba(201,169,110,0.07); }
    .plan-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: var(--gold);
      color: #09090f;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 100px;
    }
  .nav-bottom{position:fixed;bottom:0;left:0;right:0;background:${t.navBg};backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-top:1px solid ${t.navBorder};display:flex;justify-content:space-around;padding:10px 0 20px;z-index:100;}
    .nav-tab{display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 14px;cursor:pointer;border:none;background:none;color:${t.navText};opacity:0.5;font-family:'Jost',sans-serif;font-size:9px;letter-spacing:0.08em;text-transform:uppercase;transition:opacity 0.2s,color 0.2s;min-width:58px;}
    .nav-tab svg{width:20px;height:20px;stroke:${t.navText};transition:stroke 0.2s;}
    .nav-tab.active{color:${t.navActive};opacity:1;}
    .nav-tab.active svg{stroke:${t.navActive};}
  `}</style>;
};

// ── Constants ─────────────────────────────────────────────────────────────────

const PLANET_SYMBOLS = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', rahu: '☊', ketu: '☋',
};

const PLANET_COLORS = {
  sun: '#e8cc9a', moon: '#b8d4e8', mercury: '#90d4b0', venus: '#c97b9a',
  mars: '#e87070', jupiter: '#f0c070', saturn: '#a0a0c8', rahu: '#c4a8d0', ketu: '#d0b090',
};

const SIGN_GLYPHS = {
  'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
  'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓',
};

// ── Pricing plans (was missing — caused crash in CreditsScreen) ───────────────
const PLANS = [
  {
    id: 'starter',
    name: 'Seeker',
    price: '₹99',
    questions: 5,
    note: 'Great for a quick reading',
    tag: null,
    color: 'var(--sky)',
  },
  {
    id: 'popular',
    name: 'Devotee',
    price: '₹299',
    questions: 20,
    note: 'Most popular choice',
    tag: 'POPULAR',
    color: 'var(--gold)',
  },
  {
    id: 'sage',
    name: 'Sage',
    price: '₹999',
    questions: '∞',
    note: 'Unlimited for 30 days',
    tag: 'BEST VALUE',
    color: 'var(--rose)',
  },
];

// ── Date helpers ──────────────────────────────────────────────────────────────

// Returns today in YYYY-MM-DD for max date constraint
const getTodayStr = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

// Returns date 120 years ago in YYYY-MM-DD for min date constraint
const getMinDOBStr = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 120);
  return d.toISOString().split('T')[0];
};

// ── Storage helpers ───────────────────────────────────────────────────────────
const LS = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { } },
  getJSON: (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  setJSON: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } },
  clear: () => { try { ['nakshatra_token','nakshatra_user_name','nakshatra_chart','nakshatra_birthplace','nakshatra_dob','nakshatra_time','nakshatra_credits'].forEach(k => localStorage.removeItem(k)); } catch { } },
};

// ── Stars background ──────────────────────────────────────────────────────────
const Stars = () => {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2 + 0.5, delay: Math.random() * 5, dur: Math.random() * 3 + 2,
  }));
  return (
    <div className="stars-bg">
      {stars.map(s => (
        <div key={s.id} className="star" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, opacity: 0.3, animation: `twinkle ${s.dur}s ${s.delay}s ease-in-out infinite` }} />
      ))}
      <div style={{ position: 'absolute', top: '15%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,123,154,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,168,201,0.05) 0%, transparent 70%)', filter: 'blur(50px)' }} />
    </div>
  );
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = {
  home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" /><path d="M9 21V12h6v9" /></svg>,
  chart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="9" /><path d="M12 3v9l5 3" /><path d="M3.6 15h16.8M4.9 9h14.2" /></svg>,
  chat: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
  wallet: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="2" y="5" width="20" height="15" rx="2" /><path d="M2 10h20M16 15h.01" /></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M5 13l4 4L19 7" /></svg>,
  send: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" /></svg>,
  logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>,
};

// ── Splash Screen ─────────────────────────────────────────────────────────────
// ── Login Screen (returning users) ───────────────────────────────────────────
const LoginScreen = ({ onComplete, onNewUser }) => {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErrorMsg('');
    if (!form.email.trim() || !form.password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }
    setLoading(true);
    const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';
    try {
      // Login
      const loginRes  = await fetch(`${API}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim(), password: form.password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error(loginData.error || 'Login failed.');

      const token    = loginData.token;
      const userName = loginData.user?.name || '';
      const credits  = loginData.credits ?? 5;

      LS.set('nakshatra_token', token);
      LS.set('nakshatra_user_name', userName);
      LS.set('nakshatra_credits', String(credits));

      // Try to load existing chart
      const chartRes  = await fetch(`${API}/api/chart/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (chartRes.ok) {
        const chartData = await chartRes.json();
        const chart = chartData.chart?.chart_data || chartData.chart;
        if (chart) {
          LS.setJSON('nakshatra_chart', chart);
          if (chartData.chart?.dob)         LS.set('nakshatra_dob',        chartData.chart.dob);
          if (chartData.chart?.birth_time)  LS.set('nakshatra_time',       chartData.chart.birth_time);
          if (chartData.chart?.birth_place) LS.set('nakshatra_birthplace', chartData.chart.birth_place);
        }
      }

      onComplete();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', zIndex: 1 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✦</div>
          <h2 className="cinzel" style={{ fontSize: 22, color: '#e8cc9a', marginBottom: 8 }}>Welcome Back</h2>
          <p className="cormorant" style={{ fontSize: 16, color: 'var(--muted)', fontStyle: 'italic' }}>Sign in to your cosmic profile</p>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(232,112,112,0.1)', border: '1px solid rgba(232,112,112,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#e87070' }}>
            ⚠ {errorMsg}
          </div>
        )}

        <div className="glass" style={{ padding: 24, marginBottom: 16 }}>
          <div className="input-wrap">
            <label className="input-label">Email Address</label>
            <input className="input-field" type="email" placeholder="your@email.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="input-wrap" style={{ marginBottom: 0 }}>
            <label className="input-label">Password</label>
            <input className="input-field" type="password" placeholder="Your password"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
        </div>

        <button className="btn-gold" onClick={handleLogin} disabled={loading} style={{ marginBottom: 12 }}>
          {loading ? '⟳ Signing In...' : '✦ Sign In'}
        </button>
        <button className="btn-ghost" onClick={onNewUser}>
          New user? Create account →
        </button>
      </div>
    </div>
  );
};

const SplashScreen = ({ onNext, onSignIn }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center', position: 'relative', zIndex: 1 }}>
    <div style={{ marginBottom: 40 }} className="float">
      <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #e8cc9a, #c9a96e, #b8924a)', margin: '0 auto 24px', boxShadow: '0 0 60px rgba(201,169,110,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42 }}>
        ✦
      </div>
      <h1 className="cinzel" style={{ fontSize: 28, color: '#e8cc9a', letterSpacing: '0.05em', lineHeight: 1.3, marginBottom: 8 }}>
        Nakshatra<br />
        <span style={{ fontSize: 18, color: 'var(--gold)', fontWeight: 400 }}>AI Jyotish</span>
      </h1>
    </div>
    <p className="cormorant" style={{ fontSize: 20, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 300, marginBottom: 48, fontStyle: 'italic' }}>
      Ancient wisdom, decoded by intelligence. Your cosmic blueprint awaits.
    </p>
    <div style={{ display: 'flex', gap: 24, marginBottom: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
      {[['♈', 'Vedic Charts'], ['☽', 'AI Predictions'], ['✦', 'Daily Guidance']].map(([sym, label]) => (
        <div key={label} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, marginBottom: 6, color: 'var(--gold)' }}>{sym}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Jost' }}>{label}</div>
        </div>
      ))}
    </div>
    <button className="btn-gold" style={{ maxWidth: 280 }} onClick={onNext}>Begin Your Journey</button>
    <button className="btn-ghost" style={{ marginTop: 14, maxWidth: 280 }} onClick={onSignIn || onNext}>Sign In →</button>
    <p style={{ marginTop: 32, fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
      Powered by Swiss Ephemeris · Gemini AI
    </p>
  </div>
);

// ── Birth Details Screen ──────────────────────────────────────────────────────
const BirthDetailsScreen = ({ onComplete }) => {
  const todayStr  = getTodayStr();
  const minDOBStr = getMinDOBStr();

  const [form, setForm] = useState({ name: '', email: '', password: '', dob: '', time: '', location: '' });
  const [step, setStep]       = useState(0); // 0=form 1=loading 2=error
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg]   = useState('');

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    if (!form.name.trim())     return 'Please enter your full name.';
    if (!form.dob)             return 'Please enter your date of birth.';
    if (!form.time)            return 'Please enter your time of birth.';
    if (!form.location.trim()) return 'Please enter your place of birth.';

    const dob = new Date(form.dob);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dob >= today)          return 'Date of birth cannot be today or in the future.';

    const age = today.getFullYear() - dob.getFullYear() -
      (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
    if (age > 120)             return 'Please enter a valid date of birth (max 120 years ago).';
    if (age < 1)               return 'Date of birth must be at least 1 year in the past.';

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) { setErrorMsg(validationError); return; }

    setErrorMsg('');
    setStep(1);
    setProgress(10);

    const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

    try {
      // ── Step 1: Register / login ──────────────────────────────────────────
      setStatusMsg('Creating your account...');
      setProgress(20);

      const email    = form.email.trim() || `${form.name.trim().toLowerCase().replace(/\s+/g, '.')}.${Date.now()}@nakshatra.ai`;
      const password = form.password || `nk_${Date.now()}`;

      let token, userName;
      try {
        const regRes  = await fetch(`${API}/api/auth/register`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: form.name.trim(), email, password }),
        });
        const regData = await regRes.json();
        if (regRes.ok) {
          token    = regData.token;
          userName = regData.user?.name || form.name.trim();
        } else {
          // Try login (account may already exist)
          const loginRes  = await fetch(`${API}/api/auth/login`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const loginData = await loginRes.json();
          if (!loginRes.ok) throw new Error(loginData.error || 'Authentication failed.');
          token    = loginData.token;
          userName = loginData.user?.name || form.name.trim();
        }
      } catch (authErr) {
        throw new Error(`Account error: ${authErr.message}`);
      }

      // Persist user identity from the ACTUAL form data / server response
      LS.set('nakshatra_token', token);
      LS.set('nakshatra_user_name', userName || form.name.trim());
      LS.set('nakshatra_dob', form.dob);
      LS.set('nakshatra_time', form.time);
      LS.set('nakshatra_birthplace', form.location.trim());
      setProgress(40);

      // ── Step 2: Generate chart ────────────────────────────────────────────
      setStatusMsg('Locating your birth coordinates...');
      setProgress(50);

      const chartRes = await fetch(`${API}/api/chart/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ dob: form.dob, time: form.time, location: form.location.trim() }),
      });
      const chartData = await chartRes.json();

      if (!chartRes.ok) {
        throw new Error(chartData.error || chartData.errors?.[0]?.msg || 'Chart generation failed.');
      }

      setStatusMsg('Calculating planetary positions via Swiss Ephemeris...');
      setProgress(75);

      // Store real chart from server — this is the only chart data used from here on
      LS.setJSON('nakshatra_chart', chartData.chart);
      if (chartData.birthPlace) LS.set('nakshatra_birthplace', chartData.birthPlace);

      // Store initial credits returned by server (if any)
      if (typeof chartData.credits === 'number') {
        LS.set('nakshatra_credits', String(chartData.credits));
      }

      setStatusMsg('Mapping Nakshatras and Dashas...');
      setProgress(90);
      await new Promise(r => setTimeout(r, 600));

      setStatusMsg('Your chart is ready ✦');
      setProgress(100);
      await new Promise(r => setTimeout(r, 400));

      onComplete();

    } catch (err) {
      console.error('Chart generation error:', err);
      setStep(2);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  // ── Loading State ───────────────────────────────────────────────────────────
  if (step === 1) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, position: 'relative', zIndex: 1 }}>
      <div style={{ textAlign: 'center', maxWidth: 320 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid var(--gold)', borderTopColor: 'transparent', margin: '0 auto 32px', animation: 'spin 1.2s linear infinite' }} />
        <h2 className="cinzel" style={{ fontSize: 16, color: 'var(--gold)', marginBottom: 12 }}>Reading the Stars</h2>
        <p className="cormorant" style={{ fontSize: 17, color: 'var(--muted)', marginBottom: 28, fontStyle: 'italic' }}>{statusMsg}</p>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #b8924a, #e8cc9a)', borderRadius: 2, transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['Geocoding location', 20], ['Swiss Ephemeris', 50], ['Calculating Dashas', 75], ['Building chart', 90]].map(([s, p]) => (
            <span key={s} style={{ fontSize: 10, color: progress >= p ? 'var(--gold)' : 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'color 0.3s', display: 'flex', alignItems: 'center', gap: 4 }}>
              {progress >= p ? '✓' : '○'} {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Form ────────────────────────────────────────────────────────────────────
  const isFormReady = form.name.trim() && form.email.trim() && form.password.length >= 6 && form.dob && form.time && form.location.trim();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      <div style={{ padding: '48px 24px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Your Cosmic Profile</div>
        <h2 className="cinzel" style={{ fontSize: 20, color: 'var(--gold2)', lineHeight: 1.4 }}>Enter Birth Details</h2>
        <p className="cormorant" style={{ fontSize: 16, color: 'var(--muted)', marginTop: 8, fontStyle: 'italic' }}>Precise time & place reveal your authentic chart</p>
      </div>

      <div style={{ flex: 1, padding: '0 24px 32px', maxWidth: 440, margin: '0 auto', width: '100%' }}>

        {/* Error */}
        {errorMsg && (
          <div style={{ background: 'rgba(232,112,112,0.1)', border: '1px solid rgba(232,112,112,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#e87070', lineHeight: 1.5 }}>
            ⚠ {errorMsg}
          </div>
        )}

        <div className="glass" style={{ padding: 24 }}>
          {/* Name */}
          <div className="input-wrap">
            <label className="input-label">Full Name *</label>
            <input className="input-field" placeholder="e.g. Ashish Sharma" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>

          {/* Email */}
          <div className="input-wrap">
            <label className="input-label">Email Address *</label>
            <input className="input-field" type="email" placeholder="your@email.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>

          {/* Password */}
          <div className="input-wrap">
            <label className="input-label">Password *
              <span style={{ color: 'var(--muted)', fontSize: 10, marginLeft: 6, textTransform: 'none', letterSpacing: 0 }}>(min 6 characters — save this)</span>
            </label>
            <input className="input-field" type="password" placeholder="Create a password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>

          {/* DOB — max=today, min=120yrs ago */}
          <div className="input-wrap">
            <label className="input-label">
              Date of Birth *
              <span style={{ color: 'var(--muted)', fontSize: 10, marginLeft: 6, textTransform: 'none', letterSpacing: 0 }}>(cannot be future date)</span>
            </label>
            <input
              className="input-field"
              type="date"
              value={form.dob}
              min={minDOBStr}
              max={getTodayStr()}
              onChange={e => {
                const val = e.target.value;
                // Extra guard: reject future dates typed manually
                if (val && val > getTodayStr()) {
                  setErrorMsg('Date of birth cannot be in the future.');
                  return;
                }
                setErrorMsg('');
                setForm({ ...form, dob: val });
              }}
            />
          </div>

          {/* Time */}
          <div className="input-wrap">
            <label className="input-label">
              Time of Birth *
              <span style={{ color: 'var(--muted)', fontSize: 10, marginLeft: 6, textTransform: 'none', letterSpacing: 0 }}>(as accurate as possible)</span>
            </label>
            <input className="input-field" type="time" value={form.time}
              onChange={e => setForm({ ...form, time: e.target.value })} />
          </div>

          {/* Location */}
          <div className="input-wrap" style={{ marginBottom: 0 }}>
            <label className="input-label">Place of Birth *</label>
            <input className="input-field" placeholder="e.g. Mumbai, Maharashtra, India"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })} />
          </div>
        </div>

        <div className="divider" />

        <div style={{ background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.15)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--gold)', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Why birth time matters</div>
          <p className="cormorant" style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.6 }}>
            A 4-minute difference shifts your Ascendant. For the most accurate Vedic chart, use your birth certificate or hospital records.
          </p>
        </div>

        <button className="btn-gold" onClick={handleSubmit} disabled={!isFormReady}>
          ✦ Generate My Birth Chart
        </button>
      </div>
    </div>
  );
};

// ── Chart Screen ──────────────────────────────────────────────────────────────

// ── Authentic North Indian Kundli Chart ───────────────────────────────────────
// Traditional diamond/square layout with 12 houses
const KundliChart = ({ planets = {}, ascendant = {}, onHouseClick }) => {
  const [selectedHouse, setSelectedHouse] = useState(null);

  // North Indian Kundli: house positions in the grid (row, col, label positions)
  // Ascendant = 1st house in top-center-left diamond
  const ascHouseNum = 1;
  // Build house number → sign mapping
  const ascSignIdx = ascendant.signIndex ?? 0;
  const SIGNS_SHORT = ['Ar','Ta','Ge','Ca','Le','Vi','Li','Sc','Sa','Cp','Aq','Pi'];
  const SIGNS_FULL  = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

  const houseSign = (h) => SIGNS_FULL[(ascSignIdx + h - 1) % 12];

  // Planets grouped by house
  const byHouse = {};
  for (let i = 1; i <= 12; i++) byHouse[i] = [];
  Object.entries(planets).forEach(([name, data]) => {
    const h = data.house;
    if (h && byHouse[h]) byHouse[h].push({ name, symbol: { sun:'☉', moon:'☽', mars:'♂', mercury:'☿', jupiter:'♃', venus:'♀', saturn:'♄', rahu:'☊', ketu:'☋' }[name] || '•', data });
  });

  const PLANET_COLORS_MAP = { sun:'#f0c060', moon:'#b0d0e8', mars:'#e87070', mercury:'#80d490', jupiter:'#f0e060', venus:'#e8a0c0', saturn:'#a0a0d0', rahu:'#c8a8e0', ketu:'#d0b880' };

  const handleHouse = (h) => {
    setSelectedHouse(selectedHouse === h ? null : h);
    if (onHouseClick) onHouseClick(h, houseSign(h), byHouse[h]);
  };

  // North Indian Kundli grid — 4x4 with triangular houses
  // House positions: 1=top-mid, 2=top-right, 3=right-top, 4=right-mid...
  const SIZE = 280;
  const S = SIZE;
  const Q = S / 4;  // quarter

  // 12 houses as triangular/trapezoidal SVG paths in North Indian style
  // The grid is 4x4, houses arranged as traditional
  const houses = [
    { h:1,  path:`M${S/2},0 L${3*Q},${Q} L${S/2},${S/2} L${Q},${Q} Z`,           cx:S/2,  cy:S/5   },
    { h:2,  path:`M${3*Q},${Q} L${S},0 L${S},${Q} L${3*Q},${Q} Z`,               cx:S*0.88, cy:S*0.12 },
    { h:3,  path:`M${S},0 L${S},${Q} L${3*Q},${Q} Z`,                             cx:S*0.88, cy:S*0.12 },
    { h:2,  path:`M${3*Q},${Q} L${S},0 L${S},${S/2} L${3*Q},${Q} Z`,             cx:S*0.88, cy:S/4  },
    { h:3,  path:`M${S},${S/2} L${3*Q},${Q} L${S},0 Z`,                           cx:S*0.9,  cy:S*0.2 },
    { h:4,  path:`M${S},${S/2} L${S},${S} L${3*Q},${3*Q} L${S/2},${S/2} Z`,      cx:S*0.88, cy:S*0.75 },
    { h:5,  path:`M${S},${S} L${3*Q},${3*Q} Z`,                                   cx:S*0.9,  cy:S*0.8 },
    { h:6,  path:`M${3*Q},${3*Q} L${S},${S} L${S/2},${S} L${3*Q},${3*Q} Z`,      cx:S*0.88, cy:S*0.9 },
    { h:7,  path:`M${S/2},${S} L${Q},${3*Q} L${S/2},${S/2} L${3*Q},${3*Q} Z`,   cx:S/2,  cy:S*0.88 },
    { h:8,  path:`M${Q},${3*Q} L${S/2},${S} L${0},${S} L${Q},${3*Q} Z`,          cx:S*0.12, cy:S*0.9 },
    { h:9,  path:`M${0},${S} L${Q},${3*Q} Z`,                                     cx:S*0.1,  cy:S*0.8 },
    { h:10, path:`M${0},${S/2} L${Q},${Q} L${S/2},${S/2} L${Q},${3*Q} Z`,        cx:S*0.12, cy:S*0.75 },
    { h:11, path:`M${0},0 L${Q},${Q} L${0},${S/2} Z`,                             cx:S*0.1,  cy:S*0.3 },
    { h:12, path:`M${0},0 L${3*Q},${Q} L${Q},${Q} Z`,                             cx:S*0.25, cy:S*0.12 },
  ];

  // Correct North Indian layout — proper 12 house triangular paths
  const houseData = [
    { h:1,  path:`M${Q},${Q} L${3*Q},${Q} L${S/2},${S/2} Z`,                   cx:S/2,    cy:S*0.3  },
    { h:2,  path:`M${3*Q},0 L${S},0 L${3*Q},${Q} Z`,                            cx:S*0.85, cy:S*0.08 },
    { h:3,  path:`M${S},0 L${S},${Q} L${3*Q},${Q} Z`,                           cx:S*0.9,  cy:S*0.15 },
    { h:4,  path:`M${3*Q},${Q} L${S},${Q} L${S/2},${S/2} Z`,                   cx:S*0.82, cy:S/2    },
    { h:5,  path:`M${S},${Q} L${S},${3*Q} L${3*Q},${Q} Z`,                     cx:S*0.9,  cy:S*0.38 },
    { h:6,  path:`M${S},${3*Q} L${S},${S} L${3*Q},${3*Q} Z`,                   cx:S*0.9,  cy:S*0.82 },
    { h:7,  path:`M${3*Q},${3*Q} L${S},${S} L${S/2},${S/2} Z`,                 cx:S/2,    cy:S*0.72 },
    { h:8,  path:`M${Q},${S} L${3*Q},${S} L${3*Q},${3*Q} Z`,                   cx:S*0.62, cy:S*0.92 },
    { h:9,  path:`M${0},${S} L${Q},${3*Q} L${Q},${S} Z`,                        cx:S*0.1,  cy:S*0.85 },
    { h:10, path:`M${0},${Q} L${Q},${Q} L${S/2},${S/2} Z`,                     cx:S*0.18, cy:S/2    },
    { h:11, path:`M${0},0 L${Q},0 L${Q},${Q} Z`,                                cx:S*0.1,  cy:S*0.15 },
    { h:12, path:`M${Q},0 L${3*Q},0 L${Q},${Q} Z`,                             cx:S*0.38, cy:S*0.08 },
  ];

  return (
    <div style={{ width:'100%', maxWidth:320, margin:'0 auto' }}>
      <svg width="100%" viewBox={`0 0 ${S} ${S}`} style={{ display:'block', filter:'drop-shadow(0 4px 20px rgba(0,0,0,0.3))' }}>
        {/* Background */}
        <rect width={S} height={S} fill="var(--deep)" rx="4"/>
        {/* Outer border */}
        <rect x="1" y="1" width={S-2} height={S-2} fill="none" stroke="var(--gold)" strokeWidth="1.5" opacity="0.6"/>
        {/* Inner square */}
        <rect x={Q} y={Q} width={S/2} height={S/2} fill="none" stroke="var(--gold)" strokeWidth="1" opacity="0.4"/>
        {/* Diagonal lines forming triangles */}
        <line x1="0" y1="0" x2={Q} y2={Q} stroke="var(--gold)" strokeWidth="0.8" opacity="0.4"/>
        <line x1={S} y1="0" x2={3*Q} y2={Q} stroke="var(--gold)" strokeWidth="0.8" opacity="0.4"/>
        <line x1={S} y1={S} x2={3*Q} y2={3*Q} stroke="var(--gold)" strokeWidth="0.8" opacity="0.4"/>
        <line x1="0" y1={S} x2={Q} y2={3*Q} stroke="var(--gold)" strokeWidth="0.8" opacity="0.4"/>

        {/* House cells */}
        {houseData.map(({ h, path, cx, cy }) => {
          const isSelected = selectedHouse === h;
          const hasAsc     = h === 1;
          const planetsHere = byHouse[h] || [];
          return (
            <g key={h} onClick={() => handleHouse(h)} style={{ cursor:'pointer' }}>
              <path d={path}
                fill={isSelected ? 'rgba(201,169,110,0.15)' : hasAsc ? 'rgba(201,123,154,0.08)' : 'rgba(201,169,110,0.03)'}
                stroke={isSelected ? 'var(--gold)' : 'var(--gold)'}
                strokeWidth={isSelected ? 1.5 : 0.5}
                strokeOpacity={isSelected ? 0.9 : 0.3}
              />
              {/* House number */}
              <text x={cx} y={cy - (planetsHere.length > 0 ? 10 : 0)} textAnchor="middle" fontSize="9" fill="var(--muted)" opacity="0.7" fontFamily="Jost">{h}</text>
              {/* Sign abbrev */}
              <text x={cx} y={cy + (planetsHere.length > 0 ? 2 : 10)} textAnchor="middle" fontSize="7.5" fill="var(--gold)" opacity="0.85" fontFamily="Jost">{SIGNS_SHORT[(ascSignIdx + h - 1) % 12]}</text>
              {/* Planet symbols */}
              {planetsHere.map((pl, idx) => (
                <text key={pl.name} x={cx} y={cy + 14 + idx * 11} textAnchor="middle" fontSize="10" fill={PLANET_COLORS_MAP[pl.name] || '#e8e4da'} fontFamily="serif">{pl.symbol}</text>
              ))}
              {/* Ascendant marker */}
              {hasAsc && <text x={cx} y={cy - 18} textAnchor="middle" fontSize="7" fill="var(--rose)" fontFamily="Jost" fontWeight="600">ASC</text>}
            </g>
          );
        })}

        {/* Center label */}
        <text x={S/2} y={S/2 - 6} textAnchor="middle" fontSize="10" fill="var(--gold2)" fontFamily="serif" opacity="0.9">✦</text>
        <text x={S/2} y={S/2 + 8} textAnchor="middle" fontSize="7" fill="var(--muted)" fontFamily="Jost">Kundli</text>
      </svg>

      {/* House info panel */}
      {selectedHouse && (
        <div style={{ marginTop:12, padding:'14px 16px', background:'var(--card)', border:'1px solid var(--gold)', borderRadius:12, animation:'fadeUp 0.3s ease' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <div>
              <span className="cinzel" style={{ fontSize:11, color:'var(--gold)', letterSpacing:'0.1em' }}>HOUSE {selectedHouse}</span>
              <span style={{ fontSize:11, color:'var(--muted)', marginLeft:8 }}>{houseSign(selectedHouse)}</span>
            </div>
            <button onClick={() => setSelectedHouse(null)} style={{ background:'none', border:'none', color:'var(--muted)', cursor:'pointer', fontSize:16 }}>×</button>
          </div>
          <div className="cormorant" style={{ fontSize:15, color:'var(--text)', marginBottom:6, fontStyle:'italic' }}>
            {['Self & Personality','Wealth & Family','Courage & Siblings','Happiness & Home','Intelligence & Children','Enemies & Service','Spouse & Partnership','Longevity & Transformation','Fortune & Dharma','Career & Status','Gains & Networks','Liberation & Foreign'][selectedHouse-1]}
          </div>
          {byHouse[selectedHouse].length > 0 ? (
            <div>
              {byHouse[selectedHouse].map(pl => (
                <div key={pl.name} style={{ marginTop:8, paddingTop:8, borderTop:'1px solid var(--border)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontSize:16, color:PLANET_COLORS_MAP[pl.name] || '#e8e4da' }}>{pl.symbol}</span>
                    <span className="cormorant" style={{ fontSize:15, color:'var(--text)', fontWeight:500, textTransform:'capitalize' }}>{pl.name}</span>
                    <span style={{ fontSize:10, color:'var(--muted)', marginLeft:'auto' }}>{typeof pl.degrees === "number" ? pl.degrees.toFixed(1) + "°" : ""}</span>
                  </div>
                  <p style={{ fontSize:12, color:'var(--muted)', lineHeight:1.6 }}>
                    {getPlanetHouseBlurb(pl.name, selectedHouse)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="cormorant" style={{ fontSize:14, color:'var(--muted)', fontStyle:'italic' }}>No planets in this house — the house lord {SIGN_INFO_FRONT[houseSign(selectedHouse)]?.lord || ''} governs these matters from its own position.</p>
          )}
        </div>
      )}
    </div>
  );
};

// Quick house blurbs for kundli tap
const SIGN_INFO_FRONT = {
  'Aries':{ lord:'Mars' }, 'Taurus':{ lord:'Venus' }, 'Gemini':{ lord:'Mercury' },
  'Cancer':{ lord:'Moon' }, 'Leo':{ lord:'Sun' }, 'Virgo':{ lord:'Mercury' },
  'Libra':{ lord:'Venus' }, 'Scorpio':{ lord:'Mars' }, 'Sagittarius':{ lord:'Jupiter' },
  'Capricorn':{ lord:'Saturn' }, 'Aquarius':{ lord:'Saturn' }, 'Pisces':{ lord:'Jupiter' },
};

function getPlanetHouseBlurb(planetName, house) {
  const blurbs = {
    sun:     ['Soul & identity expressed here','Wealth built through authority','Courage & leadership','Happiness from status','Dharmic intelligence','Service with authority','Marriage to a powerful partner','Transformation through ego','Dharmic father & fortune','Career in authority shines','Gains through leadership','Hidden power & foreign'],
    moon:    ['Emotional & nurturing self','Wealth through public','Social & communicative mind','Deep emotional home','Creative emotional intelligence','Service through nurturing','Charming emotional spouse','Psychic & intuitive depth','Fortune through emotions','Public-facing career','Gains through masses','Foreign spiritual peace'],
    mars:    ['Energetic & courageous self','Wealth through effort','Powerful courage & siblings','Property & land disputes','Competitive intelligence','Enemy-defeating placement','Dynamic assertive partner','Occult & transformative','Action-oriented dharma','Career in action & force','Gains through courage','Action in foreign lands'],
    mercury: ['Intellectual & articulate self','Wealth through communication','Writing & sibling harmony','Intellectual happiness','Brilliant intelligence','Analytical service','Communicative spouse','Research & hidden intellect','Scholarly dharma','Communication career','Gains through networks','Foreign intellectual work'],
    jupiter: ['Wise & optimistic self','Great wealth & family','Wisdom in communication','Happy blessed home','Exceptional intelligence','Service through wisdom','Wise & dharmic spouse','Longevity & occult wisdom','Maximum fortune here','Dharmic acclaimed career','Major gains & prosperity','Spiritual foreign lands'],
    venus:   ['Beautiful & artistic self','Artistic wealth & family','Creative communication','Luxurious happy home','Romantic intelligence','Service through beauty','Beautiful loving spouse','Hidden sensual arts','Artistic fortune','Glamorous career shines','Gains through arts & beauty','Foreign luxury & retreat'],
    saturn:  ['Disciplined serious self','Slow but permanent wealth','Persistent effort & siblings','Delayed but real happiness','Disciplined intelligence','Best placement for service','Karmic mature spouse','Exceptional longevity','Hard-earned fortune','Lasting career authority','Delayed but permanent gains','Karmic isolation & moksha'],
    rahu:    ['Unconventional ambitious self','Obsessive wealth-seeking','Unconventional courage','Foreign or unusual home','Unconventional intelligence','Defeating enemies unusually','Foreign or unusual spouse','Occult & transformation','Unconventional dharma','Ambitious unusual career','Sudden unusual gains','Foreign spiritual obsession'],
    ketu:    ['Detached spiritual self','Detachment from wealth','Intuitive past-life courage','Past-life home karma','Past-life spiritual merit','Intuitive healing service','Past-life partnership karma','Moksha & liberation access','Deep past-life dharma','Detachment from career','Past-life gains resolved','Ideal moksha placement'],
  };
  const arr = blurbs[planetName.toLowerCase()];
  return arr ? arr[Math.max(0, Math.min(11, house - 1))] : 'Classical texts reveal unique results based on planetary strength and aspects.';
}

// ── PDF Generator (frontend) ──────────────────────────────────────────────────
async function generatePDF(reportData, type, userName) {
  // Load jsPDF from CDN
  if (!window.jspdf) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210, H = 297;
  const ML = 16, MR = 16, MT = 14; // margins

  // ── Sacred Color Palette ────────────────────────────────────────────────────
  const C = {
    saffron:   [210, 100,  20],   // deep saffron
    gold:      [180, 130,  30],   // antique gold
    goldLight: [218, 165,  40],   // bright gold
    maroon:    [ 90,  15,  15],   // dark maroon
    cream:     [252, 245, 225],   // parchment cream
    creamDark: [240, 228, 196],   // deeper parchment
    brown:     [ 80,  45,  10],   // warm brown text
    brownMid:  [120,  75,  25],   // medium brown
    brownLight:[165, 120,  55],   // light brown / muted
    white:     [255, 255, 255],
    black:     [  0,   0,   0],
    red:       [160,  30,  30],   // dosha red
    green:     [ 30, 110,  50],   // yoga green
    orange:    [200,  90,  10],   // highlight orange
  };

  // ── Helper: safe date format ─────────────────────────────────────────────────
  const safeDate = (raw) => {
    if (!raw) return '—';
    // raw may be "2001-05-15" or already formatted
    const d = new Date(String(raw).includes('T') ? raw : raw + 'T12:00:00');
    if (isNaN(d.getTime())) return String(raw).split('T')[0] || '—';
    return d.toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
  };

  const safeTime = (t) => {
    if (!t) return '—';
    const [h, m] = String(t).split(':');
    if (!h) return t;
    const hr = parseInt(h), mn = parseInt(m) || 0;
    const ampm = hr >= 12 ? 'PM' : 'AM';
    const h12 = hr % 12 || 12;
    return `${h12}:${String(mn).padStart(2,'0')} ${ampm}`;
  };

  const safeDeg = (d) => {
    if (d === undefined || d === null) return '—';
    return parseFloat(d).toFixed(2) + '°';
  };

  let pageNum = 1;
  let y = MT;

  // ── Decorative Helpers ───────────────────────────────────────────────────────

  // Full parchment background
  const pageBg = () => {
    doc.setFillColor(...C.cream);
    doc.rect(0, 0, W, H, 'F');
    // Subtle texture gradient via layered rects
    doc.setFillColor(245, 235, 205);
    doc.rect(0, H * 0.6, W, H * 0.4, 'F');
  };

  // Outer decorative border (temple style)
  const outerBorder = () => {
    // Outer thick border
    doc.setDrawColor(...C.maroon);
    doc.setLineWidth(1.8);
    doc.rect(6, 6, W - 12, H - 12);
    // Inner thin gold border
    doc.setDrawColor(...C.gold);
    doc.setLineWidth(0.6);
    doc.rect(9, 9, W - 18, H - 18);
    // Corner ornaments (small squares)
    const corners = [[6,6],[W-6,6],[6,H-6],[W-6,H-6]];
    doc.setFillColor(...C.maroon);
    corners.forEach(([cx,cy]) => doc.rect(cx-2, cy-2, 4, 4, 'F'));
    doc.setFillColor(...C.goldLight);
    corners.forEach(([cx,cy]) => doc.rect(cx-1, cy-1, 2, 2, 'F'));
  };

  // Lotus separator line
  const lotusLine = (yPos, wide = false) => {
    const left = wide ? ML - 4 : ML + 10;
    const right = wide ? W - MR + 4 : W - MR - 10;
    const mid = W / 2;
    doc.setDrawColor(...C.gold);
    doc.setLineWidth(0.4);
    doc.line(left, yPos, mid - 10, yPos);
    doc.line(mid + 10, yPos, right, yPos);
    // Center lotus symbol
    doc.setFontSize(9);
    doc.setTextColor(...C.saffron);
    doc.text('✿', mid, yPos + 1.5, { align: 'center' });
  };

  // Mandala dot row separator
  const dotSeparator = (yPos) => {
    const dots = ['·','·','·','✦','·','·','·'];
    doc.setFontSize(7);
    doc.setTextColor(...C.goldLight);
    doc.text(dots.join('  '), W / 2, yPos, { align: 'center' });
  };

  // Section heading with maroon background
  const sectionHeading = (title, yPos, full = false) => {
    const left = full ? 9 : ML;
    const width = full ? W - 18 : W - ML - MR;
    doc.setFillColor(...C.maroon);
    doc.rect(left, yPos - 5, width, 11, 'F');
    // Gold line under
    doc.setFillColor(...C.goldLight);
    doc.rect(left, yPos + 6, width, 1, 'F');
    doc.setFontSize(11);
    doc.setTextColor(...C.goldLight);
    doc.setFont('times', 'bold');
    doc.text(title.toUpperCase(), W / 2, yPos + 3, { align: 'center' });
    doc.setFont('times', 'normal');
    return yPos + 16;
  };

  // Sub section title (inline left)
  const subHeading = (title, yPos) => {
    doc.setFillColor(...C.saffron);
    doc.rect(ML, yPos - 4, 3, 9, 'F');
    doc.setFontSize(10);
    doc.setTextColor(...C.maroon);
    doc.setFont('times', 'bold');
    doc.text(title, ML + 6, yPos + 2);
    doc.setFont('times', 'normal');
    doc.setDrawColor(...C.goldLight);
    doc.setLineWidth(0.3);
    doc.line(ML + 6, yPos + 4, W - MR, yPos + 4);
    return yPos + 12;
  };

  // Page header (all pages except cover)
  const pageHeader = () => {
    doc.setFillColor(...C.maroon);
    doc.rect(0, 0, W, 12, 'F');
    doc.setFillColor(...C.goldLight);
    doc.rect(0, 12, W, 0.8, 'F');
    doc.setFontSize(7);
    doc.setTextColor(...C.goldLight);
    doc.setFont('times', 'italic');
    doc.text('✦  NAKSHATRA AI  ·  Vedic Jyotish Report  ✦', W / 2, 8, { align: 'center' });
    doc.setFont('times', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...C.brownLight);
    doc.text(`Page ${pageNum}`, W - MR, 8, { align: 'right' });
  };

  // Page footer
  const pageFooter = () => {
    doc.setFillColor(...C.creamDark);
    doc.rect(0, H - 12, W, 12, 'F');
    doc.setFillColor(...C.gold);
    doc.rect(0, H - 12, W, 0.6, 'F');
    doc.setFontSize(6.5);
    doc.setTextColor(...C.brownMid);
    doc.setFont('times', 'italic');
    doc.text(
      'Prepared with Vedic precision · Based on: BPHS · Phaladeepika · Jataka Parijata · Sarvartha Chintamani',
      W / 2, H - 6, { align: 'center' }
    );
    doc.setFont('times', 'normal');
  };

  // Info row: label | value
  const infoRow = (label, value, yPos, shade = false) => {
    if (shade) {
      doc.setFillColor(240, 228, 200);
      doc.rect(ML, yPos - 4, W - ML - MR, 9, 'F');
    }
    doc.setFontSize(8.5);
    doc.setTextColor(...C.brownMid);
    doc.setFont('times', 'bold');
    doc.text(label, ML + 4, yPos + 1);
    doc.setFont('times', 'normal');
    doc.setTextColor(...C.brown);
    doc.text(String(value || '—'), ML + 52, yPos + 1);
    return yPos + 9;
  };

  // New page helper
  const newPage = () => {
    doc.addPage();
    pageNum++;
    pageBg();
    outerBorder();
    pageHeader();
    pageFooter();
    y = 22;
  };

  // Overflow check helper
  const checkY = (needed = 30) => {
    if (y + needed > H - 20) newPage();
  };

  // Wrapped body text
  const bodyText = (text, yPos, opts = {}) => {
    const { color = C.brown, size = 9, maxW = W - ML - MR, indent = 0, italic = false } = opts;
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.setFont('times', italic ? 'italic' : 'normal');
    const lines = doc.splitTextToSize(String(text || ''), maxW - indent);
    lines.forEach(line => {
      checkY(6);
      doc.text(line, ML + indent, yPos);
      yPos += size * 0.45 + 1.2;
    });
    doc.setFont('times', 'normal');
    return yPos;
  };

  // ── SVG Kundli chart drawn with jsPDF ────────────────────────────────────────
  const drawKundli = (yStart, xStart, size, planets, ascendant) => {
    const S  = size;
    const Q  = S / 4;
    const cx = xStart;
    const cy = yStart;

    const SIGNS_SHORT = ['Ar','Ta','Ge','Ca','Le','Vi','Li','Sc','Sa','Cp','Aq','Pi'];
    const ascIdx = ascendant?.signIndex ?? 0;

    const houseSign = (h) => SIGNS_SHORT[(ascIdx + h - 1) % 12];

    // Build byHouse
    const byHouse = {};
    for (let i = 1; i <= 12; i++) byHouse[i] = [];
    Object.entries(planets || {}).forEach(([name, data]) => {
      const h = data.house;
      if (h && byHouse[h]) {
        const sym = { sun:'Su', moon:'Mo', mars:'Ma', mercury:'Me', jupiter:'Ju', venus:'Ve', saturn:'Sa', rahu:'Ra', ketu:'Ke' }[name] || name.slice(0,2);
        byHouse[h].push(`${sym}${data.retrograde ? '℞' : ''}`);
      }
    });

    // Draw outer square
    doc.setDrawColor(...C.maroon);
    doc.setLineWidth(0.8);
    doc.rect(cx, cy, S, S);

    // Inner square
    doc.setLineWidth(0.4);
    doc.rect(cx + Q, cy + Q, S / 2, S / 2);

    // Diagonal lines (North Indian style)
    doc.setLineWidth(0.3);
    doc.setDrawColor(...C.maroon);
    doc.line(cx, cy, cx + Q, cy + Q);
    doc.line(cx + S, cy, cx + 3*Q, cy + Q);
    doc.line(cx, cy + S, cx + Q, cy + 3*Q);
    doc.line(cx + S, cy + S, cx + 3*Q, cy + 3*Q);

    // House positions (cx relative): [centerX offset, centerY offset]
    const houseCenters = [
      [S/2,    Q * 0.5],   // H1  top center
      [S*0.82, Q * 0.25],  // H2  top right
      [S*0.88, S/2],       // H3  right top-mid — adjusted
      [S*0.82, S*0.75],    // H4  bottom right
      [S/2,    S*0.88],    // H5  bottom center — adjusted
      [S*0.18, S*0.75],    // H6  bottom left
      [S*0.12, S/2],       // H7  left mid
      [S*0.18, S*0.25],    // H8  top left
      [S*0.38, Q * 0.25],  // H9  top left-mid
      [S*0.12, Q * 0.5],   // H10 left
      [S*0.62, S*0.92],    // H11 bottom right-mid
      [S*0.88, S*0.25],    // H12 right top
    ];

    // Corrected standard North Indian centers
    const HC = [
      [S/2,      S*0.18],  // H1
      [S*0.84,   S*0.09],  // H2
      [S*0.91,   S*0.35],  // H3
      [S*0.84,   S*0.75],  // H4  — was wrong
      [S*0.50,   S*0.84],  // H5
      [S*0.16,   S*0.75],  // H6
      [S*0.09,   S*0.50],  // H7
      [S*0.16,   S*0.25],  // H8
      [S*0.38,   S*0.09],  // H9
      [S*0.09,   S*0.50],  // H10 — left mid (same as 7 in some styles)
      [S*0.62,   S*0.91],  // H11
      [S*0.91,   S*0.20],  // H12
    ];

    // Standard North Indian house center positions
    const HOUSE_POS = [
      { h:1,  x:cx+S/2,     y:cy+S*0.22  },
      { h:2,  x:cx+S*0.84,  y:cy+S*0.08  },
      { h:3,  x:cx+S*0.92,  y:cy+S*0.35  },
      { h:4,  x:cx+S*0.84,  y:cy+S*0.74  },
      { h:5,  x:cx+S*0.50,  y:cy+S*0.82  },
      { h:6,  x:cx+S*0.16,  y:cy+S*0.74  },
      { h:7,  x:cx+S*0.08,  y:cy+S*0.50  },
      { h:8,  x:cx+S*0.16,  y:cy+S*0.26  },
      { h:9,  x:cx+S*0.38,  y:cy+S*0.08  },
      { h:10, x:cx+S*0.08,  y:cy+S*0.22  },
      { h:11, x:cx+S*0.62,  y:cy+S*0.92  },
      { h:12, x:cx+S*0.62,  y:cy+S*0.08  },
    ];

    HOUSE_POS.forEach(({ h, x, y: hy }) => {
      // House number
      doc.setFontSize(6);
      doc.setTextColor(...C.brownLight);
      doc.setFont('times', 'normal');
      doc.text(String(h), x - 2, hy);

      // Sign abbreviation
      doc.setFontSize(7);
      doc.setTextColor(...C.maroon);
      doc.setFont('times', 'bold');
      doc.text(houseSign(h), x, hy + 5, { align: 'center' });

      // Planets
      doc.setFontSize(6.5);
      doc.setTextColor(...C.saffron);
      doc.setFont('times', 'bold');
      const planetsHere = byHouse[h] || [];
      planetsHere.forEach((pl, idx) => {
        doc.text(pl, x, hy + 10 + idx * 5, { align: 'center' });
      });
    });

    // ASC label
    doc.setFontSize(6);
    doc.setTextColor(...C.red);
    doc.setFont('times', 'bold');
    doc.text('ASC', cx + S/2 + 2, cy + S*0.14);
    doc.setFont('times', 'normal');
  };

  // ────────────────────────────────────────────────────────────────────────────
  // ── PAGE 1: SACRED COVER PAGE ────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────
  pageBg();

  // Deep maroon top band
  doc.setFillColor(...C.maroon);
  doc.rect(0, 0, W, 36, 'F');
  doc.setFillColor(...C.goldLight);
  doc.rect(0, 36, W, 1.5, 'F');
  doc.setFillColor(...C.saffron);
  doc.rect(0, 37.5, W, 0.5, 'F');

  // Om symbol in top band
  doc.setFontSize(22);
  doc.setTextColor(...C.goldLight);
  doc.setFont('times', 'bold');
  doc.text('ॐ', W / 2, 22, { align: 'center' });
  doc.setFont('times', 'normal');

  // App name in top band
  doc.setFontSize(8);
  doc.setTextColor(220, 180, 100);
  doc.setFont('times', 'italic');
  doc.text('NAKSHATRA AI  ·  Vedic Jyotish', W / 2, 31, { align: 'center' });
  doc.setFont('times', 'normal');

  // Decorative border
  outerBorder();

  // Ganesha illustration (SVG-style drawn with shapes)
  // Draw a simple decorative Ganesha yantra placeholder
  const gx = W / 2, gy = 80;
  // Outer lotus ring
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.5);
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const px = gx + Math.cos(angle) * 18;
    const py = gy + Math.sin(angle) * 18;
    doc.setFillColor(...C.creamDark);
    doc.ellipse(px, py, 5, 3.5, 'FD');
  }
  // Center circle with Om
  doc.setFillColor(...C.maroon);
  doc.circle(gx, gy, 12, 'F');
  doc.setDrawColor(...C.goldLight);
  doc.setLineWidth(0.8);
  doc.circle(gx, gy, 12, 'D');
  doc.circle(gx, gy, 15, 'D');
  doc.setFontSize(16);
  doc.setTextColor(...C.goldLight);
  doc.setFont('times', 'bold');
  doc.text('ॐ', gx, gy + 5, { align: 'center' });
  doc.setFont('times', 'normal');

  // Ganesha shloka panel
  const shlokaY = 104;
  doc.setFillColor(245, 228, 190);
  doc.roundedRect(ML + 15, shlokaY, W - ML - MR - 30, 36, 3, 3, 'F');
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.6);
  doc.roundedRect(ML + 15, shlokaY, W - ML - MR - 30, 36, 3, 3, 'D');

  doc.setFontSize(8);
  doc.setTextColor(...C.maroon);
  doc.setFont('times', 'bold');
  doc.text('॥ श्री गणेशाय नमः ॥', W / 2, shlokaY + 8, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setTextColor(...C.brown);
  doc.setFont('times', 'italic');
  const shloka = [
    'Vakratunda Mahakaya  Suryakoti Samaprabha',
    'Nirvighnam Kurume Deva  Sarva Karyeshu Sarvada',
  ];
  shloka.forEach((line, i) => {
    doc.text(line, W / 2, shlokaY + 18 + i * 8, { align: 'center' });
  });
  doc.setFont('times', 'normal');

  // Gold divider
  lotusLine(148, true);

  // Report title
  doc.setFillColor(...C.maroon);
  doc.rect(ML + 5, 152, W - ML - MR - 10, 18, 'F');
  doc.setFillColor(...C.goldLight);
  doc.rect(ML + 5, 170, W - ML - MR - 10, 1, 'F');
  doc.setFontSize(15);
  doc.setTextColor(...C.goldLight);
  doc.setFont('times', 'bold');
  doc.text(
    type === 'basic' ? 'VEDIC BIRTH CHART REPORT' : 'DETAILED VEDIC HOROSCOPE',
    W / 2, 165, { align: 'center' }
  );
  doc.setFont('times', 'normal');

  doc.setFontSize(9);
  doc.setTextColor(...C.brownMid);
  doc.setFont('times', 'italic');
  doc.text(
    type === 'basic' ? 'Personalised Horoscope Analysis' : 'Comprehensive Jyotish Analysis — Premium Edition',
    W / 2, 176, { align: 'center' }
  );
  doc.setFont('times', 'normal');

  // User details panel
  doc.setFillColor(248, 238, 210);
  doc.roundedRect(ML + 8, 182, W - ML - MR - 16, 64, 2, 2, 'F');
  doc.setDrawColor(...C.maroon);
  doc.setLineWidth(0.5);
  doc.roundedRect(ML + 8, 182, W - ML - MR - 16, 64, 2, 2, 'D');

  doc.setFontSize(16);
  doc.setTextColor(...C.maroon);
  doc.setFont('times', 'bold');
  doc.text(reportData.userName || 'Respected Seeker', W / 2, 196, { align: 'center' });
  doc.setFont('times', 'normal');

  lotusLine(200);

  const detailRows = [
    ['Date of Birth', safeDate(reportData.dob)],
    ['Time of Birth',  safeTime(reportData.birthTime)],
    ['Place of Birth', reportData.birthPlace || '—'],
  ];
  detailRows.forEach(([label, value], i) => {
    const rowY = 208 + i * 10;
    doc.setFontSize(8);
    doc.setTextColor(...C.brownLight);
    doc.setFont('times', 'bold');
    doc.text(label + ' :', W / 2 - 4, rowY, { align: 'right' });
    doc.setFont('times', 'normal');
    doc.setTextColor(...C.brown);
    doc.text(String(value), W / 2 + 4, rowY);
  });

  lotusLine(238);

  // Lagna / Moon / Sun row
  const trio = [
    ['Lagna', reportData.ascendant || '—'],
    ['Moon',  reportData.moonSign  || '—'],
    ['Sun',   reportData.sunSign   || '—'],
  ];
  const triW = (W - ML - MR - 16) / 3;
  trio.forEach(([label, value], i) => {
    const tx = ML + 8 + triW * i + triW / 2;
    doc.setFontSize(7);
    doc.setTextColor(...C.brownLight);
    doc.setFont('times', 'italic');
    doc.text(label, tx, 247, { align: 'center' });
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...C.maroon);
    doc.setFont('times', 'bold');
    doc.text(value, tx, 255, { align: 'center' });
    doc.setFont('times', 'normal');
    if (i < 2) {
      doc.setDrawColor(...C.goldLight);
      doc.setLineWidth(0.4);
      doc.line(ML + 8 + triW * (i + 1), 241, ML + 8 + triW * (i + 1), 258);
    }
  });

  // Nakshatra below
  doc.setFontSize(8);
  doc.setTextColor(...C.brownMid);
  doc.setFont('times', 'italic');
  doc.text(`Janma Nakshatra: ${reportData.moonNakshatra || '—'}  ·  ${reportData.ascNakshatra || ''}`, W / 2, 265, { align: 'center' });
  doc.setFont('times', 'normal');

  // Bottom footer on cover
  doc.setFillColor(...C.maroon);
  doc.rect(0, H - 18, W, 18, 'F');
  doc.setFontSize(7);
  doc.setTextColor(200, 160, 80);
  doc.setFont('times', 'italic');
  doc.text('Generated by Nakshatra AI  ·  Based on Classical Vedic Texts', W / 2, H - 10, { align: 'center' });
  doc.text('BPHS  ·  Phaladeepika  ·  Jataka Parijata  ·  Sarvartha Chintamani', W / 2, H - 4, { align: 'center' });
  doc.setFont('times', 'normal');

  // ────────────────────────────────────────────────────────────────────────────
  // ── PAGE 2: TABLE OF CONTENTS ────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────
  newPage();
  y = sectionHeading('Table of Contents', y, true);
  y += 4;

  const tocItems = type === 'basic' ? [
    ['1', 'Birth Details & Panchang'],
    ['2', 'Planetary Positions Table'],
    ['3', 'Birth Chart (Kundli)'],
    ['4', 'Ascendant Analysis'],
    ['5', 'Yogas & Doshas'],
    ['6', 'Vimshottari Dasha'],
    ['7', 'Planetary Interpretations'],
    ['8', 'Personality Overview'],
    ['9', 'Life Themes & Guidance'],
  ] : [
    ['1',  'Birth Details & Panchang'],
    ['2',  'Planetary Positions Table'],
    ['3',  'Birth Chart (Kundli)'],
    ['4',  'Ascendant (Lagna) Analysis'],
    ['5',  'Yogas in the Chart'],
    ['6',  'Doshas & Remedies'],
    ['7',  'Vimshottari Dasha Timeline'],
    ['8',  'Sun — Soul & Authority'],
    ['9',  'Moon — Mind & Emotions'],
    ['10', 'Mercury, Venus & Mars Analysis'],
    ['11', 'Jupiter & Saturn Analysis'],
    ['12', 'Rahu & Ketu — Karmic Axis'],
    ['13', 'House-by-House Analysis'],
    ['14', 'Career & Life Purpose'],
    ['15', 'Finance & Wealth Potential'],
    ['16', 'Marriage & Relationships'],
    ['17', 'Health & Vitality'],
    ['18', 'Spiritual Path & Dharma'],
    ['19', 'Recommended Remedies'],
    ['20', 'Final Life Summary'],
  ];

  tocItems.forEach(([num, title], i) => {
    checkY(10);
    const shade = i % 2 === 0;
    if (shade) {
      doc.setFillColor(245, 232, 205);
      doc.rect(ML, y - 4, W - ML - MR, 9, 'F');
    }
    // Number
    doc.setFillColor(...C.saffron);
    doc.circle(ML + 5, y + 1, 4, 'F');
    doc.setFontSize(7);
    doc.setTextColor(...C.white);
    doc.setFont('times', 'bold');
    doc.text(num, ML + 5, y + 3, { align: 'center' });
    doc.setFont('times', 'normal');
    // Title
    doc.setFontSize(9.5);
    doc.setTextColor(...C.brown);
    doc.setFont('times', shade ? 'bold' : 'normal');
    doc.text(title, ML + 14, y + 2);
    // Dots
    doc.setTextColor(...C.brownLight);
    doc.setFontSize(7);
    doc.setFont('times', 'normal');
    doc.text('· · · · · · · · · · · · · · · · · · · · · · · ·', ML + 90, y + 2);
    y += 10;
  });

  // ────────────────────────────────────────────────────────────────────────────
  // ── PAGE 3: BIRTH DETAILS + PANCHANG ─────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────
  newPage();
  y = sectionHeading('Birth Details', y, true);
  y += 2;

  // Birth panel
  doc.setFillColor(250, 240, 215);
  doc.roundedRect(ML, y, W - ML - MR, 52, 2, 2, 'F');
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.5);
  doc.roundedRect(ML, y, W - ML - MR, 52, 2, 2, 'D');
  y += 5;

  const birthRows = [
    ['Full Name',       reportData.userName || '—'],
    ['Date of Birth',   safeDate(reportData.dob)],
    ['Time of Birth',   safeTime(reportData.birthTime)],
    ['Place of Birth',  reportData.birthPlace || '—'],
    ['Age',             reportData.age ? `${reportData.age} years` : '—'],
  ];
  birthRows.forEach(([l, v], i) => {
    y = infoRow(l, v, y, i % 2 === 0);
  });
  y += 8;

  // Ascendant info panel
  doc.setFillColor(250, 240, 215);
  doc.roundedRect(ML, y, W - ML - MR, 36, 2, 2, 'F');
  doc.setDrawColor(...C.maroon);
  doc.setLineWidth(0.5);
  doc.roundedRect(ML, y, W - ML - MR, 36, 2, 2, 'D');
  y += 5;
  const lagnaRows = [
    ['Ascendant (Lagna)', `${reportData.ascendant || '—'} — ${reportData.ascNakshatra || '—'}, Pada ${reportData.ascPada || '—'}`],
    ['Moon Sign',         `${reportData.moonSign || '—'} — ${reportData.moonNakshatra || '—'}`],
    ['Sun Sign',          reportData.sunSign || '—'],
  ];
  lagnaRows.forEach(([l, v], i) => {
    y = infoRow(l, v, y, i % 2 === 0);
  });
  y += 10;

  // Panchang
  checkY(60);
  y = sectionHeading('Panchang at Birth', y, true);
  y += 4;

  // Panchang in 2-column grid
  const pItems = [
    ['Tithi',    reportData.panchang?.tithi    || '—'],
    ['Nakshatra', reportData.panchang?.nakshatra || '—'],
    ['Yoga',     reportData.panchang?.yoga     || '—'],
    ['Karana',   reportData.panchang?.karana   || '—'],
    ['Weekday',  reportData.panchang?.weekday  || '—'],
  ];
  const panW = (W - ML - MR - 8) / 2;
  pItems.forEach((item, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const px = ML + col * (panW + 8);
    const py = y + row * 18;
    doc.setFillColor(col === 0 ? 248 : 242, col === 0 ? 232 : 226, 198);
    doc.roundedRect(px, py - 4, panW, 15, 1.5, 1.5, 'F');
    doc.setDrawColor(...C.goldLight);
    doc.setLineWidth(0.3);
    doc.roundedRect(px, py - 4, panW, 15, 1.5, 1.5, 'D');
    doc.setFontSize(7);
    doc.setTextColor(...C.brownLight);
    doc.setFont('times', 'italic');
    doc.text(item[0], px + panW / 2, py + 1, { align: 'center' });
    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...C.maroon);
    doc.setFont('times', 'bold');
    doc.text(String(item[1]), px + panW / 2, py + 8, { align: 'center' });
    doc.setFont('times', 'normal');
  });
  y += Math.ceil(pItems.length / 2) * 18 + 8;

  // ────────────────────────────────────────────────────────────────────────────
  // ── PAGE 4: PLANETARY POSITIONS TABLE ────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────
  newPage();
  y = sectionHeading('Planetary Positions', y, true);
  y += 4;

  // Table header
  const cols = [ML, ML+22, ML+52, ML+72, ML+88, ML+118, ML+132, ML+150];
  const hdrs = ['Planet','Sign','Deg','Hs','Nakshatra','Pada','Retro','Status'];
  doc.setFillColor(...C.maroon);
  doc.rect(ML, y - 4, W - ML - MR, 10, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.goldLight);
  doc.setFont('times', 'bold');
  hdrs.forEach((h, i) => doc.text(h, cols[i], y + 2));
  doc.setFont('times', 'normal');
  y += 12;

  const PSYMS = { sun:'☉', moon:'☽', mars:'♂', mercury:'☿', jupiter:'♃', venus:'♀', saturn:'♄', rahu:'☊', ketu:'☋' };

  (reportData.planetTable || []).forEach((pl, idx) => {
    checkY(10);
    if (idx % 2 === 0) {
      doc.setFillColor(248, 235, 208);
      doc.rect(ML, y - 4, W - ML - MR, 9, 'F');
    }
    const sym = PSYMS[pl.name.toLowerCase()] || '•';
    const statusShort = pl.status.includes('Exalt') ? 'Exalt' : pl.status.includes('Debil') ? 'Debil' : pl.status.includes('Own') ? 'Own' : 'Normal';
    const statusColor = pl.status.includes('Exalt') ? C.green : pl.status.includes('Debil') ? C.red : pl.status.includes('Own') ? C.saffron : C.brown;

    doc.setFontSize(8);
    doc.setTextColor(...C.brown);
    doc.text(`${sym} ${pl.name}`,       cols[0], y);
    doc.setTextColor(...C.brownMid);
    doc.text(pl.sign || '—',            cols[1], y);
    doc.setTextColor(...C.brown);
    doc.text(safeDeg(pl.degrees), cols[2], y);
    doc.text(String(pl.house || '—'),   cols[3], y);
    doc.setTextColor(...C.brownMid);
    doc.text(pl.nakshatra || '—',       cols[4], y);
    doc.text(String(pl.pada || '—'),    cols[5], y);
    doc.setTextColor(pl.retrograde ? C.red[0] : C.brownLight[0], pl.retrograde ? C.red[1] : C.brownLight[1], pl.retrograde ? C.red[2] : C.brownLight[2]);
    doc.text(pl.retrograde ? 'Yes ℞' : 'No', cols[6], y);
    doc.setTextColor(...statusColor);
    doc.setFont('times', 'bold');
    doc.text(statusShort, cols[7], y);
    doc.setFont('times', 'normal');
    y += 9;
  });

  // Status legend
  y += 4;
  doc.setFontSize(7);
  doc.setTextColor(...C.brownLight);
  doc.setFont('times', 'italic');
  doc.text('Exalt = Exalted  ·  Debil = Debilitated  ·  Own = Own Sign  ·  ℞ = Retrograde', ML, y);
  doc.setFont('times', 'normal');

  // ────────────────────────────────────────────────────────────────────────────
  // ── PAGE 5: KUNDLI CHART ─────────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────
  newPage();
  y = sectionHeading('Birth Chart — Janma Kundli', y, true);
  y += 6;

  // Draw Kundli centered
  const kundliSize = 110;
  const kx = (W - kundliSize) / 2;
  drawKundli(y, kx, kundliSize, reportData.planetsByHouse ? null : null, reportData);
  // Pass actual planets from reportData
  // Rebuild with correct data
  const planetsForKundli = {};
  (reportData.planetTable || []).forEach(pl => {
    planetsForKundli[pl.name.toLowerCase()] = {
      house: pl.house,
      retrograde: pl.retrograde,
    };
  });

  // Redraw with actual planet data
  doc.setFillColor(...C.cream);
  doc.rect(kx, y, kundliSize, kundliSize, 'F');
  drawKundli(y, kx, kundliSize, planetsForKundli, { signIndex: reportData.ascSignIdx || 0 });

  // Ascendant sign index fix
  const ascSigns = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
  const ascIdx2 = ascSigns.indexOf(reportData.ascendant);
  doc.setFillColor(...C.cream);
  doc.rect(kx - 2, y - 2, kundliSize + 4, kundliSize + 4, 'F');
  drawKundli(y, kx, kundliSize, planetsForKundli, { signIndex: ascIdx2 >= 0 ? ascIdx2 : 0 });

  y += kundliSize + 8;

  // Planet legend below chart
  const legCols = 3;
  const legW = (W - ML - MR) / legCols;
  doc.setFontSize(7);
  Object.entries(PSYMS).forEach(([name, sym], i) => {
    const col = i % legCols;
    const row = Math.floor(i / legCols);
    const lx = ML + col * legW;
    const ly = y + row * 8;
    checkY(8);
    doc.setTextColor(...C.saffron);
    doc.text(sym, lx, ly);
    doc.setTextColor(...C.brown);
    doc.text(' = ' + name.charAt(0).toUpperCase() + name.slice(1), lx + 5, ly);
  });
  y += Math.ceil(Object.keys(PSYMS).length / legCols) * 8 + 6;

  // ────────────────────────────────────────────────────────────────────────────
  // ── PAGE 6: LAGNA ANALYSIS ───────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────
  newPage();
  y = sectionHeading(`${reportData.ascendant} Lagna — Ascendant Analysis`, y, true);
  y += 4;

  // Lagna card
  doc.setFillColor(250, 238, 210);
  doc.roundedRect(ML, y, W - ML - MR, 22, 2, 2, 'F');
  doc.setDrawColor(...C.saffron);
  doc.setLineWidth(0.4);
  doc.roundedRect(ML, y, W - ML - MR, 22, 2, 2, 'D');
  doc.setFontSize(8);
  doc.setTextColor(...C.brownLight);
  doc.setFont('times', 'italic');
  const si = reportData.signInfo || {};
  doc.text(`Lord: ${si.lord||'—'}   ·   Nature: ${si.nature||'—'}   ·   Body Part: ${si.body||'—'}`, W/2, y + 10, { align:'center' });
  doc.setFont('times', 'normal');
  y += 28;

  y = bodyText(reportData.lagnaInterp || '', y, { size: 9.5 });
  y += 8;
  dotSeparator(y); y += 10;

  // ────────────────────────────────────────────────────────────────────────────
  // ── PAGE 7: YOGAS & DOSHAS ───────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────
  if ((reportData.yogas || []).length > 0) {
    newPage();
    y = sectionHeading('Yogas & Doshas in Your Chart', y, true);
    y += 6;

    for (const yoga of (reportData.yogas || [])) {
      checkY(50);
      const isDosha = yoga.type?.includes('Dosha');
      const panelColor = isDosha ? [255, 235, 225] : [235, 248, 230];
      const borderColor = isDosha ? C.red : C.green;
      const accentColor = isDosha ? C.red : C.green;

      const descLines = doc.splitTextToSize(yoga.desc || '', W - ML - MR - 16);
      const panelH = 40 + descLines.length * 5.5;
      checkY(panelH + 6);

      doc.setFillColor(...panelColor);
      doc.roundedRect(ML, y, W - ML - MR, panelH, 2, 2, 'F');
      doc.setDrawColor(...borderColor);
      doc.setLineWidth(0.5);
      doc.roundedRect(ML, y, W - ML - MR, panelH, 2, 2, 'D');

      // Left accent bar
      doc.setFillColor(...accentColor);
      doc.rect(ML, y, 3, panelH, 'F');

      // Type badge
      doc.setFillColor(...accentColor);
      doc.roundedRect(W - MR - 28, y + 4, 26, 8, 1, 1, 'F');
      doc.setFontSize(6.5);
      doc.setTextColor(...C.white);
      doc.setFont('times', 'bold');
      doc.text(yoga.type || '', W - MR - 15, y + 9.5, { align: 'center' });
      doc.setFont('times', 'normal');

      // Yoga name
      doc.setFontSize(11);
      doc.setTextColor(...accentColor);
      doc.setFont('times', 'bold');
      doc.text(yoga.name, ML + 8, y + 12);
      doc.setFont('times', 'normal');

      // Source text
      doc.setFontSize(7.5);
      doc.setTextColor(...C.brownLight);
      doc.setFont('times', 'italic');
      doc.text('Source: BPHS · Phaladeepika · Jataka Parijata', ML + 8, y + 20);
      doc.setFont('times', 'normal');

      // Description
      doc.setFontSize(8.5);
      doc.setTextColor(...C.brown);
      let dy = y + 28;
      descLines.forEach(line => { doc.text(line, ML + 8, dy); dy += 5.5; });

      y += panelH + 8;
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // ── PAGE 8: DASHA TIMELINE ───────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────
  if (reportData.currentDasha) {
    newPage();
    y = sectionHeading('Vimshottari Dasha — Timeline', y, true);
    y += 4;

    // Current dasha highlight
    doc.setFillColor(255, 240, 210);
    doc.roundedRect(ML, y, W - ML - MR, 30, 2, 2, 'F');
    doc.setDrawColor(...C.saffron);
    doc.setLineWidth(0.7);
    doc.roundedRect(ML, y, W - ML - MR, 30, 2, 2, 'D');
    doc.setFontSize(7.5);
    doc.setTextColor(...C.brownLight);
    doc.setFont('times', 'italic');
    doc.text('CURRENT MAHADASHA PERIOD', W / 2, y + 8, { align: 'center' });
    doc.setFont('times', 'normal');
    doc.setFontSize(16);
    doc.setTextColor(...C.maroon);
    doc.setFont('times', 'bold');
    doc.text(`${reportData.currentDasha.planet} Mahadasha`, W / 2, y + 20, { align: 'center' });
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...C.brownMid);
    doc.text(
      `${String(reportData.currentDasha.startDate||'').slice(0,10)}  →  ${String(reportData.currentDasha.endDate||'').slice(0,10)}`,
      W / 2, y + 28, { align: 'center' }
    );
    y += 38;

    // Dasha interpretation
    if (reportData.dashaInterp) {
      checkY(20);
      y = bodyText(reportData.dashaInterp, y, { size: 9.5, italic: true, color: C.brownMid });
      y += 8;
    }

    // Timeline bar
    y = subHeading('Complete Dasha Timeline', y);

    const now = new Date();
    for (const d of (reportData.dashaSequence || [])) {
      checkY(12);
      const isActive = new Date(String(d.startDate)) <= now && now < new Date(String(d.endDate));
      const barH = isActive ? 14 : 10;

      if (isActive) {
        doc.setFillColor(255, 235, 195);
        doc.roundedRect(ML, y - 4, W - ML - MR, barH + 2, 1.5, 1.5, 'F');
        doc.setDrawColor(...C.saffron);
        doc.setLineWidth(0.5);
        doc.roundedRect(ML, y - 4, W - ML - MR, barH + 2, 1.5, 1.5, 'D');
      } else {
        if ((reportData.dashaSequence.indexOf(d)) % 2 === 0) {
          doc.setFillColor(248, 238, 215);
          doc.rect(ML, y - 4, W - ML - MR, barH, 'F');
        }
      }

      // Planet dot
      doc.setFillColor(...(isActive ? C.saffron : C.brownLight));
      doc.circle(ML + 6, y + barH / 2 - 4, 3, 'F');
      doc.setFontSize(isActive ? 10 : 8.5);
      doc.setTextColor(...(isActive ? C.maroon : C.brown));
      doc.setFont('times', isActive ? 'bold' : 'normal');
      doc.text(d.planet, ML + 14, y + 1);
      if (isActive) {
        doc.setFillColor(...C.saffron);
        doc.roundedRect(ML + 44, y - 2, 16, 6, 1, 1, 'F');
        doc.setFontSize(6);
        doc.setTextColor(...C.white);
        doc.setFont('times', 'bold');
        doc.text('NOW', ML + 52, y + 3, { align: 'center' });
        doc.setFont('times', 'normal');
      }
      doc.setFont('times', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...C.brownLight);
      doc.text(
        `${String(d.startDate||'').slice(0,7)}  →  ${String(d.endDate||'').slice(0,7)}`,
        W - MR, y + 1, { align: 'right' }
      );
      if (d.years) {
        doc.text(`${d.years} yrs`, W - MR - 35, y + 1);
      }
      y += isActive ? 14 : 11;
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // ── PAGE(S): PLANETARY INTERPRETATIONS ──────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────
  if ((reportData.planetInterpretations || []).length > 0) {
    newPage();
    y = sectionHeading('Planetary Interpretations', y, true);
    y += 2;
    doc.setFontSize(7.5);
    doc.setTextColor(...C.brownLight);
    doc.setFont('times', 'italic');
    doc.text('Classical sources: BPHS · Phaladeepika · Jataka Parijata · Sarvartha Chintamani · Mansagari', W/2, y, { align:'center' });
    doc.setFont('times', 'normal');
    y += 8;

    const PLANET_DESCRIPTIONS = {
      sun: 'Soul, authority, father, government, vitality',
      moon: 'Mind, emotions, mother, public, nourishment',
      mars: 'Courage, energy, siblings, property, action',
      mercury: 'Intelligence, communication, business, trade',
      jupiter: 'Wisdom, fortune, children, dharma, expansion',
      venus: 'Love, beauty, luxury, arts, relationships',
      saturn: 'Karma, discipline, longevity, service, time',
      rahu: 'Ambition, foreign, technology, obsession, illusion',
      ketu: 'Spirituality, detachment, past karma, liberation',
    };

    for (const pl of reportData.planetInterpretations) {
      if (!pl.houseInterpretation) continue;
      checkY(55);

      const sym = PSYMS[pl.name.toLowerCase()] || '•';
      const statusColor = pl.status.includes('Exalt') ? C.green : pl.status.includes('Debil') ? C.red : pl.status.includes('Own') ? C.saffron : C.maroon;
      const interpLines = doc.splitTextToSize(pl.houseInterpretation, W - ML - MR - 8);
      const cardH = Math.max(44, 44 + (interpLines.length - 4) * 5);
      checkY(cardH + 8);

      // Card background
      doc.setFillColor(250, 241, 218);
      doc.roundedRect(ML, y, W - ML - MR, cardH, 2, 2, 'F');
      doc.setDrawColor(...C.goldLight);
      doc.setLineWidth(0.4);
      doc.roundedRect(ML, y, W - ML - MR, cardH, 2, 2, 'D');

      // Planet circle
      doc.setFillColor(...C.maroon);
      doc.circle(ML + 12, y + 12, 9, 'F');
      doc.setDrawColor(...C.goldLight);
      doc.setLineWidth(0.5);
      doc.circle(ML + 12, y + 12, 9, 'D');
      doc.setFontSize(13);
      doc.setTextColor(...C.goldLight);
      doc.text(sym, ML + 12, y + 16, { align: 'center' });

      // Planet name
      doc.setFontSize(12);
      doc.setTextColor(...C.maroon);
      doc.setFont('times', 'bold');
      doc.text(pl.name, ML + 26, y + 10);
      doc.setFont('times', 'normal');

      // Position info
      doc.setFontSize(8);
      doc.setTextColor(...C.brownMid);
      doc.text(`${pl.sign}  ${safeDeg(pl.degrees)}  ·  House ${pl.house}  ·  ${pl.nakshatra || ''}  Pada ${pl.pada || ''}`, ML + 26, y + 18);

      // Status badge
      doc.setFillColor(...statusColor);
      doc.roundedRect(W - MR - 32, y + 5, 30, 8, 1, 1, 'F');
      doc.setFontSize(6.5);
      doc.setTextColor(...C.white);
      doc.setFont('times', 'bold');
      doc.text(pl.status.split('(')[0].trim().slice(0,18), W - MR - 17, y + 10.5, { align: 'center' });
      doc.setFont('times', 'normal');

      // Planet description
      const pdesc = PLANET_DESCRIPTIONS[pl.name.toLowerCase()] || '';
      doc.setFontSize(7.5);
      doc.setTextColor(...C.brownLight);
      doc.setFont('times', 'italic');
      doc.text(pdesc, ML + 26, y + 26);
      doc.setFont('times', 'normal');

      // Divider
      doc.setDrawColor(...C.goldLight);
      doc.setLineWidth(0.3);
      doc.line(ML + 6, y + 30, W - MR - 6, y + 30);

      // Interpretation text
      doc.setFontSize(8.5);
      doc.setTextColor(...C.brown);
      let ty = y + 36;
      interpLines.forEach(line => { doc.text(line, ML + 6, ty); ty += 5; });

      y += cardH + 8;
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // ── DETAILED REPORT EXTRA SECTIONS ───────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────
  if (type === 'detailed') {
    const extraSections = [
      ['Career Predictions & Life Purpose',   reportData.careerPrediction],
      ['Finance & Wealth Potential',           reportData.financePrediction],
      ['Marriage & Relationship Analysis',     reportData.marriagePrediction],
      ['Health & Vitality',                    reportData.healthPrediction],
      ['Spiritual Path & Dharma',              reportData.spiritualPath],
    ];

    for (const [title, content] of extraSections) {
      if (!content) continue;
      newPage();
      y = sectionHeading(title, y, true);
      y += 6;
      y = bodyText(content, y, { size: 9.5 });
      y += 8;
    }

    // Remedies
    if (reportData.aiRemedies || (reportData.remedies || []).length > 0) {
      newPage();
      y = sectionHeading('Recommended Remedies', y, true);
      y += 4;

      // If Gemini generated personalised remedies — use them as flowing text
      if (reportData.aiRemedies) {
        doc.setFontSize(8);
        doc.setTextColor(...C.brownLight);
        doc.setFont('times', 'italic');
        doc.text('Personalised remedies prescribed by Vedic Jyotish analysis of your specific chart:', W / 2, y, { align: 'center' });
        doc.setFont('times', 'normal');
        y += 10;

        // Gold intro panel
        doc.setFillColor(252, 243, 225);
        doc.roundedRect(ML, y, W - ML - MR, 12, 2, 2, 'F');
        doc.setDrawColor(...C.saffron);
        doc.setLineWidth(0.4);
        doc.roundedRect(ML, y, W - ML - MR, 12, 2, 2, 'D');
        doc.setFontSize(8);
        doc.setTextColor(...C.maroon);
        doc.setFont('times', 'italic');
        doc.text('॥ औषधं जाह्नवीतोयं वैद्यो नारायणो हरिः ॥', W / 2, y + 8, { align: 'center' });
        doc.setFont('times', 'normal');
        y += 18;

        y = bodyText(reportData.aiRemedies, y, { size: 9.5 });

      } else {
        // Fallback: structured remedy cards
        doc.setFontSize(8);
        doc.setTextColor(...C.brownLight);
        doc.setFont('times', 'italic');
        doc.text('As prescribed by classical Vedic Jyotish texts and tradition:', W / 2, y, { align: 'center' });
        doc.setFont('times', 'normal');
        y += 10;

        for (const rem of reportData.remedies) {
          checkY(50);
          const remLines = doc.splitTextToSize(rem.remedy || '', W - ML - MR - 14);
          const remH = 40 + remLines.length * 5;
          checkY(remH + 6);

          doc.setFillColor(252, 243, 225);
          doc.roundedRect(ML, y, W - ML - MR, remH, 2, 2, 'F');
          doc.setDrawColor(...C.saffron);
          doc.setLineWidth(0.5);
          doc.roundedRect(ML, y, W - ML - MR, remH, 2, 2, 'D');
          doc.setFillColor(...C.saffron);
          doc.rect(ML, y, 3, remH, 'F');

          doc.setFontSize(10.5);
          doc.setTextColor(...C.maroon);
          doc.setFont('times', 'bold');
          doc.text(rem.planet, ML + 8, y + 10);
          doc.setFont('times', 'normal');

          doc.setFontSize(7.5);
          doc.setTextColor(...C.red);
          doc.setFont('times', 'italic');
          doc.text(rem.issue, ML + 8, y + 18);
          doc.setFont('times', 'normal');

          doc.setDrawColor(...C.goldLight);
          doc.setLineWidth(0.3);
          doc.line(ML + 6, y + 22, W - MR - 6, y + 22);

          doc.setFontSize(8.5);
          doc.setTextColor(...C.brown);
          let ry = y + 28;
          remLines.forEach(line => { doc.text(line, ML + 8, ry); ry += 5; });
          y += remH + 8;
        }
      }
    }

    // Final Life Summary
    if (reportData.lifeSummary) {
      newPage();
      y = sectionHeading('Final Life Summary', y, true);
      y += 6;
      lotusLine(y); y += 10;

      doc.setFillColor(250, 240, 215);
      doc.roundedRect(ML, y, W - ML - MR, 14, 2, 2, 'F');
      doc.setFontSize(10);
      doc.setTextColor(...C.maroon);
      doc.setFont('times', 'italic');
      doc.text(`Dear ${reportData.userName || 'Respected Seeker'},`, W / 2, y + 9, { align: 'center' });
      doc.setFont('times', 'normal');
      y += 20;

      const summaryText = reportData.lifeSummary.replace(/^Dear.*?,\n\n/, '');
      y = bodyText(summaryText, y, { size: 9.5 });
      y += 10;

      lotusLine(y); y += 12;

      // Closing blessing
      doc.setFontSize(9);
      doc.setTextColor(...C.maroon);
      doc.setFont('times', 'italic');
      doc.text('॥ सर्वे भवन्तु सुखिनः · सर्वे सन्तु निरामयाः ॥', W / 2, y, { align: 'center' });
      doc.text('May all be happy · May all be free from suffering', W / 2, y + 7, { align: 'center' });
      doc.setFont('times', 'normal');
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // ── FINAL BACK PAGE (basic report closing) ───────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────
  if (type === 'basic') {
    newPage();
    y = sectionHeading('Life Themes & Guidance', y, true);
    y += 8;

    if (reportData.lagnaInterp) {
      y = subHeading('Personality Overview', y);
      const shortInterp = reportData.lagnaInterp.split('. ').slice(0, 3).join('. ') + '.';
      y = bodyText(shortInterp, y, { size: 9.5 });
      y += 10;
    }

    dotSeparator(y); y += 10;

    // Life themes from yogas
    const beneficYogas = (reportData.yogas || []).filter(yg => !yg.type?.includes('Dosha'));
    if (beneficYogas.length > 0) {
      y = subHeading('Special Blessings in Your Chart', y);
      beneficYogas.forEach(yg => {
        checkY(20);
        doc.setFontSize(9);
        doc.setTextColor(...C.saffron);
        doc.setFont('times', 'bold');
        doc.text(`✦  ${yg.name}`, ML + 4, y);
        doc.setFont('times', 'normal');
        y += 7;
        const shortDesc = (yg.desc || '').split('. ')[0] + '.';
        y = bodyText(shortDesc, y, { size: 8.5, indent: 8, color: C.brownMid });
        y += 5;
      });
      y += 6;
    }

    // Current dasha guidance
    if (reportData.currentDasha && reportData.dashaInterp) {
      checkY(30);
      dotSeparator(y); y += 8;
      y = subHeading(`Current Dasha: ${reportData.currentDasha.planet}`, y);
      const shortDasha = (reportData.dashaInterp || '').split('. ').slice(0, 2).join('. ') + '.';
      y = bodyText(shortDasha, y, { size: 9.5 });
      y += 10;
    }

    // Closing
    checkY(40);
    lotusLine(y, true); y += 12;
    doc.setFontSize(9);
    doc.setTextColor(...C.maroon);
    doc.setFont('times', 'italic');
    doc.text('॥ सर्वे भवन्तु सुखिनः ॥', W / 2, y, { align: 'center' });
    doc.text('May all be happy · May all be blessed', W / 2, y + 8, { align: 'center' });
    doc.setFont('times', 'normal');
    y += 20;
    doc.setFontSize(8);
    doc.setTextColor(...C.brownLight);
    doc.text('With Cosmic Blessings — Nakshatra AI · Vedic Jyotish', W / 2, y, { align: 'center' });
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  const filename = `NakshatraAI_${type === 'basic' ? 'Basic' : 'Detailed'}_Report_${(reportData.userName || 'Chart').replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
  return filename;
}


// ── Main Chart Screen ─────────────────────────────────────────────────────────
const ChartScreen = ({ onAskAI }) => {
  const [chartTab, setChartTab] = useState('kundli');
  const [chart, setChart]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [houseInfo, setHouseInfo]         = useState(null);
  const [reportLoading, setReportLoading] = useState(null); // 'basic'|'detailed'|null
  const [reportMsg, setReportMsg]         = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);

  const userName   = LS.get('nakshatra_user_name') || 'Seeker';
  const birthPlace = LS.get('nakshatra_birthplace') || '';
  const dob        = LS.get('nakshatra_dob')        || '';
  const birthTime  = LS.get('nakshatra_time')       || '';

  useEffect(() => {
    const cached = LS.getJSON('nakshatra_chart');
    if (cached) { setChart(cached); setLoading(false); return; }
    const API   = process.env.REACT_APP_API_URL || 'http://localhost:4000';
    const token = LS.get('nakshatra_token');
    if (!token) { setError('Please log in and generate your chart first.'); setLoading(false); return; }
    fetch(`${API}/api/chart/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.text())
      .then(raw => {
        try {
          const data = JSON.parse(raw);
          const chartPayload = data?.chart?.chart_data || data?.chart || null;
          if (chartPayload) { setChart(chartPayload); LS.setJSON('nakshatra_chart', chartPayload); }
          else setError('No chart found. Please generate your birth chart first.');
        } catch { setError('Could not load chart data. Please try again.'); }
        setLoading(false);
      })
      .catch(() => { setError('Connection error. Please check your internet.'); setLoading(false); });
  }, []);

  const handleHouseClick = (house, sign, planetsHere) => {
    setHouseInfo({ house, sign, planetsHere });
  };

  const downloadReport = async (type) => {
    setReportLoading(type);
    setReportMsg('');
    const API   = process.env.REACT_APP_API_URL || 'http://localhost:4000';
    const token = LS.get('nakshatra_token');
    try {
      const res  = await fetch(`${API}/api/chart/report`, {
        method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify({ type }),
      });
      const raw  = await res.text();
      let data;
      try { data = JSON.parse(raw); } catch { setReportMsg('Server error. Please try again.'); setReportLoading(null); return; }
      if (!res.ok) {
        if (res.status === 402) setReportMsg(`Need ${data.creditsRequired} credits. You have ${data.creditsAvailable}. Please purchase more.`);
        else setReportMsg(data.error || 'Report generation failed.');
        setReportLoading(null); return;
      }
      // Generate PDF
      setReportMsg('✦ Gemini AI is writing your personalised report... This takes 30–60 seconds. Please wait.');
      const filename = await generatePDF(data.reportData, type, userName);
      setReportMsg(`✓ ${type === 'basic' ? 'Basic (5 credits)' : 'Detailed (10 credits)'} report downloaded! ${data.creditsRemaining} credits remaining.`);
      // Update credits in localStorage
      if (typeof data.creditsRemaining === 'number') LS.set('nakshatra_credits', String(data.creditsRemaining));
    } catch (err) {
      setReportMsg(`Error: ${err.message}`);
    }
    setReportLoading(null);
  };

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', zIndex:1 }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:50, height:50, borderRadius:'50%', border:'2px solid var(--gold)', borderTopColor:'transparent', margin:'0 auto 20px', animation:'spin 1s linear infinite' }}/>
        <p className="cormorant" style={{ color:'var(--muted)', fontStyle:'italic' }}>Reading the stars...</p>
      </div>
    </div>
  );

  if (error || !chart) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:32, position:'relative', zIndex:1 }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:40, marginBottom:16 }}>⚠</div>
        <p style={{ color:'var(--muted)', fontSize:15, lineHeight:1.6 }}>{error || 'Chart not available.'}</p>
      </div>
    </div>
  );

  const ascendant    = chart.ascendant    || {};
  const planets      = chart.planets      || {};
  const currentDasha = chart.currentDasha || null;
  const dashaSeq     = chart.dashaSequence|| [];
  const planetList   = Object.entries(planets);

  return (
    <div style={{ position:'relative', zIndex:1, paddingBottom:90 }}>

      {/* Header */}
      <div style={{ padding:'52px 20px 16px', background:'linear-gradient(180deg, var(--card) 0%, transparent 100%)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
          <div>
            <div style={{ fontSize:11, color:'var(--gold)', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4 }}>Vedic Birth Chart</div>
            <h2 className="cinzel" style={{ fontSize:18, color:'var(--gold2)' }}>{userName}</h2>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:11, color:'var(--gold)', marginBottom:2 }}>Lahiri · Whole Sign</div>
            <div style={{ fontSize:10, color:'var(--muted)' }}>{ascendant?.nakshatra?.name || ''}</div>
          </div>
        </div>
        <p style={{ fontSize:12, color:'var(--muted)' }}>
          {dob}{birthTime ? ` · ${birthTime}` : ''}{birthPlace ? ` · ${birthPlace}` : ''}
        </p>
      </div>

      {/* Lagna + Moon + Sun pills */}
      <div style={{ padding:'0 16px 16px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
          {[
            { label:'Ascendant', value:ascendant?.sign,     sym:SIGN_GLYPHS[ascendant?.sign] || '✦' },
            { label:'Moon',      value:planets?.moon?.sign, sym:'☽' },
            { label:'Sun',       value:planets?.sun?.sign,  sym:'☉' },
          ].map(item => (
            <div key={item.label} className="card" style={{ padding:'12px 8px', textAlign:'center' }}>
              <div style={{ fontSize:18, color:'var(--gold)', marginBottom:4 }}>{item.sym}</div>
              <div className="cinzel" style={{ fontSize:9, color:'var(--gold2)', marginBottom:3 }}>{item.value || '—'}</div>
              <div style={{ fontSize:8, color:'var(--muted)', letterSpacing:'0.06em', textTransform:'uppercase' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Tabs */}
      <div style={{ padding:'0 16px', marginBottom:16 }}>
        <div style={{ display:'flex', gap:6, overflowX:'auto' }}>
          {[
            { id:'kundli',   label:'🔵 Kundli' },
            { id:'planets',  label:'Planets' },
            { id:'nakshatras', label:'Nakshatras' },
            { id:'dasha',    label:'Dasha' },
          ].map(t => (
            <button key={t.id} onClick={() => setChartTab(t.id)}
              style={{ flexShrink:0, padding:'8px 14px', border:chartTab===t.id ? '1px solid var(--gold)' : '1px solid var(--border)', borderRadius:20, background:chartTab===t.id ? 'rgba(201,169,110,0.1)' : 'transparent', color:chartTab===t.id ? 'var(--gold)' : 'var(--muted)', fontSize:10, letterSpacing:'0.06em', cursor:'pointer', fontFamily:'Jost' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Kundli Tab — Authentic North Indian Chart */}
      {chartTab === 'kundli' && (
        <div style={{ padding:'0 16px' }}>
          <div style={{ marginBottom:12, textAlign:'center' }}>
            <p style={{ fontSize:11, color:'var(--muted)' }}>Tap any house to see planets & their effects</p>
          </div>
          <KundliChart planets={planets} ascendant={ascendant} onHouseClick={handleHouseClick} />
          <div style={{ marginTop:16 }}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
              {Object.entries(planets).map(([name, data]) => (
                <div key={name} style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', background:'var(--card)', borderRadius:20, border:'1px solid var(--border)' }}>
                  <span style={{ fontSize:12, color:PLANET_COLORS[name] || '#e8e4da' }}>{PLANET_SYMBOLS[name]}</span>
                  <span style={{ fontSize:10, color:'var(--text)', textTransform:'capitalize' }}>{name}</span>
                  <span style={{ fontSize:10, color:'var(--muted)' }}>H{data.house}</span>
                  {data.retrograde && <span style={{ fontSize:8, color:'var(--rose)' }}>℞</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Planets Tab */}
      {chartTab === 'planets' && (
        <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:8 }}>
          {planetList.map(([name, data]) => (
            <div key={name} className="card" style={{ padding:'12px 16px', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:`radial-gradient(circle at 35% 35%, ${PLANET_COLORS[name]||'#888'}, ${PLANET_COLORS[name]||'#888'}44)`, border:`1.5px solid ${PLANET_COLORS[name]||'#888'}66`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                {PLANET_SYMBOLS[name] || '•'}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div className="cormorant" style={{ fontSize:15, color:'var(--text)', fontWeight:500, textTransform:'capitalize' }}>
                  {name} {data.retrograde && <span style={{ fontSize:10, color:'var(--rose)' }}>℞</span>}
                </div>
                <div style={{ fontSize:12, color:'var(--muted)' }}>{data.sign} {data.degrees ? `${data.degrees.toFixed(2)}°` : ''}</div>
                {data.nakshatra && <div style={{ fontSize:11, color:'var(--gold)', marginTop:2 }}>{data.nakshatra.name} · Pada {data.nakshatra.pada}</div>}
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ fontSize:12, color:'var(--gold2)', background:'rgba(201,169,110,0.1)', padding:'4px 10px', borderRadius:20 }}>H{data.house}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Nakshatras Tab */}
      {chartTab === 'nakshatras' && (
        <div style={{ padding:'0 16px' }}>
          <div className="card" style={{ padding:18 }}>
            {planetList.filter(([,d]) => d.nakshatra).map(([name, data]) => (
              <div key={name} style={{ padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                  <span style={{ fontSize:16, color:PLANET_COLORS[name]||'#e8e4da' }}>{PLANET_SYMBOLS[name]}</span>
                  <span className="cormorant" style={{ fontSize:15, color:'var(--text)', fontWeight:500, textTransform:'capitalize' }}>{name}</span>
                </div>
                <div className="cormorant" style={{ fontSize:18, color:'var(--gold2)', marginBottom:2 }}>{data.nakshatra.name}</div>
                <div style={{ fontSize:11, color:'var(--muted)' }}>Pada {data.nakshatra.pada} · Lord: {data.nakshatra.lord} · {data.sign}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dasha Tab */}
      {chartTab === 'dasha' && (
        <div style={{ padding:'0 16px' }}>
          {currentDasha && (
            <div className="card" style={{ padding:'14px 18px', marginBottom:12, background:'linear-gradient(135deg, rgba(201,123,154,0.1), rgba(201,169,110,0.06))', borderColor:'rgba(201,123,154,0.25)' }}>
              <div style={{ fontSize:10, color:'var(--rose)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:6 }}>Current Mahadasha</div>
              <div className="cormorant" style={{ fontSize:22, color:'var(--text)', fontWeight:500 }}>{currentDasha.planet} Mahadasha</div>
              <div style={{ fontSize:12, color:'var(--muted)', marginTop:4 }}>{currentDasha.startDate} → {currentDasha.endDate}</div>
            </div>
          )}
          <div className="card" style={{ padding:18 }}>
            <div style={{ fontSize:10, color:'var(--gold)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:14 }}>Vimshottari Dasha Timeline</div>
            {dashaSeq.map((d, i) => {
              const now = new Date();
              const isActive = new Date(d.startDate) <= now && now < new Date(d.endDate);
              return (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)', opacity:isActive ? 1 : 0.6 }}>
                  <div>
                    <span className="cormorant" style={{ fontSize:17, color:isActive ? 'var(--gold)' : 'var(--text)', fontWeight:isActive ? 500 : 300 }}>{d.planet}</span>
                    {isActive && <span style={{ marginLeft:8, fontSize:9, background:'var(--gold)', color:'var(--midnight)', padding:'2px 7px', borderRadius:20, fontWeight:700 }}>NOW</span>}
                  </div>
                  <div style={{ textAlign:'right', fontSize:11, color:'var(--muted)' }}>
                    <div>{String(d.startDate||'').slice(0,7)} → {String(d.endDate||'').slice(0,7)}</div>
                    {d.years && <div style={{ fontSize:10 }}>{d.years} yrs</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Download Reports Section ───────────────────────────────────────── */}
      <div style={{ margin:'24px 16px 0', padding:20, background:'var(--card)', border:'1px solid var(--border)', borderRadius:16 }}>
        <div className="cinzel" style={{ fontSize:11, color:'var(--gold)', letterSpacing:'0.12em', marginBottom:4 }}>✦ DOWNLOAD YOUR REPORT</div>
        <p style={{ fontSize:12, color:'var(--muted)', marginBottom:16, lineHeight:1.5 }}>
          Receive your personalized Vedic Jyotish report as a beautifully designed PDF — based on classical texts.
        </p>

        {reportMsg && (
          <div style={{ padding:'10px 14px', marginBottom:14, background: reportMsg.startsWith('✓') ? 'rgba(100,180,100,0.1)' : 'rgba(200,100,100,0.1)', border:`1px solid ${reportMsg.startsWith('✓') ? 'rgba(100,180,100,0.3)' : 'rgba(200,100,100,0.3)'}`, borderRadius:10, fontSize:12, color: reportMsg.startsWith('✓') ? '#90d490' : 'var(--rose)' }}>
            {reportMsg}
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {/* Basic Report */}
          <div style={{ padding:'14px 16px', border:'1px solid var(--border)', borderRadius:12, background:'rgba(201,169,110,0.04)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
              <div>
                <div className="cormorant" style={{ fontSize:17, color:'var(--gold2)', fontWeight:500 }}>Basic Report</div>
                <div style={{ fontSize:11, color:'var(--muted)', marginTop:2 }}>8–9 pages · Chart, planets, lagna, dasha</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:13, color:'var(--gold)', fontWeight:600 }}>5 credits</div>
                <div style={{ fontSize:10, color:'var(--muted)' }}>≈ ₹99</div>
              </div>
            </div>
            <button onClick={() => downloadReport('basic')} disabled={!!reportLoading}
              style={{ width:'100%', padding:'10px', border:'1px solid var(--gold)', borderRadius:10, background: reportLoading === 'basic' ? 'rgba(201,169,110,0.15)' : 'rgba(201,169,110,0.08)', color:'var(--gold)', fontSize:12, cursor: reportLoading ? 'not-allowed' : 'pointer', fontFamily:'Jost', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              {reportLoading === 'basic' ? <><div style={{ width:14, height:14, borderRadius:'50%', border:'2px solid var(--gold)', borderTopColor:'transparent', animation:'spin 1s linear infinite' }}/> Generating...</> : '⬇ Download Basic Report'}
            </button>
          </div>

          {/* Detailed Report */}
          <div style={{ padding:'14px 16px', border:'1px solid rgba(201,123,154,0.35)', borderRadius:12, background:'rgba(201,123,154,0.04)', position:'relative' }}>
            <div style={{ position:'absolute', top:-1, right:12, background:'var(--rose)', color:'#fff', fontSize:8, fontWeight:700, letterSpacing:'0.08em', padding:'3px 10px', borderRadius:'0 0 8px 8px' }}>RECOMMENDED</div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
              <div>
                <div className="cormorant" style={{ fontSize:17, color:'var(--rose)', fontWeight:500 }}>Detailed Report</div>
                <div style={{ fontSize:11, color:'var(--muted)', marginTop:2 }}>25–30 pages · Career, marriage, health, remedies</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:13, color:'var(--rose)', fontWeight:600 }}>10 credits</div>
                <div style={{ fontSize:10, color:'var(--muted)' }}>≈ ₹199</div>
              </div>
            </div>
            <button onClick={() => downloadReport('detailed')} disabled={!!reportLoading}
              style={{ width:'100%', padding:'10px', border:'1px solid rgba(201,123,154,0.5)', borderRadius:10, background: reportLoading === 'detailed' ? 'rgba(201,123,154,0.15)' : 'rgba(201,123,154,0.08)', color:'var(--rose)', fontSize:12, cursor: reportLoading ? 'not-allowed' : 'pointer', fontFamily:'Jost', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              {reportLoading === 'detailed' ? <><div style={{ width:14, height:14, borderRadius:'50%', border:'2px solid var(--rose)', borderTopColor:'transparent', animation:'spin 1s linear infinite' }}/> Generating...</> : '⬇ Download Detailed Report'}
            </button>
          </div>
        </div>

        {/* Share note */}
        <p style={{ fontSize:10, color:'var(--muted)', marginTop:12, textAlign:'center', lineHeight:1.5 }}>
          PDF downloads to your device · Share via WhatsApp, Email, or any app · Professional Nakshatra AI watermark included
        </p>
      </div>

      {/* Ask AI CTA */}
      <div style={{ margin:'16px 16px 0' }}>
        <button className="btn-gold" onClick={onAskAI}>✦ Ask Celestial Guide · AI Consultation</button>
      </div>
    </div>
  );
};

// ── Chat Screen ───────────────────────────────────────────────────────────────
const SUGGESTIONS = [
  'How will my career progress in the next 2 years?',
  'When is a good time for marriage or partnership?',
  'What business is best suited for my chart?',
  'Tell me about my health and vitality based on my planets.',
];

const ChatScreen = ({ credits, setCredits, onBuyCredits }) => {
  // Read real name from localStorage — NOT hardcoded
  const userName = LS.get('nakshatra_user_name') || 'Seeker';

  const [messages, setMessages] = useState([
    { role: 'ai', text: `Namaste ✦ I have your complete Vedic birth chart, ${userName}. Ask me anything about your cosmic path — career, relationships, timing, or spiritual growth.` }
  ]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [localCredits, setLocalCredits] = useState(credits);
  const bottomRef = useRef();

  // Sync credits from localStorage on mount (in case they were updated elsewhere)
  useEffect(() => {
    const stored = LS.get('nakshatra_credits');
    if (stored !== null) {
      const n = stored === '∞' ? '∞' : parseInt(stored, 10);
      setLocalCredits(isNaN(n) ? credits : n);
    }
  }, []);

  const send = async (text) => {
    if (!text.trim() || loading || localCredits === 0) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    const API   = process.env.REACT_APP_API_URL || 'http://localhost:4000';
    const token = LS.get('nakshatra_token');

    if (!token) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Session expired. Please go back and log in again.' }]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/api/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ question: text }),
      });
      const raw = await res.text();
      let data = {};
      try { data = JSON.parse(raw); } catch {
        setMessages(prev => [...prev, { role:'ai', text:'🌙 The server is waking up. Please wait 30 seconds and try again.' }]);
        setLoading(false); return;
      }

      if (!res.ok) {
        if (res.status === 402) {
          setMessages(prev => [...prev, { role: 'ai', text: 'You have used all your credits. Please purchase more to continue.' }]);
          setLocalCredits(0);
          LS.set('nakshatra_credits', '0');
        } else if (data.error === 'NO_CHART') {
          setMessages(prev => [...prev, { role: 'ai', text: 'Please generate your birth chart first before asking questions.' }]);
        } else {
          throw new Error(data.error || 'Failed to get a response from the server.');
        }
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: data.answer }]);
        const remaining = typeof data.creditsRemaining === 'number' ? data.creditsRemaining : (localCredits === '∞' ? '∞' : localCredits - 1);
        setLocalCredits(remaining);
        LS.set('nakshatra_credits', String(remaining));
        if (setCredits) setCredits(remaining);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: `Error: ${err.message}. Please try again.` }]);
    }

    setLoading(false);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid var(--border)', background: 'rgba(9,9,15,0.85)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="cinzel" style={{ fontSize: 13, color: 'var(--gold2)' }}>AI Jyotish</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Chart-aware · Vedic · Gemini AI</div>
        </div>
        <button className="credit-badge" onClick={onBuyCredits} style={{ cursor: 'pointer' }}>
          ✦ {localCredits === '∞' ? '∞' : localCredits} {localCredits !== '∞' && 'credits'}
        </button>
      </div>

      {/* Messages */}
      <div className="scroll-area" style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>

        {/* Suggestions only on first load */}
        {messages.length === 1 && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, textAlign: 'center' }}>Suggested questions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 16px', color: 'var(--muted)', textAlign: 'left', cursor: 'pointer', fontSize: 14, fontFamily: 'Cormorant Garamond', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)'; e.currentTarget.style.color = 'var(--text)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start', gap: 10 }}>
            {m.role === 'ai' && (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'radial-gradient(circle, #c9a96e, #b8924a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, marginTop: 2 }}>✦</div>
            )}
            {m.role === 'ai'
              ? <div className="bubble-ai" style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
              : <div className="bubble-user">{m.text}</div>
            }
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'radial-gradient(circle, #c9a96e, #b8924a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>✦</div>
            <div className="bubble-ai" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '16px 20px' }}>
              <div className="dot" /><div className="dot" /><div className="dot" />
            </div>
          </div>
        )}

        {localCredits === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 16px' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>✦</div>
            <div className="cinzel" style={{ fontSize: 13, color: 'var(--gold)', marginBottom: 8 }}>Credits Exhausted</div>
            <p className="cormorant" style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 16, fontStyle: 'italic' }}>Replenish your credits to continue your cosmic journey</p>
            <button className="btn-gold" style={{ maxWidth: 200 }} onClick={onBuyCredits}>Buy Credits</button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {localCredits !== 0 && (
        <div style={{ padding: '12px 16px 16px', borderTop: '1px solid var(--border)', background: 'rgba(9,9,15,0.9)', backdropFilter: 'blur(12px)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <input className="input-field"
              style={{ flex: 1, borderRadius: 24, padding: '12px 18px' }}
              placeholder="Ask the stars anything…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
            />
            <button onClick={() => send(input)} disabled={loading || !input.trim()}
              style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #b8924a, #e8cc9a)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#09090f', opacity: loading || !input.trim() ? 0.5 : 1 }}>
              {Icon.send}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Credits Screen ────────────────────────────────────────────────────────────
// FIXED: Uses PLANS constant defined above (was crashing before — plans was undefined)

const CreditsScreen = ({ onClose, onPurchased }) => {
  const [selected, setSelected]     = useState('popular');
  const [processing, setProcessing] = useState(false);
  const [done, setDone]             = useState(false);

  const selectedPlan = PLANS.find(p => p.id === selected);

  const handleBuy = async () => {
    setProcessing(true);

    const API   = process.env.REACT_APP_API_URL || 'http://localhost:4000';
    const token = LS.get('nakshatra_token');

    try {
      // ── Step 1: Create Razorpay order via backend ──────────────────────
      const orderRes  = await fetch(`${API}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ planId: selected }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Could not create order');

      // ── Step 2: Open Razorpay checkout ────────────────────────────────
      await new Promise((resolve, reject) => {
        const rzpKeyId = process.env.REACT_APP_RAZORPAY_KEY_ID || '';
        if (!rzpKeyId || typeof window.Razorpay === 'undefined') {
          // Razorpay SDK not loaded — simulate for dev (remove in production)
          console.warn('Razorpay SDK not available — simulating payment for development');
          resolve({ simulated: true });
          return;
        }

        const rzp = new window.Razorpay({
          key:         rzpKeyId,
          amount:      orderData.amount,
          currency:    'INR',
          name:        'Nakshatra AI Jyotish',
          description: `${selectedPlan?.name} Plan`,
          order_id:    orderData.orderId,
          handler: (response) => resolve(response),
          prefill: { name: LS.get('nakshatra_user_name') || '' },
          theme: { color: '#c9a96e' },
          modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
        });
        rzp.open();
      }).then(async (paymentResponse) => {
        if (paymentResponse.simulated) {
          // Dev mode: skip verify, add credits locally
          const addedCredits = selectedPlan?.questions === '∞' ? '∞' : selectedPlan?.questions || 0;
          const existing = LS.get('nakshatra_credits');
          const newTotal = (existing === '∞' || addedCredits === '∞')
            ? '∞'
            : (parseInt(existing || '0', 10) + Number(addedCredits));
          LS.set('nakshatra_credits', String(newTotal));
          setProcessing(false);
          setDone(true);
          setTimeout(() => { if (onPurchased) onPurchased(newTotal); onClose(); }, 1200);
          return;
        }

        // ── Step 3: Verify on backend → adds credits to DB ──────────────
        const verifyRes  = await fetch(`${API}/api/payments/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            razorpay_order_id:   paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature:  paymentResponse.razorpay_signature,
          }),
        });
        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) throw new Error(verifyData.error || 'Payment verification failed');

        const newCredits = verifyData.credits;
        LS.set('nakshatra_credits', String(newCredits));
        setProcessing(false);
        setDone(true);
        setTimeout(() => { if (onPurchased) onPurchased(newCredits); onClose(); }, 1200);
      });

    } catch (err) {
      console.error('Payment error:', err.message);
      setProcessing(false);
      alert(err.message === 'Payment cancelled' ? 'Payment cancelled.' : `Payment failed: ${err.message}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1, paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 24px', textAlign: 'center', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 52, left: 20, background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 22, lineHeight: 1 }}>←</button>
        <div style={{ fontSize: 36, marginBottom: 12 }}>✦</div>
        <h2 className="cinzel" style={{ fontSize: 18, color: 'var(--gold2)', marginBottom: 8 }}>Unlock AI Wisdom</h2>
        <p className="cormorant" style={{ fontSize: 16, color: 'var(--muted)', fontStyle: 'italic' }}>Each credit gives you one in-depth AI reading</p>
      </div>

      {/* Plan cards */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
        {PLANS.map(p => (
          <div key={p.id} className={`plan-card${selected === p.id ? ' selected' : ''}`} onClick={() => setSelected(p.id)}>
            {p.tag && (
              <div className="plan-badge" style={{ background: p.color === 'var(--rose)' ? '#c97b9a' : 'var(--gold)', color: p.color === 'var(--rose)' ? '#fff' : '#09090f' }}>{p.tag}</div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="cinzel" style={{ fontSize: 13, color: p.color, marginBottom: 6 }}>{p.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span className="cinzel" style={{ fontSize: 28, color: 'var(--text)' }}>{p.questions}</span>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>{p.questions === '∞' ? 'questions' : `question${p.questions !== 1 ? 's' : ''}`}</span>
                </div>
                {p.note && <div style={{ fontSize: 11, color: p.color, marginTop: 4 }}>{p.note}</div>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="cinzel" style={{ fontSize: 22, color: 'var(--text)' }}>{p.price}</div>
                {selected === p.id && <div style={{ marginTop: 6, color: p.color, display: 'flex', justifyContent: 'flex-end' }}>{Icon.check}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: '0 16px' }}>
        {done ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 28, color: 'var(--gold)', marginBottom: 8 }}>✓</div>
            <div className="cinzel" style={{ fontSize: 13, color: 'var(--gold)' }}>Credits Added!</div>
          </div>
        ) : (
          <button className="btn-gold" onClick={handleBuy} disabled={processing}>
            {processing ? 'Processing…' : `Pay ${selectedPlan?.price} via Razorpay →`}
          </button>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 20 }}>
          {['Razorpay', 'UPI', 'Netbanking', 'Cards'].map(m => (
            <span key={m} style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em' }}>{m}</span>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 16, lineHeight: 1.6 }}>
          Secured by Razorpay · No subscription · Credits never expire (except Sage plan)
        </p>
      </div>
    </div>
  );
};

// ── Home Screen ───────────────────────────────────────────────────────────────
// FIXED: reads real name from localStorage — NOT hardcoded "Priya"

const HomeScreen = ({ onSetTab }) => {
  // Read real user name stored during login/registration
  const userName = LS.get('nakshatra_user_name') || 'Seeker';

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div style={{ position: 'relative', zIndex: 1, paddingBottom: 90 }}>
      <div style={{ padding: '52px 20px 24px' }}>
        <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{today}</div>
        <h2 className="cinzel" style={{ fontSize: 20, color: 'var(--gold2)', marginBottom: 4 }}>Namaste, {userName}</h2>
        <p className="cormorant" style={{ fontSize: 16, color: 'var(--muted)', fontStyle: 'italic' }}>The stars have messages for you today</p>
      </div>

      {/* Daily Insight */}
      <div style={{ margin: '0 16px 20px' }}>
        <div className="glass" style={{ padding: 20, background: 'linear-gradient(135deg, rgba(201,169,110,0.08), rgba(123,168,201,0.04))', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 100, opacity: 0.04 }}>☽</div>
          <div style={{ fontSize: 10, color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Today's Cosmic Guidance</div>
          <p className="cormorant" style={{ fontSize: 18, color: 'var(--text)', lineHeight: 1.65, fontWeight: 300 }}>
            "Open your birth chart to see your personalised planetary positions, or ask the AI Jyotish for guidance tailored to your unique cosmic blueprint."
          </p>
          <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
            <button onClick={() => onSetTab('chart')} style={{ background: 'none', border: '1px solid rgba(201,169,110,0.3)', borderRadius: 20, padding: '6px 14px', color: 'var(--gold)', fontSize: 13, fontFamily: 'Cormorant Garamond', cursor: 'pointer' }}>View Chart ✦</button>
            <button onClick={() => onSetTab('chat')} style={{ background: 'none', border: '1px solid rgba(201,123,154,0.3)', borderRadius: 20, padding: '6px 14px', color: 'var(--rose)', fontSize: 13, fontFamily: 'Cormorant Garamond', cursor: 'pointer' }}>Ask AI ✦</button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '0 16px', marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Quick Actions</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { icon: '⟢', label: 'View\nBirth Chart', tab: 'chart', color: 'var(--gold)' },
            { icon: '✦', label: 'Ask the\nAI Jyotish', tab: 'chat', color: 'var(--rose)' },
            { icon: '◈', label: 'Dasha\nTimeline', tab: 'chart', color: 'var(--sky)' },
            { icon: '◉', label: 'Buy\nCredits', tab: 'credits', color: 'var(--gold)' },
          ].map(a => (
            <button key={a.label} onClick={() => onSetTab(a.tab)} className="glass"
              style={{ padding: '20px 16px', textAlign: 'left', border: '1px solid var(--border)', borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s', background: 'none' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <div style={{ fontSize: 24, color: a.color, marginBottom: 10 }}>{a.icon}</div>
              <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.4, whiteSpace: 'pre-line', fontFamily: 'Jost', fontWeight: 400 }}>{a.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Auspicious Elements */}
      <div style={{ margin: '0 16px' }}>
        <div className="glass" style={{ padding: 20 }}>
          <div style={{ fontSize: 10, color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Today's Auspicious Elements</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {[['Color', 'Cream & Blue', '◉'], ['Number', '6 & 9', '◈'], ['Direction', 'North-East', '⟢']].map(([k, v, sym]) => (
              <div key={k} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, color: 'var(--gold)', marginBottom: 6 }}>{sym}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
                <div className="cormorant" style={{ fontSize: 15, color: 'var(--text)' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Bottom Navigation ─────────────────────────────────────────────────────────
const BottomNav = ({ tab, setTab }) => (
  <div className="nav-bottom">
    {[
      { id: 'home',    label: 'Home',    icon: Icon.home },
      { id: 'chart',   label: 'Chart',   icon: Icon.chart },
      { id: 'chat',    label: 'Ask AI',  icon: Icon.chat },
      { id: 'credits', label: 'Credits', icon: Icon.wallet },
    ].map(item => (
      <button key={item.id} className={`nav-tab${tab === item.id ? ' active' : ''}`} onClick={() => setTab(item.id)}>
        {item.icon}
        {item.label}
      </button>
    ))}
  </div>
);

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState(getTimeTheme);
  useEffect(() => {
    const id = setInterval(() => setTheme(getTimeTheme()), 60000);
    return () => clearInterval(id);
  }, []);

  // Determine initial screen: if token + chart exist, go straight to app
  const getInitialScreen = () => {
    const token = LS.get('nakshatra_token');
    const chart = LS.getJSON('nakshatra_chart');
    if (token && chart) return 'app';
    return 'splash';
  };

  const [screen, setScreen] = useState(getInitialScreen);
  const [tab, setTab]       = useState('home');
  const [credits, setCredits] = useState(() => {
    const stored = LS.get('nakshatra_credits');
    if (!stored) return 0;
    if (stored === '\u221e') return '\u221e';
    const n = parseInt(stored, 10);
    return isNaN(n) ? 0 : n;
  });

  // Fetch live credits from server on every load/screen change
  useEffect(() => {
    const token = LS.get('nakshatra_token');
    if (!token) return;
    const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';
    fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.text())
      .then(raw => {
        try {
          const data = JSON.parse(raw);
          const c = data?.user?.credits;
          if (typeof c === 'number') {
            setCredits(c);
            LS.set('nakshatra_credits', String(c));
          }
        } catch(e) {}
      })
      .catch(() => {});
  }, [screen]);

  const handleTabChange = (t) => {
    if (t === 'credits') { setScreen('credits'); return; }
    setTab(t);
    if (screen !== 'app') setScreen('app');
  };

  const handleLogout = () => {
    LS.clear();
    setScreen('splash');
    setTab('home');
    setCredits(0);
  };

  if (screen === 'splash') return (
    <><GlobalStyles theme={theme} /><Stars />
      <SplashScreen onNext={() => setScreen('birth')} onSignIn={() => setScreen('login')} />
    </>
  );

  if (screen === 'birth') return (
    <><GlobalStyles theme={theme} /><Stars />
      <BirthDetailsScreen onComplete={() => { setScreen('app'); setTab('chart'); }} />
    </>
  );
  if (screen === 'login') return (
    <><GlobalStyles theme={theme} /><Stars />
      <LoginScreen
        onComplete={() => { setScreen('app'); setTab('chart'); }}
        onNewUser={() => setScreen('birth')}
      />
    </>
  );

  if (screen === 'credits') return (
    <><GlobalStyles theme={theme} /><Stars />
      <CreditsScreen
        onClose={() => setScreen('app')}
        onPurchased={(newTotal) => { setCredits(newTotal); }}
      />
    </>
  );

  // Main app
  return (
    <><GlobalStyles theme={theme} /><Stars />
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        {/* Logout button (top right) */}
        <button onClick={handleLogout} title="Log out"
          style={{ position: 'fixed', top: 16, right: 16, zIndex: 200, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '6px 10px', cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'Jost' }}>
          {Icon.logout} <span>Logout</span>
        </button>

        {tab === 'home'  && <HomeScreen  onSetTab={handleTabChange} />}
        {tab === 'chart' && <ChartScreen onAskAI={() => setTab('chat')} />}
        {tab === 'chat'  && <ChatScreen  credits={credits} setCredits={setCredits} onBuyCredits={() => setScreen('credits')} />}

        <BottomNav tab={tab} setTab={handleTabChange} />
      </div>
    </>
  );
}
