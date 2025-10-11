import { getBarPercentage } from "../utils"
export default function ProgressBar({goal, raised}) {
    const width = getBarPercentage(goal, raised )
   
    const style = {
        width: width < 100 ? `${width}%`: "100%" ,
        backgroundColor: "#0387e6",
        height: "100%",
        borderTopLeftRadius: "20px",
        borderBottomLeftRadius: "20px",
        borderTopRightRadius: width >= goal ? "20px" : "0px",
        borderBottomRightRadius: width >= goal ? "20px" : "0px",
    }
    return (
        <div className="progress-bar">
            <div className="progress-fill" style={style}>

            </div>
        </div>
    )
}
