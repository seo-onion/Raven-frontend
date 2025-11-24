import React, { useState } from 'react';
import './EvidenceUpload.css';

interface Evidence {
    id: number;
    name: string;
    type: string;
    uploadDate: string;
    size: string;
}

const EvidenceUpload: React.FC = () => {
    const [evidences, setEvidences] = useState<Evidence[]>([
        {
            id: 1,
            name: 'Reporte_Laboratorio_Q1.pdf',
            type: 'PDF',
            uploadDate: '15 Nov 2024',
            size: '2.3 MB',
        },
        {
            id: 2,
            name: 'Prototipo_Funcional_v2.mp4',
            type: 'Video',
            uploadDate: '18 Nov 2024',
            size: '15.8 MB',
        },
    ]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newEvidences = Array.from(files).map((file, index) => ({
                id: evidences.length + index + 1,
                name: file.name,
                type: file.type.split('/')[1].toUpperCase(),
                uploadDate: new Date().toLocaleDateString('es-ES'),
                size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            }));
            setEvidences([...evidences, ...newEvidences]);
        }
    };

    const handleDelete = (id: number) => {
        setEvidences(evidences.filter(e => e.id !== id));
    };

    return (
        <div className="evidence-upload">
            <div className="upload-area">
                <input
                    type="file"
                    id="file-upload"
                    className="file-input"
                    multiple
                    onChange={handleFileSelect}
                />
                <label htmlFor="file-upload" className="upload-label">
                    <div className="upload-icon">📁</div>
                    <p className="upload-text text-black">
                        Arrastra archivos aquí o <span className="upload-link">examina</span>
                    </p>
                    <p className="upload-hint text-black">
                        PDF, DOC, JPG, PNG o MP4 (max. 50MB)
                    </p>
                </label>
            </div>

            {evidences.length > 0 && (
                <div className="evidences-list">
                    <h3 className="evidences-title text-black">Archivos Subidos</h3>
                    {evidences.map(evidence => (
                        <div key={evidence.id} className="evidence-item">
                            <div className="evidence-icon">📄</div>
                            <div className="evidence-info">
                                <p className="evidence-name text-black">{evidence.name}</p>
                                <p className="evidence-meta text-black">
                                    {evidence.type} • {evidence.size} • {evidence.uploadDate}
                                </p>
                            </div>
                            <button
                                className="evidence-delete"
                                onClick={() => handleDelete(evidence.id)}
                                aria-label="Eliminar archivo"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EvidenceUpload;
