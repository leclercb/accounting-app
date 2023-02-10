import React from 'react';
import { Button, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import ProcessList from 'components/thread/ProcessList';
import Icon from 'components/common/Icon';
import { useThreadApi } from 'hooks/UseThreadApi';

function ModalThreadManager() {
    const { t } = useTranslation();

    const threadApi = useThreadApi();

    const onClose = () => {
        threadApi.setThreadManagerVisible(false);
    };

    return (
        <Modal
            title={<Icon icon="cogs" text={t('progress')} />}
            open={threadApi.threadManagerVisible}
            closable={false}
            onOk={onClose}
            onCancel={onClose}
            footer={(
                <Button onClick={onClose}>
                    {t('close')}
                </Button>
            )}>
            <ProcessList processes={threadApi.processes} />
        </Modal>
    );
}

export default ModalThreadManager;