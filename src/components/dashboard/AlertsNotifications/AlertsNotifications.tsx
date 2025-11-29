import { useTranslation } from 'react-i18next';
import './AlertsNotifications.css';

export interface Alert {
    id: string;
    type: 'warning' | 'info' | 'success';
    message: string;
}

interface AlertsNotificationsProps {
    alerts: Alert[];
}

const AlertsNotifications = ({ alerts }: AlertsNotificationsProps) => {
    const { t } = useTranslation('common');

    return (
        <div className="alertsnotifications-container">
            <h2 className="alertsnotifications-title text-black">
                {t('alerts_notifications')}
            </h2>
            <div className="alertsnotifications-list">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className={`alertsnotifications-item alertsnotifications-${alert.type}`}
                    >
                        {alert.message}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlertsNotifications;
