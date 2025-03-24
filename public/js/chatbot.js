// js/chatbot.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || 
                      document.cookie.includes('isLoggedIn=true');
    
    if (!isLoggedIn) {
        console.log("User not logged in, redirecting to login page");
        window.location.href = '../login.html';
    } else {
        console.log("User is logged in, initializing chatbot");
        initChatbot();
    }
});

function initChatbot() {
    // Show the main content
    document.body.style.visibility = 'visible';
    
    // Display username if available
    const username = localStorage.getItem('username') || 'User';
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        usernameDisplay.textContent = `Welcome, ${username}!`;
    }
    
    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        // Clear cookies too
        document.cookie = "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '../login.html';
    });
    
    // Chat functionality
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Focus on input field
    userInput.focus();
}

// Send message function
function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (message) {
        // Add user message to chat
        addMessageToChat(message, 'user');
        userInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Process the message and get a response
        processMessage(message)
            .then(response => {
                // Hide typing indicator
                hideTypingIndicator();
                // Add bot response to chat
                addMessageToChat(response, 'bot');
            })
            .catch(error => {
                console.error('Error processing message:', error);
                hideTypingIndicator();
                addMessageToChat("I'm sorry, I encountered an error processing your request. Please try again.", 'bot');
            });
    }
}

// Show typing indicator
function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    
    typingDiv.appendChild(contentDiv);
    chatMessages.appendChild(typingDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Add message to chat
function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Check if the message contains code blocks
    if (message.includes('```')) {
        // Process markdown-style code blocks
        let parts = message.split('```');
        let html = '';
        
        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
                // Regular text - process for line breaks
                html += parts[i].replace(/\n/g, '<br>');
            } else {
                // Code block
                html += `<pre><code>${parts[i]}</code></pre>`;
            }
        }
        
        contentDiv.innerHTML = html;
    } else {
        // Regular text with line breaks
        contentDiv.innerHTML = message.replace(/\n/g, '<br>');
    }
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Process message and get response
async function processMessage(message) {
    try {
        // Show typing indicator while waiting for API response
        showTypingIndicator();
        
        // Create message history with user's message
        const messageHistory = [
            { role: 'user', content: message }
        ];
        
        // Call the API
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: messageHistory })
        });
        
        // Check if the response is ok
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API error:', errorData);
            throw new Error(errorData.error || 'Error communicating with the API');
        }
        
        // Parse the response
        const data = await response.json();
        
        // Return the assistant's message content
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            return data.choices[0].message.content;
        } else {
            // Fallback to rule-based responses if API response format is unexpected
            return fallbackResponse(message);
        }
    } catch (error) {
        console.error('Error processing message:', error);
        
        // If there's an API error, fall back to rule-based responses
        return fallbackResponse(message);
    }
}

// Fallback response function for when the API fails
function fallbackResponse(message) {
    // Convert message to lowercase for easier matching
    const lowerMessage = message.toLowerCase();
    
    // Check for greetings
    if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
        return "Hello! I'm your academic assistant. How can I help you today?";
    }
    
    // Check for thanks
    if (lowerMessage.match(/(thank|thanks|thank you)/)) {
        return "You're welcome! Feel free to ask if you have any other questions.";
    }
    
    // Check for goodbye
    if (lowerMessage.match(/(bye|goodbye|see you|farewell)/)) {
        return "Goodbye! Feel free to return whenever you have more questions.";
    }
    
    // Check for questions about the assistant
    if (lowerMessage.match(/(who are you|what are you|about you|your purpose)/)) {
        return "I'm an Academic Assistant, designed to help with educational questions across various disciplines. I can provide information, explanations, and resources to support your learning journey.";
    }
    
    // Default response
    return "I'm currently experiencing some technical difficulties connecting to my knowledge base. Please try asking a different question or try again later.";
}

// Add CSS for typing indicator
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .typing-indicator .message-content {
            padding: 8px 16px;
        }
        
        .typing-indicator .dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: var(--text-secondary);
            margin-right: 4px;
            animation: typing-animation 1.4s infinite;
        }
        
        .typing-indicator .dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-indicator .dot:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes typing-animation {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
        }
        
        pre {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            overflow-x: auto;
            margin: 10px 0;
        }
        
        code {
            font-family: monospace;
            font-size: 14px;
        }
    `;
    document.head.appendChild(style);
});
