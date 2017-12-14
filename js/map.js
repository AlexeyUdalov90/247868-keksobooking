'use strict';
(function () {
  var SHIFT_MAINPIN_X = 3;
  var SHIFT_MAINPIN_Y = 45;
  var UP_LIMIT_Y = 100;
  var DOWN_LIMIT_Y = 655;
  var advertsList = window.data.createAdverts(8);
  var fragmentPins = document.createDocumentFragment();
  var fragmentCard = document.createDocumentFragment();
  var map = document.querySelector('.map');
  var mapPinsBlock = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var advertForm = document.querySelector('.notice__form');
  var inputAddress = advertForm.querySelector('#address');

  advertsList.forEach(function (advert) {
    fragmentPins.appendChild(window.pin.render(advert));
    fragmentCard.appendChild(window.card.render(advert));
  });

  mapPinsBlock.insertBefore(fragmentPins, mainPin);
  map.insertBefore(fragmentCard, map.querySelector('.map__filters-container'));

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var coordY = mainPin.offsetTop - shift.y;
      if (coordY < UP_LIMIT_Y) {
        mainPin.style.top = UP_LIMIT_Y + 'px';
      } else if (coordY > DOWN_LIMIT_Y) {
        mainPin.style.top = DOWN_LIMIT_Y + 'px';
      } else {
        mainPin.style.top = coordY + 'px';
      }
      mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
      inputAddress.value = 'x: ' + (parseFloat(mainPin.style.left) - SHIFT_MAINPIN_X) + ', y: ' + (parseFloat(mainPin.style.top) + SHIFT_MAINPIN_Y);
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      map.removeEventListener('mousemove', mouseMoveHandler);
      map.removeEventListener('mouseup', mouseUpHandler);
    };

    map.addEventListener('mousemove', mouseMoveHandler);
    map.addEventListener('mouseup', mouseUpHandler);
  });

})();
