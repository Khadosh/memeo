import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deleteMemeFromHistory, getMemeHistory, MemeHistoryItem } from '../lib/history';

export default function HistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<MemeHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    const data = await getMemeHistory();
    setHistory(data);
    setLoading(false);
  };

  const shareMeme = async (uri: string) => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          dialogTitle: 'Compartir mi Memeo',
          mimeType: 'image/jpeg',
          UTI: 'public.jpeg',
        });
      } else {
        alert("La función de compartir no está disponible en este dispositivo.");
      }
    } catch (err) {
      console.error("Error sharing:", err);
      alert("Uh oh, hubo un problema al compartir.");
    }
  };

  const deleteMeme = (id: string) => {
    if (Platform.OS === 'web') {
      if (window.confirm('¿Seguro que quieres eliminar este meme de tu historial?')) {
        performDelete(id);
      }
      return;
    }

    Alert.alert(
      "Eliminar Meme",
      "¿Seguro que quieres eliminar este meme de tu historial?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => performDelete(id) }
      ]
    );
  };

  const performDelete = async (id: string) => {
    await deleteMemeFromHistory(id);
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const renderItem = ({ item }: { item: MemeHistoryItem }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.localUri }} style={styles.image} contentFit="cover" />
      <View style={styles.actions}>
        <TouchableOpacity style={styles.buttonShare} onPress={() => shareMeme(item.localUri)}>
          <Text style={styles.buttonText}>Compartir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonDelete} onPress={() => deleteMeme(item.id)}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Historial</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00FF88" style={{ marginTop: 40 }} />
      ) : history.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Aún no has guardado ningún meme.</Text>
          <Text style={styles.emptySubtext}>¡Ve a crear uno!</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    color: '#00FF88',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
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
    borderColor: '#333',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#2A2A2A',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#333',
  },
  buttonShare: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#333',
  },
  buttonDelete: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
