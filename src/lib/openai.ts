import type { GenerateReplyParams } from '../types';
import { supabase } from './supabase';

export async function generateReply({ message, tone }: GenerateReplyParams): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-reply', {
      body: { message, tone },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(error.message);
    }

    if (!data || !data.reply) {
      throw new Error('Invalid response from generate-reply function');
    }

    return data.reply;
  } catch (error) {
    console.error('Error generating reply:', error);
    throw new Error('Failed to generate reply. Please try again.');
  }
}