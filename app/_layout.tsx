import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <PaperProvider>
      <Stack
        screenOptions={{
          headerShown: true,
          animation: 'fade',
        }}>

        <Stack.Screen name="(authenticated)/produtos" options={
          {    }}/>

        <Stack.Screen name="(authenticated)/dashboard" options={
          {    }}/>

        <Stack.Screen name="(authenticated)/settings" options={
          {    }}/>
        <Stack.Screen name="index" options={{headerShown: false}}/> 
        <Stack.Screen name="register/index" options={{headerShown: true,
            headerTitle: '',
            headerStyle: { backgroundColor: '#1a253f', }

          }}/> 
        

        </Stack>

      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </PaperProvider>
  );
}
