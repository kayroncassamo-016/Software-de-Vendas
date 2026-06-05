import { AuthProvider } from '@/contexts/AuthProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter()
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
  
  <GestureHandlerRootView style={{ flex: 1 }}>
    <AuthProvider>
      <PaperProvider>
      <Stack
        screenOptions={{
          animation: 'fade',
        }}>  
        
        <Stack.Screen name="index" options={{headerShown: false}}/> 
        <Stack.Screen name="login/login" options={{headerShown: false}}/> 
        <Stack.Screen name="(authenticated)/settings" options={
          { headerShown: false   }}/>
      
       
        
        <Stack.Screen name="(authenticated)/produtos" options={
          {headerShown: false    }}/>

        <Stack.Screen name="(authenticated)/dashboard" options={
          {headerShown: false    }}/>

        <Stack.Screen name="(authenticated)/clientes" options={
          {headerShown: false    }}/>
          
         <Stack.Screen name="(authenticated)/vendasForm" options={
          {  headerShown: true,
             headerTitle:'Voltar',
             animation:'slide_from_right',
            
             headerTintColor:'#5c5b5b',
             headerStyle: {
                  backgroundColor: '#e4e4e4',
               },

              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.replace('/(authenticated)/vendas')}
                >
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color="#5c5b5b"
                  />
                </TouchableOpacity>
              ),

          }}/>


           <Stack.Screen name="components/Vendas/AbrirRascunho" options={
          {  headerShown: true,
             headerTitle:'Voltar',
             animation:'slide_from_right',
            
             headerTintColor:'#5c5b5b',
             headerStyle: {
                  backgroundColor: '#e4e4e4',
               },

              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.replace('/(authenticated)/vendas')}
                >
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color="#5c5b5b"
                  />
                </TouchableOpacity>
              ),

          }}/>


        <Stack.Screen name="(authenticated)/vendas" options={
          {headerShown: false}}/>
      
        <Stack.Screen name="register/index" options={{headerShown: true,
            headerTitle: '',
            headerStyle: { backgroundColor: '#1a253f', }
         }}/> 

         
        <Stack.Screen name="(authenticated)/userDetail" options={
          {  headerShown: true,
             headerTintColor:'#5c5b5b',
             headerStyle: {
                  backgroundColor: '#e4e4e4',
               },
               headerTitle:'Voltar',
            headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.replace('/(authenticated)/userList')}
                >
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color="#5c5b5b"
                  />
                </TouchableOpacity>
              ),
          }}/>
      
        <Stack.Screen name="(authenticated)/userList" options={
          {  headerShown: true,
             headerTintColor:'#5c5b5b',
             headerStyle: {
                  backgroundColor: '#e4e4e4',
               },
               headerTitle:'Voltar',
            headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.replace('/(authenticated)/settings')}
                >
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color="#5c5b5b"
                  />
                </TouchableOpacity>
              ),
          }}/>
      
        </Stack>

      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
     </PaperProvider>
    </AuthProvider>
    </GestureHandlerRootView>
  );
}
