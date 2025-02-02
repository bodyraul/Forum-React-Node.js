import React from 'react'
import { useParams } from "react-router-dom";
import { useState } from 'react';
import { useEffect } from 'react';
import axios from "axios";
import { useContext } from 'react';
import {AuthContext} from "../../Context/AuthContext";
import { useNavigate } from 'react-router-dom';


export default function DetailsSignalementPost() {
  const {token}  = useContext(AuthContext);
  const {id} = useParams();
  const [signalement, setsignalement] = useState("");
  const [nbsignalement, setnbsignalement] = useState("");
  const [msgErreur, setmsgErreur] = useState("");
  const [btnBanCocher, setbtnBanCocher] = useState(false);
  const [btnSupCOcher, setbtnSupCOcher] = useState(false);
  const [btnRasCOcher, setbtnRasCOcher] = useState(false);
  const [reponseBanServer, setreponseBanServer] = useState("");
  const [reponseSupMsgServer, setreponseSupMsgServer] = useState("");
  const [reponseSupSignalServer, setreponseSupSignalServer] = useState("");
  const [idUser, setidUser] = useState("");
  const navigate = useNavigate();
 
  useEffect(() => {
     const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios.get(`/signalement/afficherPostSignaler/${id}`,config)
    .then((res)=>{
      setsignalement(res.data);
      setidUser(res.data.idUser);
    })
    .catch((err)=>console.log(err));

    axios.get(`/signalement/nbFoisPostSignaler/${id}`,config)
    .then((res)=>{
      setnbsignalement(res.data);
    })
    .catch((err)=>console.log(err));

  }, [])


  useEffect(() => {
      const btnValider = document.getElementById("btnValider");
     
      if(btnSupCOcher && btnBanCocher && btnRasCOcher){
        btnValider.disabled=true;
        return setmsgErreur(`vous ne pouvez pas faire les trois manipulations simultanément.`);
      }
      if(btnBanCocher && btnRasCOcher && (btnSupCOcher=== false || btnSupCOcher=== true )){
        btnValider.disabled=true;
        return setmsgErreur(`vous ne pouvez pas cocher "bannir utilisateur" et "ne rien faire."`);
      }
      if(btnSupCOcher && btnRasCOcher && (btnBanCocher=== false || btnBanCocher=== true )){
        btnValider.disabled=true;
        return setmsgErreur(`vous ne pouvez pas cocher "supprimer Post" et "supprimer signalements car "supprimer les messages" revient à  supprimer les signalements du Post également."`);
      }
      else{
        btnValider.disabled=false;
        return setmsgErreur("");
      }
      
  }, [btnBanCocher,btnRasCOcher,btnSupCOcher])

  const validerFormulaire = async()=>{
   
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const ban ={bannis:true};
    const idPost = signalement._id;
   

    if(btnBanCocher && btnSupCOcher==false && btnRasCOcher=== false){
       axios.put(`/admin/banUser/${idUser}`,ban,config)
      .then((res)=>setreponseBanServer(res.data))
      .catch((err)=>{console.log(err)})

      setTimeout(() => {
        navigate("/admin/signalementPost");
      }, 4000);
    }

    if(btnSupCOcher && btnBanCocher==false && btnRasCOcher ===false){
      axios.delete(`/signalement/supprimerSignalementPost/${idPost}`,config)
      .then((res)=>setreponseSupSignalServer(res.data))
      .catch((err)=>console.log(err));

      await axios.delete(`/admin/deletePost/${idPost}`,config)
      .then((res)=>setreponseSupMsgServer(res.data))
      .catch((err)=>console.log(err));

      setTimeout(() => {
        navigate("/admin/signalementPost");
      }, 4000);
   }

   if(btnSupCOcher && btnBanCocher && btnRasCOcher ===false){
    await axios.put(`/admin/banUser/${idUser}`,ban,config)
    .then((res)=>setreponseBanServer(res.data))
    .catch((err)=>{console.log(err)});

    await axios.delete(`/signalement/supprimerSignalementPost/${idPost}`,config)
    .then((res)=>setreponseSupSignalServer(res.data))
    .catch((err)=>console.log(err));

    await axios.delete(`/admin/deletePost/${idPost}`,config)
    .then((res)=>setreponseSupMsgServer(res.data))
    .catch((err)=>console.log(err));
    
    setTimeout(() => {
      navigate("/admin/signalementPost");
    }, 4000);

 }
 if(btnRasCOcher && btnBanCocher ===false && btnSupCOcher ===false){
    await axios.delete(`/signalement/supprimerSignalementPost/${idPost}`,config)
    .then((res)=>setreponseSupSignalServer(res.data))
    .catch((err)=>console.log(err));

    setTimeout(() => {
      navigate("/admin/signalementPost");
    }, 5000);
 }
    
  }
  
 
  return (
    <div className='gererLesSignalementsPageAdmin'>
        <p>
          <span>Message créer par {signalement.nomCreateur} {signalement.prenomCreateur} (pseudo : {signalement.pseudoCreateur}) </span>
          <span>nombre de signalements : {nbsignalement}</span>
        </p>
        <p>titre : {signalement.titre} </p>
        <p>description : {signalement.description} </p>
        <p>
          <label htmlFor="">bannir utilisateur </label>
          <input onChange={()=>setbtnBanCocher(!btnBanCocher)} id="ban" type="checkbox"/>

          <label htmlFor="">supprimer Post </label>
          <input onChange={()=>setbtnSupCOcher(!btnSupCOcher)}   id="sup" type="checkbox"/>

          <label htmlFor="">supprimer les signalements </label>
          <input onChange={()=>setbtnRasCOcher(!btnRasCOcher)}   id="rien" type="checkbox"/>
        </p>
        <div>
            <p>{reponseBanServer}</p>
            <p>{reponseSupMsgServer}</p>
            <p>{reponseSupSignalServer}</p>
        </div>
        <p>
          {msgErreur}
        </p>
        <p>
          <button onClick={validerFormulaire} id='btnValider'>valider</button>
        </p>
    </div>
  )
}
