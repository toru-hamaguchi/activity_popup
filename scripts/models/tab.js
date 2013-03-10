/**
 * @fileOverview Tab Model.
 */

(function(exports, $, _, Backbone) {

  /**
   * Tab model.
   */
  var TabModel = Backbone.Model.extend({
    validate: function(attrs, options) {
      if (attrs.id === undefined || attrs.id < 0) {
       return 'Invalid tab id';
      }
    }
  });

  /* Exports. */
  exports.TabModel = TabModel;

}(window, jQuery, _, Backbone));
