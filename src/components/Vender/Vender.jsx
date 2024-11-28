import React, { useEffect, useId, useState } from 'react';
import "./Vender.css"
import { addProductToDatabase, addSaleToDB, getProductsByCode } from '../../services/firebase';
import ModalNuevoProducto from '../ModalNuevoProducto/ModalNuevoProducto.jsx';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

const Vender = () => {

    const [productsFound, setProductsFound] = useState([])
    const [codeBar, setCodeBar] = useState("")
    const [total, setTotal] = useState(0)
    const [addPrice, setAddPrice] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newProductCode, setNewProductCode] = useState("")
    const [disabledButton, setDisabledButton] = useState(false)

    useEffect(() => {
        const nuevoTotal = productsFound.reduce((acc, producto) => {
            return acc + producto.precio * producto.cantidad
        }, 0)
        setTotal(nuevoTotal)
    }, [productsFound])

    const notifySucces = (text) => toast.success(text, {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: false,
        theme: "colored"
    })

    const notifyError = (text) => toast.error(text, {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: false,
        theme: "colored"
    })

    const handleBuscarProducto = async (e) => {
        e.preventDefault()
        const resultado = await getProductsByCode(codeBar)
        if (resultado) {
            const existsProduct = productsFound.findIndex(producto => producto.codigoDeBarras === resultado.codigoDeBarras)
            if (existsProduct != -1) {
                const updatedProducts = [...productsFound]
                updatedProducts[existsProduct] = {
                    ...updatedProducts[existsProduct],
                    cantidad: updatedProducts[existsProduct].cantidad += 1
                }
                setProductsFound(updatedProducts)
            } else {
                setProductsFound(prevProducts => [...prevProducts, { ...resultado, cantidad: resultado.cantidad = 1 }])
            }
        } else {
            setNewProductCode(codeBar)
            setIsModalOpen(true)
        }

        setCodeBar("")
    }

    const handleDeleteProduct = (prod) => {
        const updatedProducts = productsFound.filter(producto => producto.codigoDeBarras != prod.codigoDeBarras)
        setProductsFound(updatedProducts)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const newId = `producto-suelto-${Math.floor(Math.random() * 999999)}`
        const newProduct = {
            nombre: "Producto suelto",
            codigoDeBarras: newId,
            precio: parseInt(addPrice),
            cantidad: 1
        }
        setProductsFound(prevProducts => [...prevProducts, newProduct])
        setAddPrice("")
    }

    const handleAddProduct = async (product) => {
        setDisabledButton(true)
        const response = await addProductToDatabase(product)
        setDisabledButton(false)
        setIsModalOpen(false)
        if (response) {
            const newProduct = {
                ...product,
                cantidad: 1
            }
            setProductsFound(prevProducts => [...prevProducts, newProduct])
            notifySucces("Producto agregado correctamente.")
        } else {
            notifyError("Error al cargar el producto.")
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setNewProductCode("")
    }

    const handleCompleteSale = async () => {
        setDisabledButton(true)
        if (productsFound.length === 0) {
            setDisabledButton(false)
            return
        }
        const date = new Date()

        const saleData = {
            fecha: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
            total: total,
            productos: productsFound
        }
        const response = await addSaleToDB(saleData)
        if (response) {
            notifySucces(response)
            setTotal(0)
            setProductsFound([])
        } else {
            notifyError("Error al realizar la venta.")
        }
        setDisabledButton(false)
    }

    return (
        <div className='mainDivVender'>
            <ToastContainer />
            <div className='barcode-table'>
                <div className='barcodeInputContainer'>
                    <h1 className='title'>Código de barras:</h1>
                    <input
                        className='inputBarcode'
                        type="text"
                        name="barcode"
                        value={codeBar}
                        onChange={(e) => setCodeBar(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleBuscarProducto(e)}
                    />
                    <button className='buttonSearch' onClick={handleBuscarProducto} >Buscar</button>
                </div>
                <div className='tableContainer'>
                    <table className='tableProducts'>
                        <thead>
                            <tr>
                                <th>DETALLE</th>
                                <th>CANTIDAD</th>
                                <th>PRECIO x UNIDAD</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                productsFound.map((producto, index) => {
                                    return <tr key={index}>
                                        <td>
                                            <p>{producto.nombre || "Producto"}</p>
                                        </td>
                                        <td>
                                            {producto.cantidad}
                                        </td>
                                        <td>
                                            $ {producto.precio}
                                        </td>
                                        <td onClick={() => handleDeleteProduct(producto)} className='deleteProductChar'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                            </svg>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div className='divWithShadow'></div>
            </div>
            <div className='totalpriceContainer'>
                <div>
                    <div className='totalPrice'>
                        <h1>TOTAL:</h1>
                        <div className='priceContainer'>
                            <h2>$ {total}</h2>
                        </div>
                    </div>
                    <div className='addPriceContainer'>
                        <p>Ingresar precio de producto suelto:</p>
                        <form className='formInputAddPrice' onSubmit={handleSubmit}>
                            <div className='inputAddPriceContainer'>
                                <p><span>$</span></p>
                                <input
                                    className='inputAddPrice'
                                    type="text"
                                    name='addPrice'
                                    value={addPrice}
                                    onChange={(e) => setAddPrice(e.target.value)}
                                    required
                                />
                            </div>
                            <button type='submit' className='buttonAdd'>Agregar</button>
                        </form>
                    </div>
                </div>
                <button
                    className='buttonFinishBuy'
                    onClick={handleCompleteSale}
                    disabled={disabledButton}
                >
                    Realizar venta
                </button>
            </div>
            <ModalNuevoProducto
                disabledButton={disabledButton}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                code={newProductCode}
                onSubmit={(productData) => handleAddProduct(productData)}
            />
        </div>
    );
}

export default Vender;
