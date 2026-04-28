# AI Writing Assistant

React + Flask app that rewrites text in different tones using the Google Gemini API.

## Security

- Never put API keys in React files, `src/`, `public/`, or `vite.config.js`.
- Keep secrets in `backend/.env` for local development.
- In production, store secrets in your backend hosting platform environment variables.
- `backend/.env` is ignored by Git. Use `backend/.env.example` as the template.

## Local Setup

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
FLASK_DEBUG=true
PORT=5000
```

Run the backend:

```bash
python app.py
```

Test it:

```text
http://127.0.0.1:5000/api/health
```

### 2. Frontend

Open a second terminal in the project root:

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173/
```

## Gemini API Key

Create a Gemini API key in Google AI Studio, then place it only in `backend/.env` as `GEMINI_API_KEY`.

Do not add the key to React environment variables. React code is visible in the browser.

## Deployment Notes

- Deploy the Flask backend and React frontend separately, or serve them behind the same domain.
- Set `GEMINI_API_KEY` in your backend host environment variables.
- Set `ALLOWED_ORIGINS` to your live frontend URL.
- Do not commit `.env`.
