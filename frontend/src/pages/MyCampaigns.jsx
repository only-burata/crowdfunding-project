import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { CampaignCard, CustomButton } from "../components"
import { useStateContext } from "../context"
import { ethers } from "ethers"
import { Campaign_ABI } from "../../ABIs"
import Modal from "../components/Modal"
import mockData from "../mockData"
export default function MyCampaigns() {
    const [isLoading, setIsLoading] = useState(false)
    const [campaignAddresses, setCampaignAddresses] = useState([])
    const [campaignCards, setCampaignCards] = useState([])
    const [activeCard, setActiveCard] = useState(null)
    const [modalOn, setModalOn] = useState(false)
    const [contributed, setContributed] = useState(0)

    const navigate = useNavigate()
    const {campaignObject, account, nonce, getCampaignData} = useStateContext()
    useEffect(() => {
        async function fetchCampaigns() {
            setIsLoading(true)
            if(campaignObject){
                if(campaignObject[account]===undefined){
                    console.log("you havent created anycampaigns yet")
                    return
                }
                const addresses = campaignObject[account]
                console.log("addresses" ,addresses)

                const cards = await Promise.all(                
                    addresses.map(async (address) => {
                        const data = await getCampaignData(address)
                        return data
                    })
                )
            
                setCampaignAddresses(() => addresses)
                setCampaignCards(cards)
            }
            console.log("finished fetching campains")
            setIsLoading(false)
        }
        fetchCampaigns()
    

    },[account, contributed])

    console.log(campaignCards)
    function closeModal(){
        document.body.classList.remove('no-scroll')
        setModalOn(false)
    }
    
    function handleCardClick(card){
        setActiveCard(card)
        document.body.classList.add('no-scroll')
        setModalOn(true)
    }

    const cardElements = campaignCards.map((card, index) => {
        return(
            <CampaignCard
                key={index}
                onClick={() => handleCardClick(card)}
                {...card}
            />

        )
    })
           
    
    if(isLoading){
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        )
    }

    if(!isLoading && campaignAddresses.length ===0){
        return(
            <div>
                <h1>You haven't created any campaigns</h1>
            </div>
        )
    }

    if(!isLoading && campaignAddresses.length > 0) {
        return(
            <>
                <div className="featured-campaigns">
                    <div className="all-campaigns">
                        {cardElements}
                        <CampaignCard {...mockData}/>
                        <CampaignCard {...mockData}/>
                        <CampaignCard {...mockData}/>
                        <CampaignCard {...mockData}/>
                        <CampaignCard {...mockData}/>
                        <CampaignCard {...mockData}/>
                        <CampaignCard {...mockData}/>
                        <CampaignCard {...mockData}/>
                        <CampaignCard {...mockData}/>
                    </div>
                </div>
                {
                modalOn && 
                <Modal
                    closeModal={closeModal}
                    campaign={activeCard}
                    setContributed={setContributed}
                    contributed= {contributed}
                />}
            </>
        )
    }
}