/**
 * @fileOverview popup functions.
 */

(function() {

  /**
   * On DOMContentLoaded.
   */
  var onDocumentLoaded = function() {
    var popup = new window.PopupView();

    document.body.appendChild(popup.el);
  };

  /**
   * Initialize.
   */
  (function() {
    document.addEventListener('DOMContentLoaded', onDocumentLoaded);
  }());

}());
