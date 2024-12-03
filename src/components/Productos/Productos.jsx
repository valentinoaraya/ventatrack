import React, { useEffect, useState } from 'react';
import "./Productos.css"
import { deleteProduct, getAllProducts, updateProduct } from '../../services/firebase-db.js';
import ModalNuevoProducto from '../ModalNuevoProducto/ModalNuevoProducto.jsx';
import { ToastContainer, toast } from 'react-toastify';

const Productos = () => {

    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [filteredProducts, setFilteredProducts] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [dataProduct, setDataProduct] = useState(null)
    const [disabledButton, setDisabledButton] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 15

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true)
            const response = await getAllProducts()
            if (response) {
                setProducts(response)
                setFilteredProducts(response)
            }
            setIsLoading(false)
        }
        fetchProducts()
    }, [])

    const paginatedProducts = filteredProducts?.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )

    const nextPage = () => {
        if (currentPage * pageSize < filteredProducts.length) {
            setCurrentPage(currentPage + 1);
        }
    }

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (e.target.value === "") {
            setFilteredProducts(products)
        } else {
            setFilteredProducts(products.filter(product => product.nombre.toLowerCase().includes(e.target.value.toLowerCase())))
        }
    }

    const handleOpenModalForm = (dataProduct) => {
        setDataProduct(dataProduct)
        setIsModalOpen(true)
    }

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

    const handleUpdateProduct = async (newDataProduct) => {
        setDisabledButton(true)
        const response = await updateProduct(dataProduct.id, newDataProduct)
        setDisabledButton(false)
        setIsModalOpen(false)
        if (response) {
            setProducts(prevProducts => {
                const newArrayProducts = prevProducts.filter(prod => prod.id != dataProduct.id)
                newArrayProducts.push(response)
                return newArrayProducts
            })
            setFilteredProducts(prevProducts => {
                const newArrayProducts = prevProducts.filter(prod => prod.id != dataProduct.id)
                newArrayProducts.push(response)
                return newArrayProducts
            })
            notifySucces("Producto actualizado.")
        } else {
            notifyError("Error al actualizar producto.")
        }
    }

    const handleDeleteProduct = async () => {
        setDisabledButton(true)
        const response = await deleteProduct(dataProduct.id)
        setDisabledButton(false)
        setIsModalOpen(false)
        if (response) {
            setProducts(prevProducts => prevProducts.filter(prod => prod.id != dataProduct.id))
            setFilteredProducts(prevProducts => prevProducts.filter(prod => prod.id != dataProduct.id))
            notifySucces("Producto eliminado.")
        } else {
            notifyError("Error al eliminar producto.")
        }
    }

    return (
        <div>
            <ToastContainer />
            <h1>Productos</h1>
            {
                isLoading ?
                    <h2>Cargando...</h2>
                    :
                    <>
                        <div className='divInput'>
                            <p>Buscar producto: </p>
                            <input
                                type="text"
                                onChange={(e) => handleSearch(e)}
                                placeholder='Nombre del producto...'
                            />
                        </div>
                        <table className='tableProducts2'>
                            <thead>
                                <tr>
                                    <th>
                                        PRODUCTO
                                    </th>
                                    <th>
                                        PRECIO
                                    </th>
                                    <th>
                                        CODIGO DE BARRAS
                                    </th>
                                    <th>
                                        EDITAR
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    paginatedProducts?.map(producto => {
                                        return <tr key={producto.codigoDeBarras}>
                                            <td className='tdTable'>
                                                {producto.nombre}
                                            </td>
                                            <td className='tdTable'>
                                                $ {producto.precio}
                                            </td>
                                            <td className='tdTable'>
                                                {producto.codigoDeBarras}
                                            </td>
                                            <td className='tdTable'>
                                                <button onClick={() => handleOpenModalForm(producto)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </>
            }
            <div className='divButtonPages'>
                <button className='buttonPage' onClick={prevPage} disabled={currentPage === 1} >{"<"}</button>
                <p>{currentPage}</p>
                <button className='buttonPage' onClick={nextPage} disabled={currentPage * pageSize >= filteredProducts.length}>{">"}</button>
            </div>
            <ModalNuevoProducto
                isOpen={isModalOpen}
                update={true}
                onClose={() => { setIsModalOpen(false) }}
                dataProduct={dataProduct}
                disabledButton={disabledButton}
                onSubmit={(productData) => handleUpdateProduct(productData)}
                onDelete={handleDeleteProduct}
            />
        </div>
    );
}

export default Productos;
