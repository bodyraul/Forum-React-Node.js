import React from 'react'
import "../confidentialite/confidentialite.css"
import { useEffect } from 'react';


export default function Confidentialite() {
  const firstBtnNav = document.getElementsByClassName("navbar");

  useEffect(() => {
    firstBtnNav[0].style.display='none';
  }, )
  

  return (
    <div className='partieUtilisation'>
        <h1 className='titreUtilisation'>Conditions générales d'utilisation</h1>
        <p className='pUtilisation'>Notre site met à votre disposition un forum sur lequel vous pouvez créer des posts sur des sujets en lien avec le poker. Vous pourrez également créer des messages sur des posts qui vous intéressent. </p>
        <h1 className='titreUtilisation'>Acceptation des conditions générales</h1>
        <p className='pUtilisation'>Pour pouvoir utiliser notre site, vous devez accepter les conditions ci-dessous.</p>
        <h1 className='titreUtilisation'>Fonctionnement de l'inscription et de la connexion</h1>
        <p className='pUtilisation'>- Notre site propose un formulaire d'inscription</p>
        <p className='pUtilisation'>- En l'absence d'inscription il vous sera impossible de créer un post ou un message, mais également de lire les messages d'un post.</p>
        <p className='pUtilisation'>- Pour chaque connexion, il vous faudra saisir l'adresse mail et le mot de passe que vous avez saisis lors de votre inscription.</p>
        <h1 className='titreUtilisation'>Cloture du compte</h1>
        <p className='pUtilisation'>Le compte sera cloturé si l'utilisateur en fait la demande par mail à aurelien.peria@gmail.com ou si son compte se fait ban pour manquement des règles.</p>
        <h1 className='titreUtilisation'>Règles forum </h1>
        <p className='pUtilisation'>- Il est interdit de tenir des propos discriminatoires, offensants, violents ou racistes.</p>
        <p className='pUtilisation'>- Il est interdit d'utiliser le site pour y faire de la publicité.</p>
        <p className='pUtilisation'>- Si ces règles ne sont pas respectées, votre compte pourrait être cloturé.</p>
        <h1 className='titreUtilisation'>Données personnelles</h1>
        <p className='pUtilisation'>Nous nous engageons, conformément à la législation en vigueur en France et en Europe, et en particulier au Règlement général sur la protection des données de l’UE (« RGPD »), à garantir la protection, la confidentialité et la sécurité des données personnelles des utilisateurs de notre site.</p>
    </div>
  )
}
