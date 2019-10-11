//Replies with the current time, the client will find and display the delta
exports.timeTest = function(req, res) {
    res.send(new Date().getTime().toString());
}