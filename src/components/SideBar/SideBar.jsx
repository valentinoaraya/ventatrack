import React from 'react';
import "./SideBar.css"
import { Link, useLocation } from 'react-router-dom';

const SideBar = () => {

    const location = useLocation()

    return (
        <div className='sidebar'>
            <h1 className='app-name'>VentaTrack</h1>
            <nav>
                <ul>
                    <Link className='link' to={"/"}><li className={location.pathname === "/" ? "aplicarFondo" : ""}>Vender</li></Link>
                    <Link className='link' to={"/productos"}><li className={location.pathname === "/productos" ? "aplicarFondo" : ""} >Productos</li></Link>
                    <Link className='link' to={"/historial"}><li className={location.pathname === "/historial" ? "aplicarFondo" : ""} >Historial</li></Link>
                </ul>
            </nav>
        </div>
    );
}

export default SideBar;
