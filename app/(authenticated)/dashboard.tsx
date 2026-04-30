import { useLocalSearchParams, useRouter } from "expo-router";
import { Cog, Grid2X2, Handshake, Package, ShoppingBag } from 'lucide-react-native';
import { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet, Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashBoard () {
  
 const router = useRouter()

 const {name} = useLocalSearchParams<{

        name:string,
    }>();
   const [activeNav, setActiveNav] = useState(2);
  
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
        <Text style={styles.greeting}>Bom dia, {name}</Text>
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
          <Text style={styles.cardTitle}>Clientes activos</Text>
          <Text style={styles.value}>18</Text>
          <Text style={styles.neutral}>+2 novos</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Produtos totais</Text>
          <Text style={styles.value}>25</Text>       
          <Text style={styles.positive}>19 activos</Text>
          <Text style={styles.neutral}>+2 novos</Text>
          <Text style={styles.danger}>6 inactivos</Text>

        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Empresas</Text>
          <Text style={styles.value}>7</Text>       
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
    backgroundColor: '#f4f6f9',
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

// });

// import { useLocalSearchParams } from "expo-router";
// import React, { useState } from 'react';

// import {
//   Dimensions,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
 
// const { width } = Dimensions.get('window');

// // ─── Dados de exemplo ───────────────────────────────────────────────
// const STATS = [
//   { label: 'Facturado (mês)', value: '245.800 MT', trend: '↑ 12% vs março', trendUp: true },
//   { label: 'Por receber',     value: '87.300 MT',  trend: '3 facturas pendentes', trendUp: false },
//   { label: 'Facturas emitidas', value: '34',       trend: '↑ 8 vs março', trendUp: true },
//   { label: 'Clientes activos',  value: '18',       trend: '+2 novos', trendUp: true },
// ];

// const CHART_DATA = [
//   { mes: 'Out', valor: 35 },
//   { mes: 'Nov', valor: 50 },
//   { mes: 'Dez', valor: 45 },
//   { mes: 'Jan', valor: 65 },
//   { mes: 'Fev', valor: 55 },
//   { mes: 'Mar', valor: 80 },
//   { mes: 'Abr', valor: 100 },
// ];

// const FACTURAS = [
//   { num: 'FT 2026/034', cliente: 'Shoprite Moçambique',    data: '22 Abr 2026', valor: '42.500 MT', estado: 'Pago' },
//   { num: 'FT 2026/033', cliente: 'Telecomunicações Lda',   data: '20 Abr 2026', valor: '18.750 MT', estado: 'Pendente' },
//   { num: 'FT 2026/032', cliente: 'BCI — Fomento',          data: '18 Abr 2026', valor: '95.000 MT', estado: 'Pago' },
//   { num: 'FT 2026/031', cliente: 'Grupo Madal',            data: '15 Abr 2026', valor: '33.200 MT', estado: 'Pendente' },
// ];

// const NAV_ITEMS = [
//   { icon: '⊞', label: 'Painel' },
//   { icon: '◻', label: 'Facturas' },
//   { icon: '👤', label: 'Clientes' },
//   { icon: '☰', label: 'Produtos' },
//   { icon: '⚙', label: 'Config.' },
// ];

// // ─── Badge de estado ─────────────────────────────────────────────────
// function Badge({ estado }:{ estado: 'Pago' | 'Pendente' | 'Cancelado' }) {
//   const config = {
//     Pago:      { bg: '#EAF3DE', color: '#3B6D11' },
//     Pendente:  { bg: '#FAEEDA', color: '#854F0B' },
//     Cancelado: { bg: '#FCEBEB', color: '#A32D2D' },
//   };
//   const { bg, color } = config[estado] || config.Pago;
//   return (
//     <View style={[styles.badge, { backgroundColor: bg }]}>
//       <Text style={[styles.badgeText, { color }]}>{estado}</Text>
//     </View>
//   );
// }

// // ─── Barra do mini gráfico ────────────────────────────────────────────
// function BarChart() {
//   const maxVal = Math.max(...CHART_DATA.map(d => d.valor));
//   const barMaxHeight = 52;

//   return (
//     <View>
//       <Text style={styles.sectionTitle}>Receita mensal (MT)</Text>
//       <View style={styles.chartContainer}>
//         {CHART_DATA.map((item, i) => {
//           const isLast = i === CHART_DATA.length - 1;
//           const height = (item.valor / maxVal) * barMaxHeight;
//           return (
//             <View key={item.mes} style={styles.barWrapper}>
//               <View
//                 style={[
//                   styles.bar,
//                   { height, backgroundColor: isLast ? '#185FA5' : '#B5D4F4' },
//                 ]}
//               />
//               <Text style={styles.barLabel}>{item.mes}</Text>
//             </View>
//           );
//         })}
//       </View>
//     </View>
//   );
// }

// // ─── Item de factura ──────────────────────────────────────────────────
// function FacturaItem({ item }:any) {
//   return (
//     <TouchableOpacity style={styles.facturaCard} activeOpacity={0.7}>
//       <View style={styles.facturaLeft}>
//         <Text style={styles.facturaNum}>{item.num}</Text>
//         <Text style={styles.facturaCliente}>{item.cliente}</Text>
//         <Text style={styles.facturaData}>{item.data}</Text>
//       </View>
//       <View style={styles.facturaRight}>
//         <Text style={styles.facturaValor}>{item.valor}</Text>
//         <Badge estado={item.estado} />
//       </View>
//     </TouchableOpacity>
//   );
// }

// // ─── Ecrã principal ───────────────────────────────────────────────────
// export default function DashboardScreen() {
//   const {name} = useLocalSearchParams<{

//         name:string,
//     }>()

//   const [activeNav, setActiveNav] = useState(0);

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="light-content" backgroundColor="#185FA5" />

//       {/* Header */}
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.headerGreeting}>Bom dia, {name}</Text>
//           <Text style={styles.headerSub}>Facturação — Abril 2026</Text>
//         </View>
//         <View style={styles.avatar}>
//           <Text style={styles.avatarText}>CA</Text>
//         </View>
//       </View>

//       <ScrollView
//         style={styles.scroll}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Cards de estatísticas */}
//         <View style={styles.statsGrid}>
//           {STATS.map((stat, i) => (
//             <View key={i} style={styles.statCard}>
//               <Text style={styles.statLabel}>{stat.label}</Text>
//               <Text style={styles.statValue}>{stat.value}</Text>
//               <Text style={[styles.statTrend, { color: stat.trendUp ? '#1D9E75' : '#E24B4A' }]}>
//                 {stat.trend}
//               </Text>
//             </View>
//           ))}
//         </View>

//         {/* Gráfico */}
//         <View style={styles.card}>
//           <BarChart />
//         </View>

//         {/* Facturas recentes */}
//         <Text style={styles.sectionTitle}>Facturas recentes</Text>
//         {FACTURAS.map((item, i) => (
//           <FacturaItem key={i} item={item} />
//         ))}

//         <View style={{ height: 16 }} />
//       </ScrollView>

//       {/* Bottom Navigation */}
//       <View style={styles.bottomNav}>
//         {NAV_ITEMS.map((nav, i) => (
//           <TouchableOpacity
//             key={i}
//             style={styles.navItem}
//             onPress={() => setActiveNav(i)}
//             activeOpacity={0.7}
//           >
//             <Text style={[styles.navIcon, i === activeNav && styles.navIconActive]}>
//               {nav.icon}
//             </Text>
//             <Text style={[styles.navLabel, i === activeNav && styles.navLabelActive]}>
//               {nav.label}
//             </Text>
//             {i === activeNav && <View style={styles.navDot} />}
//           </TouchableOpacity>
//         ))}
//       </View>
//     </SafeAreaView>
//   );
// }

// // ─── Estilos ──────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: '#185FA5',
//   },

//   // Header
//   header: {
//     backgroundColor: '#185FA5',
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     paddingBottom: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   headerGreeting: {
//     fontSize: 18,
//     fontWeight: '500',
//     color: '#fff',
//     marginBottom: 2,
//   },
//   headerSub: {
//     fontSize: 12,
//     color: 'rgba(255,255,255,0.75)',
//   },
//   avatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   avatarText: {
//     fontSize: 13,
//     fontWeight: '500',
//     color: '#fff',
//   },

//   // ScrollView
//   scroll: {
//     flex: 1,
//     backgroundColor: '#F2F2F7',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   scrollContent: {
//     padding: 14,
//   },

//   // Stats grid
//   statsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 10,
//     marginBottom: 14,
//   },
//   statCard: {
//     width: (width - 42) / 2,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     borderWidth: 0.5,
//     borderColor: '#E5E5EA',
//     padding: 12,
//   },
//   statLabel: {
//     fontSize: 11,
//     color: '#8E8E93',
//     marginBottom: 4,
//   },
//   statValue: {
//     fontSize: 18,
//     fontWeight: '500',
//     color: '#1C1C1E',
//     marginBottom: 3,
//   },
//   statTrend: {
//     fontSize: 11,
//   },

//   // Card genérico
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     borderWidth: 0.5,
//     borderColor: '#E5E5EA',
//     padding: 14,
//     marginBottom: 14,
//   },

//   // Gráfico
//   sectionTitle: {
//     fontSize: 13,
//     fontWeight: '500',
//     color: '#8E8E93',
//     marginBottom: 10,
//     marginTop: 4,
//   },
//   chartContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     gap: 5,
//     height: 68,
//   },
//   barWrapper: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//   },
//   bar: {
//     width: '100%',
//     borderRadius: 3,
//     marginBottom: 4,
//   },
//   barLabel: {
//     fontSize: 9,
//     color: '#8E8E93',
//   },

//   // Factura card
//   facturaCard: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     borderWidth: 0.5,
//     borderColor: '#E5E5EA',
//     padding: 12,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   facturaLeft: {
//     flex: 1,
//     gap: 3,
//   },
//   facturaNum: {
//     fontSize: 11,
//     color: '#8E8E93',
//   },
//   facturaCliente: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#1C1C1E',
//   },
//   facturaData: {
//     fontSize: 11,
//     color: '#8E8E93',
//   },
//   facturaRight: {
//     alignItems: 'flex-end',
//     gap: 5,
//   },
//   facturaValor: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#1C1C1E',
//   },

//   // Badge
//   badge: {
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 99,
//   },
//   badgeText: {
//     fontSize: 11,
//     fontWeight: '500',
//   },

//   // Bottom nav
//   bottomNav: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderTopWidth: 0.5,
//     borderTopColor: '#E5E5EA',
//     paddingTop: 8,
//     paddingBottom: 20,
//   },
//   navItem: {
//     flex: 1,
//     alignItems: 'center',
//     gap: 3,
//   },
//   navIcon: {
//     fontSize: 18,
//     color: '#8E8E93',
//   },
//   navIconActive: {
//     color: '#185FA5',
//   },
//   navLabel: {
//     fontSize: 10,
//     color: '#8E8E93',
//   },
//   navLabelActive: {
//     color: '#185FA5',
//     fontWeight: '500',
//   },
//   navDot: {
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: '#185FA5',
//     marginTop: 1,
//   },
// });
