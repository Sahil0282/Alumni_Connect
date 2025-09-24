# Alumni Connect Chatbot Service

AI-powered chatbot service using Cohere LLM for student portal assistance, placement preparation, and FAQ handling.

## Features

- 🤖 **Cohere LLM Integration** - Advanced AI responses with context awareness
- 🎯 **Placement Preparation** - Specialized guidance for technical interviews, resume building, and career advice
- ❓ **FAQ Handling** - Quick answers to common platform questions
- 💬 **Conversation History** - Maintains context across chat sessions
- 🔒 **Rate Limiting** - Prevents abuse with configurable rate limits
- 🛡️ **Error Handling** - Comprehensive error handling and logging
- 📊 **Context Management** - Dynamic context switching for better responses

## Quick Start

### Prerequisites

- Python 3.8+
- Cohere API Key (sign up at [cohere.ai](https://cohere.ai))

### Installation

1. **Clone and navigate to the chatbot service:**
   ```bash
   cd chatbot-service
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your Cohere API key
   ```

4. **Start the service:**
   ```bash
   ./start.sh
   # OR
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

### Using Docker (Optional)

```bash
# Build Docker image
docker build -t alumni-chatbot .

# Run container
docker run -p 8000:8000 --env-file .env alumni-chatbot
```

## API Endpoints

### Health Check
- **GET** `/api/health` - Service health status

### Chat Completion
- **POST** `/api/chat/complete` - Generate AI responses
  ```json
  {
    "message": "How should I prepare for system design interviews?",
    "conversation_id": "optional-conv-id",
    "context_type": "placement",
    "user_id": "optional-user-id"
  }
  ```

### Conversation History
- **GET** `/api/chat/history/{conversation_id}` - Get chat history
- **DELETE** `/api/chat/history/{conversation_id}` - Delete conversation

### Context Management
- **POST** `/api/chat/context` - Set conversation context
- **GET** `/api/chat/contexts` - List available contexts

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `COHERE_API_KEY` | - | **Required**: Your Cohere API key |
| `HOST` | `0.0.0.0` | Server host |
| `PORT` | `8000` | Server port |
| `DEBUG` | `True` | Debug mode |
| `RATE_LIMIT_REQUESTS` | `30` | Requests per minute |
| `RATE_LIMIT_WINDOW` | `60` | Rate limit window (seconds) |
| `ALLOWED_ORIGINS` | `["http://localhost:3000"]` | CORS allowed origins |

### Context Types

1. **`general`** - General alumni platform assistance
2. **`placement`** - Placement preparation and career guidance
3. **`faq`** - Platform-specific frequently asked questions

## Integration with Frontend

The chatbot service is designed to work with the existing Next.js frontend. Update your frontend's chatbot component to call the FastAPI endpoints:

```javascript
// Example API call
const response = await fetch('http://localhost:8000/api/chat/complete', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: userMessage,
    conversation_id: conversationId,
    context_type: 'placement'
  })
});

const data = await response.json();
```

## Development

### Project Structure

```
chatbot-service/
├── app/
│   ├── core/           # Configuration and core utilities
│   ├── middleware/     # FastAPI middleware
│   ├── models/         # Pydantic data models
│   ├── routers/        # API route handlers
│   ├── services/       # External service integrations
│   └── utils/          # Utility functions
├── main.py             # FastAPI application entry point
├── requirements.txt    # Python dependencies
├── .env.example        # Environment configuration template
└── start.sh           # Startup script
```

### Adding New Features

1. **New Context Types**: Add to `CohereService.context_templates`
2. **New Endpoints**: Create new routers in `app/routers/`
3. **New Services**: Add external integrations in `app/services/`

### Testing

```bash
# Run the service locally
uvicorn main:app --reload

# Test health endpoint
curl http://localhost:8000/api/health

# Test chat completion
curl -X POST http://localhost:8000/api/chat/complete \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how can you help me with placements?"}'
```

## Production Deployment

### Security Considerations

1. **API Key Protection**: Never commit real API keys to version control
2. **Rate Limiting**: Configure appropriate rate limits for production
3. **CORS**: Restrict allowed origins to your production domains
4. **HTTPS**: Always use HTTPS in production
5. **Input Validation**: All inputs are validated using Pydantic models

### Scaling

- Use Redis for conversation storage in production
- Implement database persistence for chat history
- Add monitoring and logging
- Consider using container orchestration (Kubernetes, Docker Swarm)

## Troubleshooting

### Common Issues

1. **Cohere API Key Error**: Ensure your API key is valid and has sufficient credits
2. **Rate Limit Exceeded**: Adjust rate limiting settings or implement user authentication
3. **CORS Issues**: Add your frontend domain to `ALLOWED_ORIGINS`

### Logs

The service logs important events and errors. In production, configure proper log aggregation.

## Contributing

1. Follow the existing code structure
2. Add type hints for all functions
3. Update documentation for new features
4. Test thoroughly before submitting PRs

## License

This project is part of the Alumni Connect platform.