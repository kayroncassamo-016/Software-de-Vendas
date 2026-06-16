import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  Cog,
  Grid2X2,
  Handshake,
  Package,
  ShoppingBag,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  RefreshControl,
  // SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/constants/theme";
import { api } from "@/services/api";
import { Clientes } from "@/types/types";
import { AdicionarCliente } from "../components/Clientes/AdicionarCliente";
import { DeletarCliente } from "../components/Clientes/DeletarCliente";
import { DetalhesCliente } from "../components/Clientes/DetalhesCliente";
import { EditarCliente } from "../components/Clientes/EditarCliente";

import { isOnline } from "@/utils/network";

import { ClienteRepository } from "../database/ClienteRepository";

const NAV_ITEMS = [
  { icon: ShoppingBag, label: "Vendas" },
  { icon: Handshake, label: "Clientes" },
  { icon: Grid2X2, label: "Painel" },
  { icon: Package, label: "Produtos" },
  { icon: Cog, label: "Config." },
];

//─── Badge de cliente ─────────────────────────────────────────────
const BadgeTipoCliente = ({ tipo }: any) => {
  if (tipo === "empresa") {
    return (
      <Text
        style={{
          backgroundColor: "#c9ccec",
          color: "#4f0fe2",
          paddingHorizontal: 5,
          paddingVertical: 2,
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 500,
        }}
      >
        {tipo}
      </Text>
    );
  } else {
    return (
      <Text
        style={{
          backgroundColor: "#fae5d9",
          color: "#854F0B",
          padding: 1,
          borderRadius: 20,
          fontSize: 11,
          paddingHorizontal: 5,
          paddingVertical: 2,
          fontWeight: 500,
        }}
      >
        {tipo}
      </Text>
    );
  }
};

interface clienteItemProps {
  cliente: Clientes;
  onPress: () => void;
}

