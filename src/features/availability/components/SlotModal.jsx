import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, Repeat, Globe, Palette, AlertCircle, Save } from 'lucide-react';

const REPEAT_OPTIONS = [
  { value: 'never', label: 'Nunca' },
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' }
];

const COLOR_OPTIONS = [
  { value: 'sage', label: 'Verde Sage', color: 'bg-sage' },
  { value: 'blue', label: 'Azul', color: 'bg-blue-500' },
  { value: 'purple', label: 'Morado', color: 'bg-purple-500' },
  { value: 'green', label: 'Verde', color: 'bg-green-500' },
  { value: 'yellow', label: 'Amarillo', color: 'bg-yellow-500' },
  { value: 'red', label: 'Rojo', color: 'bg-red-500' }
];

const TIMEZONE_OPTIONS = [
  { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)' },
  { value: 'Europe/London', label: 'Londres (GMT/BST)' },
  { value: 'America/New_York', label: 'Nueva York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'Los Ángeles (PST/PDT)' }
];

const TimeInput = ({ label, value, onChange, error, required = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full px-3 py-2 border rounded-md shadow-sm
        focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage
        ${error ? 'border-red-300' : 'border-gray-300'}
      `}
      required={required}
    />
    {error && (
      <p className="mt-1 text-sm text-red-600 flex items-center">
        <AlertCircle className="h-4 w-4 mr-1" />
        {error}
      </p>
    )}
  </div>
);

const DateInput = ({ label, value, onChange, error, required = false, min }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={min}
      className={`
        w-full px-3 py-2 border rounded-md shadow-sm
        focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage
        ${error ? 'border-red-300' : 'border-gray-300'}
      `}
      required={required}
    />
    {error && (
      <p className="mt-1 text-sm text-red-600 flex items-center">
        <AlertCircle className="h-4 w-4 mr-1" />
        {error}
      </p>
    )}
  </div>
);

export const SlotModal = ({ 
  isOpen,
  onClose,
  onSave,
  slot = null,
  existingEvents = [],
  defaultTimezone = 'Europe/Madrid',
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '10:00',
    repeat: 'never',
    timezone: defaultTimezone,
    color: 'sage',
    title: 'Disponible',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [conflicts, setConflicts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form when modal opens or slot changes
  useEffect(() => {
    if (isOpen) {
      if (slot) {
        // Editing existing slot
        setFormData({
          startDate: slot.startDate || new Date().toISOString().split('T')[0],
          endDate: slot.endDate || new Date().toISOString().split('T')[0],
          startTime: slot.startTime || '09:00',
          endTime: slot.endTime || '10:00',
          repeat: slot.repeat || 'never',
          timezone: slot.timezone || defaultTimezone,
          color: slot.color || 'sage',
          title: slot.title || 'Disponible',
          notes: slot.notes || ''
        });
      } else {
        // Creating new slot
        const today = new Date().toISOString().split('T')[0];
        setFormData({
          startDate: today,
          endDate: today,
          startTime: '09:00',
          endTime: '10:00',
          repeat: 'never',
          timezone: defaultTimezone,
          color: 'sage',
          title: 'Disponible',
          notes: ''
        });
      }
      setErrors({});
      setConflicts([]);
    }
  }, [isOpen, slot, defaultTimezone]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'La fecha de fin es requerida';
    }
    
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'La fecha de fin debe ser posterior a la de inicio';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'La hora de inicio es requerida';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'La hora de fin es requerida';
    }
    
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'La hora de fin debe ser posterior a la de inicio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkConflicts = () => {
    // Check for conflicts with existing appointments
    const conflictingEvents = existingEvents.filter(event => {
      if (event.type !== 'appointment') return false;
      if (event.id === slot?.id) return false; // Don't conflict with self
      
      // Simple date/time overlap check
      return (
        event.date === formData.startDate &&
        event.startTime < formData.endTime &&
        event.endTime > formData.startTime
      );
    });
    
    setConflicts(conflictingEvents);
    return conflictingEvents;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const conflictingEvents = checkConflicts();
    if (conflictingEvents.length > 0) {
      // Show conflicts but allow user to proceed
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSave?.({
        ...formData,
        id: slot?.id || `slot_${Date.now()}`,
        type: 'availability'
      });
      onClose();
    } catch (error) {
      setErrors({ submit: 'Error al guardar el bloque de disponibilidad' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={handleClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                <Calendar className="h-5 w-5 inline mr-2" />
                {slot ? 'Editar bloque de disponibilidad' : 'Nuevo bloque de disponibilidad'}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Cerrar modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Conflicts warning */}
            {conflicts.length > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">
                      Conflicto detectado
                    </h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Este horario se solapa con {conflicts.length} cita(s) existente(s). 
                      ¿Deseas continuar?
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Date range */}
              <div className="grid grid-cols-2 gap-4">
                <DateInput
                  label="Fecha de inicio"
                  value={formData.startDate}
                  onChange={(value) => setFormData(prev => ({ ...prev, startDate: value }))}
                  error={errors.startDate}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
                <DateInput
                  label="Fecha de fin"
                  value={formData.endDate}
                  onChange={(value) => setFormData(prev => ({ ...prev, endDate: value }))}
                  error={errors.endDate}
                  required
                  min={formData.startDate}
                />
              </div>

              {/* Time range */}
              <div className="grid grid-cols-2 gap-4">
                <TimeInput
                  label="Hora de inicio"
                  value={formData.startTime}
                  onChange={(value) => setFormData(prev => ({ ...prev, startTime: value }))}
                  error={errors.startTime}
                  required
                />
                <TimeInput
                  label="Hora de fin"
                  value={formData.endTime}
                  onChange={(value) => setFormData(prev => ({ ...prev, endTime: value }))}
                  error={errors.endTime}
                  required
                />
              </div>

              {/* Repeat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Repeat className="h-4 w-4 inline mr-1" />
                  Repetir
                </label>
                <select
                  value={formData.repeat}
                  onChange={(e) => setFormData(prev => ({ ...prev, repeat: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage"
                >
                  {REPEAT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timezone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Globe className="h-4 w-4 inline mr-1" />
                  Zona horaria
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage"
                >
                  {TIMEZONE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Palette className="h-4 w-4 inline mr-1" />
                  Color (opcional)
                </label>
                <div className="flex space-x-2">
                  {COLOR_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color: option.value }))}
                      className={`
                        w-8 h-8 rounded-full border-2 transition-all duration-200
                        ${option.color}
                        ${formData.color === option.value 
                          ? 'border-gray-900 scale-110' 
                          : 'border-gray-300 hover:border-gray-400'
                        }
                      `}
                      title={option.label}
                      aria-label={`Seleccionar color ${option.label}`}
                    />
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas (opcional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage"
                  placeholder="Información adicional sobre este bloque de disponibilidad..."
                />
              </div>

              {/* Submit error */}
              {errors.submit && (
                <div className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.submit}
                </div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting || loading}
              className="
                w-full inline-flex justify-center rounded-md border border-transparent shadow-sm 
                px-4 py-2 bg-sage text-base font-medium text-white 
                hover:bg-sage/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage 
                sm:ml-3 sm:w-auto sm:text-sm
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {slot ? 'Actualizar' : 'Crear'} bloque
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="
                mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm 
                px-4 py-2 bg-white text-base font-medium text-gray-700 
                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage 
                sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};