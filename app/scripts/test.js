'use strict';

function Person(data) {
    var self = this;
    this.firstName = ko.observable(data.firstName);
    this.lastName = ko.observable(data.lastName);
    this.fullName = ko.computed(function() {
        return self.firstName() + " " + self.lastName();
    }, this);
};

function AppViewModel() {
    var self = this;

    this.personList = ko.observableArray([]);

    var personData = [{ firstName: 'Joshua', lastName: 'Cork' }];

    personData.forEach(function(person) {
        self.personList.push(new Person(person))
    });

    self.currentPerson = ko.observable(this.personList()[0]);

    console.log('the person is: ' + self.currentPerson().firstNamek);

    this.capitalizeLastName = function() {
        var currentVal = this.lastName(); // Read the current value
        this.lastName(currentVal.toUpperCase()); // Write back a modified value
    };
}

// Activates knockout.js
ko.applyBindings(new AppViewModel())