export default function ClienteScreen() {
  const [searchText, setSearchText] = useState<string>("");
  const [activeNav, setActiveNav] = useState(1);

  const [clientes, setClientes] = useState<Clientes[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [filtrados, setFiltrados] = useState<Clientes[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Clientes | null>(null);
  const [visibleFormCadastro, setVisibleFormCadastro] = useState(false);
  const [visibleDetalhesCliente, setVisibleDetalhesCliente] = useState(false);
  const [visibleDeletarCliente, setVisibleDeletarCliente] = useState(false);
  const [visibleEditarCliente, setVisibleEditarCliente] = useState(false);
  const [loadingInicial, setLoadingInicial] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();

  const ClienteItem = ({ cliente, onPress }: clienteItemProps) => {
    return (
      <TouchableOpacity
        style={styles.clienteCard}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.clienteLeft}>
          <Text style={styles.clienteNome}>{cliente.nome}</Text>
          {/* <BadgeTipoCliente tipo = {cliente.tipo}/> */}

          <Text
            style={{
              color: "#838282",
            }}
          >
            {cliente.email}
          </Text>
        </View>

        <View style={""}>
          {/* {cliente.tipo} */}
          <BadgeTipoCliente tipo={cliente.tipo} />
        </View>
      </TouchableOpacity>
    );
  };

  function navigatePage(pageIndex: number) {
    setActiveNav(pageIndex);

    if (pageIndex === 2) {
      router.push("/(authenticated)/dashboard");
    }

    if (pageIndex === 4) {
      router.push("/(authenticated)/settings");
    }

    if (pageIndex === 3) {
      router.push("/(authenticated)/produtos");
    }

    if (pageIndex === 0) {
      router.push("/(authenticated)/vendas");
    }
  }

  const handleSearch = (text: string): void => {
    setSearchText(text);
    if (text === "") {
      setFiltrados(clientes);
    } else {
      const filtered = clientes.filter(
        (c) =>
          c.nome.toLowerCase().includes(text.toLowerCase()) ||
          c.tipo.toLowerCase().includes(text.toLowerCase()),
      );
      setFiltrados(filtered);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        setLoadingClientes(true);
        await loadClientes();
      } finally {
        setLoadingClientes(false);
      }
    }

    init();
  }, []);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      await Promise.all([loadClientes()]);
    } catch (err) {
      console.log(err);
    }
  }

  async function onRefresh() {
    try {
      setRefreshing(true);

      await loadStats();
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    async function loadData() {
      await Promise.all([loadClientes()]);
    }

    loadData();
  }, []);

  async function loadClientes() {
    const token = await AsyncStorage.getItem("@token");
    const online = await isOnline();

    try {
      // setLoadingClientes(true)

      if (online) {
        const response = await api.get("/clientes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setClientes(response.data.data);
        setFiltrados(response.data.data);

        ClienteRepository.saveMany(response.data.data);

       
      } else {
        const local = ClienteRepository.getAll();
        setClientes(local);
        setFiltrados(local);
       
      }
    } catch (err: any) {
      console.log(err.response);
    } finally {
      //    setLoadingClientes(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#185FA5" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Clientes</Text>
          <Text style={styles.headerSub}>
            {filtrados?.length || 0} Clientes no catálogo
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Pesquisar cliente..."
          placeholderTextColor="#AEAEB2"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>
      {/*Detalhes do cliente seleccionado*/}
      <DetalhesCliente
        visible={visibleDetalhesCliente}
        setVisible={setVisibleDetalhesCliente}
        cliente={clienteSeleccionado}
        setVisibleDeletarcliente={setVisibleDeletarCliente}
        setVisibleEditarcliente={setVisibleEditarCliente}
      />

      <DeletarCliente
        visible={visibleDeletarCliente}
        setVisible={setVisibleDeletarCliente}
        cliente={clienteSeleccionado}
        setClientes={setClientes}
        setFiltrados={setFiltrados}
        setVisibleDetalhesCliente={setVisibleDetalhesCliente}
      />

      <AdicionarCliente
        visible={visibleFormCadastro}
        setVisible={setVisibleFormCadastro}
        setLoading={setLoadingClientes}
        setClientes={setClientes}
        setFiltrados={setFiltrados}
      />

      <EditarCliente
        cliente={clienteSeleccionado}
        visible={visibleEditarCliente}
        setVisible={setVisibleEditarCliente}
        setLoading={setLoadingClientes}
        setClientes={setClientes}
        setFiltrados={setFiltrados}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#185FA5"]}
            tintColor="#185FA5"
          />
        }
      >
        {loadingClientes ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.blue} />
          </View>
        ) : filtrados.length > 0 ? (
          filtrados.map((cliente, index) => (
            <ClienteItem
              key={index}
              cliente={cliente}
              onPress={() => {
                setVisibleDetalhesCliente(true);
                setClienteSeleccionado(cliente);
              }}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Nenhum cliente encontrado</Text>
          </View>
        )}

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* FAB - Novo cliente */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setVisibleFormCadastro(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+ Novo cliente</Text>
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        {NAV_ITEMS.map((nav, i) => {
          const Icon = nav.icon;
          return (
            <TouchableOpacity
              key={i}
              style={styles.navItem}
              onPress={() => {
                navigatePage(i);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.navIcon, i === 1 && styles.navIconActive]}>
                <Icon color={"#5c5b5b"} />
              </Text>
              <Text style={[styles.navLabel, i === 1 && styles.navLabelActive]}>
                {nav.label}
              </Text>
              {i === 1 && <View style={styles.navDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    // backgroundColor: '#185FA5',
    backgroundColor: "#e4e4e4",
  },

  // Header
  header: {
    backgroundColor: "#1e5aa8",
    padding: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginHorizontal: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 2,
    borderRadius: 4,
    marginHorizontal: 10,
  },
  headerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
  },

  // Search container
  searchContainer: {
    backgroundColor: "#F2F2F7",
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

    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#E5E5EA",
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13,
    color: "#1C1C1E",
    marginTop: 10,
  },

  // ScrollView
  scroll: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  scrollContent: {
    padding: 20,
  },

  // cliente card
  clienteCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#E5E5EA",
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  clienteLeft: {
    flex: 1,
    gap: 6,
  },
  clienteNome: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1C1C1E",
  },
  clienteRight: {
    alignItems: "flex-end",
    gap: 3,
  },
  clientePreco: {
    fontSize: 15,
    fontWeight: "500",
    color: "#185FA5",
  },
  clienteIVA: {
    fontSize: 11,
    color: "#8E8E93",
  },

  // Categoria tag
  tagCategoria: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    alignSelf: "flex-start",
  },
  tagCategoriaText: {
    fontSize: 11,
    fontWeight: "500",
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 15,
    color: "#8E8E93",
  },

  // FAB
  fab: {
    position: "absolute",
    bottom: 140,
    right: 16,
    backgroundColor: "#185FA5",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#185FA5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },

  // Bottom nav
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#E5E5EA",
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 0,
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
  dialogTextStyle: {
    paddingRight: 10,
    fontWeight: "bold",
    color: "#000",
  },
  dialogTextIsencao: {
    paddingRight: 10,
    fontWeight: "bold",
    color: "#4ef097",
  },
  dialogContentStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  dialogContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },

  TextFieldStyling: {
    marginTop: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#7c7c7c6c",
    backgroundColor: "#eff3fd",
    color: "#000",
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F2F7",
  },
});
