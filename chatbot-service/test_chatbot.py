#!/usr/bin/env python3
"""
Simple test script for the Alumni Connect Chatbot Service
"""

import requests
import json
import time
import sys

# Configuration
BASE_URL = "http://localhost:8000"
API_URL = f"{BASE_URL}/api"

def test_health():
    """Test the health endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{API_URL}/health", timeout=10)
        response.raise_for_status()
        data = response.json()
        print(f"✅ Health check passed: {data['status']}")
        print(f"   Cohere status: {data['cohere_status']}")
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_chat_completion():
    """Test chat completion endpoint"""
    print("\n💬 Testing chat completion...")
    
    test_messages = [
        {
            "message": "How should I prepare for technical interviews?",
            "context_type": "placement"
        },
        {
            "message": "What features does this platform have?",
            "context_type": "faq"
        },
        {
            "message": "How can I connect with alumni?",
            "context_type": "general"
        }
    ]
    
    for i, test_msg in enumerate(test_messages, 1):
        print(f"\n📝 Test {i}: {test_msg['context_type']} context")
        print(f"   Question: {test_msg['message']}")
        
        try:
            response = requests.post(
                f"{API_URL}/chat/complete",
                json=test_msg,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response.raise_for_status()
            data = response.json()
            
            print(f"✅ Response received:")
            print(f"   Message length: {len(data['message'])} characters")
            print(f"   Conversation ID: {data['conversation_id']}")
            print(f"   Confidence: {data.get('confidence_score', 'N/A')}")
            print(f"   Context used: {data.get('context_used', [])}")
            
            if data.get('suggested_actions'):
                print(f"   Suggestions: {len(data['suggested_actions'])} actions")
            
            # Print first 100 characters of response
            preview = data['message'][:100] + "..." if len(data['message']) > 100 else data['message']
            print(f"   Preview: {preview}")
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed: {e}")
        except Exception as e:
            print(f"❌ Test failed: {e}")
        
        # Small delay between requests
        time.sleep(1)

def test_conversation_history():
    """Test conversation history endpoints"""
    print("\n📚 Testing conversation history...")
    
    # First, create a conversation
    try:
        response = requests.post(
            f"{API_URL}/chat/complete",
            json={
                "message": "Hello, this is a test message",
                "conversation_id": "test_conv_123"
            },
            timeout=30
        )
        response.raise_for_status()
        
        # Try to get the conversation history
        response = requests.get(f"{API_URL}/chat/history/test_conv_123", timeout=10)
        response.raise_for_status()
        data = response.json()
        
        print(f"✅ History retrieved:")
        print(f"   Conversation ID: {data['conversation_id']}")
        print(f"   Messages count: {len(data['messages'])}")
        
    except Exception as e:
        print(f"❌ History test failed: {e}")

def test_contexts():
    """Test available contexts endpoint"""
    print("\n🎯 Testing contexts endpoint...")
    
    try:
        response = requests.get(f"{API_URL}/chat/contexts", timeout=10)
        response.raise_for_status()
        data = response.json()
        
        print(f"✅ Contexts retrieved:")
        for context in data['contexts']:
            print(f"   - {context['type']}: {context['description']}")
            
    except Exception as e:
        print(f"❌ Contexts test failed: {e}")

def test_rate_limiting():
    """Test rate limiting (optional)"""
    print("\n🚦 Testing rate limiting...")
    print("   Making 5 rapid requests...")
    
    success_count = 0
    rate_limited_count = 0
    
    for i in range(5):
        try:
            response = requests.post(
                f"{API_URL}/chat/complete",
                json={"message": f"Test message {i+1}"},
                timeout=10
            )
            if response.status_code == 200:
                success_count += 1
            elif response.status_code == 429:
                rate_limited_count += 1
                print(f"   Request {i+1}: Rate limited (429)")
            else:
                print(f"   Request {i+1}: Status {response.status_code}")
                
        except Exception as e:
            print(f"   Request {i+1}: Error - {e}")
    
    print(f"✅ Rate limiting test complete:")
    print(f"   Successful requests: {success_count}")
    print(f"   Rate limited requests: {rate_limited_count}")

def main():
    """Run all tests"""
    print("🚀 Alumni Connect Chatbot Service Test Suite")
    print("=" * 50)
    
    # Check if service is running
    try:
        response = requests.get(BASE_URL, timeout=5)
        if response.status_code != 200:
            print(f"❌ Service not responding correctly at {BASE_URL}")
            sys.exit(1)
    except Exception as e:
        print(f"❌ Cannot connect to service at {BASE_URL}")
        print(f"   Make sure the service is running: python3 main.py")
        sys.exit(1)
    
    print(f"✅ Service is running at {BASE_URL}")
    
    # Run tests
    tests = [
        test_health,
        test_contexts,
        test_chat_completion,
        test_conversation_history,
        test_rate_limiting
    ]
    
    for test_func in tests:
        try:
            test_func()
        except KeyboardInterrupt:
            print("\n🛑 Tests interrupted by user")
            break
        except Exception as e:
            print(f"❌ Unexpected error in {test_func.__name__}: {e}")
    
    print("\n" + "=" * 50)
    print("🏁 Test suite completed!")
    print("\n💡 Tips:")
    print("   - Ensure COHERE_API_KEY is set for full functionality")
    print("   - Check logs if any tests failed")
    print("   - API documentation: http://localhost:8000/docs")

if __name__ == "__main__":
    main()