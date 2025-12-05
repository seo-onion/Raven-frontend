import React, { useEffect, useState } from 'react';
import './CompanyInfo.css';
import { CiCalendar } from "react-icons/ci";
import { LuUsers } from "react-icons/lu";
import { LuDollarSign } from "react-icons/lu";
import axiosInstance from '@/api/axiosInstance';
import Spinner from '@/components/common/Spinner/Spinner';
import { useTranslation } from 'react-i18next';

interface StartupInfo {
    company_name: string;
    industry: string;
    created: string; // Assuming 'created' field exists for founded date
    current_trl: number | null;
    actual_revenue: number | null;
    team_members_count?: number; // Optional field for team members count
}

const CompanyInfo: React.FC = () => {
    const { t } = useTranslation('common');
    const [startupInfo, setStartupInfo] = useState<StartupInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStartupInfo = async () => {
            try {
                const response = await axiosInstance.get('/api/users/startup/data/');
                setStartupInfo(response.data);
            } catch (err) {
                setError(t('error_fetching_startup_data'));
                console.error('Error fetching startup data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStartupInfo();
    }, [t]);

    if (isLoading) {
        return (
            <div className="company-info loading-state">
                <Spinner variant="primary" size="md" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="company-info error-state">
                <p className="text-danger">{error}</p>
            </div>
        );
    }

    if (!startupInfo) {
        return (
            <div className="company-info no-data-state">
                <p>{t('no_startup_data_available')}</p>
            </div>
        );
    }

    const foundedDate = startupInfo.created ? new Date(startupInfo.created).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : t('not_available');
    const formattedRevenue = startupInfo.actual_revenue !== null ? `$${startupInfo.actual_revenue.toLocaleString()}` : t('not_available');
    const formattedTrl = startupInfo.current_trl !== null ? `${startupInfo.current_trl}/9` : t('not_available');
    const teamMembersCount = startupInfo.team_members_count || 1; // Default to 1 if not provided

    return (
        <div className="company-info">
            <h3 className="company-name text-black">{startupInfo.company_name || t('unnamed_startup')}</h3>
            <div className="company-details">
                <div className="detail-item">
                    <span className="detail-label text-black">{t('sector')}</span>
                    <div className="detail-content">
                        <span className="detail-value text-black">{startupInfo.industry || t('not_available')}</span>
                    </div>
                </div>
                <div className="detail-item">
                    <span className="detail-label text-black">{t('founded')}</span>
                    <div className="detail-content">
                        <CiCalendar size={20} color='var(--text-secondary)' />
                        <span className="detail-value text-black">{foundedDate}</span>
                    </div>
                </div>
                <div className="detail-item">
                    <span className="detail-label text-black">{t('founders')}</span>
                    <div className="detail-content">
                        <LuUsers size={20} color='var(--text-secondary)' />
                        <span className="detail-value text-black">
                            {teamMembersCount} {teamMembersCount === 1 ? t('member') : t('members')}
                        </span>
                    </div>
                </div>
                <div className="detail-item">
                    <span className="detail-label text-black">{t('current_revenue')}</span>
                    <div className="detail-content">
                        <LuDollarSign size={20} color='var(--text-secondary)' />
                        <span className="detail-value text-black">{formattedRevenue}</span>
                    </div>
                </div>
                <div className="detail-item">
                    <span className="detail-label text-black">{t('current_trl')}</span>
                    <div className="detail-content">
                        <span className="detail-value text-black">{formattedTrl}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyInfo;
