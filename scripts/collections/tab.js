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
    var dataStore;

    /**
     * @constructs
     */
    ctor = function TabCollection() {
      this.dataStore = {};
    };
    proto = ctor.prototype = {};
    proto.constructor = ctor;

    /**
     * Initialize a tab group.
     */
    proto.init = function(tabId) {
      if (this.dataStore[tabId]) {
        this.remove(tabId);
      }
      this.dataStore[tabId] = {
        activities: []
      };
    };

    /**
     * Add a data to a tab group.
     */
    proto.add = function(tabId, data) {
      var activities;

      if (this.dataStore[tabId] === undefined) {
        this.init(tabId);
      }

      activities = this.dataStore[tabId].activities;
      if (activities.indexOf(data.url) === -1) {
        activities.push(data.url);
      }
    };

    /**
     * Get a data by tab ID.
     *
     * @param {String} id of tab ID.
     * @returns {Object} Activities data in the tab.
     */
    proto.get = function(tabId) {
      return this.dataStore[tabId];
    };

    /**
     * Get all data.
     *
     * @returns {Object} all tab data.
     */
    proto.getData = function() {
      return this.dataStore;
    };

    /**
     * Remove a tab info by ID.
     *
     * @param {String} id of tab ID.
     */
    proto.remove = function(tabId) {
      if (this.dataStore[tabId]) {
        delete this.dataStore[tabId];
      }
    };

    return ctor;
  }());

  /* Exports. */
  exports.TabCollection = TabCollection;

}(window));
