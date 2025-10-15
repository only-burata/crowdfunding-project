import React from 'react'
import ProgressBar from './ProgressBar'
import clsx from 'clsx'
import { NavLink } from 'react-router-dom'
export default function CampaignList({goal, balance, daysLeft, title, state, address}) {
    let status = ""
    if(state === "Active"){
        status = daysLeft === 1 ?   "1 day left" :`${daysLeft} days left`
    }else{
        status = state === "Successful" ? "Successful": "Failed"
    }
    
    const navLinkStyles = () =>({
        textDecoration : "none",
        color: "black"

    })
    const color = state === "Active" ?  "#0387e6" : state ==="Successful" ?  "green": "rgb(252, 71, 65)"
    const backgroundColor = state === "Active" ?  "#93d1fdff" : state ==="Successful" ?  "rgb(122, 233, 122)": "rgb(252, 169, 169)"
    return (
        <div className='campaign-list'>
            <NavLink style={navLinkStyles} to={`/${address}`}><h4>{title}</h4></NavLink>
            <div style={{flex: "0.8"}}>
                <ProgressBar
                    goal={goal}
                    raised={balance}
                />
                <div style={{display: "flex", justifyContent: 'space-between'}}>
                    <p style={{marginBlock: "0", fontSize: "12px", color: "#5c5b5b"}}>Raised: {balance} ETH</p>
                    <p style={{marginBlock: "0", fontSize: "12px", color: "#5c5b5b"}}>Goal:  {goal} ETH</p>
                </div>
            </div>
            <div style={{backgroundColor:  `${backgroundColor}`, height: "30px", display: "flex", alignItems: "center", padding: "0px 18px", borderRadius: "30px"}}>
                <p style={{fontWeight: "560", color: `${color}`}}>{status}</p>
            </div>
        </div>
    )
}
