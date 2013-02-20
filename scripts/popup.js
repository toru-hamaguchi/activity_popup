/**
 * @fileOverview popup functions.
 */

(function($) {

  var background;

  /**
   * On 'Select all' clicked.
   */
  var onSelectAllClicked = function() {
    $('#activity')
      .find('option')
        .prop('selected', true)
      .end()
      /* Fire event. */
      .find('select')
        .trigger('focus')
        .trigger('change')
    ;
  };

  /**
   * On 'Copy to clipboard' clicked.
   */
  var onCopyToClipboardClicked = function() {
    var $selected = $('#activity option:selected')
      , list = [];

    if ($selected.length > 0) {
      $selected.each(function() {
        list.push($(this).text());
      });

      /* Send text to background. */
      background.postMessage({
        type: 'copy',
        text: list.join('\n')
      }, background.location.origin);
    }
  };

  /**
   * On selection changed.
   */
  var onSelectionChanged = function() {
    var $options = $(this).find('option')
      , $copy = $('#copy-to-clipboard');

    $copy.prop('disabled', $options.filter(':selected').length < 1);
  };

  /**
   * On keypressed in selection.
   *
   * @param {Object} event
   */
  var onSelectionKeypress = function(event) {
    if (event.which === 13) {
      $('#copy-to-clipboard').trigger('click');
    }
  };

  /**
   * Add activity list.
   */
  var addActivityList = function() {
    /* Create a container. */
    var $list = $('<select />').attr({
      multiple: 'multiple',
      size: 32
    });

    $.each(background.activityCollection.getData(), function(id, data) {
      var tabId = parseInt(id, 10);

      /* Check valid tab ID. */
      if (tabId < 0) {
        return;
      }

      chrome.tabs.get(tabId, function(tab) {
        var group;

        /* NOTES: Sometimes chrome passes undefined tab. */
        if (tab) {
          /* Add activities in a tab. */
          group = ['<optgroup label="'+ tab.url +'">'];
          $.each(data.activities, function(requestId, url) {
            group.push('<option>'+ url +'</option>');
          });
          group.push('</optgroup>');

          $list.append(group.join(''));
        }
      });
    });

    $('#activity').append($list);

    /* Set events. */
    $list
      .on('change', onSelectionChanged)
      .on('keypress', onSelectionKeypress)
    ;
  };

  /**
   * Send text to clipboard.
   *
   * @param {String} text to send.
   */
  var sendTextToClipboard = function(text) {
    var $workspace = $('#workspace')
      , $copyBuffer = $('#copy-buffer');

    /* NOTES: Chrome permits visible contents copy. */
    $workspace.show();

    /* Set textarea for copy. */
    $copyBuffer
      .val(text)
      .select()
    ;

    document.execCommand('copy');

    $workspace.hide();
  };

  /**
   * Set controls action.
   */
  var setContolsAction = function() {
    $('#select-all').on('click', onSelectAllClicked);
    $('#copy-to-clipboard').on('click', onCopyToClipboardClicked);
  };

  /**
   * Create controls.
   */
  var createControls = function() {
    $('#controls').append(background.templates['controls']);

    /* Update button status. */
    $('#activity select').trigger('change');
  };

  /**
   * On DOMContentLoaded.
   */
  var onDocumentLoaded = function() {
    addActivityList();
    createControls();
    setContolsAction();
  };

  /**
   * Initialize.
   */
  (function() {
    background = chrome.extension.getBackgroundPage();
    document.addEventListener('DOMContentLoaded', onDocumentLoaded);
  }());

}(jQuery));
