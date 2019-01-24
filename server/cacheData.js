var csv = Meteor.npmRequire('fast-csv');

var cacheData = function (dir) {
    // --- Generate Lookup JSONS --- //
    var PIDLookup = {};
    var LIDLookup = {};
    counter = 1;

    var stream = fs.createReadStream(dir + 'location_2015_1_1.csv');
    var csvStream = csv()
        .on('data', function (data) {

            //PIDLookup
            var pid = macMapping[data[1]];
            if (pid === undefined)  {
                //dont add it in
            } else {
                var record = {
                    time: data[0],
                    location: data[2]
                };
                if (PIDLookup[pid] === undefined) {
                    PIDLookup[pid] = [record];
                } else {
                    PIDLookup[pid].push(record)
                }
            }

            //LIDLookup
            var record = {
                time: data[0],
                email: macMapping[data[1]]
            };
            if (record.email) {
                if (LIDLookup[data[2]] === undefined) {
                    LIDLookup[data[2]] = [record];
                } else {
                    LIDLookup[data[2]].push(record)
                }
            }

            counter++;

            if(counter % 1000000 === 0) {
                console.log('save');
                fs.writeFileSync(dir + 'PIDLookup.json', JSON.stringify(PIDLookup, null, 2));
                fs.writeFileSync(dir + 'LIDLookup.json', JSON.stringify(LIDLookup, null, 2));
            }
        })
        .on('end', function () {
            fs.writeFileSync(dir + 'PIDLookup.json', JSON.stringify(PIDLookup, null, 2));
            fs.writeFileSync(dir + 'LIDLookup.json', JSON.stringify(LIDLookup, null, 2));
            console.log('done');
        });
    stream.pipe(csvStream);
};

//cacheData('/Users/clarencenpy/Downloads/TheProtocolDB/');



//compress records for consecutive pings at the same location

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


var compressRecords = function (data) {

    var output = {};

    _.each(data, function (records, key) { //every person
        var compressed = [];
        var curRecord = records[0];

        //if there is only one record
        if (records.length === 1) {
            //do not add
            //compressed.push({
            //    location: curRecord.location,
            //    section: locationMapping[curRecord.location].section,
            //    timeIn: curRecord.time,
            //    timeOut: curRecord.time    //timeOut shall be the same as timeIn
            //})
        } else {

            for (var i = 1; i < records.length; i++) {
                var record = records[i];
                if (locationMapping[curRecord.location].section !== locationMapping[record.location].section) {   //new location encountered
                    if (curRecord.time !== records[i-1].time) {
                        compressed.push({
                            location: curRecord.location,
                            section: locationMapping[curRecord.location].section,
                            timeIn: curRecord.time,
                            timeOut: records[i - 1].time
                        });
                    }
                    curRecord = record;
                }
            }

            // cover the case where the person only visited one location
            if (curRecord.time !== records[records.length-1].time) {
                compressed.push({
                    location: curRecord.location,
                    section: locationMapping[curRecord.location].section,
                    timeIn: curRecord.time,
                    timeOut: records[records.length - 1].time
                });
            }
        }
        console.log('%s - Compressed %d records to %d', key, records.length, compressed.length);
        if (compressed.length !== 0) {
            output[key] = compressed;
        }
    });

    return output;
};

var sortBySection = function (data) {
    var locationMap = {};
    _.each(data, function (records, key) {   //by person
        _.each(records, function (record) {
            if (locationMap[record.section] === undefined) {
                locationMap[record.section] = [{
                    timeIn: record.timeIn,
                    timeOut: record.timeOut,
                    email: key
                }]
            } else {
                locationMap[record.section].push({
                    timeIn: record.timeIn,
                    timeOut: record.timeOut,
                    email: key
                })
            }
        })
    });
    return locationMap;
};


//var compressed = compressRecords(PIDLookup);
//fs.writeFileSync(dataDir + 'compressedPIDLookup.json', JSON.stringify(compressed, null, 2));

//var sortByLocation = sortBySection(compressed);
//fs.writeFileSync(dataDir + 'compressedLIDLookup.json', JSON.stringify(sortByLocation, null, 2));

