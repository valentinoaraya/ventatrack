import React from 'react';
import "./SideBar.css"
import { Link, useLocation } from 'react-router-dom';
import { BasketIcon, ArchiveIcon, ClockIcon } from '../../common/Icons';

const SideBar = () => {

    const location = useLocation()

    return (
        <div className='sidebar'>
            <h1 className='app-name'>VentaTrack</h1>
            <nav>
                <ul>
                    <Link className='link' to={"/"}>
                        <li className={location.pathname === "/" ? "aplicarFondo" : ""}>
                            <BasketIcon
                                width={"16px"}
                                height={"16px"}
                                fill={location.pathname === "/" ? "#252323" : "#70798C"}
                            />
                            Vender
                        </li>
                    </Link>
                    <Link className='link' to={"/productos"}>
                        <li className={location.pathname === "/productos" ? "aplicarFondo" : ""} >
                            <ArchiveIcon
                                width={"16px"}
                                height={"16px"}
                                fill={location.pathname === "/productos" ? "#252323" : "#70798C"}
                            />
                            Productos
                        </li>
                    </Link>
                    <Link className='link' to={"/historial"}>
                        <li className={location.pathname === "/historial" ? "aplicarFondo" : ""} >
                            <ClockIcon
                                width={"16px"}
                                height={"16px"}
                                fill={location.pathname === "/historial" ? "#252323" : "#70798C"}
                            />
                            Historial
                        </li>
                    </Link>
                </ul>
            </nav>
        </div>
    );
}

export default SideBar;
