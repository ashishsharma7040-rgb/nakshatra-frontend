// src/api.js
// Centralised API helper. All backend calls go through here.
// The base URL is set via REACT_APP_API_URL environment variable in Vercel.

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// ── Auth helpers ──────────────────────────────────────────────────────────────

export async function registerUser({ name, email, password }) {
  const res  = await fetch(`${BASE_URL}/api/auth/register`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ name, email, password }),
  });
  return res.json().then(data => ({ ok: res.ok, status: res.status, data }));
}

export async function loginUser({ email, password }) {
  const res  = await fetch(`${BASE_URL}/api/auth/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email, password }),
  });
  return res.json().then(data => ({ ok: res.ok, status: res.status, data }));
}

export async function getMe(token) {
  const res = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json().then(data => ({ ok: res.ok, data }));
}

// ── Chart helpers ─────────────────────────────────────────────────────────────

export async function generateChart(token, { dob, time, location }) {
  const res  = await fetch(`${BASE_URL}/api/chart/generate`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body:    JSON.stringify({ dob, time, location }),
  });
  return res.json().then(data => ({ ok: res.ok, status: res.status, data }));
}

export async function getMyChart(token) {
  const res = await fetch(`${BASE_URL}/api/chart/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json().then(data => ({ ok: res.ok, status: res.status, data }));
}

// ── AI helpers ────────────────────────────────────────────────────────────────

export async function askAI(token, question) {
  const res  = await fetch(`${BASE_URL}/api/ai/ask`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body:    JSON.stringify({ question }),
  });
  return res.json().then(data => ({ ok: res.ok, status: res.status, data }));
}

export async function getChatHistory(token) {
  const res = await fetch(`${BASE_URL}/api/ai/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json().then(data => ({ ok: res.ok, data }));
}

// ── Payment helpers ───────────────────────────────────────────────────────────

export async function createPaymentOrder(token, planId) {
  const res  = await fetch(`${BASE_URL}/api/payment/create-order`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body:    JSON.stringify({ planId }),
  });
  return res.json().then(data => ({ ok: res.ok, status: res.status, data }));
}

export async function verifyPayment(token, { razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  const res  = await fetch(`${BASE_URL}/api/payment/verify`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body:    JSON.stringify({ razorpay_order_id, razorpay_payment_id, razorpay_signature }),
  });
  return res.json().then(data => ({ ok: res.ok, status: res.status, data }));
}

export async function getUserCredits(token) {
  const res = await fetch(`${BASE_URL}/api/user/credits`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json().then(data => ({ ok: res.ok, data }));
}
