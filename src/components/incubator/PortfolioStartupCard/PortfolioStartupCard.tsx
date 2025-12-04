import React from 'react';
import Card from '@/components/common/Card/Card';
import './PortfolioStartupCard.css';

interface PortfolioStartupCardProps {
    id: number;
    company_name: string;
    industry: string;
    logo_url: string | null;
}

const PortfolioStartupCard: React.FC<PortfolioStartupCardProps> = ({ company_name, industry, logo_url }) => {
    const initial = company_name.charAt(0).toUpperCase();

    return (
        <Card className="portfolio-startup-card">
            <div className="portfolio-startup-header">
                {logo_url ? (
                    <img src={logo_url} alt={company_name} className="portfolio-startup-logo" />
                ) : (
                    <div className="portfolio-startup-initial">
                        {initial}
                    </div>
                )}
                <div className="portfolio-startup-info">
                    <h3 className="portfolio-startup-name">{company_name}</h3>
                    <span className="portfolio-startup-industry">{industry}</span>
                </div>
            </div>
        </Card>
    );
};

export default PortfolioStartupCard;
