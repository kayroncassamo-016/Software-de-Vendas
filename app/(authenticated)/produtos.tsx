import { Select } from '@/components/project/Select';
import { useRouter } from 'expo-router';
import { Cog, Grid2X2, Handshake, Package, Plus, ShoppingBag } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Dimensions,
  // SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from '@/constants/theme';
import { Button, Dialog, Portal } from 'react-native-paper';

const { width } = Dimensions.get('window');

// ─── Types e Interfaces ────────────────────────────────────────────
interface Produto {
  id: number;
  nome: string;
  categoria: 'Serviço' | 'Licença' | 'Projecto' | 'Recorrente'|'Produto';
  preco: number;
  iva: number;
}

interface CategoriaConfig {
  bg: string;
  color: string;
  
}

interface CategoriaConfigMap {
  [key: string]: CategoriaConfig;
}

interface NavItem {
  icon: string;
  label: string;
}

// ─── Dados de exemplo ───────────────────────────────────────────────
const PRODUTOS: Produto[] = [
  { id: 1, nome: 'Consultoria em TI',        categoria: 'Serviço',    preco: 6000,   iva: 15 },
  { id: 2, nome: 'Licença Software ERP',     categoria: 'Licença',    preco: 4500,   iva: 17 },
  { id: 3, nome: 'Suporte técnico / hora',   categoria: 'Serviço',    preco: 750,    iva: 18 },
  { id: 4, nome: 'Instalação de Rede LAN',   categoria: 'Projecto',   preco: 25000,  iva: 19 },
  { id: 5, nome: 'Manutenção mensal',        categoria: 'Recorrente', preco: 3200,   iva: 20 },
  { id: 6, nome: 'Backup em nuvem',          categoria: 'Serviço',    preco: 2500,   iva: 21 },
  { id: 7, nome: 'Antivírus corporativo',    categoria: 'Licença',    preco: 1800,   iva: 22},
  { id: 8, nome: 'Configuração de servidor', categoria: 'Projecto',   preco: 12000,  iva: 1 },
];

const CATEGORIAS_CONFIG: CategoriaConfigMap = {
  Serviço:    { bg: '#E6F1FB', color: '#185FA5', },
  Licença:    { bg: '#FAEEDA', color: '#854F0B',},
  Projecto:   { bg: '#EAF3DE', color: '#3B6D11' },
  Recorrente: { bg: '#EEEDFE', color: '#534AB7' },
  Produto :{bg:'#e0ddff',color:'#05031d'}
};

const NAV_ITEMS = [
  { icon: ShoppingBag , label: 'Vendas' },
    {icon:Handshake,label:'Clientes'},
    { icon: Grid2X2, label: 'Painel' },
    { icon: Package, label: 'Produtos' },
    { icon: Cog, label: 'Config.' },
];

// ─── Props Interfaces ──────────────────────────────────────────────
interface CategoriaTagProps {
  categoria: Produto['categoria'];
}

interface ProdutoItemProps {
  produto: Produto;
  onPress: () => void;
}

// ─── Badge de categoria ─────────────────────────────────────────────
const CategoriaTag: React.FC<CategoriaTagProps> = ({ categoria }) => {
  const config = CATEGORIAS_CONFIG[categoria];
  
  return (
    <View style={[styles.tagCategoria, { backgroundColor: config.bg }]}>
      <Text style={[styles.tagCategoriaText, { color: config.color }]}>
        {categoria}
      </Text>
    </View>
  );
};

