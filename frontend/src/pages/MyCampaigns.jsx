import {useEffect, useState} from 'react'
import { CampaignList } from '../components'
import { useStateContext } from '../context'
import { useNavigate } from 'react-router-dom'

export default function MyCampaigns() {
    const [myCampaigns, setMyCampaigns] = useState([])
    const [campaignDataArray, setCampaignDataArray] = useState([])
    const [pageLoading, setPageLoading] = useState(true)

    const navigate = useNavigate()
    const {campaignObject, account, getCampaignData, isLoading} = useStateContext()
    useEffect(() => {
        async function getAllCampaignsData(){
            if(isLoading) return
            setPageLoading(true)
            console.log(account, "account")
            const userCampaigns = campaignObject[account] 
            console.log("myCampaigns" ,userCampaigns)
            if(userCampaigns === undefined){
                setMyCampaigns([])
                setPageLoading(false)
                return
            }else{

                setMyCampaigns(userCampaigns)
                const dataArray = []
                for(let i = 0; i < userCampaigns.length; i ++){
                    const data = await getCampaignData(userCampaigns[i])
                    dataArray.push(data)
                }
                console.log(dataArray, "dataArray")
                setPageLoading(false)
                setCampaignDataArray(dataArray)
            }
        }
        getAllCampaignsData()
    },[campaignObject, account, isLoading])


    if(pageLoading){
        return(
            <div style={{display: "flex",alignItems: "center", justifyContent: 'center'}}>
                <h1>Loading</h1>
            </div>
        )
    }
     if(!pageLoading && myCampaigns.length === 0){
        return(
            <div style={{display: "flex", flexDirection: " column", alignItems: 'center', justifyContent: 'center', height: "calc(100vh - 150px)", gap: "10px"}}>
                <h1 style={{marginBlock: "0px"}}>No campaigns</h1>
                <p style={{width: "400px", textAlign: "center"}}>You haven't started any campaigns yet. Create a campaign and make an impact</p>
                <button onClick={() => navigate("/create-campaign")}>Create a campaign</button>
            </div>
        )
    }
    console.log(campaignDataArray[1], "address")
    return (
        <div style={{display: 'flex', flexDirection: "column", alignItems: "center"}}>
            <div style={{width: "80%", marginBlock: "50px", color: "#0387e6"}}>                
                <h1>My campaigns</h1>
            </div>
            <div className='campaigns-list-container'>
                <div className='campaigns-list-header'>
                    <h3>Campaign Title</h3>
                    <h3>Progress</h3>
                    <h3>Status</h3>
                </div>
                {campaignDataArray.map((data) =>{
                    return(
                        <CampaignList
                            {...data}
                        />
                    )
                })}
            </div>
        </div>
    )
}
