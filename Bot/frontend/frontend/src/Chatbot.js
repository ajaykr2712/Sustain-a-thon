import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, MessageCircle } from "lucide-react";
import axios from "axios";

export default function Chatbot() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");
    
    try {
        const response = await axios.post("http://127.0.0.1:5000/chat", { query: input });
      const botMessage = { text: response.data.response, sender: "bot" };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error("Error fetching response", error);
    }
  };

  return (
    <div className="fixed bottom-5 right-5">
      {!chatOpen ? (
        <Button
          onClick={() => setChatOpen(true)}
          className="rounded-full p-3 shadow-lg bg-blue-600 hover:bg-blue-700"
        >
          <MessageCircle size={24} color="white" />
        </Button>
      ) : (
        <Card className="w-80 shadow-xl bg-white rounded-lg border border-gray-300">
          <CardContent className="p-4">
            <div className="h-60 overflow-y-auto border-b pb-2">
              {messages.map((msg, index) => (
                <div key={index} className={msg.sender === "user" ? "text-right" : "text-left"}>
                  <span className={`p-2 rounded-lg inline-block ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>{msg.text}</span>
                </div>
              ))}
            </div>
            <div className="flex mt-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about wildlife NGOs..."
              />
              <Button onClick={handleSendMessage} className="ml-2 bg-green-600 hover:bg-green-700">
                <Send size={20} color="white" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
