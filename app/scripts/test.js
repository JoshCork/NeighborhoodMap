'use strict';

$(function(){

// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
AppViewModel: function() {
    this.firstName = ko.observable("Bert");
    this.lastName = ko.observable("Bertington");
    this.fullName = ko.computed(function() {
        return this.firstName() + " " + this.lastName();
    }, this);
    this.capitalizeLastName = function() {
        var currentVal = this.lastName(); // Read the current value
        this.lastName(currentVal.toUpperCase()); // Write back a modified value
    };
},

init: function(){
    this.AppViewModel()
}

// Activates knockout.js
ko.applyBindings(new AppViewModel())

init();

})
