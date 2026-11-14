'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { NeoCard } from '../common/NeoCard';
import { NeoButton } from '../common/NeoButton';
import {
  Settings,
  Database,
  Moon,
  Sun,
  Globe,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  KeyRound,
  User,
  Sparkles
} from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const {
    settings,
    updateSettings,
    isSupabaseLive,
    userEmail,
    resetToDefaultData
  } = useApp();

  const [fullName, setFullName] = useState(settings.user_name || 'Indiresh');
  const [profileEmail, setProfileEmail] = useState(settings.user_email || userEmail || 'indiresh@example.com');

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div className="border-b-2 border-black pb-4">
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
          <span className="p-1 bg-zinc-200 text-black border border-black rounded shadow-[2px_2px_0px_#000]">
            <Settings className="w-5 h-5" />
          </span>
          System Settings & Supabase Configuration
        </h2>
        <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">
          Manage your personal profile, database connections, Neo-Brutalism themes and defaults
        </p>
      </div>

      {/* Supabase Connection Status Card */}
      <NeoCard
        variant={isSupabaseLive ? 'green' : 'yellow'}
        className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-5 h-5 text-black" />
            <h3 className="font-black text-base uppercase text-black">
              {isSupabaseLive ? 'Supabase Database Connected' : 'Local Demo Mode Active'}
            </h3>
          </div>
          <p className="text-xs font-bold text-zinc-800 max-w-xl">
            {isSupabaseLive
              ? `Live PostgreSQL connection active. Authenticated as: ${userEmail || 'Active Session'}. Row-Level Security (RLS) is enforced.`
              : 'Running seamlessly with persistent local storage. When you are ready to persist across cloud devices, add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.'}
          </p>
        </div>

        <div className="shrink-0">
          <span className="text-xs font-black uppercase px-3 py-1.5 bg-black text-white rounded border border-black shadow-[2px_2px_0px_#000]">
            {isSupabaseLive ? 'Cloud PostgreSQL ✓' : 'Local Storage Active'}
          </span>
        </div>
      </NeoCard>

      {/* Profile Settings */}
      <NeoCard variant="white" className="p-5">
        <h3 className="font-black text-sm uppercase text-zinc-900 border-b-2 border-black pb-2 mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" /> Personal Profile
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Display Name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full neo-input"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Account Email</label>
            <input
              type="email"
              value={profileEmail}
              onChange={e => setProfileEmail(e.target.value)}
              className="w-full neo-input"
            />
          </div>
        </div>

        <NeoButton
          variant="primary"
          size="sm"
          onClick={() => {
            updateSettings({ user_name: fullName, user_email: profileEmail });
            alert(`Profile updated for ${fullName}!`);
          }}
        >
          Save Profile
        </NeoButton>
      </NeoCard>

      {/* Preferences & Theme */}
      <NeoCard variant="white" className="p-5">
        <h3 className="font-black text-sm uppercase text-zinc-900 border-b-2 border-black pb-2 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" /> UI & Localization
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Theme Mode</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateSettings({ theme: 'light' })}
                className={`flex-1 py-2 text-xs font-black border-2 border-black rounded flex items-center justify-center gap-1.5 cursor-pointer ${
                  settings.theme === 'light' ? 'bg-amber-300 shadow-[2px_2px_0px_#000]' : 'bg-white'
                }`}
              >
                <Sun className="w-4 h-4" /> Light (Sand & Cream)
              </button>
              <button
                type="button"
                onClick={() => updateSettings({ theme: 'dark' })}
                className={`flex-1 py-2 text-xs font-black border-2 border-black rounded flex items-center justify-center gap-1.5 cursor-pointer ${
                  settings.theme === 'dark' ? 'bg-zinc-800 text-white shadow-[2px_2px_0px_#000]' : 'bg-white'
                }`}
              >
                <Moon className="w-4 h-4" /> Dark Mode
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Default Timezone</label>
            <div className="p-2.5 bg-[#FAF6EE] border-2 border-black rounded flex items-center justify-between text-xs font-black">
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-blue-600" /> Asia/Kolkata (IST)
              </span>
              <span className="text-[10px] uppercase bg-lime-300 px-2 py-0.5 border border-black rounded">
                Active
              </span>
            </div>
          </div>
        </div>
      </NeoCard>

      {/* Reset Seed Data */}
      <NeoCard variant="white" className="p-5 border-rose-500">
        <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
          <h3 className="font-black text-sm uppercase text-rose-600 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Reset Application Data
          </h3>
          <span className="text-xs font-bold text-zinc-500">Factory Reset</span>
        </div>
        <p className="text-xs font-bold text-zinc-600 mb-4">
          Reset all habits, routine time slots, 4th/5th semester roadmaps, purchase goals and savings targets
          back to the original specifications provided in the docx prompt.
        </p>

        <NeoButton variant="danger" size="sm" onClick={resetToDefaultData}>
          <RotateCcw className="w-3.5 h-3.5" /> Reset to Initial Seed Data
        </NeoButton>
      </NeoCard>
    </div>
  );
};

