/*
* jQuery.presenter v.0.1
*
* by Anton Kuznetsov
*
*
* */


(function($) {

  $.fn.presenter = function(slide){

    //Define local variables
    var that = this,
        body = document.body,
        slideClass = (slide === undefined) ? '.slide' : slide;


    that.slides = document.querySelectorAll(slideClass);
    that.slideLen = that.slides.length;


    /* ------ Verifications ------- */

    /**
     * Check body class
     *
     * Return {Boolean}
     * */

    that._isView = function(){
      return !!(($(body).attr('class') === 'view'));
    };

    /**
     * Check History API
     *
     * Return {boolean}
     */
    that.isHistoryApi = function(){
      return !!(window.history && history.pushState);
    };


    /**
     * Check slide url in History
     *
     * Return {boolean}
     * */
    that.isHistoryHaveSlide = function(){
      return !!(history.state.slide);
    };

    /* -----  DOM Transformations ---- */

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
    *
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
    * Update Progress Bar
    * @private
    *
    * */
    that._updatePercentSlider = function(){
      var progressPercent = ((localStorage.currentSlide === 'main') ? 100 / that.slideLen : 100 / that.slideLen * (localStorage.currentSlide + 1));
      $('#bar').css('width', progressPercent);
    };


    /**
    * Make slideNumber is head in History API, then list (Esc keydown)
    *
    * */
    that.clearHistory = function(){
      if (that.isHistoryHaveSlide() && !that._isView()){
        history.pushState({slide: 'head'}, 'Head', '#head');
      }
    };


    /**
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
     *
     * */
    that.changeSlide = function(event, fromClick){

      // Define currentSlide by id
      var currentSlide = $('#' + localStorage.currentSlide);

      // Remove prev activeSlide
      currentSlide.removeClass('active');

      // Change Active Slide by keydown
      var keyChange = function(dir){
        if (dir === 'next'){
          var current = (currentSlide.attr('id') === $(slideClass + ':last').attr('id')) ? 'main' : currentSlide.next().attr('id');
        } else {
          current = (currentSlide.attr('id') === $(slideClass + ':first').attr('id')) ? $(slideClass + ':last').attr('id') : currentSlide.prev().attr('id');
        }
        return current;
      };

      // Change Active Slide by click
      var clickChange = function(fromClick){
        return fromClick;
      };

      // Check what handler start a function
      if (event){
        current = keyChange(event);
      } else if (fromClick){
        current = clickChange(fromClick);
      }


      // Set new currentSlide in Local Storage
      localStorage.setItem('currentSlide', current);


      // Set Slide ID to History API
      history.pushState({slide: localStorage.currentSlide}, 'Slide', '#' + localStorage.currentSlide);

      // Make slide is Active
      $('#' + localStorage.currentSlide).addClass('active');

      // Update ProgressBar & currentSlide in Local Storage
      that._updatePercentSlider();
      that._updateSlideNum();

    };

    /**
    * Check History and LocalStorage to load only necessary view (Slide or List of Slides)
    *
    * */
    that.onLoadDOM = function(){
      $('#' + localStorage.currentSlide).addClass('active');
      if (history.state === null){
        history.pushState({slide: 'head'}, '', '#head');
      }
      if (!that._isView() && history.state.slide !== 'head'){
        that.changeSlide(null, localStorage.currentSlide);
        that._updateBodyState();
      }
    };


    /* ------- Event Handlers ------ */


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