var fs = require('fs-extra');
var path = require('path');
var colors = require('colors');

var projectPath = path.resolve(__dirname, '../project');


function initConfig(){
    var referenceFile = path.resolve('run.sh');
    if (!fs.existsSync(referenceFile)){
        console.log(('ERROR: Please use this command in the run-level directory of run.sh or after typing [uirecorder init] !').red);
        console.log(' ');
        return;
    }
    console.log('');
    console.log('Start initing intl files...'.cyan);
    console.log('--------------------------------------------');
    console.log('');
    initProject({
                'run-aone.sh': '',
                'tools/json.sh': '',
                'tools/ossutil': '',
                'commons/login.com.js':'',
                'commons/release_account.com.js':''
            });
    initProducer();
    initRunFile();
    initInstallFile();
    initConfigFile();
    
}

function initConfigFile(){
    var destFile = path.resolve('config.json');
    if (!fs.existsSync(destFile)){
        console.log(("ERROR: config.json is not exist, please check your file and try again!").red);
        return;
    }
    var config = JSON.parse(fs.readFileSync(destFile));
    config.vars.request_acc_switch = config.vars.request_acc_switch || "off";
    config.vars.admin = config.vars.admin || "intl.e2etest@service.aliyun.com";
    config.vars.password = config.vars.password || "FfmgKtlC1";
    config.vars.account_url = config.vars.account_url || "http://100.69.206.112:12345/account";
    config.vars.bind_url = config.vars.bind_url || "http://100.69.206.112:12345/bindAcc";
    config.vars.times = config.vars.times || 600;
    annot_switch = '\n\//request_acc_switch: account pool switch;';
    annot_admin = '\n\//admin: dest web admin;';
    annot_passwd = '\n\//password: dest web passwd;';
    annot_acc_url = '\n\//account_url: acc pool url;';
    annot_bind_url = '\n\//bind_url: acc pool bind url;';
    annot_times = '\n\//times: client request time;';
    annotations = annot_switch + annot_admin + annot_passwd + annot_acc_url + annot_bind_url + annot_times;
    config.vars.annotations = annotations;
    fs.writeFileSync(destFile, JSON.stringify(config, null, 4));
    console.log('init ' + destFile + ' success!');
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
        //比对，相同打印log，不同打印log，覆盖下写入
        var destFile = destDir + '/' + destNameList[i];
        if(srcNameList[j] == destNameList[i]){
            console.log(destFile + " is the newest!");
        }
        else{
            fs.unlinkSync(destFile);
            var newDestFile = destDir + '/' + srcNameList[j];
            fs.copySync(srcFile, newDestFile);
            fs.chmodSync(newDestFile, '0755');
            console.log((" Update to " + newDestFile + ' success!').green);                    
        }
    }
    else{
        //直接写入
        var newFile = destDir + '/' + srcNameList[j];
        fs.copySync(srcFile, newFile);
        fs.chmodSync(newFile, '0755');
        console.log((" Download " + newFile + " success!").green);
    }
}


function initProject(mapFiles){
    for(var key in mapFiles){
        initProjectFileOrDir(key, mapFiles[key]);
    }
}

function initRunFile(){
    var destFile = path.resolve('run.sh');
    var appendStr = './run-aone.sh';
    if(fs.existsSync(destFile)){
	    var destLines = fs.readFileSync(destFile).toString().split("\n");
        var i = destLines.indexOf(appendStr);
	    if(i === -1){
            fs.writeFileSync(destFile, appendStr, {encoding: 'utf-8', mode:438, flag: 'a'});
            console.log(" Update " + destFile + ' success!');
		}else{
            console.log(destFile + ' is newest!');
        }
	    
	}
    else{
        console.log(destFile + ' is not exist, please run [ uirecorder init ], and then run [ intl-plugin init ]!');        
    }
}

function initInstallFile(){
    var srcFile = projectPath + '/' + 'install.sh';
    var destFile = path.resolve('install.sh');
    var content = fs.readFileSync(srcFile).toString();
    var srcLines = content.split("\n");
    var reg = /\bnvm\sinstall\sv/;
    if(fs.existsSync(destFile)){
        if (fs.readFileSync(srcFile).toString() == fs.readFileSync(destFile).toString()){
            console.log(destFile + ' is newest!');
            return;
        }
	    var destLines = fs.readFileSync(destFile).toString().split("\n");
        for (var i=0; i<srcLines.length; i++){
            if (reg.test(srcLines[i])){
                break;
            }
        }
        for (var j=0; j<destLines.length; j++){
            if (reg.test(destLines[j])){
                break;
            }
        }
        if (i == srcLines.length || j == destLines.length){
            console.log("Not found nvm install cmd!".red);
        }else{
            if (srcLines[i] != destLines[j]){
                srcLines[i] = destLines[j];
            }
        }
        content = srcLines.join("\n");
        fs.writeFileSync(destFile, content, {encoding: 'utf-8', mode:438, flag: 'w'});
        fs.chmodSync(destFile, '0755');
        console.log(" Update " + destFile + ' success!');
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
        fs.chmodSync(destFile, '0755');
        console.log(" Download " + destFile + ' success!');
    }
    else{
        if (fs.readFileSync(srcFile).toString() == fs.readFileSync(destFile).toString()){
            console.log(destFile + ' is newest!');
            return; 
        }
        fs.copySync(srcFile, destFile);
        fs.chmodSync(destFile, '0755');
        console.log(" Update " + destFile + ' success!');
    }

}

module.exports = initConfig;
