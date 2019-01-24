var fs = Npm.require('fs');

var dataDir = process.env.PWD + '/data/';

var macMappingJson = fs.readFileSync(dataDir + 'macMapping.json', {encoding: 'utf8'});
var locationMappingJson = fs.readFileSync(dataDir + 'locationMapping.json', {encoding: 'utf8'});
var PIDLookupJson = fs.readFileSync(dataDir + 'PIDLookup.json', {encoding: 'utf8'});
var LIDLookupJson = fs.readFileSync(dataDir + 'LIDLookup.json', {encoding: 'utf8'});

var macMapping = JSON.parse(macMappingJson);
var locationMapping = JSON.parse(locationMappingJson);
var PIDLookup = JSON.parse(PIDLookupJson);
var LIDLookup = JSON.parse(LIDLookupJson);

var padSectionNo = function (n) {
    return n;
};

var getBeforeAfterMovement = function (email, startTime) {
    var records = PIDLookup[email];
    var startRecord;
    var startIndex, endIndex;

    for (var i = 0; i < records.length; i++) {
        var record = records[i];
        //if (new Date(startTime) >= new Date(record.time)) {
        //    if (startIndex === undefined) {
        //        startIndex = i;
        //        startRecord = record;
        //    }
        //}
        //
        //if (record.location !== startRecord.location) {
        //    return records.slice(startIndex, i-1)
        //}
        //
        if (startTime === record.time) {
            return [
                records[i === 0 ? 0 : i-1 ],
                record,
                records[i+1]
            ]
        }
    }
    return [];

};

var getMovement = function (email, startTime, endTime) {
    var records = PIDLookup[email];
    console.log('%d records found for %s', records.length, email);

    var movement = [];

    var startIndex, endIndex;

    for (var i = 0; i < records.length; i++) {
        var record = records[i];
        var time = new Date(record.time);
        if (time.getTime() > new Date(startTime).getTime()) {
            if (startIndex === undefined) {
                startIndex = i;
            }
        }
        if (time.getTime() > new Date(endTime).getTime()) {

            if (endIndex === undefined) {
                endIndex = i;
            }
        }
    }

    //trim records
    records = records.slice(startIndex, endIndex);
    console.log('%d records within time window for %s', records.length, email );

    //if no records after slice, means no match
    if (records.length === 0) {
        return [];
    }

    var curRecord = records[0];

    //if there is only one record
    if (records.length === 1) {
        movement.push({
            location: curRecord.location,
            section: padSectionNo(locationMapping[curRecord.location].section),
            timeIn: curRecord.time,
            timeOut: endTime    //timeOut shall be end time of the search window
        })
    } else {

        for (var i = 1; i < records.length; i++) {
            var record = records[i];
            if (curRecord.location !== record.location) {   //new location encountered
                movement.push({
                    location: curRecord.location,
                    section: padSectionNo(locationMapping[curRecord.location].section),
                    timeIn: curRecord.time,
                    timeOut: records[i].time
                });

                curRecord = record;
            }
        }

        movement.push({
            location: curRecord.location,
            section: padSectionNo(locationMapping[curRecord.location].section),
            timeIn: curRecord.time,
            timeOut: endTime    //timeOut shall be end time of the search window
        });
    }

    //console.log('Displaying movement for %s ...', email);
    //console.log(movement);

    return movement;
};

