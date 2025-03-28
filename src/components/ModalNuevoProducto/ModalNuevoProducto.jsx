import React, { useState, useEffect } from 'react';
import "./ModalNuevoProducto.css"

const ModalNuevoProducto = ({ isOpen, onClose, onSubmit, dataProduct, disabledButton, update, onDelete }) => {

    const [productData, setProductData] = useState({
        nombre: "",
        precio: null,
        codigoDeBarras: null
    })

    useEffect(() => {
        if (dataProduct) {
            setProductData((prevData) => ({
                ...prevData,
                nombre: dataProduct.nombre || "",
                precio: dataProduct.precio || null,
                codigoDeBarras: parseInt(dataProduct.codigoDeBarras),
            }));
        }
    }, [dataProduct]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "precio" || name === "codigoDeBarras") {
            setProductData((prevData) => ({
                ...prevData,
                [name]: parseFloat(value),
            }));
        } else {
            setProductData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
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

    const handleDeleteProduct = (e) => {
        e.preventDefault()
        onDelete()
        setProductData({
            nombre: "",
            precio: null,
            codigoDeBarras: null
        })
    }

    const handleCancel = (e) => {
        setProductData({
            nombre: "",
            precio: null,
            codigoDeBarras: null
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
                        <input type='number'
                            name="precio"
                            value={productData.precio || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='divLabelInput'>
                        <label>Código de barras: </label>
                        <input type="number"
                            name="codigoDeBarras"
                            value={productData.codigoDeBarras || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='divButtonsModalForm'>
                        <button
                            className='buttonModalForm'
                            type='submit'
                            disabled={disabledButton}
                        >
                            {update ? "Actualizar" : "Agregar"}
                        </button>
                        {
                            onDelete &&
                            <button
                                className='buttonModalForm'
                                type='button'
                                onClick={handleDeleteProduct}
                                disabled={disabledButton}
                            >
                                Eliminar
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
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalNuevoProducto;
