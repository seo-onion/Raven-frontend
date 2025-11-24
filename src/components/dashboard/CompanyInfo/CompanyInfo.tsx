import React from 'react';
import './CompanyInfo.css';

const CompanyInfo: React.FC = () => {
    return (
        <div className="company-info">
            <div className="company-logo">
                <div className="logo-placeholder">🚀</div>
            </div>

            <h3 className="company-name text-black">Mi Startup</h3>

            <div className="company-stats">
                <div className="stat-item">
                    <span className="stat-label text-black">Nivel TRL</span>
                    <span className="stat-value text-black">4</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label text-black">Nivel CRL</span>
                    <span className="stat-value text-black">3</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label text-black">Sector</span>
                    <span className="stat-value text-black">Tecnología</span>
                </div>
            </div>

            <div className="company-details">
                <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <div className="detail-content">
                        <span className="detail-label text-black">Fundación</span>
                        <span className="detail-value text-black">Enero 2024</span>
                    </div>
                </div>
                <div className="detail-item">
                    <span className="detail-icon">👥</span>
                    <div className="detail-content">
                        <span className="detail-label text-black">Equipo</span>
                        <span className="detail-value text-black">5 miembros</span>
                    </div>
                </div>
                <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <div className="detail-content">
                        <span className="detail-label text-black">Ubicación</span>
                        <span className="detail-value text-black">Lima, Perú</span>
                    </div>
                </div>
            </div>

            <button className="edit-company-btn">
                Editar información
            </button>
        </div>
    );
};

export default CompanyInfo;
