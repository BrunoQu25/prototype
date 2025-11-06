import { useEffect, useRef, useState } from "react";
import { Send, X, ChevronDown, MessageSquare } from "lucide-react";

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const nextId = useRef(1);

  useEffect(() => {
    // scroll to bottom when messages change
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { id: nextId.current++, role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    // Mock IA response (replace with real API call later)
    const placeholder: Message = {
      id: nextId.current++,
      role: "assistant",
      text: "La IA está escribiendo...",
    };
    setMessages((m) => [...m, placeholder]);

    // simulate processing time
    setTimeout(() => {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === placeholder.id
            ? { ...msg, text: `Respuesta de la IA: ${text}` }
            : msg,
        ),
      );
      setLoading(false);
    }, 900);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-game-brown border-opacity-20 overflow-hidden shadow-md">
      <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-game-cream to-white">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-game-brown" />
          <div>
            <div className="font-bold text-game-brown">
              Responde tus dudas sobre las reglas
            </div>
            <div className="text-xs text-game-brown text-opacity-60">
              Haz una pregunta aquí
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => clearChat()}
            title="Limpiar conversación"
            aria-label="Limpiar conversación"
            className="px-3 py-1 rounded-md border border-game-brown border-opacity-10 text-sm text-game-brown hover:bg-game-brown hover:text-white transition"
          >
            📝
          </button>
          <button
            onClick={() => setIsOpen((s) => !s)}
            aria-expanded={isOpen}
            title={isOpen ? "Minimizar" : "Expandir"}
            className="p-2 rounded-md bg-transparent border border-game-brown border-opacity-0 hover:border-opacity-10 transition"
          >
            {isOpen ? (
              <X className="w-4 h-4 text-game-brown" />
            ) : (
              <ChevronDown className="w-4 h-4 text-game-brown" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="flex flex-col">
          <div
            ref={scrollRef}
            className="px-4 py-3 max-h-56 overflow-y-auto space-y-3 scrollbar-hide"
          >
            {messages.length === 0 && (
              <div className="text-sm text-game-brown text-opacity-60">
                Sin preguntas aún. Empieza preguntando algo.
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    m.role === "user"
                      ? "bg-game-cream text-game-brown"
                      : "bg-game-rust text-white"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-game-brown border-opacity-10 p-3 flex gap-2 items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Escribe tu pregunta para la IA..."
              className="flex-1 px-3 py-2 rounded-md border border-game-brown border-opacity-10 focus:outline-none text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={loading || input.trim().length === 0}
              className="px-3 py-2 rounded-md bg-game-rust text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Enviando..." : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
