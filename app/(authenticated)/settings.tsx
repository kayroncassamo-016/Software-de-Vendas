import { useContexto } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { formatPermission } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
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
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ConfigScreen = () => {
  const NAV_ITEMS = [
    { icon: ShoppingBag, label: "Vendas" },
    { icon: Handshake, label: "Clientes" },
    { icon: Grid2X2, label: "Painel" },
    { icon: Package, label: "Produtos" },
    { icon: Cog, label: "Config." },
  ];

  const [activeNav, setActiveNav] = useState(4);
  const router = useRouter();
  const { user, signOut } = useContexto();

  const [notificacoes, setNotificacoes] = useState(true);
  const [temaEscuro, setTemaEscuro] = useState(false);

  const [modalUsuario, setModalUsuario] = useState(false);
  const [modalAddUser, setModalAddUser] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [showSenha, setShowSenha] = useState(false);

  // Dados do perfil
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [senhaNova, setSenhaNova] = useState("");
  const [senhaConfirm, setSenhaConfirm] = useState("");

  // Novo utilizador
  const [nomeNewUser, setNomeNewUser] = useState("");
  const [senhaNewUser, setSenhaNewUser] = useState("");
  const [emailNewUser, setEmailNewUser] = useState("");
  const [cargoNewUser, setCargoNewUser] = useState("");
  const [telefoneNewUser, setTelefoneNewUser] = useState("");

  const [permissionGroups, setPermissionGroups] = useState<
    Record<string, string[]>
  >({});
  const [permissionGroupsMeta, setPermissionGroupsMeta] = useState<any>({});
  // Carregar dados do perfil
  useEffect(() => {
    if (user?.user && modalUsuario) {
      setNome(user.user.name || "");
      setEmail(user.user.email || "");
      setCargo(user.user.cargo || "");
      setTelefone(user.user.telefone || "");
      setSenhaAtual("");
      setSenhaNova("");
      setSenhaConfirm("");
    }
    loadPermissions();
  }, [modalUsuario, user]);

  const Item = ({ label, value, onPress, toggle, onToggle }: any) => (
    <TouchableOpacity style={styles.item} onPress={onPress} disabled={toggle}>
      {toggle ? (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.label}>{label}</Text>
          <Switch value={value} onValueChange={onToggle} style={{ flex: 1 }} />
        </View>
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{label}</Text>
            {value && <Text style={styles.value}>{value}</Text>}
          </View>
          <Text style={styles.arrow}>›</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  function navigatePage(pageIndex: number) {
    setActiveNav(pageIndex);
    if (pageIndex === 2) {
      router.push("/(authenticated)/dashboard");
    }
    if (pageIndex === 3) {
      router.push("/(authenticated)/produtos");
    }
    if (pageIndex === 1) {
      router.push("/(authenticated)/clientes");
    }
    if (pageIndex === 0) {
      router.push("/(authenticated)/vendas");
    }
  }

  async function sairDoSistema() {
    const token = await AsyncStorage.getItem("@token");
    Alert.alert(
      "Sair",
      "Deseja realmente sair do sistema?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim",
          onPress: () => {
            if (token) {
              signOut(token);
            }
            router.replace("/login/login");
          },
        },
      ],
      { cancelable: true },
    );
  }

  async function guardarPerfil() {
    if (!nome || !email) {
      Alert.alert("Erro", "Nome e email são obrigatórios");
      return;
    }

    // Se mudou senha, valida
    if (senhaNova) {
      if (!senhaAtual) {
        Alert.alert("Erro", "Precisa da senha actual para mudar");
        return;
      }
      if (senhaNova !== senhaConfirm) {
        Alert.alert("Erro", "As senhas não coincidem");
        return;
      }
    }

    setSavingProfile(true);
    try {
      const token = await AsyncStorage.getItem("@token");
      const payload: any = {
        name: nome,
        email: email,
        cargo: cargo,
        telefone: telefone,
      };

      if (senhaNova) {
        payload.senha_atual = senhaAtual;
        payload.senha_nova = senhaNova;
      }

      await api.put(`/users/${user?.user.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Sucesso", "Perfil actualizado com sucesso");
      setModalUsuario(false);
    } catch (err: any) {
      Alert.alert("Erro", err.response?.data?.message || "Erro ao guardar");
    } finally {
      setSavingProfile(false);
    }
  }

  async function adicionarUser() {
    if (!nomeNewUser || !emailNewUser || !senhaNewUser || !cargoNewUser) {
      Alert.alert("Erro", "Preenche todos os campos");
      return;
    }

    const payload = {
      name: nomeNewUser,
      password: senhaNewUser,
      email: emailNewUser,
      cargo: cargoNewUser,
      telefone: telefoneNewUser,
    };

    try {
      const token = await AsyncStorage.getItem("@token");
      await api.post("/users", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Sucesso", "Novo utilizador cadastrado com sucesso!");
      setModalAddUser(false);
      // Limpar campos
      setNomeNewUser("");
      setSenhaNewUser("");
      setEmailNewUser("");
      setCargoNewUser("");
      setTelefoneNewUser("");
    } catch (err: any) {
      Alert.alert(
        "Erro",
        err.response?.data?.message || "Erro ao adicionar utilizador",
      );
    }
  }

  async function loadPermissions() {
    try {
      const token = await AsyncStorage.getItem("@token");

      const res = await api.get("/permissoes/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data.data;

      const groups: Record<string, string[]> = {};
      const meta: Record<string, any> = {};

      Object.entries(data).forEach(([key, value]: any) => {
        const permsObj = value?.permissions || {};

        groups[key] = Object.keys(permsObj);
        meta[key] = {
          label: value?.label || key,
        };
      });

      setPermissionGroups(groups);
      setPermissionGroupsMeta(meta);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <SafeAreaView
      style={[
        styles.safe,
        { backgroundColor: temaEscuro ? "#292828" : "#e4e4e4" },
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor="#185FA5" />

      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <ScrollView
        style={[
          styles.scroll,
          { backgroundColor: temaEscuro ? "#292828" : "#f4f6f9" },
        ]}
      >
        {/* USUÁRIO */}
        <Text style={styles.section}>Usuário</Text>

        <Item
          label="Dados do usuário"
          value={`${user?.user.name}`}
          onPress={() => setModalUsuario(true)}
        />

        {user?.user.name === "Administrador" && (
          <Item
            label="Gestão de utilizadores"
            onPress={() => router.push("/(authenticated)/users/userList")}
          />
        )}

        {/* PREFERÊNCIAS */}
        <Text style={styles.section}>Preferências</Text>

        <Item
          label="Notificações"
          value={notificacoes}
          toggle
          onToggle={setNotificacoes}
        />

        {/* <Item
          label="Tema escuro"
          value={temaEscuro}
          toggle
          onToggle={setTemaEscuro}
        /> */}

        {/* SESSÃO */}
        <Text style={styles.section}>Sessão</Text>

        <Item label="Sair" onPress={() => sairDoSistema()} />
      </ScrollView>

      {/* MODAL - PERFIL DO USUÁRIO */}
      <Modal visible={modalUsuario} animationType="slide">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalUsuario(false)}>
              <Text style={styles.modalCloseBtn}>‹ Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Meu Perfil</Text>
            <View style={{ width: 50 }} />
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalContent}
          >
            {/* Avatar/Info Summary */}
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {nome.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.profileName}>{nome}</Text>
                <Text style={styles.profileCargo}>{cargo || "Sem cargo"}</Text>
              </View>
            </View>

            {/* Dados Pessoais */}
            <Text style={styles.fieldSection}>Dados Pessoais</Text>

            <View style={styles.formCard}>
              <Text style={styles.fieldLabel}>Nome</Text>
              <TextInput
                placeholder="Nome completo"
                value={nome}
                onChangeText={setNome}
                style={styles.fieldInput}
              />

              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                placeholder="email@exemplo.com"
                value={email}
                onChangeText={setEmail}
                style={styles.fieldInput}
                keyboardType="email-address"
              />

              <Text style={styles.fieldLabel}>Cargo</Text>
              <TextInput
                placeholder="ex: Admin, Vendedor"
                value={cargo}
                onChangeText={setCargo}
                style={styles.fieldInput}
              />

              <Text style={styles.fieldLabel}>Telefone</Text>
              <TextInput
                placeholder="Digite o telefone"
                value={telefone}
                onChangeText={setTelefone}
                style={styles.fieldInput}
                keyboardType="phone-pad"
              />
            </View>

            <Text style={styles.fieldSection}>Permissões</Text>

            {Object.entries(permissionGroups).map(([groupKey, permissions]) => {
              const permissoesDoUser = permissions.filter((p) =>
                user?.user?.permissoes?.includes(p),
              );

              if (permissoesDoUser.length === 0) return null;

              return (
                <View key={groupKey} style={styles.formCard}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: "#185FA5",
                      marginBottom: 10,
                    }}
                  >
                    {permissionGroupsMeta?.[groupKey]?.label || groupKey}
                  </Text>

                  {permissoesDoUser.map((permission) => (
                    <Text
                      key={permission}
                      style={{
                        fontSize: 13,
                        color: "#1C1C1E",
                        marginBottom: 6,
                      }}
                    >
                      ✓ {formatPermission(permission)}
                      {/* { permission} */}
                    </Text>
                  ))}
                </View>
              );
            })}

            {/* Alterar Senha */}
            <Text style={styles.fieldSection}>Alterar Senha</Text>

            <View style={styles.formCard}>
              <Text style={styles.fieldLabel}>Senha Atual</Text>
              <View style={styles.passwordField}>
                <TextInput
                  placeholder="Digite sua senha actual"
                  value={senhaAtual}
                  onChangeText={setSenhaAtual}
                  style={[styles.fieldInput, { flex: 1 }]}
                  secureTextEntry={!showSenha}
                />
                <Pressable
                  onPress={() => setShowSenha(!showSenha)}
                  style={styles.eyeBtn}
                >
                  <Ionicons
                    name={showSenha ? "eye-off" : "eye"}
                    size={20}
                    color="#185FA5"
                  />
                </Pressable>
              </View>

              <Text style={styles.fieldLabel}>Senha Nova</Text>
              <View style={styles.passwordField}>
                <TextInput
                  placeholder="Digite a nova senha"
                  value={senhaNova}
                  onChangeText={setSenhaNova}
                  style={[styles.fieldInput, { flex: 1 }]}
                  secureTextEntry={!showSenha}
                />
              </View>

              <Text style={styles.fieldLabel}>Confirmar Senha</Text>
              <View style={styles.passwordField}>
                <TextInput
                  placeholder="Confirme a nova senha"
                  value={senhaConfirm}
                  onChangeText={setSenhaConfirm}
                  style={[styles.fieldInput, { flex: 1 }]}
                  secureTextEntry={!showSenha}
                />
              </View>

              <Text style={styles.helperText}>
                Deixe em branco se não quer mudar a senha
              </Text>
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Botões */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.btnCancel, savingProfile && { opacity: 0.5 }]}
              onPress={() => setModalUsuario(false)}
              disabled={savingProfile}
            >
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnSave, savingProfile && { opacity: 0.5 }]}
              onPress={guardarPerfil}
              disabled={savingProfile}
            >
              {savingProfile ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.btnSaveText}>Guardar</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* MODAL - ADICIONAR USUÁRIO */}
      <Modal visible={modalAddUser} animationType="slide">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalAddUser(false)}>
              <Text style={styles.modalCloseBtn}>‹ Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Novo Utilizador</Text>
            <View style={{ width: 50 }} />
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalContent}
          >
            <View style={styles.formCard}>
              <Text style={styles.fieldLabel}>Nome</Text>
              <TextInput
                placeholder="Nome completo"
                value={nomeNewUser}
                onChangeText={setNomeNewUser}
                style={styles.fieldInput}
              />

              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                placeholder="email@exemplo.com"
                value={emailNewUser}
                onChangeText={setEmailNewUser}
                style={styles.fieldInput}
                keyboardType="email-address"
              />

              <Text style={styles.fieldLabel}>Senha</Text>
              <View style={styles.passwordField}>
                <TextInput
                  placeholder="Digite a senha"
                  value={senhaNewUser}
                  onChangeText={setSenhaNewUser}
                  style={[styles.fieldInput, { flex: 1 }]}
                  secureTextEntry={!showSenha}
                />
                <Pressable
                  onPress={() => setShowSenha(!showSenha)}
                  style={styles.eyeBtn}
                >
                  <Ionicons
                    name={showSenha ? "eye-off" : "eye"}
                    size={20}
                    color="#185FA5"
                  />
                </Pressable>
              </View>

              <Text style={styles.fieldLabel}>Cargo</Text>
              <TextInput
                placeholder="ex: vendedor, gerente, stockista"
                value={cargoNewUser}
                onChangeText={setCargoNewUser}
                style={styles.fieldInput}
              />

              <Text style={styles.fieldLabel}>Telefone (Opcional)</Text>
              <TextInput
                placeholder="Digite o telefone"
                value={telefoneNewUser}
                onChangeText={setTelefoneNewUser}
                style={styles.fieldInput}
                keyboardType="phone-pad"
              />
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.btnCancel}
              onPress={() => setModalAddUser(false)}
            >
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnSave} onPress={adicionarUser}>
              <Text style={styles.btnSaveText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

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
              <Text style={[styles.navIcon, i === 4 && styles.navIconActive]}>
                <Icon color={"#5c5b5b"} />
              </Text>
              <Text style={[styles.navLabel, i === 4 && styles.navLabelActive]}>
                {nav.label}
              </Text>
              {i === 4 && <View style={styles.navDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default ConfigScreen;

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
