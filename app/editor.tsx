import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TopNav } from '../components/TopNav';
import { TEMPLATES } from '../constants/Templates';

export default function EditorScreen() {
  const { templateId } = useLocalSearchParams<{ templateId: string }>();
  const router = useRouter();
  const template = TEMPLATES.find((t: typeof TEMPLATES[0]) => t.id === templateId) || TEMPLATES[0];

  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [faceImage, setFaceImage] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        try {
          // Process image to ensure format is JPEG and size is reasonable 
          // (HEIF from iOS can cause Fal.ai and Supabase 500 errors)
          const manipResult = await ImageManipulator.manipulateAsync(
            result.assets[0].uri,
            [{ resize: { width: 800 } }], // Compress width to 800px, height will adjust automatically to 1:1
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
          );

          setFaceImage(manipResult.uri);
        } catch (manipError: any) {
          console.error("Image manipulation error:", manipError);
          // Fallback: Si la manipulación falla (ej. incompatibilidad Web con HEIC o falta de binarios), usamos la original
          setFaceImage(result.assets[0].uri);
        }
      }
    } catch (error: any) {
      alert("Uh oh, no pudimos abrir la galería: " + (error?.message || String(error)));
    }
  };

  const handleGenerate = () => {
    // In a real app we would pass these to a context or global state, 
    // or stringify them into params (careful with large URIs)
    router.push({
      pathname: '/result',
      params: { templateId, topText, bottomText, faceImage }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopNav showBackBtn />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.previewContainer}>
        <Image source={template.image} style={styles.memeImage} resizeMode="cover" />
        <Text style={styles.previewTextTop}>{topText || 'TEXTO SUPERIOR'}</Text>
        <Text style={styles.previewTextBottom}>{bottomText || 'TEXTO INFERIOR'}</Text>
      </View>

      <View style={styles.inputsContainer}>
        <Text style={styles.label}>Texto Superior</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Cuando te das cuenta..."
          placeholderTextColor="#666"
          value={topText}
          onChangeText={setTopText}
        />

        <Text style={styles.label}>Texto Inferior</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Que dejaste la estufa prendida"
          placeholderTextColor="#666"
          value={bottomText}
          onChangeText={setBottomText}
        />

        <Text style={styles.label}>Rostro a intercambiar (Opcional)</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadButtonText}>
            {faceImage ? 'Rostro seleccionado ✓ (Toca para cambiar)' : 'Subir foto del rostro'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
        <Text style={styles.generateButtonText}>Generar Memeo ✨</Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  previewContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333333',
    position: 'relative',
  },
  memeImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  previewTextTop: {
    position: 'absolute',
    top: 20,
    color: '#FFF',
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    textTransform: 'uppercase',
  },
  previewTextBottom: {
    position: 'absolute',
    bottom: 20,
    color: '#FFF',
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    textTransform: 'uppercase',
  },
  inputsContainer: {
    marginBottom: 32,
  },
  label: {
    color: '#EEEEEE',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    color: '#FFF',
    padding: 16,
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    borderColor: '#444',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  uploadButtonText: {
    color: '#00FF88',
    fontWeight: '600',
    fontSize: 16,
  },
  generateButton: {
    backgroundColor: '#00E676',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  generateButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
