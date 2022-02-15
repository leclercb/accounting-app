import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AutoUpdater from 'components/autoupdater/AutoUpdater';
import AppLayout from 'components/layout/AppLayout';
import { useAppApi } from 'hooks/UseAppApi';
import { useAutoUpdaterApi } from 'hooks/UseAutoUpdaterApi';
import { useConfidenceApi } from 'hooks/UseConfidenceApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { closeCurrentWindow, getCurrentWindowPosition, getCurrentWindowSize, setBadgeCount } from 'utils/ElectronIpc';

import 'App.css';
import 'font-awesome.js';
import 'react-virtualized/styles.css';
import 'components/common/table/VirtualizedTable.css';

function App() {
    const appApi = useAppApi();
    const autoUpdaterApi = useAutoUpdaterApi();
    const confidenceApi = useConfidenceApi();
    const settingsApi = useSettingsApi();

    const [started, setStarted] = useState(false);

    useEffect(() => {
        const onStart = async () => {
            await appApi.loadData();
            setStarted(true);
        };

        onStart();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const onStarted = async () => {
            autoUpdaterApi.checkForUpdates(true);
        };

        if (started) {
            onStarted();
        }
    }, [started]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const onClose = () => {
            const close = async () => {
                const size = await getCurrentWindowSize();
                const position = await getCurrentWindowPosition();

                await settingsApi.updateSettings({
                    windowSizeWidth: size[0],
                    windowSizeHeight: size[1],
                    windowPositionX: position[0],
                    windowPositionY: position[1]
                });

                await appApi.saveData();

                await closeCurrentWindow();
            };

            if (settingsApi.settings.confirmBeforeClosing) {
                Modal.confirm({
                    title: 'Do you want to close Accounting ?',
                    onOk: () => {
                        close();
                    }
                });
            } else {
                close();
            }
        };

        const { ipcRenderer } = window.electron;

        ipcRenderer.removeAllListeners('window-close');
        ipcRenderer.on('window-close', onClose);
    }, [ // eslint-disable-line react-hooks/exhaustive-deps
        settingsApi.settings.confirmBeforeClosing
    ]);

    useEffect(() => {
        const unknownConfidence = confidenceApi.confidenceStats.find(confidence => confidence.id === 'unknown');
        setBadgeCount(unknownConfidence.count);
    }, [confidenceApi.confidenceStats]);

    return (
        <DndProvider backend={HTML5Backend}>
            <AutoUpdater />
            <AppLayout />
        </DndProvider>
    );
}

export default App;