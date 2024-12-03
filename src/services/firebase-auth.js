import {app} from "./firebase.js"
import {getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut} from "firebase/auth"

const auth = getAuth(app)

// Iniciar sesión
export const login = async (email, password) => {
    try{
        await signInWithEmailAndPassword(auth, email, password)
        auth.currentUser?.getIdToken().then((token)=>{
            localStorage.setItem("authToken", token)
        })
        return "Usuario autenticado."
    } catch(error){
        console.error("Error al iniciar sesión:", error)
    }
}

// Cerrar sesión
export const logout = async () => {
    try {
        await signOut(auth)
        console.log("Usuario desconectado")
    } catch (error) {
        console.error("Error al cerrar sesión:", error)
    }
}

// Obtener el usuario actual
export const getCurrentUser = ()=>{
    return auth.currentUser
}

// Detectar cambios en la autenticación
export const authListener = (callback)=>{
    return onAuthStateChanged(auth, callback)
}