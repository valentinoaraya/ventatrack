import React, { useEffect, useState } from 'react';
import "./Historial.css"
import { getSales } from '../../services/firebase.js';

const Historial = () => {

    const [arrayVentas, setArrayVentas] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchSales = async () => {
            setIsLoading(true)
            const response = await getSales()
            if (response) {
                setArrayVentas(response)
            }
            setIsLoading(false)
        }

        fetchSales()
    }, [])

    console.log(arrayVentas)

    return (
        <div>
            <h1 className='titleMain'>Historial de ventas</h1>
            {
                isLoading ?
                    <h2>Cargando...</h2>
                    :
                    <div className='divHistorySalesContainer'>
                        {
                            Object.keys(arrayVentas).map(fecha => {
                                return <div key={fecha} className='divSaleContainer'>
                                    <h2>Fecha: <span>{fecha.split("-")[2]} / {fecha.split("-")[1]} / {fecha.split("-")[0]}</span></h2>
                                    <ul>
                                        <li>Cantidad de ventas: {arrayVentas[fecha].length}</li>
                                        <li>Total del día: <span>$ {arrayVentas[fecha].reduce((acc, venta) => {
                                            return acc + venta.total
                                        }, 0)}</span></li>
                                    </ul>
                                </div>
                            })
                        }
                    </div>
            }
        </div>
    );
}

export default Historial;
