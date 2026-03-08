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
                    <span style={{ fontSize:10, color:'var(--muted)', marginLeft:'auto' }}>{pl.data.degrees?.toFixed(1)}°</span>
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
  // Dynamically load jsPDF
  if (!window.jsPDF) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
  const W = 210, H = 297;
  const margin = 18;
  const gold   = [172, 134, 60];
  const dark   = [12,  12,  20];
  const cream  = [245, 238, 220];
  const muted  = [160, 155, 140];
  const red    = [180,  60,  60];

  let y = 0;

  const newPage = () => { doc.addPage(); y = margin + 10; };

  const pageHeader = (pageNum) => {
    doc.setFillColor(...dark);
    doc.rect(0, 0, W, 10, 'F');
    doc.setFontSize(7); doc.setTextColor(...gold);
    doc.text('NAKSHATRA AI  ·  Vedic Jyotish Report', margin, 7);
    doc.text(`Page ${pageNum}`, W - margin, 7, { align:'right' });
  };

  const pageFooter = () => {
    doc.setFontSize(7); doc.setTextColor(...muted);
    doc.text('Nakshatra AI · nakshatra.ai · Generated with Vedic precision · For personal use only', W/2, H - 8, { align:'center' });
    // Watermark
    doc.setFontSize(7); doc.setTextColor(180, 160, 100);
    doc.text('✦ NAKSHATRA AI', W - margin - 2, H - 8, { align:'right' });
  };

  // ── PAGE 1: COVER ──────────────────────────────────────────────────────────
  doc.setFillColor(...dark);
  doc.rect(0, 0, W, H, 'F');

  // Gold border
  doc.setDrawColor(...gold); doc.setLineWidth(0.8);
  doc.rect(8, 8, W-16, H-16);
  doc.setLineWidth(0.3);
  doc.rect(11, 11, W-22, H-22);

  // Om symbol area
  doc.setFontSize(36); doc.setTextColor(...gold);
  doc.text('ॐ', W/2, 55, { align:'center' });

  // Ganesha invoking shloka
  doc.setFontSize(10); doc.setTextColor(220, 200, 160);
  doc.text('॥ श्री गणेशाय नमः ॥', W/2, 72, { align:'center' });

  doc.setFontSize(7.5); doc.setTextColor(...muted);
  const shloka = 'Vakratunda Mahakaya Suryakoti Samaprabha';
  const shloka2 = 'Nirvighnam Kurume Deva Sarva Karyeshu Sarvada';
  doc.text(shloka,  W/2, 82, { align:'center' });
  doc.text(shloka2, W/2, 88, { align:'center' });

  // Divider
  doc.setDrawColor(...gold); doc.setLineWidth(0.4);
  doc.line(margin + 20, 94, W - margin - 20, 94);

  // Report title
  doc.setFontSize(22); doc.setTextColor(...gold);
  doc.text(type === 'basic' ? 'VEDIC BIRTH CHART' : 'DETAILED VEDIC REPORT', W/2, 112, { align:'center' });
  doc.setFontSize(11); doc.setTextColor(...cream);
  doc.text(type === 'basic' ? 'Personal Horoscope Analysis' : 'Comprehensive Jyotish Analysis', W/2, 122, { align:'center' });

  // Divider
  doc.line(margin + 10, 130, W - margin - 10, 130);

  // User details
  doc.setFontSize(18); doc.setTextColor(...cream);
  doc.text(reportData.userName || 'Valued Seeker', W/2, 148, { align:'center' });
  doc.setFontSize(9); doc.setTextColor(...muted);
  doc.text(reportData.dob || '', W/2, 158, { align:'center' });
  doc.text(reportData.birthTime ? `Born at ${reportData.birthTime}` : '', W/2, 166, { align:'center' });
  doc.text(reportData.birthPlace || '', W/2, 174, { align:'center' });

  doc.line(margin + 20, 182, W - margin - 20, 182);

  // Lagna highlights
  doc.setFontSize(10); doc.setTextColor(...gold);
  doc.text(`${reportData.ascendant} Lagna  ·  ${reportData.moonSign} Moon  ·  ${reportData.sunSign} Sun`, W/2, 196, { align:'center' });
  doc.setFontSize(8); doc.setTextColor(...muted);
  doc.text(`Nakshatra: ${reportData.moonNakshatra}  ·  ${reportData.ascNakshatra}`, W/2, 204, { align:'center' });

  // Bottom
  doc.setFontSize(7); doc.setTextColor(100, 95, 80);
  doc.text('Generated with precision by Nakshatra AI · Vedic Jyotish', W/2, H - 22, { align:'center' });
  doc.text('Based on: BPHS · Phaladeepika · Jataka Parijata · Sarvartha Chintamani', W/2, H - 16, { align:'center' });
  doc.setFontSize(8); doc.setTextColor(...gold);
  doc.text('✦ NAKSHATRA AI', W/2, H - 10, { align:'center' });

  let pageNum = 2;

  // ── PAGE 2: BIRTH DETAILS + PANCHANG ──────────────────────────────────────
  newPage(); pageHeader(pageNum++);

  const sectionTitle = (title, yPos) => {
    doc.setFillColor(...gold); doc.rect(margin, yPos - 5, 4, 12, 'F');
    doc.setFontSize(12); doc.setTextColor(...gold);
    doc.text(title, margin + 8, yPos + 4);
    doc.setDrawColor(...gold); doc.setLineWidth(0.3);
    doc.line(margin + 8, yPos + 6, W - margin, yPos + 6);
  };

  const bodyText = (text, yPos, color = cream, size = 9, maxWidth = W - margin * 2) => {
    doc.setFontSize(size); doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, margin, yPos);
    return lines.length * (size * 0.4 + 1.2);
  };

  sectionTitle('Birth Details', y); y += 20;
  const details = [
    ['Name',           reportData.userName || '—'],
    ['Date of Birth',  reportData.dob || '—'],
    ['Time of Birth',  reportData.birthTime || '—'],
    ['Place of Birth', reportData.birthPlace || '—'],
    ['Ascendant',      `${reportData.ascendant} (${reportData.ascNakshatra}, Pada ${reportData.ascPada})`],
    ['Moon Sign',      `${reportData.moonSign} — ${reportData.moonNakshatra}`],
    ['Sun Sign',       `${reportData.sunSign} — ${reportData.sunNakshatra}`],
    ['Age',            reportData.age ? `${reportData.age} years` : '—'],
  ];
  details.forEach(([label, value]) => {
    doc.setFontSize(8); doc.setTextColor(...muted); doc.text(label + ':', margin, y);
    doc.setFontSize(9); doc.setTextColor(...cream); doc.text(value, margin + 42, y);
    y += 8;
  });

  y += 10;
  sectionTitle('Panchang at Birth', y); y += 20;
  const pDetails = [
    ['Tithi',    reportData.panchang?.tithi || '—'],
    ['Nakshatra', reportData.panchang?.nakshatra || '—'],
    ['Yoga',     reportData.panchang?.yoga || '—'],
    ['Karana',   reportData.panchang?.karana || '—'],
    ['Weekday',  reportData.panchang?.weekday || '—'],
  ];
  pDetails.forEach(([label, value]) => {
    doc.setFontSize(8); doc.setTextColor(...muted); doc.text(label + ':', margin, y);
    doc.setFontSize(9); doc.setTextColor(...cream); doc.text(value, margin + 42, y);
    y += 8;
  });
  pageFooter();

  // ── PAGE 3: PLANETARY POSITIONS TABLE ─────────────────────────────────────
  newPage(); pageHeader(pageNum++);
  sectionTitle('Planetary Positions', y); y += 20;

  // Table header
  const cols = [margin, margin+22, margin+50, margin+68, margin+82, margin+110, margin+130];
  const headers = ['Planet', 'Sign', 'Deg', 'House', 'Nakshatra', 'Pada', 'Status'];
  doc.setFillColor(20, 18, 35);
  doc.rect(margin - 2, y - 5, W - margin * 2 + 4, 9, 'F');
  doc.setFontSize(7.5); doc.setTextColor(...gold);
  headers.forEach((h, i) => doc.text(h, cols[i], y));
  y += 8;

  (reportData.planetTable || []).forEach((pl, idx) => {
    if (y > H - 40) { pageFooter(); newPage(); pageHeader(pageNum++); y = margin + 10; }
    if (idx % 2 === 0) { doc.setFillColor(20, 18, 35); doc.rect(margin - 2, y - 4, W - margin * 2 + 4, 8, 'F'); }
    doc.setFontSize(7.5);
    doc.setTextColor(...cream);   doc.text(`${pl.symbol} ${pl.name}`, cols[0], y);
    doc.setTextColor(...muted);   doc.text(pl.sign, cols[1], y);
    doc.setTextColor(180,160,100); doc.text(pl.degrees, cols[2], y);
    doc.setTextColor(...cream);   doc.text(String(pl.house), cols[3], y);
    doc.setTextColor(...muted);   doc.text(pl.nakshatra, cols[4], y);
    doc.setTextColor(...muted);   doc.text(String(pl.pada), cols[5], y);
    const statusColor = pl.status.includes('Exalt') ? [100,200,100] : pl.status.includes('Debili') ? [200,100,100] : pl.status.includes('Own') ? [200,180,100] : [...muted];
    doc.setTextColor(...statusColor); doc.text(pl.status.split(' ')[0], cols[6], y);
    y += 9;
  });
  pageFooter();

  // ── PAGE 4: LAGNA ANALYSIS ─────────────────────────────────────────────────
  newPage(); pageHeader(pageNum++);
  sectionTitle(`${reportData.ascendant} Lagna — Ascendant Analysis`, y); y += 20;
  doc.setFontSize(8); doc.setTextColor(...muted);
  doc.text(`Sign Lord: ${reportData.signInfo?.lord || '—'}  ·  Nature: ${reportData.signInfo?.nature || '—'}  ·  Body: ${reportData.signInfo?.body || '—'}`, margin, y);
  y += 12;
  const lagnaLines = doc.splitTextToSize(reportData.lagnaInterp || '', W - margin * 2);
  doc.setFontSize(9); doc.setTextColor(...cream);
  lagnaLines.forEach(line => {
    if (y > H - 40) { pageFooter(); newPage(); pageHeader(pageNum++); y = margin + 10; }
    doc.text(line, margin, y); y += 5.5;
  });
  pageFooter();

  // ── PAGE 5: YOGAS & DOSHAS ─────────────────────────────────────────────────
  if ((reportData.yogas || []).length > 0) {
    newPage(); pageHeader(pageNum++);
    sectionTitle('Yogas & Doshas in Your Chart', y); y += 20;
    (reportData.yogas || []).forEach(yoga => {
      if (y > H - 60) { pageFooter(); newPage(); pageHeader(pageNum++); y = margin + 10; }
      const isDosha = yoga.type?.includes('Dosha');
      doc.setFillColor(isDosha ? 40 : 20, isDosha ? 12 : 30, isDosha ? 12 : 12);
      doc.rect(margin - 2, y - 5, W - margin * 2 + 4, 9, 'F');
      doc.setTextColor(isDosha ? 220 : gold[0], isDosha ? 100 : gold[1], isDosha ? 100 : gold[2]);
      doc.text(`${yoga.name}`, margin, y);
      doc.setFontSize(7.5); doc.setTextColor(isDosha ? 200 : 140, isDosha ? 140 : 200, isDosha ? 100 : 140);
      doc.text(yoga.type || '', W - margin, y, { align:'right' });
      y += 12;
      const descLines = doc.splitTextToSize(yoga.desc || '', W - margin * 2);
      doc.setFontSize(8.5); doc.setTextColor(...cream);
      descLines.forEach(line => {
        if (y > H - 35) { pageFooter(); newPage(); pageHeader(pageNum++); y = margin + 10; }
        doc.text(line, margin, y); y += 5;
      });
      y += 8;
    });
    pageFooter();
  }

  // ── PAGE 6: CURRENT DASHA ─────────────────────────────────────────────────
  if (reportData.currentDasha) {
    newPage(); pageHeader(pageNum++);
    sectionTitle('Vimshottari Dasha — Current Period', y); y += 20;
    doc.setFontSize(14); doc.setTextColor(...gold);
    doc.text(`${reportData.currentDasha.planet} Mahadasha`, margin, y); y += 10;
    doc.setFontSize(9); doc.setTextColor(...muted);
    doc.text(`${reportData.currentDasha.startDate} → ${reportData.currentDasha.endDate}`, margin, y); y += 14;
    const dashaLines = doc.splitTextToSize(reportData.dashaInterp || '', W - margin * 2);
    doc.setFontSize(9.5); doc.setTextColor(...cream);
    dashaLines.forEach(line => { doc.text(line, margin, y); y += 5.5; });
    y += 14;

    sectionTitle('Dasha Timeline', y); y += 20;
    (reportData.dashaSequence || []).forEach((d, i) => {
      if (y > H - 30) { pageFooter(); newPage(); pageHeader(pageNum++); y = margin + 10; }
      const now = new Date();
      const isActive = new Date(d.startDate) <= now && now < new Date(d.endDate);
      if (isActive) { doc.setFillColor(30, 28, 10); doc.rect(margin - 2, y - 4, W - margin * 2 + 4, 8, 'F'); }
      doc.setFontSize(8.5);
      doc.setTextColor(isActive ? gold[0] : cream[0], isActive ? gold[1] : cream[1], isActive ? gold[2] : cream[2]);
      doc.text(`${d.planet}${isActive ? '  ← NOW' : ''}`, margin, y);
      doc.setTextColor(...muted);
      doc.text(`${String(d.startDate||'').slice(0,7)} → ${String(d.endDate||'').slice(0,7)}`, W - margin, y, { align:'right' });
      y += 9;
    });
    pageFooter();
  }

  // ── PAGE 7: PLANET INTERPRETATIONS ────────────────────────────────────────
  newPage(); pageHeader(pageNum++);
  sectionTitle('Planetary Analysis — Classical Interpretation', y); y += 20;
  doc.setFontSize(8); doc.setTextColor(...muted);
  doc.text('Interpretations based on: BPHS · Phaladeepika · Jataka Parijata · Sarvartha Chintamani', margin, y); y += 12;

  for (const pl of (reportData.planetInterpretations || [])) {
    if (!pl.houseInterpretation) continue;
    if (y > H - 60) { pageFooter(); newPage(); pageHeader(pageNum++); y = margin + 10; }
    doc.setFillColor(18, 16, 30); doc.rect(margin - 2, y - 5, W - margin * 2 + 4, 10, 'F');
    doc.setFontSize(10); doc.setTextColor(...gold);
    doc.text(`${pl.symbol} ${pl.name} in House ${pl.house} — ${pl.sign}`, margin, y);
    doc.setFontSize(7.5); doc.setTextColor(...muted);
    doc.text(pl.status, W - margin, y, { align:'right' });
    y += 12;
    const interpLines = doc.splitTextToSize(pl.houseInterpretation, W - margin * 2);
    doc.setFontSize(8.5); doc.setTextColor(...cream);
    interpLines.forEach(line => {
      if (y > H - 30) { pageFooter(); newPage(); pageHeader(pageNum++); y = margin + 10; }
      doc.text(line, margin, y); y += 5;
    });
    y += 10;
  }
  pageFooter();

  // ── DETAILED REPORT EXTRA PAGES ────────────────────────────────────────────
  if (type === 'detailed' && reportData.careerPrediction) {
    const sections = [
      ['Career Predictions', reportData.careerPrediction],
      ['Finance & Wealth Analysis', reportData.financePrediction],
      ['Marriage & Relationships', reportData.marriagePrediction],
      ['Health & Vitality', reportData.healthPrediction],
      ['Spiritual Path & Dharma', reportData.spiritualPath],
    ];
    for (const [title, content] of sections) {
      newPage(); pageHeader(pageNum++);
      sectionTitle(title, y); y += 20;
      const lines = doc.splitTextToSize(content || '', W - margin * 2);
      doc.setFontSize(9.5); doc.setTextColor(...cream);
      lines.forEach(line => {
        if (y > H - 30) { pageFooter(); newPage(); pageHeader(pageNum++); y = margin + 10; }
        doc.text(line, margin, y); y += 5.5;
      });
      pageFooter();
    }

    // Remedies page
    if (reportData.remedies?.length > 0) {
      newPage(); pageHeader(pageNum++);
      sectionTitle('Recommended Remedies', y); y += 20;
      doc.setFontSize(8); doc.setTextColor(...muted);
      doc.text('Based on classical Jyotish texts and Vedic tradition:', margin, y); y += 12;
      for (const rem of reportData.remedies) {
        if (y > H - 60) { pageFooter(); newPage(); pageHeader(pageNum++); y = margin + 10; }
        doc.setFontSize(10); doc.setTextColor(...gold);
        doc.text(`${rem.planet}`, margin, y); y += 10;
        doc.setFontSize(8); doc.setTextColor(200, 120, 100);
        doc.text(`Issue: ${rem.issue}`, margin + 4, y); y += 8;
        const rLines = doc.splitTextToSize(`Remedy: ${rem.remedy}`, W - margin * 2 - 4);
        doc.setFontSize(8.5); doc.setTextColor(...cream);
        rLines.forEach(line => { if (y > H - 25) { pageFooter(); newPage(); pageHeader(pageNum++); y = margin + 10; } doc.text(line, margin + 4, y); y += 5; });
        y += 10;
      }
      pageFooter();
    }

    // Life summary — final page
    if (reportData.lifeSummary) {
      newPage(); pageHeader(pageNum++);
      sectionTitle('Final Life Summary', y); y += 20;
      const sumLines = doc.splitTextToSize(reportData.lifeSummary, W - margin * 2);
      doc.setFontSize(10); doc.setTextColor(...cream);
      sumLines.forEach(line => { if (y > H - 30) { pageFooter(); newPage(); pageHeader(pageNum++); y = margin + 10; } doc.text(line, margin, y); y += 6; });
      pageFooter();
    }
  }

  // Save
  const filename = `NakshatraAI_${type === 'basic' ? 'Basic' : 'Detailed'}_Report_${(reportData.userName || 'Chart').replace(/\s+/g,'_')}.pdf`;
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
      setReportMsg('Generating your PDF...');
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
    if (!stored) return 3;
    if (stored === '∞') return '∞';
    const n = parseInt(stored, 10);
    return isNaN(n) ? 3 : n;
  });

  const handleTabChange = (t) => {
    if (t === 'credits') { setScreen('credits'); return; }
    setTab(t);
    if (screen !== 'app') setScreen('app');
  };

  const handleLogout = () => {
    LS.clear();
    setScreen('splash');
    setTab('home');
    setCredits(3);
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
