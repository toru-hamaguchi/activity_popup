/**
 * @fileOverview Tab collection class.
 */

(function(exports) {

  /**
   * Creates a tab collection class.
   *
   * @class Represents a tab collection.
   */
  var TabCollection = (function() {
    var ctor, proto;

    /**
     * @private
     */
    var _collectionStore;

    /**
     * @constructs
     */
    ctor = function TabCollection() {
      this._collectionStore = {};
    };
    proto = ctor.prototype = {};
    proto.constructor = ctor;

    /**
     * Initialize a tab group.
     *
     * @param {String} id of tab ID.
     */
    proto.init = function(tabId) {
      if (this._collectionStore[tabId]) {
        this.remove(tabId);
      }
      this._collectionStore[tabId] = new window.ActivityCollection();
    };

    /**
     * Add a data to a tab group.
     *
     * @param {String} id of tab ID.
     * @param {Object} activity model.
     */
    proto.add = function(tabId, activity) {
      var collection
        , requestUrl = activity.get('url')
        , storedActivity;

      if (this._collectionStore[tabId] === undefined) {
        this.init(tabId);
      }
      collection = this._collectionStore[tabId];

      storedActivity = collection.find(function(model) {
        return model.get('url') === requestUrl;
      });
      if (storedActivity === undefined) {
        collection.add(activity);
      }
    };

    /**
     * Get all data.
     *
     * @returns {Object} All activity collections.
     */
    proto.getData = function() {
      return this._collectionStore;
    };

    /**
     * Remove a tab info by ID.
     *
     * @param {String} id of tab ID.
     */
    proto.remove = function(tabId) {
      if (this._collectionStore[tabId]) {
        delete this._collectionStore[tabId];
      }
    };

    return ctor;
  }());

  /* Exports. */
  exports.TabCollection = TabCollection;

}(window));
