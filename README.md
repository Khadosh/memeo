# 🎭 Memeo

¡Bienvenido a **Memeo**! La aplicación definitiva para crear memes personalizados de forma rápida y sencilla aprovechando el poder de la Inteligencia Artificial.

Con Memeo, puedes tomar plantillas clásicas de memes y sustituir los rostros de los personajes por los tuyos o los de tus amigos en cuestión de segundos, todo desde tu dispositivo móvil.

## 🚀 Características Principales

- **Catálogo de Plantillas**: Elige entre los memes más populares y clásicos (Distracted Boyfriend, Drake, Woman Yelling at Cat, etc.).
- **Face Swapping con IA**: Sube una selfie y nuestra integración de Inteligencia Artificial intercambiará tu rostro con el del personaje del meme de manera hiperrealista.
- **Personalización de Textos**: Agrega el clásico texto superior e inferior a tus creaciones para darles el remate perfecto.
- **Compartir Fácilmente**: Guarda el resultado final y compártelo directamente en WhatsApp, Instagram, Telegram o cualquier otra red social.

## 🛠 Tech Stack

El proyecto está construido usando tecnologías modernas para asegurar una experiencia fluida tanto en iOS como en Android:

- **Frontend / Móvil**: [React Native](https://reactnative.dev/) con [Expo](https://expo.dev/).
- **Navegación**: Expo Router (Enrutamiento basado en archivos).
- **Backend & Almacenamiento**: [Supabase](https://supabase.com/) (Autenticación, Base de Datos y Storage).
- **Lógica de Servidor & IA**: Supabase Edge Functions interactuando con **fal.ai** para realizar el Face Swapping.
- **Procesamiento de Imágenes Local**: `expo-image-manipulator`, `expo-image-picker` y `react-native-view-shot`.

## ⚙️ Desarrollo Local (Cómo Empezar)

Para correr la aplicación de forma local, sigue estos pasos:

### 1. Clonar e Instalar Dependencias
Asegúrate de tener Node.js instalado.

```bash
git clone https://github.com/tu-usuario/memeo.git
cd memeo
npm install
```

### 2. Configurar Variables de Entorno
Necesitarás crear un archivo `.env` en la raíz del proyecto para conectar la aplicación con Supabase:

```env
EXPO_PUBLIC_SUPABASE_URL=tu_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

*(Si eres miembro del equipo, solicita las claves de desarrollo).*

### 3. Ejecutar la Aplicación

Inicia el entorno de desarrollo de Expo:

```bash
npm start
```
- Presiona `i` para abrir el simulador de iOS (requiere Xcode).
- Presiona `a` para abrir el emulador de Android (requiere Android Studio).
- O escanea el código QR con la aplicación **Expo Go** en tu dispositivo físico.

## 🗺 Roadmap Próximos Pasos

El proyecto está en constante evolución. Algunas de las próximas características que implementaremos son:

- **Historial de Memes**: Guarda tus creaciones favoritas.
- **Galería de Rostros**: Almacena las caras que más usas para no tener que subirlas de nuevo.
- **Múltiples Caras por Meme**: Soporte para reemplazar varios rostros en plantillas donde hay más de un personaje protagonista.
- **Integración de Contactos**: Elige la foto de tus amigos directamente desde tu agenda (libre de fricciones).
- **Monetización**: Modelo Freemium con anuncios de recompensa o suscripción Premium de bajo costo (ej. $1 USD/mes).
- **Optimización de Tiempos**: Mejoras en la velocidad de la IA y subida de imágenes para reducir los tiempos de generación de 1 minuto a segundos.

Para más detalles, consulta el archivo [roadmap.md](./roadmap.md) y [technical_overview.md](./technical_overview.md) incluidos en la raíz del proyecto.

---
*Hecho para romper el hielo en cualquier grupo de WhatsApp.*
