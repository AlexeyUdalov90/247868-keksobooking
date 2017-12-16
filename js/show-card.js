'use strict';

(function () {
  window.showCard = function (imageSrc) {
    var cards = document.querySelectorAll('.map .popup');
    for (var i = 0; i < cards.length; i++) {
      if (imageSrc === cards[i].querySelector('img').src) {
        var card = cards[i];
        card.classList.remove('hidden');
        document.addEventListener('keydown', window.card.escPressHandler);
        break;
      }
    }
    return card;
  };
})();
