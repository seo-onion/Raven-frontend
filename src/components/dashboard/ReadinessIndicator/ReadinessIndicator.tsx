import './ReadinessIndicator.css';

interface ReadinessIndicatorProps {
    type: 'TRL' | 'CRL';
    currentLevel: number;
    totalLevels: number;
    label: string;
}

const ReadinessIndicator = ({ type, currentLevel, totalLevels, label }: ReadinessIndicatorProps) => {
    const percentage = totalLevels > 0 ? Math.round((currentLevel / totalLevels) * 100) : 0;
    const isTRL = type === 'TRL';

    return (
        <div className="readinessindicator-container">
            <h2 className="readinessindicator-label">{label}</h2>
            <div className="readinessindicator-value-row">
                <div className="readinessindicator-level">{type} {currentLevel}/{totalLevels}</div>
                <div
                    className="readinessindicator-percentage"
                    style={{ color: isTRL ? 'var(--main-secondary)' : '#3b82f6' }}
                >
                    {percentage}%
                </div>
            </div>
            <div className="readinessindicator-bar-container">
                <div
                    className="readinessindicator-bar"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: isTRL ? 'var(--main-secondary)' : '#3b82f6'
                    }}
                ></div>
            </div>
        </div>
    );
};

export default ReadinessIndicator;
