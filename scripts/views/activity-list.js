/**
 * @fileOverview Activity List View.
 */

(function(exports, $, _, Backbone) {

  /**
   * Activity List View.
   */
  var ActivityListView = Backbone.View.extend({
    tagName: 'select',
    events: {
      'change': 'onSelectionChange',
      'keypress': 'onKeypress'
    },
    attributes: {
      multiple: 'multiple',
      size: 32
    },
    initialize: function() {
      this.render();
    },
    render: function() {
      return this;
    },

    /**
     * Select all.
     */
    selectAll: function() {
      this.$el.find('option').prop('selected', true);
      this.onSelectionChange();
    },

    /**
     * On selection change.
     */
    onSelectionChange: function() {
      var selected = this.$el.find('option:selected');
      this.trigger('selectionChange', selected.length);
    },

    /**
     * On keypress.
     */
    onKeypress: function(event) {
      this.trigger('keypress', event);
    }
  });

  /* Exports. */
  exports.ActivityListView = ActivityListView;

}(window, jQuery, _, Backbone));
