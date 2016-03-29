// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function NmViewModel() {
    this.firstName = ko.observable("Bert");
    this.lastName = ko.observable("Bertington");
}

// Activates knockout.js
ko.applyBindings(new NmViewModel());