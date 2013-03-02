/**
 * @fileOverview popup functions.
 */

(function($, _) {

  var background;
  var controls;
  var activityList;

  /**
   * On 'Select all' clicked.
   */
  var onSelectAllClicked = function() {
    activityList.selectAll();
    activityList.$el.focus();
  };

  /**
   * On 'Copy to clipboard' clicked.
   */
  var onCopyToClipboardClicked = function() {
    var list = [];

    activityList.$el.find('optgroup[label]').each(function() {
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
   *
   * @param {Number} selectedCount
   */
  var onSelectionChanged = function(selectedCount) {
    controls[selectedCount > 0 ? 'enableCopy' : 'disableCopy']();
  };

  /**
   * On keypressed in selection.
   *
   * @param {Object} event
   */
  var onSelectionKeypress = function(event) {
    if (event.which === 13) {
      controls.trigger('copyToClipboard');
    }
  };

  /**
   * Create activity list.
   */
  var createActivityList = function() {
    /* Create a container. */
    activityList = new background.ActivityListView();

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

        activityList.$el.append(activityGroup.el);
      });
    });

    $('#activity').append(activityList.$el);

    /* Listen events. */
    activityList.on({
      'selectionChange': onSelectionChanged,
      'keypress': onSelectionKeypress
    });
  };

  /**
   * Create controls.
   */
  var createControls = function() {
    controls = new background.ControlsView({
      template: background.templates['controls']
    });

    $('#controls').append(controls.el);
  };

  /**
   * Listen controls events.
   */
  var listenControlsEvents = function() {
    controls.on('selectAll', onSelectAllClicked);
    controls.on('copyToClipboard', onCopyToClipboardClicked);
  };

  /**
   * On DOMContentLoaded.
   */
  var onDocumentLoaded = function() {
    createActivityList();
    createControls();
    listenControlsEvents();

    /* Update button status. */
    activityList.trigger('selectionChange');
  };

  /**
   * Initialize.
   */
  (function() {
    background = chrome.extension.getBackgroundPage();
    document.addEventListener('DOMContentLoaded', onDocumentLoaded);
  }());

}(jQuery, _));
