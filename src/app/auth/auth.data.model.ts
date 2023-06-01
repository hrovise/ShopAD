export enum Role {
  admin = 'ADMIN',
  user = 'USER'
}
export interface AuthData {

  role: string;
  email: string;
  name: string;
  nameCompany: string;
  city: string;
  contacts: number;
  password: string;
}
