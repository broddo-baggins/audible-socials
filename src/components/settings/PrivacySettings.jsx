import { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { getUserData, saveUserData } from '../../utils/localStorage';

export default function PrivacySettings() {
  const [settings, setSettings] = useState({
    shareLibrary: true,
    shareProgress: true,
    shareRatings: true,
    shareClubs: true
  });

  useEffect(() => {
    const user = getUserData();
    if (user && user.privacySettings) {
      setSettings(user.privacySettings);
    }
  }, []);

  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    
    const user = getUserData();
    user.privacySettings = newSettings;
    saveUserData(user);
  };

  const privacyOptions = [
    {
      key: 'shareLibrary',
      title: 'Share my library',
      description: 'Let friends see which books you own'
    },
    {
      key: 'shareProgress',
      title: 'Share my reading progress',
      description: 'Show friends what you\'re currently reading and your progress'
    },
    {
      key: 'shareRatings',
      title: 'Share my ratings',
      description: 'Allow friends to see your book ratings and reviews'
    },
    {
      key: 'shareClubs',
      title: 'Share my book clubs',
      description: 'Let friends know which book clubs you\'ve joined'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-900">Privacy Settings</h3>
      </div>

      <p className="text-gray-600 mb-6">
        Control what information you share with friends. Your privacy is important to us.
      </p>

      <div className="space-y-4">
        {privacyOptions.map((option) => (
          <div
            key={option.key}
            className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                {settings[option.key] ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
                <h4 className="font-semibold text-gray-900">{option.title}</h4>
              </div>
              <p className="text-sm text-gray-600">{option.description}</p>
            </div>
            <button
              onClick={() => handleToggle(option.key)}
              className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings[option.key] ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings[option.key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

