import { useContext, createContext, useEffect } from "react";
import { useState } from "react";
import { ethers } from "ethers";
import { CampaignManager_ABI, Campaign_ABI } from "../../ABIs";
import { getDaysLeft } from "../utils";


const StateContext = createContext()
export function StateContextProvider({children}){
    const managerAddress = "0xB585a638a387631173368B842ABB238015d9da15"
    const [account, setAccount] = useState('')
    const [managerContract, setManagerContract] = useState(null)
    const [campaignObject, setCampaignObject] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [transactionsPerformed, setTransactionsPerformed] = useState(0)
    
    
    useEffect(() => { 
        setIsLoading(true)
        getCampaigns()
            .then((campaignsObj) => {
                setCampaignObject(campaignsObj)
                setIsLoading(false)
            })
    },[transactionsPerformed])

    useEffect(() => {
        if (window.ethereum) {
            // 🔹 Listen for account changes
            function handleAccountsChanged(accounts){
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    // Optionally refresh campaigns or data for the new account
                    getCampaigns().then(setCampaignObject);
                } else {
                    // User disconnected all accounts
                    setAccount("");
                    setManagerContract(null);
                    setCampaignObject(null);
                }
            };

            function handleChainChanged(){
                window.location.reload(); 
            };

            window.ethereum.on("accountsChanged", handleAccountsChanged);
            window.ethereum.on("chainChanged", handleChainChanged);

            return () => {
                if (window.ethereum.removeListener) {
                    window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
                    window.ethereum.removeListener("chainChanged", handleChainChanged);
                }
            };
        }
    }, []);


    
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
        setTransactionsPerformed(transactionsPerformed => transactionsPerformed + 1)
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
            return tx
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
        const states = ['Active', "Successful", "Failed"]
        const provider = new ethers.BrowserProvider(window.ethereum)
        const campaign = new ethers.Contract(campaignAddress, Campaign_ABI, provider)
        const balance = await campaign.getBalance()
        const data = await campaign.details()
        const state = await campaign.getState()
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
            balance: ethers.formatEther(balance),
            state: states[Number(state)]
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
        setTransactionsPerformed(transactionsPerformed + 1)
        return tx
    }
    
    async function getSendersAndAmountFunded(campaignAddress) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const campaign = new ethers.Contract(campaignAddress, Campaign_ABI, provider)

        const senders = await campaign.getSenders()

        const obj = {}
        for(let i = 0; i < senders.length; i++){
            const amountFunded = await campaign.getContribution(senders[i])
            obj[senders[i].toLowerCase()] = ethers.formatEther(amountFunded)
        }
        console.log(obj)
        return(obj)
    }

    async function getMyContributions(){
        console.log("start")
        const allCampaignAddresses = Object.values(campaignObject).flat()
        const myContributionsArr = []
        for(let i = 0; i < allCampaignAddresses.length; i++){
            const contribution = {}
            const address = allCampaignAddresses[i]
            console.log("campaignAddress", address)
            const campaignFundingData = await getSendersAndAmountFunded(address)
            const refundClaimed = await new ethers.Contract(
                address,
                Campaign_ABI,
                new ethers.BrowserProvider(window.ethereum)
            ).checkClaimed(account)
            if(campaignFundingData[account] ){
                const {state, title} = await getCampaignData(address)
                contribution.index = i
                contribution.title = title
                contribution.address = address
                contribution.amount = campaignFundingData[account]
                contribution.state = state
                contribution.refundClaimed = refundClaimed
                myContributionsArr.push(contribution)
            }
        }

        console.log(myContributionsArr)

        return(myContributionsArr)
    }

    function disconnectWallet() {
        setAccount('')
        alert("Wallet disconnected")
    }
    
    return (
        <StateContext.Provider 
            value={{
                account,
                isLoading,
                setIsLoading,
                setAccount,
                connectWallet,
                disconnectWallet,
                createCampaign,
                managerContract,
                setManagerContract,
                getCampaigns,
                campaignObject,
                getCampaignData,
                fundCampaign,
                getSendersAndAmountFunded,
                transactionsPerformed,
                getMyContributions
            }}         
        >
            {children}
        </StateContext.Provider >
    )    
}

export function useStateContext(){
    return useContext(StateContext)
}