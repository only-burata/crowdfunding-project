import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { ContributionList } from "../components"
import { useStateContext } from "../context"
import DonationList from "../components/DonationList"
export default function MyContributions() {
    const [contributionsArr, setContributionsArr] = useState([])
    const {getMyContributions, isLoading, campaignObject} = useStateContext()
    const [pageLoading, setPageLoading] = useState(true)
    useEffect(()=>{
        async function getAllContributions() {
            setPageLoading(true)
            if(isLoading){return}
            const contributionsArr = await getMyContributions()
            setContributionsArr(contributionsArr)
            setPageLoading(false)
        }
        getAllContributions()
    }, [campaignObject, isLoading])

    if(pageLoading){
        return(
            <div>
                Loading
            </div>
        )
    }
    if(!pageLoading && contributionsArr.length === 0){
        return(
            <div style={{display: "flex", flexDirection: " column", alignItems: 'center', justifyContent: 'center', height: "calc(100vh - 150px)"}}>
                <h1>No donations</h1>
                <p style={{width: "400px", textAlign: "center"}}>Yo haven't contributed to any campaign so far. Support causes you care about</p>
                <button onClick={() => navigate("/")}>Create a campaign</button>
            </div>
        )
    }

    if(!pageLoading && contributionsArr.length !==0){
        return (
            <div style={{display: 'flex', flexDirection: "column", alignItems: "center"}}>
                <div style={{width: "80%", marginBlock: "50px", color: "#0387e6"}}>                
                    <h1>My Donations</h1>
                </div>
                <div className='campaigns-list-container'>
    
                    <div className='campaigns-list-header'>
                        <div  style={{flex: "1", display: "flex", color: "#5c5b5b"}}>
                            <h3>Campaign</h3>
    
                        </div>
                        <div className="contributions-header-items">
                            <h3>Amount</h3>                         
                        </div>
                        <div className="contributions-header-items">
                            <h3>Campaign status</h3>                        
                        </div>
                        <div style={{flex: "1", display: "flex", flexDirection: "column", alignItems: 'end', color: "#5c5b5b"}} >
                            <h3>Refund</h3>                        
                        </div>
                    </div>
                    {contributionsArr.map((data)=>{
                        return (
                            <DonationList
                                {...data}
                            />
                        )
                    })}
                </div>
            </div>
        )
    }
}