/**
 * @fileOverview background functions.
 */

(function(exports) {

  var tabCollection;

  /**
   * Send text to clipboard.
   *
   * @param {String} text to send.
   */
  var sendTextToClipboard = function(text) {
    /* Set textarea for copy. */
    var copyBuffer = document.querySelector('#copy-buffer');
    copyBuffer.value = text;
    copyBuffer.select();

    document.execCommand('copy', false, null);
  };

  /**
   * Set tab event handler.
   */
  var setTabEvents = function() {
    /* On created. */
    chrome.tabs.onCreated.addListener(
      function(tab) {
        window.tabCollection.init(tab.id);
      }
    );

    /* On removed. */
    chrome.tabs.onRemoved.addListener(
      function(tabId, removeInfo) {
        window.tabCollection.remove(tabId);
      }
    );
  };

  /**
   * On window loaded.
   */
  var onWindowLoaded = function() {
    var iframe = document.getElementById('sandbox');

    /* Do unsafe functions. */
    iframe.contentWindow.postMessage({
      type: 'render',
      name: 'controls',
      context: {
        selectAll: chrome.i18n.getMessage('selectAll'),
        copyToClipboard: chrome.i18n.getMessage('copyToClipboard')
      }
    }, '*');
  };

  /**
   * On message recieved.
   *
   * @param {Object} event
   */
  var onMessageRecieved = function(event) {
    var type = event.data.type
      , name = event.data.name;

    if (type === 'template') {
      window.templates[name] = event.data.html;
    }
    if (type === 'copy') {
      sendTextToClipboard(event.data.text);
    }
  };

  /**
   * Initialize.
   */
  (function() {
    window.templates = {};

    setTabEvents();
    window.addEventListener('load', onWindowLoaded);
    window.addEventListener('message', onMessageRecieved);

    /* Create a tab collection object. */
    tabCollection = new window.TabCollection();

    /* Observe requests. */
    chrome.webRequest.onBeforeRequest.addListener(
      function(details) {
        tabCollection.add(details.tabId, new window.ActivityModel(details));
      },
      { urls: ['<all_urls>'] },
      [ 'blocking' ]
    );
  }());

  exports.tabCollection = tabCollection;

}(window));
