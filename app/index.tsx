import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TopNav } from '../components/TopNav';
import { TEMPLATES } from '../constants/Templates';

export default function HomeScreen() {
  const router = useRouter();

  const handleSelectTemplate = (id: string) => {
    router.push({ pathname: '/editor', params: { templateId: id } });
  };

  const renderItem = ({ item }: { item: typeof TEMPLATES[0] }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleSelectTemplate(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.memeImage} resizeMode="cover" />
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.cardTitle}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopNav />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Selecciona una Plantilla</Text>
          <Text style={styles.headerSubtitle}>Elige un meme clásico para empezar tu creación</Text>
        </View>
      </View>

      <FlatList
        data={TEMPLATES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A', // Dark aesthetic
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
    paddingRight: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 20,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888888',
    marginLeft: 20,
    marginTop: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '48%',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333333',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#2A2A2A',
  },
  memeImage: {
    width: '100%',
    height: '100%',
  },
  cardFooter: {
    padding: 12,
  },
  cardTitle: {
    color: '#EEEEEE',
    fontSize: 14,
    fontWeight: '600',
  },
});
