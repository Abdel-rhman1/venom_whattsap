const venom = require('venom-bot');
const express = require('express');
const app = express();
app.use(express.json());

venom
  .create(
    'whatsapp-session',
    undefined,
    undefined,
    {
      headless: true,
      useChrome: true,
      executablePath: '/usr/bin/google-chrome-stable',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  )
  .then((client) => {
    app.post('/send', async (req, res) => {
      const { number, message } = req.body;

      if (!number || !message) {
        return res.status(400).json({ error: 'number and message are required' });
      }

      try {
        const result = await client.sendText(`2${number}@c.us`, message);

        // رجع فقط القيم المفيدة لتجنب الدورة
        res.json({
          status: 'success',
          id: result.id,
          ack: result.ack,
          body: result.body
        });
      } catch (e) {
        res.status(500).json({ error: e.message || e });
      }
    });

    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  })
  .catch((error) => {
    console.error('Venom init error:', error);
  });
