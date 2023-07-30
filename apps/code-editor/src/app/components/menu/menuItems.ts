import { User } from 'firebase/auth';

export const menuItems: { text: string; user?: User }[] = [
  { text: 'Home' },
  { text: 'About' },
  { text: 'Sign In' },
];
