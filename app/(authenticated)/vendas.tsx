import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import { Cog, Grid2X2, Handshake, Package, Plus, ShoppingBag } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  // SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
//import { Swipeable } from 'react-native-gesture-handler';
import 'react-native-gesture-handler';
// import Swipeable from 'react-native-gesture-handler/Swipeable';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from '@/constants/theme';
import { api } from '@/services/api';
import { Vendas } from '@/types/types';
import { useRef } from 'react';



const NAV_ITEMS = [
  { icon: ShoppingBag , label: 'Vendas' },
    {icon:Handshake,label:'Clientes'},
    { icon: Grid2X2, label: 'Painel' },
    { icon: Package, label: 'Produtos' },
    { icon: Cog, label: 'Config.' },
];

 //─── Badge de cliente ─────────────────────────────────────────────
const BadgeEstadoVenda = ({estado} :any) => {
  
  if (estado === 'CONFIRMADO')
  {
    return (
      <View>
        <Text style ={{
          backgroundColor: '#b9fcce',
          color:'#3fa04c',
          paddingHorizontal:5,
          paddingVertical:2,
          borderRadius:20,
          fontSize:11,
          fontWeight:500
        }}
        >
          {estado}
        
        </Text>
      
        {/* <TouchableOpacity
        style={{position:'absolute',
          top:30,
          left:10
          }}
        >
        <Text style={{
          fontSize:10,
          }}>
            Exportar em pdf
        </Text>
        </TouchableOpacity> */}
      </View>
    )
  }
  else if (estado === 'CANCELADO')
  {
      return (
      <Text style ={{
        
        backgroundColor: '#f58d8d',
        color:'#8d3131',
        padding:1,
        borderRadius:20,
        fontSize:11,
        paddingHorizontal:5,
        paddingVertical:2,
        fontWeight:500
      }}
      >
        {estado}
      
      </Text>
      )
   } 
    else if (estado ==='RASCUNHO')
    {
      return (
      <Text style ={{
        
        backgroundColor: '#ffe2b6',
        color:'#966f34',
        padding:1,
        borderRadius:20,
        fontSize:11,
        paddingHorizontal:5,
        paddingVertical:2,
        fontWeight:500
      }}
      >
        {estado}
      
      </Text>
    )
  }

};

interface clienteItemProps
{
    venda: Vendas
    onPress : () => void
}




