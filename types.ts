
export interface GearConfig {
  id: string;
  name: string;
  teeth: number;
  radius: number;
  color: string;
  speedRatio: number; // Relative to the main second gear
  position: { x: number; y: number };
  label: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
