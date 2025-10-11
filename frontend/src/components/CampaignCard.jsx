import CustomButton from "./CustomButton";
import ProgressBar from "./ProgressBar";

export default function CampaignCard(props) {
    return(
        <div className="campaign-card-container">
            <div className="picture-container">
                <img className="campaign-image"src={props.imgUrl} alt="" />
            </div>
            <div style={{width: "100%", marginBottom: "0px"}}>
                <h3 style={{marginBottom: "7px", fontSize: '23px'}}>{props.title}</h3>
                <p style={{fontSize: "15px", marginTop: "0", color: "#686666ff", overflow: "hidden", height: "39px"}}>{props.description}</p>
            </div>
            <div style={{width: "100%", marginBottom: "0"}}>
                <div className="progress-bar-container">
                    <p style={{margin: "0", marginBottom: "5px", fontSize: "12px", color: "#686666ff"}}>Progress:</p>
                    <ProgressBar
                        goal={props.goal}
                        raised={props.balance}
                    />
                </div>
                <div style={{display: "flex", width: "100%", justifyContent: "space-between"}}>
                    <p style={{margin: "0", fontSize: "12px"}}>Raised: {props.balance} ETH</p>
                    <p style={{margin: "0", fontSize: "12px"}}>Goal: {props.goal} ETH</p>
                </div>
            </div>
            <div style={{width: "100%", margin: "0"}}>
                <h4 style={{color: "#fd3d3dff"}}>
                    {props.daysLeft} days left
                </h4>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", width: "100%", gap: "10px", marginTop: "0"}}>
                <CustomButton
                    style={{flex: "1"}}
                    className={'back-campaign-button'}
                    text={'Back campaign'}
                    onClick={props.onClick}
                />
                <CustomButton
                    className={'view-button'}
                    style={{flex: "0.5"}}
                    text={'View'}
                />
            </div>
        </div>
    )
}