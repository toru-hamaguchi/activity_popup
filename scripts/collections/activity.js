/**
 * @fileOverview Activity Collection.
 */

(function(exports, $, _, Backbone) {

	/**
	 * Activity collection.
	 */
	var ActivityCollection = Backbone.Collection.extend({
		model: window.ActivityModel,
		/**
		 * Add a request data.
		 *
		 * @param {Object} data
		 */
		addRequest: function(data) {
			var url = data.url
				, storedActivity;

			storedActivity = this.find(function(activity) {
				return activity.get('url') === url;
			});

			if (storedActivity === undefined) {
				this.add(data);
			}
			else {
				/* Update. */
				storedActivity.set(data);
			}
		}
	});

	/* Exports. */
	exports.ActivityCollection = ActivityCollection;

}(window, jQuery, _, Backbone));
