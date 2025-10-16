import React from 'react'
import { ethers } from 'ethers'
import { useStateContext } from '../context'
import { Campaign_ABI } from '../../ABIs'
import { NavLink } from 'react-router-dom'
export default function DonationList({title, amount, state, address, refundClaimed}) {
    async function claimRefund(address) {
        try {
            const signer = await new ethers.BrowserProvider(window.ethereum).getSigner()
            const tx = await new ethers.Contract(
                address,
                Campaign_ABI,
                signer
            ).claimRefund()
            await tx.wait()
            console.log(tx)
        }
        catch(err){
            console.error(err)
        }
    }
    
    const color = state === "Active" ?  "#0387e6" : state ==="Successful" ?  "green": "rgb(252, 71, 65)"
    const backgroundColor = state === "Active" ?  "#93d1fdff" :( state ==="Successful" )?  "rgb(122, 233, 122)": "rgb(252, 169, 169)"
    function returnedState(){
        if (state === "Failed"){
            return(
                <button disabled={refundClaimed} onClick={() => claimRefund(address)}>Claim</button>
                    
            )
        }

        return (
            <h4 style={{color: "#5c5b5b"}}>
                Not available
            </h4>
        )            
    }
    const navLinkStyles = () =>({
        textDecoration : "none",
        color: "black"

    })
        
    console.log("state now", state)
    return (
        <div className='campaign-list'>
                    
            <div style={{flex: "1", display: 'flex'}}>
                <NavLink  style={navLinkStyles}to={`/${address}`}><h4>{title}</h4></NavLink>
            </div>
            <div style={{flex: "1", display: 'flex', justifyContent: "center"}}>
                <h4 style={{fontWeight: "500"}}>{amount} ETH</h4>
            </div >
            <div style={{flex: "1", display: 'flex', justifyContent: "center"}}>
                <div style={{backgroundColor:  `${backgroundColor}`, height: "30px", display: "flex", alignItems: "center", padding: "0px 18px", borderRadius: "30px"}}>
                    <h4 style={{fontWeight: "560", color: `${color}`}}>{state}</h4>
                </div>
            </div >
            <div style={{flex: "1", display: 'flex', flexDirection: "column", alignItems: 'end'}}>
                {returnedState()}
            </div>
          
        </div>
    )
}
