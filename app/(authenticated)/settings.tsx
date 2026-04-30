import { colors } from '@/constants/theme';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const ConfigScreen = () => {
  const [usuario, setUsuario] = useState({
    nome: 'Kayron Cassamo',
    senha: '400123456',
  });

  const [notificacoes, setNotificacoes] = useState(true);
  const [temaEscuro, setTemaEscuro] = useState(false);

  const [modalUsuario, setModalUsuario] = useState(false);
  const [nome, setNome] = useState(usuario.nome);
  const [senha, setSenha] = useState(usuario.senha);

  const salvarUsuario = () => {
    setUsuario({ nome, senha });
    setModalUsuario(false);
  };

  const Item = ({ label, value, onPress, toggle, onToggle }:any) => (
    <TouchableOpacity style={styles.item} onPress={onPress} disabled={toggle}>
      <View>
        <Text style={styles.label}>{label}</Text>
        {value && <Text style={styles.value}>{value}</Text>}
      </View>

      {toggle ? (
        <Switch value={value} onValueChange={onToggle} />
      ) : (
        <Text style={styles.arrow}>›</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#185FA5" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <ScrollView style={styles.scroll}>
        
        {/* EMPRESA */}
        <Text style={styles.section}>Usuário</Text>

        <Item
          label="Dados do usuário"
          value={`${usuario.nome} `}
          onPress={() => setModalUsuario(true)}
        />

        {/* FACTURA
        <Text style={styles.section}>Facturação</Text>

        <Item
          label="IVA"
          value="17%"
          onPress={() => Alert.alert('Editar IVA')}
        /> */}

        {/* PREFERENCIAS */}
        <Text style={styles.section}>Preferências</Text>

        <Item
          label="Notificações"
          value={notificacoes}
          toggle
          onToggle={setNotificacoes}
        />

        <Item
          label="Tema escuro"
          value={temaEscuro}
          toggle
          onToggle={setTemaEscuro}
        />

        {/* SESSAO */}
        <Text style={styles.section}>Sessão</Text>

        <Item
          label="Sair"
          onPress={() => Alert.alert('Logout')}
        />

      </ScrollView>

      {/* MODAL EMPRESA */}
      <Modal visible={modalUsuario} animationType="slide">
        <SafeAreaView style={styles.modal}>
          <Text style={styles.modalTitle}>Usuário</Text>

          <TextInput
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />

          <TextInput
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            style={styles.input}
          />

          <TouchableOpacity onPress={salvarUsuario} style={styles.btn}>
            <Text style={{ color: '#fff' }}>Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalUsuario(false)}>
            <Text style={{ marginTop: 10 }}>Cancelar</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default ConfigScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#185FA5' },

  header: {
    padding: 16,
    backgroundColor: colors.blue,
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  scroll: {
    backgroundColor: '#f4f6f9',
    flex: 1,
    padding: 10,
  },

  section: {
    marginTop: 20,
    marginBottom: 10,
    color: '#888',
    fontWeight: 'bold',
  },

  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
  },

  value: {
    fontSize: 12,
    color: '#666',
  },

  arrow: {
    fontSize: 18,
    color: '#999',
  },

  modal: {
    flex: 1,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  btn: {
    backgroundColor: colors.blue,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});