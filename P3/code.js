const login = async (correo, contra, res) => {
    const contenedor = res || resultado;
    contenedor.innerHTML = "";

    const web = "http://localhost:3001/login";

    try {
        const response = await fetch(web, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: correo, password: contra })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Credenciales inválidas");
        }

        if (!data || !data.token) {
            throw new Error("No se pudo iniciar sesión");
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        contenedor.innerHTML = `<p class="resultado">Gracias por iniciar sesión</p>`;
        window.location.href = "./cliente/tareas.html";
    } catch (err) {
        contenedor.innerHTML = `<p class="resultado">Error: ${err.message}</p>`;
    }
};

const register = async (nombre, correo, contra, res) => {
    const contenedor = res || resultado;
    contenedor.innerHTML = "";

    const web = "http://localhost:3001/register";

    try {
        const response = await fetch(web, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nombre, email: correo, password: contra })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "No se pudo crear la cuenta");
        }

        contenedor.innerHTML = `<p class="resultado">Cuenta creada correctamente. Iniciando sesión...</p>`;
        await login(correo, contra, contenedor);
    } catch (err) {
        contenedor.innerHTML = `<p class="resultado">Error: ${err.message}</p>`;
    }
};