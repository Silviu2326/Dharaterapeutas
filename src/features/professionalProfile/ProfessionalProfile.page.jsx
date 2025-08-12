import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Loader } from '../../components/Loader';
import { ErrorBoundary } from '../../components/ErrorBoundary';

// Importar componentes del perfil
import { AvatarUpload } from './components/AvatarUpload';
import { BannerUpload } from './components/BannerUpload';
import { AboutEditor } from './components/AboutEditor';
import { TherapiesSelect } from './components/TherapiesSelect';
import { CredentialsTable } from './components/CredentialsTable';
import { RatesForm } from './components/RatesForm';
import { AvailabilitySwitch } from './components/AvailabilitySwitch';
import { LegalInfo } from './components/LegalInfo';
import { PublicPreviewModal } from './components/PublicPreviewModal';
import { PersonalStats } from './components/PersonalStats';
import { HeaderActions, SaveStatus } from './components/HeaderActions';

export const ProfessionalProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState(null);

  // Estado del perfil
  const [profileData, setProfileData] = useState({
    avatar: null,
    banner: null,
    name: 'Dr. María González',
    about: '',
    therapies: [],
    credentials: [],
    rates: {
            sessionPrice: '',
            followUpPrice: '',
            packagePrice: '',
            coupleSessionPrice: '',
            currency: 'EUR'
      },
    isAvailable: true,
    legalInfo: {
      licenses: [],
      professionalRegistration: '',
      ethicsCode: '',
      insuranceCoverage: '',
      dataProtectionCompliance: false
    }
  });

  // Estado original para comparar cambios
  const [originalData, setOriginalData] = useState(null);

  // Datos de métricas (simulados)
  const [stats] = useState({
    totalSessions: 1247,
    activeClients: 23,
    averageRating: 4.8,
    totalClients: 156,
    responseTime: 1.5, // horas
    completionRate: 96,
    monthlySessions: 89,
    newClients: 7,
    monthlyRevenue: 3420,
    satisfactionRate: 94
  });

  // Cargar datos del perfil
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        // Simular carga de datos
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Datos de ejemplo
        const mockData = {
          avatar: null,
          banner: null,
          name: 'Dr. María González',
          about: 'Psicóloga clínica especializada en **terapia cognitivo-conductual** y **EMDR**. Con más de 8 años de experiencia ayudando a personas a superar traumas, ansiedad y depresión.\n\nMi enfoque se centra en crear un espacio seguro donde puedas explorar tus emociones y desarrollar herramientas prácticas para el bienestar mental.',
          therapies: ['Terapia Cognitivo-Conductual (CBT)', 'EMDR', 'Mindfulness', 'Terapia de Pareja'],
          credentials: [
            {
              id: 1,
              title: 'Licenciatura en Psicología',
              institution: 'Universidad Complutense de Madrid',
              year: '2015',
              description: 'Especialización en Psicología Clínica'
            },
            {
              id: 2,
              title: 'Máster en Terapia EMDR',
              institution: 'Instituto Español de EMDR',
              year: '2018',
              description: 'Certificación oficial en Eye Movement Desensitization and Reprocessing'
            }
          ],
          rates: {
            sessionPrice: '80',
            followUpPrice: '60',
            packagePrice: '300',
            coupleSessionPrice: '120',
            currency: 'EUR'
          },
          isAvailable: true,
          legalInfo: {
            licenses: [
              {
                id: 1,
                type: 'Colegio Oficial de Psicólogos',
                number: 'M-12345',
                issuingBody: 'COP Madrid',
                expiryDate: '',
                status: 'active'
              },
              {
                id: 2,
                type: 'Licencia Sanitaria',
                number: 'CS-2023-001',
                issuingBody: 'Consejería de Sanidad - CAM',
                expiryDate: '2025-12-31',
                status: 'active'
              }
            ],
            professionalRegistration: 'Colegiada nº M-12345 en el Colegio Oficial de Psicólogos de Madrid desde 2015',
            ethicsCode: 'Código Deontológico del Colegio Oficial de Psicólogos',
            insuranceCoverage: 'Mapfre - Póliza RC Profesional nº 123456789',
            dataProtectionCompliance: true
          }
        };
        
        setProfileData(mockData);
        setOriginalData(JSON.parse(JSON.stringify(mockData)));
        setLastSaved(new Date().toISOString());
      } catch (err) {
        setError('Error al cargar el perfil');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  // Detectar cambios
  useEffect(() => {
    if (originalData) {
      const hasChangesNow = JSON.stringify(profileData) !== JSON.stringify(originalData);
      setHasChanges(hasChangesNow);
    }
  }, [profileData, originalData]);

  // Handlers
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!hasChanges) return;
    
    setIsSaving(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setOriginalData(JSON.parse(JSON.stringify(profileData)));
      setLastSaved(new Date().toISOString());
      setIsEditing(false);
      setHasChanges(false);
    } catch (err) {
      setError('Error al guardar los cambios');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmCancel = window.confirm('¿Estás seguro de que quieres cancelar? Se perderán los cambios no guardados.');
      if (!confirmCancel) return;
    }
    
    setProfileData(JSON.parse(JSON.stringify(originalData)));
    setIsEditing(false);
    setHasChanges(false);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  // Handlers para actualizar datos
  const updateProfileField = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-sage text-white px-4 py-2 rounded-lg hover:bg-sage/90"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-deep">Perfil Profesional</h1>
            <p className="text-gray-600 mt-1">Gestiona tu información profesional y configuración</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <SaveStatus 
              isSaving={isSaving} 
              lastSaved={lastSaved} 
              hasUnsavedChanges={hasChanges} 
            />
            <HeaderActions
              isEditing={isEditing}
              isSaving={isSaving}
              hasChanges={hasChanges}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onPreview={handlePreview}
            />
          </div>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Avatar y Banner */}
            <Card>
              <div className="space-y-6">
                <BannerUpload
                  currentBanner={profileData.banner}
                  onBannerChange={(file, url) => updateProfileField('banner', url)}
                  isEditing={isEditing}
                />
                <div className="flex justify-center -mt-16 relative z-10">
                  <AvatarUpload
                    currentAvatar={profileData.avatar}
                    onAvatarChange={(file, url) => updateProfileField('avatar', url)}
                    isEditing={isEditing}
                  />
                </div>
              </div>
            </Card>

            {/* Sobre mí */}
            <Card>
              <AboutEditor
                value={profileData.about}
                onChange={(value) => updateProfileField('about', value)}
                isEditing={isEditing}
              />
            </Card>

            {/* Especialidades */}
            <Card>
              <TherapiesSelect
                selectedTherapies={profileData.therapies}
                onChange={(therapies) => updateProfileField('therapies', therapies)}
                isEditing={isEditing}
              />
            </Card>

            {/* Formación */}
            <Card>
              <CredentialsTable
                credentials={profileData.credentials}
                onChange={(credentials) => updateProfileField('credentials', credentials)}
                isEditing={isEditing}
              />
            </Card>

            {/* Información Legal */}
            <Card>
              <LegalInfo
                legalInfo={profileData.legalInfo}
                onChange={(legalInfo) => updateProfileField('legalInfo', legalInfo)}
                isEditing={isEditing}
              />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Métricas */}
            <Card>
              <PersonalStats stats={stats} />
            </Card>

            {/* Tarifas */}
            <Card>
              <RatesForm
                rates={profileData.rates}
                onChange={(rates) => updateProfileField('rates', rates)}
                isEditing={isEditing}
              />
            </Card>

            {/* Disponibilidad */}
            <Card>
              <AvailabilitySwitch
                isAvailable={profileData.isAvailable}
                onChange={(available) => updateProfileField('isAvailable', available)}
                isEditing={isEditing}
              />
            </Card>
          </div>
        </div>

        {/* Modal de vista previa */}
        <PublicPreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          profileData={profileData}
        />
      </div>
    </ErrorBoundary>
  );
};