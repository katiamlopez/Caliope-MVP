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
console.log("forms.js cargado");

const formCntc = document.getElementById("Cntc");

formCntc.addEventListener("submit", async (event) => {

    event.preventDefault();

    console.log("Evento submit");

    const contact = {

        name: event.target.elements["CommentaryName"].value,

        email: event.target.elements["CommentaryEMil"].value,

        subject: event.target.elements["CommentaryTpic"].value,

        message: event.target.elements["Commentary"].value

    };

    console.log(contact);

    try{

        const response = await fetch("/api/contacts",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify(contact)

        });

        if(!response.ok){
            throw new Error("Error al enviar el mensaje");
        }

        const data = await response.json();

        console.log(data);

        alert("Mensaje enviado correctamente.");

        formCntc.reset();

    }catch(error){

        console.error(error);

        alert("No fue posible enviar el mensaje.");

    }

});
// Función de testeo: guarda información en memoria local
// const saveLcal = (Arrayform) =>{
//       const Textform = JSON.stringify(Arrayform);
//       localStorage.setItem("Comment", Textform );
//   };