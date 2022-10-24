// Import aws sdk
const AWS = require('aws-sdk');
const {"v4": uuidv4} = require('uuid');
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.addAddress = function(event, context, callback) {
    var params = {
        Item: {
            "Id": uuidv4(),
            "Address": event.Address,
        },
        TableName: "AddressList",
    };
	documentClient.put(params, function(err, data){
		callback(err, data);
	});
}