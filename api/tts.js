// Vercel Serverless Function - Yandex SpeechKit TTS Proxy для Vapi
// Принимает запросы от Vapi, проксирует в Yandex SpeechKit, возвращает аудио

export default async function handler(req, res) {
  // Только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, voice = 'dasha', speed = 1.0, emotion = 'good' } = req.body;
    
    // Yandex API ключ из environment variables
    const YANDEX_API_KEY = process.env.YANDEX_API_KEY;
    
    if (!YANDEX_API_KEY) {
      return res.status(500).json({ error: 'Yandex API key not configured' });
    }

    if (!text) {
      return res.status(400).json({ error: 'Text parameter required' });
    }

    // Формируем запрос к Yandex SpeechKit
    const params = new URLSearchParams({
      text: text,
      lang: 'ru-RU',
      voice: voice,
      speed: speed.toString(),
      emotion: emotion,
      format: 'lpcm',
      sampleRateHertz: '48000'
    });

    // Запрос к Yandex TTS API
    const response = await fetch(
      'https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize',
      {
        method: 'POST',
        headers: {
          'Authorization': `Api-Key ${YANDEX_API_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Yandex TTS error:', errorText);
      return res.status(response.status).json({ 
        error: 'Yandex TTS API error',
        details: errorText 
      });
    }

    // Получаем аудио данные
    const audioBuffer = await response.arrayBuffer();
    
    // Возвращаем аудио в формате который ожидает Vapi
    res.setHeader('Content-Type', 'audio/l16');
    res.setHeader('Content-Length', audioBuffer.byteLength);
    res.status(200).send(Buffer.from(audioBuffer));

  } catch (error) {
    console.error('TTS Proxy Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
