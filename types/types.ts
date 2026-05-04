export interface User
{  
    user:
    {  
    id:string,
    name:string,
    email:string,
    role:"admin"|"STAFF",
    }
 
    
}
export interface Produtos
{
  id: number;
  codigo:string,
  designacao: string;
  preco_venda: string;
  categoria: {
    categoria_id:number,
    descricao:string,
    designacao: string;
  } | null;
//   imposto: {
//     imposto_id:number,
//     taxa: string;
//   } | null;

  imposto: Imposto
}

export interface Imposto
{

    imposto_id:number,
    codigo: string,
    taxa:string,
    designacao:string

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