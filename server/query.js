var fs = Npm.require('fs');

var dataDir = process.env.PWD + '/data/';

var macMappingJson = fs.readFileSync(dataDir + 'macMapping.json', {encoding: 'utf8'});
var locationMappingJson = fs.readFileSync(dataDir + 'locationMapping.json', {encoding: 'utf8'});
var PIDLookupJson = fs.readFileSync(dataDir + 'compressedPIDLookup.json', {encoding: 'utf8'});
var LIDLookupJson = fs.readFileSync(dataDir + 'compressedLIDLookup.json', {encoding: 'utf8'});

macMapping = JSON.parse(macMappingJson);
locationMapping = JSON.parse(locationMappingJson);
PIDLookup = JSON.parse(PIDLookupJson);
LIDLookup = JSON.parse(LIDLookupJson);


//var virus = {
//    minIncubation: 1,
//    maxIncubation: 4,
//    infectivityBeforeSymptoms: 1
//};

var getLocationDesc = function (section) {
    var result;
    _.each(locationMapping, function (value) {
        if (value.section === section+'') {
            //console.log(value.description);
            result = value.description;
            return;
        }
    });
    return result;
};


var getMovement = function (email, startTime, endTime) {
    var records = PIDLookup[email];
    var movement = [];
    var start = new Date(startTime);
    var end = new Date(endTime);

    _.each(records, function (record) {
        var timeIn = new Date(record.timeIn);
        var timeOut = new Date(record.timeOut);


        if (timeIn >= start && timeIn <= end) {
            if (timeOut > end) {
                record.timeOut = endTime;
            }
            movement.push(record);
        } else if (timeOut >= start && timeOut <= end) {
            if (timeIn < start) {
                record.timeIn = startTime
            }
            movement.push(record);
        }
    });

    return movement;
};

var getContactsFromSection = function (section, startTime, endTime, excluded) {
    var records = LIDLookup[section];

    var matched = [];
    var start = new Date(startTime);
    var end = new Date(endTime);

    _.each(records, function (record) {
        var timeIn = new Date(record.timeIn);
        var timeOut = new Date(record.timeOut);

        var toExclude = false;
        _.each(excluded, function (exclude) {
            if (record.email === exclude) {
                toExclude = true;
                return;
            }
        });

        if (toExclude) {
            return;
        }


        if (timeIn >= start && timeIn <= end) {
            if (timeOut > end) {
                matched.push({
                    section: section,
                    startTime: record.timeIn,
                    duration: +((end - timeIn) / 60000).toFixed(2),
                    email: record.email
                })
            } else {
                matched.push({
                    section: section,
                    startTime: record.timeIn,
                    duration: +((timeOut - timeIn) / 60000).toFixed(2),
                    email: record.email
                })
            }
        } else if (timeOut >= start && timeOut <= end) {
            if (timeIn < start) {
                matched.push({
                    section: section,
                    startTime: startTime,
                    duration: +((timeOut - start) / 60000).toFixed(2),
                    email: record.email
                })
            } else {
                matched.push({
                    section: section,
                    startTime: record.timeIn,
                    duration: +((timeOut - timeIn) / 60000).toFixed(2),
                    email: record.email
                })
            }
        }
    });

    return matched;

};


var getSuspectsFromMovement = function (movement, excluded) {
    //group by location
    var contacts = {};
    _.each(movement, function (move) {
        var toAdd = getContactsFromSection(move.section, move.timeIn, move.timeOut, excluded);

        if (contacts[move.section] === undefined) {
            contacts[move.section] = toAdd;
        } else {
            contacts[move.section] = contacts[move.section].concat(toAdd);
        }


    });

    //logging
    _.each(contacts, function (contact, key) {
        if (contact.length > 0 ) {
            console.log('\tSection %s: %d contacts found', key, contact.length);
        }
    });

    //from all these contacts, figure out total contact time by person and contact frequency
    var contactsByPerson = {};

    _.each(contacts, function (contact, key) {
        _.each(contact, function (record) {
            if (contactsByPerson[record.email] === undefined) {
                contactsByPerson[record.email] = {
                    firstContactTime: record.startTime,
                    firstLocation: record.section,
                    contactFreq: 1,
                    uniqueLocations: [key],
                    totalContactDuration: record.duration
                }
            } else {
                contactsByPerson[record.email].contactFreq = contactsByPerson[record.email].contactFreq + 1;
                contactsByPerson[record.email].totalContactDuration = +(contactsByPerson[record.email].totalContactDuration + record.duration).toFixed(2);
                contactsByPerson[record.email].uniqueLocations.push(key);
            }
        })
    });


    //add filter logic here
    var suspects = [];
    _.each(contactsByPerson, function (contact, key) {
        contact.uniqueLocations = _.uniq(contact.uniqueLocations);

        if (contact.totalContactDuration > 20) {
            suspects.push({
                email: key,
                time: contact.firstContactTime,
                section: contact.firstLocation,
                locationDesc: getLocationDesc(contact.firstLocation),
                totalContactDuration: contact.totalContactDuration,
                uniqueLocations: contact.uniqueLocations.length,
                contactFreq: contact.contactFreq
            })
        }

    });



    return suspects;
};

var search = function (email, startTime, endTime, virusName, excluded, generation) {
    if (virusName === undefined) {
        virusName = 'MERS';
    }
    if (excluded === undefined) {
        excluded = [email];
    }
    if (generation === undefined) {
        generation = 0;
    }
    var virus = Virology.findOne({name: virusName});
    startTime = new Date(new Date(startTime).getTime() - virus.infectivityBeforeSymptoms * 24 * 60 * 60 * 1000).toString();

    var movement = getMovement(email, startTime, endTime);
    console.log('%s: %d locations found in search window', email, movement.length);

    console.log('\tGenerating suspects from contact list...');

    //separate movement array that accounts for incubation period
    var suspects;
    if (generation > 0) {
        var incubationOffset = virus.minIncubation; //in days
        var afterIncubation = new Date(new Date(startTime).getTime() + incubationOffset * 24 * 60 * 60 * 1000).toString();

        var infectiveMovement = getMovement(email, afterIncubation, endTime);
        suspects = getSuspectsFromMovement(infectiveMovement, excluded);
    } else {
        suspects = getSuspectsFromMovement(movement, excluded);
    }



    //log suspects
    _.each(suspects, function (contact) {
        console.log('\t--> %s: Contact Frequency = %d, Unique Locations = %d, Total Contact Duration = %d', contact.email, contact.contactFreq, contact.uniqueLocations, contact.totalContactDuration);
    });

    if (generation <= 3) {
        //add 1gen suspects to exclude list
        _.each(suspects, function (suspect) {
            excluded.push(suspect.email);
        });

        suspects = _.map(suspects, function (suspect) {
            //start a new search

            var res = search(suspect.email, suspect.time, endTime, virusName, excluded, generation + 1);
            suspect.movement = res.movement;
            suspect.contacts = res.contacts;
            return suspect;
        });
    }



    return {
        id: email,
        startTime: startTime,
        endTime: endTime,
        movement: movement,
        contacts: suspects
    }


};

//var res = search('kathleen.lam.2014@sis.smu.edu.sg', '2015-01-15 13:30:25', '2015-01-25 00:00:25');
//console.log(res);
//fs.writeFileSync('/Users/clarencenpy/Desktop/Result.json', JSON.stringify(res, null, 2));



Meteor.methods({
    search: function (email, startTime, endTime, virusName) {
        var results = search(email, startTime, endTime, virusName);
        return results;
    }
});