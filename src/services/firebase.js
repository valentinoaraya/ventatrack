import {initializeApp} from "firebase/app"
import {addDoc, collection, getDocs, getFirestore, limit, orderBy, query, startAfter, where} from "firebase/firestore"

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,  
    measurementId: import.meta.env.VITE_FIREBASE_MESAUREMENT_ID 
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export const getProductsByCode = async (codigo) => {
    try{
        const productosRef = collection(db, "productos")
        const q = query(productosRef, where("codigoDeBarras", "==", codigo))
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {
            const producto = querySnapshot.docs[0].data();
            return producto;
        } else {
            console.error("Producto no encontrado");
            return null;
        }
    } catch(error){
        console.error(error)
        return null
    }
}

export const addProductToDatabase = async (productData) => {
    try{
        const collectionRef = collection(db, "productos")
        await addDoc(collectionRef, productData)
        return `${productData.nombre} agregado correctamente.`
    } catch(error){
        console.error(error)
        return null
    }
}

export const addSaleToDB = async (saleData) => {
    try{
        const collectionRef = collection(db, "ventas")
        console.log(saleData)
        await addDoc(collectionRef, saleData)
        return `Venta realizada correctamente.`
    } catch(error){
        console.error(error)
        return null
    }
}

export const getSales = async () =>{
    try{
        const querySnapshot = await getDocs(collection(db, "ventas"))
        const documents = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))        

        // Agrupar por fecha
        const groupedSales = documents.reduce((acc, sale)=>{
            const {fecha} = sale
            if (!acc[fecha]) acc[fecha] = []
            acc[fecha].push(sale)
            return acc
        }, {})

        // Ordenar fechas
        const orderedGroupedSales = Object.keys(groupedSales)
            .sort((a,b)=> new Date(b) - new Date(a))
            .reduce((acc, fecha)=> {
                acc[fecha] = groupedSales[fecha]
                return acc
            }, {})
            
        return orderedGroupedSales

    } catch(error){
        console.error(error)
        return null
    }
}