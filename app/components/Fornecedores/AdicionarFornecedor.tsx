import { api } from '@/services/api';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text, TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AddFornecedorProps
{
    openModal: boolean
    setOpenModal : React.Dispatch<React.SetStateAction<boolean>>;
    
}
export default function AdicionarFornecedor({openModal,setOpenModal}:AddFornecedorProps)
{

    const [codigo, setCodigo] = useState("");
    const [nome, setNome] = useState("");
    const [nuit, setNuit] = useState("");
    const [morada, setMorada] = useState("");
    const [bairro, setBairro] = useState("");
    const [cidade, setCidade] = useState("");
    const [provincia, setProvincia] = useState("");
    const [limiteCredito, setLimiteCredito] = useState('');
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleCreateFornecedor() {
        try {
           
            const payload = {
            codigo,
            nome,
            nuit,
            morada,
            bairro,
            cidade,
            provincia,
            limite_credito: limiteCredito,
            email,
            telefone,
            };
 setLoading(true)
            await api.post('/fornecedor', payload);

            Alert.alert('Sucesso', 'Fornecedor cadastrado com sucesso!');

            // limpar campos
            setCodigo('');
            setNome('');
            setNuit('');
            setMorada('');
            setBairro('');
            setCidade('');
            setProvincia('');
            setLimiteCredito('');
            setEmail('');
            setTelefone('');

            // fechar modal
            setOpenModal(false);

        } catch (error) {
            console.log(error);
            Alert.alert('Erro', 'Não foi possível cadastrar fornecedor');
        }
        finally
        {
             setLoading(false)
        }
}




   return (

     <Modal visible={openModal} animationType="slide">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setOpenModal(false)}>
              <Text style={styles.modalCloseBtn}>‹ Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Novo Fornecedor</Text>
            <View style={{ width: 50 }} />
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalContent}
          >
            <View style={styles.formCard}>
              <Text style={styles.fieldLabel}>Código</Text>
              <TextInput
                placeholder="Código"
                value={codigo}
                onChangeText={setCodigo}
                style={styles.fieldInput}
              />
              <Text style={styles.fieldLabel}>Nome</Text>
              <TextInput
                placeholder="Nome completo"
                value={nome}
                onChangeText={setNome}
                style={styles.fieldInput}
              />
              <Text style={styles.fieldLabel}>Nuit</Text>
              <TextInput
                placeholder="Nuit"
                value={nuit}
                onChangeText={setNuit}
                style={styles.fieldInput}
                keyboardType="numeric"
              />

              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                placeholder="email@exemplo.com"
                value={email}
                onChangeText={setEmail}
                style={styles.fieldInput}
                keyboardType="email-address"
              />

              <Text style={styles.fieldLabel}>Telefone</Text>
              <TextInput
                placeholder="Digite o telefone"
                value={telefone}
                onChangeText={setTelefone}
                style={styles.fieldInput}
                keyboardType="numeric" />
              
              <Text style={styles.fieldLabel}>Morada</Text>
              <TextInput
                placeholder="Morada"
                value={morada}
                onChangeText={setMorada}
                style={styles.fieldInput}
              />

              <Text style={styles.fieldLabel}>Bairro</Text>
              <TextInput
                placeholder="Bairro"
                value={bairro}
                onChangeText={setBairro}
                style={styles.fieldInput}
              />

              <Text style={styles.fieldLabel}>Cidade</Text>
              <TextInput
                placeholder="Cidade"
                value={cidade}
                onChangeText={setCidade}
                style={styles.fieldInput}
              />
              
              <Text style={styles.fieldLabel}>Província</Text>
              <TextInput
                placeholder="Província"
                value={provincia}
                onChangeText={setProvincia}
                style={styles.fieldInput}
              />

              <Text style={styles.fieldLabel}>Limite de crédito</Text>
              <TextInput
                placeholder="Digite o limite de crédito"
                value={limiteCredito}
                onChangeText={setLimiteCredito}
                style={styles.fieldInput}
                keyboardType="numeric" />
              
              
            
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.btnCancel}
              onPress={() => setOpenModal(false)}
            >
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnSave} 
            onPress={()=> handleCreateFornecedor()}>
                
              <Text style={styles.btnSaveText}>

                {loading?'Adicionando...':'Adicionar'}
               
                </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
   )
}




const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    backgroundColor: "#1e5aa8",
    padding: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  scroll: {
    flex: 1,
    padding: 10,
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
    color: "#888",
    fontWeight: "bold",
    fontSize: 13,
  },
  item: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  value: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  arrow: {
    fontSize: 18,
    color: "#999",
  },
  modal: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5EA",
    backgroundColor: "#fff",
  },
  modalCloseBtn: {
    fontSize: 16,
    color: "#185FA5",
    fontWeight: "500",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  modalScroll: {
    flex: 1,
  },
  modalContent: {
    padding: 14,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#185FA5",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  profileCargo: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  fieldSection: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
    marginTop: 16,
    marginBottom: 10,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#E5E5EA",
    padding: 14,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#8E8E93",
    marginBottom: 6,
    marginTop: 10,
  },
  fieldInput: {
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#E5E5EA",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1C1C1E",
  },
  passwordField: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeBtn: {
    padding: 8,
    position: "absolute",
    right: 8,
  },
  helperText: {
    fontSize: 11,
    color: "#8E8E93",
    fontStyle: "italic",
    marginTop: 8,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#E5E5EA",
  },
  btnCancel: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#185FA5",
  },
  btnCancelText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#185FA5",
  },
  btnSave: {
    flex: 1,
    backgroundColor: "#185FA5",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
   btnSaving: {
  
    backgroundColor: '#043668',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  btnSaveText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#E5E5EA",
    paddingTop: 15,
    marginBottom: 0,
    paddingBottom: 15,
    width: "100%",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  navIcon: {
    fontSize: 18,
    color: "#8E8E93",
  },
  navIconActive: {
    color: "#185FA5",
  },
  navLabel: {
    fontSize: 10,
    color: "#8E8E93",
  },
  navLabelActive: {
    color: "#185FA5",
    fontWeight: "500",
  },
  navDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#185FA5",
    marginTop: 1,
  },
});
