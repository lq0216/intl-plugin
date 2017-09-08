const packageJson = require('./tnpm-package-json');

module.exports = name => packageJson(name.toLowerCase()).then(data => data.version);
