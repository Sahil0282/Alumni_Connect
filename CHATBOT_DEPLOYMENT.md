# AI Chatbot Deployment Guide

This guide explains how to deploy and configure the AI chatbot feature for Alumni Connect.

## Overview

The AI chatbot is implemented as a separate FastAPI service that integrates with Cohere LLM. It provides context-aware assistance for:

- **Placement Preparation**: Technical interview guidance, resume tips, career advice
- **FAQ Handling**: Platform-specific questions and navigation help
- **General Assistance**: Alumni networking, events, and community support

## Architecture

```
Frontend (Next.js) ──HTTP──> FastAPI Chatbot Service ──API──> Cohere LLM
                                      │
                                      ▼
                              Conversation Storage
                              (In-memory / Redis)
```

## Quick Setup

### Prerequisites

1. **Cohere API Key**: Sign up at [cohere.ai](https://cohere.ai) and get your API key
2. **Python 3.8+**: Required for the FastAPI service
3. **Node.js**: For the frontend (already configured)

### 1. Configure the Chatbot Service

```bash
# Navigate to chatbot service
cd chatbot-service

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your Cohere API key:
# COHERE_API_KEY=your_actual_cohere_api_key_here
```

### 2. Start the Services

```bash
# Terminal 1: Start the chatbot service
cd chatbot-service
./start.sh
# OR
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2: Start the frontend (in project root)
npm run dev
```

### 3. Test the Integration

1. Open the frontend at `http://localhost:3000`
2. Navigate to the chatbot page (`/student/chatbot` or `/admin/chatbot`)
3. Send a test message like "How should I prepare for technical interviews?"
4. Verify the AI responds with placement-specific guidance

## Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `COHERE_API_KEY` | - | **Required**: Your Cohere API key |
| `PORT` | `8000` | Chatbot service port |
| `RATE_LIMIT_REQUESTS` | `30` | Max requests per minute per IP |
| `DEBUG` | `True` | Enable debug mode and docs |
| `ALLOWED_ORIGINS` | `["http://localhost:3000"]` | Frontend CORS origins |

### Context Types

The chatbot adapts its responses based on context:

- **`general`**: Default mode for platform navigation and alumni networking
- **`placement`**: Specialized for interview prep, resume tips, career guidance
- **`faq`**: Quick answers to common platform questions

## API Integration

The frontend automatically calls the chatbot API. The key endpoint is:

```javascript
POST http://localhost:8000/api/chat/complete
{
  "message": "User's question",
  "context_type": "placement", // or "general", "faq"
  "conversation_id": "optional-id-for-history",
  "user_id": "optional-user-identifier"
}
```

Response:
```javascript
{
  "message": "AI response",
  "conversation_id": "unique-conversation-id",
  "confidence_score": 0.85,
  "suggested_actions": ["Action 1", "Action 2"],
  "context_used": ["placement"]
}
```

## Production Deployment

### Docker Deployment

```bash
# Build and run with Docker
cd chatbot-service
docker build -t alumni-chatbot .
docker run -p 8000:8000 --env-file .env alumni-chatbot
```

### Environment Setup

1. **API Key Security**: Store Cohere API key in secure environment variables
2. **Rate Limiting**: Configure appropriate limits for production traffic
3. **CORS**: Update `ALLOWED_ORIGINS` with your production domains
4. **Logging**: Configure proper log aggregation for monitoring

### Scaling Considerations

- **Redis Integration**: Replace in-memory storage with Redis for multiple instances
- **Database Persistence**: Add database for long-term conversation history
- **Load Balancing**: Use nginx or similar for load balancing multiple instances
- **Monitoring**: Add health checks and performance monitoring

## Customization

### Adding New Context Types

1. Edit `app/services/cohere_service.py`
2. Add new context template in `context_templates`
3. Update context list in `app/routers/chat.py`

### Modifying AI Behavior

The AI's behavior is controlled by context templates. Edit the prompts in `CohereService.context_templates` to adjust:
- Response style and tone
- Expertise areas
- Specific knowledge focus
- Response format

### Frontend Customization

The chatbot component can be customized:
- Context type selection (placement vs general)
- User interface styling
- Message display format
- Integration with user authentication

## Troubleshooting

### Common Issues

1. **Cohere API Errors**
   - Verify API key is correct and has credits
   - Check network connectivity to api.cohere.ai
   - Review rate limiting on Cohere side

2. **CORS Issues**
   - Add your frontend domain to `ALLOWED_ORIGINS`
   - Ensure both services are running on expected ports

3. **Rate Limiting**
   - Adjust `RATE_LIMIT_REQUESTS` if needed
   - Implement user authentication for higher limits

4. **Performance Issues**
   - Monitor Cohere API response times
   - Consider caching common responses
   - Implement conversation history cleanup

### Debug Mode

Enable debug mode for detailed error information:
```bash
export DEBUG=True
```

This enables:
- Detailed error responses
- API documentation at `/docs`
- Request/response logging

## Monitoring

### Health Checks

- Service health: `GET /api/health`
- Cohere integration status included in health response
- Use for load balancer health checks

### Key Metrics to Monitor

- Response time to user queries
- Cohere API success rate
- Rate limiting trigger frequency
- Conversation completion rates
- User satisfaction (can be added via feedback)

## Support and Maintenance

### Regular Maintenance

1. **API Key Rotation**: Update Cohere API keys periodically
2. **Dependency Updates**: Keep Python packages updated
3. **Log Review**: Monitor for errors and performance issues
4. **Conversation Cleanup**: Clear old conversation history periodically

### Getting Help

- Check the chatbot service logs for detailed error information
- Review API documentation at `http://localhost:8000/docs`
- Test individual API endpoints with curl or Postman
- Monitor Cohere API usage and limits in their dashboard

This implementation provides a solid foundation for an AI-powered chatbot that can be easily extended and customized for specific needs.