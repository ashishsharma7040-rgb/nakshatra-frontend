import { useState, useEffect, useRef } from "react";

// ── Google Fonts ──────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
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
  `}</style>
);

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
// Reads ONLY from real server data stored in localStorage by BirthDetailsScreen.
// No hardcoded/sample chart data anywhere.

const ChartScreen = ({ onAskAI }) => {
  const [tab, setTab]     = useState('planets');
  const [chart, setChart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  // Read user identity from localStorage (set during BirthDetailsScreen)
  const userName   = LS.get('nakshatra_user_name') || 'Your';
  const birthPlace = LS.get('nakshatra_birthplace') || '';
  const dob        = LS.get('nakshatra_dob') || '';
  const time       = LS.get('nakshatra_time') || '';

  useEffect(() => {
    // 1. Try cache first
    const cached = LS.getJSON('nakshatra_chart');
    if (cached) { setChart(cached); setLoading(false); return; }

    // 2. Fetch from server
    const API   = process.env.REACT_APP_API_URL || 'http://localhost:4000';
    const token = LS.get('nakshatra_token');
    if (!token) { setError('Please generate your chart first.'); setLoading(false); return; }

    fetch(`${API}/api/chart/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const chartPayload = data?.chart?.chart_data || data?.chart || null;
        if (chartPayload) {
          setChart(chartPayload);
          LS.setJSON('nakshatra_chart', chartPayload);
        } else {
          setError('No chart found. Please go back and generate your chart.');
        }
        setLoading(false);
      })
      .catch(() => { setError('Could not load chart. Please check your connection and try again.'); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 50, height: 50, borderRadius: '50%', border: '2px solid var(--gold)', borderTopColor: 'transparent', margin: '0 auto 20px', animation: 'spin 1s linear infinite' }} />
        <p className="cormorant" style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Loading your chart...</p>
      </div>
    </div>
  );

  if (error || !chart) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, position: 'relative', zIndex: 1 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚠</div>
        <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.6 }}>{error || 'Chart not available.'}</p>
      </div>
    </div>
  );

  // ── Safely extract chart fields ────────────────────────────────────────────
  // Backend may return different shapes; we handle both gracefully.
  const ascendant    = chart.ascendant || {};
  const planets      = chart.planets   || {};
  const currentDasha = chart.currentDasha || null;
  const dashaSeq     = chart.dashaSequence || [];

  const planetList = Object.entries(planets);

  return (
    <div style={{ position: 'relative', zIndex: 1, paddingBottom: 90 }}>

      {/* Header — uses REAL name from localStorage */}
      <div style={{ padding: '52px 24px 20px', background: 'linear-gradient(180deg, rgba(9,9,15,0.9) 0%, transparent 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>Vedic Birth Chart</div>
            <h2 className="cinzel" style={{ fontSize: 18, color: 'var(--gold2)' }}>{userName}</h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--gold)', marginBottom: 2 }}>Lahiri · Whole Sign</div>
            <div style={{ fontSize: 10, color: 'var(--muted)' }}>{ascendant?.nakshatra?.name || ''}</div>
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>
          {dob}{time ? ` · ${time}` : ''}{birthPlace ? ` · ${birthPlace}` : ''}
        </p>
      </div>

      {/* Zodiac Wheel — planet positions from REAL chart data */}
      <div style={{ padding: '8px 24px 24px' }}>
        <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto' }} className="float">
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.3)', background: 'radial-gradient(circle at center, rgba(201,169,110,0.04), transparent 70%)' }} />
          <div style={{ position: 'absolute', inset: 20, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.15)' }} />
          <div style={{ position: 'absolute', inset: 50, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', inset: 70, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,169,110,0.2), rgba(201,169,110,0.05))', border: '1px solid rgba(201,169,110,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>✦</div>

          {/* Zodiac glyphs */}
          {['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map((s, i) => {
            const angle = (i / 12) * 360 - 90, rad = angle * Math.PI / 180, r = 88;
            const x = 110 + r * Math.cos(rad), y = 110 + r * Math.sin(rad);
            return <div key={i} style={{ position: 'absolute', left: x - 10, top: y - 10, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'rgba(201,169,110,0.7)' }}>{s}</div>;
          })}

          {/* Planet markers from REAL data: use signIndex + degrees */}
          {planetList.slice(0, 7).map(([name, data]) => {
            // signIndex is 0-11; degrees is 0-30 within sign
            const signIdx = typeof data.signIndex === 'number' ? data.signIndex : 0;
            const deg     = typeof data.degrees   === 'number' ? data.degrees   : 0;
            const angle   = (signIdx / 12) * 360 + (deg / 12) - 90;
            const rad     = angle * Math.PI / 180;
            const r       = 55;
            const x       = 110 + r * Math.cos(rad);
            const y       = 110 + r * Math.sin(rad);
            return (
              <div key={name} title={`${name}: ${data.formatted || data.sign || ''}`}
                style={{ position: 'absolute', left: x - 8, top: y - 8, width: 16, height: 16, borderRadius: '50%', background: PLANET_COLORS[name] || '#888', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#09090f', fontWeight: 700, cursor: 'default' }}>
                {PLANET_SYMBOLS[name] || '•'}
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Highlights — REAL ascendant/moon/sun from chart */}
      <div style={{ padding: '0 16px', marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { label: 'Ascendant', value: ascendant?.sign,       sym: SIGN_GLYPHS[ascendant?.sign] || '✦' },
            { label: 'Moon Sign', value: planets?.moon?.sign,   sym: SIGN_GLYPHS[planets?.moon?.sign] || '☽' },
            { label: 'Sun Sign',  value: planets?.sun?.sign,    sym: SIGN_GLYPHS[planets?.sun?.sign]  || '☉' },
          ].map(item => (
            <div key={item.label} className="glass" style={{ padding: '14px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, color: 'var(--gold)', marginBottom: 6 }}>{item.sym}</div>
              <div className="cinzel" style={{ fontSize: 10, color: 'var(--gold2)', marginBottom: 4 }}>{item.value || '—'}</div>
              <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Dasha Banner — from REAL chart */}
      {currentDasha && (
        <div style={{ margin: '0 16px 16px' }}>
          <div className="glass" style={{ padding: '14px 18px', background: 'linear-gradient(135deg, rgba(201,123,154,0.08), rgba(201,169,110,0.05))', borderColor: 'rgba(201,123,154,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--rose)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Current Dasha Period</div>
                <div className="cormorant" style={{ fontSize: 18, color: 'var(--text)', fontWeight: 500 }}>{currentDasha.planet} Mahadasha</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{planets?.moon?.nakshatra?.name || ''} Nakshatra</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 4 }}>Ends</div>
                <div style={{ fontSize: 12, color: 'var(--gold)' }}>{currentDasha.endDate || '—'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ padding: '0 16px', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['planets', 'nakshatras', 'dasha'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '10px 0', border: tab === t ? '1px solid var(--gold)' : '1px solid var(--border)', borderRadius: 10, background: tab === t ? 'rgba(201,169,110,0.08)' : 'transparent', color: tab === t ? 'var(--gold)' : 'var(--muted)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Jost' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Planets Tab */}
      {tab === 'planets' && (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {planetList.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--muted)', fontFamily: 'Cormorant Garamond', fontSize: 16, fontStyle: 'italic' }}>
              No planet data available. Please regenerate your chart.
            </div>
          )}
          {planetList.map(([name, data]) => (
            <div key={name} className="glass" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, ${PLANET_COLORS[name] || '#888'}, ${PLANET_COLORS[name] || '#888'}44)`, border: `1px solid ${PLANET_COLORS[name] || '#888'}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                {PLANET_SYMBOLS[name] || '•'}
              </div>
              <div style={{ flex: 1 }}>
                <div className="cormorant" style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500, textTransform: 'capitalize' }}>{name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{data.formatted || `${data.sign || '—'} ${data.degrees ? `${data.degrees.toFixed(1)}°` : ''}`}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'var(--gold)', background: 'rgba(201,169,110,0.08)', padding: '3px 9px', borderRadius: 20 }}>
                  {data.house ? `H${data.house}` : '—'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Nakshatras Tab */}
      {tab === 'nakshatras' && (
        <div style={{ padding: '0 16px' }}>
          <div className="glass" style={{ padding: 18 }}>
            {[
              ['Ascendant', ascendant?.nakshatra],
              ['Moon',      planets?.moon?.nakshatra],
              ['Sun',       planets?.sun?.nakshatra],
            ].filter(([, nak]) => nak).map(([label, nak]) => (
              <div key={label} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>{label} Nakshatra</div>
                <div className="cormorant" style={{ fontSize: 19, color: 'var(--text)', fontWeight: 500, marginBottom: 2 }}>{nak.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {nak.pada ? `Pada ${nak.pada}` : ''}{nak.lord ? ` · Ruled by ${nak.lord}` : ''}
                </div>
              </div>
            ))}
            {!ascendant?.nakshatra && !planets?.moon?.nakshatra && !planets?.sun?.nakshatra && (
              <div style={{ padding: 16, textAlign: 'center', color: 'var(--muted)', fontFamily: 'Cormorant Garamond', fontSize: 16, fontStyle: 'italic' }}>
                Nakshatra data not available.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dasha Tab */}
      {tab === 'dasha' && (
        <div style={{ padding: '0 16px' }}>
          <div className="glass" style={{ padding: 18 }}>
            <div style={{ fontSize: 10, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Vimshottari Dasha Sequence</div>
            {dashaSeq.length === 0 && (
              <div style={{ padding: 16, textAlign: 'center', color: 'var(--muted)', fontFamily: 'Cormorant Garamond', fontSize: 16, fontStyle: 'italic' }}>
                Dasha data not available.
              </div>
            )}
            {dashaSeq.map((d, i) => {
              const now      = new Date();
              const isActive = new Date(d.startDate) <= now && now < new Date(d.endDate);
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)', opacity: isActive ? 1 : 0.6 }}>
                  <div>
                    <span className="cormorant" style={{ fontSize: 16, color: isActive ? 'var(--gold)' : 'var(--text)', fontWeight: isActive ? 500 : 300 }}>{d.planet}</span>
                    {isActive && <span style={{ marginLeft: 8, fontSize: 9, background: 'var(--gold)', color: '#09090f', padding: '2px 7px', borderRadius: 20, fontWeight: 700 }}>NOW</span>}
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--muted)' }}>
                    <div>{String(d.startDate || '').slice(0, 7)} → {String(d.endDate || '').slice(0, 7)}</div>
                    {d.years && <div style={{ fontSize: 10 }}>{d.years} years</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ask AI CTA */}
      <div style={{ margin: '20px 16px 0' }}>
        <button className="btn-gold" onClick={onAskAI}>✦ Ask the Stars · AI Consultation</button>
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
      const res  = await fetch(`${API}/api/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json();

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
        <div style={{ padding: '12px 16px 28px', borderTop: '1px solid var(--border)', background: 'rgba(9,9,15,0.9)', backdropFilter: 'blur(12px)' }}>
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
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
            1 credit per question · Powered by Google Gemini AI
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
  <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(9,9,15,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-around', padding: '8px 0 16px', zIndex: 100 }}>
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
    <><GlobalStyles /><Stars />
      <SplashScreen onNext={() => setScreen('birth')} onSignIn={() => setScreen('login')} />
    </>
  );

  if (screen === 'birth') return (
    <><GlobalStyles /><Stars />
      <BirthDetailsScreen onComplete={() => { setScreen('app'); setTab('chart'); }} />
    </>
  );
  if (screen === 'login') return (
    <><GlobalStyles /><Stars />
      <LoginScreen
        onComplete={() => { setScreen('app'); setTab('chart'); }}
        onNewUser={() => setScreen('birth')}
      />
    </>
  );

  if (screen === 'credits') return (
    <><GlobalStyles /><Stars />
      <CreditsScreen
        onClose={() => setScreen('app')}
        onPurchased={(newTotal) => { setCredits(newTotal); }}
      />
    </>
  );

  // Main app
  return (
    <><GlobalStyles /><Stars />
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        {/* Logout button (top right) */}
        <button onClick={handleLogout} title="Log out"
          style={{ position: 'fixed', top: 16, right: 16, zIndex: 200, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 10, padding: '6px 10px', cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'Jost' }}>
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
