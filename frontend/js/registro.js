const formulario =
    document.querySelector("#registroForm");

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const datos =
        Object.fromEntries(
            new FormData(formulario)
        );

    datos.terminos =
        document.querySelector("#terminos").checked;

// Expresión regular: letras, espacios y acentos
const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

// Nombre
if (!datos.nombreU.trim()) {
    alert("El nombre es obligatorio");
    return;
}

if (datos.nombreU.trim().length < 2) {
    alert("El nombre debe tener al menos 2 caracteres");
    return;
}

if (datos.nombreU.trim().length > 50) {
    alert("El nombre no puede tener más de 50 caracteres");
    return;
}

if (!regexNombre.test(datos.nombreU.trim())) {
    alert("El nombre solo puede contener letras");
    return;
}

// Apellido
if (!datos.apellidoU.trim()) {
    alert("El apellido es obligatorio");
    return;
}

if (datos.apellidoU.trim().length < 2) {
    alert("El apellido debe tener al menos 2 caracteres");
    return;
}

if (datos.apellidoU.trim().length > 50) {
    alert("El apellido no puede tener más de 50 caracteres");
    return;
}

if (!regexNombre.test(datos.apellidoU.trim())) {
    alert("El apellido solo puede contener letras");
    return;
}
// Correo
const correo = datos.correo.trim();
const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!correo) {
    alert("El correo es obligatorio");
    return;
}

if (correo.length > 100) {
    alert("El correo no puede superar los 100 caracteres");
    return;
}

if (!regexCorreo.test(correo)) {
    alert("Ingresa un correo válido");
    return;
}

    // Usuario
    if(datos.nickname.trim().length < 4){
        alert("El nombre de usuario debe tener al menos 4 caracteres");
        return;
    }

    // Fecha
const mesSelect = document.getElementById("mes");
const diaSelect = document.getElementById("dias");
const anioSelect = document.getElementById("anio");

function actualizarDias() {
    const mes = mesSelect.value;
    const anio = parseInt(anioSelect.value);

    let diasMes = 31;

    switch (mes) {
        case "Abril":
        case "Junio":
        case "Septiembre":
        case "Noviembre":
            diasMes = 30;
            break;

        case "Febrero":
            if (
                anio &&
                ((anio % 4 === 0 && anio % 100 !== 0) ||
                 anio % 400 === 0)
            ) {
                diasMes = 29;
            } else {
                diasMes = 28;
            }
            break;
    }

    diaSelect.innerHTML =
        '<option selected disabled>Día</option>';

    for (let i = 1; i <= diasMes; i++) {
        diaSelect.innerHTML += `<option>${i}</option>`;
    }
}

mesSelect.addEventListener("change", actualizarDias);
anioSelect.addEventListener("change", actualizarDias);

    // Contraseña
if(datos.password.trim().length < 8){
    alert("La contraseña debe tener al menos 8 caracteres");
    return;
}

const tieneMayuscula = /[A-Z]/.test(datos.password);
const tieneNumero = /\d/.test(datos.password);

if(!tieneMayuscula || !tieneNumero){
    alert(
        "La contraseña debe contener al menos una mayúscula y un número"
    );
    return;
}

if(datos.password !== datos.confirmPassword){
    alert("Las contraseñas no coinciden");
    return;
}
    // Términos
    if(!datos.terminos){
        alert("Debes aceptar los términos y condiciones");
        return;
    }

    const meses = {
    Enero: "01",
    Febrero: "02",
    Marzo: "03",
    Abril: "04",
    Mayo: "05",
    Junio: "06",
    Julio: "07",
    Agosto: "08",
    Septiembre: "09",
    Octubre: "10",
    Noviembre: "11",
    Diciembre: "12"
};

const birthday =
    `${datos.anio}-${meses[datos.mes]}-${String(datos.dia).padStart(2,"0")}`;

    

    const usuario = {
    firstName: datos.nombreU.trim(),
    lastName: datos.apellidoU.trim(),
    email: datos.correo.trim(),
    user_name: datos.nickname.trim(),
    password: datos.password,
    birthday: birthday
    };
    console.log(usuario);

    try {

        const respuesta =
            await fetch(
                "/api/users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify(usuario)
                }
            );

            if (respuesta.ok) {
            alert("Usuario registrado correctamente");

            registroForm.reset();

            window.location.href = "inicio_sesion.html";
        } else {
            // Corregi el error de la variable respuesta
            const errorData = await respuesta.json();
            alert(errorData.message || "Error al registrar usuario");
        }


    } catch(error){

        console.error(error);
        alert("Error al conectar con el servidor");

    }

});