export interface User {
  id: string;
  name: string | null;
  email: string;
  role?: string;
};

export type UserID = {id: string}