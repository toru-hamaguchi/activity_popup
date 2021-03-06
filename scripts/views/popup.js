/**
 * @fileOverview Popup View.
 */

(function(exports, _, Backbone) {

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
     * Get an option.
     *
     * @param {String} name
     * @returns {Any}
     */
    getOption: function(name) {
      var options = JSON.parse(window.localStorage.getItem('options'))
        , value;

      if (options && options[name]) {
        value = options[name];
      }
      return value;
    },

    /**
     * Copy to clipboard.
     */
    copyToClipboard: function() {
      var reExclude = /^\[.*\]/
        , options = JSON.parse(window.localStorage.getItem('options'))
        , mapCallback
        , list;

      /**
       * Extract all activity items.
       *
       * @param {String} item
       * @returns {String}
       */
      var extractAll = function(item) {
        /* Remove status text in activity items. */
        return item.replace(reExclude, '');
      };

      /**
       * Extract loaded activity items.
       *
       * @param {String} item
       * @returns {String}
       */
      var extractLoaded = function(item) {
        /* Find loaded activity items. */
        if (reExclude.test(item) === false) {
          return item;
        }
      };

      /* Set map callback function by an option. */
      if (this.getOption('copy-only-loaded') === true) {
        mapCallback = extractLoaded;
      }
      else {
        mapCallback = extractAll;
      }

      /* Get listed activities. */
      list = _.compact(_.map(this.activityList.getSelectedItems(), function(element) {
        return mapCallback(element.innerText);
      }));

      /* Send text to background. */
      if (list.length > 0) {
        this.background.postMessage({
          type: 'copy',
          body: list.join('\n')
        }, this.background.location.origin);
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

      controls = new window.ControlsView({
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
      activityList = new window.ActivityListView();

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

          activityGroup = new window.ActivityGroupView({
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

}(window, _, Backbone));
