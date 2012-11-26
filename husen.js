$(function() {
  
  // Model
  var Husen = Backbone.Model.extend({
    defaults: function() {
      return {
        title: "",
        top: "80px",
        left: "20px"
      };
    },

    updatePosition: function(top, left) {
      this.save({top: top, left: left});
    }
  })

  // Husen Collections
  var HusenList = Backbone.Collection.extend({
    model: Husen,
    
    localStorage: new Backbone.LocalStorage("husen-backbone")
  })

  // View
  var HusenView = Backbone.View.extend({
    tagName: "div",

    template: _.template($('#item-template').html()),

    events: {
      "dblclick .view"  : "edit",
      "keypress .edit"  : "updateOnEnter",
      "click a.destroy" : "clear", 
      "blur .edit"      : "close"
    },

    initialize: function() {
      this.model.on("change", this.render, this);
      this.model.on("destroy", this.remove, this);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.input = this.$(".edit");
      return this;
    },

    edit: function(e) {
      this.$el.addClass("editing");
      this.input.focus();
    },

    close: function() {
      var value = this.input.val();
      this.model.save({title: value});
      this.$el.removeClass("editing");
    },

    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },
    
    clear: function() {
      this.model.destroy();
    }
  });

  var Husens = new HusenList;

  var AppView = Backbone.View.extend({
    el: $("#husenapp"),

    events: {
      "click #add-btn" : "createOnClick"
    },

    initialize: function() {
      Husens.on("add", this.addOne, this);
      Husens.on("reset", this.addAll, this);
      Husens.fetch();
    },

    addOne: function(husen) {
      var view = new HusenView({model: husen});
      var husenEm = view.render().$el.addClass("husen");
      husenEm.css({
        top: view.model.get("top"),
        left: view.model.get("left")
      });
      husenEm.draggable({
        stop: function() {
          view.model.updatePosition(husenEm.css("top"), husenEm.css("left"));
        }
      });
      husenEm.css("position", "absolute");
      this.$("#board").append(husenEm);
    },

    addAll: function() {
      Husens.each(this.addOne);
    },

    createOnClick: function() {
      Husens.create();
    }
  });

  var App = new AppView;

});
