/**
 * @fileOverview Tab Collection.
 */

(function(exports, $, _, Backbone) {

  var TabCollection = Backbone.Collection.extend({
    model: window.TabModel
  });

  /* Exports. */
  exports.TabCollection = TabCollection;

}(window, jQuery, _, Backbone));
