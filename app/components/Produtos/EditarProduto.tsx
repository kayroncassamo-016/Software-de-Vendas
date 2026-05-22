import { Select } from '@/components/project/Select';
import { colors } from '@/constants/theme';
import { api } from '@/services/api';
import {
  Categoria,
  Familia,
  Imposto,
  Marca,
  Motivo_Isencao,
  Produtos,
  Tipo
} from '@/types/types';
import { formatMoney } from '@/utils/format';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { Alert } from 'react-native';
import { Button, Dialog, Portal } from 'react-native-paper';


interface ProdutoProps
{
 produto:Produtos|null 
 visible: boolean
 setVisible: React.Dispatch<React.SetStateAction<boolean>>;
 loading: boolean
 setLoading : React.Dispatch<React.SetStateAction<boolean>>;
 setProdutos: React.Dispatch<React.SetStateAction<Produtos[]>>;
 setFiltrados: React.Dispatch<React.SetStateAction<Produtos[]>>;
}



//chavetas em volta do produtoseleccionado para desestruturacao, para pegar a propriedade produto seleccionado
export function EditarProdutoForm({produto,visible,setVisible,
  loading,setLoading,setProdutos,setFiltrados}:ProdutoProps)
{
    

    const [categorias, setCategorias] =  useState<Categoria[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>();
    const [tipos, setTipos] =  useState<Tipo[]>([])
    const [selectedTipo, setSelectedTipo] = useState<string>('');
    const [selectedTipoId, setSelectedTipoId] = useState<number>();
    
    const [impostos, setImpostos] =  useState<Imposto[]>([])
    const [selectedImposto, setSelectedImposto] = useState<string>('');
    const [selectedImpostoId, setSelectedImpostoId] = useState<number>();
    const [selectedImpostoTaxa, setSelectedImpostoTaxa] = useState<number>(0);
    const [TextAreaEnabled, setTextAreaEnabled] = useState<Boolean>(false)
    const [familias, setFamilias] =  useState<Familia[]>([])
    const [selectedFamily, setSelectedFamily] = useState<string>('');
    const [selectedFamilyId, setSelectedFamilyId] = useState<number>();
    
    const [marcas, setMarcas] =  useState<Marca[]>([])
    const [selectedMarca, setSelectedMarca] = useState<string>('');
    const [selectedMarcaId, setSelectedMarcaId] = useState<number>();
    
    const [motivosIsencao, setMotivosIsencao] =  useState<Motivo_Isencao[]>([])
    const [selectedMotivoIsencao, setSelectedMotivoIsencao] = useState<string>('');
    const [selectedMotivoIsencaoId, setSelectedMotivoIsencaoId] = useState<number>();
    
    const [codigo, setCodigo] = useState('');
    const [designacao, setDesignacao] = useState('');

    const [precoL, setPrecoLiquido] = useState('')
    const [precoIL, setPrecoIliquido] = useState('')
    
    const taxa = selectedImpostoTaxa
    const total = precoL




    useEffect(() => {
      if (produto) {
        setDesignacao(produto.designacao);
        setCodigo(produto.codigo);
        setPrecoLiquido(parseFloat(produto.preco_venda_liquido_1).toFixed(2) ?? '');
        setPrecoIliquido(parseFloat(produto.preco_venda_iliquido_1).toFixed(2) ?? '');
        setSelectedCategory(produto.categoria?.designacao ?? '');
        setSelectedTipo(produto.tipo_produto?.designacao ?? '');
        setSelectedMarca(produto.marca?.nome ?? '');
        setSelectedFamily(produto.familia?.designacao ?? '');
        setSelectedImposto(produto.imposto?.designacao ?? '');
      }
}, [produto]);
    
     useEffect(() => 
      {
        if (selectedCategory) {
    
    
        const categoriaEncontrada = categorias.find(
          (categoria) =>
            selectedCategory.trim().toLowerCase() ===
            categoria.designacao.trim().toLowerCase()
        );
    
        if (categoriaEncontrada) {
          console.log("encontrei category");
          setSelectedCategoryId(categoriaEncontrada.id);
          
          console.log("encontrei categoryId", categoriaEncontrada.id);
        }
      }
    
    
      if (selectedImposto) {
         
    
        const impostoEncontrado = impostos.find(
          (imposto) =>
            selectedImposto.trim().toLowerCase() ===
            imposto.designacao.trim().toLowerCase()
        );
    
        if (impostoEncontrado) {
          setSelectedImpostoId(impostoEncontrado.id);
    
          setSelectedImpostoTaxa(parseFloat(impostoEncontrado.taxa))
    
          console.log("encontrei impostoId", impostoEncontrado.id);
        }
      }
    
    
      if (selectedMarca) {
    
    
        const marcaEncontrada = marcas.find(
          (marca) =>
            selectedMarca.trim().toLowerCase() ===
            marca.nome.trim().toLowerCase()
        );
    
        if (marcaEncontrada) {
          console.log("encontrei a marca");
          setSelectedMarcaId(marcaEncontrada.id);
          
          console.log("encontrei marcaId", marcaEncontrada.id);
        }
      }
    
      if (selectedFamily) {
    
    
        const familiaEncontrada = familias.find(
          (family) =>
            selectedFamily.trim().toLowerCase() ===
            family.designacao.trim().toLowerCase()
        );
    
        if (familiaEncontrada) {
         
          setSelectedFamilyId(familiaEncontrada.id);
          
          console.log("encontrei familyId", familiaEncontrada.id);
        }
      }
    
      if (selectedTipo) {
    
    
        const tipoEncontrado = tipos.find(
          (tipo) =>
            selectedTipo.trim().toLowerCase() ===
            tipo.designacao.trim().toLowerCase()
        );
    
        if (tipoEncontrado) {
         
          setSelectedTipoId(tipoEncontrado.id);
          
          console.log("encontrei tipoId", tipoEncontrado.id);
        }
      }
    
      if (selectedMotivoIsencao) {
    
        console.log("motivo de isencao.")
    
        const motivoEncontrado = motivosIsencao.find(
          (motivo) =>
            selectedMotivoIsencao.trim().toLowerCase() ===
            motivo.designacao.trim().toLowerCase()
        );
    
        if (motivoEncontrado) {
         
          setSelectedMotivoIsencaoId(motivoEncontrado.id);
          
          console.log("encontrei motivoId", motivoEncontrado.id);
        }
      }
    
    
      },[selectedCategory,selectedImposto,
        selectedMarca,selectedTipo,selectedFamily,selectedMotivoIsencao])
    
    
    
      useEffect(() => {
      if (precoL) {
        setPrecoIliquido(
          ((parseFloat(precoL) - parseFloat(precoL) * taxa/100).toFixed(2)).toString()
        )
      }
    }, [selectedImpostoTaxa]);
    
    useEffect(()=> {
    
        if(!precoL)
        {
          setPrecoIliquido('')
        }
    
    },[precoL])
    
     useEffect(()=> 
      {
        if(!precoIL)
        {
          setPrecoLiquido('')
        }
      },[precoIL])
    
      useEffect(() => 
        {
          if (selectedImpostoId === 4)
          {
            setTextAreaEnabled(true)
          }
          else 
          {
            setTextAreaEnabled(false)
          }
      
      },[selectedImpostoId])
    
        
      useEffect(()=> {
    
        async function loadData()
        {
           
            await loadImpostos()
            await loadCategorias()
            await loadFamilias()
            await loadTipos()
            await loadMarcas()
            await loadMotivosIsencao()
        }
    
        loadData()
      },[])
    
     async function loadMotivosIsencao()
      {
        try{
    
          const response = await api.get('/motivoisencao')
    
          setMotivosIsencao(response.data.data)
    
        }
        catch(err)
        {
          if (err instanceof Error)
            console.log(err.message)
        }
        finally
        {
    
        }
      }
    
    
      async function loadMarcas()
      {
        try{
    
          const response = await api.get('/marca')
    
          setMarcas(response.data.data)
          // console.log('impostos:', response.data.data.data)
    
        }
        catch(err)
        {
          if(err instanceof Error)
            console.log(err.message)
        }
        finally
        {
    
        }
      }
    
    
      async function loadFamilias()
      {
        try{
    
          const response = await api.get('/familia')
    
          setFamilias(response.data.data)
          // console.log('impostos:', response.data.data.data)
    
        }
        catch(err)
        {
          if(err instanceof Error)
            console.log(err.message)
        }
        finally
        {
    
        }
      }
    
      async function loadTipos()
      {
        try{
    
          const response = await api.get('/tipo')
    
          setTipos(response.data.data)
          // console.log('impostos:', response.data.data.data)
    
        }
        catch(err)
        {
          if(err instanceof Error)
            console.log(err.message)
        }
        finally
        {
    
        }
      }
    
      async function loadImpostos()
      {
        try{
    
          const response = await api.get('/imposto')
    
          setImpostos(response.data.data)
          // console.log('impostos:', response.data.data.data)
    
        }
        catch(err)
        {
          if(err instanceof Error)
            console.log(err.message)
        }
        finally
        {
    
        }
      }
    
       async function loadCategorias()
       {
        try{
    
          const response = await api.get('/categoria')
    
          setCategorias(response.data.data)
         console.log('categorias:', response.data.data)
    
        }
        catch(err)
        {
          if(err instanceof Error)
            console.log(err.message)
        }
        finally
        {
    
        }
      }


     async function ActualizarProduto()
     {
      const payload = 
      {
       
        designacao: designacao,
        categoria_id: selectedCategoryId,
        preco_venda_liquido_1: precoL,
        preco_venda_iliquido_1: precoIL,
        preco_venda_liquido_2: 0,
        preco_venda_iliquido_2: 0,
        preco_venda_liquido_3: 0,
        preco_venda_iliquido_3: 0,
        preco_venda_liquido_4: 0,
        preco_venda_iliquido_4: 0,
        preco_venda_liquido_5: 0,
        preco_venda_iliquido_5: 0,
        marca_id: selectedMarcaId ||undefined,
        familia_id: selectedFamilyId ||undefined,
        tipo_produto_id: selectedTipoId ||undefined,
        motivo_isencao_id:selectedMotivoIsencaoId??'',
        imposto_id:selectedImpostoId,
        
      }
       
        const token  = await AsyncStorage.getItem("@token")
        
        try
        {
          setVisible(false)
          setLoading(true)  
          
           //console.log('id eh este ',produto?.id)

           await api.put(`/produtos/${produto?.id}`,
            payload, {
            headers: { Authorization: `Bearer ${token}` },
            } 
          )
        

          const response = await api.get('/produtos')
           setProdutos(response.data.data)
           setFiltrados(response.data.data)

          Alert.alert('Produto actualizado com sucesso!',)

        }

        catch (err:any)
        {
            console.log('Erro ao actualizar produto: ',err.response?.data)
        }

        finally
        {
           setLoading(false)
        }
        

     }









    return (

        <Portal>
            <Dialog visible={visible} 
            onDismiss={()=>setVisible(false)}
            style={{ backgroundColor: '#fff' }}> 
            
          <KeyboardAvoidingView
           behavior={"height"}
          >
              <Dialog.Title style={{color: colors.blue, fontSize:14,
                textAlign:'center',
                fontWeight:'bold'
            }}>
              Actualizar o produto {produto?.designacao}
              </Dialog.Title>

         
          <Dialog.Content>
            
            <ScrollView
            style={{ maxHeight: 450, paddingHorizontal:3}}
            
             showsVerticalScrollIndicator={false}>
            <View>

              <View style={styles.dialogContentStyle}>
                <Text style={styles.dialogTextStyle}> Código:</Text>
                <TextInput  value={codigo} onChangeText={setCodigo}
                  editable={false}
                  style={[styles.TextFieldStyling,
                    {
                    backgroundColor: '#dcdcdc',
                    color: '#666'
                    }
                  ]}/>
              </View>


              <View style={styles.dialogContentStyle}>
                <Text style={styles.dialogTextStyle}> Nome:</Text>
                <TextInput  value={designacao} onChangeText={setDesignacao}
                style={styles.TextFieldStyling}/>
              </View>

              <View style={styles.dialogContentStyle}>
                <Text style={styles.dialogTextStyle}> Categoria:</Text>
                
                <Select
                    label="Categorias"
                    placeholder="Selecione a categoria"
                    options ={categorias.map(categoria => ({
                      label: categoria.designacao,
                      value: categoria.designacao
                    }))}
                    selectedValue={selectedCategory}
                    onValueChange={setSelectedCategory}
                />
              </View>

              <View style={styles.dialogContentStyle}>
                <Text style={styles.dialogTextStyle}>Preço líquido 1:</Text>
                <TextInput value={precoL} 
                onChangeText={ (text) => {
                  setPrecoLiquido(text)
                  
                  setPrecoIliquido(((parseFloat(text) - parseFloat(text)*taxa/100).toFixed(2)).toString())

                   }
                }

                keyboardType='numeric'
                style={styles.TextFieldStyling}/>
              </View>

              <View style={styles.dialogContentStyle}>
                <Text style={styles.dialogTextStyle}>Preço ilíquido 1:</Text>
                <TextInput value={precoIL} onChangeText={(text) =>{
                  
                  setPrecoIliquido(text)

                  setPrecoLiquido(((parseFloat(text) + parseFloat(text)*taxa/100).toFixed(2)).toString())
           
                }}
                keyboardType='numeric'
                style={styles.TextFieldStyling}/>
              </View>

              <View style={styles.dialogContent}>
                <Text style={[styles.dialogTextStyle
                  ,{paddingRight:45}
                ]}> IVA:</Text>
               
                 <Select
                    label="Impostos"
                    placeholder="Selecione o imposto"
                     options ={impostos.map(imposto =>
                    ({
                        label:imposto.designacao,
                        value: imposto.designacao
                    }))}
                    selectedValue={selectedImposto}
                    onValueChange={setSelectedImposto}
                />
              </View>
              
              { TextAreaEnabled &&
              <View style={styles.dialogContent}>
                   
                  <View style={{flexDirection:'column'}}>
                    <Text style={styles.dialogTextIsencao}> 
                      Isenção:
                    </Text>
                    <Text style={styles.dialogTextIsencao}>
                      de IVA
                    </Text>
                  </View>
              <Select
                    label="Motivo de isenção"
                    placeholder="Qual o motivo da isenção ?"
                    options ={motivosIsencao.map(m => ({
                      label: m.designacao,
                      value: m.designacao
                    }))}
                    selectedValue={selectedMotivoIsencao}
                    onValueChange={setSelectedMotivoIsencao}
                />
                 </View>

              }
                
                <View style={styles.dialogContent}>
                <Text style={[styles.dialogTextStyle
                  , {paddingRight:30}
                ]}> Marca:</Text>
                
                <Select
                    label="Marcas"
                    placeholder="Selecione a marca"
                    options ={marcas.map(marca => ({
                      label: marca.nome,
                      value: marca.nome
                    }))}
                    selectedValue={selectedMarca}
                    onValueChange={setSelectedMarca}
                />
                </View>

                 <View style={styles.dialogContent}>
                <Text style={[styles.dialogTextStyle,
                   ,{paddingRight:40}
                ]}> Tipo:</Text>
                
                <Select
                    label="Tipo"
                    placeholder="Selecione o tipo"
                    options ={tipos.map(tipo => ({
                      label: tipo.designacao,
                      value: tipo.designacao
                    }))}
                    selectedValue={selectedTipo}
                    onValueChange={setSelectedTipo}
                />
                </View>


              <View style={styles.dialogContent}>
                <Text style={[styles.dialogTextStyle,
                   ,{paddingRight:25}
                ]}> Família:</Text>
                
                <Select
                    label="Famílias"
                    placeholder="Selecione a família"
                    options ={familias.map(familia => ({
                      label:familia?.designacao?? "",
                      value: familia.designacao
                    }))}
                    selectedValue={selectedFamily}
                    onValueChange={setSelectedFamily}
                />
              </View>

               </View>
              </ScrollView>

              <View style={[{marginTop:5},styles.dialogContentStyle]}>
                <Text style={styles.dialogTextStyle}>

                   Total: MZN {""} {formatMoney(total)}
                </Text>
               
              </View>
          
          </Dialog.Content>
          <Dialog.Actions style={{flexDirection:'row',
            alignItems:'center'}}>

            <Button onPress={() => {
               ActualizarProduto()
            }}>
              <View style={{flexDirection:'row',
                justifyContent:'space-around', alignItems:'center'}}> 
                <Text style={{color:colors.blue,
                  fontWeight:'bold'}}>
                    Actualizar
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
           </KeyboardAvoidingView>
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
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13,
    color: '#1C1C1E',
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
