import React, { useState, useRef, useEffect } from 'react';

const knowledgeBase = [
  {
    triggers: ['bolt', 'oxygen', 'hold', 'test', 'breath hold'],
    reply: "The BOLT (Body Oxygen Level Test) measures your body's tolerance to carbon dioxide and reveals how efficiently oxygen reaches your cells via the Bohr Effect. A score under 20s suggests over-breathing and airway stress, while 30s+ indicates superior aerobic resilience."
  },
  {
    triggers: ['gut', 'bloat', 'acid', 'reflux', 'digestion', 'ibs', 'microbiome'],
    reply: "Reshmi Verma's gut mucosal protocol treats the intestinal barrier as a dynamic ecosystem. We address leaky gut, dysbiosis, and the gut-brain axis using targeted phyto-botanicals, polyphenols, and vagus nerve stimulation."
  },
  {
    triggers: ['reshmi', 'nutritionist', 'bio', 'who', 'qualification'],
    reply: "Reshmi Verma is a Biotechnologist, Functional Nutritionist, Certified Oxygen Advantage Coach (#13 in India), and Director of Rainbow Medinova Diagnostic Services with 20+ years in healthcare diagnostics. Having personally transformed her health and lost 38+ kg, she bridges hard science with deep empathy."
  },
  {
    triggers: ['samya', 'framework', 'approach', 'process'],
    reply: "SAMYA is Reshmi Verma's signature framework: 1. See the signs, 2. Ask the right questions, 3. Map the patterns across gut, breath, hormones & sleep, 4. Your customized solution, and 5. Achieve lasting wellness."
  },
  {
    triggers: ['consult', 'book', 'appointment', 'fee', 'price', 'session'],
    reply: "You can book an Initial Discovery Call (20 min) or a Comprehensive Clinical Consultation (60 min). Simply click 'Book Consultation' in the menu or go to the booking page to select your date and time."
  },
  {
    triggers: ['478', 'box', 'breathwork', 'technique', 'vagal'],
    reply: "Breathwork acts as direct neuromodulation. For example, 4-7-8 breathing extends exhalations to stimulate vagal efferent fibers, lowering heart rate within seconds, while 5-5 Coherent Breathing optimizes Heart Rate Variability (HRV)."
  }
];

export default function EvaAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hi, I'm Eva, Reshmi Verma's clinical health assistant. How can I guide you today regarding nutrition, gut health, BOLT breathing, or booking a consultation?"
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const query = (textToSend !== undefined ? textToSend : inputVal).trim();
    if (!query) return;

    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    if (textToSend === undefined) {
      setInputVal('');
    }

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lower = query.toLowerCase();
      let matchedReply = null;

      for (const item of knowledgeBase) {
        if (item.triggers.some((t) => lower.includes(t))) {
          matchedReply = item.reply;
          break;
        }
      }

      if (!matchedReply) {
        matchedReply = "I understand. Nutrition, breathwork, and metabolic health are deeply connected. You can explore our interactive BOLT test or schedule a 1-on-1 Health Clarity Session with Reshmi Verma for an individualized roadmap.";
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: matchedReply }]);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Trigger */}
      <div
        className="eva-floating-trigger"
        id="eva-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer' }}
      >
        <div className="eva-avatar">E</div>
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.1 }}>Ask Eva</span>
          <span style={{ fontSize: '0.72rem', color: '#FED7AA' }}>Clinical Health Assistant</span>
        </div>
      </div>

      {/* Chat Drawer */}
      <div className={`eva-chat-drawer ${isOpen ? 'open' : ''}`} id="eva-drawer">
        <div className="eva-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="eva-avatar" style={{ background: 'white', color: 'var(--emerald-deep)' }}>
              E
            </div>
            <div>
              <h4>Eva &bull; HealthwithReshmi™</h4>
              <p>Educational Health Companion</p>
            </div>
          </div>
          <button
            className="eva-close-btn"
            id="eva-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close Chat"
          >
            &times;
          </button>
        </div>

        <div className="eva-body" id="eva-body" ref={chatBodyRef}>
          {messages.map((m, idx) => (
            <div key={idx} className={`chat-bubble ${m.sender}`}>
              {m.text}
            </div>
          ))}

          {isTyping && (
            <div className="chat-bubble bot">
              <em>Thinking...</em>
            </div>
          )}

          <div className="eva-quick-chips">
            <span className="quick-chip" onClick={() => handleSend('What is the BOLT test?')}>
              What is the BOLT test?
            </span>
            <span className="quick-chip" onClick={() => handleSend('How to heal gut bloating?')}>
              How to heal gut bloating?
            </span>
            <span className="quick-chip" onClick={() => handleSend('About Reshmi')}>
              About Reshmi
            </span>
            <span className="quick-chip" onClick={() => handleSend('How does booking work?')}>
              How does booking work?
            </span>
          </div>
        </div>

        <div className="eva-footer">
          <input
            type="text"
            className="eva-input"
            id="eva-input"
            placeholder="Type a health question..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="eva-send-btn"
            id="eva-send"
            aria-label="Send message"
            onClick={() => handleSend()}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
