/**
 * @fileOverview sandbox functions.
 */

(function() {

  var templates;

  /**
   * Store templates.
   */
  var storeTemplates = function() {
    templates = {
      'controls': _.template(document.getElementById('controls-template').innerHTML)
    };
  };

  /**
   * On DOMContentLoaded.
   */
  var onDocumentLoaded = function() {
    storeTemplates();
  };

  /**
   * On message recieved.
   *
   * @param {Object} event
   */
  var onMessageRecieved = function(event) {
    var type = event.data.type
      , name = event.data.name;

    if (type === 'render') {
      event.source.postMessage({
        type: 'template',
        name: name,
        html: templates[name](event.data.context)
      }, event.origin);
    }
  };

  /**
   * Initialize.
   */
  (function() {
    document.addEventListener('DOMContentLoaded', onDocumentLoaded);
    window.addEventListener('message', onMessageRecieved);
  }());

}());
