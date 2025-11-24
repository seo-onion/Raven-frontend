import React from 'react';
import './Timeline.css';

interface TimelineEvent {
    id: number;
    title: string;
    date: string;
    type: 'success' | 'pending' | 'warning';
    description: string;
}

interface TimelineProps {
    events: TimelineEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
    const getEventIcon = (type: string) => {
        switch (type) {
            case 'success':
                return '✓';
            case 'pending':
                return '⏳';
            case 'warning':
                return '⚠';
            default:
                return '•';
        }
    };

    return (
        <div className="timeline">
            {events.map((event, index) => (
                <div key={event.id} className={`timeline-item ${event.type}`}>
                    <div className="timeline-marker">
                        <span className="timeline-icon">{getEventIcon(event.type)}</span>
                        {index < events.length - 1 && <div className="timeline-line" />}
                    </div>
                    <div className="timeline-content">
                        <div className="timeline-header">
                            <h3 className="timeline-title text-black">{event.title}</h3>
                            <span className="timeline-date text-black">{event.date}</span>
                        </div>
                        <p className="timeline-description text-black">{event.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Timeline;
