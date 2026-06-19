import { AuthProvider } from '@/contexts/AuthProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { initDatabase } from './database/init';
export default function RootLayout() {

 
   useEffect(() => {
    initDatabase();
  }, []);


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

           <Stack.Screen name="(authenticated)/FornecedoresScreen" 
           options=
           { { 
           
             headerShown: true,
             headerTitle:'Voltar',
             animation:'fade',
            
             headerTintColor:'#5c5b5b',
             headerStyle: {
                  backgroundColor: '#e4e4e4',
               },

              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.replace('/(authenticated)/dashboard')}
                >
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color="#5c5b5b"
                  />
                </TouchableOpacity>
              ),

          } }
          
         />


        <Stack.Screen name="(authenticated)/vendas" options={
          {headerShown: false}}/>

         <Stack.Screen name="components/Conection/Conection" options={
          {headerShown: false}}/>
      
      
        <Stack.Screen name="register/index" options={{headerShown: true,
            headerTitle: '',
            headerStyle: { backgroundColor: '#1a253f', }
         }}/> 

         
        <Stack.Screen name="(authenticated)/users/userDetail" options={
          {  headerShown: true,
             headerTintColor:'#5c5b5b',
             headerStyle: {
                  backgroundColor: '#e4e4e4',
               },
               headerTitle:'Voltar',
            headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.replace('/(authenticated)/users/userList')}
                >
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color="#5c5b5b"
                  />
                </TouchableOpacity>
              ),
          }}/>
      
        <Stack.Screen name="(authenticated)/users/userList" options={
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
