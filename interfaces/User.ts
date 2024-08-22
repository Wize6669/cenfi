export interface User {
    name: string;
    lastName: string;
    email: string;
    password?: string;
    roleId: number,
    roleName?: string;
}

export interface UserSingIn extends Pick<User ,'email' | 'password' | 'roleId'> {};

