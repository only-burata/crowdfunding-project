import CustomButton from './CustomButton'
import { close } from '../assets'
import { useStateContext } from '../context'
import {ethers} from "ethers"



export default function Modal({closeModal, campaign, setContributed, contributed}) {
    const {fundCampaign} = useStateContext()
    const overlayStyles = {
        position: "fixed",
        top: "0",
        bottom: "0",
        left: "0",
        right: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.7)",
    }

    async function handleSubmit(data){
        const value = data.get("amount")
        console.log(campaign.address)
        const receipt = await fundCampaign(campaign.address, value)
        setContributed(contributed + 1)
        console.log(receipt)
        closeModal()
    }

    return (
        <div>
            <div className='overlay' style={overlayStyles} onClick={closeModal}>
                <form action={handleSubmit} className='modal-form' onClick={(e) => (e.stopPropagation())}>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <h2 style={{marginBottom: "0", color: "black"}}>Back this Campaign</h2>
                        <img src={close} alt="" onClick={closeModal} className='close-icon'/>
                    </div>
                    <p style={{marginTop: "12px"}}>Contribute ETH to support this campaign</p>
                    <p style={{color: "black"}}>Title: <strong>{campaign.title}</strong></p>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <p>Raised: {campaign.balance} ETH</p>
                        <p>Goal: {campaign.goal} ETH</p>
                    </div>
                    <div className="modal-input-container">
                        <label htmlFor="amount">Contribution:</label>
                        <input type="number" name="amount"  id="amount" placeholder='ETH' required={true}  />
                    </div>
                    <div style={{width: "50%", display: "flex", gap: '7px', alignItems: "center"}}>
                        <CustomButton
                            style={{margin: "0", marginTop: "20px"}}
                            className={'modal-button-contribute'}
                            text={'Contribute'}
                            // onClick={fund}
                            />      
                        <CustomButton
                            text={'Cancel'}
                            style={{margin: "0", marginTop: "20px"}}
                            className={'modal-button-close'}
                            onClick={(e) =>{
                                e.preventDefault()
                                closeModal()}}
                        />
                    </div> 

                </form>
            </div>
        
        </div>
    )
}

