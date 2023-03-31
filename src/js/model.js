import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, DEFAULT_SERVING, API_KEY } from './config';
import { timeout, sendJSON, AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsInPage: [],
    resultsPerPage: RES_PER_PAGE,
    page: {
      pageNumber: 1,
      maxPageNumber: 0,
    },
  },
  bookmarks: [],
};

export async function loadRecipe(id) {
  try {
    const result = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    state.recipe = createRecipeObject(result);

    if (state.bookmarks.some(i => i.id === state.recipe.id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    console.error(`${error}😁👍`);
    throw error;
  }
}

export async function loadSearchResults(query) {
  try {
    state.search.query = query;

    const searchResult = await AJAX(
      `${API_URL}?search=${query}&key=${API_KEY}`
    );

    if (searchResult.results === 0) throw new Error();

    state.search.results = searchResult.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (error) {
    throw error;
  }
}

export function setPaginationData(pageNumber = 1) {
  state.search.page.pageNumber = pageNumber;

  state.search.page.maxPageNumber = Math.ceil(
    state.search.results.length / state.search.resultsPerPage
  );

  const starterRecipe =
    (state.search.page.pageNumber - 1) * state.search.resultsPerPage;
  const lastRecepie =
    state.search.page.pageNumber * state.search.resultsPerPage;

  if (state.search.page.pageNumber === state.search.page.maxPageNumber)
    return (state.search.resultsInPage =
      state.search.results.slice(starterRecipe));

  state.search.resultsInPage = state.search.results.slice(
    starterRecipe,
    lastRecepie
  );
}

export function setServingData(servingNum) {
  // 1) Check serving to be a valid number
  if (servingNum < 1) return;

  // 2) Set quantity to according to new serving number
  state.recipe.ingredients.forEach(ingredient => {
    if (ingredient.quantity === null) return ingredient;
    ingredient.quantity =
      ingredient.quantity * (servingNum / state.recipe.servings);
  });

  // 3) Set new serving number
  state.recipe.servings = servingNum;
}

export function addBookmark(recipe) {
  // Add Bookmark
  state.bookmarks.push(recipe);

  state.recipe.bookmarked = true;
}

export function removeBookmark(id) {
  // Delete Bookmark
  state.bookmarks.splice(
    state.bookmarks.findIndex(bookmark => bookmark.id === id),
    1
  );

  state.recipe.bookmarked = false;
}

export function persistBookmarks(role = 'set') {
  if (role === 'set')
    window.localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
  else state.bookmarks = JSON.parse(window.localStorage.bookmarks);

  // console.log(JSON.parse(window.localStorage.bookmarks));
}

export async function uploadRecipe(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ingredient => {
        const ingredientArr = ingredient[1].split(',').map(el => el.trim());
        if (ingredientArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the corrent format :)'
          );
        const [quantity, unit, description] = ingredientArr;
        return {
          quantity: quantity ? +quantity : null,
          unit: unit ? unit : '',
          description: description ? description : '',
        };
      });

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };

    const result = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    state.recipe = createRecipeObject(result);
    // Add Bookmark
    addBookmark(state.recipe);
    persistBookmarks();
  } catch (error) {
    throw error;
  }
}

function createRecipeObject(result) {
  const { recipe } = result.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
}

function init() {}

init();

function clearBookmarks() {
  window.localStorage.clear();
}
// clearBookmarks();
