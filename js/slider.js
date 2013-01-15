function Slider(elem){

  this.elem = elem;
  this.children = this.elem.find('.slide');
  this.slideWidth = this.children.width();
  this.slideLength = this.children.length;

  this.elem.width(this.slideWidth * this.slideLength + ((this.slideLength + 1) * 8));
  this.children.width(this.slideWidth);

  this.current = 0;

}

Slider.prototype.setCurrent = function (dir){

  //Write value
  var pos = this.current;

  //Change if arrow keydown
  pos += ( ~~( dir === 'next' ) || ~~( -(dir === 'prev') ) );

  //Rewrite Current Value
  this.current = (pos < 0) ? this.slideLength - 1 : pos % this.slideLength;

  //Write id for DOM
  var activeSlide = $('#item-' + this.current);

  //Make Active and big
  activeSlide.addClass('view').siblings().removeClass('view');
  $('#active').html(activeSlide.html());

  /*this.children.on('click', function(){
    $(this).addClass('view').siblings().removeClass('view');
    $('#active').html($(this).html());

    this.current = function (){
      var qq = document.getElementsByClassName('slide'),
        qq2 = document.getElementsByClassName('view');

      for (i=0; i<qq.length; i++){
        if (qq[i] === qq2[0]){
          var f = i;
        }
      }
      return f;
    };
    return i;
  });*/
};
