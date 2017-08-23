const fs = require('fs');
const path = require('path');
const chai = require("chai");
const request = require('request');
const should = chai.should();
const JWebDriver = require('jwebdriver');
chai.use(JWebDriver.chaiSupportChainPromise);
const resemble = require('resemblejs-node');
resemble.outputSettings({
    errorType: 'flatDifferenceIntensity'
});

const rootPath = getRootPath();

module.exports = function(){

    let driver, testVars;

    before(function(){
        let self = this;
        driver = self.driver;
        testVars = self.testVars;
    });
	
	
	it('test', async function(){
		if (this.testVars.request_acc_switch == "on")
		{
			var time = this.testVars.times;
			var result = {};
			while (time > 0)
			{
				//await driver.sleep(Math.random()*150000)
				//await driver.sleep(Math.random()*60000 + 90000)
				result = await account_get(this.testVars.account_url);
				if ("admin" in result){
					this.testVars.admin = result.admin;
					this.testVars.password = result.password;
					break;
				}
				time--;
				await driver.sleep(1000);	
			}
			if (("admin" in result) == false){
				callSpec('commons/release_account.com.js');
				process.exit(1);
			}
		}
    });

    it('url: http://intl.aliyun.com', async function(){
        await driver.url(_(`http://intl.aliyun.com`));
    });

    it('waitBody: ', async function(){
        await driver.sleep(500).wait('body', 30000).html().then(function(code){
            isPageError(code).should.be.false;
        });
    });

    it('mouseMove: Intl ( a.J-change-sites, 35, 35 )', async function(){
        await driver.sleep(300).wait('a.J-change-sites', 30000)
               .sleep(300).mouseMove(35, 35);
    });

    it('click: International-EN ( #site-content li:nth-child(1) > a[data-type="lang"], 77, 8, 0 )', async function(){
        await driver.sleep(300).wait('#site-content li:nth-child(1) > a[data-type="lang"]', 30000)
               .sleep(300).mouseMove(77, 8).click(0);
    });

    it('waitBody: ', async function(){
        await driver.sleep(3500).wait('body', 30000).html().then(function(code){
            isPageError(code).should.be.false;
        });
    });

    it('mouseMove: #unlogged span, 10, 11', async function(){
        await driver.sleep(3300).wait('#unlogged span', 30000)
               .sleep(300).mouseMove(10, 11);
    });

    it('click: Log In ( #unlogged li:nth-child(2) > a, 45, 14, 0 )', async function(){
        await driver.sleep(3300).wait('#unlogged li:nth-child(2) > a', 30000)
               .sleep(300).mouseMove(45, 14).click(0);
    });

    it('waitBody: ', async function(){
        await driver.sleep(3500).wait('body', 30000).html().then(function(code){
            isPageError(code).should.be.false;
        });
    });

    it('switchFrame: #alibaba-login-box', async function(){
        await driver.switchFrame(null)
               .wait('#alibaba-login-box', 30000).then(function(element){
                   return this.switchFrame(element).wait('body');
               });
    });

    it('insertVar: Account             ... ( #fm-login-id, {{admin}} )', async function(){
        await driver.sleep(300).wait('#fm-login-id', 30000)
               .val(_(`{{admin}}`));
    });

    it('insertVar: Password: ( #fm-login-password, {{password}} )', async function(){
        await driver.sleep(300).wait('#fm-login-password', 30000)
               .val(_(`{{password}}`));
    });

    it('click: Sign In ( #fm-login-submit, 88, 20, 0 )', async function(){
        await driver.sleep(300).wait('#fm-login-submit', 30000)
               .sleep(300).mouseMove(88, 20).click(0);
    });

    it('switchFrame: null', async function(){
        await driver.switchFrame(null);
    });

    it('waitBody: ', async function(){
        await driver.sleep(500).wait('body', 30000).html().then(function(code){
            isPageError(code).should.be.false;
        });
    });

    it('waitBody: ', async function(){
        await driver.sleep(500).wait('body', 30000).html().then(function(code){
            isPageError(code).should.be.false;
        });
    });

    it('sleep: 3000', async function(){
        await driver.sleep(3000);
    });
	
	it('bind account', async function(){
		if (this.testVars.request_acc_switch == "on")
		{
			var body = {"admin": "", "bind_url": "", "case": ""};
			body.admin = this.testVars.admin;
			body.bind_url = this.testVars.bind_url;
			body.case = module.parent.id;
			await bind_post(body);
		}
    });

    function _(str){
        if(typeof str === 'string'){
            return str.replace(/\{\{(.+?)\}\}/g, function(all, key){
                return testVars[key] || '';
            });
        }
        else{
            return str;
        }
    }

};

if(module.parent && /mocha\.js/.test(module.parent.id)){
    runThisSpec();
}

