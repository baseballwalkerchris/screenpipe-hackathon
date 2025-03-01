import OpenAI from 'openai';

interface Settings {
  aiProviderType?: 'screenpipe-cloud' | 'openai';
  user?: {
    token?: string;
  };
  openaiApiKey?: string;
  aiUrl?: string;
}

export function createAiClient(settings: Settings) {
  return new OpenAI({
    apiKey: settings.aiProviderType === "screenpipe-cloud" 
      ? settings.user?.token 
      : settings.openaiApiKey,
    baseURL: settings.aiUrl,
    dangerouslyAllowBrowser: true,
  });
} 