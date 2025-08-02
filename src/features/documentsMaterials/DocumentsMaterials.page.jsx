import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { DocsHeader } from './components/DocsHeader';
import { UploadZone } from './components/UploadZone';
import { UploadFormModal } from './components/UploadFormModal';
import { DocumentsTable } from './components/DocumentsTable';
import { BulkToolbar } from './components/BulkToolbar';
import { PreviewModal } from './components/PreviewModal';
import { ErrorBoundary, EmptyDocuments, ErrorState, Loader } from './components/StateComponents';

// Mock data para desarrollo
const mockDocuments = [
  {
    id: '1',
    title: 'Ejercicios de Respiración',
    filename: 'ejercicios-respiracion.pdf',
    type: 'pdf',
    size: 2048576,
    client: { id: '1', name: 'Ana García', avatar: null },
    session: 'Sesión #3',
    tags: ['ejercicios', 'ansiedad'],
    createdAt: new Date('2024-01-15'),
    url: '/documents/ejercicios-respiracion.pdf'
  },
  {
    id: '2',
    title: 'Técnicas de Relajación',
    filename: 'relajacion-muscular.mp3',
    type: 'audio',
    size: 5242880,
    client: { id: '2', name: 'Carlos López', avatar: null },
    session: 'Sesión #1',
    tags: ['relajación', 'audio'],
    createdAt: new Date('2024-01-14'),
    url: '/documents/relajacion-muscular.mp3'
  },
  {
    id: '3',
    title: 'Diagrama de Emociones',
    filename: 'diagrama-emociones.png',
    type: 'image',
    size: 1024000,
    client: null,
    session: null,
    tags: ['emociones', 'diagrama'],
    createdAt: new Date('2024-01-13'),
    url: '/documents/diagrama-emociones.png'
  }
];

const mockClients = [
  { id: '1', name: 'Ana García', email: 'ana@email.com', avatar: null },
  { id: '2', name: 'Carlos López', email: 'carlos@email.com', avatar: null },
  { id: '3', name: 'María Rodríguez', email: 'maria@email.com', avatar: null }
];

