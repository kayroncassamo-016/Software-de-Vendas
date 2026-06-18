import { Select } from '@/components/project/Select';
import { colors } from '@/constants/theme';
import { api } from '@/services/api';
import { Clientes, Fornecedores, Produtos } from '@/types/types';
import { isOnline } from '@/utils/network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Cog, Grid2X2, Handshake, Package, ShoppingBag } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { ClienteRepository } from '../database/ClienteRepository';
import { FornecedoresRepository } from '../database/FornecedoresRepository';
import { ProdutoRepository } from '../database/ProdutoRepository';
import { VendaRepository } from '../database/VendaRepository';

interface Item {
  id: number;
  produto_id: number;
  taxa: string;
  nome: string;
  quantidade: number;
  preco: number;
  desconto: number; // Adicionado campo desconto
}

interface DocumentPayload {
  tipo_doc: string;
  nome_doc: string;
  ano_serie: string;
  data_documento: string;
  observacoes: string;
  condicao_pagamento: string;
  linhas: Array<{
    produto_id: number;
    qtd: number;
    taxa_iva: number;
    pr_unit_sem_iva: number;
    taxa_desconto: number;
  }>;
  // Para NE
  fornecedor_id?: number;
  nome_fornecedor?: string;
  nuit?: string;
  // Para VD
  cliente_id?: number;
  nome_cliente?: string;
  morada_cliente?: string;
  pagamento?: string;
  pagamentos?: Array<{
    metodo: string;
    valor: number;
    banco_servico: string;
    nr_movimento: string;
  }>;
}


// Mapeamento de tipos de documento
const DOCUMENT_TYPES = {
  VD: { label: 'Venda a Dinheiro'},
  FT: { label: 'Factura' },
  NE: { label: 'Nota de Entrada'},
  ND: { label: 'Nota de Devolução'},
  GT: { label: 'Guia de Transporte'},
};

