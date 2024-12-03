import {app} from "./firebase.js"
import {addDoc, collection, doc, getDocs, getFirestore, query, updateDoc, where, getDoc, deleteDoc} from "firebase/firestore"

const db = getFirestore(app)

// Obtener producto por código de barra
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

// Obtener todos los productos
export const getAllProducts = async () => {
    try{
        const querySnapshot = await getDocs(collection(db, "productos"))
        const documents = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
        return documents
    } catch(error){
        console.error(error)
        return null
    }
}

// Agregar producto a la base de datos
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

// Actualizar un producto
export const updateProduct = async (idProduct, newDataProduct) => {
    try{
        const productRef = doc(db, "productos", idProduct)
        await updateDoc(productRef, newDataProduct)
        const updatedProduct = await getDoc(productRef)
        if (updatedProduct.exists()){
            return {
                id: updatedProduct.id,
                ...updatedProduct.data()
            }
        }
    } catch(error){
        console.error(error)
        return null
    }
}

// Eliminar un producto
export const deleteProduct = async (idProduct) => {
    try{
        const productRef = doc(db, "productos", idProduct)
        const deletedProduct = await getDoc(productRef)
        await deleteDoc(productRef)
        if (deletedProduct.exists()){
            return {
                id: deletedProduct.id,
                ...deletedProduct.data()
            }
        }
    } catch(error){
        console.error(error)
        return null
    }
}

// Agregar venta realizada a la base de datos
export const addSaleToDB = async (saleData) => {
    try{
        const collectionRef = collection(db, "ventas")
        await addDoc(collectionRef, saleData)
        return `Venta realizada correctamente.`
    } catch(error){
        console.error(error)
        return null
    }
}

// Obtener ventas
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
