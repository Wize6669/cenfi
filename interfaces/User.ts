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

export interface UserNewUpdate extends Pick<User, 'name' | 'lastName' | 'password' | 'email'> {
  id?: string
  roleId: number | null;
}

export interface UserStore extends Pick<User ,'id' | 'name' | 'lastName' | 'email' | 'roleId'> {}

export interface UserTableInterface extends Pick<User, 'id' | 'name' | 'lastName' | 'email' > {
  role: string
}

export interface UserModalUpdate extends Pick<User, 'name' | 'lastName' | 'email' > {
  role: string
}

export interface UserStudent extends Pick<User, 'name' | 'email' | 'password'> {
}
