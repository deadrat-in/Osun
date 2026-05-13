import React from 'react';
import { View, Text, Image } from 'react-native';

interface UserCardProps {
  user: {
    id: string;
    full_name: string;
    avatar_url: string;
    bio?: string;
    is_verified?: boolean;
  };
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <View className="flex-1 bg-white rounded-2xl shadow-lg shadow-black/10 overflow-hidden mx-2">
      {/* Image section */}
      <View className="relative">
        <Image
          source={{ uri: user.avatar_url }}
          className="w-full h-80"
          style={{ resizeMode: 'cover' }}
        />

        {/* Gradient overlay at bottom of image */}
        <View className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Name + verified badge */}
        <View className="absolute bottom-4 left-4 flex-row items-center">
          <Text className="text-white text-2xl font-bold">
            {user.full_name || 'Unknown'}
          </Text>
          {user.is_verified && (
            <View className="ml-2 bg-green-500 rounded-full px-2 py-0.5">
              <Text className="text-white text-xs font-semibold">✓</Text>
            </View>
          )}
        </View>

        {/* Distance / location placeholder */}
        <View className="absolute bottom-4 right-4 bg-black/40 rounded-full px-3 py-1">
          <Text className="text-white text-xs">Nearby</Text>
        </View>
      </View>

      {/* Bio section */}
      <View className="px-4 pt-3 pb-5">
        <Text className="text-gray-700 text-sm leading-relaxed" numberOfLines={3}>
          {user.bio || 'No bio yet'}
        </Text>
      </View>
    </View>
  );
}