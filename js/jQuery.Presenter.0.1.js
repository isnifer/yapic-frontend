(function($) {

  $.fn.presenter = function(slide){

    //Define local variables
    var that = this;
    var body = document.body;

    that.slides = (slide !== undefined) ? document.querySelectorAll(slide) : document.querySelectorAll('.slide');
    that.slideLen = this.slides.length;
    that.current = (localStorage.currentSlide === 'undefined') ? 'main' : localStorage.currentSlide ;
    localStorage.setItem('currentSlide', that.current);


    /**
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


    /**
    * Check if body class="list"
    *
    * Return {Boolean}
    * */

    that._isView = function(){
      return !!(($(body).attr('class') === 'view'));
    };

    /**
    * Change body class view or list
    * @private
    * Return {string}
    * */
    that._updateBodyState = function(){
      body.className = (that._isView() === true) ? 'list' : 'view';
    };


    /**
    * Update Slide Number
    * @private
    *
    * */
    that._updateSlideNum = function(){
      var numpage = (localStorage.currentSlide === 'main') ? '' : localStorage.currentSlide;
      $('#numpage').html(numpage);
    };

    /**
    * Update percent slider
    * @private
    * */
    that._updatePercentSlider = function(){
      var progressPercent = ((localStorage.currentSlide === 'main') ? 100 / that.slideLen : 100 / that.slideLen * (localStorage.currentSlide + 1));
      $('#bar').css('width', progressPercent);
    };

    // Event Handlers


    // Scale Presenter when we Resize window
    $(window).bind('resize', function(){
      that._bodyTransform(that._getRatio());
    });

    /**
    * Binding event click and arrows
    *
    * */
    $('#next').on('click', function(e){
      e.preventDefault();
      var currentSlide = $('#' + localStorage.currentSlide);
          currentSlide.removeClass('active');

      var current = (currentSlide.attr('id') === $('.slide:last').attr('id')) ? 'main' : currentSlide.next().attr('id');
      localStorage.setItem('currentSlide', current);

      $('#' + localStorage.currentSlide).addClass('active');
      that._updatePercentSlider();
      that._updateSlideNum();

    });

    /**
     * Binding keydown for left(37), up(38), right(39), down(40), Esc(27)
     *
     */
    document.addEventListener('keydown', function(e){
      e.preventDefault();
      switch (e.keyCode){
        case 37:
          console.log('left');
          break;
        case 38:
          console.log('top');
          break;
        case 39:
          console.log('right');
          that._updatePercentSlider();
          that._updateSlideNum();
          break;
        case 40:
          console.log('bottom');
          break;
        case 27:
          that._updateBodyState();
          break;
        default:
          return false;
      }
    });

  };

})(jQuery);