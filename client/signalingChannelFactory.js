/*
This file is the example js file, I only edited some parts to make the multi user chat work;
further comments will highlight my changes.
*/

function SignalingChannel(id){

    var _ws;
    var self = this;

    function connectToTracker(url){
        _ws = new WebSocket(url);
        _ws.onopen = _onConnectionEstablished;
        _ws.onclose = _onClose;
        _ws.onmessage = _onMessage;
        _ws.onerror = _onError;
    }

    function _onConnectionEstablished(){
        _sendMessage('init', id);
    }

    function _onClose(){
        console.log("connection closed");
    }

    function _onError(err){
        console.error("error:", err);
    }


    function _onMessage(evt){
        var objMessage = JSON.parse(evt.data);
        switch (objMessage.type) {
            case "ICECandidate":
                self.onICECandidate(objMessage.ICECandidate, objMessage.source);
                break;
            case "offer":
                self.onOffer(objMessage.offer, objMessage.source);
                break;
            case "answer":
                self.onAnswer(objMessage.answer, objMessage.source);
                break;
//ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED 
//ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED 
//ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED
                
                /*
                 * These two types were added to recognize new actions coming from the server;
                 * case "IDset" is used for the page to recognize itself
                 * case "IDlist" is to notify other pages of a page connection
                 */
                
            case "IDset":
                self.onIDset(objMessage.IDset, objMessage.source);
                break;
            case "IDlist":
                self.onIDlist(objMessage.IDlist, objMessage.source);
                break;
//ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED 
//ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED 
//ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED
            default:
                throw new Error("invalid message type");
        }
    }

    function _sendMessage(type, data, destination){
        var message = {};
        message.type = type;
        message[type] = data;
        message.destination = destination;
        try
            {
                _ws.send(JSON.stringify(message));
            }
        catch(err)
            {
                console.log("errore preso");
            }
        
    }

    function sendICECandidate(ICECandidate, destination){
        _sendMessage("ICECandidate", ICECandidate, destination);
    }

    function sendOffer(offer, destination){
        _sendMessage("offer", offer, destination);
    }

    function sendAnswer(answer, destination){
        _sendMessage("answer", answer, destination);
        
    }

    this.connectToTracker = connectToTracker;
    this.sendICECandidate = sendICECandidate;
    this.sendOffer = sendOffer;
    this.sendAnswer = sendAnswer;

    //default handler, should be overriden 
    this.onOffer = function(offer, source){
        console.log("offer from peer:", source, ':', offer);
    };

    //default handler, should be overriden 
    this.onAnswer = function(answer, source){
        console.log("answer from peer:", source, ':', answer);
    };

    //default handler, should be overriden 
    this.onICECandidate = function(ICECandidate, source){
        console.log("ICECandidate from peer:", source, ':', ICECandidate);
    };
//ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED 
//ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED 
//ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED
    
    /*
     * Receives from signaling server the ID this page should have
     */
    this.onIDset = function(ID){
        CALLER_ID=ID;
        console.log("CALLER_ID peer:", CALLER_ID);
        document.getElementById("logMessages").innerHTML = "Page id is: "+CALLER_ID;
    };
    
    
    /*
     * Receives from signaling server the list of all IDs; I sent the array (even if I could have
     * just sent the length of it for all to work the same anyway) because IDs aren't usually
     * incrementicng numbers, but are random characters...
     */
    this.onIDlist = function(IDlist){
        console.log("onIDlist from peer:", IDlist);
        localStorage.setItem("IDset",JSON.stringify(IDlist));
        document.getElementById("otherPages").innerHTML = "Peers connected: ";
        for(var i=0;i<IDlist.length;i++)
        {
            console.log("i:", i);
            if(i!=IDlist.length-1)
            {
                var t = document.createTextNode(IDlist[i]+", ");
                document.getElementById("otherPages").appendChild(t);
            }
            else
            {
                var t = document.createTextNode(IDlist[i]);
                document.getElementById("otherPages").appendChild(t);
            }
        }
    };
    
//ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED 
//ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED 
//ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED
}

window.createSignalingChannel = function(url, id){
    var signalingChannel = new SignalingChannel(id);
    signalingChannel.connectToTracker(url);
    return signalingChannel;
};
