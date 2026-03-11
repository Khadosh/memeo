import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export function HeaderMenu() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const handleNavigation = (path: any) => {
    setVisible(false);
    router.push(path);
  };

  return (
    <>
      <TouchableOpacity style={styles.menuButton} onPress={() => setVisible(true)}>
        <Ionicons name="menu" size={28} color="#00FF88" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuContainer}>
                <View style={styles.menuHeader}>
                  <Text style={styles.menuTitle}>Menú</Text>
                  <TouchableOpacity onPress={() => setVisible(false)}>
                    <Ionicons name="close" size={24} color="#888" />
                  </TouchableOpacity>
                </View>

                {/* Historial de Memes */}
                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('/history')}>
                  <Ionicons name="time-outline" size={22} color="#FFF" style={styles.menuIcon} />
                  <Text style={styles.menuItemText}>Mi Historial de Memes</Text>
                </TouchableOpacity>

                {/* Futuros Opciones (Roadmap) */}
                <TouchableOpacity style={styles.menuItem} onPress={() => { setVisible(false); alert('Estará disponible pronto, es parte de nuestro roadmap.'); }}>
                  <Ionicons name="people-outline" size={22} color="#FFF" style={styles.menuIcon} />
                  <Text style={styles.menuItemText}>Historial de Rostros</Text>
                  <View style={styles.badge}><Text style={styles.badgeText}>Pronto</Text></View>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.menuItem} onPress={() => { setVisible(false); alert('Estará disponible pronto, es parte de nuestro roadmap.'); }}>
                  <Ionicons name="person-add-outline" size={22} color="#FFF" style={styles.menuIcon} />
                  <Text style={styles.menuItemText}>Importar Contactos</Text>
                  <View style={styles.badge}><Text style={styles.badgeText}>Pronto</Text></View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => { setVisible(false); alert('Estará disponible pronto, es parte de nuestro roadmap.'); }}>
                  <Ionicons name="star-outline" size={22} color="#FFF" style={styles.menuIcon} />
                  <Text style={styles.menuItemText}>Memeo Premium</Text>
                  <View style={styles.badge}><Text style={styles.badgeText}>Pronto</Text></View>
                </TouchableOpacity>

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#1A1A1A',
    width: 250,
    marginTop: 60,
    marginRight: 20,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
    flex: 1,
  },
  badge: {
    backgroundColor: '#333',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    color: '#00FF88',
    fontSize: 10,
    fontWeight: 'bold',
  }
});
