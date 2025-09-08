import Spinner from "../Spinner/Spinner";

import "./UserAvatar.css";

interface UserAvatarProps {
    firstName: string,
    lastName: string,
    imgUrl?: string,
    email: string,
    isLoading?: boolean
} 

const UserAvatar = ({ firstName, lastName, imgUrl, email, isLoading = false }: UserAvatarProps) => {
    return (
        <div className="user-avatar-main-cont">
            {isLoading ? (
                <Spinner size="sm" variant="secondary"/>
            ) : (
            <>
                <div className="user-avatar-img-cont">
                    {imgUrl ? (
                        <img src={imgUrl} className="user-avatar-img"/>
                    ) : (
                        <div className="user-avatar-icon">
                            <span>{firstName.charAt(0).toUpperCase()}{lastName.charAt(0).toUpperCase()}</span>
                        </div>
                    )}
                </div>
                <div className="user-avatar-info-box">
                    <div>{firstName} {lastName}</div>
                    <div>{email}</div>
                </div>
            </>
            )}
            
        </div>
    );
};

export default UserAvatar;
