/**
 * @fileOverview Tab Collection.
 */

(function(exports, _, Backbone) {

  /**
   * Tab collection.
   */
  var TabCollection = Backbone.Collection.extend({
    model: window.TabModel
  });

  /* Exports. */
  exports.TabCollection = TabCollection;

}(window, _, Backbone));
