const CracoAntDesignPlugin = require('craco-antd');

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