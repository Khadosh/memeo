# Memeo - Technical Overview

This document provides a technical overview of the **Memeo** application, explaining its architecture, standard flows, stack, and project structure. It serves as context for developers and AI assistants contributing to the project.

## 1. Tech Stack
- **Framework**: React Native with [Expo](https://expo.dev/) (Expo SDK 52/54 range based on versions).
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing within the `app` directory).
- **Backend & Cloud Services**: [Supabase](https://supabase.com/) (used via `@supabase/supabase-js`).
- **AI Processing**: Supabase Edge Functions (`face-swap` function) communicating with external AI logic (likely **fal.ai** for the actual face swap generation).
- **State Management**: Simple React hooks (`useState`, `useEffect`). No complex global stores (like Redux/Zustand) yet.
- **Styling**: Standard React Native `StyleSheet`.

## 2. Core Dependencies & Tools
- UI/UX & Interaction:
  - `react-native-reanimated` & `react-native-gesture-handler`: Animations & interactions.
  - `expo-image`, `@expo/vector-icons`.
- Image Handling:
  - `expo-image-picker`: Selecting user photos.
  - `expo-image-manipulator`: Compressing files to JPEG formats (800w) before passing them to the AI, mitigating HEIC payload issues on Edge Functions.
  - `react-native-view-shot` (native) & `html2canvas` (web): Capturing the rendered React Native `View` into an image format.
- Sharing / Device Integration:
  - `expo-sharing`: For sharing the generated memes via WhatsApp, Telegram, etc.

## 3. Architecture & Application Flow

### 3.1 Template Selection (Home)
- **Path**: `app/index.tsx`
- **Behavior**: Home screen reads predefined meme structures from `constants/Templates.ts` (`id`, `name`, `local image required`, `publicUrl`). They are rendered using a standard `FlatList`.
- **Navigation**: Selecting a template navigates to the Editor pushing `templateId` in params.

### 3.2 Editing (Editor)
- **Path**: `app/editor.tsx`
- **Behavior**: 
  - Retrieves the selected template.
  - Users can input top and bottom texts (`topText`, `bottomText`).
  - Optionally, select a face (`faceImage`) via `expo-image-picker`.
  - The face image undergoes compression and conversion to JPEG via `expo-image-manipulator` to prevent payload errors.
- **Navigation**: Generates the payload locally and routes to `app/result.tsx` pushing all values in the navigation params.

### 3.3 Generation & Result (Result)
- **Path**: `app/result.tsx`
- **Behavior**:
  1. Displays an activity indicator.
  2. If a local face exists: It is converted to Base64 via `fetch` & `FileReader`.
  3. Invokes the Supabase Edge Function `face-swap` passing the `templateImageUrl` (public URL from `Templates.ts`) and the `swapImageBase64`.
  4. Awaits the AI response which contains a URL of the generated image.
  5. The image is rendered within a `View` that also absolutely positions `topText` and `bottomText` on top of the image.
  6. **Exporting**: Users can trigger the share flow. The app uses `react-native-view-shot` (captures the enclosing View holding image + text overlays) and bridges to `expo-sharing` so the user can easily export the final composition.

## 4. Extension Points & Roadmap Implications

Implementing features such as **History** and **Multi-face templates**:
- **Persistence**: Given Supabase is already configured (`lib/supabase.ts`), user sessions, `auth`, and database tables (`memes_history`, `faces_history`) are the natural path for state persistence without relying solely on `AsyncStorage`.
- **AI Payload Updates**: To support "Multi-face" or "Prompt overrides", the payload to the Edge function needs to transition from scalar (`swapImageBase64`) to an array/object structure mapping face positions or roles. The backing `fal.ai` integration within the Edge Function will need an equivalent update to handle multi-masking or positional face swaps.
- **Local Face Management**: Refactoring `editor.tsx` to launch a new modal or route to select faces from a local cache rather than only relying on `ImagePicker`.
