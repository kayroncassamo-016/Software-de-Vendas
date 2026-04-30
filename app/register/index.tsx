
import { Ionicons } from '@expo/vector-icons';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet, Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { useState } from 'react';

export default function Register() {

  const [showPassword,setShowPassword] = useState(false);
  const [senha, setSenha] = useState("");
  const [email, setEmail] = useState("");  
  const [nome, setNome] = useState("");
  
     function handleLogin()
     {
         if(!email.trim() || !senha.trim() || !nome.trim())
          {
              Alert.alert("Atenção", "Preencha todos os campos!")
              return
          }
     }

  return (
    <KeyboardAvoidingView style={styles.container}
    behavior={'height'}>
  
    <ScrollView contentContainerStyle ={styles.scrollContent}
      keyboardShouldPersistTaps="handled">
      
      <View>  
         <View style ={styles.logoContent}>
            <Image source={require('../assets/logo.png')} 
             style ={styles.LogoStyling}
            />
         </View>

         <Text style={styles.title}>
          Software de Facturação
         </Text>
      </View>


      <View style={styles.mainContent}
      >

        <Text style ={styles.label}>Nome:</Text>
        <TextInput
            placeholder="Digite o seu nome"
            placeholderTextColor="#999"
            style = {styles.TextFieldStyling}
            onChangeText={setNome}
        />

        <Text style ={[styles.label,{paddingTop:10}]}>Email:</Text>
        <TextInput
            placeholder="Digite o seu email"
            placeholderTextColor="#999"
            style = {styles.TextFieldStyling}
             onChangeText={setEmail}
        />  
        
        {/* <Text style ={[styles.label,{paddingTop:10}]}>Telefone:</Text>
        <TextInput
            placeholder="Telemóvel"
            placeholderTextColor="#999"
            style = {styles.TextFieldStyling}
        /> */}

        <Text style={[styles.label ,{paddingTop: 10}]}>Senha:</Text>
        <View style={styles.InputContainer}>
          <TextInput
            placeholder="Digite a sua senha"
            placeholderTextColor="#999"
            style ={styles.TextFieldSenha}
            secureTextEntry ={!showPassword}
            onChangeText={setSenha}
          />
          <Pressable onPress={() => {setShowPassword(!showPassword)}}
          style={styles.eyeIcon}>
            <Ionicons
             name={showPassword ? 'eye-off' : 'eye'}
             size={22}
             color="#999"
            />
          </Pressable>
        </View>

        <Text style={[styles.label ,{paddingTop: 10}]}>Confirme a senha:</Text>
        <View style={styles.InputContainer}>
          <TextInput
            placeholder="Confirme senha criada"
            placeholderTextColor="#999"
            style ={styles.TextFieldSenha}
            secureTextEntry ={!showPassword}
            
          />
          <Pressable onPress={() => {setShowPassword(!showPassword)}}
          style={styles.eyeIcon}>
            <Ionicons
             name={showPassword ? 'eye-off' : 'eye'}
             size={22}
             color="#999"
            />
          </Pressable>
        </View>
        

        
        <TouchableOpacity style = {[styles.button]}    
           onPress={handleLogin}>
          <Text style={{color:'#fff',textAlign:'center',
            fontWeight:"bold"
          }}
          > 
          Cadastrar-se
          </Text>
        </TouchableOpacity >


        </View>
      </ScrollView>
    </KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#0f172a', 
  },
  scrollContent:
  {
      justifyContent: 'center',
      flexGrow:1
  },
  logoContent:
  {
    flexDirection:"row",
    justifyContent:"center",
  },

  logo:
  {
    color:"#ff5e17",
    fontWeight:"bold",
    fontSize:28
  },
  sameLogo:
  {
    color:"#0001fd",
    fontWeight:"bold",
    fontSize:28
  },

  LogoStyling:
  {
    width: 195,
    height:50
  },
  
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#94a3b8',
    marginBottom: 10,
    textAlign:"center"
  },

  
  mainContent: {
    padding: 20,
    borderRadius: 12,
    color:"#fff", 
  },

  label:
  {
    color:"#fff",
    fontWeight:"bold",
    fontSize: 16
  },

  TextFieldStyling:
  {
    marginTop:5,
    borderRadius:8,
    borderWidth:1,
    borderColor: '#7271716c',
    backgroundColor: '#18223a',
    paddingStart:14,
    color:'#fff',
  },

   TextFieldSenha:
  {
    marginTop:5,
    borderRadius:8,
    borderWidth:1,
    borderColor: '#7271716c',
    backgroundColor: '#18223a',
    paddingStart:14,
    color:'#fff',
    flex:1
  },
  button:
  {
     marginTop:10,
     backgroundColor: '#ff5e17',
     borderRadius: 10,
     padding: 10,
  },
  InputContainer:
  {
    flexDirection:'row',
    alignItems:"center"
  },
  eyeIcon:
  {
    position:'absolute',
    right:10,
    paddingTop:5
  }
 
});
 

