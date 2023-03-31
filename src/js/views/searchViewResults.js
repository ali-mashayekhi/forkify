import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';
import View from './view';

class SearchViewResults extends View {
  _parentElement = document.querySelector('.results');

  //////////////////////////////////////////////
  /////////////// Methods /////////////////////
  /////////////////////////////////////////////

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new SearchViewResults();