var getContactsFromLocation = function(location, startTime, endTime, email) {
    var records = LIDLookup[location];

    var startIndex, endIndex;
    for (var i = 0; i < records.length; i++) {
        var record = records[i];
        var time = new Date(record.time);
        if (time.getTime() > new Date(startTime).getTime()) {
            if (startIndex === undefined) {
                startIndex = i;
            }
        }
        if (time.getTime() > new Date(endTime).getTime()) {

            if (endIndex === undefined) {
                endIndex = i;
            }
        }
    }

    //trim records
    records = records.slice(startIndex, endIndex);

    console.log('\tLocation %s: %d records found. calculating...', location, records.length);
    //console.log(records);
    //group records by contacts
    var contacts = {};
    
    //_.each(records, function (record) {
    //   if (contacts[record.email] === undefined) {
    //       contacts[record.email] = [record.time];
    //   } else {
    //       contacts[record.email].push(record.time);
    //   }
    //});
    //
    //console.log(contacts);
    //
    ////figure out the movement for each contact person
    //var movementChart = {};
    //_.each(contacts, function (records, key) {
    //    var movement = [];
    //    var curRecord = records[0];
    //
    //    for (var i = 1; i < records.length; i++) {
    //        var record = records[i];
    //        if (curRecord.location !== record.location) {   //new location encountered
    //            movement.push({
    //                timeIn: curRecord.time,
    //                timeOut: records[i].time
    //            });
    //
    //            curRecord = record;
    //        }
    //    }
    //
    //    movement.push({
    //        timeIn: curRecord.time,
    //        timeOut: endTime    //timeOut shall be end time of the search window
    //    });
    //
    //    movementChart[key] = movement;
    //});

    //console.log(movementChart);

    for (var i = 0; i < records.length; i++) {
        var record = records[i];
        if(record.email !== email) { //exclude the original person
            if (contacts[record.email] === undefined) {
                contacts[record.email] = {
                    enteredTime: record.time,
                    lastTime: record.time
                }
            } else {
                contacts[record.email].lastTime = record.time;
            }
        }
    }

    //keys:
    //	time:
    //	duration:

    contacts = _.map(contacts, function (contact, key) {
        var duration = Math.floor ( (new Date(contact.lastTime).getTime() - new Date(contact.enteredTime).getTime())/60000 ); //in minutes
        duration += getDurationSpent(key, location, contact.lastTime);    //add the time spent after the last record

        return {
            location: location,
            section: padSectionNo(locationMapping[location].section),
            email: key,
            time: contact.enteredTime,
            duration: duration
        };
    });


    //remove durations that are too large or too small
    contacts = _.filter(contacts, function (contact) {
        return contact.duration > 2 && contact.duration < 400;
    });

    //produce logs
    console.log('\tLocation %s : %d contacts found', location, contacts.length);
    _.each(contacts, function (contact) {
        console.log('\t\t--> %s - %s : %s (%dm)', contact.time, contact.location, contact.email, contact.duration);
    });

    return contacts;
};

var getDurationSpent = function (email, location, time) {
    var records = PIDLookup[email];
    for (var i = 0; i < records.length; i++) {
        var record = records[i];
        if (record.location === location && record.time === time) {
            //find difference bn matched record and the next one
            return Math.floor( (new Date(records[i+1] ? records[i+1].time: record.time).getTime() - new Date(record.time).getTime()) / 60000 );
        }
    }
};

var searchData = function (email, startTime, endTime) {

    console.log('Searching records for %s from %s to %s', email, startTime, endTime);
    var movement = getMovement(email, startTime, endTime);

    console.log('%s has visited %d locations. Tracing contacts...', email, movement.length);
    var contacts = [];

    _.each(movement, function(move) {
        var contactsFromLocation = getContactsFromLocation(move.location, startTime, endTime, email);
        contacts = contacts.concat(contactsFromLocation);
    });


    //add some movement data
    contacts = _.map(contacts, function(contact) {
        var movement = getBeforeAfterMovement(contact.email, contact.time);
        movement = _.map(movement, function(move) {
            return {
                timeIn: move.time,
                location: move.location,
                section: padSectionNo(locationMapping[move.location].section)
            }
        });

        contact.movement = movement;
        return contact;
    });

    return {
        id: email,
        movement: movement,
        contacts: contacts
    };

};
//
//Meteor.methods({
//    search: function (email, startTime, endTime) {
//        var results = searchData(email, startTime, endTime);
//        //fs.writeFileSync('/Users/jeremyongts92/Desktop/test.json', JSON.stringify(results, null, 2));
//        return results;
//    }
//});

//var test = searchData('kathleen.lam.2014@sis.smu.edu.sg', '2015-01-01 00:00:25', '2015-02-23 00:00:25');
//fs.writeFileSync('/Users/clarencenpy/Desktop/test.json', JSON.stringify(test, null, 2));
