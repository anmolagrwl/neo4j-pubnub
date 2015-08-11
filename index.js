var db = require("seraph")("http://localhost:7474");

var pubnub = require("pubnub")({
    subscribe_key: 'demo', // always required
    publish_key: 'demo'    // only required if publishing
});

var train, tra;

// Update node
// ----------------------
tra = { name: "Train-1" };

function update_node() {
  db.find(tra, function (err, result) {
      if (err) throw err;
      // console.log(result);
      for (r of result) {
        train = r;
      }

      train["availableSeats"]--; //reduces number of seats by 1
      db.save(train, function(err, node) {
        pubnub.publish({  //publishing the updated seat numbers through PubNub, in 'neo4j' channel
          channel: "neo4j",
          message: {"seats_left": node["availableSeats"]}, //this is the message payload we are sending
          callback: function(m){console.log(m)}
        });
      })

      console.log(train);
  });
}

update_node();


// CREATE(:Train{name: "Train-1", availableSeats: 50})
// CREATE(:City{name: "Mumbai"})
// CREATE(:City{name: "Delhi"})
//
// MATCH (d:City{name:"Delhi"}), (t:Train{name:"Train-1"}) CREATE (d)-[:ORIGIN]->(t)
// MATCH (m:City{name:"Mumbai"}), (t:Train{name:"Train-1"}) CREATE (t)-[:DESTINATION]->(m)
