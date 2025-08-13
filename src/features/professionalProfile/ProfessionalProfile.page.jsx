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
import { WorkLocationsManager } from './components/WorkLocationsManager';
import { VideoPresentation } from './components/VideoPresentation';
import { ExternalLinks } from './components/ExternalLinks';
import { FeaturedTestimonials } from './components/FeaturedTestimonials';
import { WorkExperience } from './components/WorkExperience';
import { PricingPackages } from './components/PricingPackages';

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
    workLocations: [],
    videoPresentation: null,
    externalLinks: [],
    featuredTestimonials: [],
    workExperience: [],
    pricingPackages: { packages: [], coupons: [] },
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
          workLocations: [
            {
              id: 1,
              name: 'Centro de Psicología Valencia',
              address: 'Calle Colón, 45, 3º B',
              city: 'Valencia',
              postalCode: '46004',
              phone: '+34 963 123 456',
              email: 'valencia@centropsicologia.com',
              isPrimary: true,
              schedule: {
                monday: { enabled: true, start: '09:00', end: '17:00' },
                tuesday: { enabled: true, start: '09:00', end: '17:00' },
                wednesday: { enabled: false, start: '09:00', end: '17:00' },
                thursday: { enabled: false, start: '09:00', end: '17:00' },
                friday: { enabled: false, start: '09:00', end: '17:00' },
                saturday: { enabled: false, start: '09:00', end: '14:00' },
                sunday: { enabled: false, start: '09:00', end: '14:00' }
              }
            },
            {
              id: 2,
              name: 'Clínica La Pobla',
              address: 'Avenida de la Constitución, 12',
              city: 'La Pobla de Vallbona',
              postalCode: '46185',
              phone: '+34 962 654 321',
              email: 'lapobla@clinicapsicologia.com',
              isPrimary: false,
              schedule: {
                monday: { enabled: false, start: '09:00', end: '17:00' },
                tuesday: { enabled: false, start: '09:00', end: '17:00' },
                wednesday: { enabled: true, start: '10:00', end: '18:00' },
                thursday: { enabled: true, start: '10:00', end: '18:00' },
                friday: { enabled: true, start: '10:00', end: '18:00' },
                saturday: { enabled: false, start: '09:00', end: '14:00' },
                sunday: { enabled: false, start: '09:00', end: '14:00' }
              }
            }
          ],
          videoPresentation: {
            url: null,
            title: 'Presentación Personal',
            description: 'Conoce un poco más sobre mi enfoque terapéutico'
          },
          externalLinks: [
            {
              id: 1,
              type: 'website',
              label: 'Mi Sitio Web',
              url: 'https://www.ejemplo-psicologo.com',
              isVisible: true
            },
            {
              id: 2,
              type: 'linkedin',
              label: 'LinkedIn Profesional',
              url: 'https://linkedin.com/in/ejemplo-psicologo',
              isVisible: true
            }
          ],
          featuredTestimonials: [1, 3, 5],
          workExperience: [
            {
              id: 1,
              position: 'Psicólogo Clínico Senior',
              company: 'Centro de Salud Mental Integral',
              location: 'Madrid, España',
              startDate: '2020-03-01',
              endDate: null,
              isCurrent: true,
              description: 'Especialización en terapia cognitivo-conductual para trastornos de ansiedad y depresión. Coordinación de equipo multidisciplinar.',
              achievements: [
                'Implementación de nuevos protocolos de evaluación',
                'Reducción del 30% en tiempo de tratamiento promedio',
                'Formación de 15 psicólogos junior'
              ]
            },
            {
              id: 2,
              position: 'Psicólogo Clínico',
              company: 'Clínica Privada Bienestar',
              location: 'Barcelona, España',
              startDate: '2017-09-01',
              endDate: '2020-02-28',
              isCurrent: false,
              description: 'Atención individual y grupal en terapia de pareja y familiar. Especialización en trastornos del estado de ánimo.',
              achievements: [
                'Desarrollo de programa de terapia grupal',
                'Satisfacción del cliente superior al 95%',
                'Publicación de 3 artículos en revistas especializadas'
              ]
            }
          ],
          pricingPackages: {
            packages: [
              {
                id: 1,
                name: 'Bono 5 Sesiones',
                description: 'Paquete ideal para tratamientos a medio plazo con descuento especial',
                sessions: 5,
                originalPrice: 400,
                discountedPrice: 350,
                validityDays: 90,
                isActive: true,
                features: [
                  'Sesiones de 60 minutos',
                  'Flexibilidad de horarios',
                  'Material de apoyo incluido',
                  'Seguimiento entre sesiones'
                ]
              },
              {
                id: 2,
                name: 'Programa Intensivo',
                description: 'Tratamiento completo con máximo ahorro y beneficios adicionales',
                sessions: 10,
                originalPrice: 800,
                discountedPrice: 650,
                validityDays: 120,
                isActive: true,
                features: [
                  'Sesiones de 60 minutos',
                  'Evaluación inicial gratuita',
                  'Plan de tratamiento personalizado',
                  'Acceso a recursos online',
                  'Sesión de seguimiento gratuita'
                ]
              }
            ],
            coupons: [
              {
                id: 1,
                code: 'NUEVOCLIENTE20',
                description: 'Descuento especial para nuevos clientes',
                discountType: 'percentage',
                discountValue: 20,
                minAmount: 80,
                maxUses: 50,
                usedCount: 12,
                validFrom: '2024-01-01',
                validUntil: '2024-12-31',
                isActive: true,
                applicableServices: ['individual', 'couple']
              },
              {
                id: 2,
                code: 'VERANO2024',
                description: 'Promoción especial de verano',
                discountType: 'fixed',
                discountValue: 25,
                minAmount: 100,
                maxUses: 30,
                usedCount: 8,
                validFrom: '2024-06-01',
                validUntil: '2024-09-30',
                isActive: true,
                applicableServices: ['package']
              }
            ]
          },
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

            {/* Vídeo de Presentación */}
            <Card>
              <VideoPresentation
                videoData={profileData.videoPresentation}
                onChange={(videoPresentation) => updateProfileField('videoPresentation', videoPresentation)}
                isEditing={isEditing}
              />
            </Card>

            {/* Enlaces Externos */}
            <Card>
              <ExternalLinks
                links={profileData.externalLinks}
                onChange={(externalLinks) => updateProfileField('externalLinks', externalLinks)}
                isEditing={isEditing}
              />
            </Card>

            {/* Testimonios Destacados */}
            <Card>
              <FeaturedTestimonials
                selectedTestimonials={profileData.featuredTestimonials}
                onChange={(featuredTestimonials) => updateProfileField('featuredTestimonials', featuredTestimonials)}
                isEditing={isEditing}
              />
            </Card>

            {/* Experiencia Laboral */}
            <Card>
              <WorkExperience
                experiences={profileData.workExperience}
                onChange={(workExperience) => updateProfileField('workExperience', workExperience)}
                isEditing={isEditing}
              />
            </Card>

            {/* Paquetes y Cupones */}
            <Card>
              <PricingPackages
                packages={profileData.pricingPackages.packages}
                coupons={profileData.pricingPackages.coupons}
                onChange={(pricingData) => updateProfileField('pricingPackages', pricingData)}
                isEditing={isEditing}
              />
            </Card>

            {/* Ubicaciones de Trabajo */}
            <Card>
              <WorkLocationsManager
                locations={profileData.workLocations}
                onChange={(workLocations) => updateProfileField('workLocations', workLocations)}
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