import { Navbar } from "./components"
import { StateContextProvider } from "./context"
import { CreateCampaign, Explore, Home, MyDonations, MyCampaigns, UserDashboard, CampaignDetails } from "./pages"
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"

export default function App () {
    return(
       <StateContextProvider>
            <Router>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/:address" element={<CampaignDetails/>}/>
                    <Route path="/create-campaign" element={<CreateCampaign/>}/>
                    <Route path="/user-dashboard" element={<UserDashboard/>}>
                        <Route path="/user-dashboard/my-campaigns" element={<MyCampaigns/>}/>
                        <Route path="/user-dashboard/my-donations" element={<MyDonations/>}/>
                    </Route>
                    <Route path="/explore" element={<Explore/>}/>
                </Routes>
                
            </Router>
       </StateContextProvider>
    )
}