import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from "react-native";
export default function Conection() {
  const [ip, setIp] = useState("");
  const [porta, setPorta] = useState("8000");
  const [database, setDatabase] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Configuração do Servidor</Text>

      <Text style={styles.label}>IP do Servidor</Text>
      <TextInput
        style={styles.input}
        value={ip}
        onChangeText={setIp}
        placeholder="192.168.0.100"
      />

      <Text style={styles.label}>Porta da API</Text>
      <TextInput
        style={styles.input}
        value={porta}
        onChangeText={setPorta}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Base de Dados</Text>
      <TextInput
        style={styles.input}
        value={database}
        onChangeText={setDatabase}
        placeholder="software_vendas"
      />

      <Text style={styles.label}>Utilizador</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Palavra-passe</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.testButton}>
        <Text style={styles.buttonText}>Testar Conexão</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.buttonText}>Guardar Configuração</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.offlineButton}
        onPress={() => router.replace("/login/login")}
        >
        <Text style={styles.offlineText}>Continuar Offline</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F9",
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#185FA5",
    marginBottom: 30,
    textAlign: "center",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },

  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 16,
  },

  testButton: {
    backgroundColor: "#185FA5",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },

  saveButton: {
    backgroundColor: "#0D8B4E",
    padding: 15,
    borderRadius: 12,
    marginTop: 12,
  },

  offlineButton: {
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
  },

  offlineText: {
    color: "#666",
    fontWeight: "600",
  },
});