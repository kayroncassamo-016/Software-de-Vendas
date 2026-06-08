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
    const [networkError,setNetworkError] = useState(false)
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

            console.log('stored token: ',storedToken)
            console.log(storedUser)
            setLoading(true)
            setNetworkError(false)



            if (storedToken) {
                const response = await api.get('/auth/me', {
                    headers: { Authorization: `Bearer ${storedToken}` }
                });

                setUser(response.data);
                setSigned(true);
            }

        }
        // catch(err:any)
        // {
        //     await AsyncStorage.removeItem("@token");
        //     await AsyncStorage.removeItem("@user");
        //     console.log(err)
        //     setSigned(false);
        //     setUser(undefined);
        //     setNetworkError(true)

        // }
        catch(err:any)
        {
            console.log(err);

            // Sem internet
            if (!err.response)
            {
                setNetworkError(true);
                return;
            }

            // Utilizador não autorizado
            if (err.response.status === 401
   )
            {
                await AsyncStorage.removeItem("@token");
                await AsyncStorage.removeItem("@user");

                setSigned(false);
                setUser(undefined);
                return;
            }

            // Outros erros
            setSigned(false);
        }

        finally{
            setLoading(false)
        }
    }

    async function signIn (email:string, password:string)
    {
        try {
            const response = await api.post<LoginResponse>('/auth/login',
                {
                    email:email,
                    password:password
                }
            )
            console.log(response.data)

            // router.push({
            //     pathname:"/(authenticated)/dashboard",
            //      params:{name:response.data.user.name.toString()}
            // })
            // setSigned(true)
            
             
            
            const {token, ...userData} = response.data

            await AsyncStorage.setItem("@token", token)
            await AsyncStorage.setItem("@user", 
                JSON.stringify(userData))

            const responsee = await api.get('/auth/me',
                {
                    headers: { Authorization: `Bearer ${token}` }
                })

              router.push({
                pathname:"/(authenticated)/dashboard",
                 params:{name:response.data.user.name.toString()}
            })
            setSigned(true)

            setUser(responsee.data)
        }

        catch(err:any)
        {
            console.log(err.response)
            console.log(axios.isAxiosError(err))
            //Coemcar daqui do routes
           console.log('yall ' ,err.response?.data?.message)

            if (err.response?.status === 422)
            {
                
                throw new Error("INVALID_CREDENTIALS");
            }

        // Sem internet
            if (!err.response)
            {
                 setNetworkError(true)
                throw new Error("NETWORK_ERROR");
            }
        
         throw new Error("SERVER_ERROR");
        }
        
  
        //}
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

    function handleLogout() {
    AsyncStorage.removeItem("@token");
    AsyncStorage.removeItem("@user");

    setSigned(false);
    setUser(undefined);

    router.replace("/login/login");
}

   

    return {
        user,
        signed,
        networkError,
        loadStorageData,
        loading,
        signIn,
        signOut,
    }
}
