(function($) {

  $.fn.presenter = function(slide){

    //Define local variables
    var that = this,
        body = document.body,
        slideClass = (slide === undefined) ? '.slide' : slide;


    that.slides = document.querySelectorAll(slide);
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
      body.className = (that._isView()) ? 'list' : 'view';
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
     * Check History API
     *
     * Return {boolean}
     */
    that.isHistoryApi = function(){
      return !!(window.history && history.pushState);
    };


    /*
    * Check slide url in History
    *
    * Return {boolean}
    * */
    that.isHistoryHaveSlide = function(){
      return !!(history.state.slide);
    };


    /*
    * Make slideNumber is head, then list (Esc keydown)
    *
    * */
    that.clearHistory = function(){
      if (that.isHistoryHaveSlide() && !that._isView()){
        history.pushState({slide: 'head'}, 'Head', '#head');
      }
    };


    /*
    * Dive in to slide by Enter key
    *
    * */
    that.intoSlide = function(){
      if (!that._isView()){
        that._updateBodyState();
      }
    };

    /**
     * View Slide by click
     *
     */
    that.viewByClick = function(elem){
      if (!that._isView()){
        that.changeSlide(null, elem.attr('id'));
        that._updateBodyState();
      }
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
          var current = (currentSlide.attr('id') === $(slideClass + ':last').attr('id')) ? 'main' : currentSlide.next().attr('id');
        } else {
          current = (currentSlide.attr('id') === $(slideClass + ':first').attr('id')) ? $(slideClass + ':last').attr('id') : currentSlide.prev().attr('id');
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

      // Set new currentSlide in Local Storage
      localStorage.setItem('currentSlide', current);

      // Set Slide ID to History API

      history.pushState({slide: localStorage.currentSlide}, 'Slide', '#' + localStorage.currentSlide);

      $('#' + current).addClass('active');
      that._updatePercentSlider();
      that._updateSlideNum();

    };

    /*
    * Check History and LocalStorage to load only necessary view (Slide or List of Slides)
    *
    * */
    that.onLoadDOM = function(){
      that.setCurrent();
      $('#' + localStorage.currentSlide).addClass('active');
      if (!that._isView() && history.state.slide !== 'head'){
        that.changeSlide(null, localStorage.currentSlide);
        that._updateBodyState();
      }
    };


    /*
    * Event Handlers
    *
    * */


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
          that.changeSlide('prev', null);
          break;
        case 39:
        case 40:
          that.changeSlide('next', null);
          break;
        case 27:
          that._updateBodyState();
          that.clearHistory();
          break;
        case 13:
          that.intoSlide();
          that.changeSlide(null, localStorage.currentSlide);
          break;
        default:
          return false;
      }
    });

    // Activate elem by click
    $(slideClass).on('click', function(){
       that.viewByClick($(this));
    });

    //Define some default values then page load done
    that.onLoadDOM();

  };

})(jQuery);