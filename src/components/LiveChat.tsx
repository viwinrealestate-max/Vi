import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  Minimize2, 
  CheckCircle2 
} from 'lucide-react';
import { ChatMessage } from '../types';
import { COMPANY_INFO } from '../data/mockData';

interface LiveChatProps {
  onOpenMortgage?: () => void;
  onOpenProperties?: () => void;
}

export const LiveChat: React.FC<LiveChatProps> = ({ onOpenMortgage, onOpenProperties }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'agent',
      text: `Vanakkam! Welcome to Viwin's | Real Estate. I am your Bedford Coonoor estate concierge. Are you seeking tea plantations, luxury villas, or investment advisory today?`,
      timestamp: 'Just now',
      agentName: "Viwin's Concierge (Bedford Office)",
      quickReplies: [
        'Book a site visit in Coonoor',
        'Inquire about tea estate clearance',
        'Current mortgage interest rates',
        'Contact Bedford Office Desk',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const getSmartReply = (userQuery: string): { reply: string; quickReplies?: string[] } => {
    const q = userQuery.toLowerCase();

    if (q.includes('visit') || q.includes('tour') || (q.includes('coonoor') && q.includes('site'))) {
      return {
        reply: `Certainly! Our Bedford team can arrange private escorted tours across Bedford, Upper Coonoor, Wellington, and Ketti Valley. You can call our headquarters directly at ${COMPANY_INFO.phoneLandline} or mobile ${COMPANY_INFO.phoneMobile}. Would you like us to note your preferred date?`,
        quickReplies: ['Call 0423 4055672 Now', 'WhatsApp +91 70106 47424', 'View All Properties'],
      };
    }

    if (q.includes('tea') || q.includes('plantation') || q.includes('clearance') || q.includes('title')) {
      return {
        reply: `All our tea plantation listings in the Nilgiris (including The Glenburn Estate) come with 100% verified Patta records, Hill Area Conservation Authority (HACA) clearance, and RERA registration. All documentation is verified prior to listing.`,
        quickReplies: ['View Glenburn Estate', 'Contact Bedford Desk', 'Check Market Analytics'],
      };
    }

    if (q.includes('mortgage') || q.includes('rate') || q.includes('emi') || q.includes('loan')) {
      return {
        reply: `Current Indian home loan interest rates for premium Nilgiris residential estates range between 8.35% and 8.75% p.a. You can test your exact down payment and monthly EMI using our interactive Mortgage Calculator on this page.`,
        quickReplies: ['Open Mortgage Calculator', 'Contact Financing Desk'],
      };
    }

    if (q.includes('desk') || q.includes('office') || q.includes('contact') || q.includes('director') || q.includes('salamon')) {
      return {
        reply: `Viwin's Real Estate headquarters is located at No.131 - E, 1st Floor, Jograj Buildings, Bedford, Coonoor -643 101. Direct telephone: ${COMPANY_INFO.phoneLandline} or mobile ${COMPANY_INFO.phoneMobile}.`,
        quickReplies: ['Call Bedford Office', 'Send WhatsApp Message'],
      };
    }

    if (q.includes('address') || q.includes('location')) {
      return {
        reply: `Viwin's Real Estate headquarters is situated at: ${COMPANY_INFO.address}. Open Monday to Saturday, 9:00 AM to 7:30 PM. We welcome walk-in consultations with prior appointments.`,
      };
    }

    return {
      reply: `Thank you for your inquiry. The Viwin's Bedford concierge desk is reviewing your request. For immediate priority assistance, feel free to call our office at ${COMPANY_INFO.phoneLandline} or mobile ${COMPANY_INFO.phoneMobile}.`,
      quickReplies: ['Call Office Desk', 'Browse Featured Estates', 'Estimate EMI'],
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate concierge response with realistic typing delay
    setTimeout(() => {
      const responseData = getSmartReply(text);
      const agentMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        text: responseData.reply,
        timestamp: 'Just now',
        agentName: "Viwin's Estate Concierge",
        quickReplies: responseData.quickReplies,
      };
      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleQuickReplyClick = (reply: string) => {
    if (reply.includes('Open Mortgage')) {
      onOpenMortgage?.();
    } else if (reply.includes('View') || reply.includes('Browse')) {
      onOpenProperties?.();
    } else if (reply.includes('Call')) {
      window.location.href = `tel:${COMPANY_INFO.phoneLandline.replace(/\s+/g, '')}`;
    } else if (reply.includes('WhatsApp')) {
      window.open(`https://wa.me/917010647424?text=Hello%20Viwin's%20Real%20Estate,%20I%20am%20inquiring%20about%20Nilgiris%20estates.`, '_blank');
    } else {
      handleSendMessage(reply);
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-stone-950 shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 font-bold text-xs cursor-pointer group"
          aria-label="Open live chat with Viwin's estate concierge"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-stone-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-amber-500 animate-pulse" />
          </div>
          <span className="hidden sm:inline-block tracking-wide">Live Concierge</span>
        </button>
      )}

      {/* Live Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[520px] bg-stone-900 border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-100 animate-in slide-in-from-bottom-5 duration-200"
          role="region"
          aria-label="Live Chat Support"
        >
          {/* Header */}
          <div className="bg-stone-950 p-4 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-stone-950" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-bold text-white flex items-center gap-1.5">
                  Viwin's Concierge
                  <span className="text-[10px] font-sans font-normal text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/20">
                    Online
                  </span>
                </h4>
                <p className="text-[11px] text-stone-400">Bedford Office, Coonoor</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <a
                href={`tel:${COMPANY_INFO.phoneLandline.replace(/\s+/g, '')}`}
                className="p-1.5 rounded-lg text-stone-400 hover:text-amber-400 transition-colors"
                title={`Call ${COMPANY_INFO.phoneLandline}`}
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white transition-colors"
                aria-label="Close chat window"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Encryption Sub-header */}
          <div className="bg-stone-950/70 px-3 py-1 text-[10px] text-stone-400 border-b border-stone-800 flex items-center justify-between">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
              AES-256 Encrypted Channel
            </span>
            <span>Tel: 0423 4055672</span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-900/90 text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  {!isUser && msg.agentName && (
                    <span className="text-[10px] text-stone-400 mb-1 ml-1 font-medium">
                      {msg.agentName}
                    </span>
                  )}

                  <div
                    className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                      isUser
                        ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-none'
                        : 'bg-stone-950 border border-stone-800 text-stone-200 rounded-tl-none shadow-md'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Quick Replies Chips */}
                  {!isUser && msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.quickReplies.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickReplyClick(chip)}
                          className="px-2.5 py-1 rounded-full bg-stone-950 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-[11px] font-medium transition-colors cursor-pointer text-left"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-stone-950 border border-stone-800 max-w-[100px] text-stone-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-stone-950 border-t border-stone-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about properties, legal titles, EMI..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-amber-500 text-stone-950 disabled:opacity-40 hover:bg-amber-400 transition-colors cursor-pointer"
              aria-label="Send inquiry message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
