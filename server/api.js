var Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true
});

Api.addRoute('addRecords', {
    post: {
        action: function () {
            var arr = this.bodyParams;

            _.each(arr, function (body) {
                var section = locationMapping[body.location].section;
                var data = {
                    timeIn: body.timeIn,
                    timeOut: new Date((new Date(body.timeIn).getTime() + 30 * 60 * 1000)).toString(),
                    email: body.email
                };
                LIDLookup[section].push(data);

                if (PIDLookup[body.email] === undefined) {
                    PIDLookup[body.email] = [{
                        location: body.location,
                        timeIn: body.timeIn,
                        timeOut: new Date((new Date(body.timeIn).getTime() + 30 * 60 * 1000)).toString(),
                        section: locationMapping[body.location].section
                    }];
                } else {
                    PIDLookup[body.email].push({
                        location: body.location,
                        timeIn: body.timeIn,
                        timeOut: new Date((new Date(body.timeIn).getTime() + 30 * 60 * 1000)).toString(),
                        section: locationMapping[body.location].section
                    });
                }
            });



            return {
                status: 'Success: ' + arr.length + ' records added',
                //pid: PIDLookup[body.email]
            };
        }
    }


});

Api.addRoute('search', {
    post: {
        action: function () {
            var body = this.bodyParams;
            console.log(body);
            return Meteor.call('search', body.email, body.startTime, body.endTime);
        }
    }
});