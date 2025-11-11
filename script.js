const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const body = document.body;

// 🔑 PUT YOUR API KEY HERE
const OPENAI_API_KEY = CONFIG.OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

// Medical context for the AI
const MEDICAL_CONTEXT = `You are Swasth AI, a compassionate and knowledgeable medical assistant. Your role is to:

1. **Analyze symptoms** and provide likely conditions
2. **Give immediate self-care advice** with specific steps
3. **Clearly state when to see a doctor** with specific warning signs
4. **Always include a medical disclaimer**
5. **Use simple, clear language** with bullet points
6. **Be empathetic and reassuring**
7. **Ask follow-up questions** when needed for better diagnosis

**Response Format (ALWAYS follow this structure):**

🧬 **What this could be:**
[Condition name] - [Brief plain English description]

💊 **What to do now:**
• [Specific action 1]
• [Specific action 2] 
• [Specific action 3]

🏥 **When to see a doctor:**
• [Specific warning sign 1]
• [Specific warning sign 2]
• [Specific warning sign 3]

⚠️ **Medical Disclaimer:** This is for informational purposes only and not medical advice. Always consult a healthcare professional for proper diagnosis.

**For serious symptoms like:** chest pain, difficulty breathing, severe bleeding, loss of consciousness - IMMEDIATELY recommend emergency care.

**Be specific with medications:** Mention exact names like "Paracetamol 650mg" not just "pain relievers"`;

// Chat history
let conversationHistory = [
    {
        role: "system",
        content: MEDICAL_CONTEXT
    }
];

// Initialize chat
function initChat() {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'sk-your-actual-api-key-here') {
        addBotMessage("⚠️ API key not configured. Please add your OpenAI API key to the script.js file.");
        return;
    }
    
    addBotMessage("👋 Hello! I'm Swasth AI, your medical assistant. I'm here to help analyze your symptoms and provide guidance. What health concerns are you experiencing today?");
    body.classList.add('chat-started');
}

// Add message to chat
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add bot message with typing effect
function addBotMessage(message) {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    setTimeout(() => {
        chatMessages.removeChild(typingDiv);
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = formatMessage(message);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1500);
}

// Format message with proper formatting
function formatMessage(text) {
    return text
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/•/g, '•');
}

// Call OpenAI API
async function callOpenAI(userMessage) {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'sk-your-actual-api-key-here') {
        return "❌ API key not configured. Please add your OpenAI API key to enable AI responses.";
    }

    try {
        // Add user message to history
        conversationHistory.push({
            role: "user",
            content: userMessage
        });

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: conversationHistory,
                max_tokens: 500,
                temperature: 0.7,
                presence_penalty: 0.1,
                frequency_penalty: 0.1
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            const aiResponse = data.choices[0].message.content;
            
            // Add AI response to history
            conversationHistory.push({
                role: "assistant",
                content: aiResponse
            });

            return aiResponse;
        } else {
            throw new Error('No response from AI');
        }

    } catch (error) {
        console.error('OpenAI API Error:', error);
        
        // Fallback responses
        const fallbackResponses = [
            "I understand you're seeking medical advice. Let me help you with that. Could you describe your symptoms in more detail?",
            "I want to make sure I understand your health concerns correctly. Can you tell me more about what you're experiencing?",
            "I'm here to help with your health questions. Please describe your symptoms and I'll provide the best guidance I can.",
            "Let me assist you with your health concerns. What specific symptoms are you experiencing?"
        ];
        
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
}

// Handle user message with AI
async function handleUserMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to UI
    addMessage(message, true);
    userInput.value = '';
    userInput.disabled = true;
    sendButton.disabled = true;

    try {
        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Get AI response
        const aiResponse = await callOpenAI(message);
        
        // Remove typing indicator
        chatMessages.removeChild(typingDiv);
        
        // Add AI response to UI
        addBotMessage(aiResponse);

    } catch (error) {
        console.error('Error:', error);
        addBotMessage("I apologize, I'm experiencing some technical difficulties. Please try again in a moment.");
    } finally {
        userInput.disabled = false;
        sendButton.disabled = false;
        userInput.focus();
    }
}

// Event listeners
sendButton.addEventListener('click', handleUserMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !userInput.disabled) {
        handleUserMessage();
    }
});

// Clear chat history (optional feature)
function clearChat() {
    conversationHistory = [
        {
            role: "system",
            content: MEDICAL_CONTEXT
        }
    ];
    chatMessages.innerHTML = '';
    addBotMessage("Hello! I'm Dr. HealthAI. How can I help you with your health concerns today?");
}

// Initialize chat when page loads
window.addEventListener('load', initChat);