// ─── Item do produto ───────────────────────────────────────────────
const ProdutoItem: React.FC<ProdutoItemProps> = ({ produto, onPress }) => {
  const precoComIVA = produto.iva 
    ? (produto.preco * produto.iva/100 + produto.preco).toFixed(2) 
    : produto.preco.toString();

  return (
    <TouchableOpacity 
      style={styles.produtoCard} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.produtoLeft}>
        <Text style={styles.produtoNome}>{produto.nome}</Text>
        <CategoriaTag categoria={produto.categoria} />
      </View>
      <View style={styles.produtoRight}>
        <Text style={styles.produtoPreco}>
          {produto.preco.toLocaleString('pt-MZ')} MT
        </Text>
        <Text style={styles.produtoIVA}>
          {produto.iva ? `+ IVA ${produto.iva}% (${precoComIVA} MT)` : 'Sem IVA'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// ─── Ecrã de Produtos ──────────────────────────────────────────────
const ProdutosScreen = () => {
const [searchText, setSearchText] = useState<string>('');
//const [filtrados, setFiltrados] = useState<Produto[]>(PRODUTOS);

const [activeNav, setActiveNav] = useState(3);

const [produtos, setProdutos] = useState<Produto[]>(PRODUTOS);
const [filtrados, setFiltrados] = useState<Produto[]>(produtos);
const router = useRouter()
const [visible, setVisible] = useState(false);

const [nome, setNome] = useState('');
const [tipo, setTipo] = useState('');
const [preco, setPreco] = useState('');
const [iva, setIva] = useState('');

const tipos = [
  'Produto físico',
  'Projecto',
  'Licença',
  'Serviço',
  'Recorrente'
];
const [categories,setCategories] = useState(CATEGORIAS_CONFIG)
const [selectedCategory, setSelectedCategory] = useState<string>('');


const precoNum = parseFloat(preco) || 0;
const ivaNum = parseFloat(iva) || 0;

const total = precoNum + (precoNum * ivaNum / 100);

  function navigatePage(pageIndex:number)
  {
      setActiveNav(pageIndex)
      
      if (pageIndex === 2) {
          router.push("/(authenticated)/dashboard")
        }

       
      if (pageIndex === 4) {
          router.push("/(authenticated)/settings")
        }
  }
  
  const handleSearch = (text: string): void => {
    setSearchText(text);
    if (text === '') {
      setFiltrados(filtrados)
    } else {
      const filtered = produtos.filter(
        (p) =>
          p.nome.toLowerCase().includes(text.toLowerCase()) ||
          p.categoria.toLowerCase().includes(text.toLowerCase())
      );
      setFiltrados(filtered);
    }
  };

  const handleProdutoPress = (produto: Produto): void => {
    alert(`Produto: ${produto.nome}`);
  };

  const adicionarProduto = () =>
  {
    if (!nome || !selectedCategory || !preco) return;

  const novoProduto: Produto = {
    id: produtos.length + 1,
    nome,
    categoria: selectedCategory as Produto['categoria'],
    preco: precoNum,
    iva: ivaNum
  };

  const novaLista = [novoProduto, ...produtos];

  setProdutos(novaLista);
  setFiltrados(novaLista);

  setNome('');
  setPreco('');
  setIva('');
  setSelectedCategory('');

  setVisible(false);
  }

  return (


    <SafeAreaView style={styles.safe}>

      <Portal>
        <Dialog visible={visible} onDismiss={()=>setVisible(false)}
           style={{ backgroundColor: '#fff' }}>
          <Dialog.Title style={{color:'#000', fontSize:14,
            textAlign:'center',
            fontWeight:'bold'
          }}>
            Adicione um novo produto ou serviço
          </Dialog.Title>

          <Dialog.Content>
            <View>
              <View style={styles.dialogContentStyle}>
                <Text style={styles.dialogTextStyle}> Nome:</Text>
                <TextInput  value={nome} onChangeText={setNome}
                style={styles.TextFieldStyling}/>
              </View>

              <View style={styles.dialogContentStyle}>
                <Text style={styles.dialogTextStyle}> Categoria:</Text>
                
                <Select
                    label="Categorias"
                    placeholder="Selecione a categoria"
                    options ={Object.keys(categories).map((key) => ({
                      label: key,
                      value: key
                    }))}
                    selectedValue={selectedCategory}
                    onValueChange={setSelectedCategory}
                />
              </View>

              <View style={styles.dialogContentStyle}>
                <Text style={styles.dialogTextStyle}> Preço:</Text>
                <TextInput value={preco} onChangeText={setPreco}
                keyboardType='numeric'
                style={styles.TextFieldStyling}/>
              </View>

              <View style={styles.dialogContentStyle}>
                <Text style={styles.dialogTextStyle}> IVA:</Text>
                <TextInput
                 value={iva} onChangeText={setIva}
                 keyboardType='numeric'
                style={styles.TextFieldStyling}/>
              </View>

              <View style={styles.dialogContentStyle}>
                <Text style={styles.dialogTextStyle}>
                   Total: MZN {" "} {total.toFixed(2)}
                </Text>
               
              </View>

            </View>
            
          </Dialog.Content>
          <Dialog.Actions style={{flexDirection:'row',
            alignItems:'center'}}>

            <Button onPress={() => {console.log('OK')
              adicionarProduto()
            }}>
              <View style={{flexDirection:'row',
                justifyContent:'space-around', alignItems:'center'}}> 
                <Plus size={15} color={colors.blue} fontWeight={'bold'}/>
                <Text style={{color:colors.blue,
                  fontWeight:'bold'
                }}>Adicionar</Text> 
              </View>
            </Button>

            <Button onPress={() => setVisible(false)}
              style={{paddingTop:2}}>
                <Text style={{color:colors.blue,
                  fontWeight:'bold'
                }}>
                  Cancelar
                </Text> 
            </Button>
           
          </Dialog.Actions>
        </Dialog>
      </Portal>
    



    <StatusBar barStyle="light-content" backgroundColor="#185FA5" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Produtos e Serviços</Text>
          <Text style={styles.headerSub}>{filtrados.length} itens no catálogo</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Pesquisar produto ou serviço..."
          placeholderTextColor="#AEAEB2"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Lista de produtos */}
        {filtrados.length > 0 ? (
          filtrados.map((produto) => (
            <ProdutoItem
              key={produto.id}
              produto={produto}
              onPress={() => handleProdutoPress(produto)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Nenhum produto encontrado</Text>
          </View>
        )}

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* FAB - Novo Produto */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+ Novo Produto</Text>
      </TouchableOpacity>

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
            <Text style={[styles.navIcon, i === 3 && styles.navIconActive]}>
              <Icon color={'#5c5b5b'}/>
            </Text>
            <Text style={[styles.navLabel, i === 3 && styles.navLabelActive]}>
              {nav.label}
            </Text>
            {i === 3 && <View style={styles.navDot} />}
          </TouchableOpacity>
        )})}
      </View>
    </SafeAreaView>
  );
};

