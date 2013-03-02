/**
 * @fileOverview Controls View.
 */

(function(exports, $, _, Backbone) {

  /**
   * Controls View.
   */
  var ControlsView = Backbone.View.extend({
    className: 'controls',
    events: {
      'click .select-all': 'onSelectAll',
      'click .copy-to-clipboard': 'onCopyToClipboard'
    },
    initialize: function(options) {
      this.template = options.template;
      this.render();
    },
    render: function() {
      this.$el.append(this.template);
      return this;
    },

    /**
     * On select all.
     */
    onSelectAll: function() {
      this.trigger('selectAll');
    },

    /**
     * On copy to clipboard.
     */
    onCopyToClipboard: function() {
      this.trigger('copyToClipboard');
    },

    /**
     * Enable copy.
     */
    enableCopy: function() {
      this.$el.find('.copy-to-clipboard')
        .prop('disabled', false)
        .on('click', this.selectAll)
      ;
    },

    /**
     * Disable copy.
     */
    disableCopy: function() {
      this.$el.find('.copy-to-clipboard')
        .prop('disabled', true)
        .off('click')
      ;
    }
  });

  /* Exports. */
  exports.ControlsView = ControlsView;

}(window, jQuery, _, Backbone));
