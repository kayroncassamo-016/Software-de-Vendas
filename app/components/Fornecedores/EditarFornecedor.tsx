import { api } from '@/services/api';
import { Fornecedores } from '@/types/types';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface EditFornecedorProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fornecedor: Fornecedores | null;

}

export default function EditarFornecedor({
  openModal,
  setOpenModal,
  fornecedor,

}: EditFornecedorProps) {

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

  // 👉 preencher automaticamente ao abrir modal
  useEffect(() => {
    if (fornecedor) {
      setCodigo(fornecedor.codigo || "");
      setNome(fornecedor.nome || "");
      setNuit(fornecedor.nuit || "");
      setMorada(fornecedor.morada || "");
      setBairro(fornecedor.bairro || "");
      setCidade(fornecedor.cidade || "");
      setProvincia(fornecedor.provincia || "");
      setLimiteCredito(String(fornecedor.limite_credito || ""));
      setEmail(fornecedor.email || "");
      setTelefone(fornecedor.telefone || "");
    }
  }, [fornecedor]);

  async function handleUpdateFornecedor() {
    try {
      if (!fornecedor) return;

      setLoading(true);

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

      await api.put(`/fornecedor/${fornecedor.id}`, payload);

      Alert.alert('Sucesso', 'Fornecedor atualizado com sucesso!');

  
      setOpenModal(false);

    } catch (error:any) {
      console.log(error.response);
      Alert.alert('Erro', 'Não foi possível atualizar fornecedor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={openModal} animationType="slide">
      <SafeAreaView style={styles.modal}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setOpenModal(false)}>
            <Text style={styles.modalCloseBtn}>‹ Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Editar Fornecedor</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView
          style={styles.modalScroll}
          contentContainerStyle={styles.modalContent}
        >
          <View style={styles.formCard}>
            <Text style={styles.fieldLabel}>Código</Text>
            <TextInput value={codigo} editable={false}
            onChangeText={setCodigo} style={styles.fieldInputCodigo} />

            <Text style={styles.fieldLabel}>Nome</Text>
            <TextInput value={nome} onChangeText={setNome} style={styles.fieldInput} />

            <Text style={styles.fieldLabel}>Nuit</Text>
            <TextInput value={nuit} onChangeText={setNuit} style={styles.fieldInput} />

            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput value={email} onChangeText={setEmail} style={styles.fieldInput} />

            <Text style={styles.fieldLabel}>Telefone</Text>
            <TextInput value={telefone} onChangeText={setTelefone} style={styles.fieldInput} />

            <Text style={styles.fieldLabel}>Morada</Text>
            <TextInput value={morada} onChangeText={setMorada} style={styles.fieldInput} />

            <Text style={styles.fieldLabel}>Bairro</Text>
            <TextInput value={bairro} onChangeText={setBairro} style={styles.fieldInput} />

            <Text style={styles.fieldLabel}>Cidade</Text>
            <TextInput value={cidade} onChangeText={setCidade} style={styles.fieldInput} />

            <Text style={styles.fieldLabel}>Província</Text>
            <TextInput value={provincia} onChangeText={setProvincia} style={styles.fieldInput} />

            <Text style={styles.fieldLabel}>Limite de crédito</Text>
            <TextInput
              value={limiteCredito}
              onChangeText={setLimiteCredito}
              style={styles.fieldInput}
            />
          </View>
        </ScrollView>

        <View style={styles.modalActions}>
          <TouchableOpacity
            style={styles.btnCancel}
            onPress={() => setOpenModal(false)}
          >
            <Text style={styles.btnCancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSave}
            onPress={handleUpdateFornecedor}
          >
            <Text style={styles.btnSaveText}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { flex: 1, backgroundColor: "#F2F2F7" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff"
  },
  modalCloseBtn: { color: "#185FA5", fontWeight: "500" },
  modalTitle: { fontWeight: "600" },
  modalScroll: { flex: 1 },
  modalContent: { padding: 14 },
  formCard: { backgroundColor: "#fff", padding: 14, borderRadius: 12 },
  fieldLabel: { fontSize: 12, marginTop: 10 },
  fieldInput: {
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
     paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 5
  },
  fieldInputCodigo: {
    backgroundColor:'#949393',
    borderRadius: 8,
     paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 5
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
  btnCancelText: { color: "#185FA5" },

 btnSave: {
    flex: 1,
    backgroundColor: "#185FA5",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },

  btnSaveText: { color: "#fff" }
});