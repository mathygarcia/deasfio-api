const pesoChileno = document.getElementById("peso-chileno");
const urlAPI = "https://mindicador.cl/api";
const dolar = "https://mindicador.cl/api/dolar";
const euro = "https://mindicador.cl/api/euro";
const resultConversion = document.getElementById("result");
const selectedMoney = document.getElementById("selector-monedas");
document.getElementById("fecha-hora").innerHTML = Date();
const graphic = document.getElementById("myChart").getContext("2d");
async function getCash(urlAPI) {
    const endpoint = urlAPI;
    try {
        const res = await fetch(endpoint);
        const monedas = await res.json();
        return monedas;
    } catch (e) {
        alert(e.message);
    }
    console.log(endpoint);
}
async function convertirMoneda() {
    if (pesoChileno.value == "" || isNaN(pesoChileno.value) || pesoChileno.value < 0.1) {
    } else {
        try {
            const foreignExchange = await getCash(urlAPI);
            if (selectedMoney.value == "dolar") {
                resultConversion.innerHTML = `Resultado: ${new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD", }).format((pesoChileno.value / foreignExchange.dolar.valor).toFixed(2))}`;
                rendering();
            } else {
                resultConversion.innerHTML = `Resultado: ${new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", }).format((pesoChileno.value / foreignExchange.euro.valor).toFixed(2))}`;
                rendering();
            }
        } catch (err) {
            alert("Algo no funciona. Intentelo nuevamente");
            console.log(err.message);
        }
    }
}
async function loadData(selectedMoney) {
    const typeCraphics = "line";
    const title = "Historial ultimos 10 dias " + selectedMoney.value.toUpperCase();
    const divisasMoney = await getCash(urlAPI + "/" + selectedMoney.value);
    const fechas = divisasMoney.serie.map((x) => { return x.fecha; });
    const valores = divisasMoney.serie.map((y) => { return y.valor; });
    const arrCraphics = {
        type: typeCraphics,
        data: {
            labels: fechas.reverse().slice(-10),
            datasets: [{
                label: title,
                borderColor: [
                    'rgba(255, 159, 64, 1)'
                ],
                backgroundColor: [
                    'rgb(255, 99, 132)'
                ],
                data: valores.reverse().slice(-10),
            },],
        },
    };
    if (window.graphic) {
        window.graphic.clear();
        window.graphic.destroy();
    }
    window.graphic = new Chart(graphic, arrCraphics);
}

async function rendering() {
    await loadData(selectedMoney);
}

selectedMoney.addEventListener("change", function () {
    this.options[selectedMoney.selectedIndex];
});

function validar(x) {
    var y = x.which ? x.which : x.keyCode;
    if (y == 8) {
        return true;
    } else if (y >= 48 && y <= 57) {
        return true;
    } else {
        return false;
    }
}
