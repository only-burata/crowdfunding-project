import { Navbar } from "./components"
import { StateContextProvider } from "./context"
import { CreateCampaign, Explore, Home, UserDashboard } from "./pages"
import { BrowserRouter as Router, Routes, Route, useNavigate, NavLink} from "react-router-dom"

export default function App () {
    return(
       <StateContextProvider>
            <Router>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/create-campaign" element={<CreateCampaign/>}/>
                    <Route path="/user-dashboard" element={<UserDashboard/>}/>
                    <Route path="/explore" element={<Explore/>}/>
                </Routes>
                
            </Router>
       </StateContextProvider>
    )
}