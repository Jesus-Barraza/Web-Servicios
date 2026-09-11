const busqueda = async (latitud, longitud, resultado) => {
    const lat = parseFloat(latitud);
    const lon = parseFloat(longitud);

    resultado.innerHTML = "";

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        resultado.innerHTML = "<p class=\"pre\">Coordenadas incorrectas, inténtelo de nuevo.</p>";
        return;
    }

    const web = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m`;

    try {
        const res = await fetch(web);

        const data = await res.json();
        const current = data.current;

        if (!current) {
            console.log(current)
            throw new Error("No se pudo obtener el clima actual.");
        }

        resultado.innerHTML = `
            <h2>Resultados de la búsqueda</h2>
            <p class="pre">Latitud</p>
            <p>${lat.toFixed(2)}</p>
            <br>
            <p class="pre">Longitud</p>
            <p>${lon.toFixed(2)}</p>
            <br>
            <p class="pre">Temperatura</p>
            <p>${current.temperature_2m} °C</p>
            <br>
            <p class="pre">Velocidad del viento</p>
            <p>${current.wind_speed_10m} km/h</p>
        `;
    } catch (error) {
        resultado.innerHTML = `<p class="pre">Error: ${error.message}</p>`;
    }
};