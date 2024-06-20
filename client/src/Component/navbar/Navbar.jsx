import React from 'react'
import { useContext } from 'react';
import { AuthContext } from"../../Context/AuthContext";
import { ConfidentialiteContext } from '../../Context/ConfidentialiteContext';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import "./navbar.css";

export default function Navbar(props) {
    const { token,settoken } = useContext(AuthContext);
    const { confidentialite,setconfidentialite } = useContext(ConfidentialiteContext);
    const [pseudo, setpseudo] = useState("");
    const [admin, setadmin] = useState(false);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

     const adminOuNon = async ()=>{
        await axios.get("/admin",config)
        .then((res)=>{
          if(res.data != 'admin'){
            return setadmin(false);
            
          }
          setadmin(true);
        })
        .catch((err)=>(setadmin(false)))
      }

    useEffect(() => {
        adminOuNon();

    }, [props.test])
    

    useEffect(() => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if(token){
        axios.get("/user/recupPseudo",config)
        .then((res)=>setpseudo(res.data))
        .catch((err)=>console.log(err));
      }      
      if(!token){
        return;
      }
    }, [token])
    
    if(token) {
      return(
        <nav className='navbar'>
          <Link className='premierLink' to={"/"}>Accueil </Link>
          <Link className='deuxiemeLink' to={"/forum"}>forum </Link>
          <Link className='troisiemeLink' onClick={()=>{
            localStorage.removeItem("token");
            localStorage.removeItem("confidentialite");
            setconfidentialite("");
            settoken("");
            setadmin(false);
            props.settest(false);
        }} to={"/#/connexion"}>Deconnexion </Link>
          {admin===true? <Link className='quatriemeLink' to={"/admin"}>admin </Link> : ""}
          <p id='pseudoNavbar'>{pseudo}</p>
        </nav>
     )
    }if(!token){
      return(
        <nav className='navbar'>
          <Link className='premierLink' to={"/"}>Accueil </Link>
          <Link className='deuxiemeLink'  to={"/forum"}>forum </Link>
          <Link className='troisiemeLink'  to={"/connexion"}>Connexion </Link>
          <Link className='quatriemeLink'  to={"/inscription"}>Inscription </Link>
        
        </nav>
     )
    }
      
  }
