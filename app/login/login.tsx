import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet, Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { useContexto } from '@/contexts/AuthContext';


export default function Home() {

  const router = useRouter();
  const [pressed, setPressed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [senha, setSenha] = useState("");
  const [email, setEmail] = useState("");
  const [loading,setLoading] = useState(false)
  const [errorMessage,setErrorMessage] = useState('');

  const { signIn } = useContexto();
  

   async function handleLogin()
   {
      if(!email.trim() || !senha.trim())
      {
            Alert.alert("Atenção", "Preencha todos os campos!")
            return
      }
      try
        {
           setLoading(true)
           await signIn(email,senha)
          // setErrorMessage(false)
        }

        // catch (err:any)
        // {
        //     Alert.alert("Erro", "Erro ao fazer login!")
        //     if (err.message === "INVALID_CREDENTIALS")
        //     {
        //         setErrorMessage("Email/senha inválidos. Introduza novamente");
        //         return;
        //     }
        //   setErrorMessage("Erro ao fazer login.");
            
        // }

        catch (err:any)
        {   
            switch(err.message)
            {
              case "INVALID_CREDENTIALS":
                  setErrorMessage("Email/senha inválidos. Introduza novamente.");
                  break;

              case "NETWORK_ERROR":
                  setErrorMessage("Sem conexão com o servidor. Verifique a sua conexão.");
                  break;

              case "SERVER_ERROR":
                  setErrorMessage("Erro interno do servidor.");
                  break;

              default:
                  setErrorMessage("Erro inesperado ao fazer login.");
                  break;
            }
        }

        finally
        {
            setLoading(false)
        }
   }


  return (
    <KeyboardAvoidingView style={styles.container}
      behavior='padding'>
  
      <View>  
         <View style ={styles.logoContent}>
             <Image source={require('@/app/assets/logo.png')}
             style ={styles.LogoStyling}
            /> 
         </View>

         <Text style={styles.title}>
          Software de Facturação
         </Text>
      </View>


      <View style={styles.mainContent}>
        <Text style ={styles.label}>Email:</Text>
        <TextInput
            placeholder="Digite o seu email"
            placeholderTextColor="#999"
            style = {styles.TextFieldStyling}
            onChangeText={(text) =>
            {
              setEmail(text),
              setErrorMessage('')
            }
            }
        />

        <Text style={[styles.label ,{paddingTop: 10}]}>Senha:</Text>

        <View style = {styles.InputContainer}>
            <TextInput
            placeholder="Digite a sua senha"
            placeholderTextColor="#999"
            style ={styles.TextFieldSenha}
            secureTextEntry={!showPassword}
            onChangeText={(text) =>
            {
              setSenha(text),
              setErrorMessage('')
            }}
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
        {/* Renderizacao condicional aqui caso o email/senha incorrectos */}

        {!!errorMessage && (
          <View>
             <Text style={styles.error}>
                 {errorMessage}
            </Text>
          </View>
        )}

       

        <TouchableOpacity style = {[styles.button,
        loading?
          (styles.buttonDisabled):(styles.button)
        ]}
         onPress={handleLogin}>
          {
            loading? (
              <View style={styles.buttonView}>
                <ActivityIndicator/>

                <Text style={{color:'#fff',textAlign:'center',
                fontWeight:'bold'
              }}>
                Entrando...
              </Text>
              </View>
            ):(
              <Text style={{color:'#fff',textAlign:'center',
                fontWeight:'bold'
              }}>
                Entrar
              </Text>
            )
          }
          
        </TouchableOpacity >
        
        <View style={{flexDirection:'row'}}>
          <Text style={{color:'#fff', marginTop:5}}> Ainda não se cadastrou?</Text>

          <Pressable onPress={() => router.push('register' as never)
          }
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            >
              <Text style={[styles.textCadastro,{textDecorationLine: pressed ? 'underline' : 'none',}]}> 
                Cadastre-se agora
              </Text>
          </Pressable>

        </View>
      </View>


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
    //color:"#0001fd",
  
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
    color:"#fff"
  },

  label:
  {
    color:"#fff",
    fontWeight:"bold",
    fontSize: 16
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


  TextFieldStyling:
  {
    marginTop:5,
    borderRadius:8,
    borderWidth:1,
    borderColor: '#7271716c',
    backgroundColor: '#18223a',
    paddingStart:14,
    color:'#fff',
  }
  ,
  button:
  {
     marginTop:10,
     backgroundColor: '#ff5e17',
     borderRadius: 10,
     padding: 10,
  },
  textCadastro:
  {
    color:'#fff', 
    marginTop:5, 
    textDecorationLine: 'none' ,
    paddingLeft:5,
    fontWeight:'bold',
  },
  InputContainer:
  {
    flexDirection: 'row',
    alignItems:'center',
   
  },

  eyeIcon:
  {
    position:'absolute',
    right: 10,
    paddingTop:5
  },

  error:
  {
    color:"red",
    fontWeight:"bold",
    textAlign:"center",
    marginTop:8
  },
  buttonView:
  {
    flexDirection:'row',
    justifyContent:'center',
    gap:3
  },

  buttonDisabled:
  {
    opacity:0.6
  }
 
});
 

