import dayjs from 'dayjs';
import { log as electronLog, setLogLevel } from 'utils/ElectronIpc';

export function setElectronLoggerLevel(level) {
    setLogLevel(level);
}

export function error(...params) {
    log('error', ...params);
}

export function warn(...params) {
    log('warn', ...params);
}

export function info(...params) {
    log('info', ...params);
}

export function debug(...params) {
    log('debug', ...params);
}

function log(type, ...params) {
    console[type](...params);

    params = params.map(param => {
        if (dayjs.isDayjs(param)) {
            return param.toISOString();
        }

        return param;
    });

    electronLog(type, ...params);
}

export default {
    error,
    warn,
    info,
    debug,
    log: info
};