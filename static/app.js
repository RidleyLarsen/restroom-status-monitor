function el_has_class(el, className) {
  return el.classList.contains(className);
}

function remove_class_from_el(el, className) {
  if (el.classList)
    el.classList.remove(className);
  else
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

function add_class_to_el(el, className) {
  if (el.classList)
    el.classList.add(className);
  else
    el.className += ' ' + className;
}

function hex_to_rgb(hex) {
    if (hex[0] == "#") hex = hex.substr(1, 6);
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return r + "," + g + "," + b;
}

function update_last_updated_time() {
  document.querySelector('.ajax-last-updated').innerHTML =
    'Last updated at ' + new Date().toLocaleTimeString();
}

function after_update_attempt(favicon_src, updating_or_error_text) {
  clearTimeout(updating_text);
  clearTimeout(taking_too_long_favicon);
  changeFavicon(favicon_src);
  document.querySelector('.ajax-updating-or-error').innerHTML =
    updating_or_error_text;
}

function update_status() {
  var delay_in_seconds = 3;

  setTimeout(function () {
    updating_text = setTimeout(function() {
      document.querySelector('.ajax-updating-or-error').innerHTML =
        'Updating...';
    }, 250);

    taking_too_long_favicon = setTimeout(function() {
      changeFavicon('error');
    }, 1000);

    request = new XMLHttpRequest();
    request.open('GET', '/status', true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400){
        // Success!
        data = JSON.parse(request.responseText);
        fill_style = {
          true: "rgb(" + hex_to_rgb(localStorage.occupied) + ")",
          false: "rgb(" + hex_to_rgb(localStorage.empty) + ")"
        };
        text_content = {
          true: "In Use",
          false: "Open"
        };
        men = document.getElementsByClassName('men')[0];
        women = document.getElementsByClassName('women')[0];
        men_text = document.getElementById('men_text');
        women_text = document.getElementById('women_text');

        if (data.mens_occupied === true) {
          if (el_has_class(men, 'empty')) {
            remove_class_from_el(men, 'empty');
            add_class_to_el(men, 'occupied');
          }
        }
        else {
          if (el_has_class(men, 'occupied')) {
            remove_class_from_el(men, 'occupied');
            add_class_to_el(men, 'empty');
          }
        }
        men_text.innerHTML = text_content[data.mens_occupied];
        context.fillStyle = fill_style[data.mens_occupied];
        context.fillRect(0, 0, 25, 50); // Fill men section

        if (data.womens_occupied === true) {
          if (el_has_class(women, 'empty')) {
            remove_class_from_el(women, 'empty');
            add_class_to_el(women, 'occupied');
          }
        }
        else {
          if (el_has_class(women, 'occupied')) {
            remove_class_from_el(women, 'occupied');
            add_class_to_el(women, 'empty');
          }
        }
        women_text.innerHTML = text_content[data.womens_occupied];
        context.fillStyle = fill_style[data.womens_occupied];
        context.fillRect(25, 0, 25, 50); // Fill women section
        src = canvas.toDataURL();
        after_update_attempt(src, '');
        update_last_updated_time();
      } else {
        // We reached our target server, but it returned an error

        after_update_attempt(
          'error',
          'Error (' + request.status + '). Trying again in ' +
            delay_in_seconds + ' seconds...'
        );
      }
      update_status();
    };
    request.onerror = function() {
      // There was a connection error of some sort

      after_update_attempt(
        'error',
        'Unknown error. It is most likely a problem with your ' +
          'connection or the server. Trying again in ' +
          delay_in_seconds + ' seconds...'
      );

      update_status();
    };

    request.send();
  }, delay_in_seconds * 1000);
}
canvas = document.body.appendChild(document.createElement('canvas'));
context = canvas.getContext('2d');
context.canvas.height = 50;
context.canvas.width = 50;
content_el = document.getElementsByClassName('st-container')[0];
btn_el = document.getElementById('settings-btn');
btn_el.addEventListener('click', function () {
  if (el_has_class(content_el, 'st-menu-open')) {
    remove_class_from_el(content_el, 'st-menu-open');
  }
  else {
    add_class_to_el(content_el, 'st-menu-open');
  }
});
menu_close_el = document.getElementById('menu-close-btn');
menu_close_el.addEventListener('click', function () {
  if (el_has_class(content_el, 'st-menu-open')) {
    remove_class_from_el(content_el, 'st-menu-open');
  }
});
update_last_updated_time();
update_status();