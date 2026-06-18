// api/fetch-tool.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Mengaktifkan Header CORS agar web lancar diakses dari domain vercel
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
    return res.status(400).json({ error: true, message: "Parameter input tidak lengkap." });
  }

  try {
    // SEKARANG MENGGUNAKAN BASE URL BARU: api.xvortex.my.id
    const targetUrl = `https://api.xvortex.my.id${endpoint}?${paramName}=${encodeURIComponent(value)}`;
    
    const apiResponse = await fetch(targetUrl, { 
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
      }
    });

    // Cek apakah response berupa JSON atau bukan
    const contentType = apiResponse.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textError = await apiResponse.text();
      return res.status(502).json({ 
        error: true, 
        message: `Server API luar tidak merespon dengan JSON. Respon teks: ${textError.substring(0, 100)}...` 
      });
    }

    const data = await apiResponse.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: true, message: `Gagal menghubungkan ke API baru: ${error.message}` });
  }
};
