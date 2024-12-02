import React, { useState, useEffect } from 'react';
import "./ModalNuevoProducto.css"

const ModalNuevoProducto = ({ isOpen, onClose, onSubmit, dataProduct, disabledButton, update, onDelete }) => {

    const [productData, setProductData] = useState({
        nombre: "",
        precio: "",
        codigoDeBarras: ""
    })

    useEffect(() => {
        if (dataProduct) {
            setProductData((prevData) => ({
                ...prevData,
                nombre: dataProduct.nombre || "",
                precio: dataProduct.precio || "",
                codigoDeBarras: dataProduct.codigoDeBarras,
            }));
        }
    }, [dataProduct]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault()
        onSubmit(productData)
        setProductData({
            nombre: "",
            precio: "",
            codigoDeBarras: ""
        })
    }

    const handleDelepteProduct = (e) => {
        e.preventDefault()
        onDelete()
        setProductData({
            nombre: "",
            precio: "",
            codigoDeBarras: ""
        })
    }

    const handleCancel = (e) => {
        setProductData({
            nombre: "",
            precio: "",
            codigoDeBarras: ""
        })
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className='modal-overlay'>
            <div className='modal-content'>
                <h2>{update ? "Actualizar" : "Agregar nuevo"} producto</h2>
                <form onSubmit={handleFormSubmit} className='formAddProduct'>
                    <div className='divLabelInput'>
                        <label>Nombre del producto: </label>
                        <input type="text"
                            name="nombre"
                            value={productData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='divLabelInput'>
                        <label>Precio: </label>
                        <input type="text"
                            name="precio"
                            value={productData.precio}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='divLabelInput'>
                        <label>Código de barras: </label>
                        <input type="text"
                            name="codigoDeBarras"
                            value={productData.codigoDeBarras}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        className='buttonModalForm'
                        type='submit'
                        disabled={disabledButton}
                    >
                        {update ? "Actualizar" : "Agregar"} producto
                    </button>
                    {
                        onDelete &&
                        <button
                            className='buttonModalForm'
                            type='button'
                            onClick={handleDelepteProduct}
                            disabled={disabledButton}
                        >
                            Eliminar producto
                        </button>
                    }
                    <button
                        className='buttonModalForm'
                        type='button'
                        onClick={handleCancel}
                        disabled={disabledButton}
                    >
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ModalNuevoProducto;
