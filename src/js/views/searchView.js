class SearchView {
  _parentEl = document.querySelector('.search');
  _formBtn = this._parentEl.querySelector('.search__btn');
  _formInput = this._parentEl.querySelector('.search__field');

  getQuery() {
    const searchedInput = this._formInput.value;
    this._clearInput();
    return searchedInput;
  }

  _clearInput() {
    this._formInput.value = '';
  }

  addHandlerRender(handler) {
    this._formBtn.addEventListener('click', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
