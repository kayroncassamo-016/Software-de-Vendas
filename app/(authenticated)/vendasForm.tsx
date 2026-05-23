 import { Select } from '@/components/project/Select';
import { api } from '@/services/api';
import { Clientes, Fornecedores, Produtos } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cog, Grid2X2, Handshake, Package, ShoppingBag } from 'lucide-react-native';

import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  //SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
// Definir tipos
import { useRouter } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";

interface Item {
  id: number;
  produto_id:number;
  taxa:string,
  nome: string;
  quantidade: number;
  preco: number;
}


export default function VendasScreen() {

  const [clienteSelecionado, setClienteSelecionado] = useState<Clientes | null>(null);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<Fornecedores | null>(null);
  const [IdClienteSelecionado, setIdClienteSelecionado] = useState(0);
  const [IdFornecedorSelecionado, setIdFornecedorSelecionado] = useState(0);
  const [itens, setItens] = useState<Item[]>([]);
  const [nomeProduto, setNomeProduto] = useState('');
  const [selectedProduto, setSelectedProduto] = useState<Produtos|null>(null);
  const [IdSelectedProduto, setIdSelectedProduto] = useState(0);
  const [taxaSelectedProduto, setTaxaSelectedProduto] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [nrContribuinte, setNrContribuinte] = useState('');
  const [preco, setPreco] = useState('');
  const [searchText, setSearchText] = useState<string>('');
  const [searchTextProdutos, setSearchTextProdutos] = useState<string>('');
  const [searchTextFornecedores, setSearchTextFornecedores] = useState<string>('');
  const [filtrados, setFiltrados] = useState<Clientes[]>([]);
  const [clientes, setClientes] = useState<Clientes[]>([]);
  const [produtos, setProdutos] = useState<Produtos[]>([]);
  const [filtradosProdutos, setFiltradosProdutos] = useState<Produtos[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedores[]>([]);
  const [filtradosFornecedores, setFiltradosFornecedores] = useState<Fornecedores[]>([]);
  const [selectedTipoDocumento, setSelectedTipoDocumento] = useState('');
  const [selectedNomeDocumento, setSelectedNomeDocumento] = useState('');
  const [selectedCondicaoPagamento, setSelectedCondicaoPagamento] = useState('');
  const [selectedMetodoPagamento, setSelectedMetodoPagamento] = useState('');
  const [loadingGuardarRascunho, setLoadingGuardarRascunho] = useState(false)
  const [activeNav, setActiveNav] = useState(0);
  const router = useRouter()

  // const TipoDocumento = ['Factura','Nota de devolução',
  //   'Guia de transporte','Recibo','Orçamento']

  const TipoDocumento = ['VD','NE',]
  const nomeDocumento =['Venda a dinheiro', 'Nota de entrada']

  const condicoesPagamento =['Pronto pagamento','Pagamento em 15 dias'
    ,'Pagamento em 30 dias'
  ]
  const metodoPagamento =['Numerário','Transferência móvel','POS', 'Depósito'
  ]

  useEffect(()=> {
    async function loadData()
    {
       await loadClientes ()
       await loadProducts()
       await loadFornecedores()
    }
    loadData()
  },[])

  useEffect(()=>{

    if (selectedProduto)
    {
        setIdSelectedProduto(selectedProduto.id)
        setTaxaSelectedProduto(selectedProduto.imposto.taxa)
    }
    else
    {
        setIdSelectedProduto(0)
    }

    if (clienteSelecionado)
    {
        setIdClienteSelecionado(clienteSelecionado.id)
    }

  },[selectedProduto,clienteSelecionado])


   useEffect(()=>{

    if (fornecedorSelecionado)
    {
        setIdFornecedorSelecionado(fornecedorSelecionado.id)
        
    }
    else
    {
        setIdSelectedProduto(0)
    }

   

  },[fornecedorSelecionado])


  useEffect(() => {

    if (selectedTipoDocumento === 'NE')
    {
      setSelectedNomeDocumento (nomeDocumento[1])
    }
    else if (selectedTipoDocumento === 'VD')
    {  
      setSelectedNomeDocumento (nomeDocumento[0])
    }

    else
    {
      setSelectedNomeDocumento ('')
    }

  },[selectedTipoDocumento])

  const NAV_ITEMS = [
  { icon: ShoppingBag , label: 'Vendas' },
    {icon:Handshake,label:'Clientes'},
    { icon: Grid2X2, label: 'Painel' },
    { icon: Package, label: 'Produtos' },
    { icon: Cog, label: 'Config.' },
];


  function navigatePage(pageIndex:number)
  {
      setActiveNav(pageIndex)
      
      if (pageIndex === 2) {
          router.push("/(authenticated)/dashboard")
        }

       
      if (pageIndex === 4) {
          router.push("/(authenticated)/settings")
        }
      
      if (pageIndex === 1) 
      {
          router.push("/(authenticated)/clientes")
      }

      
      if (pageIndex === 3) 
      {
          router.push("/(authenticated)/produtos")
      }
  }

async function loadFornecedores()
  {
    const token  = await AsyncStorage.getItem("@token")

      try {
      
            const response = await api.get("/fornecedor",
               {
                   headers: { Authorization: `Bearer ${token}` },
               }   
            )
            const fornecedoresAPI = response.data.data; // 

             
            setFornecedores(response.data.data)
            setFiltradosFornecedores(response.data.data)
             //console.log("clientes da base: ", response.data.data.data)

             console.log(JSON.stringify(fornecedoresAPI, null, 2));
        }

        catch(err:any)
        {
            console.log(err.response)
        }

        finally
        {
           
        }
    }

   
  async function loadClientes()
  {
    const token  = await AsyncStorage.getItem("@token")

      try {
      
            const response = await api.get("/clientes",
               {
               headers: { Authorization: `Bearer ${token}` },
            }   
            )
            const clientesAPI = response.data.data; // 

             
            setClientes(response.data.data)
            setFiltrados(response.data.data)
             //console.log("clientes da base: ", response.data.data.data)

             console.log(JSON.stringify(clientesAPI, null, 2));
        }

        catch(err:any)
        {
            console.log(err.response)
        }

        finally
        {
           
        }
    }

    async function loadProducts()
    {
       const token  = await AsyncStorage.getItem("@token")

       try {
      
            const response = await api.get("/produtos",
               {
               headers: { Authorization: `Bearer ${token}` },
               }   
            )

            setProdutos(response.data.data)
            setFiltradosProdutos(response.data.data)
             //console.log("clientes da base: ", response.data.data.data)

        }

        catch(err:any)
        {
            console.log(err.response)
        }

        finally
        {
           
        }
    }

    async function handleGuardarRascunho()
    {
      const token  = await AsyncStorage.getItem("@token")

      if (selectedNomeDocumento ===nomeDocumento[1] 
            || selectedTipoDocumento === 'NE' )
      {

         try
         {
          const payload =
          {
            tipo_doc: selectedTipoDocumento,
            nome_doc: selectedNomeDocumento,
            ano_serie: new Date().getFullYear().toString(),
            // contribuinte: nrContribuinte,

            fornecedor_id: IdFornecedorSelecionado,
            // nome_fornecedor: fornecedorSelecionado?.nome,
            condicao_pagamento:selectedCondicaoPagamento??'',
          // estado:'RASCUNHO',
         


         linhas: itens.map(item => ({
            produto_id: item.produto_id,
            qtd: item.quantidade,
            taxa_iva:item.taxa,
            pr_unit_sem_iva: item.preco
          })),

        
        }
         setLoadingGuardarRascunho(true)
           await api.post('/documentos',
            payload, {
               headers: { Authorization: `Bearer ${token}` },
           } 
         )

        
       Alert.alert(
      'Factura criada em rascunho',
      `Fornecedor: ${fornecedorSelecionado?.nome}\nTotal: ${total.toFixed(2)} MT`,
        [
        { text: 'OK', style: 'cancel' },
        { text: 'GERAR PDF', onPress: () => console.log('Enviando PDF...') },
        ]
        );
      }
      catch (err: any)
      {
         console.log('erro ao guardar rascunho: ', err.response)
      }

      finally
      {
           setLoadingGuardarRascunho(false)
      }
    }
    
    else 
    {
         try
         {
          const payload =
          {
            tipo_doc: selectedTipoDocumento,
            nome_doc: selectedNomeDocumento,
            ano_serie: new Date().getFullYear().toString(),
            //contribuinte: nrContribuinte,
            cliente_id: IdClienteSelecionado,


         linhas: itens.map(item => ({
            produto_id: item.produto_id,
            qtd: item.quantidade,
            taxa_iva:item.taxa,
            pr_unit_sem_iva: item.preco
          })),
          pagamento:selectedMetodoPagamento,

          pagamentos:[
          {
            metodo: selectedMetodoPagamento,
            valor:total,
            banco_servico:'',
            nr_movimento:''
          }]

        }
         setLoadingGuardarRascunho(true)
           await api.post('/documentos',
            payload, {
               headers: { Authorization: `Bearer ${token}` },
           } 
         )

        
       Alert.alert(
      'Factura criada em rascunho',
      `Cliente: ${clienteSelecionado?.nome}\nTotal: ${total.toFixed(2)} MT`,
        [
        { text: 'OK', style: 'cancel' },
        { text: 'GERAR PDF', onPress: () => console.log('Enviando PDF...') },
        ]
        );
      }
      catch (err: any)
      {
         console.log('erro ao guardar rascunho: ', err.response)
      }

      finally
      {
           setLoadingGuardarRascunho(false)
      }
    }
    


      
    }




  // Adicionar item à venda
  const adicionarItem = () => {
    if (!nomeProduto || !preco) {
      Alert.alert('Erro', 'Preenche o nome e preço do produto');
      return;
    }

    const novoItem: Item = {
      id: Date.now(),
      produto_id: IdSelectedProduto,
      taxa:taxaSelectedProduto,
      nome: nomeProduto,
      quantidade: parseInt(quantidade) || 1,
      preco: parseFloat(preco),
    };

    setItens([...itens, novoItem]);
    setNomeProduto('');
    setQuantidade(quantidade);
    setPreco('');
  };

  // Remover item
  const removerItem = (id: number) => {
    setItens(itens.filter(item => item.id !== id));
  };

  // Calcular totais
  const calcularTotais = () => {
    const subtotal = itens.reduce((acc, item) => acc + (item.quantidade * item.preco), 0);
    const iva = itens.reduce(
        (acc, item) => acc + ((item.quantidade * item.preco) * parseFloat(item.taxa) / 100),
        0
      );

    const total = subtotal + iva

    return { subtotal,iva, total };
  };

  const { subtotal,iva, total } = calcularTotais();

  // Confirmar venda
  async function confirmarVenda ()
  {
    const token  = await AsyncStorage.getItem("@token")


    if (!clienteSelecionado) {
      Alert.alert('Erro', 'Selecciona um cliente');
      return;
    }

    if (itens.length === 0) {
      Alert.alert('Erro', 'Adiciona pelo menos um item');
      return;
    }

     try 
     {
        await api.post('/documentos', 
          {
             headers: { Authorization: `Bearer ${token}` },
          }   
        )
     }
     catch (err:any)
     {

     }

     finally 
     {

     }


    Alert.alert(
      'Factura criada',
      `Cliente: ${clienteSelecionado.nome}\nTotal: ${total.toFixed(2)} MT`,
       [
        { text: 'Fechar', style: 'cancel' },
        { text: 'Enviar PDF', onPress: () => console.log('Enviando PDF...') },
       ]
    );
  };

    const handleSearch = (text: string): void => {
    setSearchText(text);
    if (text === '') {
      setFiltrados(clientes)
    } else {
      const filtered = clientes.filter(
        (c) =>
          c.nome.toLowerCase().includes(text.toLowerCase()) 
      );
      setFiltrados(filtered);
    }
  };

    const handleSearchProdutos = (text: string): void => {
    setSearchTextProdutos(text);
    if (text === '') {
      setFiltradosProdutos(produtos)
    } else {
      const filtered = produtos.filter(
        (p) =>
          p.designacao.toLowerCase().includes(text.toLowerCase()) 
      );
      setFiltradosProdutos(filtered);
    }
  };

   const handleSearchFornecedores = (text: string): void => {
    setSearchTextFornecedores(text);
    if (text === '') {
      setFiltradosFornecedores(fornecedores)
    } else {
      const filtered = fornecedores.filter(
        (f) =>
          f.nome.toLowerCase().includes(text.toLowerCase()) 
      );
      setFiltradosFornecedores(filtered);
    }
  };



  // Renderizar item da lista
  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemRow}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemNome}>{item.nome}</Text>
        <Text style={styles.itemDetalhes}>
          {item.quantidade} × {item.preco.toFixed(2)}  MT
        </Text>
        <Text style={[styles.itemDetalhes,{paddingTop:10}]}>
           IVA {parseFloat(item.taxa).toFixed(0)} %
        </Text>
      </View>
      <View style={styles.itemRight}>
        <Text style={styles.itemTotal}>{(item.quantidade * item.preco).toFixed(2)} MT</Text>
        <TouchableOpacity
          onPress={() => removerItem(item.id)}
          style={styles.btnRemover}
        >
          <Text style={styles.btnRemoverText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#185FA5" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nova Factura</Text>
        <Text style={styles.headerSubtitle}>Criar venda</Text>
      </View>

      <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

           <View style={{gap:10}}>
              <Text style={styles.dialogTextStyle}>Tipo de documento:</Text>
                  <Select
                    label=""
                    placeholder="Selecione o tipo de documento"
                    options ={TipoDocumento.map(tipo => ({
                      label: tipo,
                      value: tipo
                    }))}
                    selectedValue={selectedTipoDocumento}
                    onValueChange={setSelectedTipoDocumento}
                  />
            </View>

            <View style={{gap:10,marginBottom:15}}>
              <Text style={styles.dialogTextStyle}>Nome do documento:</Text>
              <TextInput
                    style={styles.input}
                    placeholder=""
                    value={selectedNomeDocumento}
                    editable={false}
                    keyboardType="numeric"  />

            </View>

             {/* <Text style={[styles.dialogTextStyle,
              {
                marginBottom:10
              }
             ]}>Nº de contribuinte: </Text>
             <TextInput
              style={styles.input}
              placeholder="ex: 1234xx, 5678xx, etc"
              value={nrContribuinte}
              onChangeText={setNrContribuinte}
              keyboardType="numeric"  /> */}

              <View style={{gap:10, marginTop:20}}>
                  <Text style={styles.dialogTextStyle}>Condição de pagamento:</Text>
                  <Select
                    label=""
                    placeholder="Selecione a condição de pagamento"
                    options ={condicoesPagamento.map(condicao => ({
                      label: condicao,
                      value: condicao
                    }))}
                    selectedValue={selectedCondicaoPagamento}
                    onValueChange={setSelectedCondicaoPagamento}
                  />
              </View>
             
             <TextInput
               multiline
               placeholder="Observações ..."
               style={{
                fontStyle:'italic',
                borderWidth: 1,
                borderRadius:8,
                borderColor: '#ccc',
                padding: 10,
                height: 100,
                textAlignVertical: 'top'
              }} /> 
        

          { selectedNomeDocumento ===nomeDocumento[1] 
            || selectedTipoDocumento === 'NE' ?
            (
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <Text style={[styles.sectionTitle,{
                  paddingTop:10,
                  
              }]}>
                Fornecedores recentes
              </Text>
             <View style={styles.searchContainer}>
               <TextInput
                 style={styles.searchInput}
                 placeholder="🔍 Pesquisar fornecedor..."
                 placeholderTextColor="#AEAEB2"
                 value={searchTextFornecedores}
                 onChangeText={handleSearchFornecedores}  />
             </View>
         </View>
            )
            :
            (
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <Text style={[styles.sectionTitle,{
                  paddingTop:10,
                  
              }]}>
                Clientes recentes
              </Text>
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="🔍 Pesquisar cliente..."
                  placeholderTextColor="#AEAEB2"
                  value={searchText}
                  onChangeText={handleSearch}  />
              </View>
         </View>
            )
          }
        

         { selectedNomeDocumento ===nomeDocumento[1] 
         || selectedTipoDocumento === 'NE' ?

         (
            fornecedorSelecionado ? (
            <View style={styles.clienteSelecionado}>
              <View>
                <Text style={styles.clienteNome}>{fornecedorSelecionado.nome}</Text>
                <Text style={styles.clienteNuit}>Email: {fornecedorSelecionado.email}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setFornecedorSelecionado(null)}
                style={styles.btnMudar}
              >
                <Text style={styles.btnMudarText}>Mudar</Text>
              </TouchableOpacity>
            </View>
        ) : (
          <FlatList
            data={filtradosFornecedores.slice(0,4)}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.clienteItem}
                onPress={() => setFornecedorSelecionado(item)}
              >
                <View>
                  <Text style={styles.clienteItemNome}>{item.nome}</Text>
                  <Text style={styles.clienteItemNuit}>Nuit: {item.nuit}</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            )}
          />
        )

         ) 
         :
         (
            clienteSelecionado ? (
          <View style={styles.clienteSelecionado}>
            <View>
              <Text style={styles.clienteNome}>{clienteSelecionado.nome}</Text>
              <Text style={styles.clienteNuit}>Email: {clienteSelecionado.email}</Text>
            </View>
            <TouchableOpacity
              onPress={() => setClienteSelecionado(null)}
              style={styles.btnMudar}>
          
              <Text style={styles.btnMudarText}>Mudar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filtrados.slice(0,4)}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.clienteItem}
                onPress={() => setClienteSelecionado(item)}
              >
                <View>
                  <Text style={styles.clienteItemNome}>{item.nome}</Text>
                  <Text style={styles.clienteItemNuit}>Email: {item.email}</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            )}
          />
        )

         )
         }

        {/* ADICIONAR ITENS */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Itens da Factura</Text>

        <View style={styles.card}>
          <Text style={styles.inputLabel}>Nome do Produto / Serviço</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Consultoria em TI"
            value={nomeProduto}
            onChangeText={setNomeProduto}
          />

          <Text style={styles.inputLabel}>Quantidade</Text>
          <TextInput
            style={styles.input}
            placeholder="1"
            value={quantidade}
            onChangeText={setQuantidade}
            keyboardType="numeric"
          />

          <Text style={styles.inputLabel}>Preço Unitário (MT)</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={preco}
            onChangeText={setPreco}
            keyboardType="decimal-pad"
          />

          <TouchableOpacity
            style={styles.btnAdicionar}
            onPress={adicionarItem}
          >
            <Text style={styles.btnAdicionarText}>+ Adicionar Item</Text>
          </TouchableOpacity>
        </View>

        {/* PRODUTOS SUGERIDOS */}
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <Text style={[styles.subLabel,{paddingTop:10}]}>Produtos recentes:</Text>
            <View style={styles.searchContainer}>
               <TextInput
                 style={styles.searchInput}
                 placeholder="🔍 Pesquisar produto..."
                 placeholderTextColor="#AEAEB2"
                 value={searchTextProdutos}
                 onChangeText={handleSearchProdutos}  />
            </View>
        </View>
        <View style={styles.produtosRapidos}>
          {filtradosProdutos.slice(0, 4).map((prod) => (
            <TouchableOpacity
              key={prod.id}
              style={styles.produtoRapido}
              onPress={() => {
                setNomeProduto(prod.designacao);
                setSelectedProduto(prod)
                setPreco(parseFloat(prod.preco_venda_iliquido_1).toFixed(2).toString());
              }}
            >
              <Text style={styles.produtoRapidoText}>{prod.designacao}</Text>
            </TouchableOpacity>
          ))}
        </View>
           {(selectedNomeDocumento !==nomeDocumento[1] 
                    || selectedTipoDocumento !== TipoDocumento[1]) && 

                  <View>
                    <View style={{gap:10,marginTop:20}}>
                      <Text style={styles.dialogTextStyle}>Método de pagamento:</Text>
                          <Select
                            label=""
                            placeholder="Selecione o método de pagamento"
                            options ={metodoPagamento.map(metodo => ({
                              label: metodo ,
                              value: metodo 
                            }))}
                            selectedValue={selectedMetodoPagamento}
                            onValueChange={setSelectedMetodoPagamento}
                          />
                  </View>
        
        
                  <View style={styles.card}>
                
                   
                    <Text style={styles.inputLabel}>Método: </Text>
                    <TextInput
                      style={styles.inputUnEditable}
                      value={selectedMetodoPagamento}
                      editable={false}
                      keyboardType="numeric"
                    />
        
                    <Text style={styles.inputLabel}>Banco / Serviço: </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Banco"
                      
                    />
                     <Text style={styles.inputLabel}>Nº de movimento: </Text>
                     <TextInput
                      style={styles.input}
                      placeholder="ex: 1234xx, 5678xx, etc"
                      keyboardType="decimal-pad"
                    />
                    </View>
                </View>}


        {/* LISTA DE ITENS */}
        {itens.length > 0 && (
          <View>
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Itens Adicionados</Text>
            <FlatList
              data={itens}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              renderItem={renderItem}
            />
          </View>
        )}

        {/* TOTAIS */}
        <View style={styles.totaisCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{subtotal.toFixed(2)} MT</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>IVA total:</Text>
            <Text style={styles.totalValue}>{iva.toFixed(2)} MT</Text>
          </View>

          <View style={[styles.totalRow, styles.totalFinal]}>
            <Text style={styles.totalLabelFinal}>Total:</Text>
            <Text style={styles.totalValueFinal}>{total.toFixed(2)} MT</Text>
          </View>
        </View>

        {/* BOTÕES DE ACÇÃO */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.btnSecundario,

          loadingGuardarRascunho?
          (
            {backgroundColor:'#cecece'}
          ) : ( 
            {backgroundColor:'#fff'}
          )           
              
          ]}
          onPress={()=> handleGuardarRascunho()}>
            {
                 loadingGuardarRascunho?
                 (   
                 <Text style={styles.btnSecundarioText}>
                  Guardando Rascunho...
                 </Text>
                )
                 :
                 (   
                 <Text style={styles.btnSecundarioText}>
                    Guardar Rascunho
                  </Text>
                 )
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnPrimario}
            onPress={confirmarVenda}>
          
            <Text style={styles.btnPrimarioText}>Confirmar Factura</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
      </KeyboardAvoidingView>

       {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
              {NAV_ITEMS.map((nav, i) => 
              {
                const Icon = nav.icon
              return (
                
                <TouchableOpacity
                  key={i}
                  style={styles.navItem}
                  onPress={() => {
                    navigatePage(i)
                    
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.navIcon, i === 0 && styles.navIconActive]}>
                    <Icon color={'#5c5b5b'}/>
                  </Text>
                  <Text style={[styles.navLabel, i ===0 && styles.navLabelActive]}>
                    {nav.label}
                  </Text>
                  {i === 0 && <View style={styles.navDot} />}
                </TouchableOpacity>
              )})}
            </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   // backgroundColor: '#185FA5',
      backgroundColor: '#e4e4e4',
  },
   dialogTextStyle:
  {
     paddingRight:10,
     fontWeight:'bold',
     color:'#8E8E93'
  },
  header: {
    backgroundColor: '#185FA5',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    marginHorizontal:10,
    borderRadius:10
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    padding: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 12,
    marginBottom: 10,
    marginLeft: 4,
  },
  subLabel: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 10,
    marginLeft: 4,
    marginBottom: 8,
  },

  // Cliente
  clienteSelecionado: {
    backgroundColor: '#EAF3DE',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  clienteNome: {
    fontSize: 15,
    fontWeight: '500',
    color: '#3B6D11',
    marginBottom: 2,
  },
  clienteNuit: {
    fontSize: 12,
    color: '#3B6D11',
    opacity: 0.7,
  },
  btnMudar: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#3B6D11',
    borderRadius: 8,
  },
  btnMudarText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  clienteItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clienteItemNome: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  clienteItemNuit: {
    fontSize: 11,
    color: '#8E8E93',
  },
  arrow: {
    fontSize: 18,
    color: '#8E8E93',
  },

  // Formulário de itens
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    padding: 14,
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1C1C1E',
  },
   inputUnEditable: {
    backgroundColor: '#8a8a8a',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1C1C1E',
  },
  btnAdicionar: {
    backgroundColor: '#185FA5',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 14,
    alignItems: 'center',
  },
  btnAdicionarText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },

  // Produtos rápidos
  produtosRapidos: {
    gap: 8,
  },
  produtoRapido: {
    backgroundColor: '#E6F1FB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  produtoRapidoText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#185FA5',
  },

  // Itens adicionados
  itemRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemNome: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 3,
  },
  itemDetalhes: {
    fontSize: 11,
    color: '#8E8E93',
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  itemTotal: {
    fontSize: 13,
    fontWeight: '500',
    color: '#185FA5',
  },
  btnRemover: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FCEBEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnRemoverText: {
    fontSize: 14,
    color: '#E24B4A',
  },

  // Totais
  totaisCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    padding: 14,
    marginTop: 16,
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  totalLabel: {
    fontSize: 13,
    color: '#8E8E93',
  },
  totalValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  totalFinal: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  totalLabelFinal: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  totalValueFinal: {
    fontSize: 18,
    fontWeight: '600',
    color: '#185FA5',
  },

  // Botões de acção
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btnSecundario: {
    flex: 1,
    //backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#185FA5',
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnSecundarioText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#185FA5',
  },
  btnPrimario: {
    flex: 1,
    backgroundColor: '#185FA5',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnPrimarioText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
   searchContainer: {
    backgroundColor: '#F2F2F7',
    //paddingHorizontal: 14,
    paddingLeft:12,
    paddingTop: 12,
    paddingBottom: 10,
    flex:1,
    
  },
  searchInput: {

    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13,
    color: '#1C1C1E',
    marginTop: 10,
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  navIcon: {
    fontSize: 18,
    color: '#8E8E93',
  },
  navIconActive: {
    color: '#185FA5',
  },
  navLabel: {
    fontSize: 10,
    color: '#8E8E93',
  },
  navLabelActive: {
    color: '#185FA5',
    fontWeight: '500',
  },
  navDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#185FA5',
    marginTop: 1,
  },
   bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
    paddingTop: 8,
    paddingBottom: 20,
  },

});