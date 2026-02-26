import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TEMPLATES } from '../constants/Templates';
import { supabase } from '../lib/supabase';

export default function ResultScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [generating, setGenerating] = useState(true);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const template = TEMPLATES.find(t => t.id === params.templateId) || TEMPLATES[0];

  useEffect(() => {
    async function processFaceSwap() {
      try {
        setGenerating(true);
        setErrorMsg(null);

        let finalFaceUrl = params.faceImage as string;

        // If user uploaded a local face image, we must upload it to a public storage first
        // so fal.ai can access it. For MVP, we'll try to use a Supabase Storage bucket.
        // If there's no faceImage provided by user, we just return the template.
        if (!finalFaceUrl) {
          setResultImageUrl(null);
          setGenerating(false);
          return;
        }

        // 1. Read local file as Base64 (Compatible with Web & Native)
        const response = await fetch(finalFaceUrl);
        const blob = await response.blob();

        const faceDataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        // 2. Call Edge Function (Face Swap)
        const { data: swapData, error: swapError } = await supabase.functions.invoke('face-swap', {
          body: {
            templateImageUrl: template.publicUrl,
            swapImageBase64: faceDataUrl
          }
        });

        console.log("Edge Function Response", swapData, swapError);

        if (swapError) throw new Error("Error al generar meme: " + swapError.message + " | " + JSON.stringify(swapError));

        // fal.ai returns { data: { image: { url: '...' } }, requestId: '...' }
        if (swapData && swapData.data && swapData.data.image && swapData.data.image.url) {
          setResultImageUrl(swapData.data.image.url);
        } else if (swapData && swapData.image && swapData.image.url) {
          setResultImageUrl(swapData.image.url); // Fallback if API response shape changes
        } else {
          if (swapData && swapData.error) {
            throw new Error("API Error: " + swapData.error);
          }
          throw new Error("Respuesta Inesperada IA: " + JSON.stringify(swapData));
        }

      } catch (err) {
        if (err instanceof Error) {
          setErrorMsg(err.message);
        } else {
          setErrorMsg("Error desconocido");
        }
      } finally {
        setGenerating(false);
      }
    }

    processFaceSwap();
  }, []);

  const handleShare = async () => {
    // Sharing logic using expo-sharing (we will implement view-shot later)
    if (await Sharing.isAvailableAsync()) {
      // Sharing.shareAsync(localUri);
      alert("Compartir (Placeholder)");
    }
  };

  return (
    <View style={styles.container}>
      {generating ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00FF88" />
          <Text style={styles.loadingText}>Procesando magia con IA...</Text>
          <Text style={styles.loadingSubtext}>Intercambiando caras y pintando píxeles</Text>
        </View>
      ) : errorMsg ? (
        <View style={styles.resultContainer}>
          <Text style={styles.title}>¡Oh no, un error!</Text>
          <Text style={{ color: 'red', textAlign: 'center', marginBottom: 20 }}>{errorMsg}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.navigate('/')}>
            <Text style={styles.backButtonText}>Volver a intentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <Text style={styles.title}>¡Memeo Listo!</Text>

          <View style={styles.imagePlaceholder}>
            <Image
              source={resultImageUrl ? { uri: resultImageUrl } : template.image}
              style={styles.memeImage}
              resizeMode="cover"
            />
            <Text style={styles.previewTextTop}>{params.topText}</Text>
            <Text style={styles.previewTextBottom}>{params.bottomText}</Text>
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareButtonText}>Compartir / Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => router.navigate('/')}>
            <Text style={styles.backButtonText}>Hacer otro Memeo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#00FF88',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    textAlign: 'center',
  },
  loadingSubtext: {
    color: '#888',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  resultContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 32,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
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
  shareButton: {
    backgroundColor: '#00E676',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  shareButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
