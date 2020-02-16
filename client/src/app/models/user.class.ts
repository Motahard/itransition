export interface User {
  id: string;
  name: string;
  email: string;
  likes?: string[];
  permission?: number;
  rates?: Rate[];
}

export interface Rate {
  company: string;
  rate: number;
}

export interface UserSettings {
  theme: string;
  language: string;
}
