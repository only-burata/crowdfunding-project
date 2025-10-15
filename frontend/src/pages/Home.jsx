import { useEffect, useState } from "react";
import { CampaignCard, CustomButton } from "../components";
import { useNavigate, Route } from "react-router-dom";
import mockData from "../mockData";
import { useStateContext } from "../context";
import { ethers } from "ethers";
import { Campaign_ABI } from "../../ABIs";
import Modal from "../components/Modal";



export default function Home() {
    const [cards, setCards] = useState(null)
    const [allCampaignAddresses, setAllCampaignAddresses] = useState([])
    const [modalOn, setModalOn] = useState(false)
    const [activeCard, setActiveCard] =useState(null)
    const navigate = useNavigate()
    const {
        campaignObject, 
        isLoading, 
        getCampaignData, 
        setIsLoading,
        transactionsPerformed
    } = useStateContext()
    useEffect(() => {
        async function getAllCampaignCards() {
            if(isLoading || !campaignObject){
                return
            }
            setIsLoading(true)
            async function getAllCampaigns(){
                const keys = Object.keys(campaignObject)
                const allCampaignAddresses = []
                for(let i = 0; i < keys.length; i++){
                    let owner = keys[i]
                    const campaignAddresses = campaignObject[owner]
                    for(let j = 0; j < campaignAddresses.length; j++){
                        allCampaignAddresses.push(campaignAddresses[j])
                    }
                }
                setAllCampaignAddresses(() => allCampaignAddresses)
                const cards = await Promise.all(
                    allCampaignAddresses.map(async (address) => {
                        const data = await getCampaignData(address)
                        return data
                    })
                )
                setCards(cards)
            }
            await getAllCampaigns()
            setIsLoading(false)
        }

        getAllCampaignCards()
        
    }, [campaignObject, transactionsPerformed])

    function closeModal(){
        document.body.classList.remove('no-scroll')
        setModalOn(false)
    }
    
    function openModal(card){
        setActiveCard(card)
        document.body.classList.add('no-scroll')
        setModalOn(true)
    }

    async function viewButtonOnClick(card){
        navigate(`/${card.address}`)
    }
  
    return (
        <div style={{marginTop: "0px"}}>
            <div className="main-area">
                <h1 style={{marginBottom: "0px"}}>Decentralized Crowdfunding</h1>
                <h1 style={{marginTop: "0px", marginBottom: "10px"}}>Powered by Ethereum</h1>
                <p>Support campaigns in a trusted and secure way. Fund projects that matter</p>
                <CustomButton
                    text='Create new campaign'
                    onClick={()=> navigate("./create-campaign")}
                />
            </div>
            {!isLoading && allCampaignAddresses.length > 0 && 
            <div className="featured-campaigns" >
                <div style={{display: "flex", justifyContent: "space-between", marginTop: '30px'}}>
                    <h2 style={{fontSize: "30px"}}>Featured campaigns</h2>
                </div>
                <div className="all-campaigns">
                    {cards.map((card) => {
                        return(
                            <CampaignCard
                                {...card}
                                onClick={() => openModal(card)}
                                viewFunders= {() => viewButtonOnClick(card)}
                            />

                        )
                    })}
                </div>
            </div>}
            {modalOn && 
                <Modal
                    closeModal={closeModal}
                    campaign={activeCard}
                    // setContributed={setContributed}
                    // contributed= {contributed}
                />
            }

          
        </div>
    )
}