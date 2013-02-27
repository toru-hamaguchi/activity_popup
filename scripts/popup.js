/**
 * @fileOverview popup functions.
 */

(function($, _) {

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

    _.each(background.tabCollection.getData(), function(activities, id) {
      var tabId = parseInt(id, 10);

      /* Check valid tab ID. */
      if (tabId < 0) {
        return;
      }

      chrome.tabs.get(tabId, function(tab) {
        var activityGroup;

        /* NOTES: Sometimes chrome passes undefined tab. */
        if (tab) {
          activityGroup = new background.ActivityGroupView({
            collection: activities,
            attributes: {
              label: tab.url
            }
          });
          $list.append(activityGroup.el);
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

}(jQuery, _));
