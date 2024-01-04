const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealEl = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const single_meal = document.getElementById('single-meal');

//Search meal

function searchMeal(e){
    e.preventDefault();

// Clear Single meal

    single_meal.innerHTML="";

// get search meal

    const term= search.value;

// Check for Empty
   
    if(term.trim()){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
        ).then((res)=>res.json())
        .then((data)=>{
            console.log(data);
            resultHeading.innerHTML=`<h2>Search Result for ${term}</h2>`;
            if(data.meals===null){
                resultHeading.innerHTML=`<h2>There Are No Result for ${term}</h2>`;
            }
            else{
                mealEl.innerHTML= data.meals.map(
                    (meal)=>`
                    <div class="meal">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <div class="meal-info" data-mealId="${meal.idMeal}">
                    <h4>${meal.strMeal}</h4>
                    </div>
                    </div>
                    `
                ).join("");
            }
        });
    }
    else{
        alert("please insert a search value");
    }
}

// fetch meal by id

function getMealById(mealId){
    fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    ).then(res=>res.json())
    .then(data=>{
        console.log(data);
        const meal = data.meals[0];
        addMealToDOM(meal);
    });
}

// add meal to dom

function addMealToDOM(meal){
    console.log(meal);
    const ingredients =[];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`]?.trim();
        const measure = meal[`strMeasure${i}`]?.trim();
        if (ingredient && measure) {
            ingredients.push(`${ingredient} - ${measure}`);
        } else {
            break;
        }
    }


     console.log(ingredients);

    single_meal.innerHTML = `
    <div class = "single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <div class="single-meal-info">
     ${meal.strCategory ? `<p> ${meal.strCategory}</P>` : '' }
    ${meal.strArea ? `<p> ${meal.strArea}</p>`: ''}
     </div>
    <div class="main">
    <p>${meal.strInstructions}</p>
    <h2>Ingredients</h2>
    <ul>
    ${ingredients.map((ing)=>
       `<li>${ing}</li>`).join("")}
       </ul>
    </div>
    </div>
    `
}

//Random Meal

function randomMeal(){
    mealEl.innerHTML="";
    resultHeading.innerHTML="";
    fetch(
    `https://www.themealdb.com/api/json/v1/1/random.php`
    ).then((res)=>res.json())
    .then((data)=>{
        const meal =data.meals[0];
        addMealToDOM(meal);
    })
}



// Event Listners

submit.addEventListener('submit',searchMeal);

random.addEventListener('click',randomMeal);

mealEl.addEventListener("click", (e)=>{
//    const mealInfo = e.path.find((item)=>{
//     if(item.classList){
//         return item.classList.contains("meal-info");
//     }
//     else{
//         return false;
//     }
//    });
const mealInfo = e.target.closest('.meal-info');

   if (mealInfo) {
    const mealId = mealInfo.getAttribute("data-mealid");
   getMealById(mealId);
}
});