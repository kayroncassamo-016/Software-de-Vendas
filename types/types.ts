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
  preco_venda_liquido_1: string;
  preco_venda_iliquido_1: string;
  categoria_id:number,
  familia_id:number,
  marca_id:number,
  imposto_id:number,
  motivo_isencao_id:number,
  
  categoria: Categoria,
  imposto: Imposto
  tipo_produto:Tipo,
  marca:Marca,
  familia:Familia
}

export interface Categoria
{
    id:number,
    descricao:string,
    designacao: string;
}

export interface Imposto
{

    id:number,
    codigo: string,
    taxa:string,
    designacao:string

}

export interface Familia
{
    id:number,
    codigo: string,
    designacao:string

}

export interface Marca
{
    id:number,
    codigo: string,
    nome:string
}

export interface Tipo
{
    id:number,
    codigo: string,
    designacao:string

}

export interface Motivo_Isencao
{
    id:number,
    codigo: string,
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