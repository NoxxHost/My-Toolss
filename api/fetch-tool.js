// api/fetch-tool.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Header CORS
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
    return res.status(400).json({ error: true, message: "Parameter tidak lengkap." });
  }

  try {
    const targetUrl = `https://api.xvortex.biz.id${endpoint}?${paramName}=${encodeURIComponent(value)}`;
    
    // Set timeout atau simpan response asli
    const apiResponse = await fetch(targetUrl, { 
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Validasi apakah responnya berupa teks biasa (HTML Eror) atau JSON asli
    const contentType = apiResponse.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textError = await apiResponse.text();
      return res.status(502).json({ 
        error: true, 
        message: `API Pusat tidak mengirim JSON. Server luar merespon: ${textError.substring(0, 150)}...` 
      });
    }

    const data = await apiResponse.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: true, message: `Gagal menyambung ke API: ${error.message}` });
  }
};
