// assume that API service is published on same server that is the server of this HTML file
let source = new EventSource("../updates");

const messages = []

const showMessageInTable = function (data) {
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
    timestampCell.innerHTML = (new Date(data.timestamp) + "").substr(0, 24) //.toISOString();
}

function clearMessageTable() {
    var table = document.getElementById("topicMessagesTable");
    // delete all rows after header
    const totalRowCount = table.rows.length; // 5
    // remove all but the first (header) row 
    for (let i = totalRowCount; i > 1; i--)
        table.deleteRow(1)
    
}//clearMessageTable

const clearMessages = function () {
    clearMessageTable()
    messages.length = 0
}

const displayAllMessagesInTable = function (messages) {
    // use slice to create a shallow copy and reverse    messages.slice().reverse().forEach( showMessageInTable )
    messages.slice().reverse().forEach( showMessageInTable )
} 

const rewriteTable = function () {
    clearMessageTable()
    displayAllMessagesInTable(messages)
}

source.onmessage = function (event) {
    console.log(`Received event ${JSON.stringify(event)}`)
    const data = JSON.parse(event.data);
    messages.unshift(data)
    showMessageInTable(data)
}
