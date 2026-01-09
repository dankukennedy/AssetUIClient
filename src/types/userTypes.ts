// Auth User
export interface IUser {
   fullname: string;
   email: string;
   username: string;
   password: string;
   contact: string;
   userDepartment: string
   role: 'SUPER_ADMIN'|'ADMIN'|'MANAGER'|'USER'

}

