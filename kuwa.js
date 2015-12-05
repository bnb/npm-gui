var express = require('express');
var app = express();
var exec = require('child_process').exec;
var fs = require('fs');
var bodyParser = require('body-parser');
var WebSocketServer = require('ws').Server;

//Lets define a port we want to listen to
const PORT = 1337;
const HOST = '0.0.0.0';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var consoleSocket = null;

app.put('/modules', function(req, res) {
    consoleSocket.send('start npm install --save ' + req.body.key + '\n');

    var output = '';
    var child = exec('npm install --save ' + req.body.key,
        function(error, stdout, stderr) {
            output = output + '\n' + stdout + '\n' + stderr;
            if (error !== null) {
                //output = output + error;
            }
        });

    child.stdout.on('data', function(data) {
        consoleSocket.send(data.toString());
    });

    child.stderr.on('data', function(data) {
        consoleSocket.send(data.toString());
    });

    child.stdin.on('data', function(data) {
        consoleSocket.send(data.toString());
    });

    child.on('close', function() {
        res.status(200).send('<textarea style="width:800px;height:400px;">' + output + '</textarea>');
    });
});

app.delete('/modules/:name', function(req, res) {
    consoleSocket.send('start npm uninstall --save ' + req.body.name + '\n');

    var output = '';
    var child = exec('npm uninstall --save ' + req.params.name,
        function(error, stdout, stderr) {
            output = output + '\n' + stdout + '\n' + stderr;
            if (error !== null) {
                //output = output + error;
            }
        });

    child.stdout.on('data', function(data) {
        consoleSocket.send(data.toString());
    });

    child.stderr.on('data', function(data) {
        consoleSocket.send(data.toString());
    });

    child.stdin.on('data', function(data) {
        consoleSocket.send(data.toString());
    });

    child.on('close', function() {
        res.status(200).send('<textarea style="width:800px;height:400px;">' + output + '</textarea>');
    });
});

app.get('/modules/install', function(req, res) {
    consoleSocket.send('start npm install' + '\n');
    var output = '';
    var child = exec('npm install',
        function(error, stdout, stderr) {
            output = output + '\n' + stdout + '\n' + stderr;
            if (error !== null) {
                //output = output + error;
            }
        });

    child.stdout.on('data', function(data) {
        consoleSocket.send(data.toString());
    });

    child.stderr.on('data', function(data) {
        consoleSocket.send(data.toString());
    });

    child.stdin.on('data', function(data) {
        consoleSocket.send(data.toString());
    });

    child.on('close', function() {
        res.status(200).send('<textarea style="width:800px;height:400px;">' + output + '</textarea>');
    });
});


app.get('/modules', function(req, res) {
    var packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    var arrayOfModules = [];
    buildArrayFromObject(packageJson.dependencies, arrayOfModules, 'key', 'value');
    res.status(200).send(JSON.stringify(arrayOfModules, null, 2));
});

app.get('/modules/dev', function(req, res) {
    var packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    var arrayOfDevModules = [];
    buildArrayFromObject(packageJson.devDependencies, arrayOfDevModules, 'key', 'value');

    res.status(200).send(JSON.stringify(arrayOfDevModules, null, 2));
});

app.get('/tasks', function(req, res) {
    var packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    var arrayOfTasks = [];
    buildArrayFromObject(packageJson.scripts, arrayOfTasks, 'key', 'value');

    res.status(200).send(JSON.stringify(arrayOfTasks, null, 2));
});

app.put('/tasks', function(req, res) {
    var packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    packageJson.scripts[req.body.key] = req.body.value;
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
    res.status(200).send('<textarea style="width:800px;height:400px;">' + JSON.stringify(packageJson.scripts, null, 2) + '</textarea>');
});

app.delete('/tasks/:name', function(req, res) {
    var packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    delete packageJson.scripts[req.params.name];
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
    res.status(200).send('<textarea style="width:800px;height:400px;">' + JSON.stringify(packageJson.scripts, null, 2) + '</textarea>');
});

app.post('/tasks/:name', function(req, res) {
    consoleSocket.send('npm run ' + req.params.name + '\n');
    var output = '';
    var child = exec('npm run ' + req.params.name,
        function(error, stdout, stderr) {
            output = output + '\n' + stdout + '\n' + stderr;
            if (error !== null) {
                //output = output + error;
            }
        });

    child.stdout.on('data', function(data) {
        consoleSocket.send(data.toString());
    });

    child.stderr.on('data', function(data) {
        consoleSocket.send(data.toString());
    });

    child.stdin.on('data', function(data) {
        consoleSocket.send(data.toString());
    });

    child.on('close', function() {
        res.status(200).send('<textarea style="width:800px;height:400px;">' + output + '</textarea>');
    });
});

app.use(express.static('public', {'index': ['index.html', 'index.htm']}));
app.use('/node_modules', express.static('node_modules'));

var server = app.listen(PORT, HOST, function() {
    console.log('Kufa panel running at http://' + HOST + ':' + PORT + '/');
    console.log('\n\nI will be waiting here to help you with your work with pleasure.');
});

var wss = new WebSocketServer({server: server});

wss.on('connection', function connection(ws) {
    consoleSocket = ws;
    consoleSocket.send('console connected \n');
});

wss.on('message', function connection(a, b, c) {
    console.log(a, b, c);
});

function buildArrayFromObject(sourceObject, destinationArray, keyName, valueName) {
    for (var key in sourceObject) {
        if (sourceObject.hasOwnProperty(key)) {
            var obj = {};
            obj[keyName] = key;
            obj[valueName] = sourceObject[key];
            destinationArray.push(obj);
        }
    }
}