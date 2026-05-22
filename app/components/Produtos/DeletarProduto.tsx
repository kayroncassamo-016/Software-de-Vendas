import { colors } from '@/constants/theme';
import { api } from '@/services/api';
import { Produtos } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import {
    Alert,
    Text,
    View
} from 'react-native';
import { Button, Dialog, Portal } from 'react-native-paper';

interface ProdutoProps
{
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    produto: Produtos |null
    //setLoading : React.Dispatch<React.SetStateAction<boolean>>;
    setProdutos: React.Dispatch<React.SetStateAction<Produtos[]>>;
    setFiltrados: React.Dispatch<React.SetStateAction<Produtos[]>>;
    setVisibleDetalhesProduto: React.Dispatch<React.SetStateAction<boolean>>;

}



export const DeletarProduto = ({visible,setVisible,
    produto,setProdutos,setFiltrados,
    setVisibleDetalhesProduto}:ProdutoProps) =>
{

 const [loadingDelete, setLoadingDelete] = useState(false)


async function handleDeletarProduto()
{
    const token  = await AsyncStorage.getItem("@token")


    try{

     
     //setVisibleDetalhesProduto(false)
     //setVisible(false)
     
     setLoadingDelete(true)

     await api.delete(`/produtos/${produto?.id}`,
     {
        headers: { Authorization: `Bearer ${token}` },
     })
     //setLoading(true)  
     const response = await api.get('/produtos')
    
     setProdutos(response.data.data)
     setFiltrados(response.data.data)
     
       
     Alert.alert('Produto deletado com sucesso!',)
     setVisibleDetalhesProduto(false)
     setVisible(false)

    }
    catch(err: any)
    {
       console.log('Erro ao actualizar produto: ',err.response?.data)
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
                        Deseja apagar este produto?
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
                    handleDeletarProduto()
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
                        fontWeight:'bold'}}>
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