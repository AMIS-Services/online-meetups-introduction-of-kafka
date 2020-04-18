
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

function config() {
    postData('../config', { "refreshFromBeginning": "Y" })
        .then((data) => {
            console.log(data); // JSON data parsed by `response.json()` call
        });
}//config

// utility function to create an Unordered List (UL) from the elements in an array (with strings or stringable values)
function makeUL(array) {
    // Create the list element:
    var list = document.createElement('ul');
    for (var i = 0; i < array.length; i++) {
        // Create the list item:
        var item = document.createElement('li');
        // Set its contents:
        item.appendChild(document.createTextNode(array[i]));
        // Add it to the list:
        list.appendChild(item);
    }
    // Finally, return the constructed list:
    return list;
}  //makeUL       


// perform an XHR request to fetch a JSON array with the names of all the (non-internal) topics on the Kafka Cluster
async function getData(url = '') {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'GET'
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

getData('../topics')
    .then((data) => {
        console.log(data); // JSON data parsed by `response.json()` call
        const topicsDIV = document.getElementById("topics");
        topicsDIV.appendChild(makeUL(data))
    });

function clearMessageTable() {
    var table = document.getElementById("topicMessagesTable");
    // delete all rows after header
    const totalRowCount = table.rows.length; // 5
    // remove all but the first (header) row 
    for (let i = totalRowCount; i > 1; i--)
        table.deleteRow(1)
}//clearMessageTable