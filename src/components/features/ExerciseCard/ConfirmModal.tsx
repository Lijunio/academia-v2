import React from 'react';

interface ConfirmModalProps {
  isVisible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isVisible,
  title,
  message,
  confirmText = 'Sim',
  cancelText = 'Não',
  onConfirm,
  onCancel
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-secondary-dark to-black rounded-2xl 
        p-6 max-w-md w-full border border-white/10">
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br 
            from-orange-500 to-red-500 flex items-center justify-center">
            <i className="fas fa-exclamation-triangle text-2xl text-white"></i>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">
            {title}
          </h3>
          <p className="text-text-secondary">
            {message}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-gradient-to-r from-gray-600 to-gray-700 
              text-white font-bold rounded-xl transition-all hover:opacity-90"
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-red-600 
              text-white font-bold rounded-xl transition-all hover:opacity-90"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;