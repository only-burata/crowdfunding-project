import CustomButton from "./CustomButton";
import ProgressBar from "./ProgressBar";

export default function CampaignCard({imgUrl, title, goal, balance, daysLeft, onClick, description, viewFunders, state}) {
    console.log(state)
    function returnDaysLeftString(){            
        if(daysLeft === 0){return "Ended"}
        else{
            return daysLeft === 1 ? "1 day left" : `${daysLeft} days left`
        }
    }
    return(
        <div className="campaign-card-container">
            <div className="picture-container">
                <img className="campaign-image"src={imgUrl} alt="" />
            </div>
            <div style={{padding: "20px"}}>
                <div style={{width: "100%", marginBottom: "20px"}}>
                    <h3 style={{marginBottom: "7px", fontSize: '23px'}}>{title}</h3>
                    <p style={{fontSize: "14px", marginTop: "0", color: "#686666ff", overflow: "hidden", height: "33px"}}>{description}</p>
                </div>
                <div style={{width: "100%", marginBottom: "0"}}>
                    <div className="progress-bar-container">
                        <p style={{margin: "0", marginBottom: "5px", fontSize: "12px", color: "#686666ff"}}>Progress:</p>
                        <ProgressBar
                            goal={goal}
                            raised={balance}
                            />
                    </div>
                    <div style={{display: "flex", width: "100%", justifyContent: "space-between"}}>
                        <p style={{margin: "0", fontSize: "12px"}}>Raised: {balance} ETH</p>
                        <p style={{margin: "0", fontSize: "12px"}}>Goal: {goal} ETH</p>
                    </div>
                </div>
                <div style={{width: "100%", margin: "0"}}>
                    <h4 style={{color: state === "Active" ? "#fd3d3dff": "#686666ff"}}>
                        {returnDaysLeftString()} 
                    </h4>
                </div>
                <div style={{display: "flex", justifyContent: "space-between", width: "100%", gap: "10px", marginTop: "0"}}>
                    <CustomButton
                        style={{flex: "1"}}
                        className={'back-campaign-button'}
                        text={'Back campaign'}
                        onClick={onClick}
                        disabled={state !== "Active"}
                        />
                    <CustomButton
                        className={'view-button'}
                        style={{flex: "0.5"}}
                        text={'View'}
                        onClick={viewFunders}
                        />
                </div>
            </div>
        </div>
    )
}