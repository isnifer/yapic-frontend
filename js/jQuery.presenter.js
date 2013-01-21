function Slider(elem){

  this.elem = elem;
  this.children = this.elem.find('.slide');
  this.slideLength = this.children.length;

  this.current = 0;

  this.setCurrent(this.current);

}

Slider.prototype.setCurrent = function (dir){

  //Write value
  var pos = this.current;

  if ( dir === 'next' || 'prev') {
    //Change if arrow keydown
    pos += ( ~~( dir === 'next' ) || ~~( -(dir === 'prev') ) );
  } else {
    pos = dir;
  }

  //Rewrite Current Value
  this.current = (pos < 0) ? this.slideLength - 1 : pos % this.slideLength;

  //Write id for DOM
  var activeSlide = $('#' + this.current);

  //Value for ProgressBar
  var progressBar = $('#percent'), numslide = $('#numslide'),
      progressPercent= 100 / this.slideLength * (this.current + 1) ;

  //Make Active and big
  activeSlide.addClass('view').siblings().removeClass('view');
  $('#active').html(activeSlide.html());
  progressBar.css({width: progressPercent + '%'});
  numslide.html(this.current + 1);

};

Slider.prototype.clickChange = function (elem){

  var qq = document.getElementsByClassName('slide');

  for (var i=0; i<qq.length; i++){
    if (qq[i] === elem){
      break;
    }
  }

  return i;

};



(function( $ ) {

  $.fn.presenter = function() {

    var present = new Slider(this);

    present.children.on('click', function(){
      $(this).addClass('view').siblings().removeClass('view');
      present.current = present.clickChange(this);
      present.setCurrent(present.current);
      $(this).parent().fadeOut();
    });

    $(document).bind('keydown', function(e){
      switch(e.keyCode)
      {
        case 37:
          var dir = 'prev';
          break;
        case 38:
          dir = 'prev';
          break;
        case 39:
          dir = 'next';
          break;
        case 40:
          dir = 'next';
          break;
        case 27:
          present.elem[0].style.display = (present.elem[0].style.display == 'none') ? 'block' : 'none';
          break;
        default:
          break;
      }
      present.setCurrent(dir);
    });

  };

})(jQuery);
