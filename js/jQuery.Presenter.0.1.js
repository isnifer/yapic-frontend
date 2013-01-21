(function($) {

  $.fn.presenter = function(slide){

    //Define local variables
    var that = this;
    var body = document.body;

    that.slides = (slide !== undefined) ? document.querySelectorAll(slide) : document.querySelectorAll('.slide');
    that.slideLen = this.slides.length;

    that.setCurrent = function(){
      that.current = (localStorage.currentSlide === 'undefined') ? 'main' : localStorage.currentSlide ;
      localStorage.setItem('currentSlide', that.current);
    };


    /**
     * Check body class
     *
     * Return {Boolean}
     * */

    that._isView = function(){
      return !!(($(body).attr('class') === 'view'));
    };

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


    /**
    * Change body class view or list
    * @private
    * Return {string}
    * */
    that._updateBodyState = function(){
      body.className = (that._isView() === true) ? 'list' : 'view';
      var state = (body.className === 'view') ? that._getRatio() : 'none';
      that._bodyTransform(state);
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


    /**
     * Change slide on keydown arrows
     * @private
     * */
    that.changeSlide = function(event, fromClick){

      var currentSlide = $('#' + localStorage.currentSlide);
          currentSlide.removeClass('active');

      var keyChange = function(dir){
        if (dir === 'next'){
          var current = (currentSlide.attr('id') === $('.slide:last').attr('id')) ? 'main' : currentSlide.next().attr('id');
        } else {
          current = (currentSlide.attr('id') === $('.slide:first').attr('id')) ? $('.slide:last').attr('id') : currentSlide.prev().attr('id');
        }
        return current;
      };

      var clickChange = function(fromClick){
        return fromClick;
      };

      if (event){
        current = keyChange(event);
      } else if (fromClick){
        current = clickChange(fromClick);
      }

      localStorage.setItem('currentSlide', current);



      $('#' + current).addClass('active');
      that._updatePercentSlider();
      that._updateSlideNum();

    };

    // Event Handlers


    // Scale Presenter when we Resize window
    $(window).bind('resize', function(){
      var state = (body.className === 'view') ? that._getRatio() : 'none';
      that._bodyTransform(state);
    });

    /**
     * Binding keydown for left(37), up(38), right(39), down(40), Esc(27)
     *
     */
    document.addEventListener('keydown', function(e){
      switch (e.keyCode){
        case 37:
        case 38:
          console.log('top or left');
          that.changeSlide('prev', null);
          break;
        case 39:
        case 40:
          console.log('right or bottom');
          that.changeSlide('next', null);
          break;
        case 27:
          that._updateBodyState();
          break;
        default:
          return false;
      }
    });

    if ($('.list .slide').attr('id') === localStorage.currentSlide){
      $('#' + localStorage.currentSlide).addClass('active');
    }


    // Activate elem by click
    $('.list .slide').on('click', function(e){
      e.preventDefault();
      that.changeSlide(null, $(this).attr('id'));
      if (that._isView() === false){
        that._updateBodyState();
      }
    })

  };

})(jQuery);