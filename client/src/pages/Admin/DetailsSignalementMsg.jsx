import React from 'react'
import { useParams } from "react-router-dom";
import { useState } from 'react';
import { useEffect } from 'react';
import axios from "axios";
import { useContext } from 'react';
import {AuthContext} from "../../Context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import"./admin.css"

export default function DetailsSignalementMsg() {
  const { token,settoken } = useContext(AuthContext);
  const {id} = useParams();
  const [signalement, setsignalement] = useState("");
  const [nbsignalement, setnbsignalement] = useState("");
  const [msgErreur, setmsgErreur] = useState("");
  const [btnBanCocher, setbtnBanCocher] = useState(false);
  const [btnSupCOcher, setbtnSupCOcher] = useState(false);
  const [btnRasCOcher, setbtnRasCOcher] = useState(false);
  const [bntSupSignalement, setbntSupSignalement] = useState(false);
  const [reponseBanServer, setreponseBanServer] = useState("");
  const [reponseSupMsgServer, setreponseSupMsgServer] = useState("");
  const [reponseSupSignalServer, setreponseSupSignalServer] = useState("");
  const [idUser, setidUser] = useState("");
  const navigate = useNavigate();
  const refMessageErreur=useRef();
  const refBtnValider=useRef();
  const refAllCheckbox=useRef();
 
  useEffect(() => {
     const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const fonction1 =async ()=>{
      axios.get(`/signalement/afficherMsgSignaler/${id}`,config)
      .then((res)=>{
        setsignalement(res.data);
        setidUser(res.data.idUser);
      })
      .catch((err)=>console.log(err));
    }

    const fonction2 =async ()=>{
      axios.get(`/signalement/nbFoisMsgSignaler/${id}`,config)
      .then((res)=>{
        setnbsignalement(res.data);
      })
      .catch((err)=>console.log(err));
    }

    fonction1();
    fonction2();
  

  }, [])


  useEffect(() => {
      const btnValider = document.getElementById("btnValider");
      if(!btnSupCOcher && !btnBanCocher && !btnRasCOcher && !bntSupSignalement){
        btnValider.disabled=true;
        return setmsgErreur(`Si vous ne voulez rien faire pour le moment cliquez sur "ne rien faire.".`);
      }
      if(btnSupCOcher && btnBanCocher && btnRasCOcher && bntSupSignalement){
        btnValider.disabled=true;
        return setmsgErreur(`vous ne pouvez pas faire les quatres manipulations simultanément.`);
      }
      if( btnRasCOcher && bntSupSignalement || btnRasCOcher && btnBanCocher || btnRasCOcher && btnSupCOcher){
        btnValider.disabled=true;
        return setmsgErreur(`vous ne pouvez pas cliquer sur "ne rien faire" et sur un autre bouton en même temps.`);
      }
      else{
        btnValider.disabled=false;
        return setmsgErreur("");
      }
      
  }, [btnBanCocher,btnRasCOcher,btnSupCOcher,bntSupSignalement])

  
  const validerFormulaire = async()=>{
   
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const ban ={bannis:true};
    const idMessage = signalement._id;


    if(btnBanCocher && btnRasCOcher=== false){
      refMessageErreur.current.classList.add("classeInvisibleDiv");
      refBtnValider.current.classList.add("classeInvisibleDiv");
      refAllCheckbox.current.classList.add("classeInvisibleDiv");

       await axios.put(`/admin/banUser/${idUser}`,ban,config)
      .then((res)=>setreponseBanServer(res.data))
      .catch((err)=>{console.log(err)})

      await axios.delete(`/signalement/supprimerSignalementMsg/${idMessage}`,config)
      .then((res)=>setreponseSupSignalServer(res.data))
      .catch((err)=>console.log(err));
    

      await axios.delete(`/admin/deleteMsg/${idMessage}`,config)
      .then((res)=>setreponseSupMsgServer(res.data))
      .catch((err)=>console.log(err));
    }

    if(btnSupCOcher===true && (bntSupSignalement===false || bntSupSignalement===true) && btnBanCocher===false && btnRasCOcher ===false){
      refMessageErreur.current.classList.add("classeInvisibleDiv");
      refBtnValider.current.classList.add("classeInvisibleDiv");
      refAllCheckbox.current.classList.add("classeInvisibleDiv");

      axios.delete(`/signalement/supprimerSignalementMsg/${idMessage}`,config)
      .then((res)=>setreponseSupSignalServer(res.data))
      .catch((err)=>console.log(err));

      await axios.delete(`/admin/deleteMsg/${idMessage}`,config)
      .then((res)=>setreponseSupMsgServer(res.data))
      .catch((err)=>console.log(err));
      console.log("sup message + signalement");
   }
 
  if(btnRasCOcher==false && btnBanCocher ===false && btnSupCOcher ===false && bntSupSignalement){
    refMessageErreur.current.classList.add("classeInvisibleDiv");
    refBtnValider.current.classList.add("classeInvisibleDiv");
    refAllCheckbox.current.classList.add("classeInvisibleDiv");

    await axios.delete(`/signalement/supprimerSignalementMsg/${idMessage}`,config)
    .then((res)=>setreponseSupSignalServer(res.data))
    .catch((err)=>console.log(err));
    console.log("supSignalement");

 }

 if(btnRasCOcher && btnBanCocher ===false && btnSupCOcher ===false && bntSupSignalement ===false){
    navigate("/admin/signalementMessage");
    console.log("ras");
 }
    
  }
  
 if(signalement.length === 0){
  return(
    
    <div>
      <div className='messageSignalementTraiter'>Ce signalement n'existe plus.</div>
      <button  ref={refBtnValider} className="nonvisiblebouton" onClick={validerFormulaire} id='btnValider'>valider</button>
    </div>
  )
 }
  if(signalement.length != 0){
    return(
      <div>
       <div className='gererLesSignalementsPageAdmin'>
          <p>
            <span>Message créer par {signalement.nomCreateurMessage} {signalement.prenomCreateurMessage} (pseudo : {signalement.pseudoCreateurMessage}) </span>
            <span>nombre de signalements : {nbsignalement}</span>
          </p>
          <p>contenu : {signalement.contenu} </p>
          <p ref={refAllCheckbox} className='checkboxChoixAdminPage'>
            <label htmlFor="">bannir utilisateur </label>
            <input onChange={()=>setbtnBanCocher(!btnBanCocher)} id="ban" type="checkbox"/>

            <label htmlFor="">supprimer message </label>
            <input onChange={()=>setbtnSupCOcher(!btnSupCOcher)}   id="sup" type="checkbox"/>

            <label htmlFor="">supprimer les signalements </label>
            <input onChange={()=>setbntSupSignalement(!bntSupSignalement)}   id="rien" type="checkbox"/>

            <label htmlFor="">ne rien faire </label>
            <input onChange={()=>setbtnRasCOcher(!btnRasCOcher)}   id="rien" type="checkbox"/>
          </p>
          <div className='messageUtilisateurPageAdmin'>
              <p>{reponseBanServer}</p>
              <p>{reponseSupMsgServer}</p>
              <p>{reponseSupSignalServer}</p>
          </div>
          <p ref={refMessageErreur} className='messageUtilisateurPageAdmin'>
            {msgErreur}
          </p>
          <p>
            <button ref={refBtnValider} className='bouttonAdminBanSup' onClick={validerFormulaire} id='btnValider'>valider</button>
          </p>
       </div>
    </div>
    )
  }
    
  
}