// ─── Ecrã de clientes ──────────────────────────────────────────────
export default function VendasList ()  {

const [searchText, setSearchText] = useState<string>('');
const [activeNav, setActiveNav] = useState(0);

const [vendas, setVendas] = useState<Vendas[]>([]);
const [loadingClientes,setLoadingClientes] = useState(false)
const [filtrados, setFiltrados] = useState<Vendas[]>([]);
const [vendaSeleccionada, setVendaSeleccionada] = useState<Vendas|null>(null)



const router = useRouter()






const VendaItem = ({ venda, onPress }: clienteItemProps) => {

  const swipeableRef = useRef<any>(null);

  const confirmarVenda = async () => {
    try {
      const token = await AsyncStorage.getItem("@token");

      await api.post(`/documentos/confirm/${venda.id}`, 
       // { estado: "CONFIRMADO" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      swipeableRef.current?.close() 
      

      setVendas(prev =>
        prev.map(v =>
          v.id === venda.id ? { ...v, estado: "CONFIRMADO" } : v
        )
      );

      setFiltrados(prev =>
        prev.map(v =>
          v.id === venda.id ? { ...v, estado: "CONFIRMADO" } : v
        )
      );

    } catch (err:any) {
      console.log(err);
      console.log(err.response);
    }
  };


  const cancelarVenda = async () => {

  try {

    const token = await AsyncStorage.getItem("@token");

    await api.post(
      `/documentos/cancel/${venda.id}`,
      //{ estado: "CANCELADO" },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setVendas(prev =>
      prev.map(v =>
        v.id === venda.id
          ? { ...v, estado: "CANCELADO" }
          : v
      )
    );

    setFiltrados(prev =>
      prev.map(v =>
        v.id === venda.id
          ? { ...v, estado: "CANCELADO" }
          : v
      )
    );

    swipeableRef.current?.close();

  } catch (err:any) {
    console.log(err);
      console.log(err.response);

  }

};

  const renderRightActions = () => (
    <View style={{
      justifyContent: 'center',
      backgroundColor: '#3fa04c',
      paddingHorizontal: 20,
      flex: 1,
      borderRadius: 12,
      marginBottom: 8
    }}>
      <Text style={{ color: '#fff', fontWeight: '600' }}>
        Confirmar venda →
      </Text>
    </View>
  );

  const renderLeftActions = () => (
    <View style={{
      justifyContent: 'center',
      backgroundColor: '#d44e4e',
      paddingHorizontal: 20,
      alignItems:'flex-start',
      flex: 1,
      borderRadius: 12,
      marginBottom: 8
    }}>
      <Text style={{ color: '#fff', fontWeight: '600' }}>
         ← Cancelar venda 
      </Text>
    </View>
  );



    return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions= {
         renderRightActions
        
        }
      renderLeftActions={ 
         renderLeftActions

        }
      onSwipeableOpen={(direction) => {

        if (direction ==='left' && venda.estado ==='RASCUNHO'){
        
          Alert.alert(
          "Confirmar venda",
          "Queres confirmar esta venda?",
          [
            { text: "Cancelar", style: "cancel",  
              onPress: () => swipeableRef.current?.close() },
            { text: "Sim", onPress: confirmarVenda }
          ]
        );
      }
      else  if (direction ==='left' && venda.estado ==='CONFIRMADO'){
        Alert.alert(
          'Não é possível confirmar uma venda já confirmada!',
           ' Venda já confirmada',
          [
            { text: "Ok", style: "cancel",  
              onPress: () => swipeableRef.current?.close() },
          ]
        );
      }

      else  if (direction ==='left' && venda.estado ==='CANCELADO'){
        Alert.alert(
          'Não é possível confirmar uma venda já cancelada!',
           ' Venda já cancelada.',
          [
            { text: "Ok", style: "cancel",  
              onPress: () => swipeableRef.current?.close() },
          ]
        );
      }

      if (direction ==='right'&& venda.estado ==='RASCUNHO'){
        Alert.alert(
        "Cancelar venda",
        "Queres cancelar esta venda?",
      [
        {
          text: "Não",
          style: "cancel",
          onPress: () => swipeableRef.current?.close()
        },
        {
          text: "Sim",
          onPress: cancelarVenda
        }
      ]
    );
  }
      else if (direction ==='right'&& venda.estado ==='CONFIRMADO')
        {
        Alert.alert (
          "Cancelar venda",
          "Queres cancelar esta venda?",
        [  
        {
          text: "Não",
          style: "cancel",
          onPress: () => swipeableRef.current?.close()
        },
        {
          text: "Sim",
          onPress: cancelarVenda
        }
      
      ]
    );
  }

    else if (direction ==='right' && venda.estado ==='CANCELADO'){
        Alert.alert(
         'Não é possível cancelar uma venda já cancelada!',
           ' Venda já cancelada.',
        [
        {
          text: "Ok",
          style: "cancel",
          onPress: () => swipeableRef.current?.close()
        },
      
      ]
    );
  }
       
      }}
    >
      <TouchableOpacity
        style={styles.clienteCard}
        onPress={onPress}
      >
        <View style={styles.clienteLeft}>
          <Text style={styles.clienteNome}>{venda.nome_doc}</Text>
          <Text style={{ color: '#838282' }}>
            {venda.ano_serie}
          </Text>
        </View>

        <BadgeEstadoVenda estado={venda.estado} />
      </TouchableOpacity>
    </Swipeable>
  );
};



  function navigatePage(pageIndex:number)
  {
      setActiveNav(pageIndex)
      
      if (pageIndex === 2) 
      {
          router.push("/(authenticated)/dashboard")
      }

       
      if (pageIndex === 4) 
      {
          router.push("/(authenticated)/settings")
      }

       if (pageIndex === 3) 
       {
            router.push("/(authenticated)/produtos")
       }

       if (pageIndex === 1) 
       {
            router.push("/(authenticated)/clientes")
       }

       
  }
  
  const handleSearch = (text: string): void => {
    setSearchText(text);
   
    if (text === '') {
      
        setFiltrados(vendas)
   
    } else {
      const filtered = vendas.filter(
        (c) =>
          c.nome_doc.toLowerCase().includes(text.toLowerCase()) ||
          c.estado.toLowerCase().includes(text.toLowerCase())
      );
      setFiltrados(filtered);
    }
     


  };

useEffect(() =>
{
    async function loadData()
    {
        await loadVendas()
    }

     loadData()
   
},[])

  async function loadVendas()
  {
    const token  = await AsyncStorage.getItem("@token")

        try
          {
            setLoadingClientes(true)

            const response = await api.get("/documentos",
               {
               headers: { Authorization: `Bearer ${token}` },
               }   
            )
            const vendasAPI = response.data.data.data; // 

            setVendas(response.data.data.data)
            setFiltrados(response.data.data.data)
             
            console.log(JSON.stringify(vendasAPI, null, 2));

          }

        catch(err:any)
        {
            console.log(err.response)
        }

        finally
        {
            setLoadingClientes(false)
        }
    }

    function AbrirVendasForm()
    {
        router.push('/(authenticated)/vendasForm')
    }

    function AbrirVendasFormRascunho()
    {
         router.push({
            pathname:"/(authenticated)/vendasForm",
            params:
            {
              id: vendaSeleccionada?.id,
            
            }
        })
    }



  return (
    
    
    <SafeAreaView style={styles.safe}>

    <StatusBar barStyle="light-content" backgroundColor="#185FA5" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{flexDirection:'row',
            justifyContent:'space-between',
            
            
            }}>
          <View>
            <Text style={styles.headerTitle}>Vendas</Text>
            <Text style={styles.headerSub}>{filtrados?.length || 0} Vendas no catálogo</Text>
          </View>

          <TouchableOpacity onPress={() => AbrirVendasForm()}
            style={{paddingTop:10}}>
            <Plus color={'#fff'} fontWeight={900}/>
          </TouchableOpacity>
        
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Pesquisar venda..."
          placeholderTextColor="#AEAEB2"
          value={searchText}
          onChangeText={handleSearch}
        />
        
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
       {
         loadingClientes?
         
          (<View style = {styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.blue}/>
          </View>
          ):
            filtrados.length > 0 ? (
            filtrados.map((venda,index) => (
            <VendaItem
              key={index}
              venda={venda}
              onPress={() => {
                 router.push({
                  pathname: "/components/Vendas/AbrirRascunho",
                  params: {
                    id: venda.id,
                  }
            })
              }}
            />
             ))
            ): (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Nenhuma venda encontrada</Text>
              </View>
          )
        }

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* FAB - Novo cliente */}
      {/* <TouchableOpacity 
        style={styles.fab}
         onPress={() => setVisibleFormCadastro(true)}
        activeOpacity={0.8}>
      
        <Text style={styles.fabText}>+ Novo cliente</Text>
      </TouchableOpacity> */}

      
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
            <Text style={[styles.navLabel, i === 0 && styles.navLabelActive]}>
              {nav.label}
            </Text>
            {i === 0 && <View style={styles.navDot} />}
          </TouchableOpacity>
        )})}
      </View>



    </SafeAreaView>
  );
};







