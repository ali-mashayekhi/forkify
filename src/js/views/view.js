import icons from '../../img/icons.svg';

export default class View {
  // Properties
  _data;
  _parentElement;
  _errorMessage = 'No recipes found for your query. Please try again!';
  _successMessage = '';

  //////////////////////////////////////////////
  /////////////// Methods /////////////////////
  /////////////////////////////////////////////

  /**
   * Render the recived object to the DOM
   * @param {object | object[]} data the data to be rendered
   * @param {boolean} render if false create markup string instead of rendering to the DOM
   * @returns {undefined | string } a markup string is returned if render = false
   * @author Ali Mashayekhi
   * @this {object} View instance
   * @todo finish implementation
   */
  render(data, render = true) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // Based My Knowledge
    // const newMarkup = document.createElement('div');
    // newMarkup.innerHTML = this._generateMarkup();
    // const newElement = Array.from(newMarkup.querySelectorAll('*'));

    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    newElements.forEach((newEl, i) => {
      const currEl = currentElements[i];

      // We check first child of all nodes that always are a text node or null, then we trim it to remove wide spaces so all texts with content will remain
      if (
        !newEl.isEqualNode(currEl) &&
        newEl.firstChild &&
        newEl.firstChild?.nodeValue.trim() !== ''
      )
        currEl.firstChild.textContent = newEl.firstChild.textContent;

      if (
        !newEl.isEqualNode(currEl) &&
        newEl.attributes !== currEl.attributes
      ) {
        Array.from(newEl.attributes).forEach(attribute => {
          currEl.setAttribute(attribute.name, attribute.value);
        });
      }
    });
  }

  renderSpinner() {
    const spinnerMarkup = `
    <div class="spinner">
    <svg>
    <use href="${icons}#icon-loader"></use>
    </svg>
    </div> `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', spinnerMarkup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderError(message = this._errorMessage) {
    const errorMarkup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', errorMarkup);
  }

  renderSuccessMessage(message = this._successMessage) {
    const successMarkup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', successMarkup);
  }
}
