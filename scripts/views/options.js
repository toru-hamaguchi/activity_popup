/**
 * @fileOverview Options View.
 */

(function(exports, _, Backbone) {

  /**
   * Options View.
   */
  var OptionsView = Backbone.View.extend({
    events: {
      'change input[type="checkbox"]': 'onCheckboxChanged'
    },
    initialize: function() {
      this.background = chrome.extension.getBackgroundPage();

      this.render().load();
    },
    render: function() {
      this.$el.append(this.background.templates['options']);

      return this;
    },

    /**
     * On option changed
     */
    onCheckboxChanged: function() {
      this.save();
    },

    /**
     * On option changed
     */
    load: function() {
      var data = JSON.parse(window.localStorage.getItem('options'));

      if (data === null) {
        return;
      }

      this.$el.find('input[type="checkbox"]').each(function() {
        var name = this.name;

        if (data[name] !== undefined) {
          this.checked = data[name];
        }
      });
    },

    /**
     * On option changed
     */
    save: function() {
      var data = {};

      this.$el.find('input[type="checkbox"]').each(function() {
        data[this.name] = this.checked;
      });

      window.localStorage.setItem('options', JSON.stringify(data));
    }
  });

  /* Exports. */
  exports.OptionsView = OptionsView;

}(window, _, Backbone));
