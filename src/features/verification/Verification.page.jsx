import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Loader } from '../../components/Loader';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { StatusBanner } from './components/StatusBanner';
import { DiplomaUpload } from './components/DiplomaUpload';
import { InsuranceUpload } from './components/InsuranceUpload';
import { FilesTable } from './components/FilesTable';
import { ReviewerComment } from './components/ReviewerComment';
import { SubmitButton } from './components/SubmitButton';
import { AuditTimeline } from './components/AuditTimeline';

// Mock data for demonstration
const mockSubmittedFiles = [
  {
    id: 1,
    name: 'diploma_psicologia_2020.pdf',
    originalName: 'Diploma Psicología Clínica.pdf',
    type: 'diploma',
    mimeType: 'application/pdf',
    size: 2048576,
    uploadDate: '2024-01-15T10:30:00Z',
    status: 'received'
  },
  {
    id: 2,
    name: 'seguro_rc_2024.pdf',
    originalName: 'Seguro Responsabilidad Civil 2024.pdf',
    type: 'insurance',
    mimeType: 'application/pdf',
    size: 1536000,
    uploadDate: '2024-01-15T10:35:00Z',
    status: 'received'
  }
];

const mockAuditEvents = [
  {
    id: 1,
    type: 'submitted',
    date: '2024-01-15T10:30:00Z',
    title: 'Documentos enviados',
    description: 'Se enviaron 2 documentos para verificación',
    details: ['Diploma de Psicología Clínica', 'Seguro de Responsabilidad Civil'],
    reviewer: 'Sistema automático'
  },
  {
    id: 2,
    type: 'under_review',
    date: '2024-01-16T09:15:00Z',
    title: 'Revisión iniciada',
    description: 'El equipo de verificación ha comenzado la revisión',
    reviewer: 'Dr. María González'
  },
  {
    id: 3,
    type: 'approved',
    date: '2024-01-18T14:20:00Z',
    title: 'Verificación aprobada',
    description: 'Todos los documentos han sido verificados y aprobados',
    reviewer: 'Dr. María González'
  }
];

const mockRejectedComment = {
  comment: 'El diploma presentado no cumple con los requisitos mínimos. La imagen está borrosa y no se puede verificar la autenticidad del sello institucional. Además, falta información sobre el número de registro profesional.',
  reviewDate: '2024-01-18T14:20:00Z',
  reviewerName: 'Dr. María González',
  suggestions: [
    'Escanea el diploma en alta resolución (mínimo 300 DPI)',
    'Asegúrate de que el sello institucional sea claramente visible',
    'Incluye el certificado de registro profesional si está disponible',
    'Verifica que toda la información sea legible antes de subir'
  ]
};

export const Verification = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Verification state
  const [verificationStatus, setVerificationStatus] = useState('pending'); // 'not_submitted', 'pending', 'approved', 'rejected'
  const [diplomaFiles, setDiplomaFiles] = useState([]);
  const [insuranceFile, setInsuranceFile] = useState(null);
  const [submittedFiles, setSubmittedFiles] = useState(mockSubmittedFiles);
  const [auditEvents, setAuditEvents] = useState(mockAuditEvents);
  const [reviewerComment, setReviewerComment] = useState(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // Uncomment to test rejected state
      // setVerificationStatus('rejected');
      // setReviewerComment(mockRejectedComment);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmitVerification = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update status and add to audit trail
      setVerificationStatus('pending');
      const newEvent = {
        id: Date.now(),
        type: verificationStatus === 'rejected' ? 'resubmitted' : 'submitted',
        date: new Date().toISOString(),
        title: verificationStatus === 'rejected' ? 'Documentos reenviados' : 'Documentos enviados',
        description: `Se enviaron ${diplomaFiles.length + (insuranceFile ? 1 : 0)} documentos para verificación`,
        details: [
          ...diplomaFiles.map(f => f.name),
          ...(insuranceFile ? [insuranceFile.name] : [])
        ],
        reviewer: 'Sistema automático'
      };
      setAuditEvents(prev => [newEvent, ...prev]);
      
      // Clear uploaded files and move to submitted
      setSubmittedFiles(prev => [
        ...diplomaFiles.map(f => ({
          ...f,
          uploadDate: new Date().toISOString(),
          status: 'pending',
          type: 'diploma'
        })),
        ...(insuranceFile ? [{
          ...insuranceFile,
          uploadDate: new Date().toISOString(),
          status: 'pending',
          type: 'insurance'
        }] : []),
        ...prev
      ]);
      
      setDiplomaFiles([]);
      setInsuranceFile(null);
      setReviewerComment(null);
      
    } catch (err) {
      setError('Error al enviar la verificación. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadFile = (file) => {
    // Simulate file download
    console.log('Downloading file:', file.name);
    // In a real app, this would trigger a file download
  };

  const canSubmit = diplomaFiles.length > 0 && insuranceFile !== null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Recargar página
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-deep">Verificación Profesional</h1>
            <p className="text-gray-600 mt-1">Gestiona tu proceso de verificación de credenciales</p>
          </div>
        </div>

        {/* Status Banner */}
        <StatusBanner status={verificationStatus} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload Forms */}
          <div className="space-y-6">
            {/* Diploma Upload */}
            <Card>
              <h2 className="text-xl font-semibold text-deep mb-4">Diplomas y Títulos</h2>
              <DiplomaUpload
                files={diplomaFiles}
                onFilesChange={setDiplomaFiles}
                disabled={verificationStatus === 'pending' || verificationStatus === 'approved'}
              />
            </Card>

            {/* Insurance Upload */}
            <Card>
              <h2 className="text-xl font-semibold text-deep mb-4">Seguro de Responsabilidad Civil</h2>
              <InsuranceUpload
                file={insuranceFile}
                onFileChange={setInsuranceFile}
                disabled={verificationStatus === 'pending' || verificationStatus === 'approved'}
              />
            </Card>

            {/* Submit Button */}
            <Card>
              <SubmitButton
                status={verificationStatus}
                isSubmitting={isSubmitting}
                canSubmit={canSubmit}
                onSubmit={handleSubmitVerification}
                diplomaCount={diplomaFiles.length}
                hasInsurance={insuranceFile !== null}
              />
            </Card>
          </div>

          {/* Right Column - Status and History */}
          <div className="space-y-6">
            {/* Reviewer Comments (only show if rejected) */}
            {verificationStatus === 'rejected' && reviewerComment && (
              <ReviewerComment
                comment={reviewerComment.comment}
                reviewDate={reviewerComment.reviewDate}
                reviewerName={reviewerComment.reviewerName}
                suggestions={reviewerComment.suggestions}
              />
            )}

            {/* Files Table */}
            <Card>
              <h2 className="text-xl font-semibold text-deep mb-4">Archivos Enviados</h2>
              <FilesTable
                files={submittedFiles}
                onDownload={handleDownloadFile}
              />
            </Card>

            {/* Audit Timeline */}
            <Card>
              <AuditTimeline events={auditEvents} />
            </Card>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};