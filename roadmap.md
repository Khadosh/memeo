# Roadmap de Memeo

Este documento detalla los próximos pasos y funcionalidades a desarrollar en el proyecto, organizados por prioridad y con su estado actual.

## 1. Historial de memes
**Estado**: ⭕️ Pendiente
- **Objetivo**: Permitir al usuario visualizar los memes que ha generado y guardado previamente.
- **Tareas**:
  - [ ] Crear interfaz (pantalla o tab) para listar los memes generados.
  - [ ] Implementar persistencia: Guardar referencias localmente (AsyncStorage/SQLite) o en la nube (tablas de Supabase + Storage).
  - [ ] Opción para compartir o eliminar memes del historial.

## 2. Historial de caras
**Estado**: ⭕️ Pendiente
- **Objetivo**: Evitar que el usuario tenga que buscar y recortar la misma cara cada vez que genera un meme.
- **Tareas**:
  - [ ] Crear gestor visual ("Mi Galería de Rostros").
  - [ ] Guardar las imágenes de los rostros recortados/procesados en una base de datos o sistema de archivos local.
  - [ ] Sincronizar con la pantalla del `editor.tsx` para permitir elegir de la galería de rostros guardados además de cargar una foto nueva.

## 3. Personalización de prompt por meme
**Estado**: ⭕️ Pendiente
- **Objetivo**: Adaptar la generación y la solicitud de rostros según la plantilla seleccionada (ej: en *Distracted Boyfriend*, poder elegir el rol de "chico del medio" o "chica indignada").
- **Tareas**:
  - [ ] Agregar metadatos avanzados al catálogo de plantillas (`constants/Templates.ts`).
  - [ ] Modificar la interfaz del editor para que lea la configuración de la plantilla y solicite dinámicamente:
    - Textos específicos (ej. Arriba/Abajo vs Personaje 1/Personaje 2).
    - Rostro(s) específicos según los roles del meme.
  - [ ] Ajustar el prompt enviado a la IA (en la Edge Function de Supabase) basándose en qué parte de la imagen se desea modificar.

## 4. Múltiples caras por meme
**Estado**: ⭕️ Pendiente
- **Objetivo**: Permitir el reemplazo y superposición de varias caras en una misma plantilla grupal.
- **Tareas**:
  - [ ] Extender la arquitectura de `editor.tsx` para aceptar un arreglo de rostros en lugar de uno solo.
  - [ ] Interfaz de usuario intuitiva para asignar cada rostro subido/seleccionado a una posición específica o "casilla" del meme.
  - [ ] Modificar la lógica de backend (Supabase Edge Functions / fal.ai) para que el prompt multirrostro procese la imagen correctamente.

## 5. Importar contactos
**Estado**: ⭕️ Pendiente
- **Objetivo**: Facilitar la creación de memes usando fotos de amigos/familiares directamente desde la libreta de contactos del teléfono.
- **Tareas**:
  - [ ] Integrar `expo-contacts` al proyecto y solicitar permisos de lectura (iOS/Android).
  - [ ] UI para buscar y seleccionar un contacto.
  - [ ] Extraer la foto de perfil del contacto (si está disponible) o permitir al usuario asignar una foto "default" desde el Historial de Caras a un contacto específico.
  - [ ] Flujo rápido: "Hacer meme con [Juan]" -> Carga el editor automáticamente con la cara de Juan.

## 6. Monetización
**Estado**: ⭕️ Pendiente
- **Objetivo**: Implementar un modelo de ingresos para la aplicación.
- **Tareas**:
  - [ ] **Opción 1**: Integrar publicidad (ej. AdMob) ofreciendo "Ver video a cambio de generar meme".
  - [ ] **Opción 2**: Implementar suscripción (ej. 1 USD/mes por límite de 100 memes) usando RevenueCat o Stripe.
  - [ ] Lógica de base de datos para contar los memes generados por usuario.

## 7. Optimización de tiempos de Face Swapping
**Estado**: ⭕️ Pendiente
- **Objetivo**: Reducir el tiempo de espera de los usuarios (actualmente hasta 1 minuto).
- **Tareas**:
  - [ ] Mejorar la compresión de imagen previa al envío.
  - [ ] Investigar modelos de generación más rápidos en fal.ai o alternativas.
  - [ ] Mejorar UI/UX de la pantalla de carga para disminuir la percepción de demora.
