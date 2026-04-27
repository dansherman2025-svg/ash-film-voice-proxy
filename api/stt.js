// Vercel Serverless Function - Yandex SpeechKit STT Proxy для Vapi
// Принимает аудио от Vapi, распознаёт через Yandex, возвращает текст

export default async function handler(req, res) {
  // Только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const YANDEX_API_KEY = process.env.YANDEX_API_KEY;
    
    if (!YANDEX_API_KEY) {
      return res.status(500).json({ error: 'Yandex API key not configured' });
    }

    // Получаем аудио из запроса
    const audioBuffer = await req.arrayBuffer();
    
    if (!audioBuffer || audioBuffer.byteLength === 0) {
      return res.status(400).json({ error: 'Audio data required' });
    }

    // Запрос к Yandex STT API
    const response = await fetch(
      'https://stt.api.cloud.yandex.net/speech/v1/stt:recognize?lang=ru-RU&format=lpcm&sampleRateHertz=48000',
      {
        method: 'POST',
        headers: {
          'Authorization': `Api-Key ${YANDEX_API_KEY}`,
          'Content-Type': 'audio/x-pcm;bit=16;rate=48000'
        },
        body: audioBuffer
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Yandex STT error:', errorText);
      return res.status(response.status).json({ 
        error: 'Yandex STT API error',
        details: errorText 
      });
    }

    const result = await response.json();
    
    // Возвращаем распознанный текст в формате Vapi
    res.status(200).json({
      text: result.result || '',
      confidence: 1.0
    });

  } catch (error) {
    console.error('STT Proxy Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
