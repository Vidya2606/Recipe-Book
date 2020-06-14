(function() {
    const errMsgs = {
        'network-error': 'There was a problem connecting to the network',
    };

    const appState = {};

    function convertError(response) {
        if(response.ok){
            return response.json();
        }
        return response.json()
        .then (err => Promise.reject(err));
    };
    function showError(err) {
        document.getElementById("error-message").innerHTML = err;
    };

    function getAndShowRecipiesList() {
        fetch(`/recipe`, {
            method: 'GET',
        })
        .catch(() => Promise.reject({ error: 'network-error' }))
        .then( convertError )
        .then( recipes => {
            showError("");
           showRecipiesList(recipes);
        })
        .catch( err => {
            showError(errMsgs[err.error] || err.error);
        });
    };

    function showRecipiesList(recipes) {
        let innerHtmlForRecipeList = '<div>\n';
        for (let recpIndex = 0; recpIndex < recipes.length; recpIndex++) {
            innerHtmlForRecipeList = innerHtmlForRecipeList + '<div class="recipe-item" id="' + recipes[recpIndex].id +'">' + recipes[recpIndex].title  + '</div>';
        }
        innerHtmlForRecipeList = innerHtmlForRecipeList + '</div>\n';
        let userInteractivePart = document.getElementById("page-content");
        userInteractivePart.innerHTML = innerHtmlForRecipeList;

        // Set onClick for recipe items in the list.
        let recpItems = document.getElementsByClassName("recipe-item");
        for (let itm = 0; itm < recpItems.length; itm++) {
            recpItems[itm].onclick = function(event) {
                getAndShowRecipe(event.target.id);
            };
        };
    };

    function isUserLoggedIn() {
        if (appState.login === undefined) {
            return false;
        }
        return appState.login;
    };

    function login() {
        let username = document.getElementById("username").value;
        if(username === undefined || username.length < 1 || username.replace(/\s/g, '').length < 1) {
            showError("bad login");
            return;
        }
        let reqBody = {};
        reqBody.username = username;
        fetch(`/session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(reqBody)
        })
        .catch( () => Promise.reject ({ error: 'user-unknown' }))
        .then(convertError)
        .then((response) => {
            appState.login = true;
            showError("");
            setUserButtons();
        })
        .catch(err => {
            showError(errMsgs[err.error] || err.error);
        });
    };

    function logout() {
        fetch(`/session`, {
            method: 'DELETE',
        })
        .catch( () => Promise.reject( { error: 'network-error' }))
        .then(convertError)
        .then( (response) => {
            appState.login = false;
            showError("");
            homePage();
        })
        .catch(err => {
            appState.login = false;
            showError("");
            homePage();
        });
    };

    function addAndShowRecipe() {
        let title = document.getElementById("recipe-title").value;
        let ingredients = document.getElementById("recipe-ingredients").value;
        let instructions = document.getElementById("recipe-instructions").value;
        
        if(isNotNullOrSpaces(title) 
            && isNotNullOrSpaces(ingredients)
            && isNotNullOrSpaces(instructions)) {
            let reqBody = {};
            reqBody.title = title;
            reqBody.ingredients = ingredients;
            reqBody.instructions = instructions;
            fetch(`/recipe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(reqBody)
            })
            .catch(() => Promise.reject({ error: 'network-error'}))
            .then(convertError)
            .then( recipe => {
                showError("");
                addRecipe();
            })
            .catch( err => {
                showError(errMsgs[err.error] || err.error);
            });
        } else {
            showError("recipe details must not be empty");
        }
    };

    function addRecipe() {
        appState.page = 'addrecipe';
        let addRecipe = '<div class="recipe-part">\n';
        addRecipe = addRecipe + '<div><input type="text" name="text" class="recipe-title" id="recipe-title" width="80%" placeholder="Add a title for your recipe"></textarea></div><br>';
        addRecipe = addRecipe + '<div class="recipe-titles"> Ingredients</div>';
        addRecipe = addRecipe + '<div><textarea name="text" class="recipe-ingredients" id="recipe-ingredients" placeholder="Add all ingredients"></textarea></div><br>';
        addRecipe = addRecipe + '<div class="recipe-titles"> Instructions</div>';
        addRecipe = addRecipe + '<div><textarea name="text" class="recipe-instructions" id="recipe-instructions" placeholder="Add instructions"></textarea></div><br>';
        addRecipe = addRecipe + '<div><button class="user-button" id="save-recipe">Submit</button></div>';
        addRecipe = addRecipe + '</div>';

        let userContentPart = document.getElementById("page-content");
        userContentPart.innerHTML = addRecipe;

        let saveRecipeButton = document.getElementById("save-recipe");
        saveRecipeButton.addEventListener('click', (event) => {
            event.preventDefault();
            addAndShowRecipe();
        });
        setUserButtons();
    };

    function getAndShowRecipe(recipeId) {
        // get and show Recipe;
        fetch(`/recipe/${recipeId}`, {
            method: 'GET',
        })
        .catch(() => Promise.reject({ error: 'network-error' }))
        .then( convertError )
        .then( recipe => {
            showError("");
           showRecipe(recipe);
        })
        .catch( err => {
            showError(errMsgs[err.error] || err.error);
        });
    };

    function showRecipe(recipe) {
        appState.page = 'recipe';
        let recipePart = '<div class="recipe-part">\n';
        recipePart = recipePart + '<div class="recipe-title">' + recipe.title + '</div>\n';
        recipePart = recipePart + '<div class="recipe-author">' + recipe.author + '</div>\n';
        recipePart = recipePart + '<div class="recipe-titles"> Ingredients</div>';
        recipePart = recipePart + '<div class="recipe-ingredients">' + recipe.ingredients + '</div>\n';
        recipePart = recipePart + '<div class="recipe-titles"> Instructions</div>';
        recipePart = recipePart + '<div class="recipe-instructions">' + recipe.instructions + '</div>\n';
        recipePart = recipePart + '</div>';

        let userContentPart = document.getElementById("page-content");
        userContentPart.innerHTML = recipePart;
        setUserButtons();
    };

    function setUserButtons() {
        let pageType = appState.page;
        let buttonPart = document.getElementById("user-buttons");
        if (isUserLoggedIn()) {
            let logoutButton = '<button class="user-button" id="logout">Logout</button>';
            if (pageType === 'home') {
                let addRecipeButton = '<button class="user-button" id="addrecipe">Add Recipe</button>';
                buttonPart.innerHTML = '<span>' + addRecipeButton + logoutButton + '</span>';

                document.getElementById("addrecipe").addEventListener('click', (event) => {
                    event.preventDefault();
                    addRecipe();
                });
            } else {
                let homeButton = '<button class="user-button" id="returntohome">Home</button>';
                buttonPart.innerHTML = '<span>' + homeButton + logoutButton + '</span>';

                document.getElementById("returntohome").addEventListener('click', (event) => {
                    event.preventDefault();
                    homePage();
                });
            }    
            document.getElementById("logout").addEventListener('click', (event) => {
                event.preventDefault();
                logout();   
            });
        } else {
            let userNameInput = '<input class="user-name-input" id="username" placeholder="Username"></input>';
            let loginButton = '<button class="user-button" id="login">Login</button>';
            if (pageType === 'home') {
                buttonPart.innerHTML = '<span>' + userNameInput + loginButton + '</span>';
            } else {
                let homeButton = '<button class="user-button" id="returntohome">Home</button>';
                buttonPart.innerHTML = '<span>' + homeButton + userNameInput + loginButton + '</span>';

                document.getElementById("returntohome").addEventListener('click', (event) => {
                    event.preventDefault();
                    homePage();
                });
            }
            document.getElementById("login").addEventListener('click', (event) => {
                event.preventDefault();
                login();   
            });
        }
    };

    function isNotNullOrSpaces(stringVar) {
        if (stringVar === null || stringVar === undefined || stringVar.replace(/\s/g, '').length < 1) {
            return false;
        }
        return true;
    };
    //Home page 
    function homePage() {
        appState.page = "home";
        setUserButtons();
        getAndShowRecipiesList();
    };
    
    // Set initial state
    appState.page = "home";
    appState.login = false;

    fetch(`/session`, {
        method: 'GET',
    })
    .catch(() => Promise.reject({ error: 'network-error' }))
    .then (convertError)
    .then( username => {
        appState.login = true;
        homePage();
    })
    .catch( err => {
        homePage();
    });
})();