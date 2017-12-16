'use strict';
(function () {
  var SHIFT_MAINPIN_X = 3;
  var SHIFT_MAINPIN_Y = 45;
  var UP_LIMIT_Y = 100;
  var DOWN_LIMIT_Y = 655;
  var LEFT_LIMIT_X = 3;
  var RIGHT_LIMIT_X = 1197;
  var AMOUNT_ADVERT = 8;
  var map = document.querySelector('.map');
  var mapPinsBlock = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var advertForm = document.querySelector('.notice__form');
  var inputAddress = advertForm.querySelector('#address');

  var successHandler = function (adverts) {
    var fragmentPins = document.createDocumentFragment();
    var fragmentCard = document.createDocumentFragment();

    for (var i = 0; i < AMOUNT_ADVERT; i++) {
      fragmentPins.appendChild(window.pin.render(adverts[i]));
      fragmentCard.appendChild(window.card.render(adverts[i]));
    }

    mapPinsBlock.insertBefore(fragmentPins, mainPin);
    map.insertBefore(fragmentCard, map.querySelector('.map__filters-container'));
  };

  var errorHandler = function (message) {
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

  var getCoordY = function (y) {
    if (y < UP_LIMIT_Y) {
      return UP_LIMIT_Y;
    } else if (y > DOWN_LIMIT_Y) {
      return DOWN_LIMIT_Y;
    }
    return y;
  };

  var getCoordX = function (x) {
    if (x < LEFT_LIMIT_X) {
      return LEFT_LIMIT_X;
    } else if (x > RIGHT_LIMIT_X) {
      return RIGHT_LIMIT_X;
    }
    return x;
  };

  window.backend.load(successHandler, errorHandler);

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

      mainPin.style.top = getCoordY(mainPin.offsetTop - shift.y) + 'px';
      mainPin.style.left = getCoordX(mainPin.offsetLeft - shift.x) + 'px';

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
