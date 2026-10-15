/**
 * PROTOMANIA AI Fitness Buddy View
 * Conversational coach answering real student fitness and mess nutrition dilemmas.
 */

import { api } from "../api.js";
import { state } from "../state.js";
import { renderProtoMark } from "../components/logo.js";

export function renderAssistantView(container) {
  const chatHistory = [
    {
      role: "assistant",
      content: "Hey lifter! ⚡ I'm your PROTOMANIA AI Fitness Buddy. Ask me anything about cheap student protein, hostel kettle cooking hacks, restarting missed workouts, or surviving college mess meals. How can I help your gains today?"
    }
  ];

  function render() {
    container.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#34382F] pb-4">
          <div>
            <div class="flex items-center space-x-2 text-xs font-mono text-[#9C8AFF]">
              <i data-lucide="sparkles" class="w-4 h-4"></i>
              <span>CONTEXTUAL AI COACH</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#F4F5EF] mt-0.5">AI Fitness Buddy</h1>
          </div>

          <div class="flex items-center space-x-2 bg-[#1B1E19] border border-[#34382F] px-3 py-1.5 rounded-full text-[11px] font-mono">
            <span class="w-2 h-2 rounded-full bg-[#9C8AFF] animate-ping"></span>
            <span id="ai-engine-status" class="text-[#858A80]">Connected to AI Engine</span>
          </div>
        </div>

        <!-- Preloaded Smart Prompt Chips -->
        <div class="space-y-1.5">
          <span class="text-[11px] font-mono uppercase text-[#858A80] font-bold">Try Asking:</span>
          <div class="flex flex-wrap gap-2 text-xs">
            ${[
              "What should I eat before leg day?",
              "Make me a vegetarian plan for ₹80 a day.",
              "Replace paneer with something cheaper.",
              "I missed two workouts. Help me restart.",
              "Create a 30-minute workout for today.",
              "I only have hostel mess food."
            ].map(prompt => `
              <button class="prompt-chip bg-[#1B1E19] hover:bg-[#111410] border border-[#34382F] hover:border-[#9C8AFF] px-3 py-1.5 rounded-lg text-[#F4F5EF] text-left transition-all text-xs" data-prompt="${prompt}">
                ${prompt}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Chat Log Window -->
        <div id="chat-messages" class="card-proto p-4 sm:p-6 min-h-[420px] max-h-[500px] overflow-y-auto space-y-4 border-[#34382F] bg-[#141712]/95">
          ${chatHistory.map(msg => renderMessage(msg)).join('')}
        </div>

        <!-- Chat Input Bar -->
        <form id="chat-form" class="flex items-center space-x-3">
          <input 
            type="text" 
            id="chat-input" 
            placeholder="Ask about cheap protein, kettle meal prep, form cues..." 
            class="flex-1 bg-[#1B1E19] border border-[#34382F] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#F4F5EF] focus:border-[#9C8AFF] focus:outline-none"
            required
            autocomplete="off"
          />
          <button type="submit" id="send-chat-btn" class="btn-acid px-6 py-3 font-bold text-xs flex items-center space-x-1.5 shadow-md">
            <span>Send</span>
            <i data-lucide="send" class="w-3.5 h-3.5"></i>
          </button>
        </form>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    attachListeners();
  }

  function renderMessage(msg) {
    const isUser = msg.role === "user";
    return `
      <div class="flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}">
        <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-[#D8FF3E] text-[#111410]' : 'bg-[#9C8AFF]/20 text-[#9C8AFF] border border-[#9C8AFF]/40'} font-bold text-xs">
          ${isUser ? 'U' : renderProtoMark(20)}
        </div>

        <div class="max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${isUser ? 'bg-[#D8FF3E] text-[#111410] font-medium' : 'bg-[#1B1E19] border border-[#34382F] text-[#F4F5EF] space-y-2'}">
          <div class="whitespace-pre-line">${formatMarkdown(msg.content)}</div>
        </div>
      </div>
    `;
  }

  function formatMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/• (.*?)/g, '• $1');
  }

  function attachListeners() {
    // Quick prompt chips
    document.querySelectorAll(".prompt-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        const prompt = btn.getAttribute("data-prompt");
        const input = document.getElementById("chat-input");
        if (input) {
          input.value = prompt;
          sendMessage(prompt);
        }
      });
    });

    // Form submit
    document.getElementById("chat-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("chat-input");
      const text = input?.value?.trim();
      if (text) {
        sendMessage(text);
        if (input) input.value = "";
      }
    });
  }

  async function sendMessage(text) {
    const chatContainer = document.getElementById("chat-messages");
    if (!chatContainer) return;

    chatHistory.push({ role: "user", content: text });
    chatContainer.innerHTML += renderMessage({ role: "user", content: text });
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Typing indicator
    const typingId = "typing-" + Date.now();
    chatContainer.innerHTML += `
      <div id="${typingId}" class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-full bg-[#9C8AFF]/20 text-[#9C8AFF] border border-[#9C8AFF]/40 flex items-center justify-center font-bold text-xs">
          ⚡
        </div>
        <div class="bg-[#1B1E19] border border-[#34382F] rounded-2xl px-4 py-2 text-xs text-[#858A80] flex items-center space-x-2">
          <i data-lucide="loader" class="w-3.5 h-3.5 animate-spin text-[#9C8AFF]"></i>
          <span>Buddy is analyzing your student budget context...</span>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
      const res = await api.chatWithBuddy(text, chatHistory.slice(-6));
      document.getElementById(typingId)?.remove();

      chatHistory.push({ role: "assistant", content: res.reply });
      chatContainer.innerHTML += renderMessage({ role: "assistant", content: res.reply });
      
      const statusEl = document.getElementById("ai-engine-status");
      if (statusEl) {
        statusEl.textContent = res.is_live_ai ? "Powered by Google Gemini 1.5" : "PROTOMANIA Smart Local Engine";
      }

      chatContainer.scrollTop = chatContainer.scrollHeight;
    } catch (err) {
      document.getElementById(typingId)?.remove();
      chatContainer.innerHTML += renderMessage({
        role: "assistant",
        content: `Sorry lifter, couldn't reach the server: ${err.message}`
      });
    }
  }

  render();
}
