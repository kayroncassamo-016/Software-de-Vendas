import { useContexto } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import {
  Categoria,
  Clientes,
  Fornecedores,
  Marca,
  Produtos,
  Tipo,
  Vendas,
} from "@/types/types";
import { formatMoney } from "@/utils/format";
import { useRouter } from "expo-router";
import {
  Cog,
  Grid2X2,
  Handshake,
  Package,
  ShoppingBag,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NetInfo from "@react-native-community/netinfo";

import { ClienteRepository } from "../database/ClienteRepository";
import { FornecedoresRepository } from '../database/FornecedoresRepository';
import { ProdutoRepository } from "../database/ProdutoRepository";
import { CategoriaRepository } from "../database/propriedades_produto/CategoriaRepository";
import { MarcaRepository } from "../database/propriedades_produto/MarcaRepository";
import { TipoRepository } from "../database/propriedades_produto/TipoRepository";
import { VendaRepository } from "../database/VendaRepository";






export default function DashBoard() {
  const [loadingProductNumber, SetLoadingProductNumber] = useState(false);
  const [loadingClienteNumber, SetLoadingClienteNumber] = useState(false);
  const [loadingVendasNumber, SetLoadingVendasNumber] = useState(false);
  const router = useRouter();
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalVendas, setTotalVendas] = useState(0);
  const [clientes, setClientes] = useState<Clientes[]>();
  const [clientesEmpresa, setClientesEmpresa] = useState<Clientes[]>();
  const [clientesParticular, setClientesParticular] = useState<Clientes[]>();
  const [clientesHomens, setClientesHomens] = useState<Clientes[]>();
  const [clientesMulheres, setClientesMulheres] = useState<Clientes[]>();
  const [novosClientes, setNovosClientes] = useState(0);

  const [produtos, setProdutos] = useState<Produtos[]>();
  const [categorias, setCategorias] = useState<Categoria[]>();
  const [marcas, setMarcas] = useState<Marca[]>();
  const [tipos, setTipos] = useState<Tipo[]>();
  const [fornecedores, setFornecedores] = useState<Fornecedores[]>();
  const [novosProdutos, setNovosProdutos] = useState(0);

  const [vendas, setVendas] = useState<Vendas[]>();
  const [novasVendas, setNovasVendas] = useState(0);
  const [vendasConfirmado, setVendasConfirmado] = useState<Vendas[]>();
  const [vendasConfirmadoVD, setVendasConfirmadoVD] = useState<Vendas[]>();
  const [vendasCancelado, setVendasCancelado] = useState<Vendas[]>();
  const [vendasRascunho, setVendasRascunho] = useState<Vendas[]>();
  const [vendasRascunhoVD, setVendasRascunhoVD] = useState<Vendas[]>();
  const [vendasFornecedorNE, setVendasFornecedorNE] = useState<Vendas[]>();
  const [vendasVD, setVendasVD] = useState<Vendas[]>();
  const [vendasNE, setVendasNE] = useState<Vendas[]>();
  const [vendasImpresso, setVendasImpresso] = useState<Vendas[]>();
  const [vendasImpressoAcumulado, setVendasImpressoAcumulado] =
    useState<number>(0);
  const [vendasConfirmadoAcumulado, setVendasConfirmadoAcumulado] =
    useState<number>(0);
  const [vendasRascunhoAcumulado, setVendasRascunhoAcumulado] =
    useState<number>(0);
  const [vendasFornecedorAcumulado, setVendasFornecedorAcumulado] =
    useState<number>(0);

  const [refreshing, setRefreshing] = useState(false);

  const { user } = useContexto();

  const [activeNav, setActiveNav] = useState(2);

  const data = new Date();

  const mes = data.toLocaleString("pt-PT", { month: "long" });

  const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);

  const ano = data.toLocaleString("pt-PT", { year: "numeric" });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      await Promise.all([
        loadingProductStats(),
        loadingClienteStats(),
        loadingVendasStats(),
        loadTipos(),
        loadMarcas(),
        loadCategorias(),
        loadFornecedores(),
      ]);
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
    if (produtos) {
      const hoje = new Date();

      const produtosHoje = produtos?.filter((produto: any) => {
        const dataCriacao = new Date(produto.created_at);

        return (
          dataCriacao.getDate() === hoje.getDate() &&
          dataCriacao.getMonth() === hoje.getMonth() &&
          dataCriacao.getFullYear() === hoje.getFullYear()
        );
      });

      setNovosProdutos(produtosHoje?.length ?? 0);
    }
    if (clientes) {
      const hoje = new Date();

      const clientesHoje = clientes?.filter((cliente) => {
        const dataCriacao = new Date(cliente.created_at);

        return (
          dataCriacao.getDate() === hoje.getDate() &&
          dataCriacao.getMonth() === hoje.getMonth() &&
          dataCriacao.getFullYear() === hoje.getFullYear()
        );
      });

      setNovosClientes(clientesHoje?.length ?? 0);

      setClientesEmpresa(
        clientes.filter((clienteEmpresa) => clienteEmpresa.tipo === "empresa"),
      );
      setClientesParticular(
        clientes.filter(
          (clienteEmpresa) => clienteEmpresa.tipo === "particular",
        ),
      );
      setClientesHomens(
        clientes.filter(
          (cliente) =>
            cliente.sexo === "Masculino" || cliente.sexo === "masculino",
        ),
      );
      setClientesMulheres(
        clientes.filter(
          (cliente) =>
            cliente.sexo === "Feminino" || cliente.sexo === "feminino",
        ),
      );
    }

    if (vendas) {
      const hoje = new Date();

      const vendasHoje = vendas?.filter((venda) => {
        const dataCriacao = new Date(venda.created_at);

        return (
          dataCriacao.getDate() === hoje.getDate() &&
          dataCriacao.getMonth() === hoje.getMonth() &&
          dataCriacao.getFullYear() === hoje.getFullYear()
        );
      });

      setNovasVendas(vendasHoje?.length ?? 0);
      setVendasRascunho(vendas.filter((venda) => venda.estado === "RASCUNHO"));
      setVendasRascunhoVD(
        vendas.filter(
          (venda) => venda.estado === "RASCUNHO" && venda.tipo_doc === "VD",
        ),
      );
      setVendasConfirmado(
        vendas.filter((venda) => venda.estado === "CONFIRMADO"),
      );
      setVendasConfirmadoVD(
        vendas.filter(
          (venda) => venda.estado === "CONFIRMADO" && venda.tipo_doc === "VD",
        ),
      );
      setVendasCancelado(
        vendas.filter((venda) => venda.estado === "CANCELADO"),
      );
      setVendasNE(vendas.filter((venda) => venda.tipo_doc === "NE"));
      setVendasVD(vendas.filter((venda) => venda.tipo_doc === "VD"));
      setVendasImpresso(
        vendas.filter(
          (venda) =>
            venda.impresso === true &&
            venda.estado !== "CANCELADO" &&
            venda.tipo_doc === "VD",
        ),
      );
    }
    if (fornecedores) {
      setVendasFornecedorNE(
        vendas?.filter((venda) => venda.impresso && venda.tipo_doc === "NE"),
      );
    }
  }, [produtos, clientes, vendas, fornecedores]);

  useEffect(() => {
    if (vendasImpresso) {
      setVendasImpressoAcumulado(
        vendasImpresso.reduce((acumulador, vendaAtual) => {
          const hoje = new Date();
          const dataCriacao = new Date(vendaAtual.created_at);

          if (
            dataCriacao.getMonth() === hoje.getMonth() &&
            dataCriacao.getFullYear() === hoje.getFullYear()
          ) {
            return acumulador + parseFloat(vendaAtual.total_doc);
          }

          return acumulador;
        }, 0),
      );
    }
  }, [vendasImpresso]);

  useEffect(() => {
    if (vendasConfirmadoVD) {
      setVendasConfirmadoAcumulado(
        vendasConfirmadoVD.reduce((acumulador, vendaAtual) => {
          const hoje = new Date();
          const dataCriacao = new Date(vendaAtual.created_at);

          if (
            dataCriacao.getMonth() === hoje.getMonth() &&
            dataCriacao.getFullYear() === hoje.getFullYear() &&
            !vendaAtual.impresso
          ) {
            return acumulador + parseFloat(vendaAtual.total_doc);
          }

          return acumulador;
        }, 0),
      );
    }
  }, [vendasConfirmadoVD]);

  useEffect(() => {
    if (vendasRascunhoVD) {
      setVendasRascunhoAcumulado(
        vendasRascunhoVD.reduce((acumulador, vendaAtual) => {
          const hoje = new Date();
          const dataCriacao = new Date(vendaAtual.created_at);

          if (
            dataCriacao.getMonth() === hoje.getMonth() &&
            dataCriacao.getFullYear() === hoje.getFullYear()
          ) {
            return acumulador + parseFloat(vendaAtual.total_doc);
          }

          return acumulador;
        }, 0),
      );
    }
  }, [vendasRascunhoVD]);

  useEffect(() => {
    if (vendasFornecedorNE) {
      setVendasFornecedorAcumulado(
        vendasFornecedorNE.reduce((acumulador, vendaAtual) => {
          const hoje = new Date();
          const dataCriacao = new Date(vendaAtual.created_at);

          if (
            dataCriacao.getMonth() === hoje.getMonth() &&
            dataCriacao.getFullYear() === hoje.getFullYear()
          ) {
            return acumulador + parseFloat(vendaAtual.total_doc);
          }

          return acumulador;
        }, 0),
      );
    }
  }, [vendasFornecedorNE]);

  useEffect(() => {
    async function loadStats() {
      await loadingProductStats();
      await loadingClienteStats();
      await loadingVendasStats();
      await loadTipos();
      await loadMarcas();
      await loadCategorias();
      await loadFornecedores();
    }

    loadStats();
    console.log("ENTROU");
    return () => {
      console.log("SAIU");
    };
  }, []);

  // async function loadingClienteStats() {
  //   try {
  //     SetLoadingClienteNumber(true);
  //     const res = await api.get("/clientes");
  //     setTotalClientes(res.data.data.length);
  //     setClientes(res.data.data);

  //     console.log(JSON.stringify(clientes?.[0], null, 2));
  //   } catch (err) {
  //     if (err instanceof Error) console.log(err.message);
  //   } finally {
  //     SetLoadingClienteNumber(false);
  //   }
  // }


 async function loadingClienteStats() {
  try {
    SetLoadingClienteNumber(true);

    const net = await NetInfo.fetch();

    if (net.isConnected) {
      const res = await api.get("/clientes");

      setTotalClientes(res.data.data.length);
      setClientes(res.data.data);

    } else {

      const clientesLocal = ClienteRepository.getAll();

      setClientes(clientesLocal);
      setTotalClientes(clientesLocal.length);
    }

  } catch (err) {
    console.log(err);
  } finally {
    SetLoadingClienteNumber(false);
  }
}



  // async function loadingProductStats() {
  //   try {
  //     SetLoadingProductNumber(true);
  //     const res = await api.get("/produtos");
  //     setTotalProdutos(res.data.data.length);
  //     setProdutos(res.data.data);
  //   } catch (err) {
  //     if (err instanceof Error) console.log(err.message);
  //   } finally {
  //     SetLoadingProductNumber(false);
  //   }
  // }


  async function loadingProductStats() {
  try {
    SetLoadingProductNumber(true);

    const net = await NetInfo.fetch();

    if (net.isConnected) {

      const res = await api.get("/produtos");

      setProdutos(res.data.data);
      setTotalProdutos(res.data.data.length);

    } else {

      const produtosLocal = ProdutoRepository.getAll();

      setProdutos(produtosLocal);
      setTotalProdutos(produtosLocal.length);
    }

  } catch (err) {
    console.log(err);
  } finally {
    SetLoadingProductNumber(false);
  }
}

