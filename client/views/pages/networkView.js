var shortenName = function(name) {
  return name.substring(0, name.indexOf('@'));
};

var getTimeInHours = function (startTime, endTime) {
    return Math.floor((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000 / 60);
};

Template.networkView.onRendered(function () {


    //cache the arrays so we dont have to run it every single time
    var nodesArr = [];
    var edgesArr = [];
    var nodeIds = [];


    var generateVisData = function (data) {
        var visData = {};

        nodesArr.push({
            id: data.id,
            label: shortenName(data.id),
            title: 'Origin',
            color: 'rgb(256, 0, 0)',
            timeIn: 0
        });

        nodeIds.push(data.id);

        addContacts(data.id, data.contacts, nodesArr, edgesArr, data.startTime,  1);

        visData.nodes = new vis.DataSet(nodesArr);
        visData.edges = new vis.DataSet(edgesArr);

        return visData;
    };

    var addContacts = function(parent, contacts, nodesArr, edgesArr, startTime, generation) {

        _.each(contacts, function (contact) {
            //color based on generation

            var red = Math.max(220 - generation * 20, 0);
            var green = Math.max(256 - red);

            if (nodeIds.indexOf(contact.email) === -1) { //only add new node if id not already present
                nodesArr.push({
                    id: contact.email,
                    label: shortenName(contact.email),
                    title: 'Contact at ' + contact.locationDesc + ' - ' + contact.time,
                    color: 'rgb(' + red + ', ' + green + ', 0)',
                    timeIn: getTimeInHours(startTime, contact.time)
                });
                nodeIds.push(contact.email);
            }

            edgesArr.push({from: parent, to: contact.email});
            if (contact.contacts && contact.contacts.length > 0) {
                addContacts(contact.email, contact.contacts, nodesArr, edgesArr, startTime, generation + 1);
            }
        })
    };

    var updateVis = function (curData, endTime) {

        //add the removed nodes first (diffing)
        var curNodeIds = curData.nodes.getIds();
        var curEdgeIds = curData.edges.getIds();
        _.each(nodesArr, function (node) {
            if (curNodeIds.indexOf(node.id) === -1) {  // does not exist
                curData.nodes.add(node);
            } else {
            }
        });
        _.each(edgesArr, function (edge) {
            if (curEdgeIds.indexOf(edge.id) === -1) {  // does not exist
                curData.edges.add(edge);
            } else {
            }
        });


        //remove nodes
        curData.nodes.forEach(function (node) {
            if (node.timeIn >= endTime) {
                curData.nodes.remove(node.id);
                //remove associated edges
                curData.edges.forEach(function (edge) {
                    if(edge.from === node.id || edge.to === node.id) {
                        curData.edges.remove(edge.id);
                    }
                })
            }
        })
    };

    // create a network
    var container = this.$('#network').get(0);

    // provide the data in the vis format
    //var data = generateVisData(fake);

    var options = {
        layout: {
            //hierarchical: {
            //    sortMethod: 'directed',
            //    direction: 'LR'
            //},
            randomSeed: 2
        },
        edges: {
            smooth: true,
            arrows: {to: true}
        },
        nodes: {shape: 'dot'},
        interaction: {
            hover: true,
            tooltipDelay: 100
        },
        physics: {
            stabilization: {
                fit: true
            },
            maxVelocity: 10
        }
    };

    //init slider
    var $slider = this.$('#slider');


    // initialize network

    this.autorun(function () {
        var result = Session.get('searchResult');
        var data = generateVisData(result);
        var network = new vis.Network(container, data, options);
        var sliderMax = Math.ceil((new Date(result.endTime) - new Date(result.startTime)) / 60000 / 60);

        $slider.slider({
            range: false,
            min: 0,
            max: sliderMax,
            step: 1,
            value: sliderMax,
            slide: function (event, ui) {
                updateVis(data, ui.value);
            }
        }).slider("pips", {
            suffix: "H",
            rest: "label",
            step: 24
        });
    });


});


