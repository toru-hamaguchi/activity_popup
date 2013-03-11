/**
 * @fileOverview background functions.
 */

(function(exports) {

  var templates = {};
  var tabs = new window.TabCollection();

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
        var newTab = new window.TabModel(tab);
        newTab.set({
          activities: new window.ActivityCollection()
        });
        window.tabs.add(newTab);
      }
    );

    /* On updated. */
    chrome.tabs.onUpdated.addListener(
      function(tabId, changeInfo, tab) {
        var currentTab = window.tabs.find(function(tab) {
          return tab.id === tabId;
        });
        if (currentTab) {
          /* Update tab data. */
          currentTab.set(tab);
        }
      }
    );

    /* On removed. */
    chrome.tabs.onRemoved.addListener(
      function(tabId, removeInfo) {
        var currentTab = window.tabs.find(function(tab) {
          return tab.id === tabId;
        });
        if (currentTab) {
          window.tabs.remove(currentTab);
        }
      }
    );
  };

  /**
   * Set request event handler.
   */
  var setRequestEvents = function() {
    /* On before request. */
    chrome.webRequest.onBeforeRequest.addListener(
      updateRequestData,
      { urls: ['<all_urls>'] },
      [ 'blocking' ]
    );

    /* On completed. */
    chrome.webRequest.onCompleted.addListener(
      updateRequestData,
      { urls: ['<all_urls>'] },
      [ 'responseHeaders' ]
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
      window.templates[name] = event.data.body;
    }
    if (type === 'copy') {
      sendTextToClipboard(event.data.body);
    }
  };

  /**
   * Update request data.
   *
   * @param {Object} details
   */
  var updateRequestData = function(details) {
    var tabId = details.tabId
      , currentTab;

    /* Check invalid tab id. */
    if (tabId === undefined || tabId < 0) {
      return;
    }

    /* Find the tab model from stored collection. */
    currentTab = window.tabs.find(function(tab) {
      return tab.id === tabId;
    });

    if (currentTab === undefined) {
      /* Add a new tab model to collection. */
      currentTab = new window.TabModel({
        id: tabId,
        activities: new window.ActivityCollection()
      });
      window.tabs.add(currentTab);

      /**
       * Set tab data to the new model.
       *
       * TODO: Sometimes chrome.tabs.get() reports error.
       * @see https://code.google.com/p/chromium/issues/detail?id=93646
       */
      chrome.tabs.get(tabId, function(tab) {
        currentTab.set(tab);
      });
    }

    /* Add the request data to activity collection. */
    currentTab.get('activities').addRequest(details);
  };

  /**
   * Initialize.
   */
  (function() {
    window.addEventListener('load', onWindowLoaded);
    window.addEventListener('message', onMessageRecieved);
    setTabEvents();
    setRequestEvents();
  }());

  /* Exports. */
  exports.templates = templates;
  exports.tabs = tabs;

}(window));
