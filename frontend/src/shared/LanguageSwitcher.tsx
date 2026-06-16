import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm p-1 rounded-xl border border-white/10">
      <button
        onClick={() => toggleLanguage('en')}
        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
          i18n.language === 'en' ? 'bg-accent text-primary' : 'text-gray-400 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => toggleLanguage('fr')}
        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
          i18n.language === 'fr' ? 'bg-accent text-primary' : 'text-gray-400 hover:text-white'
        }`}
      >
        FR
      </button>
      <button
        onClick={() => toggleLanguage('ar')}
        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
          i18n.language === 'ar' ? 'bg-accent text-primary' : 'text-gray-400 hover:text-white'
        }`}
      >
        AR
      </button>
    </div>
  );
};

export default LanguageSwitcher;
