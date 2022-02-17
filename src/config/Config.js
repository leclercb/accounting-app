const config = {
    common: {

        appItemSku: 'tu-app-pro-1',
        appTrialItemSku: 'tu-app-pro-trial-1'
    },
    local: {
        license: {
            publicKey: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4tP95NhDLLMaO7qNfWU5\nHGrnJoVd7MxS0Hc4svmyv4GPa9FBVZPtiQwVOm4OpkFLBxIxr/c3lxIecar7a53R\nepcoTLs1qaZeuBwTruOiHHbkbwA8u/ntrJIahtqMLZ9HH8yLJaymC2OLjaT18hcZ\n8W7n89fSR262ZZcd0joY4eTpF/sEnCZpccpBGKEwVHtOFyna+E+XzgQrSFe+0qEz\nPIU9P8gGDmuBm8xXx6w8OwKSM3jAQ01ja7l5epsrNWXD8z3PJrOom5cigiu8l1Sk\nJJoWoH5gNUNOqMqeH4mpCbfn6YF69aNAVrZcXkB+rkGFdgdQrQXWyyJufFKviSyd\niwIDAQAB\n-----END PUBLIC KEY-----'
        }
    },
    dev: {
        license: {
            publicKey: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4tP95NhDLLMaO7qNfWU5\nHGrnJoVd7MxS0Hc4svmyv4GPa9FBVZPtiQwVOm4OpkFLBxIxr/c3lxIecar7a53R\nepcoTLs1qaZeuBwTruOiHHbkbwA8u/ntrJIahtqMLZ9HH8yLJaymC2OLjaT18hcZ\n8W7n89fSR262ZZcd0joY4eTpF/sEnCZpccpBGKEwVHtOFyna+E+XzgQrSFe+0qEz\nPIU9P8gGDmuBm8xXx6w8OwKSM3jAQ01ja7l5epsrNWXD8z3PJrOom5cigiu8l1Sk\nJJoWoH5gNUNOqMqeH4mpCbfn6YF69aNAVrZcXkB+rkGFdgdQrQXWyyJufFKviSyd\niwIDAQAB\n-----END PUBLIC KEY-----'
        }
    },
    prod: {
        license: {
            publicKey: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAocK4w+shPGvQsDaR8NTn\nRlQy/u7VpzPWVtjTOE+BXNGtlP+NqTmR5kTygr5p83ntcGloL1Qdy7OtF1wtwlBN\n8c9HMHgQcSM8YUkiziCirU2cHy237xtPnIiHN5ygSqsS+8Pyvy7Uhmb/6HXZvUCi\nQCTZsfcm5JxOcbbSLf+rxLIcQRkiSmhLUWoockeN/valHJnd93nHlKyjWKAInY2S\n1YOeXpwKIW8a+Uy3buc1IxnJIM426wk9X4EcH6UL1+0P/vsNG8HkHJNjMRJKoadx\nD9S/Br/isbgm2aVGkNPVq3p2VwxiTFlui1pfRXcgLAKCxv5xvcTL805m8sbWH3K0\nzQIDAQAB\n-----END PUBLIC KEY-----'
        }
    }
};

export function getConfig() {
    return {
        ...config.common,
        ...config[process.env.REACT_APP_STAGE]
    };
}