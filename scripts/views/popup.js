/**
 * @fileOverview Popup View.
 */

(function(exports, $, _, Backbone) {

  /**
   * Popup View.
   */
  var PopupView = Backbone.View.extend({
    initialize: function() {
      this.background = chrome.extension.getBackgroundPage();
      this.controls = this.createControls();
      this.activityList = this.createActivityList();

      this.render();
    },
    render: function() {
      this.$el.append(this.controls.el);
      this.$el.append(this.activityList.el);

      this.setEvents();

      /* Update button status. */
      this.activityList.trigger('selectionChange');

      return this;
    },

    /**
     * Select all.
     */
    selectAll: function() {
      this.activityList.selectAll();
      this.activityList.$el.focus();
    },

    /**
     * Copy to clipboard.
     */
    copyToClipboard: function() {
      var activityList = this.activityList
        , background = this.background
        , list = [];

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
    },

    /**
     * On selection changed.
     *
     * @param {Number} selectedCount
     */
    onSelectionChanged: function(selectedCount) {
      this.controls[selectedCount > 0 ? 'enableCopy' : 'disableCopy']();
    },

    /**
     * On keypressed in selection.
     *
     * @param {Object} event
     */
    onKeypressed: function(event) {
      if (event.which === 13) {
        this.controls.trigger('copyToClipboard');
      }
    },

    /**
     * Set events.
     */
    setEvents: function() {
      var controls = this.controls
        , activityList = this.activityList;

      this.listenTo(controls, 'selectAll', this.selectAll);
      this.listenTo(controls, 'copyToClipboard', this.copyToClipboard);
      this.listenTo(activityList, 'selectionChange', this.onSelectionChanged);
      this.listenTo(activityList, 'keypress', this.onKeypressed);
    },

    /**
     * Create controls.
     *
     * @returns {Object} ControlsView
     */
    createControls: function() {
      var background = this.background
        , controls;

      controls = new background.ControlsView({
        template: background.templates['controls']
      });

      return controls;
    },

    /**
     * Create activity list.
     *
     * @returns {Object} ActivityListView
     */
    createActivityList: function() {
      var self = this
        , background = this.background
        , activityList;

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

      return activityList;
    }
  });

  /* Exports. */
  exports.PopupView = PopupView;

}(window, jQuery, _, Backbone));
