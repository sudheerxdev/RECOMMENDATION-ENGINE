'use client';

import { useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api';
import type { RecommendationItem } from '@/lib/types';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface CareerChatProps {
  recommendations: RecommendationItem[];
}

export const CareerChat = ({ recommendations }: CareerChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Ask me how to prioritize your next skills, projects, or role transitions.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submitMessage = async () => {
    const content = input.trim();
    if (!content) {
      return;
    }

    setMessages((prev) => [...prev, { role: 'user', content }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await apiClient.askChatAssistant({
        message: content,
        recommendationContext: recommendations.slice(0, 3).map((item) => ({
          title: item.title,
          suitabilityScore: item.suitabilityScore
        }))
      });

      setMessages((prev) => [...prev, { role: 'assistant', content: response.reply }]);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to get assistant reply';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Career Assistant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-80 space-y-2 overflow-y-auto rounded-md border border-border bg-white/70 p-3">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`rounded-md px-3 py-2 text-sm ${
                message.role === 'assistant' ? 'bg-secondary/50 text-foreground' : 'bg-primary text-primary-foreground'
              }`}
            >
              {message.content}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="What should I learn first for my top role?"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                submitMessage();
              }
            }}
            disabled={isLoading}
          />
          <Button className="gap-1" onClick={submitMessage} disabled={isLoading}>
            <SendHorizontal className="h-4 w-4" />
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
