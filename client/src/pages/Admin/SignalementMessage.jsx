import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useContext } from 'react';
import {AuthContext} from "../../Context/AuthContext";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import"./admin.css"

export default function SignalementMessage() {
  const {token,settoken}  = useContext(AuthContext);
  const [allSignalMsg, setallSignalMsg] = useState([]);
  const [errorMsg, seterrorMsg] = useState("");

  const navigate = useNavigate();
  
  useEffect( () => {

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios.get("/signalement/afficherMsgSignaler",config)
    .then((res)=>{setallSignalMsg(res.data);
      
    })
    .catch((err)=>seterrorMsg(err.response.data))

  }, [])

  const redirectPageDetail = (e)=>{
    navigate(`/admin/signalementMessage/details/${e}`);
  }


  if(allSignalMsg.length!=0){
    return (
      <div>
        <p className='intitulelisteSignalementsPageAdmin'>
          <span>Pseudo </span>
          <span>Nom  </span>
          <span>Prénom  </span>
          <span>Contenu</span>
          <span></span>
        </p>
        {allSignalMsg.map((element)=>{
          return(
         
              <p className='listeSignalementsPageAdmin' key={element._id}>
                <span>{element.pseudoCreateurMessage} </span>
                <span className='spanNomContenu'> {element.nomCreateurMessage } </span>
                <span> {element.prenomCreateurMessage} </span>
                <span className='spanPrenomContenu'>{element.contenu} </span>
                <button onClick={()=>redirectPageDetail(element._id)}>detail signalement</button>
                
            </p>
     
          )
    
      })}
      </div>
    )
  }
  if(allSignalMsg.length===0)
  return (
    <p className='messageNonAdmin'>{errorMsg}</p>
  )
}
