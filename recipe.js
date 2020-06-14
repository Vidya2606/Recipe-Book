const recipeDB = require('./recipeDB');
const { v4: uuidv4 } = require('uuid');

const recipe = {
    getRecipesList: function() {
        let allRecipes = [];
        for (recpId in recipeDB.recipeDB) {
            let recp = {};
            recp.title = recipeDB.recipeDB[recpId].title;
            recp.id = recpId;
            allRecipes.push(recp);
        }
        return allRecipes;
    },
    getRecipe: function(recpId) {
        let recp = recipeDB.recipeDB[recpId];
        if (recp === undefined || recp === null) {
            throw "recipe not found";
        }
        return recp;
    },
    addRecipe: function(title, author, ingredients, instructions) {
        let recipeUid = "recipe-" + uuidv4();
        let recp = {};
        recp.title = title;
        recp.author = author;
        recp.ingredients = ingredients;
        recp.instructions = instructions;
        recipeDB.recipeDB[recipeUid] = recp;
        return recipeUid;
    }
}
module.exports = recipe;