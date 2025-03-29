import React, { useEffect, useState } from 'react';
import "./Historial.css"
import { getSales } from '../../services/firebase-db.js';

const Historial = () => {

    const [objetoVentas, setObjetoVentas] = useState({})
    const [filteredDates, setFilteredDates] = useState([])
    const [filterOption, setFilterOption] = useState("all")
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = window.innerWidth <= 1200 ? 5 : 16

    useEffect(() => {
        const fetchSales = async () => {
            setIsLoading(true)
            const response = await getSales()

            if (response) {
                setObjetoVentas(response)
                const today = new Date()
                let arrayDates = []

                if (filterOption === "week") {
                    const lastWeek = new Date()
                    lastWeek.setDate(today.getDate() - 7)
                    arrayDates = Object.keys(response).filter(fecha => new Date(fecha) >= lastWeek)
                } else if (filterOption === "month") {
                    const lastMonth = new Date()
                    lastMonth.setDate(today.getDate() - 31)
                    arrayDates = Object.keys(response).filter(fecha => new Date(fecha) >= lastMonth)
                } else {
                    arrayDates = Object.keys(response)
                }

                setFilteredDates(arrayDates)
            }
            setIsLoading(false)
        }

        fetchSales()
    }, [filterOption])

    const paginatedSales = filteredDates?.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )

    const nextPage = () => {
        if (currentPage * pageSize < filteredDates.length) {
            setCurrentPage(currentPage + 1);
        }
    }

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    return (
        <div className='divHistorialContainer'>
            <h1 className='titleMain'>Historial de ventas</h1>
            {
                isLoading ?
                    <h2>Cargando...</h2>
                    :
                    <>
                        <div className='divFilters'>
                            <button
                                className="buttonFilter"
                                onClick={() => setFilterOption("week")}
                                disabled={filterOption === "week"}
                            >
                                Última semana
                            </button>
                            <button
                                className="buttonFilter"
                                onClick={() => setFilterOption("month")}
                                disabled={filterOption === "month"}
                            >
                                Último mes
                            </button>
                            <button
                                className="buttonFilter"
                                onClick={() => setFilterOption("all")}
                                disabled={filterOption === "all"}
                            >
                                Todas
                            </button>
                        </div>
                        <div className='divHistorySalesContainer'>
                            {
                                paginatedSales.map(fecha => {

                                    const ventas = objetoVentas[fecha].filter(ventas => !ventas.egreso)
                                    const egresos = objetoVentas[fecha].filter(ventas => ventas.egreso)

                                    return <div key={fecha} className='divSaleContainer'>
                                        <h2>Fecha: <span>{fecha.split("-")[2]} / {fecha.split("-")[1]} / {fecha.split("-")[0]}</span></h2>
                                        <ul>
                                            <li>Cantidad de ventas: {ventas.length}</li>
                                            <li>Pagos realizados: {egresos.length}</li>
                                            <li>Total del día: <span>$ {objetoVentas[fecha].reduce((acc, venta) => {
                                                return acc + venta.total
                                            }, 0)}</span></li>
                                        </ul>
                                    </div>
                                })
                            }
                        </div>
                        <div className='divButtonPages'>
                            <button className='buttonPage' onClick={prevPage} disabled={currentPage === 1} >{"<"}</button>
                            <p>{currentPage}</p>
                            <button className='buttonPage' onClick={nextPage} disabled={currentPage * pageSize >= filteredDates.length}>{">"}</button>
                        </div>
                    </>
            }
        </div>
    );
}

export default Historial;
