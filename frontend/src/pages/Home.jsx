import { CustomButton } from "../components";

export default function Home() {
    return (
        <div style={{marginTop: "0px"}}>
           <div className="main-area">
                <h1 style={{marginBottom: "0px"}}>Decentralized Crowdfunding</h1>
                <h1 style={{marginTop: "0px", marginBottom: "10px"}}>Powered by Ethereum</h1>
                <p>Support campaigns in a trusted and secure way. Fund projects that matter</p>
                <CustomButton
                    text='Create new campaign'
                />
           </div>
           <div className="featured-campaigns">
             your papa
           </div>
          
        </div>
    )
}