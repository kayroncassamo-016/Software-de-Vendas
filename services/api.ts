
import { API_CONFIG } from "@/config/api.config"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"

export const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout:API_CONFIG.TIMEOUT,

    headers:
    {
        "Content-Type":"application/json"
    }
})

api.interceptors.request.use(

    async (config) =>
    {
        const token = await AsyncStorage.getItem("@token")

        if(token)
        {
            config.headers.Authorization = `Bearer ${token}`
        }
        
        return config
    },
    (error) =>
    {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
(response) => response, 

 async(error) =>
 {
    if(error.response?.status === 401)
    {
        await AsyncStorage.removeItem("@token")
        
    }

    return Promise.reject(error)
 }

)
// let isHandlingAuthError = false;
// api.interceptors.response.use(
//   response => response,

//   async (error) => {

//     const status = error.response?.status;

//     if (status === 401 && !isHandlingAuthError) {

//       isHandlingAuthError = true;

//       await AsyncStorage.removeItem("@token");
//       await AsyncStorage.removeItem("@user");

//       Alert.alert('Erro', error.response.data.message);

//     router.replace("/login/login");

//       //reset após pequeno delay (evita bloqueio permanente)
//       setTimeout(() => {
//         isHandlingAuthError = false;
//       }, 3000);
//     }

//     return Promise.reject(error);
//   }
// );