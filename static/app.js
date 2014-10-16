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
        men = document.getElementsByClassName('men')[0];
        women = document.getElementsByClassName('women')[0];
        if (data.mens_occupied === true) {
          if (data.womens_occupied === true) {
            src = "/static/both_occupied.png";
          }
          else {
            src = "/static/men_occupied_women_empty.png";
          }
        }
        else {
          if (data.womens_occupied === true) {
            src = "/static/men_empty_women_occupied.png";
          }
          else {
            src="/static/both_empty.png";
          }
        }
        if (data.mens_occupied === true) {
          if (el_has_class(men, 'empty')) {
            remove_class_from_el(men, 'empty');
            add_class_to_el(men, 'occupied');
          }
          // men.style.backgroundColor = localStorage.occupied;
        }
        else {
          if (el_has_class(men, 'occupied')) {
            remove_class_from_el(men, 'occupied');
            add_class_to_el(men, 'empty');
          }
          // men.style.backgroundColor = localStorage.empty;
        }
        if (data.womens_occupied === true) {
          if (el_has_class(women, 'empty')) {
            remove_class_from_el(women, 'empty');
            add_class_to_el(women, 'occupied');
          }
          // women.style.backgroundColor = localStorage.occupied;
        }
        else {
          if (el_has_class(women, 'occupied')) {
            remove_class_from_el(women, 'occupied');
            add_class_to_el(women, 'empty');
          }
          // women.style.backgroundColor = localStorage.empty;
        }

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