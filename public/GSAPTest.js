var App = {
    init: function () {
        this.tl = new TimelineLite();
    },

    locationLookup: {
        SR31: {
            left: 5.93/37.5 * 100,
            right: 10.4/37.5 * 100,
            top: 3.1/31.5 * 100,
            btm: 5.6/31.5 * 100
        },
        SR32: {
            left: 14.7/37.5 * 100,
            right: 18.9/37.5 * 100,
            top: 3.1/31.5 * 100,
            btm: 5.6/31.5 * 100
        }

    },

    getRandomX: function (locationId) {
        var coordinates = this.locationLookup[locationId];
        console.log(coordinates);
        return Math.floor(Math.random() * (coordinates.right - coordinates.left) + coordinates.left);
    },

    getRandomY: function (locationId) {
        var coordinates = this.locationLookup[locationId];
        return Math.floor(Math.random() * (coordinates.btm - coordinates.top) + coordinates.top);
    },

    move: function () {
        var self = this;
        var tl = this.tl;

        _.each(fake.movement, function (movement) {
            var $jeremy = $('#jeremy');
            tl.to($jeremy, 2, {left: self.getRandomX(movement.location) + '%', top: self.getRandomY(movement.location) + '%'}, movement.time)
        });

        _.each(fake.contacts, function (contact) {
            var $contacted = $('#' + contact.id);
            tl.to($contacted, 2, {left: self.getRandomX(contact.contactL) + '%', top: self.getRandomY(contact.contactL) + '%'}, contact.time);
        });


    }

};

$(document).ready(function () {
    App.init();
    App.move();
});

var fake = {
    id: "jeremy",
    contacts: [
        {
            time: "10",
            duration: "47",
            id: "clarence",
            contactL: 'SR32',
            beforeL: 'SR31',
            afterL: 'SR31',
            contacts: []
        },
        {
            time: "12",
            duration: "23",
            id: "eustace",
            contactL: 'SR32',
            beforeL: 'SR31',
            afterL: 'SR31',
            contacts: []
        }
    ],
    movement: [
        {
            time: "3",
            location: 'SR31'
        },
        {
            time: "9",
            location: 'SR32'
        },
        {
            time: "15",
            location: 'SR31'
        },
        {
            time: "22",
            location: 'SR32'
        }
    ]
}