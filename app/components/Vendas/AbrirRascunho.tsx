
import { ClienteRepository } from '@/app/database/ClienteRepository';
import { FornecedoresRepository } from '@/app/database/FornecedoresRepository';
import { ProdutoRepository } from '@/app/database/ProdutoRepository';
import { VendaRepository } from '@/app/database/VendaRepository';
import { Select } from '@/components/project/Select';
import { colors } from '@/constants/theme';
import { api } from '@/services/api';
import { Clientes, Fornecedores, Produtos, Vendas } from '@/types/types';
import { isOnline } from "@/utils/network";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { Cog, Grid2X2, Handshake, Package, ShoppingBag } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList, Image, KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


interface Item {
  id?: number;
  produto_id: number;
  taxa: string;
  nome: string;
  quantidade: number;
  preco: number;
  desconto: number;
}

interface DocumentPayload {
  tipo_doc: string;
  nome_doc: string;
  ano_serie: string;
  data_documento: string;
  observacoes: string;
  condicao_pagamento: string;
  linhas: Array<{
    id?: number;
    produto_id: number;
    qtd: number;
    taxa_iva: number;
    pr_unit_sem_iva: number;
    taxa_desconto: number;
  }>;
  fornecedor_id?: number;
  nome_fornecedor?: string;
  nuit?: string;
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

const DOCUMENT_TYPES: Record<string, { label: string }> = {
  VD: { label: 'Venda a Dinheiro' },
  NE: { label: 'Nota de Entrada' },
};

// Adicionar a constante NAV_ITEMS antes de ser usada (depois dos estados)

const NAV_ITEMS = [
  { icon: ShoppingBag, label: 'Vendas' },
  { icon: Handshake, label: 'Clientes' },
  { icon: Grid2X2, label: 'Painel' },
  { icon: Package, label: 'Produtos' },
  { icon: Cog, label: 'Config.' },
];

export default function AbrirRascunho() {
  const [clienteSelecionado, setClienteSelecionado] = useState<Clientes | null>(null);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<Fornecedores | null>(null);
  const [IdClienteSelecionado, setIdClienteSelecionado] = useState(0);
  const [IdFornecedorSelecionado, setIdFornecedorSelecionado] = useState(0);
  const [itens, setItens] = useState<Item[]>([]);
  const [selectedProduto, setSelectedProduto] = useState<Produtos | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [searchTextProdutos, setSearchTextProdutos] = useState<string>('');
  const [searchTextFornecedores, setSearchTextFornecedores] = useState<string>('');
  const [filtrados, setFiltrados] = useState<Clientes[]>([]);
  const [clientes, setClientes] = useState<Clientes[]>([]);
  const [produtos, setProdutos] = useState<Produtos[]>([]);
  const [filtradosProdutos, setFiltradosProdutos] = useState<Produtos[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedores[]>([]);
  const [filtradosFornecedores, setFiltradosFornecedores] = useState<Fornecedores[]>([]);
  const [selectedTipoDocumento, setSelectedTipoDocumento] = useState<string>('');
  const [selectedNomeDocumento, setSelectedNomeDocumento] = useState('');
  const [selectedCondicaoPagamento, setSelectedCondicaoPagamento] = useState('');
  const [selectedMetodoPagamento, setSelectedMetodoPagamento] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loadingGuardarRascunho, setLoadingGuardarRascunho] = useState(false);
  const [activeNav, setActiveNav] = useState(0);
  const [impresso, setImpresso] = useState<boolean | undefined>(false);
  const [venda, setVenda] = useState<Vendas | null>(null);
  const router = useRouter();

  const TipoDocumento = ['VD', 'NE'];
  const nomeDocumento = ['Venda a dinheiro', 'Nota de entrada'];
  const condicoesPagamento = ['Pronto pagamento', 'Pagamento em 15 dias', 'Pagamento em 30 dias'];
  const metodoPagamento = ['Numerário', 'Transferência móvel', 'POS', 'Depósito'];

  const { id } = useLocalSearchParams();

  const getHeaderTitle = () => {
    if (!selectedTipoDocumento) return 'Novo Documento';
    const docInfo = DOCUMENT_TYPES[selectedTipoDocumento];
    return `Nova ${docInfo?.label || selectedTipoDocumento}`;
  };

  useEffect(() => {
    async function loadData() {
      await loadVenda();
    }
    loadData();
  }, [id]);

  useEffect(() => {
    if (!venda) return;
    setSelectedTipoDocumento(venda?.tipo_doc ?? '');
    setSelectedNomeDocumento(venda?.nome_doc ?? '');
    setSelectedCondicaoPagamento(venda?.condicao_pagamento ?? '');
    setSelectedMetodoPagamento(venda?.pagamento ?? '');
    setObservacoes(venda?.observacoes ?? '');

    if ((venda?.tipo_doc === 'VD' || venda?.tipo_doc === 'NE') && !venda?.condicao_pagamento) {
      setSelectedCondicaoPagamento('Pronto pagamento');
    }

    const clienteSeleccionado = clientes.find(cliente => cliente.id === venda?.cliente_id);
    setClienteSelecionado(clienteSeleccionado ?? null);

    const fornecedorSelecionado = fornecedores.find(fornecedor => fornecedor.id === venda?.fornecedor_id);
    setFornecedorSelecionado(fornecedorSelecionado ?? null);

    const itensFormatados = (venda?.linhas || []).map(l => {
      const produto = produtos.find(p => p.id === l.produto_id);
      return {
        id: l.id,
        produto_id: l.produto_id,
        nome: produto?.designacao ?? 'Produto não encontrado',
        quantidade: Number(l.qtd),
        preco: Number(l.pr_unit_sem_iva),
        taxa: String(l.taxa_iva),
        desconto: Number(l.taxa_desconto) || 0,
      };
    });

    setItens(itensFormatados);
    setImpresso(venda?.impresso);
  }, [venda, produtos, clientes, fornecedores]);

  // Adicionar também a função navigatePage se não existir
  function navigatePage(pageIndex: number) {
    setActiveNav(pageIndex);
    if (pageIndex === 2) router.push("/(authenticated)/dashboard");
    if (pageIndex === 4) router.push("/(authenticated)/settings");
    if (pageIndex === 1) router.push("/(authenticated)/clientes");
    if (pageIndex === 3) router.push("/(authenticated)/produtos");
  }
  useEffect(() => {
    async function loadData() {
      await loadClientes();
      await loadProducts();
      await loadFornecedores();
    }
    loadData();
  }, []);

  useEffect (()=>{
  
       if (clienteSelecionado)
      {
          setIdClienteSelecionado(clienteSelecionado.id)
      }
  
      else
      {
        setIdClienteSelecionado(0)
      }
  
    
  
  
    },[clienteSelecionado])
  
  
     useEffect (()=>{
  
      if (fornecedorSelecionado)
      {
          setIdFornecedorSelecionado(fornecedorSelecionado.id)
          
      }
      else
      {
          setIdFornecedorSelecionado(0)
      }
  
     
  
    },[fornecedorSelecionado])
  

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

  async function loadVenda() {
    const token = await AsyncStorage.getItem("@token");
    const online = await isOnline();
    try {
      if (online) {
        const response = await api.get(`/documentos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVenda(response.data.data);
      } else {
        const local = VendaRepository.getById(Number(id));
        setVenda(local);
      }
    } catch (err: any) {
      console.log(err.response);
    }
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

  const handleProductPress = (prod: Produtos) => {
    setSelectedProduto(prod);
    const itemExistente = itens.find(item => item.produto_id === prod.id);
    if (itemExistente) {
      const itensAtualizados = itens.map(item => {
        if (item.produto_id === prod.id) {
          return { ...item, quantidade: item.quantidade + 1 };
        }
        return item;
      });
      setItens(itensAtualizados);
    } else {
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

  const handleGuardarRascunho = async () => {
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

    const payload: DocumentPayload = {
      tipo_doc: selectedTipoDocumento,
      nome_doc: selectedNomeDocumento,
      ano_serie: new Date().getFullYear().toString(),
      data_documento: new Date().toISOString().split('T')[0],
      observacoes: observacoes || '',
      condicao_pagamento: selectedCondicaoPagamento || '',
      linhas: itens.map(item => ({
        id: item.id,
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
                                  : clienteSelecionado?.endereco?.morada || '',
      payload.pagamento = selectedMetodoPagamento || '';
      payload.pagamentos = [{
        metodo: selectedMetodoPagamento || '',
        valor: total,
        banco_servico: '',
        nr_movimento: ''
      }];
    }

    try {
      setLoadingGuardarRascunho(true);
      await api.put(`/documentos/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Sucesso', 'Documento actualizado com sucesso');
    } catch (err: any) {
      console.log('erro ao guardar rascunho: ', err.response);
      Alert.alert('Erro', 'Não foi possível guardar o rascunho');
    } finally {
      setLoadingGuardarRascunho(false);
    }
  };

  const removerItem = (id: number | undefined) => {
    if (venda?.estado === 'RASCUNHO') {
      setItens(itens.filter(item => item.id !== id));
    } else if (venda?.estado === 'CONFIRMADO') {
      setItens(prev =>
        prev.map(item =>
          item.id === id ? { ...item, produto_id: 0, nome: '', quantidade: 0, preco: 0, taxa: '0', desconto: 0 } : item
        )
      );
    }
  };

  const calcularTotais = () => {
    let subtotal = 0;
    let totalDesconto = 0;
    let iva = 0;

    itens.forEach(item => {
      const totalItem = item.quantidade * item.preco;
      const descontoItemValor = (totalItem * (item.desconto || 0)) / 100;
      const totalComDesconto = totalItem - descontoItemValor;
      const taxaIva = parseFloat(item.taxa) || 17;
      const ivaItem = (totalComDesconto * taxaIva) / 100;

      subtotal += totalItem;
      totalDesconto += descontoItemValor;
      iva += ivaItem;
    });

    const total = subtotal - totalDesconto + iva;
    return { subtotal, totalDesconto, iva, total };
  };

  const { subtotal, totalDesconto, iva, total } = calcularTotais();

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

  const handleSearch = (text: string): void => {
    setSearchText(text);
    if (text === '') {
      setFiltrados(clientes);
    } else {
      const filtered = clientes.filter(
        (c) => c.nome.toLowerCase().includes(text.toLowerCase())
      );
      setFiltrados(filtered);
    }
  };

// Adicionar também a função handleSearchProdutos se não existir
const handleSearchProdutos = (text: string): void => {
  setSearchTextProdutos(text);
  if (text === '') {
    setFiltradosProdutos(produtos);
  } else {
    const filtered = produtos.filter(
      (p) => p.designacao.toLowerCase().includes(text.toLowerCase())
    );
    setFiltradosProdutos(filtered);
  }
};

  const handleSearchFornecedores = (text: string): void => {
    setSearchTextFornecedores(text);
    if (text === '') {
      setFiltradosFornecedores(fornecedores);
    } else {
      const filtered = fornecedores.filter(
        (f) => f.nome.toLowerCase().includes(text.toLowerCase())
      );
      setFiltradosFornecedores(filtered);
    }
  };

  function gerarHTMLVenda(logoBase64: string = '') {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #1C1C1E;
            line-height: 1.6;
            background: #fff;
          }

          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background: white;
          }

          /* HEADER */
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            border-bottom: 3px solid #185FA5;
            padding-bottom: 30px;
          }

          .logo-section h1 {
            font-size: 28px;
            color: #185FA5;
            margin-bottom: 5px;
            font-weight: 700;
          }

          .logo-section p {
            font-size: 12px;
            color: #8E8E93;
          }

          .doc-info {
            text-align: right;
          }

          .doc-type {
            font-size: 18px;
            font-weight: 600;
            color: #185FA5;
            margin-bottom: 8px;
          }

          .doc-number {
            font-size: 13px;
            color: #8E8E93;
            line-height: 1.8;
          }

          /* CLIENTE */
          .client-section {
            display: flex;
            gap: 60px;
            margin-bottom: 40px;
          }

          .client-box {
            flex: 1;
          }

          .client-box h3 {
            font-size: 11px;
            font-weight: 600;
            color: #8E8E93;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
          }

          .client-box p {
            font-size: 13px;
            margin-bottom: 4px;
            color: #1C1C1E;
          }

          .client-box .label {
            font-size: 11px;
            color: #8E8E93;
            margin-bottom: 2px;
          }

          /* TABELA */
          .items-section {
            margin-bottom: 30px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 0;
          }

          thead {
            background: #F2F2F7;
            border-top: 2px solid #185FA5;
            border-bottom: 2px solid #185FA5;
          }

          th {
            padding: 14px;
            text-align: left;
            font-size: 12px;
            font-weight: 600;
            color: #185FA5;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          td {
            padding: 14px;
            font-size: 13px;
            border-bottom: 1px solid #E5E5EA;
          }

          tbody tr:last-child td {
            border-bottom: 2px solid #185FA5;
          }

          tbody tr:hover {
            background: #F9F9FB;
          }

          .text-right {
            text-align: right;
          }

          .text-center {
            text-align: center;
          }

          /* TOTAIS */
          .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 40px;
          }

