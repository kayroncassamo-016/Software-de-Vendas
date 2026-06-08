import { colors } from "@/constants/theme";
import { api } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import {
    Alert,
    Modal,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';


interface AddUserProps
{
    visible:boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
}
export default function AddUser ({visible,setVisible}:AddUserProps)
{
      const [nomeNewUser, setNomeNewUser] = useState("");
      const [senhaNewUser, setSenhaNewUser] = useState("");
      const [emailNewUser, setEmailNewUser] = useState("");
      const [cargoNewUser, setCargoNewUser] = useState("");
      const [telefoneNewUser, setTelefoneNewUser] = useState("");
      const [showSenha, setShowSenha] = useState(false)


     async function adicionarUser()
     {
     
    const token  = await AsyncStorage.getItem("@token")
    const payload =
    {
      name:nomeNewUser,
      password: senhaNewUser,
      email:emailNewUser,
      cargo:cargoNewUser,
      telefone:telefoneNewUser
      
    }

     try {  
        await api.post ('/users',
           payload, {
           headers: { Authorization: `Bearer ${token}` },
              }   
            )        
            Alert.alert('Novo usuário cadastrado com sucesso!',)
      }
      catch (err:any)
      {
          console.log('erro: ',err.response)
      }
      finally
      {
       
      }
 }



    return (
        
      <Modal visible={visible} animationType="slide">
        <SafeAreaView style={styles.modal}>
          <Text style={styles.modalTitle}>Adicionar usuário</Text>

          <Text style={{marginBottom:2}}>Nome: </Text>
          <TextInput
            placeholder="Digite o nome"
              value={nomeNewUser}
            onChangeText={setNomeNewUser}
            style={styles.input}  />
        
          <Text style={{marginBottom:2}}>Email: </Text>
          <TextInput
            placeholder="Digite o email"
              value={emailNewUser}
            onChangeText={setEmailNewUser}
            style={styles.input}  />


          <Text style={{marginBottom:2}}>Senha: </Text>
          <View style={styles.textFieldSenha}>
            <TextInput
              placeholder="Digite a senha"
              value={senhaNewUser}
              onChangeText={setSenhaNewUser}
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

           <Text style={{marginBottom:2}}>Cargo: </Text>
           <TextInput
            placeholder="Digite o cargo, e.g. vendedor, gerente ou stockista"
              value={cargoNewUser}
            onChangeText={setCargoNewUser}
            style={styles.input}  />

           <Text style={{marginBottom:2}}>Telefone: </Text>
           <TextInput
            placeholder="Digite o telefone"
            value={telefoneNewUser}
            onChangeText={setTelefoneNewUser}
            keyboardType='numeric'
            style={styles.input}  />

       
          
          <TouchableOpacity onPress={adicionarUser} style={styles.btn}>
            <Text style={{ color: '#fff' }}>Adicionar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setVisible(false)}
             style={styles.btnCancelar}>
            <Text style={{ 
              
              color:'#fff'
           }}>
                Voltar
                
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

    )
}


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
  buttonPermissions:
  {
    borderWidth:2,
    borderRadius:8,
    borderColor:'#a7a6a6',
    padding:5,
    margin:5,
    flexDirection:'row',
    alignItems:'center',
    gap:8
  }
});