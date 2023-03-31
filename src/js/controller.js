import * as model from './model';
import recipeView from './views/recipeView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import searchViewResults from './views/searchViewResults';
import searchView from './views/searchView';
import paginationView from './views/paginationView';
import bookmarkView from './views/bookmarkView';
import addRecepeView from './views/addRecepeView';
import { MODAL_CLOSE_SEC } from './config';

///////////////////////////////////////

async function controlRecipes() {
  if (!window.location.hash) return;
  const id = window.location.hash.slice(1);

  try {
    recipeView.renderSpinner();

    // 0) Update Active Recipie in Search Results & Bookmarks Bar
    if (model.state.search.resultsInPage)
      searchViewResults.update(model.state.search.resultsInPage);
    if (model.state.bookmarks) bookmarkView.update(model.state.bookmarks);

    // 1) Load Recipe
    await model.loadRecipe(id);
    // 2)Rendering the recipe
    recipeView.render({ ...model.state.recipe });
  } catch (err) {
    recipeView.renderError();
    // console.error(err);
  }
}

async function controlSearchResults() {
  try {
    // 1)Get searched input
    const query = searchView.getQuery();
    if (!query) return;
    // 2)RenderSpinner
    searchViewResults.renderSpinner();
    // 3)Load search result
    await model.loadSearchResults(query);
    // 4)Set pagination data
    model.setPaginationData();
    // 5)Render search resutls
    searchViewResults.render(model.state.search.resultsInPage);
    // 6)Render pagination
    paginationView.render(model.state.search.page);
  } catch (error) {
    searchViewResults.renderError();
    // console.log(error + ' 😁👍');
  }
}

function controlPagination(pageNumber) {
  // 1) Calculate date in model
  model.setPaginationData(pageNumber);
  // 2) Render search results
  searchViewResults.render(model.state.search.resultsInPage);
  // 3) Render pagination buttons
  paginationView.render(model.state.search.page);
}

function controlServings(servingNum) {
  // 1) Set serving number and ingredians quantity
  model.setServingData(servingNum);
  // 2) Render new serving and ingredians quantity
  recipeView.update(model.state.recipe);
}

function controlAddBookmark() {
  try {
    // 1) Add/Remove Bookmarks
    if (model.state.recipe.bookmarked === false)
      model.addBookmark(model.state.recipe);
    else model.removeBookmark(model.state.recipe.id);
    model.persistBookmarks();

    // 2) Update Bookmarks on the View
    recipeView.update({ ...model.state.recipe });

    // 2.5) Check to See if We Have Any Recipies
    if (model.state.bookmarks.length === 0) throw new Error();

    // 3) Render Bookmarks in Bookmarks View
    bookmarkView.render(model.state.bookmarks);
  } catch (e) {
    bookmarkView.renderError();
    // console.error(e);
  }
}

function controlBookmark() {
  try {
    if (
      !window.localStorage.bookmarks ||
      JSON.parse(window.localStorage.bookmarks).length === 0
    )
      throw new Error();
    model.persistBookmarks('get');

    bookmarkView.render(model.state.bookmarks);
  } catch (error) {
    bookmarkView.renderError();
    // console.error(error);
  }
}

async function controlAddRecipe(newRecipeData) {
  try {
    // 1) Render Spinner
    addRecepeView.renderSpinner();
    // 2) Upload the New Recipe Data
    await model.uploadRecipe(newRecipeData);
    addRecepeView.renderSuccessMessage();
    // 3) Hide Input Form
    setTimeout(function () {
      addRecepeView.toggleModal();
    }, MODAL_CLOSE_SEC * 1000);
    // 4) Add Bookmark
    bookmarkView.render(model.state.bookmarks);
    // 5) Change Hash and Show Recipe
    window.location.hash = `${model.state.recipe.id}`;
  } catch (error) {
    // console.error(error);
    addRecepeView.renderError(error.message);
  }
}

function init() {
  bookmarkView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServing(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerRender(controlSearchResults);
  paginationView.addHandlerRender(controlPagination);
  addRecepeView.addHandlerUpload(controlAddRecipe);
}
init();

// function selectedRecipie(id) {
//   const newUrl = document.location.origin + `/#${id}`;
//   document.location.href = newUrl;
// }

// async function getSearch(url) {
//   const response = await fetch(url);
//   const result = await response.json();

//   result.reduce();
// }

// getSearch('https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza');

// console.log(document.location);
// console.log(document.URL);

// getApi('https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza');