// ─── Estilos ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
   // backgroundColor: '#185FA5',
   backgroundColor: '#f4f6f9',
   
  },

  // Header
  header: {
    backgroundColor: '#185FA5',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderRadius:12,
    marginHorizontal:5
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 2,
    borderRadius:4,
    marginHorizontal:10
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
  },

  // Search container
  searchContainer: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
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
  },

  // ScrollView
  scroll: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    padding: 14,
  },

  // Produto card
  produtoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  produtoLeft: {
    flex: 1,
    gap: 6,
  },
  produtoNome: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  produtoRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  produtoPreco: {
    fontSize: 15,
    fontWeight: '500',
    color: '#185FA5',
  },
  produtoIVA: {
    fontSize: 11,
    color: '#8E8E93',
  },

  // Categoria tag
  tagCategoria: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    alignSelf: 'flex-start',
  },
  tagCategoriaText: {
    fontSize: 11,
    fontWeight: '500',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#8E8E93',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 130,
    right: 16,
    backgroundColor: '#185FA5',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#185FA5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },

  // Bottom nav
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
    paddingTop: 8,
    paddingBottom: 20,
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
  dialogTextStyle:
  {
     paddingRight:10,
     fontWeight:'bold',
     color:'#000'
  },
  dialogContentStyle:
  {
    flexDirection: 'row',
    alignItems:'center',
    marginBottom:10
  }, 
  
  TextFieldStyling:
  {
    marginTop:2,
    borderRadius:8,
    borderWidth:1,
    borderColor: '#7c7c7c6c',
    backgroundColor: '#eff3fd',
    color:'#000',
    flex: 1
  }
  
});

export default ProdutosScreen;