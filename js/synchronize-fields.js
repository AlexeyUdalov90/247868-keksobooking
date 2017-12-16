'use strict';

(function () {

  window.synchronizeFields = function (field1, field2, array1, array2, callback) {
    var value = field1.value;
    for (var i = 0; i < array1.length; i++) {
      if (value === array1[i]) {
        value = array2[i];
        break;
      }
    }

    if (typeof callback === 'function') {
      callback(field2, value);
    }
  };
})();
