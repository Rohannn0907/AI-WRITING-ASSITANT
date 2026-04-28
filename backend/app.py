import os
import time

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from google import genai

load_dotenv()

app = Flask(__name__)

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
CORS(app, resources={r"/api/*": {"origins": [origin.strip() for origin in allowed_origins.split(",")]}})

request_count = {}
MAX_REQUESTS_PER_MINUTE = int(os.getenv("MAX_REQUESTS_PER_MINUTE", "10"))
MAX_INPUT_LENGTH = int(os.getenv("MAX_INPUT_LENGTH", "5000"))
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")


def check_rate_limit(ip):
    """Simple in-memory rate limiting by IP."""
    current_minute = int(time.time() / 60)

    if ip not in request_count:
        request_count[ip] = {}

    if current_minute not in request_count[ip]:
        request_count[ip] = {current_minute: 0}

    if request_count[ip][current_minute] >= MAX_REQUESTS_PER_MINUTE:
        return False

    request_count[ip][current_minute] += 1
    return True


def build_prompt(mode, user_text):
    prompts = {
        "professional": "Rewrite this text in a professional, formal business tone. Make it clear, concise, and suitable for workplace communication:",
        "casual": "Rewrite this text in a friendly, casual, conversational tone. Make it warm and approachable:",
        "creative": "Rewrite this text in a creative, engaging, and vivid style. Make it more interesting and captivating:",
        "concise": "Rewrite this text to be more concise and direct. Remove unnecessary words while keeping the core message:",
    }

    prompt = prompts.get(mode, prompts["professional"])
    return f"{prompt}\n\n{user_text}"


def improve_with_gemini(prompt):
    api_key = os.getenv("GEMINI_API_KEY", "").strip()

    if not api_key or api_key == "your_gemini_api_key_here":
        raise RuntimeError("GEMINI_API_KEY is not configured.")

    client = genai.Client()
    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )
    return response.text.strip() if response.text else ""


@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "message": "Backend is running. Open the React app at http://localhost:5173/",
        "health": "/api/health",
    })


@app.route("/api/improve-text", methods=["POST"])
def improve_text():
    user_ip = request.remote_addr or "unknown"

    if not check_rate_limit(user_ip):
        return jsonify({"error": "Rate limit exceeded. Please wait a minute."}), 429

    data = request.get_json(silent=True) or {}
    user_text = data.get("text", "").strip()
    mode = data.get("mode", "professional")

    if not user_text or len(user_text) < 10:
        return jsonify({"error": "Text is too short. Please enter at least 10 characters."}), 400

    if len(user_text) > MAX_INPUT_LENGTH:
        return jsonify({"error": f"Text is too long. Maximum {MAX_INPUT_LENGTH} characters."}), 400

    prompt = build_prompt(mode, user_text)

    try:
        improved_text = improve_with_gemini(prompt)

        if not improved_text:
            return jsonify({"error": "Gemini returned an empty response."}), 502

        return jsonify({
            "success": True,
            "provider": "google-gemini",
            "model": GEMINI_MODEL,
            "improved_text": improved_text,
            "original_length": len(user_text),
            "improved_length": len(improved_text),
        })
    except RuntimeError as exc:
        print(f"Configuration error: {exc}")
        return jsonify({"error": str(exc)}), 500
    except Exception as exc:
        print(f"Gemini API error: {exc}")
        return jsonify({"error": "Failed to process text with Gemini. Please try again."}), 500


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "message": "Backend is running!",
        "provider": "google-gemini",
        "model": GEMINI_MODEL,
    })


if __name__ == "__main__":
    debug = os.getenv("FLASK_DEBUG", "true").lower() == "true"
    app.run(debug=debug, port=int(os.getenv("PORT", "5000")))
