const config = {
    common: {

    },
    local: {
       
    },
    dev: {
        
    },
    prod: {
        
    }
};

export function getConfig() {
    return {
        ...config.common,
        ...config[process.env.REACT_APP_STAGE]
    };
}