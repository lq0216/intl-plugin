module.exports = scope => {
        const rc = require('rc')('npm', {registry: 'http://registry.npm.alibaba-inc.com'});
            const url = rc[scope + ':registry'] || rc.registry;
                return url.slice(-1) === '/' ? url : url + '/';
};
