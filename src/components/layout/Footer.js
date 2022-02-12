import React from 'react';
import { useAppApi } from 'hooks/UseAppApi';
import 'components/layout/Footer.css';

function Footer() {
    const appApi = useAppApi();

    return (
        <div className="footer">
            <div className="footer-element">
                {appApi.movementFile}
            </div>
            <div className="footer-element">
                BL-IT
            </div>
        </div>
    );
}

export default Footer;