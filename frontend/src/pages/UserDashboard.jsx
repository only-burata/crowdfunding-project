import { useState } from "react"
import { CustomButton } from "../components"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useStateContext } from "../context"
export default function UserDashboard() {
    const {account, connectWallet} = useStateContext()
    const navLinkStyles = ({isActive}) => {
        return {
            textDecoration: "none",
            color: isActive ? "#0387e6": "black"
        }
    }
  

    return(
        <div className="user-dashboard-page">
            <div className="side-bar">
                <NavLink style={navLinkStyles} to="my-campaigns">My campaigns</NavLink>
                <NavLink style={navLinkStyles} to="my-donations">My Donations</NavLink>
            </div>
            {account ? <Outlet/> : (
                <div style={{display: "flex", alignItems: 'center', justifyContent: "center", flexDirection: "column",
                height: "calc(100vh - 150px)"}}>
                    <h1 style={{width: "500px", textAlign: "center", margin: "0px"}}>

                        Wallet not connected!
                    </h1>
                    <p style={{width: "250px", textAlign: "center", color: "gray" , marginBottom: "18px"}}>Connect wallet to view your campaings and donations</p>
                    <button onClick={connectWallet}>Connect wallet</button>
                </div>
            )}
        </div>
    )
}