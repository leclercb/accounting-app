import { Buffer } from 'buffer';
import moment from 'moment';
import { getConfig } from 'config/Config';
import { verifyCryptoSync } from 'utils/ElectronIpc';

const PUBLIC_KEY = getConfig().license.publicKey;

export function verifyLicense(license) {
    if (!license) {
        return null;
    }

    license = license.trim();

    if (license.length <= 512) {
        return null;
    }

    const signature = license.substr(0, 512);
    const message = license.substr(512);

    const verified = verifyCryptoSync('RSA-SHA256', message, PUBLIC_KEY, signature, 'hex');

    if (verified) {
        const jsonContent = Buffer.from(message, 'hex').toString();

        try {
            const content = JSON.parse(jsonContent);

            const sku = content.itemSku;

            if (sku !== getConfig().appItemSku && sku !== getConfig().appTrialItemSku) {
                return null;
            }

            if (content.expirationDate && moment(content.expirationDate).isBefore(moment())) {
                return null;
            }

            return content;
        } catch (e) {
            return null;
        }
    } else {
        return null;
    }
}