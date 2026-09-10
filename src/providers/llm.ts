import type { Env } from '../types';

export class GeminiProvider {
    private apiKey: string;
    private fallbackKey?: string;

    constructor(env: Env) {
        this.apiKey = env.GEMINI_API_KEY;
        this.fallbackKey = env.OPENROUTER_KEY;
    }

    async generateContent(prompt: string): Promise<string> {
        try {
            return await this.callGemini(prompt);
        } catch (error: any) {
            console.error('Gemini failed:', error.message);
            
            if (this.fallbackKey) {
                try {
                    return await this.callOpenRouter(prompt);
                } catch (fallbackError: any) {
                    console.error('OpenRouter fallback failed:', fallbackError.message);
                    throw new Error(`LLM generation failed: ${error.message}; fallback: ${fallbackError.message}`);
                }
            }
            throw error;
        }
    }

    private async callGemini(prompt: string): Promise<string> {
        if (!this.apiKey) {
            throw new Error('GEMINI_API_KEY not configured');
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 4096
                    }
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
            throw new Error('Gemini returned no valid response');
        }

        return data.candidates[0].content.parts[0].text;
    }

    private async callOpenRouter(prompt: string): Promise<string> {
        if (!this.fallbackKey) {
            throw new Error('OPENROUTER_KEY not configured');
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.fallbackKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-3-8b-instruct',
                messages: [
                    { role: 'user', content: prompt }
                ],
                max_tokens: 4096
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0]?.message?.content) {
            throw new Error('OpenRouter returned no valid response');
        }

        return data.choices[0].message.content;
    }
}
