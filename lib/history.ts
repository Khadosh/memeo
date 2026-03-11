import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const HISTORY_STORAGE_KEY = '@memeo_history';

export interface MemeHistoryItem {
  id: string;
  localUri: string;
  templateId: string;
  dateStr: string;
}

/**
 * Saves a generated meme (already captured locally via view-shot) to the history.
 * @param localSnapshotUri The local URI of the captured image
 * @param templateId The ID of the template used
 */
export async function saveMemeToHistory(localSnapshotUri: string, templateId: string): Promise<void> {
  try {
    // 1. Copy image to a permanent location in the document directory
    const filename = `meme_${Date.now()}.jpg`;
    const documentDirectory = (FileSystem as any).documentDirectory;
    const permanentUri = `${documentDirectory}${filename}`;
    
    await FileSystem.copyAsync({
      from: localSnapshotUri,
      to: permanentUri
    });

    // 2. Create history item
    const newItem: MemeHistoryItem = {
      id: Date.now().toString(),
      localUri: permanentUri,
      templateId,
      dateStr: new Date().toISOString(),
    };

    // 3. Fetch existing history
    const existingHistoryStr = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    const existingHistory: MemeHistoryItem[] = existingHistoryStr ? JSON.parse(existingHistoryStr) : [];

    // 4. Prepend new item and save
    const updatedHistory = [newItem, ...existingHistory];
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));

    console.log(`[History] Saved meme ${newItem.id} to history.`);
  } catch (error) {
    console.error('[History] Error saving meme to history:', error);
  }
}

/**
 * Retrieves the user's generated memes from AsyncStorage.
 */
export async function getMemeHistory(): Promise<MemeHistoryItem[]> {
  try {
    const historyStr = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    if (!historyStr) return [];
    return JSON.parse(historyStr) as MemeHistoryItem[];
  } catch (error) {
    console.error('[History] Error reading history:', error);
    return [];
  }
}

/**
 * Deletes a meme from both the file system and AsyncStorage.
 */
export async function deleteMemeFromHistory(id: string): Promise<void> {
  try {
    const history = await getMemeHistory();
    const itemToDelete = history.find(item => item.id === id);

    if (!itemToDelete) return;

    // 1. Delete the physical file
    await FileSystem.deleteAsync(itemToDelete.localUri, { idempotent: true });

    // 2. Remove from history array and save
    const updatedHistory = history.filter(item => item.id !== id);
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    
    console.log(`[History] Deleted meme ${id} from history.`);
  } catch (error) {
    console.error(`[History] Error deleting meme ${id}:`, error);
  }
}