          .totals-box {
            width: 280px;
          }

          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #E5E5EA;
            font-size: 13px;
          }

          .total-row.subtotal {
            color: #8E8E93;
          }

          .total-row.iva {
            color: #8E8E93;
          }

          .total-row.final {
            border-bottom: none;
            border-top: 2px solid #185FA5;
            padding-top: 14px;
            padding-bottom: 0;
            font-weight: 700;
            font-size: 16px;
            color: #185FA5;
          }

          .total-label {
            font-weight: 500;
          }

          .total-value {
            font-weight: 600;
          }

          /* RODAPÉ */
          .footer {
            border-top: 1px solid #E5E5EA;
            padding-top: 20px;
            margin-top: 40px;
            text-align: center;
            font-size: 11px;
            color: #8E8E93;
          }

          .footer p {
            margin: 4px 0;
          }

          @media print {
            body {
              background: white;
            }
            .container {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
           <!-- ✅ LOGO AQUI -->
          ${logoBase64 ? `
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="${logoBase64}" alt="Logo" style="max-width: 120px; height: auto;">
            </div>
          ` : ''}
          <!-- HEADER -->
          <div class="header">

            <div class="logo-section">
              <h1>FACTURA</h1>
              <p>Documento de Venda</p>
            </div>
            <div class="doc-info">
              <div class="doc-type">${selectedNomeDocumento}</div>
              <div class="doc-number">
                <strong>Número:</strong> ${gerarNumeroFactura()}<br>
                <strong>Série:</strong> ${venda?.ano_serie}<br>
                <strong>Data:</strong> ${new Date().toLocaleDateString('pt-PT')}
              </div>
            </div>
          </div>

          <!-- CLIENTE E FORNECEDOR -->
          <div class="client-section">
            <div class="client-box">
              <h3>Cliente</h3>
              <p class="label">Nome</p>
              <p><strong>${clienteSelecionado?.nome ?? 'N/A'}</strong></p>
              <p class="label">Email</p>
              <p>${clienteSelecionado?.email ?? 'N/A'}</p>
            </div>
            <div class="client-box">
              <h3>Termos</h3>
              <p class="label">Condição de Pagamento</p>
              <p><strong>${venda?.condicao_pagamento ?? 'Pronto pagamento'}</strong></p>
              <p class="label">Método de Pagamento</p>
              <p>${venda?.pagamento ?? 'N/A'}</p>
            </div>
          </div>

          <!-- ITENS -->
          <div class="items-section">
            <table>
              <thead>
                <tr>
                  <th style="width: 45%;">Descrição do Produto</th>
                  <th class="text-center" style="width: 15%;">Quantidade</th>
                  <th class="text-right" style="width: 20%;">Preço Unitário</th>
                  <th class="text-right" style="width: 20%;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itens.map(item => `
                  <tr>
                    <td>
                      <strong>${item.nome}</strong><br>
                      <span style="font-size: 11px; color: #8E8E93;">IVA ${parseFloat(item.taxa).toFixed(0)}%</span>
                    </td>
                    <td class="text-center">${item.quantidade}</td>
                    <td class="text-right">${item.preco.toFixed(2)} MT</td>
                    <td class="text-right"><strong>${(item.quantidade * item.preco).toFixed(2)} MT</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- TOTAIS -->
          <div class="totals-section">
            <div class="totals-box">
              <div class="total-row subtotal">
                <span class="total-label">Subtotal:</span>
                <span class="total-value">${subtotal.toFixed(2)} MT</span>
              </div>
              <div class="total-row iva">
                <span class="total-label">IVA Total:</span>
                <span class="total-value">${iva.toFixed(2)} MT</span>
              </div>
              <div class="total-row final">
                <span class="total-label">TOTAL A PAGAR:</span>
                <span class="total-value">${total.toFixed(2)} MT</span>
              </div>
            </div>
          </div>

          <!-- RODAPÉ -->
          <div class="footer">
            <p>Obrigado pela sua confiança</p>
            <p>Documento gerado eletronicamente em ${new Date().toLocaleString('pt-PT')}</p>
            <p style="margin-top: 12px; border-top: 1px solid #E5E5EA; padding-top: 12px;">
              Factura válida como com comprovante de pagamento
            </p>
          </div>

        </div>
      </body>
    </html>
  `;
}




function gerarNumeroFactura() {
  const ano = new Date().getFullYear();

  const numero = venda?.id ?? Math.floor(Math.random() * 9999);

  return `FT-${ano}-${String(numero).padStart(4, '0')}`;
}


async function getLogoBase64() {
  try {
    const logoUri = require('@/app/assets/logo.png');
    const uri = Image.resolveAssetSource(logoUri).uri;
    
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64'
    });
    
    return `data:image/png;base64,${base64}`;
  } catch (err) {
    console.log('Erro ao carregar logo:', err);
    return '';
  }
}



async function extrairPDFVenda() {

  try {

    const logoBase64 = await getLogoBase64();

    // Passa o logo para gerarHTMLVenda
    const html = gerarHTMLVenda(logoBase64);
    //const html = gerarHTMLVenda();

    const nomeFactura = `${gerarNumeroFactura()}.pdf`;

    // gera PDF
    const pdf = await Print.printToFileAsync({
      html,
    });

    console.log(pdf.uri);

    const isAvailable =
      await Sharing.isAvailableAsync();

    if (isAvailable) {

      await Sharing.shareAsync(pdf.uri, {
        mimeType: 'application/pdf',
        dialogTitle: nomeFactura,
        UTI: '.pdf',
      })

      await api.post(`/documentos/print/${id}`)
      //setImpresso(true)

    } else {

      Alert.alert(
        'PDF gerado',
        nomeFactura
      );
    }

  } catch (error) {

    console.log(error);

    // Alert.alert(
    //   'Erro',
    //   'Não foi possível gerar o PDF.'
    // );
  }
  finally
  {
      setImpresso(true)

  }
}


  const renderItem = ({ item }: { item: Item }) => {
    const totalItem = item.quantidade * item.preco;
    const descontoItemValor = (totalItem * (item.desconto || 0)) / 100;
    const totalComDesconto = totalItem - descontoItemValor;
    const taxaIva = parseFloat(item.taxa) || 17;
    const ivaItem = (totalComDesconto * taxaIva) / 100;
    const totalFinal = totalComDesconto + ivaItem;

    const isDisabled = impresso || venda?.estado === 'CANCELADO';

    return (
      <View style={styles.itemRow}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemNome}>{item.nome}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
            {!isDisabled && (
              <TouchableOpacity style={styles.btnQtd} onPress={() => diminuirQuantidade(item.id)}>
                <Text style={styles.btnQtdText}>-</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.itemDetalhes}> {item.quantidade} </Text>
            {!isDisabled && (
              <TouchableOpacity style={styles.btnQtd} onPress={() => aumentarQuantidade(item.id)}>
                <Text style={styles.btnQtdText}>+</Text>
              </TouchableOpacity>
            )}
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
          {!isDisabled && (
            <TouchableOpacity onPress={() => removerItem(item.id)} style={styles.btnRemover}>
              <Text style={styles.btnRemoverText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const isNE = selectedTipoDocumento === 'NE';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#185FA5" />

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
            <TextInput style={styles.input} value={selectedNomeDocumento} editable={false} />
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
              disabled={selectedTipoDocumento === 'VD'}
            />
            {selectedTipoDocumento === 'VD' && (
              <Text style={styles.helperText}>VD exige "Pronto Pagamento" por defeito</Text>
            )}
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
            <Text style={styles.dialogTextStyle}>{isNE ? 'Fornecedor' : 'Cliente'}</Text>

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
                <View style={styles.entitySelected}>
                  <View>
                    <Text style={styles.entityName}>{fornecedorSelecionado.nome}</Text>
                    <Text style={styles.entityDetail}>Nuit: {fornecedorSelecionado.nuit}</Text>
                  </View>
                  {venda?.estado === 'RASCUNHO' && (
                    <TouchableOpacity onPress={() => setFornecedorSelecionado(null)} style={styles.btnChange}>
                      <Text style={styles.btnChangeText}>Mudar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <FlatList
                  data={filtradosFornecedores.slice(0, 4)}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.entityItem} onPress={() => setFornecedorSelecionado(item)}>
                      <View>
                        <Text style={styles.entityItemName}>{item.nome}</Text>
                        <Text style={styles.entityItemDetail}>Nuit: {item.nuit}</Text>
                      </View>
                      <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>
                  )}
                />
              )
            ) : (
              clienteSelecionado ? (
                <View style={styles.entitySelected}>
                  <View>
                    <Text style={styles.entityName}>{clienteSelecionado.nome}</Text>
                    <Text style={styles.entityDetail}>Nuit: {clienteSelecionado.nuit}</Text>
                  </View>
                  {venda?.estado === 'RASCUNHO' && (
                    <TouchableOpacity onPress={() => setClienteSelecionado(null)} style={styles.btnChange}>
                      <Text style={styles.btnChangeText}>Mudar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <FlatList
                  data={filtrados.slice(0, 4)}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.entityItem} onPress={() => setClienteSelecionado(item)}>
                      <View>
                        <Text style={styles.entityItemName}>{item.nome}</Text>
                        <Text style={styles.entityItemDetail}>Nuit: {item.nuit}</Text>
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
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
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
          {venda?.estado !== 'CANCELADO' && !impresso && venda?.estado !== 'CONFIRMADO' && (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.btnSecundario, loadingGuardarRascunho && styles.btnDisabled]}
                onPress={handleGuardarRascunho}
                disabled={loadingGuardarRascunho}
              >
                <Text style={styles.btnSecundarioText}>
                  {loadingGuardarRascunho ? 'Guardando...' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Botão Exportar PDF - apenas para documentos confirmados */}
          {venda?.estado === 'CONFIRMADO' && impresso && (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.btnExportar}
                onPress={extrairPDFVenda}
              >
                <Text style={styles.btnExportarText}>Exportar PDF</Text>
              </TouchableOpacity>
            </View>
          )}



          {impresso && (
            <View style={styles.statusMessage}>
              <Text style={styles.statusTextSuccess}>Venda já impressa</Text>
            </View>
          )}

          {venda?.estado === 'CANCELADO' && (
            <View style={styles.statusMessage}>
              <Text style={styles.statusTextError}>Venda cancelada</Text>
            </View>
          )}

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
  container: { flex: 1, backgroundColor: '#e4e4e4' },
  dialogTextStyle: { 
    fontWeight: 'bold', 
    color: '#8E8E93', 
    marginBottom: 8 
  },
  helperText: { fontSize: 11, color: '#8E8E93', marginTop: 6, fontStyle: 'italic' },
  statusMessage: { marginTop: 10, alignItems: 'center' },
  statusTextSuccess: { fontSize: 15, color: '#0ba049', fontWeight: '700' },
  statusTextError: { fontSize: 15, color: '#f33c3c', fontWeight: '700' },
  header: {
    backgroundColor: '#185FA5',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    marginHorizontal: 10,
    borderRadius: 10
  },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#fff', marginBottom: 2 },
  headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  scroll: { flex: 1, backgroundColor: '#F2F2F7' },
  scrollContent: { padding: 14 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    padding: 14,
    marginBottom: 12
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1C1C1E'
  },
  textArea: {
    fontStyle: 'italic',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E5E5EA',
    padding: 10,
    height: 80,
    textAlignVertical: 'top',
    backgroundColor: '#F2F2F7'
  },
  inputLabel: { fontSize: 12, fontWeight: '500', color: '#8E8E93', marginBottom: 4, marginTop: 10 },
  entitySelected: {
    backgroundColor: '#EAF3DE',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  entityName: { fontSize: 15, fontWeight: '500', color: '#3B6D11', marginBottom: 2 },
  entityDetail: { fontSize: 12, color: '#3B6D11', opacity: 0.7 },
  btnChange: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#3B6D11', borderRadius: 8 },
  btnChangeText: { fontSize: 12, fontWeight: '500', color: '#fff' },
  entityItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  entityItemName: { fontSize: 14, fontWeight: '500', color: '#1C1C1E', marginBottom: 2 },
  entityItemDetail: { fontSize: 11, color: '#8E8E93' },
  arrow: { fontSize: 18, color: '#8E8E93' },
  searchContainer: { marginBottom: 8 },
  searchInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1C1C1E'
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
    minWidth: '50%'
  },
  produtoRapidoSelected: { backgroundColor: '#185FA5' },
  produtoRapidoText: { 
    fontSize: 12, 
    fontWeight: '500', 
    color: '#185FA5' 
  },
  produtoRapidoPreco: { 
    fontSize: 10, 
    color: '#185FA5', 
    opacity: 0.7 
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
    alignItems: 'center'
  },
  itemInfo: { flex: 1 },
  itemNome: { fontSize: 13, fontWeight: '500', color: '#1C1C1E', marginBottom: 3 },
  itemDetalhes: { fontSize: 11, color: '#8E8E93' },
  btnQtd: { 
    borderRadius: 4, 
    backgroundColor: colors.blue, 
    paddingHorizontal: 8, 
    marginHorizontal: 4 
  },
  btnQtdText: { color: '#fff', fontWeight: '600' },
  itemRight: { alignItems: 'flex-end', gap: 6 },
  itemTotal: { fontSize: 13, fontWeight: '500', color: '#185FA5' },
  btnRemover: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FCEBEB', alignItems: 'center', justifyContent: 'center' },
  btnRemoverText: { fontSize: 14, color: '#E24B4A' },
  totaisCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    padding: 14,
    marginBottom: 12
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA'
  },
  totalLabel: { fontSize: 13, color: '#8E8E93' },
  totalValue: { fontSize: 13, fontWeight: '500', color: '#1C1C1E' },
  totalFinal: { borderBottomWidth: 0, paddingTop: 8 },
  totalLabelFinal: { fontSize: 16, fontWeight: '600', color: '#1C1C1E' },
  totalValueFinal: { fontSize: 18, fontWeight: '600', color: '#185FA5' },
  actionsRow: { flexDirection: 'row', gap: 10 },
  btnSecundario: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#185FA5',
    paddingVertical: 12,
    alignItems: 'center'
  },
  btnSecundarioText: { fontSize: 14, fontWeight: '500', color: '#185FA5' },
  btnDisabled: { backgroundColor: '#cecece', borderColor: '#cecece' },
  navItem: { flex: 1, alignItems: 'center', gap: 3 },
  navIcon: { fontSize: 18, color: '#8E8E93' },
  navIconActive: { color: '#185FA5' },
  navLabel: { fontSize: 10, color: '#8E8E93' },
  navLabelActive: { color: '#185FA5', fontWeight: '500' },
  navDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#185FA5', marginTop: 1 },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
    paddingTop: 8,
    paddingBottom: 20
  },
  // Estilos adicionais
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
btnExportar: {
  flex: 1,
  backgroundColor: '#354edc',
  borderRadius: 10,
  borderWidth: 0.5,
  borderColor: '#3546dc',
  paddingVertical: 12,
  alignItems: 'center',
},
btnExportarText: {
  fontSize: 14,
  fontWeight: '500',
  color: '#fff',
},
});
