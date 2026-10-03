"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  User,
  Send,
  Sparkles,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Terminal,
  RefreshCw,
  CheckCircle2,
  Trash2,
  Lock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { AgentMessage } from "@/lib/ai/agent";

export default function AgentPage() {
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: "intro-1",
      sender: "agent",
      text: "Hello! I am **ScamGuard Safety Agent**, your autonomous cybersecurity assistant.\n\nYou can paste any suspicious SMS, link, WhatsApp text, email, or describe a suspicious situation (e.g. *'Someone called me asking for a 4-digit code'*). I will investigate the threat vectors, inspect domains, and guide you step by step.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || loading) return;

    const userMsg: AgentMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Agent communication error");
      }

      const agentMsg: AgentMessage = {
        id: `agent_${Date.now()}`,
        sender: "agent",
        text: data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        toolCalls: data.toolCalls,
        analysis: data.analysis,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: "agent",
          text: `⚠️ **Error:** ${err.message || "Could not reach the security agent."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: "intro-fresh",
        sender: "agent",
        text: "Conversation cleared. Ready for your next investigation. What suspicious message or link would you like me to inspect?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const quickPrompts = [
    "Someone called asking for my 4-digit PIN",
    "I received: 'Congratulations! You won 50 MB data with SPIN the Wheel'",
    "I clicked a fake courier link, what should I do?",
    "Is http://easypa1sa.xyz legitimate?",
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Bot className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              ScamGuard Safety Agent
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Online
              </span>
            </h1>
            <p className="text-xs text-slate-400">Autonomous cybersecurity investigator & incident assistant</p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 border border-slate-800 text-xs flex items-center gap-1.5 transition"
          title="Clear Conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-slate-950/70 border border-slate-800 rounded-3xl p-4 sm:p-6 overflow-y-auto min-h-[500px] max-h-[650px] space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "agent" && (
              <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[85%] space-y-3`}>
              {/* Tool Execution Box (if agent executed autonomous tools) */}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                    <Terminal className="w-3.5 h-3.5" />
                    Agent Autonomous Tools Executed
                  </div>
                  {msg.toolCalls.map((tool, idx) => (
                    <div key={idx} className="text-[11px] font-mono bg-slate-950 p-2 rounded border border-slate-800 text-slate-300">
                      <span className="text-cyan-400 font-semibold">{tool.name}</span>
                      <p className="text-slate-400 text-[10px] mt-0.5">{tool.result}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/20"
                    : "bg-slate-900 border border-slate-800/80 text-slate-200 rounded-tl-none shadow-md"
                }`}
              >
                {msg.text}
              </div>

              {/* Embedded Threat Card if analysis is available */}
              {msg.analysis && (
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        msg.analysis.risk_level === "very_high" || msg.analysis.risk_level === "high"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {msg.analysis.risk_level?.replace("_", " ")} ({msg.analysis.risk_score}/100)
                    </span>
                    <span className="text-slate-400">{msg.analysis.scam_types.slice(0, 2).join(", ")}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">{msg.timestamp}</span>
                </div>
              )}
            </div>

            {msg.sender === "user" && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-cyan-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800 w-fit">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Agent investigating threat signals & inspecting safety parameters...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="my-3 flex flex-wrap gap-2">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(prompt)}
            className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition truncate max-w-full"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative mt-2"
      >
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask the safety agent anything or paste a suspicious message / link..."
          className="w-full pl-4 pr-14 py-3 rounded-2xl bg-slate-900 border border-slate-800 focus:border-cyan-500 text-slate-100 placeholder-slate-500 text-sm outline-none resize-none transition"
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-400 disabled:opacity-40 transition shadow-md shadow-cyan-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
