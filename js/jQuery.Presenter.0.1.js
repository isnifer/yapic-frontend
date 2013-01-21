(function($) {

  $.fn.presenter = function(slide){

    //Define local variables
    var that = this;
    var body = document.body;

    that.slides = (slide !== undefined) ? document.querySelectorAll(slide) : document.querySelectorAll('.slide');
    that.slideLen = this.slides.length;
    that.current = (localStorage.currentSlide !== undefined) ? localStorage.currentSlide : 'main';


    console.log('Текущий слайд', that.current);


    /*
    * Get ResizeRatio for Body
    *
    * @returns {String}
    * */
    that._getRatio = function() {

      var resizeRatio = Math.max(
        body.clientWidth / window.innerWidth,
        body.clientHeight / window.innerHeight
      );

      return 'scale(' + (1 / resizeRatio) + ')';
    };

    /**
     * Transform Body with ResizeRatio
     *
     * @returns {Boolean}
     */
    that._bodyTransform = function(transform) {
      body.style.WebkitTransform = transform;
      body.style.MozTransform = transform;
      body.style.msTransform = transform;
      body.style.OTransform = transform;
      body.style.transform = transform;

      return true;
    };

    that._bodyTransform(that._getRatio());



    // Вешаем обработчики событий


    //Scale Presenter when we Resize window
    $(window).bind('resize', function(){
      that._bodyTransform(that._getRatio());
    });

    $('#' + localStorage.currentSlide).addClass('active');

    $('#next').on('click', function(e){
      e.preventDefault();
      var currentSlide = $('#' + localStorage.currentSlide);
      currentSlide.removeClass('active');
      var current = (currentSlide.attr('id') === $('.slide:last').attr('id')) ? 'main' : currentSlide.next().attr('id');
      localStorage.setItem('currentSlide', current);
      $('#' + localStorage.currentSlide).addClass('active');
    });

  };

})(jQuery);