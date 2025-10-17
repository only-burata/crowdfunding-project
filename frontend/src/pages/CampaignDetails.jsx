import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useStateContext } from '../context'
import {ProgressBar} from "../components"
import Modal from '../components/Modal'

export default function CampaignDetails() {
    const {address} = useParams()
    const [campaignData, setCampaignData] = useState(null)
    const [funders, setFunders] = useState(null)
    const [pageLoading, setPageLoading] = useState(true)
    const [modalOn, setModalOn] = useState(false)
    
    const {getCampaignData, getSendersAndAmountFunded, isLoading } = useStateContext()

    useEffect(() => {
        console.log("start")
        async function fetchCampaignDetails() {
            if(isLoading){
                return
            }
            try{
                const data = await getCampaignData(address)
                const funders = await getSendersAndAmountFunded(address)
                setFunders(funders)
                setCampaignData(data)
                console.log(data, "data")
            }
            catch(err){
                console.error("error fetching Campaigns", err)
            }
        }
        setPageLoading(true)
        fetchCampaignDetails()
        setPageLoading(false)
    }, [isLoading])


    if(pageLoading){
        return(
            <div>Loading</div>
        )
    }
    if(!pageLoading && campaignData !== null){
        const {imgUrl, title, state, startTime, description, balance, goal, daysLeft} = campaignData
        const color = state === "Active" ?  "#0387e6" : state ==="Successful" ?  "green": "rgb(252, 71, 65)"
        const backgroundColor = state === "Active" ?  "#93d1fdff" :( state ==="Successful" )?  "rgb(122, 233, 122)": "rgb(252, 169, 169)"
        const fontColor = "#5c5b5b"
        function returnBackersString(){
            const backers = Object.keys(funders).length
            if(backers === 0){return "No backers yet"}
            else{
                return backers === 1 ? "1 Backer" : `${backers} Backers`
            }
        }
        function returnDaysLeftString(){
            
            if(daysLeft === 0){return "Ended"}
            else{
                return daysLeft === 1 ? "1 day left" : `${daysLeft} days left`
            }
        }

        function openModal(){
            setModalOn(true)
            document.body.classList.add('no-scroll')
        }
        function closeModal(){
            document.body.classList.remove('no-scroll')
            setModalOn(false)
        }
        return(
            <div className='campaign-details-page'>
                <div style={{fontSize: "19px", padding: "10px", color: `${color}`}}>
                    <h1 style={{margin: "30px"}}>Campaign Overview</h1>
                </div>
                <div className='campaign-details'>
                    <div className='campaign-image-container'>
                        <img src={imgUrl} alt="" />
                    </div>
                    <div className='details'>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div>
                                <h2 style={{margin: "0px"}}>{title}</h2>
                            </div>
                            <div style={{backgroundColor:  `${backgroundColor}`, height: "30px", display: "flex", alignItems: "center", padding: "0px 18px", borderRadius: "30px", marginBottom: "0px"}}>
                                <h4 style={{color: `${color}`}}>{state}</h4>
                            </div>
                        </div>
                        <p style={{marginTop: "5px", marginBottom: "30px", fontSize: "14px", color: `${fontColor}`}}>
                            Date created: {startTime.toLocaleDateString()}
                        </p>
                        <div style={{color: `${fontColor}`}}>
                            {description}
                        </div>
                        <div>
                            <div style={{display: "flex", justifyContent: 'space-between'}}>
                                <h4 style={{color: "#3f3e3eff", marginBottom: "5px"}}>Raised: {balance} ETH</h4>
                                <h4 style={{color: "#3f3e3eff", marginBottom: "5px"}}>Goal: {goal} ETH</h4>
                            </div>
                            <ProgressBar
                                goal={goal}
                                raised={balance}
                            />
                        </div>
                        <div style={{display: "flex", justifyContent: "space-between", color: "#3f3e3eff"}}>
                            <h4 style={{marginTop: "10px"}}>{returnBackersString()}</h4>
                            <h4 style={{marginTop: "10px", color: "rgb(252, 71, 65)"}}>{returnDaysLeftString()}</h4>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <button 
                            style={{flex: "1", padding: "17px"}}
                            disabled={state !== "Active"}
                            onClick={openModal}
                            >
                                <strong>{state === "Active" ?"Back this Campaign": "Ended"}</strong>
                            </button>
                        </div>
                    </div>
                </div>
                {modalOn && <Modal
                    closeModal={closeModal}
                    campaign={campaignData}                
                />}
            </div>
        )
    }
}
/**
 * 
address
: 
"0xa16e02e87b7454126e5e10d957a927a7f5b5d2be"
balance
: 
"2055.5"
daysLeft
: 
5
description
: 
"This platform is maintained for free by people out of the goodness of the heart. Please donate to help us support them"
durationIndays
: 
7n
goal
: 
"2000.0"
imgUrl
: 
"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAA
owner
: 
"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
startTime
: 
Sun Oct 12 2025 09:48:14 GMT+0100 (West Africa Standard Time) {}
state
: 
"Successful"
title
: 
"Open source support"
 */
