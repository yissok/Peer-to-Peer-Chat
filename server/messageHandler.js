/*
This file is the example js file, I only edited some parts to make the multi user chat work;
further comments will highlight my changes.
*/

var  connectedPeers = {};
var peerIDs=new Array();
var lastId=0;

function onMessage(ws, message){
    var type = message.type;
    switch (type) {
        case "ICECandidate":
            onICECandidate(message.ICECandidate, message.destination, ws.id);
            break;
        case "offer":
            onOffer(message.offer, message.destination, ws.id);
            break;
        case "answer":
            onAnswer(message.answer, message.destination, ws.id);
            break;
        case "init":
            onInit(ws, message.init);
            break;
        default:
            throw new Error("invalid message type");
    }
}

// EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED
// EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED
// EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED


/*
 * This function checks for new connections to the server and stores IDs; it then gives the ids
 * to all pages
 */
function onInit(ws, id){
    console.log("init from peer:", id);
    if(peerIDs.length==0)
    {
        peerIDs.push(0);
    }
    else
    {
        peerIDs.push(peerIDs.length);
    }
    
    lastId=peerIDs.length-1;
    ws.id = lastId;
    connectedPeers[lastId] = ws;
    giveAllIDs(lastId);
    for(var i=0;i<peerIDs.length;i++)
    {
        listIDs(i);
    }
}


/*
 * Sends the last ID of the list to the last page connected
 */
function giveAllIDs(lastId)
{
    connectedPeers[lastId].send(JSON.stringify({
        type:'IDset',
        IDset:lastId,
    }));
}


/*
 * Sends the whole list of IDs to the specified page (index "i")
 */
function listIDs(i)
{
    connectedPeers[i].send(JSON.stringify({
        type:'IDlist',
        IDlist:peerIDs,
    }));
}
// EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED
// EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED
// EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED EDITED

function onOffer(offer, destination, source){
    console.log("offer from peer:", source, "to peer", destination);
    connectedPeers[destination].send(JSON.stringify({
        type:'offer',
        offer:offer,
        source:source,
    }));
}

function onAnswer(answer, destination, source){
    console.log("answer from peer:", source, "to peer", destination);
    connectedPeers[destination].send(JSON.stringify({
        type: 'answer',
        answer: answer,
        source: source,
    }));
}

function onICECandidate(ICECandidate, destination, source){
    console.log("ICECandidate from peer:", source, "to peer", destination);
    connectedPeers[destination].send(JSON.stringify({
        type: 'ICECandidate',
        ICECandidate: ICECandidate,
        source: source,
    }));
}

module.exports = onMessage;

//exporting for unit tests only
module.exports._connectedPeers = connectedPeers;