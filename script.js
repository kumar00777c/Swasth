// SMART LOCAL AI - No API Keys Needed, Safe for GitHub
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const body = document.body;

// Smart Medical AI Database
const medicalAI = {
    // Enhanced symptom understanding
    understandMessage: function(message) {
        const lowerMessage = message.toLowerCase();
        
        // Map symptoms to conditions
        const symptomMap = {
            // Stomach issues
            'stomach': 'stomach_pain',
            'tummy': 'stomach_pain', 
            'belly': 'stomach_pain',
            'abdominal': 'stomach_pain',
            'stomach ache': 'stomach_pain',
            'stomach pain': 'stomach_pain',
            'tummy ache': 'stomach_pain',
            'belly pain': 'stomach_pain',
            
            // Head issues
            'headache': 'headache',
            'head pain': 'headache',
            'migraine': 'headache',
            'head hurting': 'headache',
            
            // Fever
            'fever': 'fever',
            'temperature': 'fever',
            'hot': 'fever',
            'chills': 'fever',
            
            // Cold & Respiratory
            'cold': 'cold',
            'cough': 'cough',
            'sneezing': 'cold',
            'runny nose': 'cold',
            'sore throat': 'cold',
            'congestion': 'cold',
            
            // Breathing
            'breathing': 'breathing',
            'breathe': 'breathing',
            'shortness of breath': 'breathing',
            'can\'t breathe': 'breathing',
            
            // Digestive
            'vomiting': 'vomiting',
            'vomit': 'vomiting',
            'throwing up': 'vomiting',
            'nausea': 'vomiting',
            'diarrhea': 'diarrhea',
            'loose motion': 'diarrhea',
            
            // Pain
            'pain': 'general_pain',
            'hurting': 'general_pain',
            'ache': 'general_pain',
            
            // Other common symptoms
            'dizziness': 'dizziness',
            'dizzy': 'dizziness',
            'fatigue': 'fatigue',
            'tired': 'fatigue',
            'weakness': 'fatigue',
            'rash': 'rash',
            'itching': 'rash'
        };

        // Find matching conditions
        const foundConditions = [];
        for (const [keyword, condition] of Object.entries(symptomMap)) {
            if (lowerMessage.includes(keyword)) {
                if (!foundConditions.includes(condition)) {
                    foundConditions.push(condition);
                }
            }
        }

        return foundConditions.length > 0 ? foundConditions : ['general_advice'];
    },

    // Generate smart response
    generateResponse: function(conditions, userMessage) {
        const responses = {
            stomach_pain: `🧬 **What this could be:**\nStomach pain or indigestion\n\n💊 **What to do now:**\n• Rest and avoid solid foods for 2-3 hours\n• Sip clear fluids or ORS solution\n• Use hot water bottle for comfort\n• Avoid spicy, oily, or heavy foods\n• Take Digene or Gas-O-Fast if needed\n\n🏥 **When to see a doctor:**\n• Severe or constant pain\n• Pain with fever or vomiting\n• Blood in stool or vomit\n• No improvement in 24 hours`,
            
            headache: `🧬 **What this could be:**\nHeadache or tension pain\n\n💊 **What to do now:**\n• Rest in quiet, dark room\n• Take Paracetamol 650mg\n• Apply cold compress to forehead\n• Stay hydrated with water\n• Gentle head massage\n\n🏥 **When to see a doctor:**\n• Worst headache of your life\n• Headache with fever or stiff neck\n• Headache after head injury\n• Vision changes or confusion`,
            
            fever: `🧬 **What this could be:**\nFever - likely viral infection\n\n💊 **What to do now:**\n• Take Paracetamol 650mg every 6-8 hours\n• Drink plenty of water and fluids\n• Rest in cool environment\n• Use cold compress on forehead\n• Light, nutritious meals\n\n🏥 **When to see a doctor:**\n• Fever above 102°F (39°C)\n• Lasts more than 3 days\n• With rash or severe headache\n• Difficulty breathing`,
            
            cold: `🧬 **What this could be:**\nCommon cold or viral infection\n\n💊 **What to do now:**\n• Rest and adequate sleep\n• Warm fluids like tea with honey\n• Steam inhalation for congestion\n• Gargle with warm salt water\n• Use Vicks or cold balm\n\n🏥 **When to see a doctor:**\n• High fever develops\n• Severe headache or ear pain\n• Symptoms last more than 10 days\n• Difficulty breathing`,
            
            cough: `🧬 **What this could be:**\nCough due to irritation or infection\n\n💊 **What to do now:**\n• Stay hydrated with warm liquids\n• Honey with warm water or tea\n• Avoid cold drinks and smoking\n• Use humidifier in room\n• Benadryl or cough syrup if needed\n\n🏥 **When to see a doctor:**\n• Cough lasting more than 3 weeks\n• Coughing up blood\n• With fever and weight loss\n• Breathing difficulty`,
            
            breathing: `🚨 **URGENT MEDICAL ATTENTION NEEDED**\n\n🧬 **What this could be:**\nSerious respiratory condition\n\n💊 **What to do now:**\n• Sit upright and stay calm\n• Loosen tight clothing\n• Use rescue inhaler if available\n• Call emergency services\n\n🏥 **SEE DOCTOR IMMEDIATELY:**\n• Blue lips or face\n• Unable to speak full sentences\n• Chest pain with breathing\n• Rapid worsening`,
            
            vomiting: `🧬 **What this could be:**\nFood poisoning or stomach infection\n\n💊 **What to do do now:**\n• Rest and avoid solid foods\n• Sip ORS or clear fluids slowly\n• BRAT diet (Banana, Rice, Applesauce, Toast)\n• Avoid dairy and fatty foods\n\n🏥 **When to see a doctor:**\n• Vomiting for more than 24 hours\n• Blood in vomit\n• Signs of dehydration\n• Severe abdominal pain`,
            
            diarrhea: `🧬 **What this could be:**\nStomach infection or food issue\n\n💊 **What to do now:**\n• Drink ORS to prevent dehydration\n• BRAT diet - avoid dairy/fatty foods\n• Rest and avoid strenuous activity\n• Probiotics may help\n\n🏥 **When to see a doctor:**\n• Diarrhea for more than 2 days\n• Blood in stool\n• High fever with diarrhea\n• Severe dehydration signs`,
            
            general_pain: `🧬 **What this could be:**\nGeneral body pain or discomfort\n\n💊 **What to do now:**\n• Rest the affected area\n• Take Paracetamol 650mg if needed\n• Apply hot/cold compress\n• Gentle stretching if muscle pain\n• Stay hydrated\n\n🏥 **When to see a doctor:**\n• Severe or worsening pain\n• Pain with fever or swelling\n• Unable to move normally\n• No improvement in 2-3 days`,
            
            general_advice: `I understand you're not feeling well. Here's general guidance:\n\n💊 **What to do now:**\n• Rest and get adequate sleep\n• Stay hydrated with water\n• Eat light, nutritious meals\n• Monitor your symptoms\n\n🏥 **When to see a doctor:**\n• Symptoms worsening\n• New symptoms appearing\n• No improvement in 2-3 days\n• High fever or severe pain\n\nCan you describe your symptoms more specifically? For example: "headache", "stomach pain", "fever", etc.`
        };

        // Return the most specific response
        for (const condition of conditions) {
            if (responses[condition]) {
                return responses[condition];
            }
        }
        
        return responses.general_advice;
    },

    // Main function to handle any message
    processMessage: function(userMessage) {
        const conditions = this.understandMessage(userMessage);
        return this.generateResponse(conditions, userMessage);
    }
};

// Initialize chat
function initChat() {
    addBotMessage("👋 Hello! I'm your Health Assistant. I can help with symptoms like: headache, fever, stomach pain, cold, cough, etc. What are you experiencing?");
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
        messageDiv.innerHTML = message.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

// Handle user message
function handleUserMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, true);
    userInput.value = '';

    // Generate smart response
    setTimeout(() => {
        const response = medicalAI.processMessage(message);
        addBotMessage(response);
    }, 500);
}

// Event listeners
sendButton.addEventListener('click', handleUserMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserMessage();
});

// Initialize
window.addEventListener('load', initChat);