export const DocumentsMaterials = () => {
  const [documents, setDocuments] = useState(mockDocuments);
  const [filteredDocuments, setFilteredDocuments] = useState(mockDocuments);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtrar documentos
  useEffect(() => {
    let filtered = documents;

    // Filtrar por cliente
    if (selectedClient) {
      filtered = filtered.filter(doc => doc.client?.id === selectedClient.id);
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(term) ||
        doc.filename.toLowerCase().includes(term) ||
        doc.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Filtrar por tipos
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(doc => selectedTypes.includes(doc.type));
    }

    setFilteredDocuments(filtered);
  }, [documents, selectedClient, searchTerm, selectedTypes]);

  // Handlers
  const handleClientSelect = (client) => {
    setSelectedClient(client);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleTypeFilter = (types) => {
    setSelectedTypes(types);
  };

  const handleFilesSelected = (files) => {
    setIsUploadModalOpen(true);
  };

  const handleUpload = async (uploadData) => {
    setIsLoading(true);
    try {
      // Simular subida de archivos
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDocuments = uploadData.files.map((file, index) => ({
        id: Date.now() + index,
        title: uploadData.title || file.name,
        filename: file.name,
        type: file.type.split('/')[0],
        size: file.size,
        client: uploadData.client,
        session: uploadData.session,
        tags: uploadData.tags || [],
        createdAt: new Date(),
        url: URL.createObjectURL(file)
      }));
      
      setDocuments(prev => [...newDocuments, ...prev]);
      setIsUploadModalOpen(false);
    } catch (err) {
      setError('Error al subir los archivos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentSelect = (documentId, isSelected) => {
    setSelectedDocuments(prev => 
      isSelected 
        ? [...prev, documentId]
        : prev.filter(id => id !== documentId)
    );
  };

  const handleSelectAll = (isSelected) => {
    setSelectedDocuments(isSelected ? filteredDocuments.map(doc => doc.id) : []);
  };

  const handlePreview = (document) => {
    setPreviewDocument(document);
  };

  const handleDownload = (document) => {
    // Simular descarga
    const link = document.createElement('a');
    link.href = document.url;
    link.download = document.filename;
    link.click();
  };

  const handleResend = (document) => {
    // Simular reenvío
    alert(`Reenviando ${document.title} a ${document.client?.name}`);
  };

  const handleDelete = (document) => {
    if (confirm(`¿Estás seguro de que quieres eliminar "${document.title}"?`)) {
      setDocuments(prev => prev.filter(doc => doc.id !== document.id));
      setSelectedDocuments(prev => prev.filter(id => id !== document.id));
    }
  };

  const handleBulkDownload = () => {
    const selectedDocs = documents.filter(doc => selectedDocuments.includes(doc.id));
    alert(`Descargando ${selectedDocs.length} documentos como ZIP`);
  };

  const handleBulkDelete = () => {
    if (confirm(`¿Estás seguro de que quieres eliminar ${selectedDocuments.length} documentos?`)) {
      setDocuments(prev => prev.filter(doc => !selectedDocuments.includes(doc.id)));
      setSelectedDocuments([]);
    }
  };

  const handleClearFilters = () => {
    setSelectedClient(null);
    setSearchTerm('');
    setSelectedTypes([]);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-deep">Documentos y Materiales</h1>
        </div>
        <ErrorState 
          title="Error al cargar documentos"
          description={error}
          onRetry={() => {
            setError(null);
            setIsLoading(false);
          }}
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-deep">Documentos y Materiales</h1>
          <p className="text-gray-600">Gestiona recursos y documentos</p>
        </div>

        {/* Controles principales */}
        <DocsHeader
          clients={mockClients}
          selectedClient={selectedClient}
          onClientSelect={handleClientSelect}
          searchTerm={searchTerm}
          onSearch={handleSearch}
          selectedTypes={selectedTypes}
          onTypeFilter={handleTypeFilter}
          documents={documents}
        />

        {/* Zona de subida */}
        <Card>
          <UploadZone
            onFilesSelected={handleFilesSelected}
            maxFileSize={200 * 1024 * 1024} // 200MB
            acceptedTypes={['application/pdf', 'image/*', 'audio/*', 'video/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
          />
        </Card>

        {/* Toolbar de acciones masivas */}
        {selectedDocuments.length > 0 && (
          <BulkToolbar
            selectedCount={selectedDocuments.length}
            onDownload={handleBulkDownload}
            onDelete={handleBulkDelete}
            onClear={() => setSelectedDocuments([])}
          />
        )}

        {/* Tabla de documentos */}
        <Card>
          {isLoading ? (
            <Loader message="Cargando documentos..." />
          ) : filteredDocuments.length === 0 ? (
            documents.length === 0 ? (
              <EmptyDocuments onUpload={() => setIsUploadModalOpen(true)} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No se encontraron documentos con los filtros aplicados</p>
                <button
                  onClick={handleClearFilters}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Limpiar filtros
                </button>
              </div>
            )
          ) : (
            <DocumentsTable
              documents={filteredDocuments}
              selectedDocuments={selectedDocuments}
              onDocumentSelect={handleDocumentSelect}
              onSelectAll={handleSelectAll}
              onPreview={handlePreview}
              onDownload={handleDownload}
              onResend={handleResend}
              onDelete={handleDelete}
            />
          )}
        </Card>

        {/* Modales */}
        <UploadFormModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleUpload}
          clients={mockClients}
          isLoading={isLoading}
        />

        <PreviewModal
          isOpen={!!previewDocument}
          onClose={() => setPreviewDocument(null)}
          document={previewDocument}
          documents={filteredDocuments}
          onDownload={handleDownload}
          onResend={handleResend}
          onDelete={handleDelete}
        />
      </div>
    </ErrorBoundary>
  );
};