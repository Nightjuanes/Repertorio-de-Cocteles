const apiRandomCocktail = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
const loader = document.getElementById("loader");
const coctel = document.getElementById("cocktailInfo");
const favoritesSection = document.getElementById("favoritesSection");
const favoriteCocktailsDropdown = document.getElementById("favoriteCocktails");
const favoriteDetails = document.getElementById("favoriteDetails");

async function buscarYMostrarCocktail() {
        const cocktail = await obtenerCocktailAleatorio();
        mostrarDetallesCocktail(cocktail);
}

async function obtenerCocktailAleatorio() {
    const respuesta = await fetch(apiRandomCocktail);
    const data = await respuesta.json();
    return data.drinks[0];
}

function mostrarDetallesCocktail(cocktail) {
  
    coctel.innerHTML = `
        <secttion id="cocktailInfo">
        <section>
            <p><strong>ID:</strong> ${cocktail.idDrink}</p>
            <p><strong>Nombre:</strong> ${cocktail.strDrink}</p>
            <p><strong>Categoría:</strong> ${cocktail.strCategory}</p>
            <p><strong>Ingredientes:</strong> ${obtenerIngredientes(cocktail)}</p>
            <p><strong>Instrucciones:</strong> ${cocktail.strInstructions}</p>
        </section>
            <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
    `;
}

function obtenerIngredientes(cocktail) {
    let ingredientes = "";
    for (let i = 0; i < 15; i++) {
        const ingrediente = cocktail[`strIngredient${i}`];
        const medida = cocktail[`strMeasure${i}`];

        if (ingrediente && medida) {
            ingredientes += `${ingrediente} - ${medida}, `;
        } else if (ingrediente) {
            ingredientes += `${ingrediente}, `;
        }
    }

    return ingredientes.slice(0, -2);
}
//Parte de favoritos
function guardarEnFavoritos() {
    const cocktailInfo = document.getElementById("cocktailInfo");
    const cocktail = {
        id: cocktailInfo.querySelector("p:first-child").textContent.split(":")[1].trim(),
        nombre: cocktailInfo.querySelector("p:nth-child(2)").textContent.split(":")[1].trim(),
        categoria: cocktailInfo.querySelector("p:nth-child(3)").textContent.split(":")[1].trim(),
        ingredientes: obtenerIngredientesDesdeHTML(cocktailInfo),
        instrucciones: cocktailInfo.querySelector("p:nth-child(5)").textContent.split(":")[1].trim(),
        imagen: cocktailInfo.querySelector("img").src
    
    };
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    favoritos.push(cocktail);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    actualizarDropdownFavoritos();
}

function obtenerIngredientesDesdeHTML(cocktailInfo) {
    const ingredientesParagraph = cocktailInfo.querySelector("p:nth-child(4)");
    return ingredientesParagraph.textContent.split(":")[1].trim();
}

function actualizarDropdownFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    const dropdown = document.getElementById("favoriteCocktails");

    dropdown.innerHTML = '<option value="">Selecciona un favorito</option>';

    favoritos.forEach(cocktail => {
        const option = document.createElement("option");
        option.value = cocktail.id;
        option.textContent = `${cocktail.nombre}`;
        dropdown.appendChild(option);
    });
}

function mostrarDetallesFavorito() {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    const selectedValue = favoriteCocktailsDropdown.value;

    const cocktail = favoritos.find(fav => fav.id === selectedValue);
    if (cocktail) {
        favoriteDetails.innerHTML = `

            <section id="favs">
                <h3>${cocktail.nombre}</h3>
                <p>Categoria: ${cocktail.categoria}</p>
                <p>Ingredientes: ${cocktail.ingredientes}</p>
                <p>Instrucciones: ${cocktail.instrucciones}</p>
                <img src="${cocktail.imagen}" alt="${cocktail.nombre}"> 
            </section>
        `;
    } else {
        favoriteDetails.innerHTML = "";
    }
}
function Borrar() {
    // Limpiar el array de favoritos
    const favoritos = [];
    
    // Actualizar el localStorage con el array de favoritos vacío
    localStorage.setItem("favoritos", JSON.stringify(favoritos));

    // Actualizar el dropdown de favoritos en la interfaz
    actualizarDropdownFavoritos();
}