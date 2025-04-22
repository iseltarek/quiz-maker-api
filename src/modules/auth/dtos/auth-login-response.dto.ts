/* eslint-disable prettier/prettier */
import { Role } from 'src/utlis/enum/user-role.enum';

export class LoginResponse {
  verificationToken: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: Role;
  };
}