// // ─── Estilos ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
   // backgroundColor: '#185FA5',
   backgroundColor: '#e4e4e4',
   borderBottomWidth: 2,
  },

  // Header
  header: {
    backgroundColor: '#185FA5',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    // borderBottomLeftRadius: 10,
    // borderBottomRightRadius: 10,
   
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
    // backgroundColor: '#fff',
    // borderRadius: 12,
    // borderWidth: 0.5,
    // borderColor: '#E5E5EA',
    // paddingHorizontal: 14,
    // paddingVertical: 11,
    // fontSize: 13,
    // color: '#1C1C1E',

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

  // ScrollView
  scroll: {
    flex: 1,
     backgroundColor: '#F2F2F7', 
  },
  scrollContent: {
    padding: 20,
  },

  // cliente card
  clienteCard: {
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
  clienteLeft: {
    flex: 1,
    gap: 6,
  },
  clienteNome: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  clienteRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  clientePreco: {
    fontSize: 15,
    fontWeight: '500',
    color: '#185FA5',
  },
  clienteIVA: {
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
  dialogTextIsencao:
  {
     paddingRight:10,
     fontWeight:'bold',
     color:'#4ef097'
  },
  dialogContentStyle:
  {
    flexDirection: 'row',
    alignItems:'center',
    marginBottom:10
  }, 

  dialogContent:
  {
    flexDirection: 'row',
    alignItems:'center',
    marginBottom:2
    
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
  },

  loadingContainer:
  {
    flex:1,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor: '#F2F2F7',

  },

}) 

;







