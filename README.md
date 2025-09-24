# Alumni Connect Platform

A comprehensive platform connecting students with alumni for mentorship, career guidance, and networking opportunities.

## 🌟 Features

### For Students
- **Alumni Directory**: Browse and connect with alumni by company, role, and expertise
- **Mentorship Program**: Request guidance from experienced professionals
- **Q&A Forum**: Ask questions and get answers from the community
- **AI Chatbot**: Get instant help with placement preparation and platform navigation
- **Job Board**: Discover opportunities shared by alumni
- **Events**: Join networking events and workshops

### For Alumni
- **Mentoring Dashboard**: Manage mentorship requests and conversations
- **Knowledge Sharing**: Contribute to forums and help students
- **Event Hosting**: Organize workshops and networking sessions
- **Job Posting**: Share opportunities from your company

### For Administrators
- **User Management**: Oversee student and alumni accounts
- **Content Moderation**: Monitor forum discussions and posts
- **Analytics Dashboard**: Track platform engagement and success metrics
- **Event Management**: Coordinate platform-wide events

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ (for AI chatbot)
- Cohere API key (for chatbot functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Alumni_Connect
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the AI chatbot** (optional but recommended)
   ```bash
   cd ../chatbot-service
   pip install -r requirements.txt
   cp .env.example .env
   # Add your Cohere API key to .env
   ```

### Running the Application

1. **Start the backend services**
   ```bash
   # Terminal 1: Express backend
   cd backend
   npm run dev

   # Terminal 2: AI chatbot service (optional)
   cd chatbot-service
   ./start.sh
   ```

2. **Start the frontend**
   ```bash
   # Terminal 3: Next.js frontend
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - Chatbot API: http://localhost:8000
   - Chatbot Docs: http://localhost:8000/docs

## 🤖 AI Chatbot Feature

The platform includes an advanced AI chatbot powered by Cohere LLM that provides:

- **Placement Preparation**: Technical interview guidance, resume tips, career advice
- **Platform Navigation**: Help with using platform features
- **FAQ Responses**: Quick answers to common questions
- **Contextual Assistance**: Adapts responses based on user context

### Chatbot Setup

1. Get a Cohere API key from [cohere.ai](https://cohere.ai)
2. Configure the chatbot service:
   ```bash
   cd chatbot-service
   cp .env.example .env
   # Add: COHERE_API_KEY=your_actual_api_key
   ```
3. Start the service:
   ```bash
   python3 main.py
   ```

See [CHATBOT_DEPLOYMENT.md](CHATBOT_DEPLOYMENT.md) for detailed setup instructions.

## 📁 Project Structure

```
Alumni_Connect/
├── app/                    # Next.js pages and routes
│   ├── student/           # Student-specific pages
│   ├── alumni/            # Alumni-specific pages
│   └── admin/             # Admin dashboard pages
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── chatbot/          # AI chatbot components
├── backend/              # Express.js backend
│   ├── src/              # Backend source code
│   └── README.md         # Backend documentation
├── chatbot-service/      # FastAPI AI chatbot service
│   ├── app/              # FastAPI application
│   ├── README.md         # Chatbot documentation
│   └── Dockerfile        # Container configuration
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
└── styles/               # Global styles
```

## 🔧 Development

### Tech Stack

**Frontend:**
- Next.js 14 (React framework)
- TypeScript/JavaScript
- Tailwind CSS (styling)
- Radix UI (component library)

**Backend:**
- Express.js (API server)
- MongoDB with Mongoose (database)
- JWT (authentication)

**AI Chatbot:**
- FastAPI (Python web framework)
- Cohere LLM (language model)
- Pydantic (data validation)

### Key Features Implementation

1. **Authentication System**: JWT-based auth with role-based access control
2. **Real-time Messaging**: WebSocket integration for chat functionality
3. **Search & Filtering**: Advanced search across alumni profiles and content
4. **Responsive Design**: Mobile-first responsive design
5. **AI Integration**: Context-aware chatbot for user assistance

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐳 Docker Deployment

```bash
# Frontend (Next.js)
docker build -t alumni-frontend .

# Chatbot Service
cd chatbot-service
docker build -t alumni-chatbot .
docker run -p 8000:8000 --env-file .env alumni-chatbot
```

## 📊 Platform Analytics

The platform tracks key metrics:
- User engagement and retention
- Mentorship success rates
- Forum participation
- Job placement outcomes
- Event attendance

## 🛡️ Security Features

- JWT authentication with secure token handling
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📱 Mobile Responsive

The platform is fully responsive and optimized for:
- Desktop browsers
- Tablets
- Mobile devices
- Progressive Web App capabilities

## 🔄 Future Enhancements

- [ ] Mobile app development (React Native)
- [ ] Advanced analytics dashboard
- [ ] Video call integration for mentorship
- [ ] AI-powered job matching
- [ ] Social media integration
- [ ] Multi-language support

## 📞 Support

For technical support or questions about the platform:

1. Check the documentation in respective service directories
2. Review the chatbot deployment guide: [CHATBOT_DEPLOYMENT.md](CHATBOT_DEPLOYMENT.md)
3. Open an issue in the repository for bug reports
4. Contact the development team for feature requests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ for connecting students and alumni in meaningful ways.