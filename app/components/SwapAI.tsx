"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";

type Destination =
  | "home"
  | "payment"
  | "history"
  | "sell"
  | "twm"
  | "account"
  | "deals";

type Message = {
  id: string;
  role: "assistant" | "user";
  text: string;
  action?: { label: string; destination: Destination };
};

type Answer = {
  text: string;
  action?: { label: string; destination: Destination };
};

const suggestions = [
  { label: "List an item", question: "How do I list a product?" },
  { label: "Make a trade", question: "How do I make a swap?" },
  { label: "Change theme", question: "How do I change the theme?" },
];

function answerQuestion(question: string): Answer {
  const text = question.toLowerCase();

  if (/theme|colour|color|appearance/.test(text)) {
    return {
      text: "Use the theme selector in the top bar to choose any of the 12 available themes. Your selection is saved in this browser.",
    };
  }
  if (/coupon|deal|save10|discount|reward/.test(text)) {
    return {
      text: "Complete your first trade to unlock SAVE10. Then open Deals to use the coupon at checkout.",
      action: { label: "View deals", destination: "deals" },
    };
  }
  if (/history|transaction|activity|receipt/.test(text)) {
    return {
      text: "Open History to review your recorded payments, listings, and trades.",
      action: { label: "Open History", destination: "history" },
    };
  }
  if (/account|profile|logout|sign out/.test(text)) {
    return {
      text: "Open My Account to view your profile or sign out.",
      action: { label: "Open My Account", destination: "account" },
    };
  }
  if (/payment|checkout|buy|purchase|pay/.test(text)) {
    return {
      text: "To check out, open Payment, enter the item, amount, and delivery details, then choose a payment method. This site is currently running in demo mode.",
      action: { label: "Open Payment", destination: "payment" },
    };
  }
  if (/swap|trade|exchange|offer/.test(text)) {
    return {
      text: "Open Trade With Me, choose one of your listings and another listing, review the value comparison, then propose the trade. Add a listing first if you do not have one yet.",
      action: { label: "Start a trade", destination: "twm" },
    };
  }
  if (/list|sell|post|create|add/.test(text) && /item|product|listing|market/.test(text)) {
    return {
      text: "Open List My Product, enter a product name and price, add a description, and submit. Your item will appear under My Listings.",
      action: { label: "List a product", destination: "sell" },
    };
  }
  if (/what is swapzone|about|website|how does .* work|what can i do/.test(text)) {
    return {
      text: "SwapZone is a community marketplace for discovering products, listing items, arranging swaps, and managing checkout. Use the menu to move between those tools. Demo activity is stored in this browser.",
      action: { label: "Browse products", destination: "home" },
    };
  }

  return {
    text: "I can help with listing products, making swaps, payments, themes, activity history, coupons, and your account. What would you like to do?",
  };
}

export default function SwapAI({
  onNavigate,
}: {
  onNavigate: (destination: Destination) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi, I’m SwapAI. Ask me about using SwapZone, or choose a common task below.",
    },
  ]);
  const messageListRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      messageListRef.current?.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, open]);

  const submitQuestion = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    const answer = answerQuestion(trimmed);
    const id = Date.now().toString();
    setMessages((current) => [
      ...current,
      { id: `${id}-user`, role: "user", text: trimmed },
      { id: `${id}-assistant`, role: "assistant", text: answer.text, action: answer.action },
    ]);
    setDraft("");
  };

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitQuestion(draft);
    inputRef.current?.focus();
  };

  return (
    <div className="swapai-widget">
      {open && (
        <section id="swapai-panel" className="swapai-panel" aria-label="SwapAI help" role="dialog">
          <header className="swapai-header">
            <span className="swapai-mark" aria-hidden="true">✦</span>
            <div>
              <strong>SwapAI</strong>
              <small>SWAPZONE GUIDE</small>
            </div>
            <button
              className="swapai-close"
              type="button"
              aria-label="Close SwapAI"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </header>
          <div className="swapai-messages" ref={messageListRef} aria-live="polite">
            {messages.map((message) => (
              <div className={`swapai-message ${message.role}`} key={message.id}>
                <p>{message.text}</p>
                {message.action && (
                  <button
                    type="button"
                    className="swapai-action"
                    onClick={() => {
                      onNavigate(message.action!.destination);
                      setOpen(false);
                    }}
                  >
                    {message.action.label} <span aria-hidden="true">→</span>
                  </button>
                )}
              </div>
            ))}
            {messages.length === 1 && (
              <div className="swapai-suggestions" aria-label="Suggested questions">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.label}
                    type="button"
                    onClick={() => submitQuestion(suggestion.question)}
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <form className="swapai-form" onSubmit={submitForm}>
            <input
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask SwapAI..."
              aria-label="Ask SwapAI a question"
            />
            <button type="submit" aria-label="Send question" disabled={!draft.trim()}>
              ↑
            </button>
          </form>
        </section>
      )}
      <button
        className={`swapai-launcher${open ? " is-open" : ""}`}
        type="button"
        aria-expanded={open}
        aria-controls="swapai-panel"
        aria-label={open ? "Close SwapAI" : "Open SwapAI help"}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="swapai-launcher-icon" aria-hidden="true">✦</span>
        <span>SwapAI</span>
      </button>
    </div>
  );
}
