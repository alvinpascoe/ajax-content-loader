(function($){

  Drupal.behaviors.ajaxContentLoaderInit = {
    attach: function (context, settings){

      // Add the class 'ajaxloader-processed' to the 'body' element after first invocation
      // and prevent further invocations.
      $('body', context).once('ajaxloader', function(){

        // Create a custom event that will trigger additional AJAX processing
        $(document).on('beforeAjaxProcess', function(event, selector) {
          $(selector).addClass('js-ajax-loading');
          $(selector).removeClass('js-ajax-loaded');
        });

        // Create a custom event that will trigger additional AJAX processing
        $(document).on('afterAjaxProcess', function(event, newPage) {

          // Update URL to new node URL
          setUrl(newPage.url);

          // Update title
          setTitleMeta(newPage.title);

          // Update classes
          $(newPage.selector).removeClass('js-ajax-loading');
          $(newPage.selector).addClass('js-ajax-loaded');

          /**
           * Helper function
           * Update URL and add new URL to browser history
           */
          function setUrl(newUrl){
            window.history.pushState({path:newUrl},'',newUrl);
          }

          /**
           * Update HTML Meta title
           */
          function setTitleMeta(newTitle){

            // Get title and split it based on '|' separator.
            var $titleText = $('title').text();
            var currentTitle = $titleText.split('|');

            // Replace old title with new title
            $('title').text($titleText.replace(currentTitle[0], newTitle + ' '));
          }

        });


      });
    }
  };

  /**
  * Force a page refresh when browser history is navigated
  */
  Drupal.behaviors.ajaxContentLoaderForceRefresh = {
    attach: function (context, settings){

      $(window, context).on('popstate', function() {
        window.location.reload(true);
      });
    }
  };

  /**
   * On hover, display the aliased href of the AJAX link,
   * hide the '.../nojs/...' href
   */
  Drupal.behaviors.ajaxContentLoaderAliasedLinks = {
    attach: function (context, settings){
      var $linkList = $('.js-ajax-loader');

      // Display AJAX links, hide non-AJAX links
      $linkList.find('a').show();
      $linkList.find('a.no-js').hide();

      $('.js-ajax-loader', context).once('ajaxloader-links', function(){
        $linkList.on({
          mouseenter: function () {
            // Get URL and replace link href
            var aliasedUrl = $(this).attr('data-url');
            $(this).attr('href', aliasedUrl);
          },
          mouseleave: function () {
            // Get nid and replace href
            var nid = $(this).attr('data-node');
            $(this).attr('href', '/blog/ajax/nojs/'+nid);
          }
        }, 'a');
      });
    }
  };

})(jQuery);
