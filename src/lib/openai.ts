import type { GenerateReplyParams } from '../types';

export async function generateReply({ message, tone }: GenerateReplyParams): Promise<string> {
  try {
    const res = await fetch('https://ubkxhzwdfmuhgiqvdacg.supabase.co/functions/v1/generate-reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, tone }),
    });

    const data = await res.json();

    if (!res.ok || !data.reply) {
      throw new Error(data.error || 'No reply received');
    }

    return data.reply;
  } catch (error) {
    console.error('Error generating reply:', error);
    throw new Error('Failed to generate reply. Please try again.');
  }
}
