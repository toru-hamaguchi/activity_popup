/**
 * @fileOverview popup functions.
 */

(function($, _) {

  var background;
  var controls;

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
    var list = [];

    $('#activity optgroup[label]').each(function() {
      $(this).find('option:selected').each(function() {
        list.push($(this).text());
      });
    });

    /* Send text to background. */
    if (list.length > 0) {
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
    var list = new background.ActivityListView();

    /* Add all activities in tabs. */
    _.each(background.tabs.models, function(tab) {
      /* Get the recent tab data. */
      chrome.tabs.get(tab.get('id'), function(tabData) {
        var activityGroup;

        /* Exclude undefined tab. (Instant pages ?) */
        if (tabData === undefined) {
          background.tabs.remove(tab);
          return;
        }

        /* Update tab data. */
        tab.set(tabData);

        activityGroup = new background.ActivityGroupView({
          collection: tab.get('activities'),
          attributes: {
            label: tab.get('url')
          }
        });

        list.$el.append(activityGroup.el);
      });
    });

    $('#activity').append(list.$el);

    /* Set events. */
    list.on({
      'change': onSelectionChanged,
      'keypress': onSelectionKeypress
    });
  };

  /**
   * Set controls action.
   */
  var setContolsAction = function() {
    controls.on('selectAll', onSelectAllClicked);
    controls.on('copyToClipboard', onCopyToClipboardClicked);
  };

  /**
   * Create controls.
   */
  var createControls = function() {
    controls = new background.ControlsView({
      template: background.templates['controls']
    });

    /* Update button status. */
    $('#activity select').trigger('change');
    $('#controls').append(controls.el);
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
