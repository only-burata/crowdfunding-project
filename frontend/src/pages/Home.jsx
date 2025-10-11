import { CampaignCard, CustomButton } from "../components";
import mockData from "../mockData";

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
            <div className="featured-campaigns" >
                <div style={{display: "flex", justifyContent: "space-between", marginTop: '30px'}}>
                    <h2 style={{fontSize: "30px"}}>Featured campaigns</h2>
                </div>
                <div className="all-campaigns">
                    <CampaignCard
                    {...mockData}
                    balance={Math.floor(Math.random() *100)}
                    />
                    <CampaignCard
                    {...mockData}
                    balance={Math.floor(Math.random() *100)}
                    />
                    <CampaignCard
                    {...mockData}
                    balance={Math.floor(Math.random() *100)}
                    />
                    <CampaignCard
                    {...mockData}
                    balance={Math.floor(Math.random() *100)}
                    />
                    <CampaignCard
                    {...mockData}
                    balance={Math.floor(Math.random() *100)}
                    />
                    <CampaignCard
                    {...mockData}
                    balance={Math.floor(Math.random() *100)}
                    />
                    <CampaignCard
                    {...mockData}
                    balance={Math.floor(Math.random() *100)}
                    />
                    <CampaignCard
                    {...mockData}
                    balance={Math.floor(Math.random() *100)}
                    />
                    <CampaignCard
                    {...mockData}
                    balance={Math.floor(Math.random() *100)}
                    />
                    <CampaignCard
                    {...mockData}
                    balance={Math.floor(Math.random() *100)}
                    />
                    <CampaignCard
                    {...mockData}
                    balance={Math.floor(Math.random() *100)}
                    />
                    <CampaignCard
                    {...mockData}
                    balance={Math.floor(Math.random() *100)}
                    />
                    <CampaignCard
                    {...mockData}
                    balance={100}
                    />
                </div>
            </div>
          
        </div>
    )
}