async function loadingVendasStats() {
  try {

    SetLoadingVendasNumber(true);

    const net = await NetInfo.fetch();

    if (net.isConnected) {

      const res = await api.get("/documentos");

      setVendas(res.data.data.data);
      setTotalVendas(res.data.data.data.length);

    } else {

      const vendasLocal = VendaRepository.getAll();

      setVendas(vendasLocal);
      setTotalVendas(vendasLocal.length);
    }

  } catch (err) {
    console.log(err);
  } finally {
    SetLoadingVendasNumber(false);
  }
}


  // async function loadingVendasStats() {
  //   try {
  //     SetLoadingVendasNumber(true);
  //     const res = await api.get("/documentos");
  //     setTotalVendas(res.data.data.data.length);
  //     setVendas(res.data.data.data);
  //   } catch (err: any) {
  //     console.log(err.response);
  //   } finally {
  //     SetLoadingVendasNumber(false);
  //   }
  // }

  // async function loadMarcas() {
  //   try {
  //     const response = await api.get("/marcas");

  //     setMarcas(response.data.data);
  //   } catch (err) {
  //     if (err instanceof Error) console.log(err.message);
  //   } finally {
  //   }
  // }

  async function loadMarcas() {

  try {

    const net = await NetInfo.fetch();

    if (net.isConnected) {

      const response =
        await api.get("/marcas");

      setMarcas(response.data.data);

    } else {

      setMarcas(
        MarcaRepository.getAll()
      );
    }

  } catch (err) {
    console.log(err);
  }
}

  // async function loadTipos() {
  //   try {
  //     const response = await api.get("/tipo");

  //     setTipos(response.data.data);
  //   } catch (err) {
  //     if (err instanceof Error) console.log(err.message);
  //   } finally {
  //   }
  // }




  // async function loadCategorias() {
  //   try {
  //     const response = await api.get("/categorias");

  //     setCategorias(response.data.data);
  //   } catch (err) {
  //     if (err instanceof Error) console.log(err.message);
  //   } finally {
  //   }
  // }

  async function loadTipos() {

  try {

    const net = await NetInfo.fetch();

    if (net.isConnected) {

      const response =
        await api.get("/tipo");

      setTipos(response.data.data);

    } else {

      setTipos(
        TipoRepository.getAll()
      );
    }

  } catch (err) {
    console.log(err);
  }
}

  async function loadCategorias() {

  try {

    const net = await NetInfo.fetch();

    if (net.isConnected) {

      const response =
        await api.get("/categorias");

      setCategorias(response.data.data);

    } else {

      setCategorias(
        CategoriaRepository.getAll()
      );
    }

  } catch (err) {
    console.log(err);
  }
}




  async function loadFornecedores() {

  try {

    const net = await NetInfo.fetch();

    if (net.isConnected) {

      const response = await api.get("/fornecedor");

      setFornecedores(response.data.data);

    } else {

      const fornecedoresLocal =
        FornecedoresRepository.getAll();

      setFornecedores(fornecedoresLocal);
    }

  } catch (err) {
    console.log(err);
  }
}
  // async function loadFornecedores() {
  //   try {
  //     const response = await api.get("/fornecedor");
  //     setFornecedores(response.data.data);
  //   } catch (err: any) {
  //     console.log(err.response);
  //   } finally {
  //   }
  // }

  function navigatePage(pageIndex: number) {
    setActiveNav(pageIndex);

    if (pageIndex === 3) {
      router.push("/(authenticated)/produtos");
    }
    if (pageIndex === 4) {
      router.push("/(authenticated)/settings");
    }

    if (pageIndex === 1) {
      router.push("/(authenticated)/clientes");
    }

    if (pageIndex === 0) {
      router.push("/(authenticated)/vendas");
    }
  }

  const NAV_ITEMS = [
    { icon: ShoppingBag, label: "Vendas" },
    { icon: Handshake, label: "Clientes" },
    { icon: Grid2X2, label: "Painel" },
    { icon: Package, label: "Produtos" },
    { icon: Cog, label: "Config." },
  ];

  const BadgeEstadoVenda = ({ estado }: any) => {
    if (estado === "CONFIRMADO") {
      return (
        <View>
          <Text
            style={{
              backgroundColor: "#b9fcce",
              color: "#3fa04c",
              paddingHorizontal: 5,
              paddingVertical: 2,
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            {estado}
          </Text>
        </View>
      );
    } else if (estado === "CANCELADO") {
      return (
        <Text
          style={{
            backgroundColor: "#f58d8d",
            color: "#8d3131",
            padding: 1,
            borderRadius: 20,
            fontSize: 11,
            paddingHorizontal: 5,
            paddingVertical: 2,
            fontWeight: 500,
          }}
        >
          {estado}
        </Text>
      );
    } else if (estado === "RASCUNHO") {
      return (
        <Text
          style={{
            backgroundColor: "#ffe2b6",
            color: "#966f34",
            padding: 1,
            borderRadius: 20,
            fontSize: 11,
            paddingHorizontal: 5,
            paddingVertical: 2,
            fontWeight: 500,
          }}
        >
          {estado}
        </Text>
      );
    }
  };
  interface VendaProps {
    venda: Vendas;
  }

  function FacturaItem({ venda }: VendaProps) {
    const cliente = clientes?.find(
      (cliente) => cliente.id === venda.cliente_id,
    );
    const fornecedor = fornecedores?.find(
      (fornecedor) => fornecedor.id === venda.fornecedor_id,
    );

    const today = new Date();

    const date = new Date(venda.created_at);

    if (date.getMonth() === today.getMonth()) {
      return (
        <TouchableOpacity style={styles.facturaCard}>
          <View style={styles.facturaLeft}>
            <Text style={styles.facturaNum}>
              {venda.tipo_doc} {new Date().getFullYear() + "/" + venda.id}
            </Text>
            <Text style={styles.facturaCliente}>
              {cliente?.nome ?? fornecedor?.nome}
            </Text>
            <Text style={styles.facturaData}>
              {new Date(venda?.created_at).getDate()}{" "}
              {new Date(venda?.created_at).toLocaleString("pt-PT", {
                month: "short",
              })}{" "}
              {""}
              {new Date(venda?.created_at).getFullYear()}
            </Text>
          </View>
          <View style={styles.facturaRight}>
            <Text style={styles.facturaValor}>
              {formatMoney(venda.total_doc) + " MT"}{" "}
            </Text>
            <BadgeEstadoVenda estado={venda.estado} />
          </View>
        </TouchableOpacity>
      );
    } else return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#185FA5" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#185FA5"]}
            tintColor="#185FA5"
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Bom dia, {user?.user.name}</Text>
          <Text style={styles.subtitle}>
            Facturação — {mesCapitalizado} de {ano}
          </Text>
        </View>

        <View style={styles.grid}>
          {/* Faturado */}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Faturado (em VD's)</Text>

            <Text style={styles.value}>
              {formatMoney(vendasImpressoAcumulado) + " MT"}
            </Text>

            <Text style={styles.positive}>↑ 12% vs maio</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Por receber (em VD's)</Text>
            <Text style={styles.value}>
              {formatMoney(vendasConfirmadoAcumulado) + " MT"}
            </Text>
            <Text style={styles.danger}>
              {vendasConfirmadoVD?.filter((venda) => !venda.impresso).length}{" "}
              factura(s) pendente(s)
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pago (em NE's)</Text>

            <Text style={styles.value}>
              {formatMoney(vendasFornecedorAcumulado) + " MT"}
            </Text>

            <Text style={{ color: "green", fontSize: 12, marginTop: 10 }}>
              Valor total pago à fornecedores{" "}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Rascunhos (vendas não confirmadas)
            </Text>

            <Text style={styles.value}>
              {formatMoney(vendasRascunhoAcumulado) + " MT"}
            </Text>

            <Text style={{ color: "#966f34", fontSize: 12, marginTop: 10 }}>
              {" "}
              VD's não confirmadas{" "}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Fornecedores totais</Text>
            <Text style={styles.value}>{fornecedores?.length}</Text>
            <Text style={styles.cardTitle}>Alguns fornecedores:</Text>
            {fornecedores?.slice(0, 2).map((fornecedor, index) => (
              <Text
                key={index}
                style={{
                  color: "#555",
                  fontSize: 10,
                }}
              >
                • {fornecedor.nome}
              </Text>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Clientes totais</Text>
            {loadingClienteNumber ? (
              <Text
                style={{
                  fontStyle: "italic",
                  fontSize: 10,
                }}
              >
                Carregando...
              </Text>
            ) : (
              <Text style={styles.value}>{totalClientes}</Text>
            )}
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.positive}> + {novosClientes}</Text>
              <Text style={styles.neutral}> hoje</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.clienteEmpresa}>empresas</Text>

              <Text
                style={{
                  color: "#555",
                  fontSize: 11,
                }}
              >
                {" "}
                : {clientesEmpresa?.length}
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.clienteParticular}>particulares</Text>

              <Text
                style={{
                  color: "#555",
                  fontSize: 11,
                }}
              >
                : {clientesParticular?.length}
              </Text>
            </View>

            <View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    color: "#555",
                    fontSize: 11,
                    paddingLeft: 10,
                  }}
                >
                  {" "}
                  • Homens
                </Text>

                <Text
                  style={{
                    color: "#555",
                    fontSize: 11,
                  }}
                >
                  : {clientesHomens?.length}
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    color: "#555",
                    fontSize: 11,
                    paddingLeft: 10,
                  }}
                >
                  {" "}
                  • Mulheres
                </Text>

                <Text
                  style={{
                    color: "#555",
                    fontSize: 11,
                  }}
                >
                  : {clientesMulheres?.length}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Produtos totais</Text>

            {loadingProductNumber ? (
              <Text
                style={{
                  fontStyle: "italic",
                  fontSize: 10,
                }}
              >
                Carregando...
              </Text>
            ) : (
              <Text style={styles.value}>{totalProdutos}</Text>
            )}

            <View style={{ flexDirection: "row" }}>
              <Text style={styles.positive}> + {novosProdutos}</Text>
              <Text style={styles.neutral}> hoje</Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: "#555", fontSize: 11 }}>
                {categorias?.length}
              </Text>

              <Text style={{ color: "#555", fontSize: 11 }}> categorias</Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: "#555", fontSize: 11 }}>
                {marcas?.length}
              </Text>

              <Text style={{ color: "#555", fontSize: 11 }}> marcas</Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: "#555", fontSize: 11 }}>
                {tipos?.length}
              </Text>

              <Text style={{ color: "#555", fontSize: 11 }}> tipos</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Vendas totais</Text>
            {loadingVendasNumber ? (
              <Text
                style={{
                  fontStyle: "italic",
                  fontSize: 10,
                }}
              >
                Carregando...
              </Text>
            ) : (
              <Text style={styles.value}>{totalVendas}</Text>
            )}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.positive}> + {novasVendas}</Text>
                  <Text style={styles.neutral}> hoje</Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: "green", fontSize: 11 }}>
                    Confirmado
                  </Text>

                  <Text style={{ color: "#555", fontSize: 11 }}>
                    : {vendasConfirmado?.length}
                  </Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: "#966f34", fontSize: 11 }}>
                    Rascunho
                  </Text>

                  <Text style={{ color: "#555", fontSize: 11 }}>
                    : {vendasRascunho?.length}
                  </Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: "red", fontSize: 11 }}>Cancelado</Text>

                  <Text style={{ color: "#555", fontSize: 11 }}>
                    : {vendasCancelado?.length}
                  </Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: "#555", fontSize: 11 }}>Impresso</Text>

                  <Text style={{ color: "#555", fontSize: 11 }}>
                    : {vendasImpresso?.length}
                  </Text>
                </View>
              </View>

              <View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: "#555", fontSize: 11 }}>VD's</Text>

                  <Text style={{ color: "#555", fontSize: 11 }}>
                    : {vendasVD?.length}
                  </Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: "#555", fontSize: 11 }}>NE's</Text>

                  <Text style={{ color: "#555", fontSize: 11 }}>
                    : {vendasNE?.length}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Facturas recentes */}
        <View style={styles.facturaContainer}>
          <Text style={styles.sectionTitle}>Facturas recentes</Text>

          {vendas?.map((venda, i) => (
            <FacturaItem key={i} venda={venda} />
          ))}
        </View>

        <View>
          <Text></Text>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        {NAV_ITEMS.map((nav, i) => {
          const Icon = nav.icon;
          return (
            <TouchableOpacity
              key={i}
              style={styles.navItem}
              onPress={() => navigatePage(i)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.navIcon,
                  i === activeNav && styles.navIconActive,
                ]}
              >
                <Icon color={"#5c5b5b"} />
              </Text>

              <Text
                style={[
                  styles.navLabel,
                  i === activeNav && styles.navLabelActive,
                ]}
              >
                {nav.label}
              </Text>
              {i === activeNav && <View style={styles.navDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e4e4e4",
    // marginHorizontal: 10,
  },
  safe: {
    flex: 1,
    // backgroundColor: '#185FA5',
  },

  header: {
    backgroundColor: "#1e5aa8",
    padding: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginBottom: 15,
    marginHorizontal: 0,
  },

  greeting: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#dbe7ff",
    marginTop: 4,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    // borderWidth:2,
    // borderColor:'#000',
    margin: 10,
  },

  card: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },

  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
  },

  positive: {
    color: "green",
    fontSize: 12,
    marginTop: 5,
  },

  danger: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },

  neutral: {
    color: "#555",
    fontSize: 12,
    marginTop: 5,
  },

  facturaLeft: {
    flex: 1,
    gap: 3,
  },
  facturaNum: {
    fontSize: 11,
    color: "#8E8E93",
  },
  facturaCliente: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1C1C1E",
  },
  facturaData: {
    fontSize: 11,
    color: "#8E8E93",
  },
  facturaRight: {
    alignItems: "flex-end",
    gap: 5,
  },
  facturaValor: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1C1C1E",
  },
  facturaCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#E5E5EA",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  facturaContainer: {
    marginBottom: 20,
    marginHorizontal: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#8E8E93",
    marginBottom: 10,
    marginTop: 4,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
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
  iconComponent: {
    color: "#8e8e93",
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

  clienteEmpresa: {
    //  backgroundColor: '#c9ccec',
    color: "#4f0fe2",
    // paddingHorizontal:3,
    // paddingVertical:1,
    // borderRadius:20,
    fontSize: 11,
    fontWeight: 500,
  },

  clienteParticular: {
    // backgroundColor: '#fae5d9',
    color: "#854F0B",
    padding: 1,
    // borderRadius:20,
    fontSize: 11,
    // paddingHorizontal:5,
    // paddingVertical:2,
    fontWeight: 500,
  },
});
