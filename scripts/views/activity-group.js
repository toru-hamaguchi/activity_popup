/**
 * @fileOverview Activity Group View.
 */

(function(exports, $, _, Backbone) {

  /**
   * Activity Group View.
   */
  var ActivityGroupView = Backbone.View.extend({
    tagName: 'optgroup',
    initialize: function() {
      this.render();
    },
    render: function() {
      var self = this;

      _.each(this.collection.models, function(activityModel) {
        var activity = new window.ActivityView({
          model: activityModel
        });
        self.$el.append(activity.el);
      });

      return this;
    }
  });

  /* Exports. */
  exports.ActivityGroupView = ActivityGroupView;

}(window, jQuery, _, Backbone));
