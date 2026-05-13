import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export default function ProfileScreen() {
  const { user, sessionLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile(data);
        setBio(data.bio || '');
      }
    } catch (error: any) {
      console.error('Failed to fetch profile:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveBio() {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('users')
        .update({ bio: bio.trim() })
        .eq('id', user?.id);

      if (error) throw error;

      // Update local state
      setProfile((prev: any) => ({ ...prev, bio: bio.trim() }));
    } catch (error: any) {
      console.error('Failed to save bio:', error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Sign out error:', error.message);
  }

  if (sessionLoading || loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0077B5" />
      </View>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="items-center pt-12 pb-6 px-6">
          {profile.avatar_url ? (
            <Image
              source={{ uri: profile.avatar_url }}
              className="w-24 h-24 rounded-full"
              style={{ width: 96, height: 96 }}
            />
          ) : (
            <View className="w-24 h-24 rounded-full bg-[#0077B5] items-center justify-center">
              <Text className="text-white text-3xl font-bold">
                {(profile.full_name?.charAt(0) || '?').toUpperCase()}
              </Text>
            </View>
          )}

          <Text className="text-2xl font-bold text-[#1a1a2e] mt-4 text-center">
            {profile.full_name || 'Anonymous'}
          </Text>

          <View className="flex-row items-center mt-2 bg-green-50 px-3 py-1 rounded-full">
            <View className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
            <Text className="text-green-700 text-xs font-medium">Verified</Text>
          </View>
        </View>

        {/* Bio Section */}
        <View className="mx-6 mt-2">
          <Text className="text-gray-500 text-sm font-medium mb-2">About</Text>
          <TextInput
            className="border border-gray-200 rounded-2xl px-4 py-3 text-base text-gray-800 min-h-[100px] max-h-[180px]"
            multiline
            placeholder="Tell us about yourself..."
            value={bio}
            onChangeText={setBio}
            textAlignVertical="top"
          />

          <TouchableOpacity
            className={`mt-4 py-3 rounded-2xl items-center ${
              bio.trim() === profile.bio
                ? 'bg-gray-300'
                : 'bg-[#0077B5]'
            }`}
            onPress={handleSaveBio}
            disabled={saving || bio.trim() === profile.bio}
            activeOpacity={0.7}
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-base font-semibold">
                Save Bio
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* LinkedIn Info Card */}
        <View className="mx-6 mt-6 bg-gray-50 rounded-2xl p-4">
          <Text className="text-gray-400 text-xs uppercase font-semibold mb-2">
            LinkedIn Info
          </Text>
          <Text className="text-gray-700 text-sm">
            <Text className="font-medium">ID:</Text>{' '}
            {user.id.slice(0, 8)}...
          </Text>
          <Text className="text-gray-700 text-sm mt-1">
            <Text className="font-medium">Email:</Text>{' '}
            {user.email}
          </Text>
          <Text className="text-gray-700 text-sm mt-1">
            <Text className="font-medium">Verified:</Text>{' '}
            {profile.is_verified ? (
              <Text className="text-green-600 font-medium">Yes</Text>
            ) : (
              <Text className="text-red-500 font-medium">No</Text>
            )}
          </Text>
        </View>

        {/* Sign Out */}
        <View className="mx-6 mt-8 mb-4">
          <TouchableOpacity
            className="py-3 rounded-2xl border border-red-300 items-center"
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <Text className="text-red-500 text-base font-medium">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}