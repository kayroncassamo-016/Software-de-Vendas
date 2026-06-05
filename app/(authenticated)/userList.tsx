import { api } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface User {
  id: number;
  name: string;
  email: string;
  cargo: string;
  activo: boolean;
  created_at: string;
  permissoes: string[];
}

export default function UsersListScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('@token');
      const res = await api.get('/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data);
    } catch (err) {
      console.log('Erro ao carregar utilizadores:', err);
      Alert.alert('Erro', 'Não foi possível carregar utilizadores');
    } finally {
      setLoading(false);
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => router.push({
        pathname: '/(authenticated)/userDetail',
        params: { id: item.id },
      })}
    >
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userCargo}>{item.cargo}</Text>
      </View>
      
      <View style={styles.userStatus}>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.activo ? '#EAF3DE' : '#FCEBEB' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: item.activo ? '#3B6D11' : '#A32D2D' }
          ]}>
            {item.activo ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#185FA5" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Utilizadores</Text>
        <Text style={styles.headerSubtitle}>Gestão de utilizadores</Text>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#185FA5" />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUser}
          scrollEnabled={true}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 14,
    gap: 10,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 3,
  },
  userEmail: {
    fontSize: 11,
    color: '#8E8E93',
    marginBottom: 4,
  },
  userCargo: {
    fontSize: 11,
    color: '#185FA5',
    fontWeight: '500',
  },
  userStatus: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 18,
    color: '#8E8E93',
  },
});
