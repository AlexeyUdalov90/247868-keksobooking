'use strict';

(function () {
  var LOAD_URL = 'https://1510.dump.academy/keksobooking/data';
  var SAVE_URL = 'https://1510.dump.academy/keksobooking';

  var createXhr = function (onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 20000;

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Время ожидания ответа ' + xhr.timeout + 'мс истекло');
    });

    return xhr;
  };

  window.backend = {
    load: function (onError) {
      var xhr = createXhr(onError);

      xhr.addEventListener('load', function () {
        switch (xhr.status) {
          case 200:
            window.backend.adverts = xhr.response;
            break;
          default:
            onError('Произошла ошибка загрузки: ' + xhr.status + xhr.statusText);
        }
      });

      xhr.open('GET', LOAD_URL);
      xhr.send();
    },

    save: function (data, onLoad, onError) {
      var xhr = createXhr(onError);

      xhr.addEventListener('load', function () {
        switch (xhr.status) {
          case 200:
            onLoad(xhr.response);
            break;
          default:
            onError('Произошла ошибка отправки: ' + xhr.status + xhr.statusText);
        }
      });

      xhr.open('POST', SAVE_URL);
      xhr.send(data);
    },

    adverts: []
  };
})();
