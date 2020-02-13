export interface User {
  id: string;
  name: string;
  email: string;
  likes?: string[];
  permission?: number;
}

export interface UserSettings {
  theme: string;
  language: string;
}
