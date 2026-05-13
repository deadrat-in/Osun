import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { supabase } from '../lib/supabase';
import UserCard from '../components/UserCard';

const { width } = Dimensions.get('window');

export default function DiscoverScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [swipedOut, setSwipedOut] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('discover_users');
      if (error) throw error;
      setUsers(data || []);
      setSwipedOut(false);
    } catch (error: any) {
      console.error('Failed to fetch users:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSwipe(direction: 'like' | 'pass', swipedUserId: string) {
    try {
      if (direction === 'pass') {
        const { error } = await supabase
          .from('swipes')
          .insert({ action: 'pass', swiped_id: swipedUserId });
        if (error) throw error;
      } else {
        // Like — use the server-side process_swipe function
        const { data, error } = await supabase.rpc('process_swipe', {
          p_swiped_id: swipedUserId,
        });
        if (error) throw error;

        if (data?.is_match) {
          console.log('🎉 New match! Match ID:', data.match_id);
          // Optional: show a match animation/toast here
        }
      }
    } catch (error: any) {
      console.error('Failed to record swipe:', error.message);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0077B5" />
        <Text className="text-gray-400 mt-3">Loading profiles...</Text>
      </View>
    );
  }

  if (swipedOut || users.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-8">
        <Text className="text-5xl mb-4">🎉</Text>
        <Text className="text-2xl font-bold text-center mb-2" style={{ color: '#1a1a2e' }}>
          You've seen everyone!
        </Text>
        <Text className="text-gray-500 text-center text-base mb-8">
          Check back later for more profiles.
        </Text>
        <TouchableOpacity
          className="bg-[#0077B5] px-8 py-3 rounded-2xl"
          onPress={fetchUsers}
        >
          <Text className="text-white text-base font-semibold">Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Swiper
        cards={users}
        renderCard={(user) => <UserCard user={user} />}
        cardIndex={0}
        backgroundColor="transparent"
        stackSize={3}
        stackSeparation={12}
        animateCardOpacity
        animateOverlayLabelsOpacity
        overlayLabels={{
          left: {
            title: 'PASS',
            style: {
              label: {
                backgroundColor: '#EF4444',
                borderColor: '#EF4444',
                color: 'white',
                borderWidth: 2,
                fontSize: 28,
                fontWeight: 'bold',
              },
            },
          },
          right: {
            title: 'LIKE',
            style: {
              label: {
                backgroundColor: '#22C55E',
                borderColor: '#22C55E',
                color: 'white',
                borderWidth: 2,
                fontSize: 28,
                fontWeight: 'bold',
              },
            },
          },
        }}
        onSwipedLeft={(cardIndex) => {
          handleSwipe('pass', users[cardIndex]?.id);
        }}
        onSwipedRight={(cardIndex) => {
          handleSwipe('like', users[cardIndex]?.id);
        }}
        onSwipedAll={() => setSwipedOut(true)}
      />

      {/* Instruction label */}
      <View className="absolute bottom-6 left-0 right-0 items-center">
        <View className="flex-row items-center bg-white/90 px-4 py-2 rounded-full shadow">
          <Text className="text-gray-400 text-sm mr-2">← Pass</Text>
          <View className="w-1 h-1 rounded-full bg-gray-300 mx-1" />
          <Text className="text-gray-800 font-semibold text-sm">Tap card for details</Text>
          <View className="w-1 h-1 rounded-full bg-gray-300 mx-1" />
          <Text className="text-green-500 font-semibold text-sm">Like →</Text>
        </View>
      </View>
    </View>
  );
}