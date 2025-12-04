import React from 'react';
import PortfolioStartupCard from '../PortfolioStartupCard/PortfolioStartupCard';
import './PortfolioList.css';

interface PortfolioListProps {
    startups: any[];
}

const PortfolioList: React.FC<PortfolioListProps> = ({ startups }) => {
    return (
        <div className="portfolio-list-grid">
            {startups.map((startup) => (
                <PortfolioStartupCard
                    key={startup.id}
                    id={startup.id}
                    company_name={startup.company_name}
                    industry={startup.industry}
                    logo_url={startup.logo_url}
                />
            ))}
        </div>
    );
};

export default PortfolioList;
