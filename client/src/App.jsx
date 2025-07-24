import { BrowserRouter , Route, Routes } from "react-router-dom";



import Home from "./Pages/Home";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import About from "./Pages/About";
import Listing from "./Pages/Listing";
import Profile from "./Pages/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./Pages/CreateListing";
import UpdateListing from "./Pages/updateListing";


function App(){
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/sign-in" element={<SignIn />}/>
        <Route path="/sign-up" element={<SignUp />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route element ={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/create-listing" element={<CreateListing />}/>
            <Route path="/update-listing/:listingId"  element={<UpdateListing />}/>
        </Route>
      </Routes>
    </BrowserRouter>
    
  );
}

// we define the profile page as private route so that if the user is logged in then only he can able to see it
export default App;