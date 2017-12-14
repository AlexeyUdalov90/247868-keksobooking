'use strict';

(function () {
  var pricesHouseroom = {
    flat: '1000',
    bungalo: '0',
    house: '5000',
    palace: '10000'
  };

  window.synchronizeFields = function (field1, field2, callback) {
    var value;
    if (pricesHouseroom[field1.value]) {
      value = pricesHouseroom[field1.value];
    } else {
      value = field1.value;
    }
    if (typeof callback === 'function') {
      callback(field2, value);
    }
  };
})();
