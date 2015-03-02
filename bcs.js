var http = require('http');
var sign = require('./sign');
var fs = require('fs');
var path = require('path');
var options = {
    hostname: 'bcs.duapp.com',  
    port: 80
};
var bcs = {};
function request(opt, callback) {
    var req = http.request(opt, function(res) {
        //res.setEncoding(encode);
        var statusCode = res.statusCode;
        var headers = res.headers;
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function() {
            try {
                data = JSON.parse(data);
            } catch (e) {
            }
            callback(statusCode, headers, data);
        });
    });
    req.on('error', function(e) {
        console.log('problem with request ' + opt.path + ' : ' + e.message);
        callback(statusCode, headers, null);
    });
    req.end();
}
bcs.setKeys = function (accessKey, secrectKey) {
    sign.setAccessKey(accessKey);
    sign.setSecrectKey(secrectKey);
}
bcs.listBucket =  function (callback) {
    var signstr = sign.getSign('GET', '', '');
    console.log(signstr);
    var opt = {
        hostname: options.hostname,
        port: options.port,
        path: '/' + '?sign=' + signstr,
        method: 'GET'
    };
    request(opt, function (statusCode, headers, data) {
        callback(statusCode, headers, data);
    });
}

bcs.putBucket =  function (buckect, acl, callback) {
    acl = acl || 'private';
    var signstr = sign.getSign('PUT', buckect, '');
    //console.log(signstr);
    var opt = {
        hostname: options.hostname,
        port: options.port,
        path: '/' + buckect + '?sign=' + signstr,
        method: 'PUT',
        headers: {
            'x-bs-acl': acl
        }
    };
    request(opt, function (statusCode, headers, data) {
        callback(statusCode, headers, data);
    });
}
bcs.deleteBucket = function (buckect, callback) {
    var signstr = sign.getSign('DELETE', buckect, '');
    var opt = {
        hostname: options.hostname,
        port: options.port,
        path: '/' + buckect + '?sign=' + signstr,
        method: 'DELETE'
    };
    request(opt, function (statusCode, headers, data) {
        callback(statusCode, headers, data);
    });
}

bcs.listObject =  function (buckect, callback) {
    var signstr = sign.getSign('GET', buckect, '');
    var opt = {
        hostname: options.hostname,
        port: options.port,
        path: '/' + buckect + '?sign=' + signstr,
        method: 'GET'
    };
    request(opt, function (statusCode, headers, data) {
        callback(statusCode, headers, data);
    });
}
bcs.deleteObject =  function (buckect, object, callback) {
    var signstr = sign.getSign('DELETE', buckect, object);
    var opt = {
        hostname: options.hostname,
        port: options.port,
        path: '/' + buckect + '/' + object + '?sign=' + signstr,
        method: 'DELETE'
    };
    request(opt, function (statusCode, headers, data) {
        callback(statusCode, headers, data);
    });
}
bcs.putObject = function (buckect, object, acl, file, callback) {
    acl = acl || 'private';
    var signstr = sign.getSign('PUT', buckect, object);
    console.log(signstr);
    var stat = fs.statSync(file);
    //var extname = path.extname(file);
    var opt = {
        hostname: options.hostname,
        port: options.port,
        path: '/' + buckect + '/' + object + '?sign=' + signstr,
        method: 'PUT',
        headers: {
            'x-bs-acl': acl,
            'Content-Length': stat.size
            //'Content-Type': 'text/plain'
        }
    };
    var req = http.request(opt, function(res) {
        var statusCode = res.statusCode;
        var headers = res.headers;
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function() {
            try {
                data = JSON.parse(data);
            } catch (e) {
            }
            callback(statusCode, headers, data);
        });
    });
    req.on('error', function(e) {
        console.log('problem with request ' + opt.path + ' : ' + e.message);
        callback(statusCode, headers, null);
    });
    fs.createReadStream(file).pipe(req);
    //req.end();
}

module.exports = bcs;