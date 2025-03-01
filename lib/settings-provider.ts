export interface Settings {
  aiProviderType: 'screenpipe-cloud' | 'openai';
  user?: {
    token?: string;
  };
  openaiApiKey?: string;
  aiUrl?: string;
  screenpipeAppSettings?: {
    enableRealtimeAudioTranscription?: boolean;
  };
} 