function AppViewModel() {
    this.searchBox = ko.observable("");
}


/* Model */
//List of initial map items
var initialMarkers = ko.observableArray([
	{
		name: 'McDonalds',
		lat: 37.975585,
		lng: -100.853316
	},
	{
		name: 'Golden Corral',
		lat: 37.97548,
		lng: -100.851009
	}

	]);

ko.applyBindings(new AppViewModel());