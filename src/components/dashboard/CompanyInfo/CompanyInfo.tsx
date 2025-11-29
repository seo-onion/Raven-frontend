import React from 'react';
import './CompanyInfo.css';
import { CiCalendar } from "react-icons/ci";
import { LuUsers } from "react-icons/lu";
import { LuDollarSign } from "react-icons/lu";

const CompanyInfo: React.FC = () => {
    return (
        <div className="company-info">


            <h3 className="company-name text-black">Mi Startup</h3>


            <div className="company-details">

                <div className="detail-item">
                    <span className="detail-label text-black">Sector</span>
                    <div className="detail-content">

                        <span className="detail-value text-black">Fintech</span>
                    </div>
                </div>

                <div className="detail-item">
                    <span className="detail-label text-black">Fundada</span>

                    <div className="detail-content">
                        <CiCalendar size={20} color='var(--text-secondary)' />
                        <span className="detail-value text-black">Enero 2024</span>
                    </div>
                </div>
                <div className="detail-item">
                    <span className="detail-label text-black">Fundadores</span>

                    <div className="detail-content">
                        <LuUsers size={20} color='var(--text-secondary)' />
                        <span className="detail-value text-black">2 miembros</span>
                    </div>
                </div>
                <div className="detail-item">
                    <span className="detail-label text-black">Revenue Actual</span>

                    <div className="detail-content">
                        <LuDollarSign size={20} color='var(--text-secondary)' />
                        <span className="detail-value text-black">$45,000</span>
                    </div>
                </div>

                <div className="detail-item">
                    <span className="detail-label text-black">TRL Actual</span>

                    <div className="detail-content">
                        <span className="detail-value text-black">5/9</span>
                    </div>
                </div>


            </div>

        </div>
    );
};

export default CompanyInfo;
