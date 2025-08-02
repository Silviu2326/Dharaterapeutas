import React, { useState, useRef } from 'react';
import { Image, Upload, X } from 'lucide-react';
import { Button } from '../../../components/Button';

export const BannerUpload = ({ currentBanner, onBannerChange, isEditing = false }) => {
  const [previewUrl, setPreviewUrl] = useState(currentBanner || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máx 10MB para banner)
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 10MB.');
      return;
    }

    setIsUploading(true);

    try {
      // Crear preview local
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);

      // Simular upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Notificar al componente padre
      if (onBannerChange) {
        onBannerChange(file, URL.createObjectURL(file));
      }
    } catch (error) {
      console.error('Error uploading banner:', error);
      alert('Error al subir la imagen. Inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveBanner = () => {
    setPreviewUrl(null);
    if (onBannerChange) {
      onBannerChange(null, null);
    }
  };

  const handleClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      <div className="relative group">
        <div 
          className={`
            relative w-full h-48 rounded-lg overflow-hidden border-2 border-dashed border-gray-300
            ${isEditing ? 'cursor-pointer hover:border-sage transition-colors' : 'border-solid'}
            ${previewUrl ? 'border-solid border-gray-200' : ''}
          `}
          onClick={handleClick}
          role={isEditing ? 'button' : 'img'}
          tabIndex={isEditing ? 0 : -1}
          aria-label={isEditing ? 'Cambiar imagen de portada' : 'Imagen de portada'}
          onKeyDown={(e) => {
            if (isEditing && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          {previewUrl ? (
            <>
              <img 
                src={previewUrl} 
                alt="Banner del perfil profesional" 
                className="w-full h-full object-cover"
              />
              
              {isEditing && (
                <>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-4">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClick();
                        }}
                        className="bg-white text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Cambiar</span>
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveBanner();
                        }}
                        className="bg-red-500 text-white hover:bg-red-600 px-3 py-2 rounded-lg flex items-center space-x-2"
                      >
                        <X className="h-4 w-4" />
                        <span>Quitar</span>
                      </Button>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveBanner();
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    aria-label="Quitar imagen de portada"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <Image className="h-12 w-12 mb-2" />
              <p className="text-sm font-medium">Imagen de portada</p>
              {isEditing && (
                <p className="text-xs mt-1">Haz clic para añadir una imagen</p>
              )}
            </div>
          )}
          
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-sm">Subiendo imagen...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {isEditing && !previewUrl && (
        <div className="mt-3 text-center">
          <Button
            onClick={handleClick}
            disabled={isUploading}
            className="bg-sage text-white hover:bg-sage/90 px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto"
          >
            <Upload className="h-4 w-4" />
            <span>Añadir portada</span>
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Recomendado: 1200x400px, máximo 10MB
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Seleccionar imagen de portada"
      />
    </div>
  );
};