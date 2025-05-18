import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, TextArea, Select } from '../ui/Input';
import { AdPlatform } from '../../types';

interface AddOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    platform: AdPlatform;
    adLibraryUrl: string;
    initialCount: number;
  }) => void;
  editingOffer?: Offer | null;
}


const AddOfferModal: React.FC<AddOfferModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platform: 'facebook' as AdPlatform,
    adLibraryUrl: '',
    initialCount: 0
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  if (!isOpen) return null;
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.adLibraryUrl.trim()) newErrors.adLibraryUrl = 'Ad library URL is required';
    if (formData.initialCount < 0) newErrors.initialCount = 'Count cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'initialCount' ? parseInt(value) || 0 : value
    }));
  };
  
  const platformOptions = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'google', label: 'Google' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'snapchat', label: 'Snapchat' },
    { value: 'pinterest', label: 'Pinterest' },
    { value: 'other', label: 'Other' }
  ];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Offer</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <Input
            label="Offer Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Summer Promotion"
            fullWidth
            error={errors.title}
          />
          
          <TextArea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the offer"
            rows={3}
            fullWidth
            error={errors.description}
          />
          
          <Select
            label="Platform"
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            options={platformOptions}
            fullWidth
            error={errors.platform}
          />
          
          <Input
            label="Ad Library URL"
            name="adLibraryUrl"
            value={formData.adLibraryUrl}
            onChange={handleChange}
            placeholder="https://www.example.com/ads"
            fullWidth
            error={errors.adLibraryUrl}
          />
          
          <Input
            label="Initial Ad Count"
            name="initialCount"
            type="number"
            value={formData.initialCount.toString()}
            onChange={handleChange}
            placeholder="0"
            fullWidth
            error={errors.initialCount}
          />
          
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Offer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOfferModal;