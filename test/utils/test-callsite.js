var createCallsiteRecord = require('callsite-record');

function someFunc() {
    //error msg
    throw new Error('Hey ya!');
}

try {
    someFunc();
} catch (err) {
    module.exports = createCallsiteRecord(err);
}
