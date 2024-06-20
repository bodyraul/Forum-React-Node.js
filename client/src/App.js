import React from 'react'
import {BrowserRouter,HashRouter,Routes,Route} from "react-router-dom";
import Accueil from './pages/Accueil/Accueil';
import Admin from './pages/Admin/Admin';
import Connexion from "./pages/Connexion/Connexion"
import Inscription from './pages/Inscription/Inscription';
import Navbar from './Component/navbar/Navbar';
import { AuthContext } from './Context/AuthContext';
import { ConfidentialiteContext } from './Context/ConfidentialiteContext';
import { useState } from 'react';
import SignalementMessage from './pages/Admin/SignalementMessage';
import SignalementPost from './pages/Admin/SignalementPost';
import DetailsSignalementPost from './pages/Admin/DetailsSignalementPost';
import DetailsSignalementMsg from './pages/Admin/DetailsSignalementMsg';
import AccueilForum from './pages/forum/AccueilForum';
import MessagePost from '../src/pages/messagePost/MessagesDesPost';
import Contact from './pages/contact/Contact';
import Confidentialite from './pages/confidentialite/Confidentialite';




export default function App() {

  const initToken = localStorage.getItem("token")?localStorage.getItem("token"):"";
  const initConfidentialite = localStorage.getItem("confidentialite")?localStorage.getItem("confidentialite"):"";
  const [token, settoken] = useState(initToken);
  const [confidentialite, setconfidentialite] = useState(initConfidentialite);
  const [test, settest] = useState(false);
 console.log(confidentialite);
 
  return (
    <body >
        
        <HashRouter hashType="hashbang">
            <AuthContext.Provider value={{token,settoken}} >
            <ConfidentialiteContext.Provider value={{confidentialite,setconfidentialite}} >
            <Navbar test={test} settest={settest}/> 
            <Routes>
                <Route path="/"  element={<Accueil/>} />
                <Route path="/confidentialite"  element={<Confidentialite/>} />
                <Route path="/inscription" element={<Inscription/>} />
                <Route path="/connexion" element={<Connexion settest={settest} />} />
                <Route path="/forum" element={<AccueilForum/>} />
                <Route path="/forum/messagePost/:id" element={<MessagePost/>} />
                <Route path="/admin" element={<Admin/>} />
                <Route path="/admin/signalementMessage" element={<SignalementMessage/>} />
                <Route path="/admin/signalementPost" element={<SignalementPost/>} />
                <Route path="/admin/signalementPost/details/:id" element={<DetailsSignalementPost/>} />
                <Route path="/admin/signalementMessage/details/:id" element={<DetailsSignalementMsg/>} />
            </Routes>
            </ConfidentialiteContext.Provider>
            </AuthContext.Provider>
        </HashRouter>
    </body>
  )
}

