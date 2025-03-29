import React, { useEffect, useState } from 'react';
import "./Vender.css"
import { addProductToDatabase, addSaleToDB, getProductsByCode } from '../../services/firebase-db.js';
import ModalNuevoProducto from '../ModalNuevoProducto/ModalNuevoProducto.jsx';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import { notifyError, notifySucces } from '../../utils/notifications.js';
import { CheckIcon, TrashIcon } from '../../common/Icons.jsx';

const Vender = () => {

    const [productsFound, setProductsFound] = useState([])
    const [codeBar, setCodeBar] = useState(null)
    const [total, setTotal] = useState(0)
    const [addPrice, setAddPrice] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newProductCode, setNewProductCode] = useState(null)
    const [disabledButton, setDisabledButton] = useState(false)
    const [amountToSubstract, setAmountToSubstract] = useState(0)

    useEffect(() => {
        const nuevoTotal = productsFound.reduce((acc, producto) => {
            return acc + producto.precio * producto.cantidad
        }, 0)
        setTotal(nuevoTotal)
    }, [productsFound])

    const handleBuscarProducto = async (e) => {
        e.preventDefault()
        if (!codeBar) {
            notifyError("Ingrese un código de barras.")
            return
        }
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

        setCodeBar(null)
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
            precio: parseFloat(addPrice),
            cantidad: 1
        }
        setProductsFound(prevProducts => [...prevProducts, newProduct])
        setAddPrice(null)
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
        setNewProductCode(null)
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

    const handleSubstractMoney = async (e) => {
        e.preventDefault()
        setDisabledButton(true)
        if (!amountToSubstract) return
        const date = new Date()

        const moneyOutfollowData = {
            fecha: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
            egreso: true,
            total: -amountToSubstract,
        }
        const response = await addSaleToDB(moneyOutfollowData)
        if (response) {
            notifySucces(response)
            setAmountToSubstract(0)
        } else {
            notifyError("Error al realizar la operación.")
        }
        setDisabledButton(false)
    }

    return (
        <>
            <ToastContainer />
            <div className='mainDivVender'>
                <div className='barcode-table'>
                    <div className='barcodeInputContainer'>
                        <h2 className='title'>Código de barras:</h2>
                        <input
                            placeholder='Escanea el código de barras...'
                            className='inputBarcode'
                            name="barcode"
                            value={codeBar || ""}
                            onChange={(e) => {
                                setCodeBar(parseFloat(e.target.value))
                            }}
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
                                                <TrashIcon
                                                    width={"20px"}
                                                    height={"20px"}
                                                    fill={"#252323"}
                                                />
                                            </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
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
                            <p>Precio de producto sin código:</p>
                            <form className='formInputAddPrice' onSubmit={handleSubmit}>
                                <div className='inputAddPriceContainer'>
                                    <p><span>$</span></p>
                                    <input
                                        className='inputAddPrice'
                                        name='addPrice'
                                        value={addPrice || ""}
                                        onChange={(e) => setAddPrice(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type='submit' className='buttonAdd'>Agregar</button>
                            </form>
                        </div>
                        <div className='addPriceContainer'>
                            <p>Egreso de dinero:</p>
                            <form className='formInputAddPrice' onSubmit={handleSubstractMoney}>
                                <div className='inputAddPriceContainer'>
                                    <p><span>$</span></p>
                                    <input
                                        className='inputAddPrice'
                                        name='amountToSubstract'
                                        value={amountToSubstract || ''}
                                        onChange={(e) => setAmountToSubstract(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type='submit' className='buttonAdd'>Restar de la caja</button>
                            </form>
                        </div>
                    </div>
                    <button
                        className='buttonFinishBuy'
                        onClick={handleCompleteSale}
                        disabled={disabledButton}
                    >
                        <CheckIcon
                            width={"25px"}
                            height={"25px"}
                            fill={"#252323"}
                        />
                        Realizar venta
                    </button>
                </div>
                <ModalNuevoProducto
                    disabledButton={disabledButton}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    dataProduct={{ codigoDeBarras: newProductCode }}
                    onSubmit={(productData) => handleAddProduct(productData)}
                />
            </div>
        </>

    );
}

export default Vender;
