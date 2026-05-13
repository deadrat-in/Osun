import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  matched_user: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}

export default function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          user1_id,
          user2_id,
          created_at,
          users!matches_user2_id_fkey (
            id,
            full_name,
            avatar_url
          )
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map to get the OTHER user in each match
      const mapped: Match[] = (data || []).map((m: any) => {
        const matchedUser =
          m.user1_id === user.id ? m.users : m.users; // users is always user2
        // If user2_id is current user, matched user is user1 — need a separate join
        // For simplicity with single join, we handle user2 join above,
        // but when current user IS user2, the matched user is user1
        // This is a simplified version — see note below
        return {
          id: m.id,
          user1_id: m.user1_id,
          user2_id: m.user2_id,
          created_at: m.created_at,
          matched_user: matchedUser,
        };
      });

      // Better approach: fetch matched user details separately
      const enriched = await Promise.all(
        (data || []).map(async (m: any) => {
          const otherId = m.user1_id === user.id ? m.user2_id : m.user1_id;
          const { data: otherUser } = await supabase
            .from('users')
            .select('id, full_name, avatar_url')
            .eq('id', otherId)
            .single();

          return {
            id: m.id,
            user1_id: m.user1_id,
            user2_id: m.user2_id,
            created_at: m.created_at,
            matched_user: otherUser,
          };
        })
      );

      setMatches(enriched);
    } catch (error: any) {
      console.error('Failed to fetch matches:', error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0077B5" />
        <Text className="text-gray-400 mt-3">Loading your matches...</Text>
      </View>
    );
  }

  if (matches.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-8">
        <Text className="text-5xl mb-4">💔</Text>
        <Text className="text-2xl font-bold text-center mb-2" style={{ color: '#1a1a2e' }}>
          No matches yet
        </Text>
        <Text className="text-gray-500 text-center text-base">
          Start discovering profiles to find your match!
        </Text>
      </View>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View className="px-6 pt-6 pb-3">
            <Text className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>
              {matches.length} {matches.length === 1 ? 'Match' : 'Matches'}
            </Text>
            <Text className="text-gray-400 text-sm">Your mutual connections</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity className="mx-6 mt-3 bg-white rounded-2xl shadow-sm shadow-black/5 overflow-hidden border border-gray-100">
            <View className="flex-row items-center p-4">
              {item.matched_user?.avatar_url ? (
                <Image
                  source={{ uri: item.matched_user.avatar_url }}
                  className="w-16 h-16 rounded-full"
                  style={{ width: 64, height: 64 }}
                />
              ) : (
                <View className="w-16 h-16 rounded-full bg-[#0077B5] items-center justify-center">
                  <Text className="text-white text-lg font-bold">
                    {(item.matched_user?.full_name?.charAt(0) || '?').toUpperCase()}
                  </Text>
                </View>
              )}

              <View className="flex-1 ml-4">
                <Text className="text-base font-semibold" style={{ color: '#1a1a2e' }}>
                  {item.matched_user?.full_name || 'Unknown'}
                </Text>
                <Text className="text-xs text-gray-400 mt-0.5">
                  Matched on {formatDate(item.created_at)}
                </Text>
              </View>

              <View className="w-2 h-2 rounded-full bg-green-500" />
            </View>

            {item.matched_user?.bio && (
              <View className="px-4 pb-4">
                <Text className="text-sm text-gray-600 leading-relaxed" numberOfLines={2}>
                  {item.matched_user.bio}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}