// server.js - A simple Express server for the Academic Assistant Chatbot
const express = require('express');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const cors = require('cors');
const apiRoutes = require('./routes/api');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Use the build directory as the base directory
const baseDir = path.join(__dirname, 'build');
console.log(`Base directory: ${baseDir}`);

// Create necessary files and directories
function ensureFilesExist() {
    try {
        // Create directories
        const dirs = [
            baseDir,
            path.join(baseDir, 'public'),
            path.join(baseDir, 'public/css'),
            path.join(baseDir, 'public/js'),
            path.join(baseDir, 'css'),
            path.join(baseDir, 'js')
        ];
        
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`Created directory: ${dir}`);
            }
        });
        
        // Create index.html
        const indexPath = path.join(baseDir, 'index.html');
        if (!fs.existsSync(indexPath)) {
            const indexContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Academic Assistant Chatbot</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script>
        // Check authentication on page load
        document.addEventListener('DOMContentLoaded', function() {
            // Check if user is logged in
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || 
                              document.cookie.includes('isLoggedIn=true');
            
            if (!isLoggedIn) {
                console.log("User not logged in, redirecting to login page");
                window.location.href = 'login.html';
            } else {
                console.log("User is logged in, showing content");
                // Show the main content
                document.body.style.visibility = 'visible';
                
                // Display username if available
                const username = localStorage.getItem('username') || 'User';
                const usernameDisplay = document.getElementById('username-display');
                if (usernameDisplay) {
                    usernameDisplay.textContent = \`Welcome, \${username}!\`;
                }
            }
        });
    </script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Arial', sans-serif;
        }
        
        body {
            visibility: hidden; /* Hide content until auth check completes */
            background-color: #f8f9fa;
            color: #202124;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        .clickdz-banner {
            background: linear-gradient(135deg, #1a73e8, #0d47a1);
            color: white;
            padding: 10px 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Arial', sans-serif;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            position: relative;
            z-index: 1000;
        }
        
        .clickdz-logo {
            margin-right: 10px;
            font-size: 18px;
        }
        
        .clickdz-text {
            font-size: 14px;
            letter-spacing: 0.5px;
        }
        
        .clickdz-text strong {
            font-weight: 600;
        }
        
        .main-content {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .chat-container {
            width: 90%;
            max-width: 800px;
            height: 90vh;
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .chat-header {
            padding: 20px;
            background-color: #1a73e8;
            color: #ffffff;
            text-align: center;
            position: relative;
        }
        
        .chat-header h1 {
            font-size: 24px;
            margin-bottom: 5px;
        }
        
        .chat-header p {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .user-info {
            position: absolute;
            right: 20px;
            top: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        #username-display {
            font-size: 14px;
        }
        
        #logout-btn {
            background-color: rgba(255, 255, 255, 0.2);
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.3s;
        }
        
        #logout-btn:hover {
            background-color: rgba(255, 255, 255, 0.3);
        }
        
        .chat-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .message {
            display: flex;
            margin-bottom: 10px;
        }
        
        .user-message {
            justify-content: flex-end;
        }
        
        .bot-message {
            justify-content: flex-start;
        }
        
        .message-content {
            padding: 12px 16px;
            border-radius: 18px;
            max-width: 70%;
            word-wrap: break-word;
            line-height: 1.5;
        }
        
        .user-message .message-content {
            background-color: #e8f0fe;
            color: #0d47a1;
            border-bottom-right-radius: 4px;
        }
        
        .bot-message .message-content {
            background-color: #f1f3f4;
            color: #202124;
            border-bottom-left-radius: 4px;
        }
        
        .chat-input-container {
            display: flex;
            padding: 15px;
            border-top: 1px solid #dadce0;
            background-color: #ffffff;
        }
        
        #user-input {
            flex: 1;
            padding: 12px 15px;
            border: 1px solid #dadce0;
            border-radius: 24px;
            font-size: 14px;
            resize: none;
            outline: none;
            transition: border-color 0.3s;
        }
        
        #user-input:focus {
            border-color: #1a73e8;
        }
        
        #send-btn {
            background-color: #1a73e8;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            margin-left: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s;
        }
        
        #send-btn:hover {
            background-color: #0d47a1;
        }
        
        #send-btn::after {
            content: "→";
            font-size: 20px;
        }
        
        .whatsapp-support {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #25D366;
            color: white;
            border-radius: 50px;
            padding: 10px 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
            text-decoration: none;
            font-weight: 500;
            z-index: 1000;
            transition: all 0.3s ease;
        }
        
        .whatsapp-support:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
        }
        
        .whatsapp-support i {
            font-size: 20px;
        }
        
        /* Responsive adjustments */
        @media (max-width: 600px) {
            .chat-container {
                width: 100%;
                height: 100vh;
                border-radius: 0;
            }
            
            .message-content {
                max-width: 85%;
            }
            
            .whatsapp-support {
                bottom: 10px;
                right: 10px;
                padding: 8px 15px;
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <!-- Powered by ClickDzPro banner -->
    <div class="clickdz-banner">
        <div class="clickdz-logo">
            <i class="fas fa-bolt"></i>
        </div>
        <div class="clickdz-text">Powered by <strong>ClickDzPro</strong></div>
    </div>
    
    <div class="main-content">
        <div class="chat-container">
            <div class="chat-header">
                <h1>Academic Assistant</h1>
                <p>Ask me any academic question</p>
                <div class="user-info">
                    <span id="username-display"></span>
                    <button id="logout-btn">Logout</button>
                </div>
            </div>
            <div class="chat-messages" id="chat-messages">
                <div class="message bot-message">
                    <div class="message-content">
                        Hello! I'm your academic assistant. I can help with questions across various academic disciplines. What would you like to know?
                    </div>
                </div>
            </div>
            <div class="chat-input-container">
                <textarea id="user-input" placeholder="Type your question here..." rows="2"></textarea>
                <button id="send-btn">Send</button>
            </div>
        </div>
    </div>
    
    <!-- WhatsApp Live Support -->
    <a href="https://wa.me/213558794243" class="whatsapp-support" target="_blank">
        <i class="fab fa-whatsapp"></i>
        <span>Live Support</span>
    </a>
    
    <script>
        // Logout functionality
        document.getElementById('logout-btn').addEventListener('click', function() {
            // Clear localStorage
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            
            // Clear cookies
            document.cookie = "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            
            console.log("Logging out and redirecting to login page");
            
            // Redirect to login page
            window.location.replace('login.html');
        });
        
        // Basic chat functionality
        document.getElementById('send-btn').addEventListener('click', sendMessage);
        document.getElementById('user-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        function sendMessage() {
            const userInput = document.getElementById('user-input');
            const message = userInput.value.trim();
            
            if (message) {
                // Add user message to chat
                addMessageToChat(message, 'user');
                userInput.value = '';
                
                // Simulate bot response (replace with actual API call later)
                setTimeout(() => {
                    const responses = [
                        "That's an interesting question. In academic contexts, this is often approached by examining multiple perspectives.",
                        "Great question! Based on recent research, there are several theories about this topic.",
                        "I'd be happy to help with that. This is a complex topic that spans several disciplines.",
                        "From an academic standpoint, we should consider both theoretical and practical aspects of this question.",
                        "Let me provide some scholarly context for this. There are several key concepts to understand first."
                    ];
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    addMessageToChat(randomResponse, 'bot');
                }, 1000);
            }
        }
        
        function addMessageToChat(message, sender) {
            const chatMessages = document.getElementById('chat-messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${sender}-message\`;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.textContent = message;
            
            messageDiv.appendChild(contentDiv);
            chatMessages.appendChild(messageDiv);
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    </script>
</body>
</html>`;
            
            fs.writeFileSync(indexPath, indexContent);
            console.log(`Created file: ${indexPath}`);
        }
        
        // Create login.html
        const loginPath = path.join(baseDir, 'login.html');
        if (!fs.existsSync(loginPath)) {
            const loginContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Academic Assistant</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Arial', sans-serif;
        }
        
        body {
            background-color: #f8f9fa;
            color: #202124;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        .clickdz-banner {
            background: linear-gradient(135deg, #1a73e8, #0d47a1);
            color: white;
            padding: 10px 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Arial', sans-serif;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            position: relative;
            z-index: 1000;
        }
        
        .clickdz-logo {
            margin-right: 10px;
            font-size: 18px;
        }
        
        .clickdz-text {
            font-size: 14px;
            letter-spacing: 0.5px;
        }
        
        .clickdz-text strong {
            font-weight: 600;
        }
        
        .login-container {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .container {
            width: 400px;
            max-width: 90%;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 40px;
        }
        
        .login-header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .login-header h1 {
            color: #1a73e8;
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .login-header p {
            color: #5f6368;
            font-size: 14px;
        }
        
        .input-group {
            margin-bottom: 20px;
        }
        
        .input-group label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            color: #5f6368;
        }
        
        .input-group input {
            width: 100%;
            padding: 12px;
            border: 1px solid #dadce0;
            border-radius: 4px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        
        .input-group input:focus {
            outline: none;
            border-color: #1a73e8;
        }
        
        .login-btn {
            width: 100%;
            padding: 12px;
            background-color: #1a73e8;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .login-btn:hover {
            background-color: #0d47a1;
        }
        
        .demo-credentials {
            margin-top: 20px;
            padding: 10px;
            background-color: #e8f0fe;
            border-radius: 4px;
            font-size: 12px;
            color: #0d47a1;
            text-align: center;
        }
        
        .whatsapp-support {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #25D366;
            color: white;
            border-radius: 50px;
            padding: 10px 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
            text-decoration: none;
            font-weight: 500;
            z-index: 1000;
            transition: all 0.3s ease;
        }
        
        .whatsapp-support:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
        }
        
        .whatsapp-support i {
            font-size: 20px;
        }
    </style>
</head>
<body>
    <!-- Powered by ClickDzPro banner -->
    <div class="clickdz-banner">
        <div class="clickdz-logo">
            <i class="fas fa-bolt"></i>
        </div>
        <div class="clickdz-text">Powered by <strong>ClickDzPro</strong></div>
    </div>
    
    <div class="login-container">
        <div class="container">
            <div class="login-header">
                <h1>Academic Assistant</h1>
                <p>Your AI-powered learning companion</p>
            </div>
            
            <form id="login-form">
                <div class="input-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" required>
                </div>
                
                <div class="input-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" required>
                </div>
                
                <button type="submit" class="login-btn">Sign In</button>
            </form>
            
            <div class="demo-credentials">
                <p>Demo credentials: username: <strong>admin</strong>, password: <strong>admin</strong></p>
            </div>
        </div>
    </div>
    
    <!-- WhatsApp Live Support -->
    <a href="https://wa.me/213558794243" class="whatsapp-support" target="_blank">
        <i class="fab fa-whatsapp"></i>
        <span>Live Support</span>
    </a>
    
    <script>
        document.getElementById('login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Simple validation - in a real app, this would be server-side
            if (username && password) {
                // Set login state
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                
                // Set cookies as well (for redundancy)
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 1); // 1 day expiry
                document.cookie = \`isLoggedIn=true; expires=\${expiryDate.toUTCString()}; path=/;\`;
                document.cookie = \`username=\${username}; expires=\${expiryDate.toUTCString()}; path=/;\`;
                
                // Redirect to main page
                window.location.href = 'index.html';
            } else {
                alert('Please enter both username and password');
            }
        });
    </script>
</body>
</html>`;
            
            fs.writeFileSync(loginPath, loginContent);
            console.log(`Created file: ${loginPath}`);
        }
        
        console.log("All necessary files created successfully");
    } catch (error) {
        console.error("Error creating files:", error);
    }
}

// Create files on startup
ensureFilesExist();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API routes
app.use('/api', apiRoutes);

// Serve static files
app.use(express.static(baseDir));

// Basic route for the home page
app.get('/', (req, res) => {
    console.log('Handling request for / route');
    res.sendFile(path.join(baseDir, 'index.html'));
});

// Route for the login page
app.get('/login', (req, res) => {
    console.log('Handling request for /login route');
    res.sendFile(path.join(baseDir, 'login.html'));
});

// Fallback route for any other request
app.use((req, res) => {
    console.log(`Fallback route handling: ${req.url}`);
    res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`- Login page: http://localhost:${PORT}/login`);
    console.log(`- Main chatbot: http://localhost:${PORT}/`);
});
