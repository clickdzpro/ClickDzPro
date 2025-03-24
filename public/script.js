document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-btn');

    // Kluster AI API configuration
    const API_KEY = '487ea02a-e01a-4618-8aa5-25d259239765';
    const BASE_URL = 'https://api.kluster.ai/v1';
    const MODEL = 'klusterai/Meta-Llama-3.1-8B-Instruct-Turbo';

    // System prompt for the academic assistant
    const SYSTEM_PROMPT = `You are an academic assistant designed to provide thoughtful, well-reasoned responses to questions across various academic disciplines. Follow these guidelines:

1. REASONING APPROACH:
   - Break down complex problems into smaller components
   - Analyze questions from multiple perspectives
   - Consider alternative viewpoints and potential counterarguments
   - Identify assumptions and limitations in your reasoning
   - Use deductive, inductive, and abductive reasoning as appropriate

2. RESPONSE STRUCTURE:
   - Begin with a clear, concise answer to the main question
   - Provide context and background information relevant to understanding the topic
   - Present a structured analysis with logical progression
   - Support claims with evidence, examples, and references to academic literature
   - Conclude by summarizing key insights and implications

3. ACADEMIC STANDARDS:
   - Maintain scholarly tone and terminology appropriate to the field
   - Distinguish between established facts, theoretical models, and speculative ideas
   - Acknowledge areas of uncertainty or ongoing debate within the field
   - Apply appropriate disciplinary methodologies (scientific method, literary analysis, etc.)
   - Avoid oversimplification of complex topics

4. CITATIONS AND EVIDENCE:
   - Reference relevant academic sources when discussing established knowledge
   - Describe the basis for any claims (empirical studies, theoretical frameworks, etc.)
   - Mention seminal works or major contributors in the field when relevant
   - Qualify the strength of evidence (strong consensus, emerging research, contested, etc.)

5. METACOGNITION:
   - If uncertain about specific details, acknowledge limitations while providing best available information
   - When faced with ambiguous questions, clarify possible interpretations before responding
   - For interdisciplinary topics, explain how different fields approach the question

Remember that your goal is to help users develop deeper understanding rather than merely providing facts. Focus on building conceptual frameworks that enable further learning and critical thinking.`;

    // Message history
    let messageHistory = [
        { role: "system", content: SYSTEM_PROMPT }
    ];

    // Function to add a message to the chat
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Convert markdown-like syntax to HTML
        let formattedContent = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
        
        messageContent.innerHTML = formattedContent;
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to show typing indicator
    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.id = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            indicator.appendChild(dot);
        }
        
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to remove typing indicator
    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // Function to send message to Kluster AI API
    async function sendToKlusterAI(userMessage) {
        try {
            // Add user message to history
            messageHistory.push({ role: "user", content: userMessage });
            
            // Show typing indicator
            showTypingIndicator();
            
            // Make API request
            const response = await fetch(`${BASE_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: MODEL,
                    max_completion_tokens: 4000,
                    temperature: 0.6,
                    top_p: 1,
                    messages: messageHistory
                })
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            const botReply = data.choices[0].message.content;
            
            // Add bot response to history
            messageHistory.push({ role: "assistant", content: botReply });
            
            // Remove typing indicator and add bot message
            removeTypingIndicator();
            addMessage(botReply);
            
            return botReply;
        } catch (error) {
            console.error('Error calling Kluster AI API:', error);
            removeTypingIndicator();
            addMessage("I'm sorry, I encountered an error while processing your request. Please try again later.");
            return null;
        }
    }

    // Handle send button click
    sendButton.addEventListener('click', async () => {
        const message = userInput.value.trim();
        if (message) {
            // Add user message to chat
            addMessage(message, true);
            userInput.value = '';
            
            // Send to API
            await sendToKlusterAI(message);
        }
    });

    // Handle enter key press
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });
});
