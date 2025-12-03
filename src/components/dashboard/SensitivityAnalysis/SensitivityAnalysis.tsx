import React from 'react';
import { useTranslation } from 'react-i18next';
import './SensitivityAnalysis.css';

interface SensitivityAnalysisProps {
    revenueMultiplier: number;
    setRevenueMultiplier: (value: number) => void;
    costMultiplier: number;
    setCostMultiplier: (value: number) => void;
}

const SensitivityAnalysis: React.FC<SensitivityAnalysisProps> = ({
    revenueMultiplier,
    setRevenueMultiplier,
    costMultiplier,
    setCostMultiplier,
}) => {
    const { t } = useTranslation('common');

    // Convert multiplier (e.g., 1.0) to percentage (e.g., 100) for slider display
    const displayRevenue = Math.round(revenueMultiplier * 100);
    const displayCosts = Math.round(costMultiplier * 100);

    const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRevenueMultiplier(Number(e.target.value) / 100);
    };

    const handleCostsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCostMultiplier(Number(e.target.value) / 100);
    };

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
                        <span className="sensitivity-value">{displayRevenue}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="200" // Allow revenue to go from 0% to 200%
                        value={displayRevenue}
                        onChange={handleRevenueChange}
                        className="sensitivity-slider"
                    />
                </div>

                <div className="sensitivity-control-item">
                    <div className="sensitivity-control-header">
                        <label className="sensitivity-label">
                            {t('costs')}
                        </label>
                        <span className="sensitivity-value">{displayCosts}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="200" // Allow costs to go from 0% to 200%
                        value={displayCosts}
                        onChange={handleCostsChange}
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
                        {/* This calculation is now illustrative, as actual impact is reflected in Finanzas.tsx */}
                        ${((displayRevenue - displayCosts) * 100).toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SensitivityAnalysis;

