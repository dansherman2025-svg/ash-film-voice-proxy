# Yandex SpeechKit Proxy для Vapi - Дэш Фильм

Прокси-сервер для подключения голоса Dasha (Yandex SpeechKit) в Vapi.ai

## Быстрый старт

### 1. Развёртывание на Vercel

1. Зайди на [vercel.com](https://vercel.com/new)
2. Нажми **"Add New Project"**
3. Выбери **"Import Git Repository"** → **"Create Git Repository"**
   - Или просто загрузи эту папку через drag-and-drop
4. Название проекта: `dash-film-voice-proxy`
5. Framework Preset: оставь **"Other"**
6. Нажми **"Deploy"**

### 2. Настройка Environment Variables

После деплоя:

1. Перейди в **Settings** → **Environment Variables**
2. Добавь переменную:
   - **Name:** `YANDEX_API_KEY`
   - **Value:** `твой_yandex_api_ключ` (который скопировал из Yandex Cloud)
3. Нажми **"Save"**
4. Перейди в **Deployments** → **Redeploy** (чтобы переменная применилась)

### 3. Получить URL endpoints

После деплоя у тебя будут доступны:

- **TTS (синтез речи):** `https://твой-проект.vercel.app/api/tts`
- **STT (распознавание):** `https://твой-проект.vercel.app/api/stt`

### 4. Подключить в Vapi

В Vapi Dashboard:

1. **Assistants** → твой ассистент → **Voice Settings**
2. Provider: **"Custom"**
3. TTS Endpoint: `https://твой-проект.vercel.app/api/tts`
4. STT Endpoint: `https://твой-проект.vercel.app/api/stt`
5. Voice ID: `dasha` (или `ermil`, `filipp` для других голосов)
6. **Save**

## Тестирование

### Тест TTS (синтез речи):

```bash
curl -X POST https://твой-проект.vercel.app/api/tts \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Здравствуйте! Меня зовут Анна, звоню из студии Дэш Фильм.",
    "voice": "dasha",
    "speed": 1.0,
    "emotion": "good"
  }' \
  --output test-voice.raw
```

Если всё ок — создастся файл `test-voice.raw` с голосом Dasha.

## Поддерживаемые голоса Yandex

- `dasha` — женский, профессиональный (рекомендуется)
- `alena` — женский, дружелюбный
- `jane` — женский, нейтральный
- `omazh` — женский, эмоциональный
- `filipp` — мужской, уверенный
- `ermil` — мужской, тёплый
- `anton` — мужской, энергичный

## Стоимость

- **Vercel:** бесплатно (лимит 100GB трафика/мес)
- **Yandex SpeechKit:** ~₽0.16/сек (при 4000 ₽ бонуса хватит на тысячи звонков)

## Troubleshooting

**Ошибка "Yandex API key not configured":**
→ Проверь что добавил `YANDEX_API_KEY` в Environment Variables и сделал Redeploy

**Ошибка 401 Unauthorized:**
→ Проверь что API-ключ Yandex правильный (начинается с `AQVN...`)

**Аудио не воспроизводится:**
→ Проверь формат: должен быть `audio/l16` с частотой 48000 Hz

## Поддержка

Создано для проекта **Дэш Фильм** — AI-агент для холодных звонков видеопродакшн студии.
