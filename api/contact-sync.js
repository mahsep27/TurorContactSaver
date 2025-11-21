// api/contact-sync.js
// This is a Vercel serverless function that acts as a proxy

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxeySmK9tS9paPZgZ9e_gdydRErY-Ieu3AvsVJFDzM659hoD0VKj9AauUjzFDKYujF6pA/exec";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const { name, id, phoneNumber } = req.body;

    // Validate input
    if (!name || !id || !phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, id, or phoneNumber'
      });
    }

    console.log('Forwarding to Google Apps Script:', { name, id, phoneNumber });

    // Forward request to Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, id, phoneNumber }),
      redirect: 'follow'  // Follow redirects automatically
    });

    const data = await response.json();

    console.log('Response from Google Apps Script:', data);

    // Return the response from Google Apps Script
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}






