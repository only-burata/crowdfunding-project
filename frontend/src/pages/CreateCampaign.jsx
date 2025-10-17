import { useState, useContext } from "react";
import { warning } from "../assets"
import { CustomButton, FormField } from "../components"
import { useStateContext } from "../context";
import { useNavigate } from "react-router-dom";

export default function CreateCampaign() {
    const [isRequired, setIsRequired] = useState(true)
    const navigate = useNavigate()
    const {createCampaign} = useStateContext()
    const {account, managerContract} = useStateContext()
    
    async function handleSubmit(formData) {
        const formObj ={
            campaignTitle: formData.get("campaignTitle"),
            description: formData.get("description"),
            goal: formData.get("goal"),
            campaignEndDate: formData.get("campaignEndDate"),
            imgUrl: formData.get("imgUrl"),
        }
        try{
           const obj = await createCampaign(formObj)
            if(obj){
                navigate("/user-dashboard/my-campaigns")
            }
        }
        catch(err){
            console.error("Error creating Campaign", err)
        }
    }

    return(        
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h1 style={{color: "#0387e6"}}>Create a new campaign</h1>
            
           <div style={{display: "flex", justifyContent: "center", width: "100%" }}>
                <form action={handleSubmit}className="campaign-form">
                    <div>
                        <h2>Campaign details</h2>
                        <p>Fill out the form launch your new fund raising campaing!</p>
                    </div>
                    <FormField
                        required={isRequired}
                        label='Campaign Title'
                        name='campaignTitle'
                        type="text"
                        isTextArea={false}
                        placeholder='Funding my masters'
                        
                    />
                    <FormField
                        required={isRequired}
                        label='Description'
                        name='description'
                        type="text"
                        isTextArea={true}
                        placeholder={'Enter a description here'}
                    />
                    <div className="goal-and-date">
                        <FormField
                            required={isRequired}
                            className="goalDate"                            
                            label='Funding Goal (ETH)'
                            name='goal'
                            type="number"
                            isTextArea={false}
                            placeholder={'10 ETH'}
                        />
                        <FormField
                            required={isRequired}
                            className="goalDate"
                            label='Campaign End Date'
                            name='campaignEndDate'
                            type="date"
                            isTextArea={false}
                        />
                        
                    </div>
                    <FormField
                        required={isRequired}
                        label='Image'
                        name='imgUrl'
                        type="text"
                        placeholder={'Paste a url for your image here'}
                        isTextArea={false}
                    />
                    <div className="warning">
                        <img className='warning-image' src={warning} alt="warning symbol" />
                        <div className="warning-message">
                            <h3 style={{marginBlock: "0"}}>Important Note</h3>
                            <p style={{marginTop: "5px"}}>Please make sure all details are correct. Once lauched, modifications to campaign details wouldn't be possible</p>
                        </div>
                    </div>
                    <CustomButton
                        disabled={account ? false: true}
                        text={account ? "Create campaign" : "Please Connect wallet"}
                        className={'launch-campaign-button'}
                    />

                </form>
           </div>
        </div>
    )
}