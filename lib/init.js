var fs = require('fs-extra');
var path = require('path');
var cp = require('child_process');
var i18n = require('./i18n');
var co = require('co');

var projectPath = path.resolve(__dirname, '../project');


function initConfig(options){
    cp.execSync('npm install uirecorder mocha -g');
    var locale = options.locale;
    if(locale){
        i18n.setLocale(locale);
    }
    var hostsPath = 'hosts';
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
    var appendFile = projectPath + '/' + 'run_append_info.js';
    var content = fs.readFileSync(appendFile).toString();
    if(fs.existsSync(destFile)){
        if (fs.readFileSync(srcFile).toString() == fs.readFileSync(destFile).toString()){
            console.log(destFile + ' is newest!');
            return;
        }
        //删除文件
        fs.unlinkSync(destFile);
        //通过uirecorder init 重新下载文件
        cp.execSync('uirecorder init');
        //追加写文件
        fs.writeFileSync(destFile, JSON.stringify(config, null, 4), {encoding: 'utf-8', mode:438, flag: 'a'});
    }
    else{
        fs.copySync(srcFile, destFile);        
    }
}

function initProjectFileOrDir(srcName, descName){
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
