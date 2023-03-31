import icons from '../../img/icons.svg';
import View from './view';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerRender(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    return `${this._data.pageNumber === 1 ? '' : this._generatePreviewBtn()}
          ${
            this._data.pageNumber === this._data.maxPageNumber
              ? ''
              : this._generateNextBtn()
          }`;
  }

  _generatePreviewBtn() {
    return `
      <button class="btn--inline pagination__btn--prev" data-goto="${
        this._data.pageNumber - 1
      }">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._data.pageNumber - 1}</span>
      </button>`;
  }

  _generateNextBtn() {
    return `
      <button data-goto="${
        this._data.pageNumber + 1
      }" class="btn--inline pagination__btn--next" >
        <span>Page ${this._data.pageNumber + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;
  }
}

export default new PaginationView();
