export interface User {
  id: string;
  name: string;
  email: string;
  likes?: string[];
  permission?: number;
  rates?: Rate[];
  bonuses?: UserBonuse[];
  donates?: Donate[];
  blocked?: boolean;
}

export interface UserSettings {
  theme: string;
  language: string;
}

export interface UserBonuse {
  idBonuse: string;
  idCompany: string;
  count: number;
}

export interface Donate {
  idCompany: string;
  count: number;
}

export interface Rate {
  company: string;
  rate: number;
}

export interface UserSettings {
  theme: string;
  language: string;
}
