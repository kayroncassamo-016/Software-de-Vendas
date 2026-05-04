import { colors } from '@/constants/theme'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

import { useContexto } from '@/contexts/AuthContext'
import { useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'

export default function Index ()
{

    const {loading,signed} = useContexto()
    const segments = useSegments()
    const router = useRouter()


   useEffect(()=>{
    
    if(loading)
        return

    const inAuthGroup = segments[0] === "(authenticated)"

    if(!signed && inAuthGroup)
    {
        router.replace("/login/login")

    }
    else if(signed && !inAuthGroup)
    {
        router.replace("/(authenticated)/dashboard")
    }
    else if(!signed)
    {
        router.replace("/login/login")
    }

   },[loading,signed,router])


   if(loading)
   {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.blue}/>
        </View>
    )
   }

    return (

        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.blue}/>
        </View>

    )
}

const styles = StyleSheet.create({
    container:
    {
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:'#fff'
    }
})