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
      <View style={styles.leftContainer}>
        {showBackBtn ? (
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#00FF88" />
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.logoContainer}>
            <ExpoImage 
              source={require('../assets/images/logo.svg')} 
              style={styles.logoImage} 
              contentFit="contain" 
            />
            <Text style={styles.logoText}>Memeo</Text>
          </View>
        )}
      </View>
      <HeaderMenu />
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
    paddingBottom: 8,
    backgroundColor: '#0A0A0A',
  },
  leftContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 36,
    height: 36,
    marginRight: 12,
  },
  logoText: {
    color: '#00FF88',
    fontSize: 26,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#00FF88',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});
