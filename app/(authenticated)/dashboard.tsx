import { useContexto } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { useRouter } from "expo-router";
import { Cog, Grid2X2, Handshake, Package, ShoppingBag } from 'lucide-react-native';
import { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet, Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashBoard () {
 
  const [loadingProductNumber, SetLoadingProductNumber] = useState(false)
  const [loadingClienteNumber, SetLoadingClienteNumber] = useState(false)
  const [loadingVendasNumber, SetLoadingVendasNumber] = useState(false)
  const router = useRouter()
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalVendas, setTotalVendas] = useState(0);

  const {user} = useContexto()

  const [activeNav, setActiveNav] = useState(2);


  useEffect(() => {

  async function loadStats() {
    loadingProductStats()
    loadingClienteStats()
    loadingVendasStats()
  }

  loadStats();
   console.log("ENTROU");
  return () => {
    console.log("SAIU");
  };
}, []);

async function loadingClienteStats()
  {
    try{

        SetLoadingClienteNumber(true)
        const res =  await api.get("/clientes");
        setTotalClientes(res.data.data.length);

    }
    catch (err)
    {
      if (err instanceof Error)
        console.log(err.message)
    }
    finally
    {
      SetLoadingClienteNumber(false)

    }
  }
  
  async function loadingProductStats()
  {
    try{

        SetLoadingProductNumber(true)
        const res =  await api.get("/produtos");
        setTotalProdutos(res.data.data.length);

    }
    catch (err)
    {
      if (err instanceof Error)
        console.log(err.message)
    }
    finally
    {
      SetLoadingProductNumber(false)

    }
  }

  async function loadingVendasStats()
  {
    try
    {

        SetLoadingVendasNumber(true)
        const res =  await api.get("/documentos");
        setTotalVendas(res.data.data.data.length);

    }
    catch (err:any)
    {
    
        console.log(err.response)
    }
    finally
    {
      SetLoadingVendasNumber(false)

    }
  }
  
  
   function navigatePage(pageIndex:number)
   {
      setActiveNav(pageIndex)
      
      if (pageIndex === 3) 
      {
        router.push("/(authenticated)/produtos")
      }
      if (pageIndex === 4) 
      {
        router.push("/(authenticated)/settings")
      }

      if (pageIndex === 1) 
      {
          router.push("/(authenticated)/clientes")
      }

      if (pageIndex === 0) 
      {
          router.push("/(authenticated)/vendas")
      }
  }

   

  const NAV_ITEMS = [
    
    { icon: ShoppingBag , label: 'Vendas' },
    {icon:Handshake,label:'Clientes'},
    { icon: Grid2X2, label: 'Painel' },
    { icon: Package, label: 'Produtos' },
    { icon: Cog, label: 'Config.' },
  ];

  const FACTURAS = [
  { num: 'FT 2026/034', cliente: 'Kayron Cassamo',    data: '22 Abr 2026', valor: '42.500 MT', estado: 'Pago' },
  { num: 'FT 2026/033', cliente: 'Guifty',   data: '20 Abr 2026', valor: '18.750 MT', estado: 'Pendente' },
  { num: 'FT 2026/032', cliente: 'Guilherme',          data: '18 Abr 2026', valor: '95.000 MT', estado: 'Pago' },
  { num: 'FT 2026/031', cliente: 'Momade Gafar',            data: '15 Abr 2026', valor: '33.200 MT', estado: 'Pendente' },
  ];
  
  function Badge({ estado }:{ estado: 'Pago' | 'Pendente' | 'Cancelado' }) {
  const config = {
    Pago: { bg: '#EAF3DE', color: '#3B6D11' },
    Pendente:  { bg: '#FAEEDA', color: '#854F0B' },
    Cancelado: { bg: '#FCEBEB', color: '#A32D2D' },
  };
  const { bg, color } = config[estado] || config.Pago;
  
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color }]}>{estado}</Text>
    </View>
  );
}

  function FacturaItem({ item }:any) {
  return (
   
    <TouchableOpacity style={styles.facturaCard}>
      <View style={styles.facturaLeft}>
        <Text style={styles.facturaNum}>{item.num}</Text>
        <Text style={styles.facturaCliente}>{item.cliente}</Text>
        <Text style={styles.facturaData}>{item.data}</Text>
      </View>
      <View style={styles.facturaRight}>
        <Text style={styles.facturaValor}>{item.valor}</Text>
        <Badge estado={item.estado} />
      </View>
    </TouchableOpacity>
    
  );
}


  return (
   
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#185FA5" />
        <ScrollView showsVerticalScrollIndicator={false}>

     
      <View style={styles.header}>
        <Text style={styles.greeting}>Bom dia, {user?.user.name}</Text>
        <Text style={styles.subtitle}>Facturação — Abril 2026</Text>
      </View>

  
      <View style={styles.grid}>

        {/* Faturado */}
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Faturado (mês)</Text>
          <Text style={styles.value}>245.800 MT</Text>
          <Text style={styles.positive}>↑ 12% vs março</Text>
        </View>

    
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Por receber</Text>
          <Text style={styles.value}>87.300 MT</Text>
          <Text style={styles.danger}>3 facturas pendentes</Text>
        </View>

    
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Facturas emitidas</Text>
          <Text style={styles.value}>34</Text>
          <Text style={styles.positive}>↑ 8 vs março</Text>
        </View>

      
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Clientes totais</Text>
           {
              loadingClienteNumber?
              (
                 <Text style={{
                  fontStyle:"italic",
                  fontSize:10
                 }}>
                     Carregando...
                  </Text>
              ):
              (
                <Text style={styles.value}>{totalClientes}</Text>
              )
            }
          <Text style={styles.neutral}>+2 novos</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Produtos totais</Text>
          
            {
              loadingProductNumber?
              (
                 <Text style={{
                  fontStyle:"italic",
                  fontSize:10
                 }}>
                     Carregando...
                  </Text>
              ):
              (
                <Text style={styles.value}>{totalProdutos}</Text>
              )
            }
            
          {/* // </Text>        */}
          <Text style={styles.positive}>x activos</Text>
          <Text style={styles.neutral}>+y novos</Text>
          <Text style={styles.danger}>z inactivos</Text>

        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Vendas totais</Text>  
          {
              loadingVendasNumber?
              (
                 <Text style={{
                  fontStyle:"italic",
                  fontSize:10
                 }}>
                     Carregando...
                  </Text>
              ):
              (
                <Text style={styles.value}>{totalVendas}</Text>
              )
            }
          <Text style={styles.positive}>↑ 2 vs março</Text>
        </View>
      </View>

        {/* Facturas recentes */}
      <View style= {styles.facturaContainer}>
        <Text style={styles.sectionTitle}>Clientes - facturas recentes</Text>

        {FACTURAS.map((item, i) => (
        <FacturaItem key={i} item={item} />
         ))}
      </View>

      <View>
          <Text>gergregeghege</Text>
      </View>  
      </ScrollView>
    

        <View style={styles.bottomNav}>
        {NAV_ITEMS.map((nav, i) => {
          const Icon = nav.icon
          return (
          <TouchableOpacity
            key={i}
            style={styles.navItem}
            onPress={() => navigatePage(i)}
            activeOpacity={0.7}
          > 
            <Text style={[styles.navIcon, i === activeNav && styles.navIconActive]}>
               <Icon color={'#5c5b5b'}/>
            </Text >
            
            <Text style={[styles.navLabel, i === activeNav && styles.navLabelActive]}>
              {nav.label}
            </Text>
            {i === activeNav && <View style={styles.navDot} />}
          </TouchableOpacity>
        )})}
      </View> 
       </SafeAreaView>
    
        

  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e4e4e4',
    // marginHorizontal: 10,
  },
  safe:
  {
    flex:1,
    // backgroundColor: '#185FA5',
  },

  header: {
    backgroundColor: '#1e5aa8',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    marginHorizontal:5
  },

  greeting: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#dbe7ff',
    marginTop: 4,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderWidth:2,
    borderColor:'#000',
    margin:10
  },

  card: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },

  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
  },

  positive: {
    color: 'green',
    fontSize: 12,
    marginTop: 5,
  },

  danger: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },

  neutral: {
    color: '#555',
    fontSize: 12,
    marginTop: 5,
  },
 
  facturaLeft: {
    flex: 1,
    gap: 3,
  },
  facturaNum: {
    fontSize: 11,
    color: '#8E8E93',
  },
  facturaCliente: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  facturaData: {
    fontSize: 11,
    color: '#8E8E93',
  },
  facturaRight: {
    alignItems: 'flex-end',
    gap: 5,
  },
  facturaValor: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  facturaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    
  },
  facturaContainer:
  {
    marginBottom:20,
    marginHorizontal:10

  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 10,
    marginTop: 4,
  },

statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
    paddingTop: 8,
    paddingBottom: 20,
    width:'100%'
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  iconComponent:
  {
    color:'#8e8e93'
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
});
