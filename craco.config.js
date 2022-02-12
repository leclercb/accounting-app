const CracoAntDesignPlugin = require('craco-antd');
const path = require('path');

module.exports = {
    plugins: [
        {
            plugin: CracoAntDesignPlugin
        }
    ],
    eslint: {
        enable: false,
    },
    jest: {
        configure: jestConfig => {
            jestConfig.transformIgnorePatterns = [];
            return jestConfig;
        }
    }
};