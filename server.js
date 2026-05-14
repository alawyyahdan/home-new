require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 1001;

const SITRANFER_API = 'https://rest.sitranfer.com/payment/api';
const API_KEY = process.env.API_KEY || '';

app.use(cors());
app.use(express.json());

// ─── QRIS API Routes ────────────────────────────────────────────────────────

// Generate QRIS
app.post('/api/generate', async (req, res) => {
  try {
    const { amount, player_username } = req.body;
    const response = await axios.post(`${SITRANFER_API}/generate`, {
      key: API_KEY,
      channel: 'QRIS',
      amount,
      player_username,
    });
    res.json(response.data);
  } catch (error) {
    console.error('Generate Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: error.message, error: error.response?.data });
  }
});

// Check Status
app.post('/api/status', async (req, res) => {
  try {
    const { transaction_id } = req.body;
    const response = await axios.post(`${SITRANFER_API}/status`, {
      key: API_KEY,
      transaction_id,
    });
    res.json(response.data);
  } catch (error) {
    console.error('Status Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: error.message, error: error.response?.data });
  }
});

// Callback / Webhook dari SiTranfer
app.post('/api/callback', (req, res) => {
  const cb = req.body;
  if (cb && cb.success && cb.data?.status === 'success') {
    console.log('✅ CALLBACK: Pembayaran SUCCESS TRX:', cb.data.transaction_id);
    res.json({ status: 'ok' });
  } else {
    res.json({ status: 'ignored' });
  }
});

// ─── Static Frontend ─────────────────────────────────────────────────────────

app.use(express.static(__dirname));

// 404 fallback
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔑 API_KEY: ${API_KEY ? '✅ Loaded' : '❌ MISSING — set API_KEY in .env'}`);
});
