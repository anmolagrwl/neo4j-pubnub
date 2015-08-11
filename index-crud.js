var db = require("seraph")

var pubnub = require("pubnub")({
    subscribe_key: 'demo', // always required
    publish_key: 'demo'    // only required if publishing
});

var mumbai, delhi, train;

// Creating a node with a label
// --------------------------------
// function create_node() {
//   db.save({ name: 'Delhi' }, 'City', function(err, node) {
//       if (err) throw err;
//       console.log(node.name);
//       delhi = (node.name);
//   });
//
//   db.save({ name: 'Mumbai' }, 'City', function(err, node) {
//       if (err) throw err;
//       console.log(node.name);
//       mumbai = (node.name);
//   });
//
//   db.save({ name: 'train-1', 'available-seats': 50 }, 'Train', function(err, node) {
//       if (err) throw err;
//       console.log(node.name);
//       train = (node.name);
//   });
// }
//
// create_node();

// Finding nodes
// ----------------
// function find_node() {
//
//   mum = { name: "Mumbai" };
//
//   db.find(mum, function (err, result) {
//       if (err) throw err;
//       // console.log(result);
//       for (r of result) {
//         console.log(r);
//         mumbai = r;
//       }
//   });
//
//   del = { name: "Delhi" };
//
//   db.find(del, function (err, result) {
//       if (err) throw err;
//       // console.log(result);
//       for (r of result) {
//         console.log(r);
//         delhi = r;
//       }
//   });
//
//   tra = { name: "train-1" };
//
//   db.find(tra, function (err, result) {
//       if (err) throw err;
//       // console.log(result);
//       for (r of result) {
//         console.log(r);
//         train = r;
//       }
//   });
// }
//
// find_node();

// Create relationships
// -------------------------
// mumbai = { name: 'Mumbai', id: 2 }
// delhi = { name: 'Delhi', id: 1 }
// train = { name: 'train-1', 'available-seats': 50, id: 0 }
//
// function create_rel() {
//   db.relate(mumbai, 'origin', train, function(err, relationship) {
//     console.log(relationship);
//   });
//
//   db.relate(train, 'destination', delhi, function(err, relationship) {
//     console.log(relationship);
//   });
// }
//
// create_rel();

// Update node
// ----------------------
tra = { name: "train-1" };

function update_node() {
    db.find(tra, function (err, result) {
        if (err) throw err;
        // console.log(result);
        for (r of result) {
            // console.log(r);
            train = r;
        }
        console.log(train);
        train["available-seats"]--;
        db.save(train, function(err, node) {
            // console.log(node);
            pubnub.publish({
                channel: 'neo4j',
                message: {"seats_left": node["available-seats"]},
                callback: function(m){console.log(m)}
            });
            return node["available-seats"];
        })
    });
}

update_node();
//
// function find_seats() {
//   db.find(tra, function (err, result) {
//       if (err) throw err;
//       var train;
//       // console.log(result);
//       for (r of result) {
//         // console.log(r);
//         train = r;
//         console.log(train["available-seats"]);
//         return train["available-seats"];
//       }
//       // console.log(train);
//   });
// }

// find_seats();


// START n = node(*)
// OPTIONAL MATCH n-[r]-()
// WHERE (ID(n)>0 AND ID(n)<10000)
// DELETE n, r;
