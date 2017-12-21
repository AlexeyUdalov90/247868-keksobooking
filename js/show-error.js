'use strict';

(function () {
  window.showError = function (message) {
    var errorMessage = document.createElement('div');
    errorMessage.style.position = 'fixed';
    errorMessage.style.right = '20px';
    errorMessage.style.top = '20px';
    errorMessage.style.zIndex = '100';
    errorMessage.style.margin = '0';
    errorMessage.style.padding = '10px';
    errorMessage.style.fontSize = '18px';
    errorMessage.style.fontWeight = '700';
    errorMessage.style.color = 'rgb(255, 0, 0)';
    errorMessage.style.borderRadius = '10px';
    errorMessage.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
    errorMessage.textContent = message;

    document.body.insertAdjacentElement('afterbegin', errorMessage);

    setTimeout(function () {
      document.body.removeChild(errorMessage);
    }, 10000);
  };
})();
