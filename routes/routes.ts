import { api } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { LoginResponse, Produtos, User } from "../types/types";


export  function useAuth()
{
    const [signed,setSigned] = useState(false)
    const [loading,setLoading] = useState(true)
    const [user,setUser] = useState<User>()
    const [produtos, setProdutos] = useState<Produtos>()
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

            // if(storedToken && storedUser)
            // {
            //     setUser(JSON.parse(storedUser))
            //      setSigned(true);
            // }

            if (storedToken) {
                const response = await api.get('/me', {
                    headers: { Authorization: `Bearer ${storedToken}` }
                });

                setUser(response.data);
                setSigned(true);
            }

        }
        catch(err)
        {
            console.log(err)
            setSigned(false);
            setUser(undefined);
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
            setSigned(true)

             
            
            const {token, ...userData} = response.data

            const responsee = await api.get('/me',
                {
                    headers: { Authorization: `Bearer ${token}` }
                })

            await AsyncStorage.setItem("@token", token)
            await AsyncStorage.setItem("@user", 
                JSON.stringify(userData))
            
            
            setUser(responsee.data)
        }

        catch(err)
        {
            // if(err instanceof Error)
            //      console.log("Erro: ",err.message)
            // throw err

       if (axios.isAxiosError(err))
        {
        // Login inválido
            if (err.response?.status === 401)
            {
                throw new Error("INVALID_CREDENTIALS");
            }

        // Sem internet
            if (!err.response)
            {
                throw new Error("NETWORK_ERROR");
            }
        }

    throw new Error("SERVER_ERROR");
        }
    }


    async function signOut(token:string)
    {

    try
    {
       await api.post('/logout',
        {
        token:token
        }) 

        await AsyncStorage.removeItem("@token")
        await AsyncStorage.removeItem("@user")
        setSigned(false);
        setUser(undefined)

    }
    catch (err)
    {

    }
    finally{

    }}

   

    return {
        user,
        signed,
        loading,
        signIn,
        signOut,
    }
}
