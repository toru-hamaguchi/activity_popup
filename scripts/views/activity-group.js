/**
 * @fileOverview Activity Group View.
 */

(function(exports, _, Backbone) {

  /**
   * Activity Group View.
   */
  var ActivityGroupView = Backbone.View.extend({
    tagName: 'optgroup',
    initialize: function() {
      this.render();
    },
    render: function() {
      /* Add all requested activityes. */
      _.each(this.collection.models, _.bind(this.addActivity, this));

      /* Listen new request addition. */
      this.listenTo(this.collection, 'add', this.addActivity);

      return this;
    },

    /**
     * Add an activity.
     *
     * @param {Object} model
     */
    addActivity: function(model) {
      var activity = new window.ActivityView({
        model: model
      });

      this.$el.append(activity.el);
    }
  });

  /* Exports. */
  exports.ActivityGroupView = ActivityGroupView;

}(window, _, Backbone));
