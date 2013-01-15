/*

6-е задание. Создание собственного события leftclick

*/

jQuery.event.special.leftclick = {
  setup: function() {
    var elem = this; $elem = jQuery(elem);
    $elem.bind('click', jQuery.event.special.leftclick.handler);
  },

  teardown: function() {
    var elem = this; $elem = jQuery(elem);
    $elem.unbind('click', jQuery.event.special.leftclick.handler);
  },

  handler: function(event){
    if (event.which == null) {
      if (event.button < 2) {
        event.type = 'leftclick';
        jQuery.event.handle.apply(this, arguments);
      }
    } else {
      if (event.which < 2 ) {
        event.type = 'leftclick';
        jQuery.event.handle.apply(this, arguments);
      }
    }
  }
};