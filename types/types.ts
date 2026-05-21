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

export interface Clientes
{
    id: number,
    numero:number,
    nome:string,
    data_nascimento:string,
    email: string,
    tipo: string,
    sexo:string,
    endereco?:Endereco,
    financeiro?: Financeiro
}

export interface Endereco
{
  id:number,
  morada: string,
  provincia:string,
  cod_postal:string
}

export interface Financeiro
{
    id:number,
    forma_pagamento:string,
    limite_credito:string,
    desconto_comercial:string,
    data_vencimento:string
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
    nome:string,
    desconto_comercial:string,
    data_vencimento:string,
    limite_credito:string
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

export interface Vendas
{
    id: number,
    valor_pago: string,
    contribuinte: string,
    nome_doc: string,
     tipo_doc:string,
    ano_serie: string,
    estado: string,
    total_doc: string
    // produtos:Produtos,
    cliente_id?: number,
    fornecedor_id?:number
    nome_fornecedor?:string,
    condicao_pagamento?: string,
    produto_id: number,
    qtd: number,
    taxa_iva:string,
    pr_unit_sem_iva: string,
    //  metodo?: string,
    //  valor:string,
    //  banco_servico?:string,
    //  nr_movimento?:number,

    pagamentos:pagamento[]

     linhas:linha [],
}

export interface pagamento
{
    metodo?: string,
     valor:string,
     banco_servico?:string,
     nr_movimento?:number,
}

export interface linha 
{
    id:number,
    produto_id: number,
    qtd: number,
    taxa_iva:string,
    pr_unit_sem_iva: string,

}

export interface Fornecedores
{
    id:number,
    codigo:string,
    nome:string,
    email:string,
    telefone:string,
    morada:string,
    nuit:string,
    cidade:string


}


