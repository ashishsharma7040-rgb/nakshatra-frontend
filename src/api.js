/**
 * ╔══════════════════════════════════════════════════════╗
 * ║   API SERVICE — Frontend ↔ Backend connector        ║
 * ║   Every backend endpoint wired up and ready         ║
 * ║   Import this in any component to call the backend  ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * Usage examples:
 *   import api from './api'
 *   const { token } = await api.auth.login(email, password)
 *   const { chart } = await api.chart.generate(dob, time, location)
 *   const { answer } = await api.ai.ask("How is my career?")
 */

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// ── Token storage ─────────────────────────────────────────────────────────────
const token = {
  get:    () => localStorage.getItem('nakshatra_token'),
  set:    (t) => localStorage.setItem('nakshatra_token', t),
  remove: () => localStorage.removeItem('nakshatra_token'),
};

// ── Base fetch with auth header ───────────────────────────────────────────────
async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const t = token.get();
  if (t) headers['Authorization'] = `Bearer ${t}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, config);
  const data = await res.json();

  if (!res.ok) {
    // Surface the backend error message cleanly
    throw new Error(data.error || data.message || `Request failed (${res.status})`);
  }
  return data;
}

const get  = (path)        => request('GET',    path);
const post = (path, body)  => request('POST',   path, body);

// ── AUTH ──────────────────────────────────────────────────────────────────────
const auth = {
  /**
   * Register a new account
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @returns {{ token, user }}
   */
  register: async (name, email, password) => {
    const data = await post('/api/auth/register', { name, email, password });
    if (data.token) token.set(data.token);
    return data;
  },

  /**
   * Login to existing account
   * @param {string} email
   * @param {string} password
   * @returns {{ token, user }}
   */
  login: async (email, password) => {
    const data = await post('/api/auth/login', { email, password });
    if (data.token) token.set(data.token);
    return data;
  },

  /** Get current logged-in user */
  me: () => get('/api/auth/me'),

  /** Logout — clear token */
  logout: () => token.remove(),

  /** Check if user is logged in */
  isLoggedIn: () => !!token.get(),
};

// ── CHART ─────────────────────────────────────────────────────────────────────
const chart = {
  /**
   * Generate birth chart from birth details
   * Flow: location geocoded → Swiss Ephemeris → chart stored in DB
   * @param {string} dob       "YYYY-MM-DD"
   * @param {string} time      "HH:MM"
   * @param {string} location  "Mumbai, India"
   * @returns {{ chart, birthPlace, timezone }}
   */
  generate: (dob, time, location) =>
    post('/api/chart/generate', { dob, time, location }),

  /** Fetch previously saved chart */
  getMyChart: () => get('/api/chart/me'),

  /** Get today's AI-generated horoscope */
  getDailyHoroscope: () => get('/api/chart/horoscope'),
};

// ── AI CHAT ───────────────────────────────────────────────────────────────────
const ai = {
  /**
   * Ask the AI a question about your chart
   * Costs 1 credit per question
   * @param {string} question
   * @returns {{ answer, creditsRemaining }}
   */
  ask: (question) => post('/api/ai/ask', { question }),

  /** Get past questions and answers */
  getHistory: (limit = 20) => get(`/api/ai/history?limit=${limit}`),
};

// ── PAYMENTS ──────────────────────────────────────────────────────────────────
const payment = {
  /** Get available plans */
  getPlans: () => get('/api/payment/plans'),

  /**
   * Step 1: Create a Razorpay order
   * @param {'starter'|'popular'|'sage'} plan
   * @returns {{ orderId, amount, keyId }}
   */
  createOrder: (plan) => post('/api/payment/create-order', { plan }),

  /**
   * Step 2: Verify payment after Razorpay popup completes
   * @param {object} razorpayResult  - from Razorpay success callback
   * @param {string} plan
   * @returns {{ success, credits }}
   */
  verify: (razorpayResult, plan) =>
    post('/api/payment/verify', { ...razorpayResult, plan }),

  /**
   * Complete Razorpay payment flow
   * Handles opening popup + verification automatically
   * @param {'starter'|'popular'|'sage'} plan
   * @param {object} userInfo  { name, email }
   */
  startPayment: async (plan, userInfo) => {
    // Step 1: Create order
    const order = await payment.createOrder(plan);

    // Step 2: Open Razorpay popup
    return new Promise((resolve, reject) => {
      const options = {
        key:          order.keyId,
        amount:       order.amount,
        currency:     'INR',
        name:         'Nakshatra AI',
        description:  `${order.planName} Plan`,
        order_id:     order.orderId,
        prefill: {
          name:  userInfo.name  || '',
          email: userInfo.email || '',
        },
        theme: { color: '#c9a96e' },
        handler: async (response) => {
          try {
            // Step 3: Verify with backend
            const result = await payment.verify(response, plan);
            resolve(result);
          } catch (err) {
            reject(err);
          }
        },
        modal: {
          ondismiss: () => reject(new Error('Payment cancelled')),
        },
      };

      if (!window.Razorpay) {
        reject(new Error('Razorpay script not loaded. Add to index.html: <script src="https://checkout.razorpay.com/v1/checkout.js"></script>'));
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  },
};

// ── USER ──────────────────────────────────────────────────────────────────────
const user = {
  getProfile: () => get('/api/user/profile'),
  getCredits: () => get('/api/user/credits'),
};

// ── Health check ──────────────────────────────────────────────────────────────
const health = () => get('/health');

// ── Default export ────────────────────────────────────────────────────────────
const api = { auth, chart, ai, payment, user, health };
export default api;
export { token };
