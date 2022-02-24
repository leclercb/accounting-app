import { addColorsToArray } from 'utils/ColorUtils';

export function getBank(bankId) {
    return getBanks().find(bank => bank.id === bankId);
}

export function getBanks() {
    return addColorsToArray([
        {
            id: 'ing',
            title: 'ING'
        },
        {
            id: 'kbc',
            title: 'KBC'
        }
    ]);
}