/**
 * @fileOverview Activity List View.
 */

(function(exports, $, _, Backbone) {

	/**
	 * Activity List View.
	 */
	var ActivityListView = Backbone.View.extend({
		tagName: 'select',
		attributes: {
			multiple: 'multiple',
			size: 32
		},
		initialize: function() {
			this.render();
		},
		render: function() {
			return this;
		}
	});

	/* Exports. */
	exports.ActivityListView = ActivityListView;

}(window, jQuery, _, Backbone));
