import { useContext, createContext, useEffect } from "react";
import { useState } from "react";
import { ethers } from "ethers";
import { CampaignManager_ABI, Campaign_ABI } from "../../ABIs";


const StateContext = createContext()
const managerAddress = "0x8Bb4E0B03B15c361B82D792F2C2cdc703EeC7f0e"
export function StateContextProvider({children}){
    const [account, setAccount] = useState('')
    const [managerContract, setManagerContract] = useState(null)

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
                setManagerContract
            }}         
        >
            {children}
        </StateContext.Provider >
    )
    
}

export function useStateContext(){
    return useContext(StateContext)
}