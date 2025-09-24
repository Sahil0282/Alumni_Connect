"use client"

import React, { useState, useEffect, useRef } from 'react';

// --- Helper Components ---

// Icon for the chatbot avatar
const BotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
    </svg>
);

// Icon for the user avatar
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

// Icon for the send button
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

// Icon for attachments
const AttachmentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
    </svg>
);

// --- Main Chat Component ---

const ChatMessage = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
        <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
                    <BotIcon />
                </div>
            )}
            <div className={`px-4 py-3 rounded-xl max-w-md ${isUser ? 'bg-teal-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                <p className="text-sm">{message.text}</p>
                {message.attachment && (
                    <div className="mt-2 text-xs text-gray-500 bg-gray-200 rounded p-2">
                        Attached: {message.attachment.name}
                    </div>
                )}
            </div>
             {isUser && (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <UserIcon />
                </div>
            )}
        </div>
    );
};

export default function Chatbot() {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm the AlumniConnect assistant. How can I help you find alumni, events, or answer your questions today?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);
    
    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setAttachment(e.target.files[0]);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (inputValue.trim() === '' && !attachment) return;

        const newUserMessage = {
            id: messages.length + 1,
            text: inputValue,
            sender: 'user',
            attachment: attachment
        };
        setMessages(prev => [...prev, newUserMessage]);
        const currentMessage = inputValue;
        setInputValue('');
        setAttachment(null);
        setIsTyping(true);

        try {
            // Call the FastAPI chatbot service
            const response = await fetch('http://localhost:8000/api/chat/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: currentMessage,
                    conversation_id: `conv_${Date.now()}`, // Simple conversation ID
                    context_type: 'general', // Can be made dynamic based on page/user selection
                    user_id: 'user_demo' // Can be replaced with actual user ID
                })
            });

            if (response.ok) {
                const data = await response.json();
                const botResponse = {
                    id: messages.length + 2,
                    text: data.message,
                    sender: 'bot',
                    metadata: {
                        confidence: data.confidence_score,
                        suggestions: data.suggested_actions
                    }
                };
                setIsTyping(false);
                setMessages(prev => [...prev, botResponse]);
            } else {
                throw new Error('Failed to get response from chatbot service');
            }
        } catch (error) {
            console.error('Error calling chatbot API:', error);
            const errorResponse = {
                id: messages.length + 2,
                text: "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again in a moment. In the meantime, feel free to browse our alumni directory or check out upcoming events!",
                sender: 'bot',
            };
            setIsTyping(false);
            setMessages(prev => [...prev, errorResponse]);
        }
    };

    return (
        <div className="w-full h-full flex flex-col bg-white rounded-2xl shadow-lg border border-gray-200 mt-4">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-6 min-h-[80px] border-b border-gray-200 bg-white rounded-t-2xl">
                <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center">
                        <BotIcon />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-800">AlumniConnect Assistant</h1>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <p className="text-sm text-gray-500">Online</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto">
                {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                {isTyping && (
                     <div className="flex items-start gap-3 my-4 justify-start">
                        <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
                            <BotIcon />
                        </div>
                        <div className="px-4 py-3 rounded-xl bg-gray-100 text-gray-800 rounded-bl-none">
                            <div className="flex items-center justify-center gap-1.5">
                                <span className="h-2 w-2 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-teal-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="px-6 py-6 bg-white border-t border-gray-200 rounded-b-2xl">
                {attachment && (
                    <div className="px-3 py-2 mb-2 text-sm bg-gray-100 rounded-lg flex justify-between items-center">
                        <span>{attachment.name}</span>
                        <button onClick={() => setAttachment(null)} className="text-red-500 hover:text-red-700">&times;</button>
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="p-3 bg-gray-100 text-white rounded-xl flex items-center justify-center hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                    >
                        <AttachmentIcon />
                    </button>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask about alumni, mentorship, or events..."
                        className="flex-1 w-full px-4 py-3 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                    />
                    <button
                        type="submit"
                        className="w-12 h-12 bg-teal-500 text-white rounded-xl flex items-center justify-center hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 disabled:bg-teal-300"
                        disabled={!inputValue.trim() && !attachment}
                    >
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
}
