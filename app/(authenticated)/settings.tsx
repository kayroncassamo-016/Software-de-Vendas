import { colors } from '@/constants/theme';
import { useContexto } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import { Cog, Grid2X2, Handshake, Package, ShoppingBag } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  //SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

 
const ConfigScreen = () => {
 
  const NAV_ITEMS = [
  { icon: ShoppingBag , label: 'Vendas' },
    {icon:Handshake,label:'Clientes'},
    { icon: Grid2X2, label: 'Painel' },
    { icon: Package, label: 'Produtos' },
    { icon: Cog, label: 'Config.' },
];
  const [activeNav, setActiveNav] = useState(4);
  const router = useRouter()
  //const { signOut } = useContexto();
  //const { user } = useAuth();
  const { user,signOut} = useContexto();
  
 

  console.log("usuario now", user)
  console.log("usuario nome", user?.user.name)
  
  const [notificacoes, setNotificacoes] = useState(true);
  const [temaEscuro, setTemaEscuro] = useState(false);
 

  const [modalUsuario, setModalUsuario] = useState(false);
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false)

 
  

  const salvarUsuario = () => {
    //setUsuario({ nome, senha });
    setModalUsuario(false);
  };

  const Item = ({ label, value, onPress, toggle, onToggle }:any) => (
    <TouchableOpacity style={styles.item} onPress={onPress} disabled={toggle}>
    
      {toggle ? (
          <View style={{flexDirection:'row',
            alignItems:'center'
          }}>
              <Text style={styles.label}>{label}</Text>
              <Switch value={value} onValueChange={onToggle}
              style={{flex:1, }} />
          </View>

      ):
      (
        <View style={{flexDirection:'row',
          alignItems:'center'
        }}>
            <View style={{flex:1,}}>
              <Text style={styles.label}>{label}</Text>
              {value && <Text style={styles.value}>{value}</Text>}
            </View>
             <Text style={styles.arrow}>›</Text>
        </View>
      )}
    </TouchableOpacity>

  );
    function navigatePage(pageIndex:number)
    {
          setActiveNav(pageIndex)
          
          if (pageIndex === 2) {
              router.push("/(authenticated)/dashboard")
            }

          
          if (pageIndex === 3) {
              router.push("/(authenticated)/produtos")
            }

          if (pageIndex === 1) {
              router.push("/(authenticated)/clientes")
            }

          if (pageIndex === 0) 
          {
                router.push("/(authenticated)/vendasForm")
          }
    }

     async function sairDoSistema () {

      const token  = await AsyncStorage.getItem("@token")

      Alert.alert(
        'Sair',
        'Deseja realmente sair do sistema?',
        [
          {
            text: 'Não',
            style: 'cancel',
          },
          {
            text: 'Sim',
            onPress: () => {

              console.log('token eh este:', token)
              
                if(token){
                  signOut(token);
                }
              console.log('token eh este:', token)
              console.log('Usuário saiu');

              router.replace("/login/login")
              
            },
          },
        ],
        { cancelable: true }
      );
};






  return (
    <SafeAreaView style={[styles.safe,
       { backgroundColor: temaEscuro ? '#292828' : '#e4e4e4' }
    ]}>
      <StatusBar barStyle="light-content" backgroundColor="#185FA5" />

      {/* HEADER */}
      <View style={[styles.header,
         
      ]}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <ScrollView style={[styles.scroll,
        { backgroundColor: temaEscuro ? '#292828' : '#f4f6f9' }
      ]}>
        
        {/* EMPRESA */}
        <Text style={styles.section}>Usuário</Text>

        <Item
          label="Dados do usuário"
          value={`${user?.user.name} `}
          onPress={() => setModalUsuario(true)}
        />

        {/* PREFERENCIAS */}
        <Text style={styles.section}>Preferências</Text>

        <Item
          label="Notificações"
          value={notificacoes}
          toggle
          onToggle={setNotificacoes}
        />

        <Item
          label="Tema escuro"
          value={temaEscuro}
          toggle
          onToggle={setTemaEscuro}
        />

        {/* SESSAO */}
        <Text style={styles.section}>Sessão</Text>

        <Item
          label="Sair"
          onPress={() => sairDoSistema()}
        />

      </ScrollView>

      {/* MODAL EMPRESA */}
      <Modal visible={modalUsuario} animationType="slide">
        <SafeAreaView style={styles.modal}>
          <Text style={styles.modalTitle}>Usuário</Text>

          <TextInput
            placeholder="Nome"
            value={user?.user.name}
            onChangeText={setNome}
            style={styles.input}
          />
          <View style={styles.textFieldSenha}>
            <TextInput
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              style={[styles.input,{flex:1}]}
              secureTextEntry={!showSenha}
            />
            <Pressable onPress={() => setShowSenha(!showSenha)}
              style={styles.eyeIcon}
              >
               <Ionicons 
                 name={showSenha ? 'eye-off' : 'eye'}
                 size={24}
                 color="#999"
                />
            </Pressable>
           
          </View>
          
          <TouchableOpacity onPress={salvarUsuario} style={styles.btn}>
            <Text style={{ color: '#fff' }}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalUsuario(false)}
             style={styles.btnCancelar}>
            <Text style={{ 
              
              color:'#fff'
           }}>
                Cancelar
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

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
                  <Text style={[styles.navIcon, i === 4 && styles.navIconActive]}>
                    <Icon color={'#5c5b5b'}/>
                  </Text>
                  <Text style={[styles.navLabel, i === 4 && styles.navLabelActive]}>
                    {nav.label}
                  </Text>
                  {i === 4 && <View style={styles.navDot} />}
                </TouchableOpacity>
              )})}
            </View>
    </SafeAreaView>
  );
};

export default ConfigScreen;

const styles = StyleSheet.create({
  safe: { flex: 1,},

  header: {
    backgroundColor: '#185FA5',
    paddingHorizontal: 16,
    paddingVertical:22,
    paddingBottom: 14,
    borderRadius:12,
    marginHorizontal:5
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  scroll: {
    // backgroundColor: '#f4f6f9',
    flex: 1,
    padding: 10,
  },

  section: {
    marginTop: 20,
    marginBottom: 10,
    color: '#888',
    fontWeight: 'bold',
  },

  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
  },

  value: {
    fontSize: 12,
    color: '#666',
  },

  arrow: {
    fontSize: 18,
    color: '#999',
    // position: 'absolute',
    // left:325,
    
  },

  modal: {
    flex: 1,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  btn: {
    backgroundColor: colors.blue,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnCancelar:
  {
    marginTop:10,
    alignItems:'center',
    borderRadius:8,
    backgroundColor:colors.gray,
    padding:12
  },
  eyeIcon:
  {
    position:'absolute',
    right:5,
    paddingBottom:10
  },
  textFieldSenha:
  {
    flexDirection:'row',
    alignItems:'center',
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