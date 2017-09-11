var latestVersion  = require('./npm-latest-version');
var semver = require('semver');
var pkg = require('../package.json');
var colors = require('colors');

function checkUpdate(){
    var pkgName = pkg.name;
    latestVersion(pkgName).then(function(newVersion){
        var oldVersion = pkg.version;
        var isNew = semver.gt(newVersion, oldVersion);
        if(isNew){
            process.on('exit', function(){
                var updateCmd = 'sudo tnpm i '+pkgName+ ' mocha ' + ' -g';
                console.log('');
                console.log('------------------------------------------------------------------'.yellow);
                console.log('');
                console.log((" @ali/intl-plugin has update! ").green);
                console.log((" Current version: " + oldVersion).green);
                console.log((" New version: " + newVersion).green);
                console.log((" Update cmd: : " + updateCmd).green);
                console.log('');
                console.log('------------------------------------------------------------------'.yellow);
            });
            process.on('SIGINT', function () {
                console.error('');
                process.exit();
            });
        }
    });
}

module.exports = checkUpdate;
