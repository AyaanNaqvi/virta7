export type FontSize = 'small' | 'medium' | 'large' | 'x-large';

export interface AccessibilitySettings {
  fontSize: FontSize;
  highContrast: boolean;
  reduceMotion: boolean;
}

export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'virta';
  text: string;
  createdAt: string; // ISO timestamp
}
