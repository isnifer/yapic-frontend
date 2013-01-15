/*

5-e задание. Перебор слайдов осуществляется с помощью стрелок клавиатуры.

*/

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

};
