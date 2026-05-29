/**
 * * Forms - Contáctanos
 * ? Autor: SIRR 
 * ? Versión : 0 , 26/05/2026
 * Funciones para albergar las solicitudes del formulario
 * "Contáctanos"
 * Diseñado específicamente para:
 * ? contactanos.html
 */
/**
 * Nombres para el evento de captura de datos:
 * Commentary / CommentaryTpic / CommentaryEMil / CommentaryName
 */

const formCntc      = document.getElementById("Cntc");
let   formArry      = [];  // <--- Aquí se guardan los comentarios como lista de objetos.
/**************************************************
 * ? formCntc ::: Capturador de evento: formulario
 *************************************************/
formCntc.addEventListener("submit",(event)=>{
    event.preventDefault();
    const formName = event.target.elements["CommentaryName"].value;
    const formTpic = event.target.elements["CommentaryTpic"].value;
    const formEMil = event.target.elements["CommentaryEMil"].value;
    const formText = event.target.elements["Commentary"].value;

    const formDATA = new FormData(formCntc);    
    const ArryData = [...formDATA];
    const CmntObjt = Object.fromEntries(ArryData);
    formArry.push(CmntObjt);
    
    /**
     * ? Colocar función para guardar datos almacenados, por el momento en la memoria local,
     * ? despues en la base de datos , SIRR 27/05/2026 12:01 hrs.
     */
    saveLcal(formArry);
    formCntc.reset();
});

// Función de testeo: guarda información en memoria local
const saveLcal = (Arrayform) =>{
      const Textform = JSON.stringify(Arrayform);
      localStorage.setItem("Comment", Textform );
  };