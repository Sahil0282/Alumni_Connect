#!/bin/bash

# Start script for Alumni Connect Chatbot Service

echo "🚀 Starting Alumni Connect Chatbot Service..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "📝 Please update .env file with your actual Cohere API key"
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

# Start the FastAPI application
echo "🚀 Starting server on http://localhost:8000"
echo "📚 API documentation available at http://localhost:8000/docs"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload