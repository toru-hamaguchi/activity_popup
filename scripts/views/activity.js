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
			/* Listen status code changes. */
			this.listenTo(this.model, 'change:statusCode', this.update);

			/* Initialize view. */
			this.update();

			return this;
		},

		/**
		 * Update.
		 */
		update: function() {
			var url = this.model.get('url')
				, statusCode = this.model.get('statusCode');

			this.$el.text(url);

			if (statusCode === undefined) {
				this.$el.attr('class', 'status-none');
			}
			else if (statusCode === 200) {
				this.$el.attr('class', 'status-200');
			}
			else {
				this.$el.attr('class', 'status-error');
			}
		}
	});

	/* Exports. */
	exports.ActivityView = ActivityView;

}(window, jQuery, _, Backbone));
