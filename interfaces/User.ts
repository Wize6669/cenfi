export interface User {
    id: string;
    name: string;
    lastName: string;
    email: string;
    password?: string;
    roleId: number,
    roleName?: string;
}

export interface UserSingIn extends Pick<User, 'email' | 'password'> {
  roleId: number | null;
}

export interface UserStore extends Pick<User ,'id' | 'name' | 'lastName' | 'email' | 'roleId'> {}

