import { useState } from "react"
import { CustomButton } from "../components"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useStateContext } from "../context"
export default function UserDashboard() {
    const {account} = useStateContext()
    const navLinkStyles = ({isActive}) => {
        return {
            textDecoration: "none",
            color: isActive ? "#0387e6": "black"
        }
    }
  

    return(
        <div className="user-dashboard-page">
            <div className="side-bar">
                <NavLink style={navLinkStyles} to="">My campaigns</NavLink>
                <NavLink style={navLinkStyles} to="my-contributions">My Donations</NavLink>
            </div>
            {account ? <Outlet/> : (
                <div>
                    please connect Wallet to view campaigns
                </div>
            )}
        </div>
    )
}