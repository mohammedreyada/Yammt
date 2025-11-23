
let sidebarContainer = document.getElementById("sidebarContainer");
let openBtn = document.getElementById("openBtn");
let closeBtn = document.getElementById("closeBtn");

openBtn.onclick = () => sidebarContainer.classList.add("open");
closeBtn.onclick = () => sidebarContainer.classList.remove("open");


let mainContainer;

function createMainContainer() {
    if (!mainContainer) {
        mainContainer = document.createElement("div");
        mainContainer.id = "mainContainer";
        mainContainer.style.cssText = `
            display:grid;
            grid-template-columns:repeat(auto-fill, minmax(250px,1fr));
            gap:20px;
            padding:30px;
            color:white;
        `;
        document.body.appendChild(mainContainer);
    }
}
createMainContainer();
function renderMeals(meals) {
    mainContainer.innerHTML = "";

    if (!meals) {
        mainContainer.innerHTML = "<h2>No meals found</h2>";
        return;
    }

    meals.slice(0, 20).forEach(meal => {
        let box = document.createElement("div");
        box.style.cssText = `
            overflow:hidden;
            border-radius:10px;
            cursor:pointer;
        `;
        box.innerHTML = `
            <img src="${meal.strMealThumb}" style="width:100%;border-radius:10px;">
            <h3 style="text-align:center;">${meal.strMeal}</h3>
        `;

        box.onclick = () => showMealDetails(meal.idMeal);
        mainContainer.appendChild(box);
    });
}

async function showMealDetails(id) {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    let meal = (await res.json()).meals[0];

    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`])
            ingredients += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
    }

    let tags = meal.strTags ? meal.strTags.split(",").join(" | ") : "No Tags";

    mainContainer.innerHTML = `
    <div style="color:white; line-height:1.6;">
        <img src="${meal.strMealThumb}" style="width:400px;border-radius:10px;display:block;margin:auto;">
        <h1>${meal.strMeal}</h1>

        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>

        <h3>Area: ${meal.strArea}</h3>
        <h3>Category: ${meal.strCategory}</h3>

        <h3>Recipes:</h3>
        <ul>${ingredients}</ul>

        <h3>Tags:</h3>
        <p>${tags}</p>

        <a href="${meal.strSource}" target="_blank" style="color:yellow;">Meal Source</a><br>
        <a href="${meal.strYoutube}" target="_blank" style="color:yellow;">YouTube Video</a>
    </div>
    `;
}

// ===============================
// Default Home Meals (search with empty name)
// ===============================
async function loadHomeMeals() {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
    renderMeals((await res.json()).meals);
}
loadHomeMeals();
document.querySelector(".menu li:nth-child(1)").onclick = () => {
    mainContainer.innerHTML = `
        <input id="searchName" placeholder="Search by meal name" 
        style="width:300px;padding:10px;margin:10px;font-size:18px;">
        
        <input id="searchLetter" maxlength="1" placeholder="Search by first letter" 
        style="width:300px;padding:10px;margin:10px;font-size:18px;">
    `;

    document.getElementById("searchName").onkeyup = async (e) => {
        let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${e.target.value}`);
        renderMeals((await res.json()).meals);
    };

    document.getElementById("searchLetter").onkeyup = async (e) => {
        let letter = e.target.value;
        if (letter) {
            let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
            renderMeals((await res.json()).meals);
        }
    };
};
document.querySelector(".menu li:nth-child(2)").onclick = async () => {
    let res = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    let cats = (await res.json()).categories;

    mainContainer.innerHTML = "";

    cats.forEach(cat => {
        let box = document.createElement("div");
        box.style.cssText = `
            overflow:hidden;
            border-radius:10px;
            cursor:pointer;
        `;
        box.innerHTML = `
            <img src="${cat.strCategoryThumb}" style="width:100%; border-radius:10px;">
            <h3 style="text-align:center;">${cat.strCategory}</h3>
        `;

        box.onclick = () => loadCategoryMeals(cat.strCategory);
        mainContainer.appendChild(box);
    });
};

async function loadCategoryMeals(category) {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    renderMeals((await res.json()).meals);
}


document.querySelector(".menu li:nth-child(3)").onclick = async () => {
    let res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
    let areas = (await res.json()).meals;

    mainContainer.innerHTML = "";

    areas.forEach(a => {
        let box = document.createElement("div");
        box.style.cssText = `
            background:#222;
            padding:20px;
            border-radius:10px;
            text-align:center;
            font-size:22px;
            cursor:pointer;
        `;
        box.innerHTML = a.strArea;

        box.onclick = () => loadAreaMeals(a.strArea);
        mainContainer.appendChild(box);
    });
};

async function loadAreaMeals(area) {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    renderMeals((await res.json()).meals);
}

document.querySelector(".menu li:nth-child(4)").onclick = async () => {
    let res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
    let ingredients = (await res.json()).meals.slice(0, 50);

    mainContainer.innerHTML = "";

    ingredients.forEach(i => {
        let box = document.createElement("div");
        box.style.cssText = `
            background:#222;
            padding:20px;
            border-radius:10px;
            cursor:pointer;
            text-align:center;
        `;
        box.innerHTML = `
            <h3>${i.strIngredient}</h3>
            <p>${i.strDescription?.split(" ").slice(0,20).join(" ")}...</p>
        `;

        box.onclick = () => loadIngredientMeals(i.strIngredient);
        mainContainer.appendChild(box);
    });
};

async function loadIngredientMeals(ing) {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`);
    renderMeals((await res.json()).meals);
}

document.querySelector(".menu li:nth-child(5)").onclick = () => {
    mainContainer.innerHTML = `
        <div style="max-width:400px;margin:auto;color:white;">
            <h2>Contact Us</h2>

            <input id="nameInput" placeholder="Name" class="inp"><br>
            <small id="nameError" style="color:red;display:none;">Invalid name</small><br>

            <input id="emailInput" placeholder="Email" class="inp"><br>
            <small id="emailError" style="color:red;display:none;">Invalid email</small><br>

            <input id="phoneInput" placeholder="Phone" class="inp"><br>
            <small id="phoneError" style="color:red;display:none;">Invalid phone</small><br>

            <button id="submitBtn" disabled 
            style="padding:10px 20px;font-size:18px;margin-top:10px;">Submit</button>
        </div>
    `;

    const regex = {
        name: /^[A-Za-z ]{3,}$/,
        email: /^[^@]+@[^@]+\.[^@]+$/,
        phone: /^[0-9]{8,15}$/
    };

    let inputs = ["name", "email", "phone"];

    inputs.forEach(id => {
        let input = document.getElementById(`${id}Input`);
        input.onkeyup = () => validateForm();
    });

    function validateForm() {
        let ok = true;

        inputs.forEach(id => {
            let val = document.getElementById(`${id}Input`).value;
            let err = document.getElementById(`${id}Error`);

            if (!regex[id].test(val)) {
                err.style.display = "block";
                ok = false;
            } else {
                err.style.display = "none";
            }
        });

        document.getElementById("submitBtn").disabled = !ok;
    }
};
