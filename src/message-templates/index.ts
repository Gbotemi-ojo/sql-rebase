import { dentalClinicTemplate } from './dental-clinic';
import { pharmacyTemplate } from './pharmacy.ts'; // 1. Import the new template

const defaultTemplate = (businessName: string): string => `Hi ${businessName}, I'm interested in your services.`;

export const getMessageTemplate = (categoryName: string, businessName: string): string => {
  const formattedCategory = categoryName.toLowerCase().replace(/\s+/g, '-');

  switch (formattedCategory) {
    case 'dental-clinic':
      return dentalClinicTemplate(businessName);

    // 2. Add a new case for the pharmacy category
    case 'pharmacy':
      return pharmacyTemplate(businessName);
      
    default:
      return defaultTemplate(businessName);
  }
};
