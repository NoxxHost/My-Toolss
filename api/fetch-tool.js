// api/fetch-tool.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Mengaktifkan Header CORS agar web lancar diakses
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { endpoint, paramName, value } = req.query;

  if (!endpoint || !paramName || !value) {
    return res.status(400).json({ error: true, message: "Missing required parameters." });
  }

  try {
    // Membangun URL tujuan dinamis ke API xvortex
    const targetUrl = `https://api.xvortex.biz.id${endpoint}?${paramName}=${encodeURIComponent(value)}`;
    
    const apiResponse = await fetch(targetUrl, { method: 'GET' });
    const data = await apiResponse.json();
    
    // Kirimkan balik data responnya ke UI web secara bersih tanpa error
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};
