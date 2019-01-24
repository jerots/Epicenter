var drawNetwork = function (root) {
    var diameter = 960;

    var tree = d3.layout.tree()
        .size([360, diameter / 2 - 120])
        .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

    var diagonal = d3.svg.diagonal.radial()
        .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

    //clear any contents if present
    $('#network').html('');

    var svg = d3.select("#network").append('svg')
        .attr("width", diameter)
        .attr("height", diameter)
        .append("g")
        .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    var nodes = tree.nodes(root),
        links = tree.links(nodes);

    var link = svg.selectAll(".link")
        .data(links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", diagonal);

    var node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

    node.on("mouseover", function(d) {
        var g = d3.select(this); // The node;
        // The class is used to remove the additional text later
        var info = g.append('text')
            .classed('info', true)
            .attr('x', 0)
            .attr('y', 20)
            .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
            .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
            .text('Contacted: ' + d.timeContacted);
    })
        .on("mouseout", function() {
            // Remove the info text on mouse out.
            d3.select(this).select('text.info').remove();
        });

    node.append("circle")
        .attr("r", 4.5);

    node.append("text")
        .attr("dy", ".31em")
        .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
        .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
        .text(function(d) { return d.id; });

    d3.select(self.frameElement).style("height", diameter - 150 + "px");
};

Template.network.onRendered(function () {

    //init slider
    this.$('#slider').slider({
        range: false,
        min: 500,
        max: 2500,
        step: 60,
        value: 2500,
        slide: function (event, ui) {
            drawNetwork(generateRoot(fake, ui.value))
        }
    });

    drawNetwork(generateRoot(fake, 2400));
});

var generateRoot = function (data, endTime) {
    var root = {
        id: data.id,
        children: getChildren(data.contacts, endTime)
    };
    return root;
};

//recursively build the nested tree
var getChildren = function (contacts, endTime) {
    var children = [];
    _.each(contacts, function (contact) {
        if(contact.timeContacted <= endTime) {
            var child = {};
            child.id = contact.id;
            child.timeContacted = contact.timeContacted;
            if (contact.contacts && contact.contacts.length > 0) {
                child.children = getChildren(contact.contacts, endTime);
            }
            children.push(child);
        }

    });
    return children;
};