import React from 'react';
import { Layout, Spin } from 'antd';
import { useSelector } from 'react-redux';
import Header from 'components/layout/Header';
import MovementTable from 'components/movements/table/MovementTable';
import RuleView from 'components/rules/conditiontree/RuleView';
import ModalSettingManager from 'components/settings/ModalSettingManager';
import NotificationManager from 'components/thread/NotificationManager';
import ModalThreadManager from 'components/thread/ModalThreadManager';
import { getSelectedView } from 'selectors/SettingSelectors';
import { isBusy } from 'selectors/ThreadSelectors';
import CategoryTable from 'components/categories/table/CategoryTable';

function AppLayout() {
    const busy = useSelector(isBusy);

    const selectedView = useSelector(getSelectedView);

    const getView = () => {
        switch (selectedView) {
            case 'expenses':
                return (<CategoryTable type="expenses" />);
            case 'income':
                return (<CategoryTable type="income" />);
            case 'movements':
                return (<MovementTable />);
            default:
                return (<RuleView />);
        }
    };

    return (
        <React.Fragment>
            <NotificationManager />
            <ModalThreadManager />
            <ModalSettingManager />
            <Spin style={{ minHeight: '100%', height: '100%' }} spinning={busy}>
                <Layout style={{ minHeight: '100%', height: '100%' }}>
                    <Layout.Header>
                        <Header />
                    </Layout.Header>
                    <Layout style={{ height: '100%', position: 'relative', backgroundColor: 'white' }}>
                        {getView()}
                    </Layout>
                    <Layout.Footer>
                        XXX
                    </Layout.Footer>
                </Layout>
            </Spin>
        </React.Fragment>
    );
}

export default AppLayout;