/**
 * @fileOverview Activity View.
 */

(function(exports, $, _, Backbone) {

	/**
	 * Activity View.
	 */
	var ActivityView = Backbone.View.extend({
		tagName: 'option',
		initialize: function() {
			this.render();
		},
		render: function() {
			this.$el.text(this.model.get('url'));
			return this;
		}
	});

	/* Exports. */
	exports.ActivityView = ActivityView;

}(window, jQuery, _, Backbone));
