'use client';

import { useState, useEffect } from 'react';
import { useUserProfile, useUpdateProfile } from '@/hooks/use-user';
import { Gender, Currency } from '@/api/user';
import { User, MapPin, Calendar, Camera, Save, X, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { data: profile, isLoading, error, refetch } = useUserProfile();
  const { mutateAsync: updateProfile, isPending: isSaving } = useUpdateProfile();

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    fullName: '',
    birthday: '',
    gender: '' as Gender,
    location: '',
    currencyPreference: Currency.USD,
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        surname: profile.surname || '',
        fullName: profile.fullName || '',
        birthday: profile.birthday ? new Date(profile.birthday).toISOString().split('T')[0] : '',
        gender: profile.gender as Gender,
        location: profile.location || '',
        currencyPreference: profile.currencyPreference || Currency.USD,
      });
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      const currentData = {
        name: profile.name || '',
        surname: profile.surname || '',
        fullName: profile.fullName || '',
        birthday: profile.birthday ? new Date(profile.birthday).toISOString().split('T')[0] : '',
        gender: profile.gender as Gender,
        location: profile.location || '',
        currencyPreference: profile.currencyPreference || Currency.USD,
      };
      setHasChanges(JSON.stringify(formData) !== JSON.stringify(currentData));
    }
  }, [formData, profile]);

  const handleSave = async () => {
      await updateProfile(formData);
      await refetch();
      setHasChanges(false);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        surname: profile.surname || '',
        fullName: profile.fullName || '',
        birthday: profile.birthday ? new Date(profile.birthday).toISOString().split('T')[0] : '',
        gender: profile.gender as Gender,
        location: profile.location || '',
        currencyPreference: profile.currencyPreference || Currency.USD,
      });
      setHasChanges(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Failed to load profile</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-primary/20 text-primary rounded-xl hover:bg-primary/30 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F]">
      {/* Header */}
      <div className="border-b border-white/[0.05] bg-[#0D0D0F]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Profile</h1>
                <p className="text-stone-400 text-sm mt-0.5">Manage your personal information</p>
              </div>
            </div>

            {hasChanges && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary/20 border border-primary/30 rounded-xl text-primary hover:bg-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isSaving ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="max-w-2xl">
          {/* Profile Photo Section */}
          <div className="bg-[#1A1A1E] border border-white/[0.05] rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                  {profile?.profileImg ? (
                    <img
                      src={profile.profileImg}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-stone-500" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-primary/20 border border-primary/30 rounded-full p-2 hover:bg-primary/30 transition-all">
                  <Camera className="w-4 h-4 text-primary" />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">
                  {profile?.fullName || formData.fullName || 'Your Name'}
                </h2>
                <p className="text-stone-400 text-sm">{profile?.email}</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="bg-[#1A1A1E] border border-white/[0.05] rounded-2xl p-6 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value, fullName: `${e.target.value} ${formData.surname || ''}` })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-stone-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                placeholder="Your name"
              />
            </div>

            {/* Surname */}
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Surname</label>
              <input
                type="text"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value, fullName: `${formData.name || ''} ${e.target.value}` })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-stone-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                placeholder="Your surname"
              />
            </div>

            {/* Birthday */}
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Birthday</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-stone-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              >
                <option value="">Select gender</option>
                <option value={Gender.MALE}>Male</option>
                <option value={Gender.FEMALE}>Female</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-stone-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="Your location"
                />
              </div>
            </div>

            {/* Currency Preference */}
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Currency Preference</label>
              <select
                value={formData.currencyPreference}
                onChange={(e) => setFormData({ ...formData, currencyPreference: e.target.value as Currency })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              >
                <option value={Currency.USD}>USD ($)</option>
                <option value={Currency.EUR}>EUR (€)</option>
                <option value={Currency.UAH}>UAH (₴)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}