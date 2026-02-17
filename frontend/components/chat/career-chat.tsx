'use client';

import { useState } from 'react';
import { RotateCcw, SendHorizontal } from 'lucide-react';
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
  const initialAssistantMessage: ChatMessage = {
    role: 'assistant',
    content: 'Ask me how to prioritize your next skills, projects, or role transitions.'
  };
  const [messages, setMessages] = useState<ChatMessage[]>([
    initialAssistantMessage
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

    const chatHistory = messages
      .filter((turn, index) => !(index === 0 && turn.role === 'assistant'))
      .slice(-8)
      .map((turn) => ({
        role: turn.role,
        content: turn.content
      }));

    try {
      const response = await apiClient.askChatAssistant({
        message: content,
        chatHistory,
        recommendationContext: recommendations.slice(0, 3).map((item) => ({
          title: item.title,
          suitabilityScore: item.suitabilityScore,
          skillGap: item.skillGap.slice(0, 5),
          recommendedSkillsToLearn: item.recommendedSkillsToLearn.slice(0, 5)
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

  const resetConversation = () => {
    setMessages([initialAssistantMessage]);
    setInput('');
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
          {isLoading ? (
            <div className="rounded-md bg-secondary/40 px-3 py-2 text-sm text-muted-foreground">Assistant is thinking...</div>
          ) : null}
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
          <Button variant="outline" className="gap-1" onClick={resetConversation} disabled={isLoading}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
