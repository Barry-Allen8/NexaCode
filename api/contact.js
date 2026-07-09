export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { Name, Email, Phone, Industry, Message } = req.body || {};

  // Simple validation
  if (!Name || !Email || !Phone || !Industry || !Message) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY environment variable is not defined');
    return res.status(500).json({ success: false, message: 'Server configuration error' });
  }

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'NexaCode Contact Form <onboarding@resend.dev>',
        to: 'joi777@ukr.net',
        subject: `NexaCode: Nowa wiadomość od ${Name}`,
        html: `
          <h2>Nowe zapytanie z formularza kontaktowego NexaCode</h2>
          <p><strong>Imię i nazwisko:</strong> ${Name}</p>
          <p><strong>E-mail:</strong> ${Email}</p>
          <p><strong>Telefon:</strong> ${Phone}</p>
          <p><strong>Branża:</strong> ${Industry}</p>
          <p><strong>Wiadomość:</strong></p>
          <p style="white-space: pre-wrap; background-color: #f4f4f5; padding: 12px; border-radius: 6px;">${Message}</p>
        `
      })
    });

    const data = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend API error:', data);
      return res.status(resendResponse.status).json({ success: false, message: data.message || 'Failed to send email' });
    }

    return res.status(200).json({ success: true, message: 'Email sent successfully', id: data.id });
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
