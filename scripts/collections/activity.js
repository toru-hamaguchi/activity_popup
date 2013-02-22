/**
 * @fileOverview Activity Collection.
 */

(function(exports, $, _, Backbone) {

	/**
	 * Activity collection.
	 */
	var ActivityCollection = Backbone.Collection.extend({
		model: window.ActivityModel
	});

	/* Exports. */
	exports.ActivityCollection = ActivityCollection;

}(window, jQuery, _, Backbone));