function runThisSpec(){
    // read config
    let webdriver = process.env['webdriver'] || '';
    let config = require(rootPath + '/config.json');
    let webdriverConfig = Object.assign({},config.webdriver);
    let host = webdriverConfig.host;
    let port = webdriverConfig.port || 4444;
    let match = webdriver.match(/([^\:]+)(?:\:(\d+))?/);
    if(match){
        host = match[1] || host;
        port = match[2] || port;
    }
    let testVars = config.vars;
    let browsers = webdriverConfig.browsers;
    browsers = browsers.replace(/^\s+|\s+$/g, '');
    delete webdriverConfig.host;
    delete webdriverConfig.port;
    delete webdriverConfig.browsers;

    // read hosts
    let hostsPath = rootPath + '/hosts';
    let hosts = '';
    if(fs.existsSync(hostsPath)){
        hosts = fs.readFileSync(hostsPath).toString();
    }
    let specName = path.relative(rootPath, __filename).replace(/\\/g,'/').replace(/\.js$/,'');

    browsers.split(/\s*,\s*/).forEach(function(browserName){
        let caseName = specName + ' : ' + browserName;

        let browserInfo = browserName.split(' ');
        browserName = browserInfo[0];
        let browserVersion = browserInfo[1];

        describe(caseName, function(){

            this.timeout(600000);
            this.slow(1000);

            let driver;
            before(function(){
                let self = this;
                let driver = new JWebDriver({
                    'host': host,
                    'port': port
                });
                let sessionConfig = Object.assign({}, webdriverConfig, {
                    'browserName': browserName,
                    'version': browserVersion,
                    'ie.ensureCleanSession': true,
                    'chromeOptions': {
                        'args': ['--enable-automation']
                    }
                });
                if(hosts){
                    sessionConfig.hosts = hosts;
                }
                self.driver = driver.session(sessionConfig).maximize();
                self.testVars = testVars;
					
				var res = {};
                let casePath = path.dirname(caseName);
                self.screenshotPath = rootPath + '/screenshots/' + casePath;
                self.diffbasePath = rootPath + '/diffbase/' + casePath;
                self.caseName = caseName.replace(/.*\//g, '').replace(/\s*[:\.\:\-\s]\s*/g, '_');
                mkdirs(self.screenshotPath);
                mkdirs(self.diffbasePath);
                self.stepId = 0;
                return self.driver;
            });

            module.exports();

            beforeEach(function(){
                let self = this;
                self.stepId ++;
                if(self.skipAll){
                    self.skip();
                }
            });

            afterEach(async function(){
                let self = this;
                let currentTest = self.currentTest;
                let title = currentTest.title;
                if(currentTest.state === 'failed' && /^(url|waitBody|switchWindow|switchFrame):/.test(title)){
                    self.skipAll = true;
                }
                if(!/^(closeWindow):/.test(title)){
                    let filepath = self.screenshotPath + '/' + self.caseName + '_' + self.stepId;
                    let driver = self.driver;
                    await driver.getScreenshot(filepath + '.png');
                    let url = await driver.url();
                    let html = await driver.source();
                    html = '<!--url: '+url+' -->\n' + html;
                    fs.writeFileSync(filepath + '.html', html);
                }
            });

            after(function(){
                return this.driver.close();
            });

        });
    });
}


function getRootPath(){
    let rootPath = path.resolve(__dirname);
    while(rootPath){
        if(fs.existsSync(rootPath + '/config.json')){
            break;
        }
        rootPath = rootPath.substring(0, rootPath.lastIndexOf(path.sep));
    }
    return rootPath;
}

var bind_post = function (body) {
    request({url: body.bind_url, json: true, method: "POST", body: body}, function (error, response, body) {
                    if (error) return reject(error);

                 });
};


var account_get = function (url) {
    return new Promise(function (resolve, reject) {
    request({url: url, json: true}, function (error, response, body) {
                    if (error) return reject(error);

                    resolve(body);
                 });
    });
};

function mkdirs(dirname){
    if(fs.existsSync(dirname)){
        return true;
    }else{
        if(mkdirs(path.dirname(dirname))){
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

function callSpec(name){
    try{
        require(rootPath + '/' + name)();
    }
    catch(e){
        console.log(e)
        process.exit(1);
    }
}

function isPageError(code){
    return code == '' || / jscontent="errorCode" jstcache="\d+"|diagnoseConnectionAndRefresh|dnserror_unavailable_header|id="reportCertificateErrorRetry"|400 Bad Request|403 Forbidden|404 Not Found|500 Internal Server Error|502 Bad Gateway|503 Service Temporarily Unavailable|504 Gateway Time-out/i.test(code);
}

function catchError(error){

}
