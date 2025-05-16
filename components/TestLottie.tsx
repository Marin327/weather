import React from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';

export default function TestLottie() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <LottieView
        source={require('../assets/animations/clear.json')}
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
}
