import { useState } from 'react';
import { getUserData, saveUserData } from '../../utils/localStorage';

/**
 * PrivacySettings: what friends can see. One switch per thing you share,
 * as a divide-y list; each switch is a real role="switch" button labelled
 * by its row.
 */
export default function PrivacySettings() {
  const [settings, setSettings] = useState(() => getUserData()?.privacySettings || {
    shareLibrary: true,
    shareProgress: true,
    shareRatings: true,
    shareClubs: true
  });

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
      description: 'Let friends see which books you own.'
    },
    {
      key: 'shareProgress',
      title: 'Share my listening progress',
      description: 'Show friends what you are listening to now and how far along you are.'
    },
    {
      key: 'shareRatings',
      title: 'Share my ratings',
      description: 'Let friends see your ratings and reviews.'
    },
    {
      key: 'shareClubs',
      title: 'Share my book clubs',
      description: 'Let friends know which clubs you have joined.'
    }
  ];

  return (
    <section aria-labelledby="privacy-title">
      <h2 id="privacy-title" className="t-h2 text-ink">Privacy</h2>
      <p className="mt-1 max-w-[60ch] text-[0.9375rem] text-ink-2">
        Choose what you share with friends. Nothing here is shown to people you have not added.
      </p>

      <ul className="mt-5 divide-y divide-line border-y border-line">
        {privacyOptions.map((option) => {
          const on = !!settings[option.key];
          const labelId = `privacy-${option.key}`;
          return (
            <li key={option.key} className="flex items-center justify-between gap-6 py-4">
              <div className="min-w-0">
                <h3 id={labelId} className="font-semibold text-ink">{option.title}</h3>
                <p id={`${labelId}-desc`} className="mt-0.5 text-sm text-ink-2">{option.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                aria-labelledby={labelId}
                aria-describedby={`${labelId}-desc`}
                onClick={() => handleToggle(option.key)}
                className="group inline-flex h-11 shrink-0 items-center gap-2.5 rounded-full pl-2 text-sm font-medium text-ink-2"
              >
                <span className="w-7 text-right tabular" aria-hidden="true">{on ? 'On' : 'Off'}</span>
                <span className={`relative inline-flex h-7 w-12 items-center rounded-full border transition-colors duration-150 ${on ? 'border-ink bg-ink' : 'border-line-strong bg-surface-sunk'}`}>
                  <span className={`inline-block h-5 w-5 rounded-full transition-transform duration-150 ${on ? 'translate-x-6 bg-hl' : 'translate-x-1 bg-surface ring-1 ring-line-strong'}`} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
