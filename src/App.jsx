import { useState, useEffect, useRef } from "react";

// ── Google Fonts loaded via @import in style tag ──────────────────────────────
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

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--deep); }
    ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }

    /* Stars background */
    @keyframes twinkle {
      0%,100% { opacity: 0.2; transform: scale(1); }
      50%      { opacity: 1;   transform: scale(1.4); }
    }
    @keyframes orbitSpin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position:  400px 0; }
    }
    @keyframes pulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(201,169,110,0); }
      50%      { box-shadow: 0 0 0 8px rgba(201,169,110,0.12); }
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

    .fade-up { animation: fadeUp 0.6s ease forwards; }
    .float   { animation: float 4s ease-in-out infinite; }

    /* Glass card */
    .glass {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      backdrop-filter: blur(12px);
    }

    /* Gold divider */
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
      opacity: 0.4;
      margin: 24px 0;
    }

    /* Inputs */
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

    /* Btn */
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
    .btn-gold:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(201,169,110,0.35);
    }
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

    /* Planet pill */
    .planet-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border);
      border-radius: 100px;
      padding: 7px 14px;
      font-size: 13px;
      font-family: 'Cormorant Garamond', serif;
    }

    /* Chat bubble */
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

    /* Nav tab */
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

    /* Credit badge */
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

    /* Stars canvas wrapper */
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

    /* Zodiac wheel */
    .wheel-wrap {
      position: relative;
      width: 220px;
      height: 220px;
      margin: 0 auto;
    }
    .wheel-ring {
      position: absolute;
      border-radius: 50%;
      border: 1px solid;
    }

    /* Loading dots */
    @keyframes dotPulse {
      0%,80%,100% { transform: scale(0); opacity: 0.3; }
      40%          { transform: scale(1);   opacity: 1; }
    }
    .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); display: inline-block; animation: dotPulse 1.4s ease-in-out infinite; }
    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }

    /* Scrollable area */
    .scroll-area { overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--gold) var(--deep); }

    /* Plan card */
    .plan-card {
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
      cursor: pointer;
      transition: all 0.25s;
      position: relative;
      overflow: hidden;
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

// ── Star field ────────────────────────────────────────────────────────────────
const Stars = () => {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 5,
    dur: Math.random() * 3 + 2,
  }));
  return (
    <div className="stars-bg">
      {stars.map(s => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: 0.3,
            animation: `twinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
          }}
        />
      ))}
      {/* Nebula blobs */}
      <div style={{ position: 'absolute', top: '15%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,123,154,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,168,201,0.05) 0%, transparent 70%)', filter: 'blur(50px)' }} />
    </div>
  );
};

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const Icon = {
  home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>,
  chart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="9"/><path d="M12 3v9l5 3"/><path d="M3.6 15h16.8M4.9 9h14.2"/></svg>,
  chat: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  wallet: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="2" y="5" width="20" height="15" rx="2"/><path d="M2 10h20M16 15h.01"/></svg>,
  star: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.8.6-5 4.6 1.5 6.7L12 17l-6.2 3.2 1.5-6.7-5-4.6 6.8-.6z"/></svg>,
  send: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>,
  sparkle: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z"/><path d="M19 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8zM5 18l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5z"/></svg>,
  moon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M5 13l4 4L19 7"/></svg>,
};

// ── Zodiac Wheel Visual ───────────────────────────────────────────────────────
const ZodiacWheel = ({ chart }) => {
  const signs = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
  return (
    <div className="wheel-wrap float">
      {/* Outer ring */}
      <div className="wheel-ring" style={{ inset: 0, borderColor: 'rgba(201,169,110,0.3)', background: 'radial-gradient(circle at center, rgba(201,169,110,0.04) 0%, transparent 70%)' }} />
      <div className="wheel-ring" style={{ inset: 20, borderColor: 'rgba(201,169,110,0.15)' }} />
      <div className="wheel-ring" style={{ inset: 50, borderColor: 'rgba(255,255,255,0.06)' }} />
      {/* Center */}
      <div style={{ position: 'absolute', inset: 70, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,169,110,0.2), rgba(201,169,110,0.05))', border: '1px solid rgba(201,169,110,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
        ✦
      </div>
      {/* Sign glyphs around ring */}
      {signs.map((s, i) => {
        const angle = (i / 12) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const r = 88;
        const x = 110 + r * Math.cos(rad);
        const y = 110 + r * Math.sin(rad);
        return (
          <div key={i} style={{ position: 'absolute', left: x - 10, top: y - 10, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'rgba(201,169,110,0.7)', fontFamily: 'serif' }}>{s}</div>
        );
      })}
      {/* Planet markers */}
      {chart && chart.planets.slice(0, 5).map((p, i) => {
        const angle = (i / 5) * 360 - 60;
        const rad = (angle * Math.PI) / 180;
        const r = 60;
        const x = 110 + r * Math.cos(rad);
        const y = 110 + r * Math.sin(rad);
        return (
          <div key={i} style={{ position: 'absolute', left: x - 8, top: y - 8, width: 16, height: 16, borderRadius: '50%', background: p.color, border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: '#fff', fontWeight: 700 }}>{p.sym}</div>
        );
      })}
    </div>
  );
};

// ── SCREEN: Splash / Landing ──────────────────────────────────────────────────
const SplashScreen = ({ onNext }) => (
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
      Ancient wisdom, decoded by intelligence.
      Your cosmic blueprint awaits.
    </p>

    <div style={{ display: 'flex', gap: 24, marginBottom: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
      {[['♈','Vedic Charts'], ['☽','AI Predictions'], ['✦','Daily Guidance']].map(([sym, label]) => (
        <div key={label} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, marginBottom: 6, color: 'var(--gold)' }}>{sym}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Jost' }}>{label}</div>
        </div>
      ))}
    </div>

    <button className="btn-gold" style={{ maxWidth: 280 }} onClick={onNext}>
      Begin Your Journey
    </button>

    <button className="btn-ghost" style={{ marginTop: 14, maxWidth: 280 }} onClick={onNext}>
      Sign In
    </button>

    <p style={{ marginTop: 32, fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
      Powered by Swiss Ephemeris · Gemini AI
    </p>
  </div>
);

// ── SCREEN: Birth Details Form ────────────────────────────────────────────────
const BirthDetailsScreen = ({ onComplete }) => {
  const [form, setForm] = useState({ name: '', dob: '', time: '', location: '' });
  const [step, setStep] = useState(0); // 0=form, 1=generating
  const [progress, setProgress] = useState(0);

  const handleSubmit = () => {
    if (!form.name || !form.dob) return;
    setStep(1);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18;
      if (p >= 100) { p = 100; clearInterval(interval); setTimeout(onComplete, 400); }
      setProgress(Math.min(p, 100));
    }, 280);
  };

  if (step === 1) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, position: 'relative', zIndex: 1 }}>
      <div style={{ textAlign: 'center', maxWidth: 320 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid var(--gold)', borderTopColor: 'transparent', margin: '0 auto 32px', animation: 'spin 1.2s linear infinite' }} />
        <h2 className="cinzel" style={{ fontSize: 16, color: 'var(--gold)', marginBottom: 12 }}>Reading the Stars</h2>
        <p className="cormorant" style={{ fontSize: 17, color: 'var(--muted)', marginBottom: 28, fontStyle: 'italic' }}>Calculating your planetary positions…</p>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #b8924a, #e8cc9a)', borderRadius: 2, transition: 'width 0.3s ease' }} />
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['Geocoding location', 'Swiss Ephemeris', 'Calculating Dashas', 'Building chart'].map((s, i) => (
            <span key={i} style={{ fontSize: 10, color: progress > i * 25 ? 'var(--gold)' : 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'color 0.3s', display: 'flex', alignItems: 'center', gap: 4 }}>
              {progress > i * 25 ? <span style={{ color: 'var(--gold)' }}>✓</span> : <span>○</span>} {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ padding: '48px 24px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12, fontFamily: 'Jost' }}>Your Cosmic Profile</div>
        <h2 className="cinzel" style={{ fontSize: 20, color: 'var(--gold2)', lineHeight: 1.4 }}>Enter Birth Details</h2>
        <p className="cormorant" style={{ fontSize: 16, color: 'var(--muted)', marginTop: 8, fontStyle: 'italic' }}>Precise time & place reveal your authentic chart</p>
      </div>

      {/* Form */}
      <div style={{ flex: 1, padding: '0 24px 32px', maxWidth: 440, margin: '0 auto', width: '100%' }}>
        <div className="glass" style={{ padding: 24 }}>
          <div className="input-wrap">
            <label className="input-label">Full Name</label>
            <input className="input-field" placeholder="e.g. Priya Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="input-wrap">
            <label className="input-label">Date of Birth</label>
            <input className="input-field" type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} style={{ colorScheme: 'dark' }} />
          </div>
          <div className="input-wrap">
            <label className="input-label">Time of Birth <span style={{ color: 'var(--muted)', fontSize: 10 }}>(as accurate as possible)</span></label>
            <input className="input-field" type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} style={{ colorScheme: 'dark' }} />
          </div>
          <div className="input-wrap" style={{ marginBottom: 0 }}>
            <label className="input-label">Place of Birth</label>
            <input className="input-field" placeholder="e.g. Mumbai, India" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          </div>
        </div>

        <div className="divider" />

        <div style={{ background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.15)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--gold)', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Why time matters</div>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, fontFamily: 'Cormorant Garamond', fontSize: 15 }}>Even a 4-minute difference shifts your Ascendant. For the most precise Vedic chart, use your birth certificate or hospital records.</p>
        </div>

        <button className="btn-gold" onClick={handleSubmit} disabled={!form.name || !form.dob}>
          ✦ Generate My Birth Chart
        </button>
      </div>
    </div>
  );
};

// ── SCREEN: Dashboard / Chart ─────────────────────────────────────────────────
const SAMPLE_CHART = {
  ascendant: 'Libra',
  sun: 'Taurus · 8th House',
  moon: 'Rohini Nakshatra · Gemini · 9th House',
  mars: 'Leo · 11th House',
  mercury: 'Aries · 7th House',
  jupiter: 'Cancer · 10th House',
  venus: 'Gemini · 9th House',
  saturn: 'Aquarius · 5th House',
  dasha: 'Venus Mahadasha → Mars Antardasha',
  dashaEnd: 'March 2027',
  planets: [
    { sym: '☉', color: '#e8cc9a', label: 'Sun', sign: 'Taurus', house: '8th' },
    { sym: '☽', color: '#b8d4e8', label: 'Moon', sign: 'Gemini', house: '9th' },
    { sym: '♂', color: '#e87070', label: 'Mars', sign: 'Leo', house: '11th' },
    { sym: '♀', color: '#c97b9a', label: 'Venus', sign: 'Gemini', house: '9th' },
    { sym: '♃', color: '#f0c070', label: 'Jupiter', sign: 'Cancer', house: '10th' },
  ],
};

const ChartScreen = ({ onAskAI }) => {
  const [tab, setTab] = useState('planets');

  return (
    <div style={{ position: 'relative', zIndex: 1, paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ padding: '52px 24px 20px', background: 'linear-gradient(180deg, rgba(9,9,15,0.9) 0%, transparent 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>Vedic Birth Chart</div>
            <h2 className="cinzel" style={{ fontSize: 18, color: 'var(--gold2)' }}>Priya Sharma</h2>
          </div>
          <div className="credit-badge">
            <span style={{ fontSize: 14 }}>✦</span> 8 credits
          </div>
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>12 Aug 1995 · 14:30 · Mumbai</p>
      </div>

      {/* Wheel */}
      <div style={{ padding: '8px 24px 32px' }}>
        <ZodiacWheel chart={SAMPLE_CHART} />
      </div>

      {/* Key Highlights */}
      <div style={{ padding: '0 16px', marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { label: 'Ascendant', value: 'Libra', sym: '♎' },
            { label: 'Moon Sign', value: 'Gemini', sym: '♊' },
            { label: 'Sun Sign', value: 'Taurus', sym: '♉' },
          ].map(item => (
            <div key={item.label} className="glass" style={{ padding: '14px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, color: 'var(--gold)', marginBottom: 6 }}>{item.sym}</div>
              <div className="cinzel" style={{ fontSize: 11, color: 'var(--gold2)', marginBottom: 4 }}>{item.value}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Dasha banner */}
      <div style={{ margin: '0 16px 20px' }}>
        <div className="glass" style={{ padding: '16px 20px', background: 'linear-gradient(135deg, rgba(201,123,154,0.08), rgba(201,169,110,0.05))', borderColor: 'rgba(201,123,154,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 10, color: 'var(--rose)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Current Dasha Period</div>
              <div className="cormorant" style={{ fontSize: 18, color: 'var(--text)', fontWeight: 500 }}>{SAMPLE_CHART.dasha}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 4 }}>Ends</div>
              <div style={{ fontSize: 13, color: 'var(--gold)' }}>{SAMPLE_CHART.dashaEnd}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['planets', 'houses', 'nakshatras'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '10px 0', border: tab === t ? '1px solid var(--gold)' : '1px solid var(--border)', borderRadius: 10, background: tab === t ? 'rgba(201,169,110,0.08)' : 'transparent', color: tab === t ? 'var(--gold)' : 'var(--muted)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Jost' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Planet list */}
      {tab === 'planets' && (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SAMPLE_CHART.planets.map(p => (
            <div key={p.label} className="glass" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, ${p.color}, ${p.color}44)`, border: `1px solid ${p.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{p.sym}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: 'var(--text)', marginBottom: 2, fontFamily: 'Cormorant Garamond', fontWeight: 500 }}>{p.label}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{p.sign}</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--gold)', background: 'rgba(201,169,110,0.08)', padding: '4px 10px', borderRadius: 20 }}>{p.house}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'houses' && (
        <div style={{ padding: '0 16px' }}>
          <div className="glass" style={{ padding: 20 }}>
            {[['1st','Self, Personality','Libra'],['2nd','Wealth, Speech','Scorpio'],['4th','Home, Mother','Capricorn'],['7th','Marriage, Partners','Aries'],['10th','Career, Status','Cancer']].map(([h, desc, sign]) => (
              <div key={h} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <span style={{ fontSize: 13, color: 'var(--gold)', marginRight: 12, fontFamily: 'Cinzel Decorative', fontSize: 11 }}>{h}</span>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>{desc}</span>
                </div>
                <span className="cormorant" style={{ fontSize: 15, color: 'var(--text)' }}>{sign}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'nakshatras' && (
        <div style={{ padding: '0 16px' }}>
          <div className="glass" style={{ padding: 20 }}>
            {[['Moon Nakshatra','Rohini','Taurus · 4th Pada'],['Sun Nakshatra','Rohini','Taurus · 1st Pada'],['Ascendant Nakshatra','Chitra','Libra · 3rd Pada'],['Atmakaraka','Moon','Rohini']].map(([type, nak, detail]) => (
              <div key={type} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{type}</div>
                <div className="cormorant" style={{ fontSize: 19, color: 'var(--text)', fontWeight: 500, marginBottom: 2 }}>{nak}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ask AI CTA */}
      <div style={{ margin: '24px 16px 0' }}>
        <button className="btn-gold" onClick={onAskAI}>
          ✦ Ask the Stars · AI Consultation
        </button>
      </div>
    </div>
  );
};

// ── SCREEN: AI Chat ───────────────────────────────────────────────────────────
const SUGGESTIONS = [
  'How will my career be in next 2 years?',
  'When is a good time for marriage?',
  'What business is suited for me?',
  'Tell me about my financial prospects',
];

const SAMPLE_RESPONSE = `Based on your Vedic birth chart, your Venus Mahadasha is actively influencing all creative and financial matters through March 2027.

Your 10th house Jupiter in Cancer is exceptionally powerful — this indicates a career in nurturing or service-oriented fields (healthcare, education, counseling, or hospitality) where you naturally excel and gain recognition.

The current Venus→Mars antardasha suggests the next 8 months are particularly favorable for bold career moves, starting a new venture, or negotiating salary increases. Mars in your 11th house amplifies professional gains through networks.

One caution: Saturn's 5th house placement advises against impulsive decisions. Proceed systematically, and you'll see sustained growth rather than a single breakthrough.`;

const ChatScreen = ({ credits, onBuyCredits }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Namaste ✦ I have your complete birth chart before me. What would you like to know about your cosmic path?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  const send = (text) => {
    if (!text.trim() || loading || credits <= 0) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: SAMPLE_RESPONSE }]);
      setLoading(false);
    }, 2200);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid var(--border)', background: 'rgba(9,9,15,0.85)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="cinzel" style={{ fontSize: 13, color: 'var(--gold2)' }}>AI Jyotish</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Chart-aware · Vedic interpretation</div>
        </div>
        <button className="credit-badge" onClick={onBuyCredits} style={{ cursor: 'pointer', border: '1px solid rgba(201,169,110,0.3)' }}>
          ✦ {credits} left
        </button>
      </div>

      {/* Messages */}
      <div className="scroll-area" style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
        {/* Suggestions */}
        {messages.length === 1 && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, textAlign: 'center' }}>Suggested questions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 16px', color: 'var(--muted)', textAlign: 'left', cursor: 'pointer', fontSize: 14, fontFamily: 'Cormorant Garamond', transition: 'all 0.2s' }} onMouseEnter={e => { e.target.style.borderColor = 'rgba(201,169,110,0.3)'; e.target.style.color = 'var(--text)'; }} onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--muted)'; }}>
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
              ? <div className="bubble-ai">{m.text}</div>
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

        {credits === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 16px' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>✦</div>
            <div className="cinzel" style={{ fontSize: 13, color: 'var(--gold)', marginBottom: 8 }}>Credits Exhausted</div>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16, fontFamily: 'Cormorant Garamond', fontStyle: 'italic' }}>Replenish your credits to continue your cosmic journey</p>
            <button className="btn-gold" style={{ maxWidth: 200 }} onClick={onBuyCredits}>Buy Credits</button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {credits > 0 && (
        <div style={{ padding: '12px 16px 28px', borderTop: '1px solid var(--border)', background: 'rgba(9,9,15,0.9)', backdropFilter: 'blur(12px)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <input
              className="input-field"
              style={{ flex: 1, borderRadius: 24, padding: '12px 18px' }}
              placeholder="Ask the stars anything…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
            />
            <button onClick={() => send(input)} style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #b8924a, #e8cc9a)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#09090f' }}>
              {Icon.send}
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>1 credit per question · Chart data sent to AI, not raw birth details</div>
        </div>
      )}
    </div>
  );
};

// ── SCREEN: Buy Credits ───────────────────────────────────────────────────────
const plans = [
  { id: 'starter', name: 'Seeker', questions: 5, price: '₹99', tag: null, color: 'var(--sky)' },
  { id: 'popular', name: 'Devotee', questions: 20, price: '₹299', tag: 'Most Popular', color: 'var(--gold)' },
  { id: 'unlimited', name: 'Sage', questions: '∞', price: '₹999', tag: 'Best Value', color: 'var(--rose)', note: 'Unlimited for 30 days' },
];

const CreditsScreen = ({ onClose }) => {
  const [selected, setSelected] = useState('popular');
  const [processing, setProcessing] = useState(false);

  const handleBuy = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); onClose(); }, 2000);
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1, paddingBottom: 40 }}>
      <div style={{ padding: '52px 20px 24px', textAlign: 'center' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 52, left: 20, background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 22 }}>←</button>
        <div style={{ fontSize: 36, marginBottom: 12 }}>✦</div>
        <h2 className="cinzel" style={{ fontSize: 18, color: 'var(--gold2)', marginBottom: 8 }}>Unlock AI Wisdom</h2>
        <p className="cormorant" style={{ fontSize: 16, color: 'var(--muted)', fontStyle: 'italic' }}>Each credit gives you one in-depth AI reading</p>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
        {plans.map(p => (
          <div key={p.id} className={`plan-card${selected === p.id ? ' selected' : ''}`} onClick={() => setSelected(p.id)} style={{ background: selected === p.id ? `rgba(${p.id === 'starter' ? '123,168,201' : p.id === 'popular' ? '201,169,110' : '201,123,154'},0.07)` : 'var(--card)' }}>
            {p.tag && <div className="plan-badge" style={{ background: p.color === 'var(--gold)' ? 'var(--gold)' : p.color, color: p.color === 'var(--rose)' ? '#fff' : '#09090f' }}>{p.tag}</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="cinzel" style={{ fontSize: 13, color: p.color, marginBottom: 6 }}>{p.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span className="cinzel" style={{ fontSize: 28, color: 'var(--text)' }}>{p.questions}</span>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>question{p.questions !== '∞' && 's'}</span>
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

      <div style={{ padding: '0 16px' }}>
        <button className="btn-gold" onClick={handleBuy} disabled={processing}>
          {processing ? 'Processing…' : `Pay with Razorpay →`}
        </button>
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

// ── Bottom Nav ────────────────────────────────────────────────────────────────
const BottomNav = ({ tab, setTab }) => (
  <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(9,9,15,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-around', padding: '8px 0 16px', zIndex: 100 }}>
    {[
      { id: 'home', label: 'Home', icon: Icon.home },
      { id: 'chart', label: 'Chart', icon: Icon.chart },
      { id: 'chat', label: 'Ask AI', icon: Icon.chat },
      { id: 'credits', label: 'Credits', icon: Icon.wallet },
    ].map(item => (
      <button key={item.id} className={`nav-tab${tab === item.id ? ' active' : ''}`} onClick={() => setTab(item.id)}>
        {item.icon}
        {item.label}
      </button>
    ))}
  </div>
);

// ── SCREEN: Home Dashboard ────────────────────────────────────────────────────
const HomeScreen = ({ onSetTab }) => {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  return (
    <div style={{ position: 'relative', zIndex: 1, paddingBottom: 90 }}>
      <div style={{ padding: '52px 20px 24px' }}>
        <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{today}</div>
        <h2 className="cinzel" style={{ fontSize: 20, color: 'var(--gold2)', marginBottom: 4 }}>Namaste, Priya</h2>
        <p className="cormorant" style={{ fontSize: 16, color: 'var(--muted)', fontStyle: 'italic' }}>The stars have messages for you today</p>
      </div>

      {/* Daily insight */}
      <div style={{ margin: '0 16px 20px' }}>
        <div className="glass" style={{ padding: 20, background: 'linear-gradient(135deg, rgba(201,169,110,0.08), rgba(123,168,201,0.04))', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 100, opacity: 0.04 }}>☽</div>
          <div style={{ fontSize: 10, color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Today's Cosmic Insight</div>
          <p className="cormorant" style={{ fontSize: 18, color: 'var(--text)', lineHeight: 1.65, fontWeight: 300 }}>
            "Moon in Rohini heightens your creative senses. An auspicious day for artistic pursuits, romantic conversations, and beginning new ventures in home or family matters."
          </p>
          <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
            <span className="planet-pill"><span style={{ color: 'var(--gold)' }}>☽</span> Rohini</span>
            <span className="planet-pill"><span style={{ color: 'var(--rose)' }}>♀</span> Venus day</span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ padding: '0 16px', marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Quick Actions</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { icon: '⟢', label: 'View\nBirth Chart', tab: 'chart', color: 'var(--gold)' },
            { icon: '✦', label: 'Ask the\nAI Jyotish', tab: 'chat', color: 'var(--rose)' },
            { icon: '☽', label: 'Daily\nHoroscope', tab: 'home', color: 'var(--sky)' },
            { icon: '◈', label: 'Dasha\nTimeline', tab: 'chart', color: 'var(--gold)' },
          ].map(a => (
            <button key={a.label} onClick={() => onSetTab(a.tab)} className="glass" style={{ padding: '20px 16px', textAlign: 'left', border: '1px solid var(--border)', borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <div style={{ fontSize: 24, color: a.color, marginBottom: 10 }}>{a.icon}</div>
              <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.4, whiteSpace: 'pre-line', fontFamily: 'Jost', fontWeight: 400 }}>{a.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Lucky elements */}
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

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('splash'); // splash | birth | app
  const [tab, setTab] = useState('home');
  const [credits, setCredits] = useState(3);

  const handleTabChange = (t) => {
    if (t === 'credits') { setScreen('credits'); return; }
    setTab(t);
  };

  if (screen === 'splash') return (
    <>
      <GlobalStyles />
      <Stars />
      <SplashScreen onNext={() => setScreen('birth')} />
    </>
  );

  if (screen === 'birth') return (
    <>
      <GlobalStyles />
      <Stars />
      <BirthDetailsScreen onComplete={() => setScreen('app')} />
    </>
  );

  if (screen === 'credits') return (
    <>
      <GlobalStyles />
      <Stars />
      <CreditsScreen onClose={() => { setCredits(prev => prev + 5); setScreen('app'); }} />
    </>
  );

  return (
    <>
      <GlobalStyles />
      <Stars />
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        {tab === 'home' && <HomeScreen onSetTab={handleTabChange} />}
        {tab === 'chart' && <ChartScreen onAskAI={() => setTab('chat')} />}
        {tab === 'chat' && <ChatScreen credits={credits} onBuyCredits={() => setScreen('credits')} />}
        <BottomNav tab={tab} setTab={handleTabChange} />
      </div>
    </>
  );
}
