import { getMovementFields } from 'data/DataMovementFields';
import { useSettingsApi } from 'hooks/UseSettingsApi';

export function useMovementFieldApi() {
    const settingsApi = useSettingsApi();

    const movementFields = getMovementFields(settingsApi.settings);

    return {
        movementFields
    };
}