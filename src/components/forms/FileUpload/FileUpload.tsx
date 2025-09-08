import React, { useState, useRef } from 'react'
import { RiUploadLine, RiFileTextLine, RiDeleteBinLine } from 'react-icons/ri'
import { useTranslation } from 'react-i18next'

import './FileUpload.css'

interface FileUploadProps {
    /** Unique identifier for the file input */
    name: string
    /** Current file value */
    file: File | null
    /** Callback function to update the file */
    setFile: (file: File | null) => void
    /** Label text displayed above the upload area */
    label?: string
    /** Accepted file types (e.g., '.pdf,.doc,.docx' or 'image/*') */
    accept?: string
    /** Maximum file size in MB */
    maxSizeMB?: number
    /** Whether the field is required */
    isRequired?: boolean
    /** Whether the input is disabled */
    isDisabled?: boolean
    /** Error message to display */
    errorMessage?: string
    /** Description text to show below the label */
    description?: string
}

const FileUpload = ({
    name,
    file,
    setFile,
    label,
    accept,
    maxSizeMB = 10,
    isRequired = false,
    isDisabled = false,
    errorMessage,
    description
}: FileUploadProps) => {
    const { t } = useTranslation('common')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [dragActive, setDragActive] = useState(false)
    const [validationError, setValidationError] = useState('')

    const computedErrorMessage = errorMessage || validationError

    const validateFile = (selectedFile: File): boolean => {
        setValidationError('')

        // Check file size
        const fileSizeMB = selectedFile.size / (1024 * 1024)
        if (fileSizeMB > maxSizeMB) {
            setValidationError(`File size must be less than ${maxSizeMB}MB`)
            return false
        }

        // Check file type if accept is specified
        if (accept) {
            const acceptedTypes = accept.split(',').map(type => type.trim())
            const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase()
            const mimeType = selectedFile.type

            const isValidType = acceptedTypes.some(acceptedType => {
                if (acceptedType.startsWith('.')) {
                    return fileExtension === acceptedType.toLowerCase()
                } else if (acceptedType.includes('/*')) {
                    return mimeType.startsWith(acceptedType.split('/')[0])
                } else {
                    return mimeType === acceptedType
                }
            })

            if (!isValidType) {
                setValidationError(`File type not supported. Accepted types: ${accept}`)
                return false
            }
        }

        return true
    }

    const handleFileSelect = (selectedFile: File) => {
        if (validateFile(selectedFile)) {
            setFile(selectedFile)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            handleFileSelect(selectedFile)
        }
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (isDisabled) return

        const droppedFile = e.dataTransfer.files?.[0]
        if (droppedFile) {
            handleFileSelect(droppedFile)
        }
    }

    const handleRemoveFile = () => {
        setFile(null)
        setValidationError('')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleUploadClick = () => {
        if (!isDisabled) {
            fileInputRef.current?.click()
        }
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <div className={`fileupload_container ${isDisabled ? 'fileupload_disabled' : ''}`}>
            {label && (
                <label className="fileupload_label" htmlFor={name}>
                    {label}
                    {isRequired && <span className="fileupload_required">*</span>}
                </label>
            )}
            
            {description && (
                <p className="fileupload_description">{description}</p>
            )}

            <div
                className={`fileupload_dropzone ${dragActive ? 'fileupload_drag_active' : ''} ${file ? 'fileupload_has_file' : ''} ${computedErrorMessage ? 'fileupload_error' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleUploadClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    id={name}
                    name={name}
                    accept={accept}
                    onChange={handleFileChange}
                    disabled={isDisabled}
                    className="fileupload_input"
                    aria-describedby={computedErrorMessage ? `${name}-error` : undefined}
                />

                {!file ? (
                    <div className="fileupload_empty_state">
                        <div className="fileupload_icon">
                            <RiUploadLine />
                        </div>
                        <div className="fileupload_text">
                            <p className="fileupload_primary_text">
                                {t('clickToUpload')}
                            </p>
                            <p className="fileupload_secondary_text">
                                {t('dragAndDrop')}
                            </p>
                            {accept && (
                                <p className="fileupload_hint">
                                    {t('supportedFormats')}: {accept}
                                </p>
                            )}
                            <p className="fileupload_hint">
                                {t('maxSize')}: {maxSizeMB}MB
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="fileupload_file_info">
                        <div className="fileupload_file_icon">
                            <RiFileTextLine />
                        </div>
                        <div className="fileupload_file_details">
                            <p className="fileupload_file_name">{file.name}</p>
                            <p className="fileupload_file_size">{formatFileSize(file.size)}</p>
                        </div>
                        <button
                            type="button"
                            className="fileupload_remove_button"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveFile()
                            }}
                            aria-label={t('removeFile')}
                        >
                            <RiDeleteBinLine />
                        </button>
                    </div>
                )}
            </div>

            {computedErrorMessage && (
                <span id={`${name}-error`} className="fileupload_error_message">
                    {computedErrorMessage}
                </span>
            )}
        </div>
    )
}

export default FileUpload
