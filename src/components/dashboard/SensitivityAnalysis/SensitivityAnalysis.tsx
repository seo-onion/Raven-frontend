import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SensitivityAnalysis.css';

const SensitivityAnalysis: React.FC = () => {
    const { t } = useTranslation('common');
    const [revenue, setRevenue] = useState(50);
    const [costs, setCosts] = useState(50);

    return (
        <div className="sensitivity-container">
            <h3 className="sensitivity-title">{t('sensitivity_analysis')}</h3>
            <p className="sensitivity-subtitle">
                {t('adjust_variables_impact')}
            </p>

            <div className="sensitivity-controls">
                <div className="sensitivity-control-item">
                    <div className="sensitivity-control-header">
                        <label className="sensitivity-label">
                            {t('revenue')}
                        </label>
                        <span className="sensitivity-value">{revenue}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={revenue}
                        onChange={(e) => setRevenue(Number(e.target.value))}
                        className="sensitivity-slider"
                    />
                </div>

                <div className="sensitivity-control-item">
                    <div className="sensitivity-control-header">
                        <label className="sensitivity-label">
                            {t('costs')}
                        </label>
                        <span className="sensitivity-value">{costs}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={costs}
                        onChange={(e) => setCosts(Number(e.target.value))}
                        className="sensitivity-slider"
                    />
                </div>
            </div>

            <div className="sensitivity-results">
                <div className="sensitivity-result-item">
                    <span className="sensitivity-result-label">
                        {t('projected_impact')}:
                    </span>
                    <span className="sensitivity-result-value">
                        ${((revenue - costs) * 1000).toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SensitivityAnalysis;
