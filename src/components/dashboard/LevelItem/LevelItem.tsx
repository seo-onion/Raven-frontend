import React, { useState } from 'react'; // Import useState
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaCircle } from 'react-icons/fa';
import Input from '@/components/forms/Input/Input'; // Import Input component
import Button from '@/components/common/Button/Button'; // Import Button component
import toast from 'react-hot-toast';
import './LevelItem.css';

export type LevelStatus = 'completed' | 'in-progress' | 'pending';

interface LevelItemProps {

    type: 'TRL' | 'CRL'; // New prop

    level: number;

    title: string;

    description: string;

    status: LevelStatus;

    lastUpdate?: string;

    updatedBy?: string;

    isOpen?: boolean;

    onToggle?: () => void;

    currentHighestCompletedLevel: number; // New prop: The highest level that has been approved

    evidenceId?: number; // New prop for removing

    evidenceFileUrl?: string; // New prop

    evidenceDescription?: string; // New prop

    onAddEvidence: (level: number, type: 'TRL' | 'CRL', description: string, fileUrl: string, evidenceId?: number) => void; // Modified prop to include evidenceId for updates

    onRemoveEvidence: (evidenceId: number) => void; // New prop

}



export const LevelItem = ({

    type,

    level,

    title,

    description,

    status,

    lastUpdate,

    updatedBy,

    isOpen = false,

    onToggle,

    currentHighestCompletedLevel,

    evidenceId,

    evidenceFileUrl,

    evidenceDescription,

    onAddEvidence,

    onRemoveEvidence,

}: LevelItemProps) => {

        const { t } = useTranslation('common');

                const [notes, setNotes] = useState<string>(evidenceDescription || '');

                const [fileUrl, setFileUrl] = useState<string>(evidenceFileUrl || '');

        

                const trimmedNotes = notes.trim();

                const trimmedFileUrl = fileUrl.trim();

    

        // Reset form state when level or evidence changes

        React.useEffect(() => {

            setNotes(evidenceDescription || '');

            setFileUrl(evidenceFileUrl || '');

        }, [evidenceDescription, evidenceFileUrl, level]);





    const getStatusBadge = () => {

        if (status === 'completed' && !evidenceFileUrl) {

            return (

                <span className="levelitem-badge levelitem-badge-completed-no-evidence">

                    {t('completed_no_evidence')}

                </span>

            );

        }

        switch (status) {

            case 'completed':

                return (

                    <span className="levelitem-badge levelitem-badge-completed">

                        {t('completed')}

                    </span>

                );

            case 'in-progress':

                return (

                    <span className="levelitem-badge levelitem-badge-progress">

                        {t('in_progress')}

                    </span>

                );

            case 'pending':

                return (

                    <span className="levelitem-badge levelitem-badge-pending">

                        {t('pending')}

                    </span>

                );

            default:

                return null;

        }

    };



    const getIcon = () => {

        const iconClass = `levelitem-icon levelitem-icon-${status}`;

        if (status === 'completed') {

            return <FaCheckCircle className={iconClass} />;

        }

        if (status === 'in-progress') {

            return <FaCircle className={iconClass} />;

        }

        return <FaCircle className={iconClass} />;

    };



    // A level is editable if it's 'in-progress' OR it's a 'completed' level (green or grey)

    // OR it's a 'pending' level up to the highest completed level.

    const isEditable = (status === 'in-progress') ||

        (status === 'completed') || // Any completed level is editable to add/update evidence

        (status === 'pending' && level <= currentHighestCompletedLevel + 1); // Allow editing pending up to next one



                const handleAddEvidence = () => {



                    const trimmedNotes = notes.trim();



                    const trimmedFileUrl = fileUrl.trim();



        



                    console.log('LevelItem: notes:', notes);



                    console.log('LevelItem: trimmedNotes:', trimmedNotes);



                    console.log('LevelItem: fileUrl:', fileUrl);



                    console.log('LevelItem: trimmedFileUrl:', trimmedFileUrl);



        



                    if (!trimmedNotes || !trimmedFileUrl) {



                        toast.error(t('please_fill_all_fields'));



                        return;



                    }



        



                    onAddEvidence(level, type, trimmedNotes, trimmedFileUrl, evidenceId); // Pass evidenceId for update



                };



    const handleRemoveEvidence = () => {

        if (evidenceId && window.confirm(t('confirm_remove_evidence'))) {

            onRemoveEvidence(evidenceId);

        }

    };



    return (

        <div className={`levelitem-container levelitem-${status}`}>

            <div

                className="levelitem-header"

                onClick={onToggle}

                style={{ cursor: onToggle ? 'pointer' : 'default' }}

            >

                <div className="levelitem-title-group">

                    {getIcon()}

                    <div className="levelitem-text-content">

                        <h3 className="levelitem-title">

                            {type} {level}: {title}

                        </h3>

                        <p className="levelitem-description">

                            {description}

                        </p>

                        {lastUpdate && updatedBy && (

                            <span className="levelitem-last-update">

                                {t('last_update')}: {lastUpdate} {t('by')} {updatedBy}

                            </span>

                        )}

                    </div>

                </div>

                {getStatusBadge()}

            </div>



            {isOpen && (

                <>

                    <div className="levelitem-divider"></div>

                    <div className="levelitem-evidence">

                        <h4 className="levelitem-evidence-title">

                            {t('evidence_documentation')}

                        </h4>



                        {(status === 'completed' && !isEditable) && ( // If completed with approved evidence and not editable

                            <div className="levelitem-completed-evidence">

                                <p><strong>{t('notes')}:</strong> {evidenceDescription}</p>

                                {evidenceFileUrl && (

                                    <p><strong>{t('evidence_link')}:</strong> <a href={evidenceFileUrl} target="_blank" rel="noopener noreferrer">{evidenceFileUrl}</a></p>

                                )}

                                <button

                                    className="levelitem-btn-remove"

                                    onClick={handleRemoveEvidence}

                                >

                                    {t('remove_evidence')}

                                </button>

                            </div>

                        )}



                        {isEditable && (

                            <div className="levelitem-submission-form">

                                <div className="wizard-form-group">

                                    <label className="text-black wizard-label">

                                        {t('add_progress_notes')} *

                                    </label>

                                    <textarea

                                        className="basic-input-field multiline-textarea" // Added basic-input-field class

                                        rows={3}

                                        value={notes}

                                        onChange={(e) => setNotes(e.target.value)}

                                        placeholder={t('progress_notes_placeholder')}

                                    />

                                </div>

                                                                <div className="wizard-form-group">

                                                                    <Input

                                                                        name="evidence_link"

                                                                        label={t('evidence_link')}

                                                                        value={fileUrl}

                                                                        setValue={setFileUrl}

                                                                        placeholder="https://example.com/evidence"

                                                                        required

                                                                        classNames="basic-input-field" // Added basic-input-field class

                                                                    />

                                                                </div>

                                                                                                                                <Button

                                                                                                                                    variant="primary" // Default button variant

                                                                                                                                    onClick={handleAddEvidence}

                                                                                                                                    disabled={!trimmedNotes || !trimmedFileUrl}

                                                                                                                                >

                                                                    {evidenceId ? t('save_changes') : t('add_evidence')}

                                                                </Button>

                                {evidenceId && ( // Show remove button if evidence exists

                                    <Button

                                        variant="danger"

                                        onClick={handleRemoveEvidence}

                                    >

                                        {t('remove_evidence')}

                                    </Button>

                                )}

                            </div>

                        )}



                        {status === 'pending' && !isEditable && (

                            <p className="levelitem-pending-message">{t('complete_previous_levels')}</p>

                        )}

                    </div>

                </>

            )}

        </div>

    );

};



