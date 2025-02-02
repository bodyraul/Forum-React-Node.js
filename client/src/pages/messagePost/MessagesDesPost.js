import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import "../messagePost/messageDesPost.css"
import likeNoir from"../../photo/likeNoir.svg";
import likeVert from"../../photo/likeVert.svg";
import signaler from"../../photo/signaler.svg";
import signalerRouge from"../../photo/signalerRouge.svg";
import Contact from"../contact/Contact"

export default function MessagesPost() {
  const {id} = useParams();
  const {token,settoken}  = useContext(AuthContext);
  const [errMsgCreationMsg, seterrMsgCreationMsg] = useState("");
  const [valueMsgForm, setvalueMsgForm] = useState("");
  const [post, setpost] = useState({});
  const [allMsg, setallMsg] = useState([]);
  const [tailleAllMsg, settailleAllMsg] = useState(false);
  const [messageServer, setmessageServer] = useState("");
  const [listeSignalementUser, setlisteSignalementUser] = useState([]);
  const [listeLikeUser, setlisteLikeUser] = useState([]);
  const  [nbLikes, setnbLikes] = useState(0);
  const [arriverListeSignalement, setarriverListeSignalement] = useState(false);


  // requete qui permet de créér un message et d'actualiser l'affichage
  const validerMsgForm =async()=>{
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if(!token){
      return seterrMsgCreationMsg("Vous devez être connecté pour écrire un message.");
    }
    if(valueMsgForm.length===0){
      return seterrMsgCreationMsg("le message ne peut pas être vide");
    }
    if(valueMsgForm.length>1000){
      return seterrMsgCreationMsg("le message ne peut pas dépasser 1000 caractères");
    }

    const newMessage={};
    newMessage.contenu=valueMsgForm;

    await axios.post(`/message/creerMessage/${id}`,newMessage,config)
    .then((res)=>console.log(res))
    .catch((err)=>console.log(err));

    await axios.get(`/message/afficherMesMessages/${id}`,config)
    .then((res)=>{
      setallMsg(res.data);
      console.log(res.data);
    })
    .catch((err)=>console.log(err));

    seterrMsgCreationMsg("message Créé.");
    setvalueMsgForm("");
  }


  //affichage des messages au chargement , du post et des signalements de l'user pour les msg du post
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    async function messages(){
      await  axios.get(`/message/afficherMesMessages/${id}`,config)
      .then((res)=>{
        setallMsg(res.data);
      })
      .catch((err)=>setmessageServer(err.response.data));
    }

    async function monPoste(){
      await  axios.get(`/post/monPoste/${id}`,config)
      .then((res)=>setpost(res.data))
      .catch((err)=>console.log(err));
    }

    async function signalements (){
      await  axios.get(`/signalement/AfficherMessageSignalerParPost/${id}`,config)
      .then((res)=>{
        setlisteSignalementUser(res.data);
        console.log(res.data) ;
      })
      .catch((err)=>console.log(err));
    }

    async function like (){
      await  axios.get(`/like/AfficherMessageLikerParPost/${id}`,config)
      .then((res)=>{
        console.log(res);
        setlisteLikeUser(res.data);
      })
      .catch((err)=>console.log(err));
    }

    messages();
    monPoste();
    signalements();
    like();

  }, [])


 // permet de savoir au chargement combien de messages on a et d'afficher "aucun message" s'il n'y en a pas
  useEffect(() => {
    if(allMsg.length===0){
      return settailleAllMsg(false);
  
    }
    if(allMsg.length>0){
      return settailleAllMsg(true);
    }

  }, [allMsg])

  // on compare ici les id message de la liste message avec l'id message des signalements message de l'utilisateur
  // pour voir les messages qu'il a signalé
 const messageSignals = (idMsg) =>{
    for(var k=0;k<= listeSignalementUser.length-1;k++){
       if(listeSignalementUser[k].idMessage == idMsg){
         return (
          <div className='signalement'>
            <p>Message signalé</p>
            <img onClick={()=>supSignalementMessage(idMsg)} src={signalerRouge}></img>
          </div>
         )
       }
    }
    return (
      <div className='signalement'>
        <p>Signalé message</p>
        <img onClick={()=>signalerMessage(idMsg)} src={signaler}></img>
      </div>
     )
 }

  
 // requete qui permet de signaler un message
 const   signalerMessage = async (idMsg) => {

   const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const signal ={};
    signal.nom="oui";

    await axios.post(`/signalement/signalementMessage/${idMsg}`,signal,config)
      .then((res)=>{
       
      })
      .catch((err)=>console.log(err));
      
    await  axios.get(`/signalement/AfficherMessageSignalerParPost/${id}`,config)
    .then((res)=>{
      setlisteSignalementUser(res.data);
    })
    .catch((err)=>console.log(err));
  
 }

 // requete qui permet de supprimer le  signalement d'un message
 const supSignalementMessage = async (idMsg) => {

  const config = {
     headers: {
       Authorization: `Bearer ${token}`,
     },
   };


   await axios.delete(`/signalement/signalementMessage/${idMsg}`,config)
     .then((res)=>{
      
     })
     .catch((err)=>console.log(err));
     
   await  axios.get(`/signalement/AfficherMessageSignalerParPost/${id}`,config)
   .then((res)=>{
     setlisteSignalementUser(res.data);
   })
   .catch((err)=>console.log(err));
 
}

   // on compare ici les id message de la liste message avec l'id message des  message likés de l'utilisateur
  // pour voir les messages qu'il a liké
  const messageLike = (idMsg,nblike) =>{
    if(listeLikeUser.length === 0){
      return (
        <div className='like'>
          <img onClick={()=>creerLike(idMsg)} src={likeNoir}></img>
        </div>
      )
    }
    for(var k=0;k<= listeLikeUser.length-1;k++){
      if(listeLikeUser[k].idMessage == idMsg){
        return (
          <div className='like'>
            <img onClick={()=>suppLike(idMsg)} src={likeVert}></img>
          </div>
        )
      }
  }
  return (
      <div className='like'>
        <img onClick={()=>creerLike(idMsg)} src={likeNoir}></img>
      </div>
    )

 }


 //permet de créer un like
