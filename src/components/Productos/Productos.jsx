import React, { useEffect, useState } from 'react';
import "./Productos.css"
import { deleteProduct, getAllProducts, updateProduct } from '../../services/firebase-db.js';
import ModalNuevoProducto from '../ModalNuevoProducto/ModalNuevoProducto.jsx';
import { ToastContainer } from 'react-toastify';
import { notifySucces, notifyError } from '../../utils/notifications.js';
import { PencilIcon } from '../../common/Icons.jsx';

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
        <div className='divProductsContainer'>
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
                        <div className='tableProductsContainer'>
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
                                        <th className='thEditProduct'>
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
                                                <td className='tdTable tdEditProduct'>
                                                    <button className='buttonEditProduct' onClick={() => handleOpenModalForm(producto)}>
                                                        <PencilIcon
                                                            width={'16px'}
                                                            height={'16px'}
                                                            fill={'#252323'}
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
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
                onClose={() => {
                    setIsModalOpen(false)
                    setDataProduct(null)
                }}
                dataProduct={dataProduct}
                disabledButton={disabledButton}
                onSubmit={(productData) => handleUpdateProduct(productData)}
                onDelete={handleDeleteProduct}
            />
        </div>
    );
}

export default Productos;