export default function VendasScreen() {
  const [clienteSelecionado, setClienteSelecionado] = useState<Clientes | null>(null);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<Fornecedores | null>(null);
  const [IdClienteSelecionado, setIdClienteSelecionado] = useState(0);
  const [IdFornecedorSelecionado, setIdFornecedorSelecionado] = useState(0);
  const [itens, setItens] = useState<Item[]>([]);
  const [nomeProduto, setNomeProduto] = useState('');
  const [selectedProduto, setSelectedProduto] = useState<Produtos | null>(null);
  const [IdSelectedProduto, setIdSelectedProduto] = useState(0);
  const [taxaSelectedProduto, setTaxaSelectedProduto] = useState('');
  const [loadingConfirmar, setLoadingConfirmar] = useState(false);
  const [quantidade, setQuantidade] = useState('');
  const [nrContribuinte, setNrContribuinte] = useState('');
  const [preco, setPreco] = useState('');
  const [descontoItem, setDescontoItem] = useState('0'); // Novo estado para desconto
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
  const [observacoes, setObservacoes] = useState(''); // Novo estado para observações
  const [loadingGuardarRascunho, setLoadingGuardarRascunho] = useState(false);
  const [activeNav, setActiveNav] = useState(0);
  const router = useRouter();

  const TipoDocumento = ['VD', 'NE'];
  const nomeDocumento = ['Venda a dinheiro', 'Nota de entrada'];
  const condicoesPagamento = ['Pronto pagamento', 'Pagamento em 15 dias', 'Pagamento em 30 dias'];
  const metodoPagamento = ['Numerário', 'Transferência móvel', 'POS', 'Depósito'];

  // Função para obter o título dinâmico do header
  const getHeaderTitle = () => {
    if (!selectedTipoDocumento) return 'Novo Documento';
    const docInfo = DOCUMENT_TYPES[selectedTipoDocumento as keyof typeof DOCUMENT_TYPES];
    return `Nova ${docInfo?.label || selectedTipoDocumento}`;
  };

  useEffect(() => {
    async function loadData() {
      await loadClientes();
      await loadProducts();
      await loadFornecedores();
    }
    loadData();
  }, []);

  useEffect(() => {
    if (selectedProduto) {
      setIdSelectedProduto(selectedProduto.id);
      setTaxaSelectedProduto(selectedProduto.imposto?.taxa || '17');
    } else {
      setIdSelectedProduto(0);
    }

    if (clienteSelecionado) {
      setIdClienteSelecionado(clienteSelecionado.id);
    }
  }, [selectedProduto, clienteSelecionado]);

  useEffect(() => {
    if (fornecedorSelecionado) {
      setIdFornecedorSelecionado(fornecedorSelecionado.id);
    } else {
      setIdSelectedProduto(0);
    }
  }, [fornecedorSelecionado]);

  useEffect(() => {
    if (selectedTipoDocumento === 'NE') {
      setSelectedNomeDocumento(nomeDocumento[1]);
    } else if (selectedTipoDocumento === 'VD') {
      setSelectedNomeDocumento(nomeDocumento[0]);
      setSelectedCondicaoPagamento('Pronto pagamento');
    } else {
      setSelectedNomeDocumento('');
    }
  }, [selectedTipoDocumento]);

  const NAV_ITEMS = [
    { icon: ShoppingBag, label: 'Vendas' },
    { icon: Handshake, label: 'Clientes' },
    { icon: Grid2X2, label: 'Painel' },
    { icon: Package, label: 'Produtos' },
    { icon: Cog, label: 'Config.' },
  ];

  function navigatePage(pageIndex: number) {
    setActiveNav(pageIndex);
    if (pageIndex === 2) router.push("/(authenticated)/dashboard");
    if (pageIndex === 4) router.push("/(authenticated)/settings");
    if (pageIndex === 1) router.push("/(authenticated)/clientes");
    if (pageIndex === 3) router.push("/(authenticated)/produtos");
  }

  async function loadClientes() {
    const token = await AsyncStorage.getItem("@token");
    const online = await isOnline();
    try {
      if (online) {
        const response = await api.get("/clientes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClientes(response.data.data);
        setFiltrados(response.data.data);
      } else {
        const local = ClienteRepository.getAll();
        setClientes(local);
        setFiltrados(local);
      }
    } catch (err: any) {
      console.log(err.response);
    }
  }

  async function loadFornecedores() {
    const token = await AsyncStorage.getItem("@token");
    const online = await isOnline();
    try {
      if (online) {
        const response = await api.get("/fornecedor", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFornecedores(response.data.data);
        setFiltradosFornecedores(response.data.data);
      } else {
        const local = FornecedoresRepository.getAll();
        setFornecedores(local);
        setFiltradosFornecedores(local);
      }
    } catch (err: any) {
      console.log(err.response);
    }
  }

  async function loadProducts() {
    const token = await AsyncStorage.getItem("@token");
    const online = await isOnline();
    try {
      if (online) {
        const response = await api.get("/produtos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProdutos(response.data.data);
        setFiltradosProdutos(response.data.data);
      } else {
        const local = ProdutoRepository.getAll();
        setProdutos(local);
        setFiltradosProdutos(local);
      }
    } catch (err: any) {
      console.log(err.response);
    }
  }

  // Função para montar o payload correto
  const getDocumentPayload = (): DocumentPayload => {
    const basePayload: DocumentPayload = {
      tipo_doc: selectedTipoDocumento,
      nome_doc: selectedNomeDocumento,
      ano_serie: new Date().getFullYear().toString(),
      data_documento: new Date().toISOString().split('T')[0],
      observacoes: observacoes || '',
      condicao_pagamento: selectedCondicaoPagamento || '',
      linhas: itens.map(item => ({
        produto_id: item.produto_id,
        qtd: item.quantidade,
        taxa_iva: parseFloat(item.taxa) || 17,
        pr_unit_sem_iva: item.preco,
        taxa_desconto: item.desconto || 0
      })),
    };

    if (selectedTipoDocumento === 'NE') {
      return {
        ...basePayload,
        fornecedor_id: IdFornecedorSelecionado,
        nome_fornecedor: fornecedorSelecionado?.nome || '',
        nuit: fornecedorSelecionado?.nuit || '',
      };
    }

    // VD, FT, GT
    return {
      ...basePayload,
      cliente_id: IdClienteSelecionado,
      nome_cliente: clienteSelecionado?.nome || '',
      nuit: clienteSelecionado?.nuit || '',
    };
  }

  async function handleGuardarRascunho() {
    const token = await AsyncStorage.getItem("@token");
    const online = await isOnline();

    if (!selectedTipoDocumento) {
      Alert.alert('Erro', 'Selecione o tipo de documento');
      return;
    }

    if (selectedTipoDocumento === 'NE' && !IdFornecedorSelecionado) {
      Alert.alert('Erro', 'Selecione um fornecedor');
      return;
    }

    if (selectedTipoDocumento === 'VD' && !IdClienteSelecionado) {
      Alert.alert('Erro', 'Selecione um cliente');
      return;
    }

    if (itens.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos um item');
      return;
    }

    let payload: DocumentPayload = getDocumentPayload();

    if (selectedTipoDocumento === 'VD') {
      payload = {
        ...payload,
        pagamento: selectedMetodoPagamento || '',
        pagamentos: [{
          metodo: selectedMetodoPagamento || '',
          valor: total,
          banco_servico: '',
          nr_movimento: ''
        }]
      };
    }

    try {
      if (online) {
        setLoadingGuardarRascunho(true);
        await api.post('/documentos', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const entityName = selectedTipoDocumento === 'NE' 
          ? fornecedorSelecionado?.nome 
          : clienteSelecionado?.nome;
        
        Alert.alert(
          `${selectedNomeDocumento} criada em rascunho`,
          `${selectedTipoDocumento === 'NE' ? 'Fornecedor' : 'Cliente'}: ${entityName}\nTotal: ${total.toFixed(2)} MT`,
          [{ text: 'OK', style: 'cancel' }]
        );

        // Reset form
        setItens([]);
        setClienteSelecionado(null);
        setFornecedorSelecionado(null);
        setSelectedTipoDocumento('');
        setSelectedCondicaoPagamento('');
        setSelectedMetodoPagamento('');
        setObservacoes('');
      } else {
        VendaRepository.save({
          ...payload,
          synced: 0,
        } as any);

        Alert.alert(
          "Rascunho guardado",
          "O documento foi guardado localmente e será sincronizado quando houver internet."
        );
      }
    } catch (err: any) {
      console.log('erro ao guardar rascunho: ', err.response);
      Alert.alert('Erro', 'Não foi possível guardar o rascunho');
    } finally {
      setLoadingGuardarRascunho(false);
    }
  }

  const handleProductPress = (prod: Produtos) => {
  // Verificar se o produto já está na lista
  const itemExistente = itens.find(item => item.produto_id === prod.id);
  
  if (itemExistente) {
    // Se já existe, aumenta a quantidade
    const itensAtualizados = itens.map(item => {
      if (item.produto_id === prod.id) {
        return {
          ...item,
          quantidade: item.quantidade + 1
        };
      }
      return item;
    });
    setItens(itensAtualizados);
  } else {
    // Se não existe, adiciona novo item com quantidade 1
    const novoItem: Item = {
      id: Date.now(),
      produto_id: prod.id,
      taxa: prod.imposto?.taxa?.toString() || '17',
      nome: prod.designacao,
      quantidade: 1,
      preco: parseFloat(prod.preco_venda_iliquido_1),
      desconto: 0
    };
    setItens([...itens, novoItem]);
  }
};

  const adicionarItem = () => {
    if (!selectedProduto || !preco) {
      Alert.alert('Erro', 'Selecione um produto');
      return;
    }

    const quantidadeNova = parseInt(quantidade) || 1;
    const descontoValor = parseFloat(descontoItem) || 0;

    if (descontoValor > 100) {
      Alert.alert('Erro', 'Desconto máximo de 100%');
      return;
    }

    const itemExistente = itens.find(item => item.produto_id === IdSelectedProduto);

    if (itemExistente) {
      const itensAtualizados = itens.map(item => {
        if (item.produto_id === IdSelectedProduto) {
          return {
            ...item,
            quantidade: item.quantidade + quantidadeNova,
            desconto: descontoValor,
          };
        }
        return item;
      });
      setItens(itensAtualizados);
    } else {
      const novoItem: Item = {
        id: Date.now(),
        produto_id: IdSelectedProduto,
        taxa: taxaSelectedProduto || '17',
        nome: nomeProduto,
        quantidade: quantidadeNova,
        preco: parseFloat(preco),
        desconto: descontoValor,
      };
      setItens([...itens, novoItem]);
    }

    setNomeProduto('');
    setQuantidade('');
    setPreco('');
    setDescontoItem('0');
    setSelectedProduto(null);
  };

  const removerItem = (id: number) => {
    setItens(itens.filter(item => item.id !== id));
  };

  const calcularTotais = () => {
    let subtotal = 0;
    let totalDesconto = 0;
    let iva = 0;

    itens.forEach(item => {
      const totalItem = item.quantidade * item.preco;
      const descontoItemValor = (totalItem * (item.desconto || 0)) / 100;
      const totalComDesconto = totalItem - descontoItemValor;
      const ivaItem = (totalComDesconto * parseFloat(item.taxa || '17')) / 100;

      subtotal += totalItem;
      totalDesconto += descontoItemValor;
      iva += ivaItem;
    });

    const total = subtotal - totalDesconto + iva;
    return { subtotal, totalDesconto, iva, total };
  };

  const { subtotal, totalDesconto, iva, total } = calcularTotais();

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text === '') {
      setFiltrados(clientes);
    } else {
      const filtered = clientes.filter(c => c.nome.toLowerCase().includes(text.toLowerCase()));
      setFiltrados(filtered);
    }
  };

  const handleSearchProdutos = (text: string) => {
    setSearchTextProdutos(text);
    if (text === '') {
      setFiltradosProdutos(produtos);
    } else {
      const filtered = produtos.filter(p => p.designacao.toLowerCase().includes(text.toLowerCase()));
      setFiltradosProdutos(filtered);
    }
  };

  const handleConfirmar = async () => {
  const token = await AsyncStorage.getItem("@token");
  const online = await isOnline();

  if (!selectedTipoDocumento) {
    Alert.alert('Erro', 'Selecione o tipo de documento');
    return;
  }

  if (selectedTipoDocumento === 'NE' && !IdFornecedorSelecionado) {
    Alert.alert('Erro', 'Selecione um fornecedor');
    return;
  }

  if (selectedTipoDocumento === 'VD' && !IdClienteSelecionado) {
    Alert.alert('Erro', 'Selecione um cliente');
    return;
  }

  if (itens.length === 0) {
    Alert.alert('Erro', 'Adicione pelo menos um item');
    return;
  }

  // Montar payload
  const payload: DocumentPayload = {
    tipo_doc: selectedTipoDocumento,
    nome_doc: selectedNomeDocumento,
    ano_serie: new Date().getFullYear().toString(),
    data_documento: new Date().toISOString().split('T')[0],
    observacoes: observacoes || '',
    condicao_pagamento: selectedCondicaoPagamento || '',
    linhas: itens.map(item => ({
      produto_id: item.produto_id,
      qtd: item.quantidade,
      taxa_iva: parseFloat(item.taxa) || 17,
      pr_unit_sem_iva: item.preco,
      taxa_desconto: item.desconto || 0
    })),
  };

  if (selectedTipoDocumento === 'NE') {
    payload.fornecedor_id = IdFornecedorSelecionado;
    payload.nome_fornecedor = fornecedorSelecionado?.nome || '';
    payload.nuit = fornecedorSelecionado?.nuit || '';
  } else {
    payload.cliente_id = IdClienteSelecionado;
    payload.nome_cliente = clienteSelecionado?.nome || '';
    payload.nuit = clienteSelecionado?.nuit || '';
    payload.morada_cliente = typeof clienteSelecionado?.endereco === 'string' 
                                ? clienteSelecionado.endereco 
                                : clienteSelecionado?.endereco?.morada || '';
    payload.pagamento = selectedMetodoPagamento || '';
    payload.pagamentos = [{
      metodo: selectedMetodoPagamento || '',
      valor: total,
      banco_servico: '',
      nr_movimento: ''
    }];
  }

  try {
    setLoadingConfirmar(true);
    await api.post('/documentos/create-and-confirm', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    Alert.alert('Sucesso', 'Documento confirmado com sucesso!');
    router.back();
  } catch (err: any) {
    console.log('erro ao confirmar: ', err.response);
    Alert.alert('Erro', err.response?.data?.message || 'Não foi possível confirmar o documento');
  } finally {
    setLoadingConfirmar(false);
  }
};

  const handleSearchFornecedores = (text: string) => {
    setSearchTextFornecedores(text);
    if (text === '') {
      setFiltradosFornecedores(fornecedores);
    } else {
      const filtered = fornecedores.filter(f => f.nome.toLowerCase().includes(text.toLowerCase()));
      setFiltradosFornecedores(filtered);
    }
  };

  const aumentarQuantidade = (id: number | undefined) => {
    setItens(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
      )
    );
  };

  const diminuirQuantidade = (id: number | undefined) => {
    setItens(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantidade: Math.max(1, item.quantidade - 1) } : item
      )
    );
  };

  const renderItem = ({ item }: { item: Item }) => {
    const totalItem = item.quantidade * item.preco;
    const descontoItemValor = (totalItem * (item.desconto || 0)) / 100;
    const totalComDesconto = totalItem - descontoItemValor;
    const taxaIva = parseFloat(item.taxa) || 17;
    const ivaItem = (totalComDesconto * taxaIva) / 100;
    const totalFinal = totalComDesconto + ivaItem;

    return (
      <View style={styles.itemRow}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemNome}>{item.nome}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
            <TouchableOpacity style={styles.btnQtd} onPress={() => diminuirQuantidade(item.id)}>
              <Text style={styles.btnQtdText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.itemDetalhes}> {item.quantidade} </Text>
            <TouchableOpacity style={styles.btnQtd} onPress={() => aumentarQuantidade(item.id)}>
              <Text style={styles.btnQtdText}>+</Text>
            </TouchableOpacity>
            <Text style={styles.itemDetalhes}> × {item.preco.toFixed(2)} MT</Text>
            {item.desconto > 0 && (
              <Text style={[styles.itemDetalhes, { color: '#E24B4A', marginLeft: 8 }]}>
                -{item.desconto}%
              </Text>
            )}
          </View>
          <Text style={[styles.itemDetalhes, { paddingTop: 4 }]}>
            IVA {parseFloat(item.taxa).toFixed(0)}%
          </Text>
        </View>
        <View style={styles.itemRight}>
          <Text style={styles.itemTotal}>{totalFinal.toFixed(2)} MT</Text>
          <TouchableOpacity onPress={() => removerItem(item.id)} style={styles.btnRemover}>
            <Text style={styles.btnRemoverText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const isNE = selectedTipoDocumento === 'NE';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#185FA5" />

      {/* Header com título dinâmico */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
        <Text style={styles.headerSubtitle}>
          {selectedTipoDocumento || 'Selecione o tipo de documento'}
        </Text>
      </View>

      <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {/* Tipo de documento */}
          <View style={styles.card}>
            <Text style={styles.dialogTextStyle}>Tipo de documento:</Text>
            <Select
              label=""
              placeholder="Selecione o tipo de documento"
              options={TipoDocumento.map(tipo => ({
                label: tipo,
                value: tipo
              }))}
              selectedValue={selectedTipoDocumento}
              onValueChange={setSelectedTipoDocumento}
            />
          </View>

          {/* Nome do documento */}
          <View style={styles.card}>
            <Text style={styles.dialogTextStyle}>Nome do documento:</Text>
            <TextInput
              style={styles.input}
              value={selectedNomeDocumento}
              editable={false}
              placeholder='Será preenchido automáticamente...'
            />
          </View>

          {/* Condição de pagamento */}
          <View style={styles.card}>
            <Text style={styles.dialogTextStyle}>Condição de pagamento:</Text>
            <Select
              label=""
              placeholder="Selecione a condição de pagamento"
              options={condicoesPagamento.map(condicao => ({
                label: condicao,
                value: condicao
              }))}
              selectedValue={selectedCondicaoPagamento}
              onValueChange={setSelectedCondicaoPagamento}
            />
          </View>

          {/* Observações */}
          <View style={styles.card}>
            <Text style={styles.dialogTextStyle}>Observações:</Text>
            <TextInput
              multiline
              placeholder="Observações ..."
              style={styles.textArea}
              value={observacoes}
              onChangeText={setObservacoes}
            />
          </View>

          {/* Cliente / Fornecedor */}
          <View style={styles.card}>
            <Text style={styles.dialogTextStyle}>
              {isNE ? 'Fornecedor' : 'Cliente'}
            </Text>

            {/* Campo de pesquisa */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder={isNE ? "🔍 Pesquisar fornecedor..." : "🔍 Pesquisar cliente..."}
                placeholderTextColor="#AEAEB2"
                value={isNE ? searchTextFornecedores : searchText}
                onChangeText={isNE ? handleSearchFornecedores : handleSearch}
              />
            </View>

            {isNE ? (
              fornecedorSelecionado ? (
                <View style={styles.clienteSelecionado}>
                  <View>
                    <Text style={styles.clienteNome}>{fornecedorSelecionado.nome}</Text>
                    <Text style={styles.clienteNuit}>Nuit: {fornecedorSelecionado.nuit}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setFornecedorSelecionado(null)} style={styles.btnMudar}>
                    <Text style={styles.btnMudarText}>Mudar</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <FlatList
                  data={filtradosFornecedores.slice(0, 4)}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.clienteItem} onPress={() => setFornecedorSelecionado(item)}>
                      <View>
                        <Text style={styles.clienteItemNome}>{item.nome}</Text>
                        <Text style={styles.clienteItemNuit}>Nuit: {item.nuit}</Text>
                      </View>
                      <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>
                  )}
                />
              )
            ) : (
              clienteSelecionado ? (
                <View style={styles.clienteSelecionado}>
                  <View>
                    <Text style={styles.clienteNome}>{clienteSelecionado.nome}</Text>
                    <Text style={styles.clienteNuit}>Nuit: {clienteSelecionado.nuit}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setClienteSelecionado(null)} style={styles.btnMudar}>
                    <Text style={styles.btnMudarText}>Mudar</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <FlatList
                  data={filtrados.slice(0, 4)}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.clienteItem} onPress={() => setClienteSelecionado(item)}>
                      <View>
                        <Text style={styles.clienteItemNome}>{item.nome}</Text>
                        <Text style={styles.clienteItemNuit}>Nuit: {item.nuit}</Text>
                      </View>
                      <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>
                  )}
                />
              )
            )}
          </View>

          {/* Produtos */}
          <View style={styles.card}>
            <Text style={styles.dialogTextStyle}>Produtos</Text>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="🔍 Pesquisar produto..."
                placeholderTextColor="#AEAEB2"
                value={searchTextProdutos}
                onChangeText={handleSearchProdutos}
              />
            </View>

            <View style={styles.produtosRapidos}>
              {filtradosProdutos.slice(0, 4).map((prod) => (
                <TouchableOpacity
                  key={prod.id}
                  style={[
                    styles.produtoRapido, 
                    itens.some(item => item.produto_id === prod.id) && styles.produtoRapidoSelected
                  ]}
                  onPress={() => handleProductPress(prod)}
                >
                  <Text style={[
                    styles.produtoRapidoText, 
                    itens.some(item => item.produto_id === prod.id) && { color: '#fff' }
                  ]}>
                    {prod.designacao}
                  </Text>
                  <Text style={[
                    styles.produtoRapidoPreco, 
                    itens.some(item => item.produto_id === prod.id) && { color: '#fff' }
                  ]}>
                    {parseFloat(prod.preco_venda_iliquido_1).toFixed(2)} MT
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
              </View>
          {/* Lista de itens */}
          {itens.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.dialogTextStyle}>Itens Adicionados ({itens.length})</Text>
              <FlatList
                data={itens}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                renderItem={renderItem}
              />
            </View>
          )}

          {/* Método de pagamento (apenas VD) */}
          {selectedTipoDocumento === 'VD' && (
            <View style={styles.card}>
              <Text style={styles.dialogTextStyle}>Método de pagamento:</Text>
              <Select
                label=""
                placeholder="Selecione o método de pagamento"
                options={metodoPagamento.map(metodo => ({
                  label: metodo,
                  value: metodo
                }))}
                selectedValue={selectedMetodoPagamento}
                onValueChange={setSelectedMetodoPagamento}
              />

              {selectedMetodoPagamento !== 'Numerário' && (
                <>
                  <Text style={styles.inputLabel}>Banco / Serviço:</Text>
                  <TextInput style={styles.input} placeholder="Banco" />

                  <Text style={styles.inputLabel}>Nº de movimento:</Text>
                  <TextInput style={styles.input} placeholder="ex: 1234xx, 5678xx" keyboardType="decimal-pad" />
                </>
              )}
            </View>
          )}

          {/* Totais */}
          <View style={styles.totaisCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>{subtotal.toFixed(2)} MT</Text>
            </View>

            {totalDesconto > 0 && (
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: '#E24B4A' }]}>Desconto:</Text>
                <Text style={[styles.totalValue, { color: '#E24B4A' }]}>- {totalDesconto.toFixed(2)} MT</Text>
              </View>
            )}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>IVA total:</Text>
              <Text style={styles.totalValue}>{iva.toFixed(2)} MT</Text>
            </View>

            <View style={[styles.totalRow, styles.totalFinal]}>
              <Text style={styles.totalLabelFinal}>Total:</Text>
              <Text style={styles.totalValueFinal}>{total.toFixed(2)} MT</Text>
            </View>
          </View>

          {/* Botões */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.btnSecundario, loadingGuardarRascunho && styles.btnDisabled]}
              onPress={handleGuardarRascunho}
              disabled={loadingGuardarRascunho}
            >
              <Text style={styles.btnSecundarioText}>
                {loadingGuardarRascunho ? 'Guardando...' : 'Guardar Rascunho'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnConfirmar, loadingConfirmar && styles.btnDisabled]}
              onPress={handleConfirmar}
              disabled={loadingConfirmar}
            >
              <Text style={styles.btnConfirmarText}>
                {loadingConfirmar ? 'Confirmando...' : ' Confirmar'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {NAV_ITEMS.map((nav, i) => {
          const Icon = nav.icon;
          return (
            <TouchableOpacity
              key={i}
              style={styles.navItem}
              onPress={() => navigatePage(i)}
              activeOpacity={0.7}
            >
              <Text style={[styles.navIcon, i === 0 && styles.navIconActive]}>
                <Icon color={i === 0 ? '#185FA5' : '#5c5b5b'} />
              </Text>
              <Text style={[styles.navLabel, i === 0 && styles.navLabelActive]}>
                {nav.label}
              </Text>
              {i === 0 && <View style={styles.navDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e4e4e4',
  },
  dialogTextStyle: {
    fontWeight: 'bold',
    color: '#8E8E93',
    marginBottom: 8,
  },
  header: {
    backgroundColor: '#185FA5',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    padding: 14,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 4,
    marginTop: 10,
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
  textArea: {
    fontStyle: 'italic',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E5E5EA',
    padding: 10,
    height: 80,
    textAlignVertical: 'top',
    backgroundColor: '#F2F2F7',
  },
  clienteSelecionado: {
    backgroundColor: '#EAF3DE',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
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
    marginTop: 6,
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
  searchContainer: {
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1C1C1E',
  },
  produtosRapidos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 8,
    width: '100%',
  },
  produtoRapido: {
    backgroundColor: '#E6F1FB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1,
    minWidth: '50%',
  },
  produtoRapidoSelected: {
    backgroundColor: '#185FA5',
  },
  produtoRapidoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#185FA5',
  },
  produtoRapidoPreco: {
    fontSize: 10,
    color: '#185FA5',
    opacity: 0.7,
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
  itemRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 6,
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
  btnQtd: {
    borderRadius: 4,
    backgroundColor: colors.blue,
    paddingHorizontal: 8,
    marginHorizontal: 4,
  },
  btnQtdText: {
    color: '#fff',
    fontWeight: '600',
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
  totaisCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    padding: 14,
    marginBottom: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
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
    paddingTop: 8,
  },
  totalLabelFinal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  totalValueFinal: {
    fontSize: 18,
    fontWeight: '600',
    color: '#185FA5',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btnSecundario: {
    flex: 1,
    backgroundColor: '#fff',
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
  btnDisabled: {
    backgroundColor: '#cecece',
    borderColor: '#cecece',
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
  helperText: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 6,
    fontStyle: 'italic',
  },
  btnConfirmar: {
  flex: 1,
  backgroundColor: '#28a745',
  borderRadius: 10,
  borderWidth: 0.5,
  borderColor: '#28a745',
  paddingVertical: 12,
  alignItems: 'center',
},
btnConfirmarText: {
  fontSize: 14,
  fontWeight: '500',
  color: '#fff',
},
});