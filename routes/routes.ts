import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import { useEffect, useState } from "react";

import { api } from "@/services/api";
import { LoginResponse } from "../types/types";


export  function useAuth()
{
    const [signed,setSigned] = useState(false)
    const [loading,setLoading] = useState(true)
    const [user,setUser] = useState<Object|null>(null)
    const router = useRouter();
    
    useEffect(() =>{
        async function loadData()
        {
            await loadStorageData()
        }

        loadData()

    },[])

    async function loadStorageData()
    {
        try{
            const storedToken = await AsyncStorage.getItem("@token")
            const storedUser = await AsyncStorage.getItem("@user")

            console.log(storedToken)
            console.log(storedUser)
            setLoading(true)

            if(storedToken && storedUser)
            {
                setUser(JSON.parse(storedUser))
            }

        }
        catch(err)
        {
            console.log(err)
        }

        finally{
            setLoading(false)
        }
    }

    async function signIn (email:string, password:string)
    {
        try {
            const response = await api.post<LoginResponse>('/login',
                {
                    email:email,
                    password:password
                }
            )
            console.log(response.data)

            router.push({
                pathname:"/(authenticated)/dashboard",
                 params:{name:response.data.user.name.toString()}
            })

            const {token, ...userData} = response.data

            await AsyncStorage.setItem("@token", token)
            await AsyncStorage.setItem("@user", 
                JSON.stringify(userData))

            setUser(userData)
        }

        catch(err )
        {
            if(err instanceof Error)
                 console.log("Erro: ",err.message)
            throw err
        }
    }


    async function signOut()
    {
    await AsyncStorage.removeItem("@token")
    await AsyncStorage.removeItem("@user")

    setUser(null)
    }
    return {
        user,
        signed,
        loading,
        signIn,
        signOut,
    }
}
