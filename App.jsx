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

// ── SCREEN: Birth Details Form ────────────────────────────────────────────────
// This is the FIXED version — form data is collected then sent to real backend API
// Flow: user fills form → POST /api/auth/register → POST /api/chart/generate → show chart

const PLANET_SYMBOLS = {
  sun:'☉', moon:'☽', mercury:'☿', venus:'♀', mars:'♂',
  jupiter:'♃', saturn:'♄', rahu:'☊', ketu:'☋',
};
const PLANET_COLORS = {
  sun:'#e8cc9a', moon:'#b8d4e8', mercury:'#90d4b0', venus:'#c97b9a',
  mars:'#e87070', jupiter:'#f0c070', saturn:'#a0a0c8', rahu:'#c4a8d0', ketu:'#d0b090',
};

const BirthDetailsScreen = ({ onComplete }) => {
  const [form, setForm] = useState({ name:'', email:'', password:'', dob:'', time:'', location:'' });
  const [step, setStep] = useState(0); // 0=form, 1=loading, 2=error
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('Connecting to server...');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    if (!form.name || !form.dob || !form.time || !form.location) {
      setErrorMsg('Please fill in all fields including birth time and location.');
      return;
    }
    setErrorMsg('');
    setStep(1);
    setProgress(10);

    const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

    try {
      // ── Step 1: Register / login user ──────────────────────────────
      setStatusMsg('Creating your account...');
      setProgress(20);

      const email    = form.email || `${form.name.toLowerCase().replace(/\s+/g,'.')}.${Date.now()}@nakshatra.ai`;
      const password = form.password || `nk_${Date.now()}`;

      let token;
      try {
        const regRes  = await fetch(`${API}/api/auth/register`, {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ name:form.name, email, password }),
        });
        const regData = await regRes.json();
        if (regRes.ok) {
          token = regData.token;
        } else {
          // Account may already exist — try login
          const loginRes  = await fetch(`${API}/api/auth/login`, {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ email, password }),
          });
          const loginData = await loginRes.json();
          if (!loginRes.ok) throw new Error(loginData.error || 'Authentication failed');
          token = loginData.token;
        }
      } catch (authErr) {
        throw new Error(`Account error: ${authErr.message}`);
      }

      localStorage.setItem('nakshatra_token', token);
      localStorage.setItem('nakshatra_user_name', form.name);
      setProgress(40);

      // ── Step 2: Geocode + Calculate birth chart ────────────────────
      setStatusMsg('Geocoding your birth location...');
      setProgress(50);

      const chartRes = await fetch(`${API}/api/chart/generate`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${token}` },
        body: JSON.stringify({ dob:form.dob, time:form.time, location:form.location }),
      });
      const chartData = await chartRes.json();

      if (!chartRes.ok) throw new Error(chartData.error || chartData.errors?.[0]?.msg || 'Chart generation failed');

      setStatusMsg('Calculating planetary positions...');
      setProgress(75);

      // Store chart in localStorage for display
      localStorage.setItem('nakshatra_chart', JSON.stringify(chartData.chart));
      localStorage.setItem('nakshatra_birthplace', chartData.birthPlace || form.location);
      localStorage.setItem('nakshatra_dob', form.dob);
      localStorage.setItem('nakshatra_time', form.time);

      setStatusMsg('Building your Vedic chart...');
      setProgress(90);

      await new Promise(r => setTimeout(r, 600));
      setProgress(100);
      setStatusMsg('Chart ready!');
      await new Promise(r => setTimeout(r, 400));

      onComplete();

    } catch (err) {
      console.error('Chart generation error:', err);
      setStep(2);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  // Loading screen
  if (step === 1) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32, position:'relative', zIndex:1 }}>
      <div style={{ textAlign:'center', maxWidth:320 }}>
        <div style={{ width:80, height:80, borderRadius:'50%', border:'2px solid var(--gold)', borderTopColor:'transparent', margin:'0 auto 32px', animation:'spin 1.2s linear infinite' }} />
        <h2 className="cinzel" style={{ fontSize:16, color:'var(--gold)', marginBottom:12 }}>Reading the Stars</h2>
        <p className="cormorant" style={{ fontSize:17, color:'var(--muted)', marginBottom:28, fontStyle:'italic' }}>{statusMsg}</p>
        <div style={{ height:3, background:'rgba(255,255,255,0.06)', borderRadius:2, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${progress}%`, background:'linear-gradient(90deg, #b8924a, #e8cc9a)', borderRadius:2, transition:'width 0.4s ease' }} />
        </div>
        <div style={{ marginTop:16, display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
          {[['Geocoding location',20],['Swiss Ephemeris',50],['Calculating Dashas',75],['Building chart',90]].map(([s,p]) => (
            <span key={s} style={{ fontSize:10, color:progress>=p?'var(--gold)':'var(--muted)', letterSpacing:'0.06em', textTransform:'uppercase', transition:'color 0.3s', display:'flex', alignItems:'center', gap:4 }}>
              {progress>=p ? '✓' : '○'} {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', position:'relative', zIndex:1 }}>
      <div style={{ padding:'48px 24px 24px', textAlign:'center' }}>
        <div style={{ fontSize:11, color:'var(--gold)', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:12 }}>Your Cosmic Profile</div>
        <h2 className="cinzel" style={{ fontSize:20, color:'var(--gold2)', lineHeight:1.4 }}>Enter Birth Details</h2>
        <p className="cormorant" style={{ fontSize:16, color:'var(--muted)', marginTop:8, fontStyle:'italic' }}>Precise time & place reveal your authentic chart</p>
      </div>

      <div style={{ flex:1, padding:'0 24px 32px', maxWidth:440, margin:'0 auto', width:'100%' }}>
        {errorMsg && (
          <div style={{ background:'rgba(232,112,112,0.1)', border:'1px solid rgba(232,112,112,0.3)', borderRadius:10, padding:'12px 16px', marginBottom:16, fontSize:13, color:'#e87070', lineHeight:1.5 }}>
            ⚠ {errorMsg}
          </div>
        )}

        <div className="glass" style={{ padding:24 }}>
          <div className="input-wrap">
            <label className="input-label">Full Name *</label>
            <input className="input-field" placeholder="e.g. Rahul Sharma" value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
          </div>
          <div className="input-wrap">
            <label className="input-label">Date of Birth *</label>
            <input className="input-field" type="date" value={form.dob} onChange={e => setForm({...form, dob:e.target.value})} style={{ colorScheme:'dark' }} />
          </div>
          <div className="input-wrap">
            <label className="input-label">Time of Birth * <span style={{ color:'var(--muted)', fontSize:10 }}>(as accurate as possible)</span></label>
            <input className="input-field" type="time" value={form.time} onChange={e => setForm({...form, time:e.target.value})} style={{ colorScheme:'dark' }} />
          </div>
          <div className="input-wrap" style={{ marginBottom:0 }}>
            <label className="input-label">Place of Birth *</label>
            <input className="input-field" placeholder="e.g. Mumbai, India" value={form.location} onChange={e => setForm({...form, location:e.target.value})} />
          </div>
        </div>

        <div className="divider" />

        <div style={{ background:'rgba(201,169,110,0.05)', border:'1px solid rgba(201,169,110,0.15)', borderRadius:12, padding:16, marginBottom:20 }}>
          <div style={{ fontSize:12, color:'var(--gold)', marginBottom:6, letterSpacing:'0.06em', textTransform:'uppercase' }}>Why time matters</div>
          <p className="cormorant" style={{ fontSize:15, color:'var(--muted)', lineHeight:1.6 }}>Even a 4-minute difference shifts your Ascendant. For the most precise Vedic chart, use your birth certificate or hospital records.</p>
        </div>

        <button className="btn-gold" onClick={handleSubmit} disabled={!form.name||!form.dob||!form.time||!form.location}>
          ✦ Generate My Birth Chart
        </button>
      </div>
    </div>
  );
};

// ── SCREEN: Chart Display ─────────────────────────────────────────────────────
// Shows REAL chart data fetched from backend (not SAMPLE_CHART)

const SIGN_GLYPHS = {'Aries':'♈','Taurus':'♉','Gemini':'♊','Cancer':'♋','Leo':'♌','Virgo':'♍','Libra':'♎','Scorpio':'♏','Sagittarius':'♐','Capricorn':'♑','Aquarius':'♒','Pisces':'♓'};

const ChartScreen = ({ onAskAI }) => {
  const [tab, setTab] = useState('planets');
  const [chart, setChart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userName  = localStorage.getItem('nakshatra_user_name') || 'You';
  const birthPlace = localStorage.getItem('nakshatra_birthplace') || '';
  const dob       = localStorage.getItem('nakshatra_dob') || '';
  const time      = localStorage.getItem('nakshatra_time') || '';

  useEffect(() => {
    // Try localStorage first (fast), then fetch from server
    const cached = localStorage.getItem('nakshatra_chart');
    if (cached) {
      try { setChart(JSON.parse(cached)); setLoading(false); return; } catch(e) {}
    }

    const API   = process.env.REACT_APP_API_URL || 'http://localhost:4000';
    const token = localStorage.getItem('nakshatra_token');
    if (!token) { setError('Please generate your chart first.'); setLoading(false); return; }

    fetch(`${API}/api/chart/me`, { headers:{ Authorization:`Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (data.chart) {
          setChart(data.chart.chart_data || data.chart);
          localStorage.setItem('nakshatra_chart', JSON.stringify(data.chart.chart_data || data.chart));
        } else {
          setError('No chart found. Please go back and generate your chart.');
        }
        setLoading(false);
      })
      .catch(() => { setError('Could not load chart. Please try again.'); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', zIndex:1 }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:50, height:50, borderRadius:'50%', border:'2px solid var(--gold)', borderTopColor:'transparent', margin:'0 auto 20px', animation:'spin 1s linear infinite' }} />
        <p className="cormorant" style={{ color:'var(--muted)', fontStyle:'italic' }}>Loading your chart...</p>
      </div>
    </div>
  );

  if (error || !chart) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:32, position:'relative', zIndex:1 }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:40, marginBottom:16 }}>⚠</div>
        <p style={{ color:'var(--muted)', fontSize:15 }}>{error || 'Chart not available'}</p>
      </div>
    </div>
  );

  const { ascendant, planets, currentDasha } = chart;
  const planetList = Object.entries(planets || {});

  return (
    <div style={{ position:'relative', zIndex:1, paddingBottom:90 }}>
      {/* Header */}
      <div style={{ padding:'52px 24px 20px', background:'linear-gradient(180deg, rgba(9,9,15,0.9) 0%, transparent 100%)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
          <div>
            <div style={{ fontSize:11, color:'var(--gold)', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4 }}>Vedic Birth Chart</div>
            <h2 className="cinzel" style={{ fontSize:18, color:'var(--gold2)' }}>{userName}</h2>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:11, color:'var(--gold)', marginBottom:2 }}>Lahiri · Whole Sign</div>
            <div style={{ fontSize:10, color:'var(--muted)' }}>{ascendant?.nakshatra?.name}</div>
          </div>
        </div>
        <p style={{ fontSize:12, color:'var(--muted)' }}>{dob} · {time} · {birthPlace}</p>
      </div>

      {/* Zodiac Wheel */}
      <div style={{ padding:'8px 24px 24px' }}>
        <div style={{ position:'relative', width:220, height:220, margin:'0 auto' }} className="float">
          <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1px solid rgba(201,169,110,0.3)', background:'radial-gradient(circle at center, rgba(201,169,110,0.04), transparent 70%)' }} />
          <div style={{ position:'absolute', inset:20, borderRadius:'50%', border:'1px solid rgba(201,169,110,0.15)' }} />
          <div style={{ position:'absolute', inset:50, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.06)' }} />
          <div style={{ position:'absolute', inset:70, borderRadius:'50%', background:'radial-gradient(circle, rgba(201,169,110,0.2), rgba(201,169,110,0.05))', border:'1px solid rgba(201,169,110,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>✦</div>
          {['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map((s,i) => {
            const angle=(i/12)*360-90, rad=angle*Math.PI/180, r=88;
            const x=110+r*Math.cos(rad), y=110+r*Math.sin(rad);
            return <div key={i} style={{ position:'absolute', left:x-10, top:y-10, width:20, height:20, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'rgba(201,169,110,0.7)' }}>{s}</div>;
          })}
          {/* Real planet positions on wheel */}
          {planetList.slice(0,7).map(([name,data],i) => {
            const angle=(data.signIndex/12)*360+data.degrees/12-90;
            const rad=angle*Math.PI/180, r=55;
            const x=110+r*Math.cos(rad), y=110+r*Math.sin(rad);
            return <div key={name} style={{ position:'absolute', left:x-8, top:y-8, width:16, height:16, borderRadius:'50%', background:PLANET_COLORS[name]||'#888', border:'1px solid rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'#09090f', fontWeight:700, cursor:'default' }} title={`${name}: ${data.formatted}`}>{PLANET_SYMBOLS[name]||'•'}</div>;
          })}
        </div>
      </div>

      {/* Key Highlights */}
      <div style={{ padding:'0 16px', marginBottom:16 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
          {[
            { label:'Ascendant', value:ascendant?.sign, sym:SIGN_GLYPHS[ascendant?.sign]||'✦' },
            { label:'Moon Sign',  value:planets?.moon?.sign, sym:SIGN_GLYPHS[planets?.moon?.sign]||'☽' },
            { label:'Sun Sign',   value:planets?.sun?.sign,  sym:SIGN_GLYPHS[planets?.sun?.sign]||'☉' },
          ].map(item => (
            <div key={item.label} className="glass" style={{ padding:'14px 10px', textAlign:'center' }}>
              <div style={{ fontSize:22, color:'var(--gold)', marginBottom:6 }}>{item.sym}</div>
              <div className="cinzel" style={{ fontSize:10, color:'var(--gold2)', marginBottom:4 }}>{item.value||'—'}</div>
              <div style={{ fontSize:9, color:'var(--muted)', letterSpacing:'0.08em', textTransform:'uppercase' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Dasha Banner */}
      {currentDasha && (
        <div style={{ margin:'0 16px 16px' }}>
          <div className="glass" style={{ padding:'14px 18px', background:'linear-gradient(135deg, rgba(201,123,154,0.08), rgba(201,169,110,0.05))', borderColor:'rgba(201,123,154,0.2)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div style={{ fontSize:10, color:'var(--rose)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:6 }}>Current Dasha Period</div>
                <div className="cormorant" style={{ fontSize:18, color:'var(--text)', fontWeight:500 }}>{currentDasha.planet} Mahadasha</div>
                <div style={{ fontSize:12, color:'var(--muted)', marginTop:4 }}>{planets?.moon?.nakshatra?.name} Nakshatra</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:10, color:'var(--muted)', marginBottom:4 }}>Ends</div>
                <div style={{ fontSize:12, color:'var(--gold)' }}>{currentDasha.endDate}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ padding:'0 16px', marginBottom:12 }}>
        <div style={{ display:'flex', gap:8 }}>
          {['planets','nakshatras','dasha'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex:1, padding:'10px 0', border:tab===t?'1px solid var(--gold)':'1px solid var(--border)', borderRadius:10, background:tab===t?'rgba(201,169,110,0.08)':'transparent', color:tab===t?'var(--gold)':'var(--muted)', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer', fontFamily:'Jost' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Planets Tab */}
      {tab === 'planets' && (
        <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:8 }}>
          {planetList.map(([name, data]) => (
            <div key={name} className="glass" style={{ padding:'12px 16px', display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:34, height:34, borderRadius:'50%', background:`radial-gradient(circle at 35% 35%, ${PLANET_COLORS[name]||'#888'}, ${PLANET_COLORS[name]||'#888'}44)`, border:`1px solid ${PLANET_COLORS[name]||'#888'}55`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{PLANET_SYMBOLS[name]||'•'}</div>
              <div style={{ flex:1 }}>
                <div className="cormorant" style={{ fontSize:14, color:'var(--text)', fontWeight:500, textTransform:'capitalize' }}>{name}</div>
                <div style={{ fontSize:12, color:'var(--muted)' }}>{data.formatted}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:11, color:'var(--gold)', background:'rgba(201,169,110,0.08)', padding:'3px 9px', borderRadius:20 }}>H{data.house}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Nakshatras Tab */}
      {tab === 'nakshatras' && (
        <div style={{ padding:'0 16px' }}>
          <div className="glass" style={{ padding:18 }}>
            {[
              ['Ascendant', ascendant?.nakshatra],
              ['Moon', planets?.moon?.nakshatra],
              ['Sun', planets?.sun?.nakshatra],
            ].map(([label, nak]) => nak && (
              <div key={label} style={{ padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
                <div style={{ fontSize:10, color:'var(--gold)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:5 }}>{label} Nakshatra</div>
                <div className="cormorant" style={{ fontSize:19, color:'var(--text)', fontWeight:500, marginBottom:2 }}>{nak.name}</div>
                <div style={{ fontSize:12, color:'var(--muted)' }}>Pada {nak.pada} · Ruled by {nak.lord}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dasha Tab */}
      {tab === 'dasha' && (
        <div style={{ padding:'0 16px' }}>
          <div className="glass" style={{ padding:18 }}>
            <div style={{ fontSize:10, color:'var(--gold)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:14 }}>Vimshottari Dasha Sequence</div>
            {(chart.dashaSequence||[]).map((d, i) => {
              const now = new Date();
              const isActive = new Date(d.startDate) <= now && now < new Date(d.endDate);
              return (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)', opacity:isActive?1:0.6 }}>
                  <div>
                    <span className="cormorant" style={{ fontSize:16, color:isActive?'var(--gold)':'var(--text)', fontWeight:isActive?500:300 }}>{d.planet}</span>
                    {isActive && <span style={{ marginLeft:8, fontSize:9, background:'var(--gold)', color:'#09090f', padding:'2px 7px', borderRadius:20, fontWeight:700 }}>NOW</span>}
                  </div>
                  <div style={{ textAlign:'right', fontSize:11, color:'var(--muted)' }}>
                    <div>{d.startDate.slice(0,7)} → {d.endDate.slice(0,7)}</div>
                    <div style={{ fontSize:10 }}>{d.years} years</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ask AI CTA */}
      <div style={{ margin:'20px 16px 0' }}>
        <button className="btn-gold" onClick={onAskAI}>
          ✦ Ask the Stars · AI Consultation
        </button>
      </div>
    </div>
  );
};

// ── SCREEN: AI Chat ───────────────────────────────────────────────────────────
// FIXED: Calls real backend API with JWT auth, sends question, gets Gemini response

const SUGGESTIONS = [
  'How will my career progress in the next 2 years?',
  'When is a good time for marriage?',
  'What business is best suited for me?',
  'Tell me about my health and vitality',
];

const ChatScreen = ({ credits, setCredits, onBuyCredits }) => {
  const userName = localStorage.getItem('nakshatra_user_name') || 'you';
  const [messages, setMessages] = useState([
    { role:'ai', text:`Namaste ✦ I have your complete Vedic birth chart before me, ${userName}. Ask me anything about your cosmic path — career, relationships, timing, or spiritual growth.` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [localCredits, setLocalCredits] = useState(credits);
  const bottomRef = useRef();

  const send = async (text) => {
    if (!text.trim() || loading || localCredits <= 0) return;

    setMessages(prev => [...prev, { role:'user', text }]);
    setInput('');
    setLoading(true);

    const API   = process.env.REACT_APP_API_URL || 'http://localhost:4000';
    const token = localStorage.getItem('nakshatra_token');

    try {
      const res  = await fetch(`${API}/api/ai/ask`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${token}` },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          setMessages(prev => [...prev, { role:'ai', text:'You have used all your credits. Please purchase more to continue receiving Vedic guidance.' }]);
          setLocalCredits(0);
        } else if (data.error === 'NO_CHART') {
          setMessages(prev => [...prev, { role:'ai', text:'Please generate your birth chart first before asking questions.' }]);
        } else {
          throw new Error(data.error || 'Failed to get response');
        }
      } else {
        setMessages(prev => [...prev, { role:'ai', text: data.answer }]);
        const remaining = typeof data.creditsRemaining === 'number' ? data.creditsRemaining : localCredits - 1;
        setLocalCredits(remaining);
        if (setCredits) setCredits(remaining);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role:'ai', text:`Sorry, I encountered an error: ${err.message}. Please try again.` }]);
    }

    setLoading(false);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, loading]);

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', position:'relative', zIndex:1 }}>
      {/* Header */}
      <div style={{ padding:'52px 20px 16px', borderBottom:'1px solid var(--border)', background:'rgba(9,9,15,0.85)', backdropFilter:'blur(12px)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div className="cinzel" style={{ fontSize:13, color:'var(--gold2)' }}>AI Jyotish</div>
          <div style={{ fontSize:11, color:'var(--muted)', marginTop:2 }}>Chart-aware · Vedic · Gemini AI</div>
        </div>
        <button className="credit-badge" onClick={onBuyCredits} style={{ cursor:'pointer', border:'1px solid rgba(201,169,110,0.3)' }}>
          ✦ {localCredits === '∞' ? '∞' : localCredits} {localCredits !== '∞' && 'credits'}
        </button>
      </div>

      {/* Messages */}
      <div className="scroll-area" style={{ flex:1, padding:'20px 16px', display:'flex', flexDirection:'column', gap:16, overflowY:'auto' }}>
        {messages.length === 1 && (
          <div style={{ marginBottom:8 }}>
            <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:12, textAlign:'center' }}>Suggested questions</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)', borderRadius:12, padding:'11px 16px', color:'var(--muted)', textAlign:'left', cursor:'pointer', fontSize:14, fontFamily:'Cormorant Garamond', transition:'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(201,169,110,0.3)'; e.currentTarget.style.color='var(--text)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--muted)'; }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ display:'flex', flexDirection:m.role==='user'?'row-reverse':'row', alignItems:'flex-start', gap:10 }}>
            {m.role === 'ai' && (
              <div style={{ width:32, height:32, borderRadius:'50%', background:'radial-gradient(circle, #c9a96e, #b8924a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0, marginTop:2 }}>✦</div>
            )}
            {m.role === 'ai'
              ? <div className="bubble-ai" style={{ whiteSpace:'pre-line' }}>{m.text}</div>
              : <div className="bubble-user">{m.text}</div>
            }
          </div>
        ))}

        {loading && (
          <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'radial-gradient(circle, #c9a96e, #b8924a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>✦</div>
            <div className="bubble-ai" style={{ display:'flex', alignItems:'center', gap:6, padding:'16px 20px' }}>
              <div className="dot" /><div className="dot" /><div className="dot" />
            </div>
          </div>
        )}

        {localCredits === 0 && (
          <div style={{ textAlign:'center', padding:'24px 16px' }}>
            <div style={{ fontSize:28, marginBottom:12 }}>✦</div>
            <div className="cinzel" style={{ fontSize:13, color:'var(--gold)', marginBottom:8 }}>Credits Exhausted</div>
            <p className="cormorant" style={{ fontSize:15, color:'var(--muted)', marginBottom:16, fontStyle:'italic' }}>Replenish your credits to continue your cosmic journey</p>
            <button className="btn-gold" style={{ maxWidth:200 }} onClick={onBuyCredits}>Buy Credits</button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {localCredits !== 0 && (
        <div style={{ padding:'12px 16px 28px', borderTop:'1px solid var(--border)', background:'rgba(9,9,15,0.9)', backdropFilter:'blur(12px)' }}>
          <div style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
            <input
              className="input-field"
              style={{ flex:1, borderRadius:24, padding:'12px 18px' }}
              placeholder="Ask the stars anything…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
            />
            <button onClick={() => send(input)} disabled={loading || !input.trim()} style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg, #b8924a, #e8cc9a)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'#09090f', opacity:loading||!input.trim()?0.5:1 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
          <div style={{ textAlign:'center', marginTop:8, fontSize:10, color:'rgba(255,255,255,0.2)' }}>
            1 credit per question · Powered by Google Gemini AI
          </div>
        </div>
      )}
    </div>
  );
};

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

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('splash'); // splash | birth | app
  const [tab, setTab]       = useState('home');
  const [credits, setCredits] = useState(3);

  const handleTabChange = (t) => {
    if (t === 'credits') { setScreen('credits'); return; }
    setTab(t);
  };

  if (screen === 'splash') return (
    <><GlobalStyles /><Stars />
      <SplashScreen onNext={() => setScreen('birth')} />
    </>
  );

  if (screen === 'birth') return (
    <><GlobalStyles /><Stars />
      <BirthDetailsScreen onComplete={() => { setScreen('app'); setTab('chart'); }} />
    </>
  );

  if (screen === 'credits') return (
    <><GlobalStyles /><Stars />
      <CreditsScreen onClose={() => { setCredits(prev => prev + 5); setScreen('app'); }} />
    </>
  );

  return (
    <><GlobalStyles /><Stars />
      <div style={{ position:'relative', minHeight:'100vh' }}>
        {tab === 'home'   && <HomeScreen onSetTab={handleTabChange} />}
        {tab === 'chart'  && <ChartScreen onAskAI={() => setTab('chat')} />}
        {tab === 'chat'   && <ChatScreen credits={credits} setCredits={setCredits} onBuyCredits={() => setScreen('credits')} />}
        <BottomNav tab={tab} setTab={handleTabChange} />
      </div>
    </>
  );
}