const creerLike = async(idMsg)=>{

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const like= {
    nom:"oui",
  };

  await axios.post(`/like/creerLike/${idMsg}`,like,config)
  .then((res)=>console.log(res))
  .catch((err)=>console.log(err));
  
  await  axios.get(`/like/AfficherMessageLikerParPost/${id}`,config)
      .then((res)=>{
        console.log(res);
        setlisteLikeUser(res.data);
      })
      .catch((err)=>console.log(err));

  await axios.get(`/message/afficherMesMessages/${id}`,config)
    .then((res)=>{
      setallMsg(res.data);
      console.log(res.data);
    })
    .catch((err)=>console.log(err));
}

//permet de supprimer un like
const suppLike = async (idMsg)=>{
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  await axios.delete(`/like/supprimerLike/${idMsg}`,config)
    .then((res)=>console.log(res))
    .catch((err)=>console.log(err));

  await  axios.get(`/like/AfficherMessageLikerParPost/${id}`,config)
      .then((res)=>{
        console.log(res);
        setlisteLikeUser(res.data);
      })
      .catch((err)=>console.log(err));
  
  await axios.get(`/message/afficherMesMessages/${id}`,config)
    .then((res)=>{
      setallMsg(res.data);
      console.log(res.data);
    })
    .catch((err)=>console.log(err));
  }

  return (
    <div>
        <div className='presentationPost'>
            <p>
                {post.titre}
            </p>
            <p>
                {post.categorie}
            </p>
            <p>
              
            </p>
        </div>
        {tailleAllMsg === false ? <p className='messageServer'>{messageServer}</p> 
        : 
        allMsg.map((message)=>{
          return (
            <div key={message._id} className='allMsgDuPost'>
              <div className='enteteMsgDuPost'>
                  <p>
                      {message.pseudoCreateurMessage}
                  </p>
                  <p>
                      {message.dateCreation} à {message.heureCreation}
                  </p>
              </div>
              <div className='contenuMsgDuPost'>
                      {message.contenu}
              </div>
              <div className='partieBtnAffichageMsg'>
                  <div className='like'>
                    <p>{message.nbLike}</p>
                    {messageLike(message._id)}
                  </div>
                 
                  
                  {messageSignals(message._id)}
                  
              </div>
              <div className='finDuMsg'>
           
              </div>
          </div>
          )
        })}
        <div className='creationMsgDuPost'>
            <p>
                message
            </p>
            <p>
                <textarea  value={valueMsgForm} onChange={(e)=>setvalueMsgForm(e.target.value)} className='ecrireMsgDuPost'></textarea>
            </p>
            <p>
                {errMsgCreationMsg}
            </p>
            <button onClick={validerMsgForm} className='validerBtnMsgDuPost'>valider</button>
        </div>
        <Contact/>
    </div>
  )
}
