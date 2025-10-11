import { Navbar } from "./components"
import { StateContextProvider } from "./context"
import { CreateCampaign, Explore, Home, MyContributions, MyCampaigns, UserDashboard } from "./pages"
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"

export default function App () {
    return(
       <StateContextProvider>
            <Router>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/create-campaign" element={<CreateCampaign/>}/>
                    <Route path="/user-dashboard" element={<UserDashboard/>}>
                        <Route path="/user-dashboard/" element={<MyCampaigns/>}/>
                        <Route path="/user-dashboard/my-contributions" element={<MyContributions/>}/>
                    </Route>
                    <Route path="/explore" element={<Explore/>}/>
                </Routes>
                
            </Router>
       </StateContextProvider>
    )
}