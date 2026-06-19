import { FornecedoresRepository } from '@/app/database/FornecedoresRepository';
import { api } from '@/services/api';
import { Fornecedores } from '@/types/types';
import NetInfo from '@react-native-community/netinfo';
import { Edit, Mail, Phone, Plus, Trash2, Truck } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdicionarFornecedor from '../components/Fornecedores/AdicionarFornecedor';
import EditarFornecedor from '../components/Fornecedores/EditarFornecedor';



export default function FornecedoresScreen () 
{
  const [fornecedores, setFornecedores] = useState<Fornecedores[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [openModalFornecedor, setOpenAddFornecedor] = useState(false);
  const [openModalEditarFornecedor, setOpenEditarFornecedor] = useState(false);
  const [fornecedorSeleccionado, setFornecedorSeleccionado] = useState<Fornecedores|null>(null);
  

  useEffect(() => {
    loadFornecedores();
  }, []);

  async function loadFornecedores() {
    try {
      setLoading(true);

      const net = await NetInfo.fetch();

      if (net.isConnected) {
        const response = await api.get('/fornecedor');
        setFornecedores(response.data.data);
        // Salva no SQLite para offline
        response.data.data.forEach((f: Fornecedores) => {
          FornecedoresRepository.save(f);
        });
      } else {
        // Carrega do SQLite se offline
        const fornecedoresLocal = FornecedoresRepository.getAll();
        setFornecedores(fornecedoresLocal);
      }
    } catch (error: any) {
      console.error('Erro ao carregar fornecedores:', error);
      // Fallback para offline
      const fornecedoresLocal = FornecedoresRepository.getAll();
      setFornecedores(fornecedoresLocal);
      Alert.alert('Aviso', 'Mostrando dados offline');
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    try {
      setRefreshing(true);
      await loadFornecedores();
    } finally {
      setRefreshing(false);
    }
  }

  const handleDelete = (id: number) => {
    Alert.alert(
      'Eliminar fornecedor',
      'Tem certeza que deseja eliminar este fornecedor?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await api.delete(`/fornecedor/${id}`);
              setFornecedores(fornecedores.filter((f) => f.id !== id));
              Alert.alert('Sucesso', 'Fornecedor eliminado');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível eliminar');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const FornecedorCard = ({ fornecedor }: { fornecedor: Fornecedores }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Truck size={24} color="#185FA5" />
        </View>
        <View style={styles.cardTitle}>
          <Text style={styles.fornecedorNome}>{fornecedor.nome}</Text>
          <Text style={styles.fornecedorSubtitle}>
            ID: {fornecedor.id}
          </Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.cardBody}>
        {fornecedor.email && (
          <View style={styles.infoRow}>
            <Mail size={16} color="#8E8E93" />
            <Text style={styles.infoText}>{fornecedor.email}</Text>
          </View>
        )}

        {fornecedor.telefone && (
          <View style={styles.infoRow}>
            <Phone size={16} color="#8E8E93" />
            <Text style={styles.infoText}>{fornecedor.telefone}</Text>
          </View>
        )}

       
      </View>

      {/* Ações */}
      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.btnEdit} onPress=
        {()=> {
             setFornecedorSeleccionado(fornecedor)
             setOpenEditarFornecedor(true)
             }}
        >
          <Edit size={16} color="#185FA5" />
          <Text style={styles.btnEditText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnDelete}
          onPress={() => handleDelete(fornecedor.id)}
        >
          <Trash2 size={16} color="#ef4444" />
          <Text style={styles.btnDeleteText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}
      edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#185FA5" />

      {/* Header */}
      <View style={styles.header}> 
      
        <View>
          <Text style={styles.headerTitle}>Fornecedores</Text>
          <Text style={styles.headerSubtitle}>
            Total: {fornecedores.length}
          </Text>
        </View>
        <TouchableOpacity
            onPress={() => setOpenAddFornecedor(true)}
            style={{ paddingTop: 10 }}
          >
            <Plus color={"#fff"} fontWeight={900} />
          </TouchableOpacity>
        
      </View>

      {/* Content */}
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#185FA5" />
          <Text style={styles.loadingText}>Carregando fornecedores...</Text>
        </View>
      ) : fornecedores.length === 0 ? (
        <View style={styles.centerContainer}>
          <Truck size={48} color="#E5E5EA" />
          <Text style={styles.emptyText}>Nenhum fornecedor encontrado</Text>
        </View>
      ) : (
        <FlatList
          data={fornecedores}
          renderItem={({ item }) => <FornecedorCard fornecedor={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#185FA5']}
              tintColor="#185FA5"
            />
          }
        />
      )}

      <AdicionarFornecedor
        openModal={openModalFornecedor}
        setOpenModal={setOpenAddFornecedor}
     
      />
      <EditarFornecedor
      openModal={openModalEditarFornecedor}
      setOpenModal={setOpenEditarFornecedor}
      fornecedor={fornecedorSeleccionado}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e4e4e4',
  },
  header: {
    backgroundColor: '#1e5aa8',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop:0,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    color: '#dbe7ff',
    marginTop: 4,
    fontSize: 14,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#8E8E93',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#EBF3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    flex: 1,
  },
  fornecedorNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  fornecedorSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  cardBody: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#555',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  btnEdit: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#EBF3FF',
    gap: 6,
  },
  btnEditText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#185FA5',
  },
  btnDelete: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    gap: 6,
  },
  btnDeleteText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ef4444',
  },
});
