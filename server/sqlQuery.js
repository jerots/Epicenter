//var Future = Npm.require("fibers/future");
//var mysql = Meteor.npmRequire('mysql');
//var fs = Npm.require('fs');
//
//Meteor.startup(function () {
//    connection = mysql.createConnection({
//        host: 'localhost',
//        port: 8889,
//        user: 'root',
//        password: 'root',
//        database: 'epicenter'
//    });
//
//});
//
//var getDifferenceInMins = function (start, end) {
//    start = new Date(start);
//    end = new Date(end);
//    return Math.floor( (end.getTime() - start.getTime()) / 60000);
//};
//
//var addMinToTimeString = function (time, mins) {
//    time = new Date(time);
//    return new Date(time.getTime() + mins * 60000).toString();
//};
//
//var getMovement = function (email, startTime, endTime) {
//    console.log('starting search...');
//    var future = new Future();
//    connection.query(
//            'SELECT timeRecord, d.email, lm.locationName, lm.current_section \
//            FROM Location l\
//            INNER JOIN Demographics d on d.mac = l.mac\
//            INNER JOIN Location_Mapping lm on lm.locationCode = l.locationCode\
//            WHERE d.email = ? AND timeRecord > DATE ? AND timeRecord < DATE ?',
//        [email, startTime, endTime],
//        function (err, rows) {
//
//            if (err) {
//                throw new Meteor.Error(err);
//            }
//
//            console.log('Retrieved ' + rows.length + ' rows...');
//
//            var movement = [];
//
//            var curRecord = rows[0];
//
//            for (var i = 1; i < rows.length; i++) {
//                var row = rows[i];
//                if (curRecord.locationName !== row.locationName) {
//                    movement.push({
//                        location: curRecord.locationName,
//                        timeIn: curRecord.timeRecord,
//                        timeOut: rows[i-1].timeRecord
//                    });
//
//                    curRecord = row;
//                }
//            }
//
//            movement.push({
//                location: curRecord.locationName,
//                timeIn: curRecord.timeRecord,
//                timeOut: rows[i - 1].timeRecord
//            });
//            future.return(movement);
//        });
//
//    var movement = future.wait();
//
//    console.log('Places Visited: ' + movement.length);
//    console.log(movement);
//    return movement;
//
//};
//
//
//var getContactsFromLocation = function (move, email) {
//    var future = new Future();
//    connection.query('SELECT email, timeRecord FROM Location l\
//        INNER JOIN Demographics d on d.mac = l.mac\
//        INNER JOIN Location_Mapping lm on lm.locationCode = l.locationCode\
//        WHERE locationName = ?\
//        AND timerecord > DATE ?\
//        AND timerecord < DATE ?\
//        AND email != ?',
//    [move.location, move.timeIn, move.timeOut, email],
//    function (err, rows) {
//        if (err) {
//            throw new Meteor.Error(err);
//        } else {
//            var result = {
//                location: move.location,
//                contacts: []
//            };
//            var contactIds = [];
//
//            _.each(rows, function (row) {
//                if (contactIds.indexOf(row.email) === -1) {
//                    result.contacts.push({
//                        id: row.email,
//                        timeContacted: row.timeRecord
//                    });
//                    contactIds.push(row.email);
//                }
//            });
//
//            if (result.contacts.length > 0) {
//                console.log('Contacted count: ' + result.contacts.length + ', Location: ' + move.location);
//                console.log(result.contacts);
//            }
//
//            future.return(result);
//        }
//    });
//    return future.wait();
//};
//
//Meteor.methods({
//    search: function(email, startTime, endTime) {
//        var movement = getMovement(email, startTime, endTime);
//        if (movement.length === 0) {
//            throw new Meteor.Error('No record found');
//        }
//
//        var contacts = [];
//        _.each(movement, function (move) {
//            var result = getContactsFromLocation(move, email);
//                contacts.push(result);
//        });
//
//        console.log('start mapping movement of each contact');
//
//        fs.writeFile('/Users/clarencenpy/Desktop/contacts.txt', JSON.stringify(contacts, null, 2), function (err) {
//            if (err) {
//
//            } else {
//                console.log('write to file');
//            }
//        });
//
//        //contacts = _.map(contacts, function (contact) {
//        //    contact.movement = getMovement(contact.id, contact.time, endTime);
//        //    return contact;
//        //});
//        //
//        //console.log(contacts);
//
//    }
//});