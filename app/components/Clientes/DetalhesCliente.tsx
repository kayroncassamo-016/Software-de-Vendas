import { Clientes } from "@/types/types";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { colors } from "@/constants/theme";
import { Trash } from "lucide-react-native";
import { Button, Dialog, Portal } from 'react-native-paper';


interface DetalhesClienteProps
{
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    cliente: Clientes|null
    setVisibleDeletarcliente:React.Dispatch<React.SetStateAction<boolean>>
    setVisibleEditarcliente:React.Dispatch<React.SetStateAction<boolean>>
    
}

export function DetalhesCliente({visible,setVisible,
    cliente, setVisibleDeletarcliente,setVisibleEditarcliente}:DetalhesClienteProps)
{
  

    return (
        
        <Portal>
         
      
        

       
         <Dialog visible={visible} 
          onDismiss={()=>setVisible(false)}
           style={{ backgroundColor: '#fff' }}> 

              {/* <Dialog.Title style={{color: colors.blue, fontSize:14,
                fontWeight:'bold', }}> */}
                <View
                 style={{
                  flexDirection:'row',
                  justifyContent:'space-between'
                  }}> 
                 
                  <Text style={{color:colors.blue,fontWeight:'bold',
                    fontSize:14, flex:1, textAlign:'center'}}>
                 
                    Detalhes do cliente
                  </Text>

                  <TouchableOpacity style={{paddingRight:20}}
                  onPress={() => setVisibleDeletarcliente(true)}>
                    <Trash color={'#FF0000'}/>
                  </TouchableOpacity>

                </View>
              
               
              {/* </Dialog.Title> */}

            {/*  */}
            <Dialog.Content>
              <ScrollView
             style={{ maxHeight: 450}}>
              <View style={{flexDirection:'row',paddingTop:5}}>
                <Text style={{fontWeight:'bold'}}>
                  Número:
                </Text>
                <Text style={{paddingLeft:5}}>
                  {cliente?.numero}
                </Text>
              </View>


              <View style={{flexDirection:'row',paddingTop:5}}>
                <Text style={{fontWeight:'bold'}}>
                  Nome:
                </Text>
                <Text style={{paddingLeft:5}}>
                  {cliente?.nome}
                </Text>
              </View>

              <View style={{flexDirection:'row',paddingTop:5}}>
                <Text style={{fontWeight:'bold'}}>
                  Email:
                </Text>
                <Text style={{paddingLeft:5}}>
                  {cliente?.email}
                </Text>
              </View>

              <View style={{flexDirection:'row',paddingTop:5}}>
                <Text style={{fontWeight:'bold'}}>
                  Morada:
                </Text>
                <Text style={{paddingLeft:5}}>
                     {cliente?.endereco?.morada??'N/A'}
                </Text>
              </View>

                <View style={{flexDirection:'row',paddingTop:5}}>
                <Text style={{fontWeight:'bold'}}>
                  Província:
                </Text>
                <Text style={{paddingLeft:5}}>
                     {cliente?.endereco?.provincia??'N/A'}
                </Text>
              </View>

              <View style={{flexDirection:'row',paddingTop:5}}>
                <Text style={{fontWeight:'bold'}}>
                  Tipo de cliente:
                </Text>
                <Text style={{paddingLeft:5}}>
                  {cliente?.tipo}
                </Text>
              </View>

              <View style={{flexDirection:'row',paddingTop:5}}>
                <Text style={{fontWeight:'bold'}}>
                  Código postal:
                </Text>
                <Text style={{paddingLeft:5}}>
                  {cliente?.endereco?.cod_postal??'N/A'}
                </Text>
              </View>
             
             {cliente?.tipo !=="empresa" &&

                <View style={{flexDirection:'row',paddingTop:5}}>
                    <Text style={{fontWeight:'bold'}}>
                      Data de nascimento:
                    </Text>
                    <Text style={{paddingLeft:5}}>
                        {cliente?.data_nascimento??'N/A'}
                    </Text>
                </View>
              }

              {cliente?.tipo !=="empresa" &&

                <View style={{flexDirection:'row',paddingTop:5}}>
                    <Text style={{fontWeight:'bold'}}>
                      Sexo:
                    </Text>
                    <Text style={{paddingLeft:5}}>
                        {cliente?.sexo}
                    </Text>
                </View>
              }

               <View style={{flexDirection:'row',paddingTop:5}}>
                <Text style={{fontWeight:'bold'}}>
                  Forma de pagamento:
                </Text>
                <Text style={{paddingLeft:5}}>
                    {cliente?.financeiro?.forma_pagamento??'N/A'}
                </Text>
              </View>
               
               <View style={{flexDirection:'row',paddingTop:5}}>
                <Text style={{fontWeight:'bold'}}>
                   Limite de crédito:
                </Text>
                <Text style={{paddingLeft:5}}>
                    {parseFloat(cliente?.financeiro?.limite_credito??'N/A').
                    toFixed(2).toString()}
                </Text>
              </View>

              <View style={{flexDirection:'row',paddingTop:5}}>
                <Text style={{fontWeight:'bold'}}>
                  Desconto comercial:
                </Text>
                <Text style={{paddingLeft:5}}>
                  {parseFloat(cliente?.financeiro?.desconto_comercial??'N/A').
                  toFixed(2).toString()}
                </Text>
              </View>

              <View style={{flexDirection:'row',paddingTop:5}}>
                <Text style={{fontWeight:'bold'}}>
                  Data de vencimento:
                </Text>
                <Text style={{paddingLeft:5}}>
                    {cliente?.financeiro?.data_vencimento??'N/A'}
                </Text>
              </View>
                     
                </ScrollView>
            </Dialog.Content> 
         {/*  */}
          <Dialog.Actions style={{flexDirection:'row',
            alignItems:'center'}}>

              <Button
              onPress={() => {
              setVisible(false)
              setVisibleEditarcliente(true)
              }}>
                <View style={{flexDirection:'row',
                justifyContent:'space-around', alignItems:'center'}}> 
                <Text style={{color:colors.blue,
                  fontWeight:'bold'
                }}>Editar</Text> 
              </View>
              </Button>
           
          </Dialog.Actions>
        </Dialog>
      </Portal>
    )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
   // backgroundColor: '#185FA5',
   backgroundColor: '#f4f6f9',
   
  },

  // Header
  header: {
    backgroundColor: '#185FA5',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderRadius:12,
    marginHorizontal:5
  },

})