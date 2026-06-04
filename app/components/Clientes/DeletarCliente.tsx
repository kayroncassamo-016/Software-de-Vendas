import { colors } from '@/constants/theme';
import { api } from '@/services/api';
import { Clientes } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import {
    Alert,
    Text,
    View
} from 'react-native';
import { Button, Dialog, Portal } from 'react-native-paper';

interface DeletarClienteProps
{
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    cliente: Clientes | null
    //setLoading : React.Dispatch<React.SetStateAction<boolean>>;
     setClientes: React.Dispatch<React.SetStateAction<Clientes[]>>
     setFiltrados: React.Dispatch<React.SetStateAction<Clientes[]>>
     setVisibleDetalhesCliente: React.Dispatch<React.SetStateAction<boolean>>
     
}





export const DeletarCliente = ({visible,setVisible,cliente
    ,setFiltrados,setClientes,  setVisibleDetalhesCliente
}: DeletarClienteProps) =>
{
 const [loadingDelete, setLoadingDelete] = useState(false)
    

  
 async function handleDeletarCliente()
{
    const token  = await AsyncStorage.getItem("@token")


    try {

     setLoadingDelete(true)

      await api.delete(`/clientes/${cliente?.id}`,
     {
        headers: { Authorization: `Bearer ${token}` },
     })
     //setLoading(true)  
     //console.log(responseDelete)
     const response = await api.get('/clientes')
    
     setClientes(response.data.data)
     setFiltrados(response.data.data)
     
       
     Alert.alert('Cliente deletado com sucesso!',)
     setVisibleDetalhesCliente(false)
     setVisible(false)

    }
    catch(err: any)
    {
       Alert.alert('Erro ao apagar cliente',err.response?.data.message)

       console.log('Erro ao apagar cliente: ',err.response?.data)
    }

    finally
    {
        setLoadingDelete(false)
        

    }
        
}


    

   
    return (
      <Portal>
         <Dialog visible={visible} 
          onDismiss={()=>setVisible(false)}
           style={{ backgroundColor: '#fff' }}> 

             
                <View> 
                  <Text style={{textAlign:'center',fontSize:18,
                    color:colors.blue,fontWeight:'500'
                  }}>
                        Deseja apagar este cliente?
                  </Text>
                </View>
              
               
              {/* </Dialog.Title> */}

         
            <Dialog.Content>
              
              <View >
                
              </View>
          </Dialog.Content>

            <Dialog.Actions style={{flexDirection:'row',
            alignItems:'center'}}>

                <Button onPress={() => {
                    handleDeletarCliente()
                }}
                loading = {loadingDelete}
                disabled= {loadingDelete}>
                <View style={{flexDirection:'row',
                    justifyContent:'space-around', alignItems:'center'}}> 
                    <Text style={{
                        color:colors.primary, 
                        backgroundColor:colors.red,
                        borderRadius: 8,
                        padding:6,
                        fontWeight:'bold'}}
                    >
                       {
                        loadingDelete ?
                        (
                            "Apagando..."
                        ):
                        (
                            "Apagar"
                        )
                       }
                        
                    </Text> 
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

    )
}