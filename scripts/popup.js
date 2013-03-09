/**
 * @fileOverview popup functions.
 */

(function($, _) {

  /**
   * On DOMContentLoaded.
   */
  var onDocumentLoaded = function() {
    var popup = new window.PopupView();

    $('body').append(popup.el);
  };

  /**
   * Initialize.
   */
  (function() {
    document.addEventListener('DOMContentLoaded', onDocumentLoaded);
  }());

}(jQuery, _));
