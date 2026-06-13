import { Select } from "@/components/project/Select";
import { formatMoney, formatPercent } from "@/utils/format";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  Cog,
  Grid2X2,
  Handshake,
  Package,
  Plus,
  ShoppingBag,
  Trash,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";

import { isOnline } from "@/utils/network";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  RefreshControl,
  // SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/constants/theme";
import { api } from "@/services/api";
import {
  Categoria,
  Familia,
  Imposto,
  Marca,
  Motivo_Isencao,
  Produtos,
  Tipo,
} from "@/types/types";
import { Button, Dialog, Portal } from "react-native-paper";
import { DeletarProduto } from "../components/Produtos/DeletarProduto";
import { EditarProdutoForm } from "../components/Produtos/EditarProduto";
import { ProdutoRepository } from "../database/ProdutoRepository";

const { width } = Dimensions.get("window");

interface CategoriaConfig {
  bg: string;
  color: string;
}

interface CategoriaConfigMap {
  [key: string]: CategoriaConfig;
}

interface NavItem {
  icon: string;
  label: string;
}

const CATEGORIAS_CONFIG: CategoriaConfigMap = {
  Serviço: { bg: "#E6F1FB", color: "#185FA5" },
  Licença: { bg: "#FAEEDA", color: "#854F0B" },
  Projecto: { bg: "#EAF3DE", color: "#3B6D11" },
  Recorrente: { bg: "#EEEDFE", color: "#534AB7" },
  Produto: { bg: "#e0ddff", color: "#05031d" },
};

const NAV_ITEMS = [
  { icon: ShoppingBag, label: "Vendas" },
  { icon: Handshake, label: "Clientes" },
  { icon: Grid2X2, label: "Painel" },
  { icon: Package, label: "Produtos" },
  { icon: Cog, label: "Config." },
];

// ─── Props Interfaces ──────────────────────────────────────────────
interface CategoriaTagProps {
  categoria: Produtos["categoria"];
}

interface ProdutoItemProps {
  produto: Produtos;
  onPress: () => void;
}

// ─── Badge de categoria ─────────────────────────────────────────────
const CategoriaTag: React.FC<CategoriaTagProps> = ({ categoria }) => {
  const config = CATEGORIAS_CONFIG[categoria?.designacao ?? ""] ?? {
    bg: "#ccc",
    color: "#000",
  };

  return (
    <View style={[styles.tagCategoria, { backgroundColor: config.bg }]}>
      <Text style={[styles.tagCategoriaText, { color: config.color }]}>
        {categoria?.designacao}
      </Text>
    </View>
  );
};

