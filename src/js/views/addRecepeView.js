import View from './view';
import icons from '../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _submitBtn = document.querySelector('.upload__btn');
  _successMessage = 'Recipe Was Successfully Uploaded :)';

  constructor() {
    super();
    this.addHandlerShow();
    this.addHandlerHide();
  }

  toggleModal() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  addHandlerShow() {
    this._btnOpen.addEventListener('click', this.toggleModal.bind(this));
  }

  addHandlerHide() {
    [this._btnClose, this._overlay].forEach(el => {
      el.addEventListener('click', this.toggleModal.bind(this));
    });
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }
}

export default new AddRecipeView();
