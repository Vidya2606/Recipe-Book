/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/recipeStore.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/recipeStore.js":
/*!****************************!*\
  !*** ./src/recipeStore.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function () {
  var errMsgs = {
    'network-error': 'There was a problem connecting to the network'
  };
  var appState = {};

  function convertError(response) {
    if (response.ok) {
      return response.json();
    }

    return response.json().then(function (err) {
      return Promise.reject(err);
    });
  }

  ;

  function showError(err) {
    document.getElementById("error-message").innerHTML = err;
  }

  ;

  function getAndShowRecipiesList() {
    fetch("/recipe", {
      method: 'GET'
    })["catch"](function () {
      return Promise.reject({
        error: 'network-error'
      });
    }).then(convertError).then(function (recipes) {
      showError("");
      showRecipiesList(recipes);
    })["catch"](function (err) {
      showError(errMsgs[err.error] || err.error);
    });
  }

  ;

  function showRecipiesList(recipes) {
    var innerHtmlForRecipeList = '<div>\n';

    for (var recpIndex = 0; recpIndex < recipes.length; recpIndex++) {
      innerHtmlForRecipeList = innerHtmlForRecipeList + '<div class="recipe-item" id="' + recipes[recpIndex].id + '">' + recipes[recpIndex].title + '</div>';
    }

    innerHtmlForRecipeList = innerHtmlForRecipeList + '</div>\n';
    var userInteractivePart = document.getElementById("page-content");
    userInteractivePart.innerHTML = innerHtmlForRecipeList; // Set onClick for recipe items in the list.

    var recpItems = document.getElementsByClassName("recipe-item");

    for (var itm = 0; itm < recpItems.length; itm++) {
      recpItems[itm].onclick = function (event) {
        getAndShowRecipe(event.target.id);
      };
    }

    ;
  }

  ;

  function isUserLoggedIn() {
    if (appState.login === undefined) {
      return false;
    }

    return appState.login;
  }

  ;

  function login() {
    var username = document.getElementById("username").value;

    if (username === undefined || username.length < 1 || username.replace(/\s/g, '').length < 1) {
      showError("bad login");
      return;
    }

    var reqBody = {};
    reqBody.username = username;
    fetch("/session", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    })["catch"](function () {
      return Promise.reject({
        error: 'user-unknown'
      });
    }).then(convertError).then(function (response) {
      appState.login = true;
      showError("");
      setUserButtons();
    })["catch"](function (err) {
      showError(errMsgs[err.error] || err.error);
    });
  }

  ;

  function logout() {
    fetch("/session", {
      method: 'DELETE'
    })["catch"](function () {
      return Promise.reject({
        error: 'network-error'
      });
    }).then(convertError).then(function (response) {
      appState.login = false;
      showError("");
      homePage();
    })["catch"](function (err) {
      appState.login = false;
      showError("");
      homePage();
    });
  }

  ;

  function addAndShowRecipe() {
    var title = document.getElementById("recipe-title").value;
    var ingredients = document.getElementById("recipe-ingredients").value;
    var instructions = document.getElementById("recipe-instructions").value;

    if (isNotNullOrSpaces(title) && isNotNullOrSpaces(ingredients) && isNotNullOrSpaces(instructions)) {
      var reqBody = {};
      reqBody.title = title;
      reqBody.ingredients = ingredients;
      reqBody.instructions = instructions;
      fetch("/recipe", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
      })["catch"](function () {
        return Promise.reject({
          error: 'network-error'
        });
      }).then(convertError).then(function (recipe) {
        showError("");
        addRecipe();
      })["catch"](function (err) {
        showError(errMsgs[err.error] || err.error);
      });
    } else {
      showError("recipe details must not be empty");
    }
  }

  ;

  function addRecipe() {
    appState.page = 'addrecipe';
    var addRecipe = '<div class="recipe-part">\n';
    addRecipe = addRecipe + '<div><input type="text" name="text" class="recipe-title" id="recipe-title" width="80%" placeholder="Add a title for your recipe"></textarea></div><br>';
    addRecipe = addRecipe + '<div class="recipe-titles"> Ingredients</div>';
    addRecipe = addRecipe + '<div><textarea name="text" class="recipe-ingredients" id="recipe-ingredients" placeholder="Add all ingredients"></textarea></div><br>';
    addRecipe = addRecipe + '<div class="recipe-titles"> Instructions</div>';
    addRecipe = addRecipe + '<div><textarea name="text" class="recipe-instructions" id="recipe-instructions" placeholder="Add instructions"></textarea></div><br>';
    addRecipe = addRecipe + '<div><button class="user-button" id="save-recipe">Submit</button></div>';
    addRecipe = addRecipe + '</div>';
    var userContentPart = document.getElementById("page-content");
    userContentPart.innerHTML = addRecipe;
    var saveRecipeButton = document.getElementById("save-recipe");
    saveRecipeButton.addEventListener('click', function (event) {
      event.preventDefault();
      addAndShowRecipe();
    });
    setUserButtons();
  }

  ;

  function getAndShowRecipe(recipeId) {
    // get and show Recipe;
    fetch("/recipe/".concat(recipeId), {
      method: 'GET'
    })["catch"](function () {
      return Promise.reject({
        error: 'network-error'
      });
    }).then(convertError).then(function (recipe) {
      showError("");
      showRecipe(recipe);
    })["catch"](function (err) {
      showError(errMsgs[err.error] || err.error);
    });
  }

  ;

  function showRecipe(recipe) {
    appState.page = 'recipe';
    var recipePart = '<div class="recipe-part">\n';
    recipePart = recipePart + '<div class="recipe-title">' + recipe.title + '</div>\n';
    recipePart = recipePart + '<div class="recipe-author">' + recipe.author + '</div>\n';
    recipePart = recipePart + '<div class="recipe-titles"> Ingredients</div>';
    recipePart = recipePart + '<div class="recipe-ingredients">' + recipe.ingredients + '</div>\n';
    recipePart = recipePart + '<div class="recipe-titles"> Instructions</div>';
    recipePart = recipePart + '<div class="recipe-instructions">' + recipe.instructions + '</div>\n';
    recipePart = recipePart + '</div>';
    var userContentPart = document.getElementById("page-content");
    userContentPart.innerHTML = recipePart;
    setUserButtons();
  }

  ;

  function setUserButtons() {
    var pageType = appState.page;
    var buttonPart = document.getElementById("user-buttons");

    if (isUserLoggedIn()) {
      var logoutButton = '<button class="user-button" id="logout">Logout</button>';

      if (pageType === 'home') {
        var addRecipeButton = '<button class="user-button" id="addrecipe">Add Recipe</button>';
        buttonPart.innerHTML = '<span>' + addRecipeButton + logoutButton + '</span>';
        document.getElementById("addrecipe").addEventListener('click', function (event) {
          event.preventDefault();
          addRecipe();
        });
      } else {
        var homeButton = '<button class="user-button" id="returntohome">Home</button>';
        buttonPart.innerHTML = '<span>' + homeButton + logoutButton + '</span>';
        document.getElementById("returntohome").addEventListener('click', function (event) {
          event.preventDefault();
          homePage();
        });
      }

      document.getElementById("logout").addEventListener('click', function (event) {
        event.preventDefault();
        logout();
      });
    } else {
      var userNameInput = '<input class="user-name-input" id="username" placeholder="Username"></input>';
      var loginButton = '<button class="user-button" id="login">Login</button>';

      if (pageType === 'home') {
        buttonPart.innerHTML = '<span>' + userNameInput + loginButton + '</span>';
      } else {
        var _homeButton = '<button class="user-button" id="returntohome">Home</button>';
        buttonPart.innerHTML = '<span>' + _homeButton + userNameInput + loginButton + '</span>';
        document.getElementById("returntohome").addEventListener('click', function (event) {
          event.preventDefault();
          homePage();
        });
      }

      document.getElementById("login").addEventListener('click', function (event) {
        event.preventDefault();
        login();
      });
    }
  }

  ;

  function isNotNullOrSpaces(stringVar) {
    if (stringVar === null || stringVar === undefined || stringVar.replace(/\s/g, '').length < 1) {
      return false;
    }

    return true;
  }

  ; //Home page 

  function homePage() {
    appState.page = "home";
    setUserButtons();
    getAndShowRecipiesList();
  }

  ; // Set initial state

  appState.page = "home";
  appState.login = false;
  fetch("/session", {
    method: 'GET'
  })["catch"](function () {
    return Promise.reject({
      error: 'network-error'
    });
  }).then(convertError).then(function (username) {
    appState.login = true;
    homePage();
  })["catch"](function (err) {
    homePage();
  });
})();

/***/ })

/******/ });
//# sourceMappingURL=recipeStore.js.map