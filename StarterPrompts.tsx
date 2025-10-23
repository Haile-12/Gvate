/**
 * Starter prompts - ChatGPT-style centered welcome
 */

import { Card } from '../ui/card';
import { Sparkles } from 'lucide-react';

interface StarterPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const starterPrompts = [
  {
    title: 'Introduction to MeTTa',
    prompt: 'What is MeTTa and what makes it unique as a programming language?',
  },
  {
    title: 'Basic Syntax',
    prompt: 'Can you explain the basic syntax of MeTTa with some examples?',
  },
  {
    title: 'Pattern Matching',
    prompt: 'How does pattern matching work in MeTTa?',
  },
  {
    title: 'Function Definition',
    prompt: 'Show me how to define and use functions in MeTTa.',
  },
];

export function StarterPrompts({ onSelectPrompt }: StarterPromptsProps) {
  return (
    <div className="flex items-center justify-center min-h-full p-4 overflow-y-auto">
      <div className="max-w-3xl w-full space-y-8 py-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl">Welcome to MeTTa AI Assistant</h1>
          <p className="text-muted-foreground text-lg">
            Get help with MeTTa programming language - from basics to advanced concepts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {starterPrompts.map((item, index) => (
            <Card
              key={index}
              className="p-4 cursor-pointer hover:bg-accent/50 transition-all duration-200 group border-border/50 hover:border-border hover:shadow-sm"
              onClick={() => onSelectPrompt(item.prompt)}
            >
              <h3 className="mb-2 group-hover:text-primary transition-colors text-base">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.prompt}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
