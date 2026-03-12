import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image as ExpoImage } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HeaderMenu } from './HeaderMenu';

interface TopNavProps {
  showBackBtn?: boolean;
}

export function TopNav({ showBackBtn = false }: TopNavProps) {
  const router = useRouter();

  return (
    <View style={styles.topNav}>
      {/* Left Slot: Back Button or Empty Space */}
      <View style={styles.leftSlot}>
        {showBackBtn && (
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#00FF88" />
          </TouchableOpacity>
        )}
      </View>

      {/* Center Slot: Always Logo */}
      <View style={styles.centerSlot}>
        <ExpoImage 
          source={require('../assets/images/logo.svg')} 
          style={styles.logoImage} 
          contentFit="contain" 
        />
        <Text style={styles.logoText}>Memeo</Text>
      </View>

      {/* Right Slot: Menu (Only if no back button, meaning Home) or Empty Space */}
      <View style={styles.rightSlot}>
        {!showBackBtn && <HeaderMenu />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  leftSlot: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSlot: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSlot: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logoImage: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  logoText: {
    color: '#00FF88',
    fontSize: 22,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  backButton: {
    padding: 8,
    marginLeft: -8, // slight offset to align visually with screen padding
  },
});
