import { useContext, createContext, useEffect } from "react";
import { useState } from "react";
import { ethers } from "ethers";
import { CampaignManager_ABI, Campaign_ABI } from "../../ABIs";
import { getDaysLeft } from "../utils";


const StateContext = createContext()
export function StateContextProvider({children}){
    const managerAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    const [account, setAccount] = useState('')
    // const [provider, setProvider] = useState(null)
    const [managerContract, setManagerContract] = useState(null)
    const [campaignObject, setCampaignObject] = useState(null)
    const [nonce, setNonce] = useState(0)

    useEffect(() => {        
        getCampaigns()
            .then((campaignsObj) => setCampaignObject(campaignsObj))
    },[nonce])

    async function connectWallet(){
        try{
            if(window.ethereum){
                const accounts = await window.ethereum.request({method: "eth_requestAccounts"})
                const account =  accounts[0] 

                const provider = new ethers.BrowserProvider(window.ethereum)  
                const signer = await provider.getSigner()
                const contract = new ethers.Contract(managerAddress, CampaignManager_ABI, signer)

                setManagerContract(contract)
                setAccount(account) 
            }
            else{
                console.error("Please install Metamask")
            }
        }
        catch(error){
            console.log(error.message)
        }
    }

    async function createCampaign({campaignTitle, goal, campaignEndDate, description, imgUrl }) {
        if(!managerContract){
            console.error("Contract not initialized, connect wallet")
            return
        }
        setNonce(nonce => nonce + 1)
        const durationInDays = Math.ceil((new Date(campaignEndDate) - Date.now()) / (1000 *60 *60 *24))
        const formattedGoal = ethers.parseEther(goal)

        try{
            const tx = await managerContract.createCampaign(
                campaignTitle, 
                formattedGoal, 
                durationInDays, 
                imgUrl, 
                description
            )
            await tx.wait()
            console.log(`Campaign created successfully ... tx hash: ${tx.hash}`)            
        }
        catch(err) {
            console.error("Error creating campaign:", err)
        }
    }

    async function getCampaigns(){
        console.log("Getting campaigns")
        const campaignObj = {}
        try { 
            if(managerContract){
                const campaignCreators = await managerContract.getCampaignCreators()
                if (campaignCreators.length === 0){
                    console.log("No campaign created yet")
                    return
                }
                for(let i = 0; i < campaignCreators.length; i++){
                    let campaignCreator = campaignCreators[i].toLowerCase()
                    const userCampaignCount = await managerContract.getUserCampaignCount(campaignCreator)
                    const userCampaignAddresses = [] 
                    for(let j = 0; j < userCampaignCount; j++){
                        const campaignAddress = (await managerContract.getCampaignAddress(campaignCreator, j + 1)).toLowerCase()
                        userCampaignAddresses.push(campaignAddress)
                    }
                    campaignObj[campaignCreator] = userCampaignAddresses
        
                }
            }
            else{
                const provider = new ethers.BrowserProvider(window.ethereum)
                const contract = new ethers.Contract(managerAddress, CampaignManager_ABI, provider)
                const campaignCreators = await contract.getCampaignCreators()
                if (campaignCreators.length === 0){
                    console.log("No campaign created yet")
                    return
                }
                for(let i = 0; i < campaignCreators.length; i++){
                    let campaignCreator = campaignCreators[i].toLowerCase()
                    const userCampaignCount = await contract.getUserCampaignCount(campaignCreator)
                    const userCampaignAddresses = [] 
                    for(let j = 0; j < userCampaignCount; j++){
                        const campaignAddress = (await contract.getCampaignAddress(campaignCreator, j + 1)).toLowerCase()
                        userCampaignAddresses.push(campaignAddress)
                    }
                    campaignObj[campaignCreator] = userCampaignAddresses
        
                }
            }
            console.log(campaignObj)
            return(campaignObj)
        }
        catch(err) {
            console.error("error fetching campaigns---", err)
        }
    }
    async function getCampaignData(campaignAddress){
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()       
        const campaign = new ethers.Contract(campaignAddress, Campaign_ABI, signer)
        const balance = await campaign.getBalance()
        const data = await campaign.details()
        const formattedData = {
            address: campaignAddress,
            owner: data.owner,
            title: data.title,
            goal: ethers.formatEther(data.goal),
            durationIndays: data.durationIndays,
            imgUrl: data.imgUrl,
            description: data.description,
            startTime: new Date(Number(data.startTime)*1000),
            daysLeft : getDaysLeft({
                startDate: Number(data.startTime)*1000, 
                durationIndays: Number(data.durationIndays)
            }),
            balance: ethers.formatEther(balance)
        }
        /**
         *  owner: i_owner,
            title: _title,
            goal: _goal,
            durationIndays: _durationIndays,
            imgUrl: _imgUrl,
            description: _description,
            startTime: i_startTime
         */
        return(formattedData)
    }

    async function fundCampaign(campaignAddress, amount) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const campaign = new ethers.Contract(campaignAddress, Campaign_ABI, signer)
        const tx = await campaign.donateFunds({value: ethers.parseEther(amount)})
        await tx.wait()
        return tx
    }

    function disconnectWallet() {
        setAccount('')
        alert("Wallet disconnected")
    }
    
    return (
        <StateContext.Provider 
            value={{
                account,
                setAccount,
                connectWallet,
                disconnectWallet,
                createCampaign,
                managerContract,
                setManagerContract,
                getCampaigns,
                campaignObject,
                getCampaignData,
                fundCampaign
            }}         
        >
            {children}
        </StateContext.Provider >
    )    
}

export function useStateContext(){
    return useContext(StateContext)
}