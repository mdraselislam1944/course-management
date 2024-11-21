export type PasswordChange = {
    password: string;
    timestamp: Date;
  };
  

export type tUserInformation={
    username: string;
    password: string;
    email: string;
    role: 'user' | 'admin';
    passwordChangeHistory: PasswordChange[];
}