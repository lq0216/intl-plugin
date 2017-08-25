var fs = require('fs-extra');
var path = require('path');
var i18n = require('./i18n');
var colors = require('colors');

var projectPath = path.resolve(__dirname, '../project');


function initConfig(options){
    var referenceFile = path.resolve('run.sh');
    if (!fs.existsSync(referenceFile)){
        console.log(('Please use this command in the run-level directory of run.sh or after typing [uirecorder init] !').red);
        console.log(' ');
        return;
    }
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
                'commons/login.com.js':'',
                'commons/release_account.com.js':''
            });
    initProducer();
    initRunFile('', 'run.sh');
    
}

function initProducer(){
    var destDir = path.resolve("tools");
    var srcDir = projectPath + "/tools/";
    var destNameList = fs.readdirSync(destDir);
    var srcNameList = fs.readdirSync(srcDir);
    var reg = /\bproducer.*?.jar\b/;
    for(var i = 0; i < destNameList.length; i++){
        if (reg.test(destNameList[i])){
            break;
        }    
    }
    for (var j=0; j<srcNameList.length; j++){
        if (reg.test(srcNameList[j])){
            break;
        }
    }
    if (j == srcNameList.length){
        console.log(("Can't find the producer in the server!").red);
        return;
    }
    var srcFile = srcDir + srcNameList[j];
    if (i < destNameList.length){
        console.log("Find dest file:" + destNameList[i]);
        //比对，相同打印log，不同打印log，覆盖下写入
        if(srcNameList[j] == destNameList[i]){
        }
        else{
            var destFile = destDir + '/' + destNameList[i];
            fs.unlinkSync(destFile);
            console.log(("Delete:" + destFile).green);
            var newDestFile = destDir + '/' + srcNameList[j];
            fs.copySync(srcFile, newDestFile);
            console.log((" Update to" + newDestFile + ' success!').green);                    
        }
    }
    else{
        //直接写入
        var newFile = destDir + '/' + srcNameList[j];
        fs.copySync(srcFile, newFile);
        console.log(("Download " + srcNameList[j] + " success!").green);
    }
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
                console.log(" Update " + destFile + ' success!');
		    }
            else{
                console.log(destFile + ' is newest!');
            }
        }
        else{
            fs.writeFileSync(destFile, "##" + "\n", {encoding: 'utf-8', mode:438, flag: 'a'});
            fs.writeFileSync(destFile, content, {encoding: 'utf-8', mode:438, flag: 'a'});
            console.log(" Init " + destFile + ' success!');
        }
	    
	}
    else{
        console.log(destFile + ' is not exist, please run [ uirecorder init ], and then run [ intl-plugin init ]!');        
    }
}

function initProjectFileOrDir(srcName, descName){
    descName = descName || srcName;
    var srcFile = projectPath + '/' + srcName;
    var destFile = path.resolve(descName);
    if(fs.existsSync(destFile) === false){
        fs.copySync(srcFile, destFile);
        console.log(" Download " + destFile + ' success!');
    }
    else{
        if (fs.readFileSync(srcFile).toString() == fs.readFileSync(destFile).toString()){
            console.log(destFile + ' is newest!');
            return; 
        }
        fs.copySync(srcFile, destFile);
        console.log(" Update " + destFile + ' success!');
    }

}

module.exports = initConfig;
