'use strict';

(function () {
  var advertForm = document.querySelector('.notice__form');
  var fieldsetsNoticeForm = advertForm.querySelectorAll('fieldset');
  var selectTimeIn = advertForm.querySelector('#timein');
  var selectTimeOut = advertForm.querySelector('#timeout');
  var selectType = advertForm.querySelector('#type');
  var inputPrice = advertForm.querySelector('#price');
  var selectRooms = advertForm.querySelector('#room_number');
  var selectCapacity = advertForm.querySelector('#capacity');
  var inputTitle = advertForm.querySelector('#title');
  var pricesHouseroom = {
    flat: 1000,
    bungalo: 0,
    house: 5000,
    palace: 10000
  };

  var syncSelect = function (select, value) {
    for (var i = 0; i < select.options.length; i++) {
      if (select.options[i].value === value) {
        select.selectedIndex = -1;
        select.options[i].selected = true;
        break;
      }
    }
  };

  var changeSelectOptions = function () {
    var valueRoom = selectRooms.value;
    window.util.disableItems(selectCapacity.options, false);
    for (var i = 0; i < selectCapacity.options.length; i++) {
      var itemCapacity = selectCapacity.options[i];
      var valueCapacity = itemCapacity.value;
      if (valueRoom === '100' && valueCapacity === '0') {
        itemCapacity.selected = true;
      } else if (valueRoom >= valueCapacity && valueRoom !== '100' && valueCapacity !== '0') {
        itemCapacity.selected = true;
      } else {
        itemCapacity.disabled = true;
      }
    }
  };

  var changeMinValue = function (input, value) {
    input.min = value;
  };


  window.util.disableItems(fieldsetsNoticeForm, true);

  selectTimeIn.addEventListener('change', function () {
    syncSelect(selectTimeOut, selectTimeIn.value);
  });

  selectTimeOut.addEventListener('change', function () {
    syncSelect(selectTimeIn, selectTimeOut.value);
  });

  selectType.addEventListener('change', function () {
    changeMinValue(inputPrice, pricesHouseroom[selectType.value]);
  });

  selectRooms.addEventListener('change', function () {
    changeSelectOptions(selectCapacity, selectRooms.value);
  });


  inputPrice.addEventListener('invalid', function () {
    if (inputPrice.validity.rangeUnderflow) {
      inputPrice.setCustomValidity('Цена за ночь должна быть больше чем ' + inputPrice.min);
      window.util.drawColorBorder(inputPrice, 'red');
    } else if (inputPrice.validity.rangeOverflow) {
      inputPrice.setCustomValidity('Цена за ночь не должна быть больше чем ' + inputPrice.max);
      window.util.drawColorBorder(inputPrice, 'red');
    } else if (inputPrice.validity.valueMissing) {
      inputPrice.setCustomValidity('Поле обязательно для заполнения');
      window.util.drawColorBorder(inputPrice, 'red');
    } else {
      inputPrice.setCustomValidity('');
    }
  });

  inputTitle.addEventListener('invalid', function () {
    if (inputTitle.validity.tooShort) {
      inputTitle.setCustomValidity('Заголовок должен состоять минимум из ' + inputTitle.minlength + ' символов');
      window.util.drawColorBorder(inputTitle, 'red');
    } else if (inputTitle.validity.tooLong) {
      inputTitle.setCustomValidity('Заголовок должен состоять максимум из ' + inputTitle.maxlength + ' символов');
      window.util.drawColorBorder(inputTitle, 'red');
    } else if (inputTitle.validity.valueMissing) {
      inputTitle.setCustomValidity('Поле обязательно для заполнения');
      window.util.drawColorBorder(inputTitle, 'red');
    } else {
      inputTitle.setCustomValidity('');
    }
  });

  inputPrice.addEventListener('change', function () {
    window.util.drawColorBorder(inputPrice, '');
  });

  inputTitle.addEventListener('change', function () {
    window.util.drawColorBorder(inputTitle, '');
  });

  document.addEventListener('DOMContentLoaded', function () {
    changeSelectOptions(selectCapacity, selectRooms.value);
    changeMinValue(inputPrice, pricesHouseroom[selectType.value]);
  });

})();
