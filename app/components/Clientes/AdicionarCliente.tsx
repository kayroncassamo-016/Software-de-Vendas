import { Select } from "@/components/project/Select";
import { colors } from "@/constants/theme";
import { api } from "@/services/api";
import { Clientes } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Plus } from "lucide-react-native";
import { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Dialog, Portal, RadioButton } from 'react-native-paper';
interface AdicionarClienteProps
{
    visible:boolean,
    setVisible:React.Dispatch<React.SetStateAction<boolean>>
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    setClientes: React.Dispatch<React.SetStateAction<Clientes[]>>
    setFiltrados: React.Dispatch<React.SetStateAction<Clientes[]>>
}


export function AdicionarCliente({visible,setVisible
    ,setLoading,setClientes,setFiltrados
}:AdicionarClienteProps)

{
    const [numero,setNumero ] = useState('')
    const [nuit,setNuit ] = useState('')
    const [nome,setNome] = useState('')
    const [email,setEmail] = useState('')
    const [morada,setMorada] = useState('')
    const [provincia,setProvincia] = useState('')
    const [limiteCredito,setLimiteCredito] = useState('')
    const [selectedFormaPagamento,setSelectedFormaPagamento] = useState('')
    const [descontoComercial,setDescontoComercial] = useState('')
    const tipo = ['particular','empresa']
    const formaPagamento = ['transferência',
      'multicaixa','crédito',]
    const [selectedTipo,setSelectedTipo]= useState('')
    const [dataNascimento, setDataNascimento] = useState<Date|null>(null);
    const [dataVencimento, setDataVencimento] = useState<Date|null>(null);
    const [mostrar, setMostrar] = useState(false);
    const [showOtherData, setShowOtherData] = useState(false);
    const [mostrarDataVencimento, setMostrarDataVencimento] = useState(false);
    const [sexo, setSexo] = useState('')

       
  const onChange = (event:any, selectedDate:any) => {
    setMostrar(false);

    if (selectedDate) {
      setDataNascimento(selectedDate);
    }
  };

   const onChangeDataVencimento = (event:any, selectedDate:any) => {
    setMostrarDataVencimento(false);

    if (selectedDate) {
      setDataVencimento(selectedDate);
    }
  };

  useEffect(() =>{

    if(selectedTipo==="particular")
    {
      setShowOtherData(true)
    }
    else
    {
      setShowOtherData(false)
    }

  },[selectedTipo])


  async function handleAdicionarCliente()
  {
    const token  = await AsyncStorage.getItem("@token")

    const payload = 
      {
        numero:numero,
        nuit:nuit,
        nome: nome,
        email: email,
        tipo: selectedTipo,
        data_nascimento:dataNascimento?.toISOString().split('T')[0],
        sexo:sexo,

        morada:morada,
        provincia:provincia,


        limite_credito:limiteCredito,
        desconto_comercial:descontoComercial,
        forma_pagamento:selectedFormaPagamento,
        data_vencimento: dataVencimento?.toISOString().split('T')[0],
        
        
      }

    try
    {   
        setVisible(false)
        setLoading(true)
        
        await api.post('/clientes',
            payload, {
            headers: { Authorization: `Bearer ${token}` },
            }   
          )
       
    
          const response = await api.get('/clientes')
    
          setClientes(response.data.data)
          setFiltrados(response.data.data)
        

          Alert.alert('Cliente cadastrado com sucesso!',)
    }
    catch(err:any)
    {
        console.log('erro: ',err.response)
    }
    finally
    {
        setLoading(false)
    }
  }

    return (
        <Portal>
        <Dialog visible={visible} 
        onDismiss={()=> setVisible(false)}
           style={{ backgroundColor: '#fff'}}> 
           
         
              <Dialog.Title style={{color: colors.blue, fontSize:14,
                textAlign:'center',
                fontWeight:'bold'
            }}>
            Adicione um novo cliente
              </Dialog.Title>
          
          {/* 
          <KeyboardAvoidingView 
           behavior="height"  >*/ }
         
          <Dialog.Content>
            
            {/* <ScrollView
            style={{maxHeight:450, paddingHorizontal:3}}
               keyboardShouldPersistTaps="handled"
               keyboardDismissMode="interactive"
              automaticallyAdjustKeyboardInsets={true}
               contentContainerStyle={{
                 paddingBottom: 120, // IMPORTANTE
            }}
             showsVerticalScrollIndicator={false}> */}
            <KeyboardAwareScrollView
                style={{ maxHeight: 450, paddingHorizontal: 3 }}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}          // ← essencial para Android
                enableAutomaticScroll={true}
                // extraScrollHeight={-100}          // ← espaço extra acima do input
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                      paddingBottom: -150,
                }}
            >
         

            <View>

              <View style={styles.dialogContentStyle}>
                <Text style={styles.dialogTextStyle}> Número:</Text>
                <TextInput value={numero} onChangeText={setNumero}
                keyboardType='numeric'
                style={styles.TextFieldStyling}/>
              </View>

               <View style={styles.dialogContentStyle}>
                <Text style={styles.dialogTextStyle}> Nuit:</Text>
                <TextInput value={nuit} onChangeText={setNuit}
                keyboardType='numeric'
                style={styles.TextFieldStyling}/>
              </View>


              <View style={styles.dialogContentStyle}>
                <Text style={styles.dialogTextStyle}> Nome:</Text>
                <TextInput  value={nome} onChangeText={setNome}
                style={styles.TextFieldStyling}/>
              </View>

              <View style={styles.dialogContentStyle}>
                <Text style={styles.dialogTextStyle}> Email:</Text>
                <TextInput  value={email} onChangeText={setEmail}
                style={styles.TextFieldStyling}/>
              </View>

              <View style={styles.dialogContentStyle}>
                <Text style={styles.dialogTextStyle}> Morada:</Text>
                <TextInput  value={morada} onChangeText={setMorada}
                style={styles.TextFieldStyling}/>
              </View>

              <View style={styles.dialogContent}>
                <Text style={styles.dialogTextStyle}> Província:</Text>
                <TextInput  value={provincia} onChangeText={setProvincia}
                style={styles.TextFieldStyling}/>
              </View>

              <View style={styles.dialogContent}>
                <Text style={styles.dialogTextStyle}>Tipo:</Text>
                
                <Select
                    label="Tipo"
                    placeholder="Selecione o tipo de cliente"
                    options ={tipo.map(tipo => ({
                      label: tipo,
                      value: tipo
                    }))}
                    selectedValue={selectedTipo}
                    onValueChange={setSelectedTipo}
                />
              </View>
              
              {showOtherData && 
               <View>
              <View style={styles.dialogContentStyle}>
                <Text style={styles.dialogTextStyle}>Data de nascimento:</Text>
                
                <TextInput editable={false}
                style={styles.TextFieldStyling}
                >{dataNascimento?.toLocaleDateString()??''} </TextInput>
                      
                        <TouchableOpacity
                            style={{
                                backgroundColor:'#e2e2e2',
                                position:'absolute',
                                right:3,
                                borderRadius:8,
                                paddingHorizontal:10,
                                paddingBottom:5
                            }}
                            onPress={() => setMostrar(true)}>
                            <Text>...</Text>

                         </TouchableOpacity>
                         
                        {mostrar && (
                            <DateTimePicker
                            value={dataNascimento || new Date()}
                            mode="date"
                            display="default"
                            maximumDate={new Date()}
                            onChange={onChange}
                            />
                        )}
                  </View>

              <View style={styles.dialogContent}>
                <Text style={styles.dialogTextStyle}>Sexo:</Text>
                
                <RadioButton.Group
                    onValueChange={(value) => setSexo(value)}
                    value={sexo}
                    
                >
                    <View style={{flexDirection:'row'}}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton value="masculino" />
                        <Text>Masculino</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton value="feminino" />
                        <Text>Feminino</Text>
                        </View>
                    </View>
                </RadioButton.Group>
                </View>
              </View>
                      }
              <View style={styles.dialogContent}>
               
                    <View style={[styles.dialogTextStyle
                    ,{paddingRight:4}
                  ]}>
                       <Text style={{fontWeight:'bold'}}>Forma de</Text> 
                       <Text style={{fontWeight:'bold'}}>pagamento:</Text>
                    </View>
                   
           
                <Select
                    label="Tipo"
                    placeholder="Selecione a forma de pagamento"
                    options ={formaPagamento.map(formaPag => ({
                      label: formaPag,
                      value: formaPag
                    }))}
                    selectedValue={selectedFormaPagamento}
                    onValueChange={setSelectedFormaPagamento}
                />
              </View>

              <View style={styles.dialogContentStyle}>
                <Text style={[styles.dialogTextStyle
                  ,{paddingRight:10}
                ]} >
                  Limite de crédito:
                </Text>

                <TextInput keyboardType="numeric"
                value={limiteCredito} 
                onChangeText={setLimiteCredito}
                style={styles.TextFieldStyling}/>

              </View>
              
          
                <View style={styles.dialogContent}>
                <Text style={[styles.dialogTextStyle
                  , {paddingRight:10}
                ]}
                > 
                  Desconto comercial:
                </Text>
                
                 <TextInput keyboardType="numeric"  
                  value={descontoComercial} 
                  onChangeText={setDescontoComercial}
                  style={styles.TextFieldStyling}/>
                </View>
                
                <View style={[{paddingTop:10},styles.dialogContentStyle]}>
                <Text style={styles.dialogTextStyle}>Data de vencimento:</Text>
                
                <TextInput editable={false}
                style={styles.TextFieldStyling}
                >{dataVencimento?.toLocaleDateString()??''} </TextInput>
                      
                        <TouchableOpacity
                            style={{
                                backgroundColor:'#e2e2e2',
                                position:'absolute',
                                right:3,
                                top:20,
                                borderRadius:8,
                                paddingHorizontal:10,
                                paddingBottom:5
                            }}
                            onPress={() => setMostrarDataVencimento(true)}>
                            <Text>...</Text>

                         </TouchableOpacity>
                         
                        {mostrarDataVencimento && (
                            <DateTimePicker
                            value={dataVencimento|| new Date()}
                            mode="date"
                            display="default"
                            minimumDate={new Date()}
                            onChange={onChangeDataVencimento}
                            />
                        )}
                  </View>
             

               </View>
              {/* </ScrollView>   */}
              </KeyboardAwareScrollView>
          </Dialog.Content>
          {/* </KeyboardAvoidingView> */}
          
          <Dialog.Actions style={{flexDirection:'row',
            alignItems:'center', marginTop:5}}>

            <Button onPress={() => {
            handleAdicionarCliente()
            }}>
              <View style={{flexDirection:'row',
                justifyContent:'space-around', alignItems:'center'}}> 
                <Plus size={15} color={colors.blue} fontWeight={'bold'}/>
                <Text style={{color:colors.blue,
                  fontWeight:'bold'
                }}>Adicionar</Text> 
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
            {/* </KeyboardAvoidingView> */}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 2,
    borderRadius:4,
    marginHorizontal:10
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
  },

  // Search container
  searchContainer: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
  },
  searchInput: {
    // backgroundColor: '#fff',
    // borderRadius: 12,
    // borderWidth: 0.5,
    // borderColor: '#E5E5EA',
    // paddingHorizontal: 14,
    // paddingVertical: 11,
    // fontSize: 13,
    // color: '#1C1C1E',

    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13,
    color: '#1C1C1E',
    marginTop: 10,
  },

  // ScrollView
  scroll: {
    flex: 1,
     backgroundColor: '#F2F2F7', 
  },
  scrollContent: {
    padding: 20,
  },

  // Produto card
  produtoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  produtoLeft: {
    flex: 1,
    gap: 6,
  },
  produtoNome: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  produtoRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  produtoPreco: {
    fontSize: 15,
    fontWeight: '500',
    color: '#185FA5',
  },
  produtoIVA: {
    fontSize: 11,
    color: '#8E8E93',
  },

  // Categoria tag
  tagCategoria: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    alignSelf: 'flex-start',
  },
  tagCategoriaText: {
    fontSize: 11,
    fontWeight: '500',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#8E8E93',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 130,
    right: 16,
    backgroundColor: '#185FA5',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#185FA5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },

  // Bottom nav
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
    paddingTop: 8,
    paddingBottom: 20,
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
  dialogTextStyle:
  {
     paddingRight:10,
     fontWeight:'bold',
     color:'#000'
  },
  dialogTextIsencao:
  {
     paddingRight:10,
     fontWeight:'bold',
     color:'#4ef097'
  },
  dialogContentStyle:
  {
    flexDirection: 'row',
    alignItems:'center',
    marginBottom:10
  }, 

  dialogContent:
  {
    flexDirection: 'row',
    alignItems:'center',
    marginBottom:2
    
  }, 
  
  TextFieldStyling:
  {
    marginTop:2,
    borderRadius:8,
    borderWidth:1,
    borderColor: '#7c7c7c6c',
    backgroundColor: '#eff3fd',
    color:'#000',
    flex: 1
  },

  loadingContainer:
  {
    flex:1,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor: '#F2F2F7',


    },
  
});

