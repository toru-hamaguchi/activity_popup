/**
 * @fileOverview options functions.
 */

(function() {

  /**
   * On DOMContentLoaded.
   */
  var onDocumentLoaded = function() {
    var options = new window.OptionsView();

    document.body.appendChild(options.el);
  };

  /**
   * Initialize.
   */
  (function() {
    document.addEventListener('DOMContentLoaded', onDocumentLoaded);
  }());

}());
