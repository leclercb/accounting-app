import React from 'react';
import { useAppApi } from 'hooks/UseAppApi';
import { useConfidenceApi } from 'hooks/UseConfidenceApi';
import { useMovementApi } from 'hooks/UseMovementApi';
import 'components/layout/Footer.css';

function Footer() {
    const appApi = useAppApi();
    const confidenceApi = useConfidenceApi();
    const movementApi = useMovementApi();

    return (
        <div className="footer">
            <div className="footer-element">
                {appApi.movementFile}
            </div>
            {confidenceApi.confidenceStats.map(confidence => (
                <div key={confidence.id} className="footer-element" style={{ backgroundColor: confidence.color }}>
                    {confidence.title}: {confidence.count}
                </div>
            ))}
            <div className="footer-element">
                Total: {movementApi.movements.length}
            </div>
            <div className="footer-element">
                Développé par BL-IT
            </div>
        </div>
    );
}

export default Footer;