// ─── Item do produto ───────────────────────────────────────────────
const ProdutoItem: React.FC<ProdutoItemProps> = ({ produto, onPress }) => {
  // const precoComIVA = produto.imposto?.taxa
  //   ? (produto.preco_venda * produto.imposto?.taxa/100 + produto.preco_custo).toFixed(2)
  //   : produto.preco_custo.toString();

  const precoVenda = parseFloat(produto.preco_venda_liquido_1) || 0;
  const taxaIVA = parseFloat(produto.imposto?.taxa ?? "0") || 0;

  const precoComIVA = taxaIVA
    ? formatMoney(precoVenda + (precoVenda * taxaIVA) / 100)
    : precoVenda.toString();

  return (
    <TouchableOpacity
      style={styles.produtoCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.produtoLeft}>
        <Text style={styles.produtoNome}>{produto.designacao}</Text>
        <CategoriaTag categoria={produto.categoria} />
      </View>
      <View style={styles.produtoRight}>
        <Text style={styles.produtoPreco}>
          {/* {produto. preco_venda.toLocaleString()} MT */}
          {formatMoney(produto.preco_venda_liquido_1) + " MT"}
        </Text>
        <Text style={styles.produtoIVA}>
          {/* {produto.imposto?.taxa ? `IVA ${formatPercent(produto.imposto?.taxa)} (${precoComIVA} MT)` : 'Sem IVA'} */}
          {produto.imposto?.taxa
            ? produto.imposto.codigo === "ISE"
              ? "Isento"
              : `IVA ${formatPercent(produto.imposto?.taxa)} `
            : "Sem IVA"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// ─── Ecrã de Produtos ──────────────────────────────────────────────
const ProdutosScreen = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [activeNav, setActiveNav] = useState(3);

  const [produtos, setProdutos] = useState<Produtos[]>([]);
  const [loadingProdutos, setLoadingProdutos] = useState(false);
  const [filtrados, setFiltrados] = useState<Produtos[]>([]);
  const [produtoSeleccionado, setProdutoSeleccionado] =
    useState<Produtos | null>(null);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>();

  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [selectedTipo, setSelectedTipo] = useState<string>("");
  const [selectedTipoId, setSelectedTipoId] = useState<number>();

  const [familias, setFamilias] = useState<Familia[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<string>("");
  const [selectedFamilyId, setSelectedFamilyId] = useState<number>();

  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [selectedMarca, setSelectedMarca] = useState<string>("");
  const [selectedMarcaId, setSelectedMarcaId] = useState<number>();

  const [motivosIsencao, setMotivosIsencao] = useState<Motivo_Isencao[]>([]);
  const [selectedMotivoIsencao, setSelectedMotivoIsencao] =
    useState<string>("");
  const [selectedMotivoIsencaoId, setSelectedMotivoIsencaoId] =
    useState<number>();

  const [tipoFiltro, setTipoFiltro] = useState<string>("produto");

  const [impostos, setImpostos] = useState<Imposto[]>([]);
  const [selectedImposto, setSelectedImposto] = useState<string>("");
  const [selectedImpostoId, setSelectedImpostoId] = useState<number>();
  const [selectedImpostoTaxa, setSelectedImpostoTaxa] = useState<number>(0);
  const [TextAreaEnabled, setTextAreaEnabled] = useState<Boolean>(false);

  const router = useRouter();
  const [visibleFormCadastro, setVisibleFormCadastro] = useState(false);
  const [visibleDetalhesProduto, setVisibleDetalhesProduto] = useState(false);
  const [visibleEditarProduto, setVisibleEditarProduto] = useState(false);
  const [visibleDeletarProduto, setVisibleDeletarProduto] = useState(false);

  const [designacao, setDesignacao] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [iva, setIva] = useState("");
  const [codigo, setCodigo] = useState("");

  const [precoL, setPrecoLiquido] = useState("");
  const [precoIL, setPrecoIliquido] = useState("");

  const [precoL_2, setPrecoLiquido_2] = useState("");
  const [precoIL_2, setPrecoIliquido_2] = useState("");

  const [precoL_3, setPrecoLiquido_3] = useState("");
  const [precoIL_3, setPrecoIliquido_3] = useState("");

  const [precoL_4, setPrecoLiquido_4] = useState("");
  const [precoIL_4, setPrecoIliquido_4] = useState("");

  const [precoL_5, setPrecoLiquido_5] = useState("");
  const [precoIL_5, setPrecoIliquido_5] = useState("");

  const [stock, setStock] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const precoNum = parseFloat(precoVenda) || 0;
  const taxa = selectedImpostoTaxa;

  const total = precoL;

  function navigatePage(pageIndex: number) {
    setActiveNav(pageIndex);

    if (pageIndex === 2) {
      router.push("/(authenticated)/dashboard");
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

  const handleSearch = (text: string): void => {
    setSearchText(text);
    if (text === "") {
      setFiltrados(produtos);
    } else {
      const filtered = produtos.filter(
        (p) =>
          p.designacao.toLowerCase().includes(text.toLowerCase()) ||
          p.categoria?.designacao.toLowerCase().includes(text.toLowerCase()),
      );
      setFiltrados(filtered);
    }
  };

  async function adicionarProduto() {
    try {
      if (!designacao || !selectedCategory || !precoL) return;

      setVisibleFormCadastro(false);

      const token = await AsyncStorage.getItem("@token");

      const payload = {
        codigo: codigo,
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
        stock_actual: stock,
        marca_id: selectedMarcaId || undefined,
        familia_id: selectedFamilyId || undefined,
        tipo_produto_id: selectedTipoId || undefined,
        motivo_isencao_id: selectedMotivoIsencaoId || undefined,
        imposto_id: selectedImpostoId,
      };

      await api.post("/produtos", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoadingProdutos(true);

      const response = await api.get("/produtos");

      setProdutos(response.data.data);
      setFiltrados(response.data.data);

      Alert.alert("Produto cadastrado com sucesso!");
    } catch (err) {
      if (err instanceof Error) {
        console.log("Erro ao adicionar produto: ", err.message);
      }
    } finally {
      setLoadingProdutos(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      await Promise.all([
        loadProducts(),
        loadImpostos(),
        loadCategorias(),
        loadFamilias(),
        loadTipos(),
        loadMarcas(),
        loadMotivosIsencao(),
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
    if (selectedCategory) {
      const categoriaEncontrada = categorias.find(
        (categoria) =>
          selectedCategory.trim().toLowerCase() ===
          categoria.designacao.trim().toLowerCase(),
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
          imposto.designacao.trim().toLowerCase(),
      );

      if (impostoEncontrado) {
        setSelectedImpostoId(impostoEncontrado.id);

        setSelectedImpostoTaxa(parseFloat(impostoEncontrado.taxa));

        console.log("encontrei impostoId", impostoEncontrado.id);
      }
    }

    if (selectedFamily) {
      const categoriaEncontrada = categorias.find(
        (categoria) =>
          selectedCategory.trim().toLowerCase() ===
          categoria.designacao.trim().toLowerCase(),
      );

      if (categoriaEncontrada) {
        console.log("encontrei category");
        setSelectedCategoryId(categoriaEncontrada.id);

        console.log("encontrei categoryId", categoriaEncontrada.id);
      }
    }

    if (selectedMarca) {
      const marcaEncontrada = marcas.find(
        (marca) =>
          selectedMarca.trim().toLowerCase() ===
          marca.nome.trim().toLowerCase(),
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
          family.designacao.trim().toLowerCase(),
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
          tipo.designacao.trim().toLowerCase(),
      );

      if (tipoEncontrado) {
        setSelectedTipoId(tipoEncontrado.id);

        console.log("encontrei tipoId", tipoEncontrado.id);
      }
    }

    if (selectedMotivoIsencao) {
      console.log("motivo de isencao.");

      const motivoEncontrado = motivosIsencao.find(
        (motivo) =>
          selectedMotivoIsencao.trim().toLowerCase() ===
          motivo.designacao.trim().toLowerCase(),
      );

      if (motivoEncontrado) {
        setSelectedMotivoIsencaoId(motivoEncontrado.id);

        console.log("encontrei motivoId", motivoEncontrado.id);
      }
    }
  }, [
    selectedCategory,
    selectedImposto,
    selectedMarca,
    selectedTipo,
    selectedFamily,
    selectedMotivoIsencao,
  ]);

  useEffect(() => {
    if (precoL) {
      setPrecoIliquido(
        (parseFloat(precoL) - (parseFloat(precoL) * taxa) / 100)
          .toFixed(2)
          .toString(),
      );
    }
  }, [selectedImpostoTaxa]);

  useEffect(() => {
    if (!precoL) {
      setPrecoIliquido("");
    }
  }, [precoL]);

  useEffect(() => {
    if (!precoIL) {
      setPrecoLiquido("");
    }
  }, [precoIL]);

  useEffect(() => {
    if (selectedImpostoId === 4) {
      setTextAreaEnabled(true);
    } else {
      setTextAreaEnabled(false);
    }
  }, [selectedImpostoId]);

  useEffect(() => {
    async function loadData() {
      await loadProducts();
      await loadImpostos();
      await loadCategorias();
      await loadFamilias();
      await loadTipos();
      await loadMarcas();
      await loadMotivosIsencao();
    }

    loadData();
  }, []);

  async function loadMotivosIsencao() {
    try {
      const response = await api.get("/motivoisencao");

      setMotivosIsencao(response.data.data);
      //console.log('motivo de isencao: ', response.data.data)
    } catch (err) {
      if (err instanceof Error) console.log(err.message);
    } finally {
    }
  }

  async function loadMarcas() {
    try {
      const response = await api.get("/marcas");

      setMarcas(response.data.data);
      // console.log('marcas:', response.data.data)
    } catch (err) {
      if (err instanceof Error) console.log(err.message);
    } finally {
    }
  }

  async function loadFamilias() {
    try {
      const response = await api.get("/familia");

      setFamilias(response.data.data);
      //console.log('familia:', response.data.data)
    } catch (err) {
      if (err instanceof Error) console.log(err.message);
    } finally {
    }
  }

  async function loadTipos() {
    try {
      const response = await api.get("/tipo");

      setTipos(response.data.data);
      // console.log('tipo:', response.data.data)
    } catch (err) {
      if (err instanceof Error) console.log(err.message);
    } finally {
    }
  }

  async function loadImpostos() {
    try {
      const response = await api.get("/impostos");

      setImpostos(response.data.data);
      // console.log('impostos:', response.data.data)
    } catch (err) {
      if (err instanceof Error) console.log(err.message);
    } finally {
    }
  }

  async function loadCategorias() {
    try {
      const response = await api.get("/categorias");

      setCategorias(response.data.data);
      // console.log('categorias:', response.data.data.data)
    } catch (err) {
      if (err instanceof Error) console.log(err.message);
    } finally {
    }
  }

  async function loadProducts() {
    const token = await AsyncStorage.getItem("@token");
    const online = await isOnline();

    try {
      setLoadingProdutos(true);

      if (online) {
        const response = await api.get("/produtos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const produtosAPI = response.data.data; //

        ProdutoRepository.saveMany(response.data.data);

        setProdutos(response.data.data);
        setFiltrados(response.data.data);
        //console.log("produtos da base: ", response.data.data)

        console.log(JSON.stringify(produtosAPI, null, 2));
      } else {
        const local = ProdutoRepository.getAll();
        setProdutos(local);
        setFiltrados(local);
        console.log("CLIENTE TESTE", JSON.stringify(local[0], null, 2));
        console.log("Produtos OFFLINE:", local);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingProdutos(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Portal para renderizar detalhes de cada produto */}
      <Portal>
        <Dialog
          visible={visibleDetalhesProduto}
          onDismiss={() => setVisibleDetalhesProduto(false)}
          style={{ backgroundColor: "#fff" }}
        >
          {/* <Dialog.Title style={{color: colors.blue, fontSize:14,
                fontWeight:'bold', }}> */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: colors.blue,
                fontWeight: "bold",
                fontSize: 14,
                flex: 1,
                textAlign: "center",
              }}
            >
              Detalhes do produto
            </Text>

            <TouchableOpacity
              style={{ paddingRight: 20 }}
              onPress={() => setVisibleDeletarProduto(true)}
            >
              <Trash color={"#FF0000"} />
            </TouchableOpacity>
          </View>

          {/* </Dialog.Title> */}

          <Dialog.Content>
            <View style={{ flexDirection: "row", paddingTop: 5 }}>
              <Text style={{ fontWeight: "bold" }}>Código:</Text>
              <Text style={{ paddingLeft: 5 }}>
                {produtoSeleccionado?.codigo}
              </Text>
            </View>

            <View style={{ flexDirection: "row", paddingTop: 5 }}>
              <Text style={{ fontWeight: "bold" }}>Nome:</Text>
              <Text style={{ paddingLeft: 5 }}>
                {produtoSeleccionado?.designacao ?? ""}
              </Text>
            </View>

            <View style={{ flexDirection: "row", paddingTop: 5 }}>
              <Text style={{ fontWeight: "bold" }}>Preço líquido 1:</Text>
              <Text style={{ paddingLeft: 5 }}>
                {formatMoney(produtoSeleccionado?.preco_venda_liquido_1) +
                  " MT"}
              </Text>
            </View>

            <View style={{ flexDirection: "row", paddingTop: 5 }}>
              <Text style={{ fontWeight: "bold" }}>Preço ilíquido 1:</Text>
              <Text style={{ paddingLeft: 5 }}>
                {formatMoney(produtoSeleccionado?.preco_venda_iliquido_1) +
                  " MT"}
              </Text>
            </View>

            <View style={{ flexDirection: "row", paddingTop: 5 }}>
              <Text style={{ fontWeight: "bold" }}>Categoria:</Text>
              <Text style={{ paddingLeft: 5 }}>
                {produtoSeleccionado?.categoria.designacao}
              </Text>
            </View>

            <View style={{ flexDirection: "row", paddingTop: 5 }}>
              <Text style={{ fontWeight: "bold" }}>Stock:</Text>
              <Text style={{ paddingLeft: 5 }}>
                {parseFloat(produtoSeleccionado?.stock_actual ?? "").toFixed(0)}
              </Text>
            </View>

            <View style={{ flexDirection: "row", paddingTop: 5 }}>
              <Text style={{ fontWeight: "bold" }}>Imposto:</Text>
              <Text style={{ paddingLeft: 5 }}>
                {produtoSeleccionado?.imposto.designacao}
              </Text>
            </View>

            <View style={{ flexDirection: "row", paddingTop: 5 }}>
              <Text style={{ fontWeight: "bold" }}>Marca:</Text>
              <Text style={{ paddingLeft: 5 }}>
                {produtoSeleccionado?.marca ? (
                  produtoSeleccionado.marca.nome
                ) : (
                  <Text> N/A</Text>
                )}
              </Text>
            </View>

            <View style={{ flexDirection: "row", paddingTop: 5 }}>
              <Text style={{ fontWeight: "bold" }}>Tipo:</Text>
              <Text style={{ paddingLeft: 5 }}>
                {produtoSeleccionado?.tipo_produto ? (
                  produtoSeleccionado?.tipo_produto.designacao
                ) : (
                  <Text> N/A</Text>
                )}
              </Text>
            </View>

            <View style={{ flexDirection: "row", paddingTop: 5 }}>
              <Text style={{ fontWeight: "bold" }}>Família:</Text>
              <Text style={{ paddingLeft: 5 }}>
                {produtoSeleccionado?.familia ? (
                  produtoSeleccionado?.familia?.designacao
                ) : (
                  <Text> N/A</Text>
                )}
              </Text>
            </View>
          </Dialog.Content>

          <Dialog.Actions
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Button
              onPress={() => {
                setVisibleDetalhesProduto(false);
                setVisibleEditarProduto(true);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: colors.blue, fontWeight: "bold" }}>
                  Editar
                </Text>
              </View>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Portal para cadastrar dados de um produto */}

      <Portal>
        <Dialog
          visible={visibleFormCadastro}
          onDismiss={() => setVisibleFormCadastro(false)}
          style={{ backgroundColor: "#fff" }}
        >
          <KeyboardAvoidingView behavior={"height"}>
            <Dialog.Title
              style={{
                color: colors.blue,
                fontSize: 14,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Adicione um novo produto ou serviço
            </Dialog.Title>

            <Dialog.Content>
              <ScrollView
                style={{ maxHeight: 450, paddingHorizontal: 3 }}
                showsVerticalScrollIndicator={false}
              >
                <View>
                  <View style={styles.dialogContentStyle}>
                    <Text style={styles.dialogTextStyle}> Código:</Text>
                    <TextInput
                      value={codigo}
                      onChangeText={setCodigo}
                      style={styles.TextFieldStyling}
                    />
                  </View>

                  <View style={styles.dialogContentStyle}>
                    <Text style={styles.dialogTextStyle}> Nome:</Text>
                    <TextInput
                      value={designacao}
                      onChangeText={setDesignacao}
                      style={styles.TextFieldStyling}
                    />
                  </View>

                  <View style={styles.dialogContentStyle}>
                    <Text style={styles.dialogTextStyle}> Categoria:</Text>

                    <Select
                      label="Categorias"
                      placeholder="Selecione a categoria"
                      options={categorias.map((categoria) => ({
                        label: categoria.designacao,
                        value: categoria.designacao,
                      }))}
                      selectedValue={selectedCategory}
                      onValueChange={setSelectedCategory}
                    />
                  </View>

                  <View style={styles.dialogContentStyle}>
                    <Text style={styles.dialogTextStyle}>
                      {" "}
                      Preço líquido 1:
                    </Text>
                    <TextInput
                      value={precoL}
                      onChangeText={(text) => {
                        setPrecoLiquido(text);

                        setPrecoIliquido(
                          (parseFloat(text) - (parseFloat(text) * taxa) / 100)
                            .toFixed(2)
                            .toString(),
                        );
                      }}
                      keyboardType="numeric"
                      style={styles.TextFieldStyling}
                    />
                  </View>

                  <View style={styles.dialogContentStyle}>
                    <Text style={styles.dialogTextStyle}>
                      {" "}
                      Preço ilíquido 1:
                    </Text>
                    <TextInput
                      value={precoIL}
                      onChangeText={(text) => {
                        setPrecoIliquido(text);

                        setPrecoLiquido(
                          (parseFloat(text) + (parseFloat(text) * taxa) / 100)
                            .toFixed(2)
                            .toString(),
                        );
                      }}
                      keyboardType="numeric"
                      style={styles.TextFieldStyling}
                    />
                  </View>

                  <View style={styles.dialogContentStyle}>
                    <Text style={styles.dialogTextStyle}> Stock:</Text>
                    <TextInput
                      value={stock}
                      onChangeText={(text) => {
                        setStock(text);
                      }}
                      keyboardType="numeric"
                      style={styles.TextFieldStyling}
                    />
                  </View>

                  <View style={styles.dialogContent}>
                    <Text
                      style={[styles.dialogTextStyle, { paddingRight: 45 }]}
                    >
                      {" "}
                      IVA:
                    </Text>

                    <Select
                      label="Impostos"
                      placeholder="Selecione o imposto"
                      options={impostos.map((imposto) => ({
                        label: imposto.designacao,
                        value: imposto.designacao,
                      }))}
                      selectedValue={selectedImposto}
                      onValueChange={setSelectedImposto}
                    />
                  </View>

                  {TextAreaEnabled && (
                    <View style={styles.dialogContent}>
                      <View style={{ flexDirection: "column" }}>
                        <Text style={styles.dialogTextIsencao}>Isenção:</Text>
                        <Text style={styles.dialogTextIsencao}>de IVA</Text>
                      </View>
                      <Select
                        label="Motivo de isenção"
                        placeholder="Qual o motivo da isenção ?"
                        options={motivosIsencao.map((m) => ({
                          label: m.designacao,
                          value: m.designacao,
                        }))}
                        selectedValue={selectedMotivoIsencao}
                        onValueChange={setSelectedMotivoIsencao}
                      />
                    </View>
                  )}

                  <View style={styles.dialogContent}>
                    <Text
                      style={[styles.dialogTextStyle, { paddingRight: 30 }]}
                    >
                      {" "}
                      Marca:
                    </Text>

                    <Select
                      label="Marcas"
                      placeholder="Selecione a marca"
                      options={marcas.map((marca) => ({
                        label: marca.nome,
                        value: marca.nome,
                      }))}
                      selectedValue={selectedMarca}
                      onValueChange={setSelectedMarca}
                    />
                  </View>

                  <View style={styles.dialogContent}>
                    <Text
                      style={[styles.dialogTextStyle, , { paddingRight: 40 }]}
                    >
                      {" "}
                      Tipo:
                    </Text>

                    <Select
                      label="Tipo"
                      placeholder="Selecione o tipo"
                      options={tipos.map((tipo) => ({
                        label: tipo.designacao,
                        value: tipo.designacao,
                      }))}
                      selectedValue={selectedTipo}
                      onValueChange={setSelectedTipo}
                    />
                  </View>

                  <View style={styles.dialogContent}>
                    <Text
                      style={[styles.dialogTextStyle, , { paddingRight: 25 }]}
                    >
                      {" "}
                      Família:
                    </Text>

                    <Select
                      label="Famílias"
                      placeholder="Selecione a família"
                      options={familias.map((familia) => ({
                        label: familia.designacao,
                        value: familia.designacao,
                      }))}
                      selectedValue={selectedFamily}
                      onValueChange={setSelectedFamily}
                    />
                  </View>
                </View>
              </ScrollView>

              <View style={[{ marginTop: 5 }, styles.dialogContentStyle]}>
                <Text style={styles.dialogTextStyle}>
                  Total: MZN {""} {formatMoney(total)}
                </Text>
              </View>
            </Dialog.Content>
            <Dialog.Actions
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Button
                onPress={() => {
                  adicionarProduto();
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <Plus size={15} color={colors.blue} fontWeight={"bold"} />
                  <Text style={{ color: colors.blue, fontWeight: "bold" }}>
                    Adicionar
                  </Text>
                </View>
              </Button>

              <Button
                onPress={() => setVisibleFormCadastro(false)}
                style={{ paddingTop: 2 }}
              >
                <Text style={{ color: colors.blue, fontWeight: "bold" }}>
                  Cancelar
                </Text>
              </Button>
            </Dialog.Actions>
          </KeyboardAvoidingView>
        </Dialog>
      </Portal>

      {/* Portal para Editar o produto */}

      <EditarProdutoForm
        visible={visibleEditarProduto}
        setVisible={setVisibleEditarProduto}
        loading={loadingProdutos}
        setLoading={setLoadingProdutos}
        produto={produtoSeleccionado}
        setProdutos={setProdutos}
        setFiltrados={setFiltrados}
      />

      {/* Portal para Deletar o produto */}

      <DeletarProduto
        produto={produtoSeleccionado}
        visible={visibleDeletarProduto}
        setVisible={setVisibleDeletarProduto}
        setProdutos={setProdutos}
        setFiltrados={setFiltrados}
        // setLoading = {setLoadingProdutos}
        setVisibleDetalhesProduto={setVisibleDetalhesProduto}
      />

      <StatusBar barStyle="light-content" backgroundColor="#185FA5" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Produtos e Serviços</Text>
          <Text style={styles.headerSub}>
            {filtrados.length} itens no catálogo
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Pesquisar produto ou serviço..."
          placeholderTextColor="#AEAEB2"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

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
        {loadingProdutos ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.blue} />
          </View>
        ) : filtrados.length > 0 ? (
          filtrados.map((produto, index) => (
            <ProdutoItem
              key={index}
              produto={produto}
              onPress={() => {
                setVisibleDetalhesProduto(true);
                setProdutoSeleccionado(produto);
              }}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Nenhum produto encontrado</Text>
          </View>
        )}

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* FAB - Novo Produto */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setVisibleFormCadastro(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+ Novo Produto</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
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
              <Text style={[styles.navIcon, i === 3 && styles.navIconActive]}>
                <Icon color={"#5c5b5b"} />
              </Text>
              <Text style={[styles.navLabel, i === 3 && styles.navLabelActive]}>
                {nav.label}
              </Text>
              {i === 3 && <View style={styles.navDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

// // ─── Estilos ──────────────────────────────────────────────────────────
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

  // Produto card
  produtoCard: {
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
  produtoLeft: {
    flex: 1,
    gap: 6,
  },
  produtoNome: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1C1C1E",
  },
  produtoRight: {
    alignItems: "flex-end",
    gap: 3,
  },
  produtoPreco: {
    fontSize: 15,
    fontWeight: "500",
    color: "#185FA5",
  },
  produtoIVA: {
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
    bottom: 130,
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

export default ProdutosScreen;

// php artisan serve --host=192.168.0.53 --port=8000
