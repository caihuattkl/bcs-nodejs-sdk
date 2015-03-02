var bcs = require('../bcs');
var callback = function (statusCode, headers, data) {
    console.log(statusCode, headers, data);
}
bcs.setKeys('AdGlhYkMA1khQ1jq3uZMZF14','oiUqt1VpH3fddPSWmRWjDwTIWudSMxof');

//bcs.listBucket(callback);
//bcs.putBucket('yytest', 'public-read', callback);
//bcs.putObject('blogpicture', 'yuyue.png', 'public-read', 'abc.png', callback);
//bcs.deleteBucket('yytest', callback);
bcs.deleteObject('blogpicture', 'yuyue.png', callback);
//console.log(sign.getSign('GET', 'blogpicture', '/', null, '1.1.1.1'));