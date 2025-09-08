import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { RiUserLine, RiSettingsLine, RiLogoutBoxRLine, RiLockPasswordLine, RiShieldCheckLine, RiMailLine, RiUserAddLine } from 'react-icons/ri'
import { useTranslation } from 'react-i18next'

import Button from '@/components/common/Button/Button'
import AuthRequired from '@/components/common/AuthRequired/AuthRequired'
import Spinner from '@/components/common/Spinner/Spinner'
import useAuthStore, { type UserDetails } from '@/stores/AuthStore'
import routes from '@/routes/routes'
import './Profile.css'

const Profile = () => {
    const navigate = useNavigate()
    const { isLogged, isLoading, logOut, getUserDetails } = useAuthStore()
    const { t } = useTranslation('common')
    
    const [activeTab, setActiveTab] = useState('profile')
    const [userDetails, setUserDetails] = useState<UserDetails | undefined>(undefined)
    const [profileLoading, setProfileLoading] = useState(true)
    
    useEffect(() => {
        if (isLogged) {
            // Simulate loading state for better UX
            setProfileLoading(true)
            setTimeout(() => {
                const userData = getUserDetails()
                setUserDetails(userData)
                setProfileLoading(false)
            }, 500)
        }
    }, [isLogged, getUserDetails])
    
    const handleLogout = async () => {
        await logOut()
        navigate('/')
    }
    
    const handleChangePassword = () => {
        navigate(routes.changePassword)
    }
    
    const handleSetup2FA = () => {
        // TODO: Implement 2FA setup functionality
        toast.error("Aún no está disponible")
    }
    
    // If not authenticated, show prompt to login
    if (!isLogged) {
        return <AuthRequired/>
    }
    
    // Show loading state
    if (isLoading || profileLoading) {
        return (
            <div className="profile-page-container">
                <div className="profile-page-loading">
                    <Spinner/>
                    <p>{t('loading')}</p>
                </div>
            </div>
        )
    }
    
    // Handle case when user details are undefined
    if (!userDetails) {
        return (
            <div className="profile-page-container">
                <div className="profile-page-error">
                    <p>{t('profile.error', 'Failed to load profile data')}</p>
                    <Button onClick={() => window.location.reload()}>
                        {t('common.retry', 'Retry')}
                    </Button>
                </div>
            </div>
        )
    }
    
    return (
        <div className="profile-page-container">
            {/* Profile Header */}
            <div className="profile-page-header">
                <div className="profile-page-avatar">
                    <span>{userDetails.username?.charAt(0).toUpperCase() || userDetails.email?.charAt(0).toUpperCase() || 'U'}</span>
                </div>
                <div className="profile-page-info">
                    <h1 className="profile-page-title">{userDetails.username || userDetails.email}</h1>
                    <div className="profile-page-details">
                        <div className="profile-detail-item">
                            <RiMailLine className="profile-detail-icon" />
                            <span>{userDetails.email}</span>
                        </div>
                        {userDetails.first_name && userDetails.last_name && (
                            <div className="profile-detail-item">
                                <RiUserAddLine className="profile-detail-icon" />
                                <span>{userDetails.first_name} {userDetails.last_name}</span>
                            </div>
                        )}
                    </div>
                </div>
                {/* Logout Button */}
                <div className="profile-page-actions">
                    {isLoading ? (
                        <Spinner/>
                    ) : (
                        <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={handleLogout}
                            className="profile-logout-button"
                        >
                            <RiLogoutBoxRLine />
                            {t('logout')}
                        </Button>
                    )}
                </div>
            </div>
            
            {/* Navigation Tabs */}
            <div className="profile-page-navigation">
                <div 
                    className={`profile-nav-item ${activeTab === 'profile' ? 'profile-nav-active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <RiUserLine />
                    <span>{t('profile')}</span>
                </div>
                <div 
                    className={`profile-nav-item ${activeTab === 'settings' ? 'profile-nav-active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    <RiSettingsLine />
                    <span>{t('configuration')}</span>
                </div>
            </div>
            
            {/* Content */}
            <div className="profile-page-content">
                {activeTab === 'profile' && (
                    <div className="profile-content-section">
                        <div className="profile-info-card">
                            <h2 className="profile-section-title">{t('personal_information')}</h2>
                            <div className="profile-info-grid">
                                <div className="profile-info-item">
                                    <label className="profile-info-label">{t('username_label')}</label>
                                    <div className="profile-info-value">{userDetails.username || '-'}</div>
                                </div>
                                <div className="profile-info-item">
                                    <label className="profile-info-label">{t('email_label')}</label>
                                    <div className="profile-info-value">{userDetails.email}</div>
                                </div>
                                <div className="profile-info-item">
                                    <label className="profile-info-label">{t('first_name_label')}</label>
                                    <div className="profile-info-value">{userDetails.first_name || '-'}</div>
                                </div>
                                <div className="profile-info-item">
                                    <label className="profile-info-label">{t('last_name_label')}</label>
                                    <div className="profile-info-value">{userDetails.last_name || '-'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'settings' && (
                    <div className="profile-content-section">
                        <div className="profile-settings-card">
                            <h2 className="profile-section-title">{t('account_settings')}</h2>
                            
                            {/* Security Actions */}
                            <div className="profile-security-section">
                                <h3 className="profile-subsection-title">{t('security')}</h3>
                                <div className="profile-security-actions">
                                    <div className="profile-security-item">
                                        <div className="profile-security-info">
                                            <div className="profile-security-icon">
                                                <RiLockPasswordLine />
                                            </div>
                                            <div className="profile-security-details">
                                                <h4>{t('profile_change_password')}</h4>
                                                <p>{t('profile_change_password_description')}</p>
                                            </div>
                                        </div>
                                        <Button 
                                            variant="secondary" 
                                            size="sm"
                                            onClick={handleChangePassword}
                                        >
                                            {t('change')}
                                        </Button>
                                    </div>
                                    
                                    <div className="profile-security-item">
                                        <div className="profile-security-info">
                                            <div className="profile-security-icon">
                                                <RiShieldCheckLine />
                                            </div>
                                            <div className="profile-security-details">
                                                <h4>{t('profile_two_factor_authentication')}</h4>
                                                <p>{t('profile_two_factor_authentication_description')}</p>
                                            </div>
                                        </div>
                                        <Button 
                                            variant="primary" 
                                            size="sm"
                                            onClick={handleSetup2FA}
                                        >
                                            {t('setup')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Profile Information Form */}
                            {/* <div className="profile-form-section">
                                <h3 className="profile-subsection-title">{t('profile.profileInfo', 'Profile Information')}</h3>
                                <div className="profile-form">
                                    <div className="profile-form-group">
                                        <label className="profile-form-label">{t('profile.username', 'Username')}</label>
                                        <input 
                                            type="text" 
                                            className="profile-form-input" 
                                            defaultValue={userDetails.username || ''}
                                            placeholder={t('profile.enterUsername', 'Enter username')}
                                        />
                                    </div>
                                    
                                    <div className="profile-form-group">
                                        <label className="profile-form-label">{t('profile.firstName', 'First Name')}</label>
                                        <input 
                                            type="text" 
                                            className="profile-form-input" 
                                            defaultValue={userDetails.first_name || ''}
                                            placeholder={t('profile.enterFirstName', 'Enter first name')}
                                        />
                                    </div>
                                    
                                    <div className="profile-form-group">
                                        <label className="profile-form-label">{t('profile.lastName', 'Last Name')}</label>
                                        <input 
                                            type="text" 
                                            className="profile-form-input" 
                                            defaultValue={userDetails.last_name || ''}
                                            placeholder={t('profile.enterLastName', 'Enter last name')}
                                        />
                                    </div>
                                    
                                    <div className="profile-form-actions">
                                        <Button 
                                            variant="primary" 
                                            size="md"
                                        >
                                            {t('profile.saveChanges', 'Save Changes')}
                                        </Button>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile
