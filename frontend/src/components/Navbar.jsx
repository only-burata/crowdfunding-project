import { useEffect, useState } from "react"
import CustomButton from "./CustomButton"
import { logo } from "../assets"
import clsx from "clsx"
import { NavLink, Link } from "react-router-dom"
import { useStateContext } from "../context"
import { ethers } from "ethers"

export default function Navbar() {    
    const {account, connectWallet, setAccount, disconnectWallet} = useStateContext() 
    
    console.log(`account: ${account}`)
    const isConnected = account !== ''      
    const buttonClassName = clsx({
        navbutton: true,
        connected: isConnected,
        disconnected: !isConnected
    })
    const navLinkStyles = ({isActive}) => {
        return {
            textDecoration: "none",
            color: isActive ? "#0387e6": "black"
        }
    }


    return (
        <nav>
            <Link to="/" className="logo-container"> <img src={logo} alt="" /></Link>
            <div className="navigation-links">
                <NavLink style={navLinkStyles} to="/">Home</NavLink>
                <NavLink style={navLinkStyles} to="create-campaign">Create campaign</NavLink>
                <NavLink style={navLinkStyles} to='user-dashboard/my-campaigns'>User Dashboard</NavLink>
            </div>
            <div className="nav-button">
                <CustomButton
                    
                    className={buttonClassName}
                    text={isConnected ? "Disconnect" : "Connect Wallet"}
                    onClick={isConnected ? disconnectWallet : connectWallet}
                />
            </div>
        </nav>
    )
}