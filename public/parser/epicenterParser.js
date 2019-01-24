/**
 * Created by eustacezheng on 21/7/15.
 */
mysql = require('mysql');
fs = require('fs');

var macEmailID = {};
var location = {};
var locationMapping = {};

var connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'TheProtocolDB'
});


function basicParsingDemographics(savetoFile) {

    connection.connect();

    connection.query('Select MAC, Email From Demographics ORDER BY Email', function (err, rows) {
        if (err) {
            return console.log(err);
        } else {
            for (var i = 0; i < rows.length; i++) {
                macEmailID[rows[i].MAC] = rows[i].Email;
            }
            savetoFile();
        }
    });

    connection.end();

}

function basicParsingLocation(saveToFile) {
    connection.connect();

    connection.query('Select * From Location LIMIT 5000', function (err, rows) {
            if (err) {
                return console.log(err);
            } else {
                for (var i = 0; i < rows.length; i++) {

                    if (location[rows[i].MAC] === undefined) {
                        location[rows[i].MAC] = [];
                    }

                    location[rows[i].MAC].push(rows[i].TimeRecord);
                    location[rows[i].MAC].push(rows[i].LocationCode);
                }
                saveToFile();
            }
        }
    );

    connection.end();
}

function basicParsingLocationMapping(saveToFile) {
    connection.connect();

    connection.query('Select * From Location_Mapping LIMIT 1000', function(err, rows) {
        if(err) {
            return console.log(err);
        } else {
            for(var i = 0; i < rows.length; i++) {
                if(locationMapping[rows[i].LocationCode] === undefined) {
                    locationMapping[rows[i].LocationCode] = [];
                }

                locationMapping[rows[i].LocationCode].push(rows[i].LocationName);
                locationMapping[rows[i].LocationCode].push(rows[i].Current_Section);

            }
            saveToFile();
        }
    });

    connection.end();
}

/*basicParsingDemographics(function saveToFile() {
 //Save to Fileclear
 console.log(macEmailID);
 });

basicParsingLocation(function saveToFile() {
 //Save to File
 console.log(location);
 });*/

basicParsingLocationMapping(function saveToFile() {
   console.log(locationMapping);
});
