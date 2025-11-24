import React from 'react'
import Button from '@/components/common/Button/Button';
import './TypeSelectionCard.css';
import { GrDeploy } from 'react-icons/gr';
import { MdFactory } from "react-icons/md";
interface TypeSelectionCardProps {
    icon: string
    title: string
    description: string
    buttonText: string
    onClick: () => void
    variant: 'startup' | 'incubator'
}

const TypeSelectionCard = ({
    icon,
    title,
    description,
    buttonText,
    onClick,
    variant
}: TypeSelectionCardProps) => {

    return (
        <div className="typeselectioncard-container" onClick={onClick}>
            <div className={`typeselectioncard-icon typeselectioncard-icon-${variant}`}>
                {/* El componente completo solo se renderiza si ambas variables son true */}
                {variant ===  'startup' && (
                    <GrDeploy size={40} color='white' />
                )}
                {variant ===  'incubator' && (
                    <MdFactory size={40} color='white' />
                )}
            </div>
            <h2>{title}</h2>
            <p className="typeselectioncard-description">{description}</p>
            <Button
                variant={variant === 'startup' ? 'secondary' : 'primary'}
                size="lg"
                onClick={(e) => {
                    e.stopPropagation()
                    onClick()
                }}
                className="typeselectioncard-button"
            >
                {buttonText}
            </Button>
        </div>
    )
}

export default TypeSelectionCard
