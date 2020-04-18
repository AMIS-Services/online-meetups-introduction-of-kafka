// assume that API service is published on same server that is the server of this HTML file
var source = new EventSource("../updates");
source.onmessage = function (event) {
    console.log(`Received event ${JSON.stringify(event)}`)
    var data = JSON.parse(event.data);

            var table = document.getElementById("topicMessagesTable");
            var row = table.insertRow(1); // after header
       
            var keyCell = row.insertCell(0);
            var topicCell = row.insertCell(1);
            var contentCell = row.insertCell(2);
            var partitionCell = row.insertCell(3);
            var offsetCell = row.insertCell(4);
            var timestampCell = row.insertCell(5);
            
            keyCell.innerHTML = data.key;
            topicCell.innerHTML = data.topic;
            contentCell.innerHTML = data.content;
            partitionCell.innerHTML = data.partition;
            offsetCell.innerHTML = data.offset;
            timestampCell.innerHTML = (new Date(data.timestamp)+"").substr(0,24) //.toISOString();
 
        }
    
;//onMessage