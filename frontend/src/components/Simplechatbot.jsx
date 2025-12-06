import React, { useState, useRef } from "react";

const qaData = [
  { q: "hi", a: "Hello! How can I help you?" },
  { q: "hello", a: "Hi! What's up? 😊" },
  { q: "bye", a: "Bye! Have a nice day!" },
  { q: "what is your name", a: "I'm your simple Q&A bot 🤖" }
];

// normalize text for matching
const normalize = (s) => s.trim().toLowerCase();

function findAnswer(input) {
  const t = normalize(input);

  // exact match
  for (const item of qaData) {
    if (normalize(item.q) === t) return item.a;
  }

  // contains match
  for (const item of qaData) {
    if (t.includes(normalize(item.q)) || normalize(item.q).includes(t)) {
      return item.a;
    }
  }

  return "Sorry, I don't know the answer 😅";
}

export default function SimpleChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const boxRef = useRef(null);

  const send = () => {
    if (!input.trim()) return;

    // user message
    setMessages((m) => [...m, { who: "user", text: input }]);

    // bot message
    const reply = findAnswer(input);
    setTimeout(() => {
      setMessages((m) => [...m, { who: "bot", text: reply }]);
      boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight });
    }, 200);

    setInput("");
  };

  return (
    <div
      style={{
        width: 350,
        borderRadius: 10,
        background: "white",
        boxShadow: "0 0 10px #ccc",
        overflow: "hidden",
      }}
    >
      <div
        ref={boxRef}
        style={{ height: 320, overflowY: "auto", padding: 15 }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              margin: "10px 0",
              display: "flex",
              justifyContent: msg.who === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: msg.who === "user" ? "#d1e7ff" : "#e7e7e7",
                maxWidth: "70%",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, padding: 10 }}>
        <input
          style={{ flex: 1, padding: 8 }}
          placeholder="Type your question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
