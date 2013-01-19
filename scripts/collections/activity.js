/**
 * @fileOverview Activity class.
 */

(function() {

  /**
   * Creates an activity collection class.
   *
   * @class Represents an activity collection.
   */
  var ActivityCollection = (function() {
    var ctor, proto;

    /**
     * @private
     */
    var dataStore;

    /**
     * @constructs
     */
    ctor = function ActivityCollection() {
      this.dataStore = {};
    };
    proto = ctor.prototype = {};
    proto.constructor = ctor;

    /**
     * Initialize an activety group.
     */
    proto.init = function(groupId) {
      if (this.dataStore[groupId]) {
        this.remove(groupId);
      }
      this.dataStore[groupId] = {
        activities: []
      };
    };

    /**
     * Add a data to an activety group.
     */
    proto.add = function(groupId, data) {
      var activities;

      if (this.dataStore[groupId] === undefined) {
        this.init(groupId);
      }

      activities = this.dataStore[groupId].activities;
      if (activities.indexOf(data.url) === -1) {
        activities.push(data.url);
      }
    };

    /**
     * Get a data by group ID.
     *
     * @param {String} id of group ID.
     * @returns {Object} an activity data.
     */
    proto.get = function(groupId) {
      return this.dataStore[groupId];
    };

    /**
     * Get all data.
     *
     * @returns {Object} all activity data.
     */
    proto.getData = function() {
      return this.dataStore;
    };

    /**
     * Remove an activity info by group ID.
     *
     * @param {String} id of group ID.
     */
    proto.remove = function(groupId) {
      if (this.dataStore[groupId]) {
        delete this.dataStore[groupId];
      }
    };

    return ctor;
  }());

  /* Exports. */
  window.ActivityCollection = ActivityCollection;

}());
