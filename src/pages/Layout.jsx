import {Outlet} from "react-router-dom"
import Navbar from "../components/Navbar"
import {useEffect, useState} from "react"
import Footer from "../components/Footer"
export default function Layout(props){
    const clubData = props.clubData;

    return(
        <>
            <Navbar clubData = {clubData}/>
            <Outlet/>
            <Footer />
        </>
    )
}