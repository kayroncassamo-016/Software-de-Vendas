import { configureApi } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

const API_VERSION = "/api/v1";

export default function Conection() {
  const router = useRouter();

  const [ip, setIp] = useState("");
  const [porta, setPorta] = useState("8000");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    const serverIp = await AsyncStorage.getItem("@server_ip");
    const serverPort = await AsyncStorage.getItem("@server_port");

    if (serverIp) setIp(serverIp);
    if (serverPort) setPorta(serverPort);
  }

  function buildUrl() {
    return `http://${ip}:${porta}${API_VERSION}`;
  }

  async function testarConexao() {
    try {
      setLoading(true);

      const url = buildUrl();

      const response = await axios.get(`${url}/test`, {
        timeout: 5000,
      });

      console.log('URL:', url);
      console.log('Resposta: ', response);

      Alert.alert(
        "Sucesso",
        "Conexão estabelecida com sucesso."
      );
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível comunicar com o servidor."
      );
    } finally {
      setLoading(false);
    }
  }

  async function guardarConfiguracao() {
    try {
      if (!ip.trim()) {
        Alert.alert("Erro", "Informe o IP do servidor.");
        return;
      }

      const config = {
        host: ip,
        port: porta,
      };

      await AsyncStorage.setItem(
        "@server_config",
        JSON.stringify(config)
      );

      await configureApi();

      Alert.alert(
        "Sucesso",
        "Configuração guardada com sucesso."
      );

      router.replace("/login/login");
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível guardar a configuração."
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Configuração do Servidor
      </Text>

      <Text style={styles.label}>IP do Servidor</Text>
      <TextInput
        style={styles.input}
        value={ip}
        onChangeText={setIp}
        placeholder="192.168.0.46"
      />

      <Text style={styles.label}>Porta da API</Text>
      <TextInput
        style={styles.input}
        value={porta}
        onChangeText={setPorta}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.testButton}
        onPress={testarConexao}
      >
        <Text style={styles.buttonText}>
          {loading ? "Testando..." : "Testar Conexão"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={guardarConfiguracao}
      >
        <Text style={styles.buttonText}>
          Guardar Configuração
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.offlineButton}
        onPress={() => router.replace("/login/login")}
      >
        <Text style={styles.offlineText}>
          Continuar Offline
        </Text>
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
    padding: 20,
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