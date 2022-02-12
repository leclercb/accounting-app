import moment from 'moment';

const App = () => (state = {
    dataUuid: null,
    startDate: moment().toISOString(),
    editingCell: {
        objectId: null,
        fieldId: null
    },
    movementFile: null,
    selectedCategoryIds: [],
    selectedMovementIds: [],
    selectedRuleIds: [],
    settingManager: {
        visible: false,
        category: 'general'
    }
}, action) => {
    switch (action.type) {
        case 'SET_DATA_UUID':
            return {
                ...state,
                dataUuid: action.uuid
            };
        case 'SET_EDITING_CELL':
            return {
                ...state,
                editingCell: {
                    objectId: action.objectId,
                    fieldId: action.fieldId
                }
            };
        case 'SET_MOVEMENT_FILE':
            return {
                ...state,
                movementFile: action.movementFile
            };
        case 'SET_SELECTED_CATEGORY_IDS':
            return {
                ...state,
                selectedCategoryIds: Array.isArray(action.categoryIds) ? action.categoryIds : [action.categoryIds]
            };
        case 'SET_SELECTED_MOVEMENT_IDS':
            return {
                ...state,
                selectedMovementIds: Array.isArray(action.movementIds) ? action.movementIds : [action.movementIds]
            };
        case 'SET_SELECTED_RULE_IDS':
            return {
                ...state,
                selectedRuleIds: Array.isArray(action.ruleIds) ? action.ruleIds : [action.ruleIds]
            };
        case 'SET_SETTING_MANAGER_OPTIONS':
            return {
                ...state,
                settingManager: {
                    visible: 'visible' in action ? action.visible : state.settingManager.visible,
                    category: 'category' in action ? action.category : state.settingManager.category
                }
            };
        default:
            return state;
    }
};

export default App;