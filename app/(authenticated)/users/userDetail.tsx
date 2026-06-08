import { api } from '@/services/api';
import { formatPermission } from '@/utils/format';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

interface User {
  id: number;
  name: string;
  email: string;
  cargo: string;
  activo: boolean;
  permissoes: string[];
}
const PERMISSION_GROUPS = {
  'Clientes': ['clientes.ver', 'clientes.criar', 'clientes.editar', 'clientes.eliminar', 'clientes.ativar', 'clientes.desativar'],
  'Documentos': ['documentos.ver', 'documentos.criar', 'documentos.confirmar', 'documentos.cancelar', 'documentos.eliminar', 'documentos.imprimir'],
  'Produtos': ['produtos.ver', 'produtos.criar', 'produtos.editar', 'produtos.eliminar'],
  'Stock': ['stock.ver', 'stock.ajuste', 'stock.relatorio', 'stock.movimentos.ver', 'stock.movimentos.estornar'],
  'Utilizadores': ['utilizadores.ver', 'utilizadores.criar', 'utilizadores.editar', 'utilizadores.eliminar'],
  'Configurações': ['configuracoes.gerir'],
};

export default function UserDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState('');
  const [activo, setActivo] = useState(false);
  const [allPermissoes, setAllPermissoes] = useState<string[]>([]);
  
  
  const [permissionGroups, setPermissionGroups] = useState<
  Record<string, string[]>
>({});

const [permissionGroupsMeta, setPermissionGroupsMeta] = useState<any>({});


  useEffect(() => {
    loadUser();
  }, [id]);

  useEffect (()=>{
    loadPermissions()
  },[])

  const loadUser = async () => {
    setLoading(true);

    try {

      const token = await AsyncStorage.getItem('@token');
      const res = await api.get(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = res.data.data;
      setUser(userData);
      setName(userData.name);
      setEmail(userData.email);
      setCargo(userData.cargo);
      setActivo(userData.activo);
      setAllPermissoes(userData.permissoes);

    } catch (err) {
      console.log('Erro ao carregar utilizador:', err);
      Alert.alert('Erro', 'Não foi possível carregar utilizador');


    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name || !email || !cargo) {
      Alert.alert('Erro', 'Preenche todos os campos');
      return;
    }

    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('@token');
      const payload = 
      {
         name:name,
        email:email,
        cargo:cargo,
        activo:activo,
        permissions:allPermissoes,
      }
     
     
      console.log (payload)
      await api.put(`/users/${id}`, {
        
        name:name,
        email:email,
        cargo:cargo,
        activo:activo,
        permissions:allPermissoes,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      Alert.alert('Sucesso', 'Utilizador actualizado com sucesso');
     

    } 
    catch (err:any) {
      console.log('Erro ao guardar:', err.response.data);
      Alert.alert('Erro', 'Não foi possível guardar alterações');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar utilizador',
      'Tem a certeza? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('@token');
              
               await api.delete(`/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              Alert.alert('Sucesso', 'Utilizador eliminado');
              router.back();
            } catch (err:any) {

              Alert.alert('Erro', err.response.data.message);
            }
          },
        },
      ]
    );
  };


async function loadPermissions() {
  try {
    const token = await AsyncStorage.getItem('@token');

    const res = await api.get('/permissoes/all', {
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

  } catch (err: any) {
    console.log('Erro ao carregar permissoes:', err?.response?.data);
    Alert.alert('Erro', 'Não foi possível carregar as permissões.');
  }
}

  const togglePermission = (permission: string) => {
    if (allPermissoes.includes(permission)) {
      setAllPermissoes(allPermissoes.filter(p => p !== permission));
    } else {
      setAllPermissoes([...allPermissoes, permission]);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#185FA5" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#185FA5" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Editar Utilizador</Text>
        <Text style={styles.headerSubtitle}>{name}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        
        {/* Dados do Utilizador */}
        <Text style={styles.sectionTitle}>Dados Pessoais</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nome completo"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="email@exemplo.com"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Cargo</Text>
          <TextInput
            style={styles.input}
            value={cargo}
            onChangeText={setCargo}
            placeholder="ex: admin, vendedor, gerente"
          />

          <View style={styles.switchRow}>
            <Text style={styles.label}>Utilizador Activo</Text>
            <Switch
              value={activo}
              onValueChange={setActivo}
              trackColor={{ false: '#E5E5EA', true: '#81C784' }}
              thumbColor={activo ? '#185FA5' : '#ccc'}
            />
          </View>
        </View>

        {/* Permissões */}
        <Text style={styles.sectionTitle}>Permissões</Text>

        {Object.entries(permissionGroups).map(([groupKey, permissions]) => {
  const label =
    permissionGroupsMeta?.[groupKey]?.label || groupKey;

  return (
    <View key={groupKey} style={styles.permissionGroup}>
      <Text style={styles.groupTitle}>
        {label}
      </Text>

      {Array.isArray(permissions) &&
        permissions.map((permission) => (
          <TouchableOpacity
            key={permission}
            style={styles.permissionItem}
            onPress={() => togglePermission(permission)}
          >
            <View
              style={[
                styles.checkbox,
                allPermissoes.includes(permission) &&
                  styles.checkboxActive,
              ]}
            >
              {allPermissoes.includes(permission) && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>

            <Text style={styles.permissionText}>
              {/* {permission.split('.').slice(1).join(' ')} */}
              {formatPermission(permission)}
              {/* {permission.split('.').slice(1).join(' ')} */}
            </Text>
          </TouchableOpacity>
        ))}
    </View>
  );
})}
 </ScrollView>
        {/* Botões de Ação */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.btnDanger, saving && { opacity: 0.5 }]}
            onPress={handleDelete}
            disabled={saving}
          >
            <Text style={styles.btnDangerText}>Eliminar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnPrimary, saving && { opacity: 0.5 }]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.btnPrimaryText}>
              {saving ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#185FA5',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    padding: 14,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1C1C1E',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  permissionGroup: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    padding: 12,
    marginBottom: 10,
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#185FA5',
    marginBottom: 10,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: '#185FA5',
    borderColor: '#185FA5',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  permissionText: {
    fontSize: 12,
    color: '#1C1C1E',
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    paddingHorizontal:10
  },
  btnDanger: {
    flex: 1,
    backgroundColor: '#FCEBEB',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E24B4A',
  },
  btnDangerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E24B4A',
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: '#185FA5',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
});
