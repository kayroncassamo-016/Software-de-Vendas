export interface User
{
    // id:string,
    // name:string,
    // email:string,
    // role:"admin"|"STAFF",
    // created_At?: string

   
    user:
    {
   
    id:string,
    name:string,
    email:string,
    role:"admin"|"STAFF",
    }
 
    
}

export interface LoginResponse
{ 
    token: string,
    user:
    {
    id:string,
    name:string,
    email:string,
    role:"admin"|"STAFF",
    }
}