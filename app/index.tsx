import { colors } from '@/constants/theme'
import { useContexto } from '@/contexts/AuthContext'
import { configureApi } from '@/services/api'
import { useRouter, useSegments } from 'expo-router'
import { WifiOff } from 'lucide-react-native'
import { useEffect } from 'react'
import {
    ActivityIndicator, StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'

export default function Index ()
{

    const {loading,signed,networkError, loadStorageData} = useContexto();

    useEffect(() => {
        async function init() {
            await configureApi();
            await loadStorageData();
        }

        init();
    }, []);
    const segments = useSegments()
    const router = useRouter()
  

   useEffect(()=>{
    
    if(loading || networkError)
        return

    const inAuthGroup = segments[0] === "(authenticated)"

    if(!signed && inAuthGroup)
    {
        router.replace("/login/login")
    }
    else if(signed && !inAuthGroup)
    {
        router.replace("/(authenticated)/dashboard")
     
    }
    else if(!signed)
    {
        router.replace("/login/login")
    }

   },[loading,signed,router,networkError])

    if (networkError)
    {
        return (
            <View style={styles.container}>

                <WifiOff
                    size={50}
                    color="red"
                />

                <Text style={{
                    fontWeight:'bold',
                    fontSize:18,
                    marginTop:10
                }}>
                    Está offline
                </Text>

                <Text style={{
                    color:'#555',
                    textAlign:'center',
                    marginTop:10,
                    paddingHorizontal:20
                }}>
                    Verifique a sua ligação com a internet
                    e tente novamente.
                </Text>

                <TouchableOpacity
                    style={styles.button}
                     onPress={() => loadStorageData()}>
            
                    <Text style={{color:'#fff',textAlign:'center'}}>
                        Tentar novamente
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, {
                        backgroundColor: '#fff',
                        borderWidth: 1,
                        borderColor: colors.blue
                    }]}
                    onPress={() => router.push("/components/Conection/Conection")}
                >
                  <Text 
                    style={{
                        color: colors.blue,
                        textAlign: "center"
                    }}
                    >
                        Configurar servidor
                </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, {
                        backgroundColor: "#4CAF50"
                    }]}
                    onPress={() => router.replace("/login/login")}
                >
                    <Text style={{
                        color: "#fff",
                        textAlign: "center"
                    }}>
                        Continuar Offline
                    </Text>  

                </TouchableOpacity>
            </View>
        )
    }

      if (loading) 
      {
           return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.blue}/>
            </View>
            )
       }
    
     return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.blue}/>
        </View>

     )
}

const styles = StyleSheet.create({
    container:
    {
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:'#fff'
    },
    button:
    {
        backgroundColor:colors.blue,
        color:'#fff',
        paddingVertical: 10,
        paddingHorizontal:10,
        borderRadius: 10,
        marginTop:10,
        width:'75%'

    }
})