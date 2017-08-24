var fs = require('fs-extra');
var path = require('path');
var cp = require('child_process');
var i18n = require('./i18n');
var co = require('co');

var projectPath = path.resolve(__dirname, '../project');


function initConfig(options){
    var locale = options.locale;
    if(locale){
        i18n.setLocale(locale);
    }
    console.log('');
    console.log('Start initing intl files...'.cyan);
    console.log('--------------------------------------------');
    console.log('');
    initProject({
                'tools/json.sh': '',
                'tools/ossutil': '',
                'tools/producer-1.0-SNAPSHOT.jar': '',
                'commons/login.com.js':'',
                'commons/release_account.com.js':''
            });
    initRunFile('', 'run.sh');
    
}

function initProject(mapFiles){
    for(var key in mapFiles){
        initProjectFileOrDir(key, mapFiles[key]);
    }
}

function initRunFile(descName, srcName){
    descName = descName || srcName;
    var srcFile = projectPath + '/' + srcName;
    var destFile = path.resolve(descName);
    console.log('init file:' + srcName);
    var appendFile = projectPath + '/' + 'run.sh';
    var content = fs.readFileSync(appendFile).toString();
    var srcLines = content.split("\n");
    if(fs.existsSync(destFile)){
	    var destLines = fs.readFileSync(destFile).toString().split("\n");
        var i = destLines.indexOf("##");
	    if(i != -1){
	    	if(destLines.slice(i+1).toString() != srcLines.toString()){
                console.log("desLines: " + destLines);
		        destLines.splice(i+1, destLines.length-i-1);
                console.log("desLines after cut: " + destLines);
                console.log("srcLinse: " + srcLines);
		        var newDestLines = destLines.concat(srcLines);
                console.log("destLinse after connect: " + newDestLines);
                content = newDestLines.join("\n");
                console.log("content to destFile:" + content);
                fs.writeFileSync(destFile, content, {encoding: 'utf-8', mode:438, flag: 'w'});
		    }
            else{
                console.log(destFile + ' is newest!');
            }
        }
        else{
            fs.writeFileSync(destFile, "##" + "\n", {encoding: 'utf-8', mode:438, flag: 'a'});
            fs.writeFileSync(destFile, content, {encoding: 'utf-8', mode:438, flag: 'a'});
        }
	    
	}
    else{
        console.log(destFile + ' is not exist, please run [ uirecorder init ], and then run [ intl-plugin init ]!');        
    }
}

function initProjectFileOrDir(srcName, descName){
    console.log('init file:' + srcName);
    descName = descName || srcName;
    var srcFile = projectPath + '/' + srcName;
    var destFile = path.resolve(descName);
    if(fs.existsSync(destFile) === false){
        fs.copySync(srcFile, destFile);
    }
    else{
        if (fs.readFileSync(srcFile).toString() == fs.readFileSync(destFile).toString()){
            console.log(destFile + ' is newest!');
            return; 
        }
        fs.copySync(srcFile, destFile);

    }
}

module.exports = initConfig;
