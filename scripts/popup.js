/**
 * @fileOverview popup functions.
 */

(function($, _) {

  /**
   * On DOMContentLoaded.
   */
  var onDocumentLoaded = function() {
    var background = chrome.extension.getBackgroundPage()
      , popup = new background.PopupView();

    $('body').append(popup.el);
  };

  /**
   * Initialize.
   */
  (function() {
    document.addEventListener('DOMContentLoaded', onDocumentLoaded);
  }());

}(jQuery, _));
