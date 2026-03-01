import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions, TextInput, Pressable, ScrollView } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate, 
  useAnimatedProps,
  withTiming, 
  Easing,     
  runOnJS
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Activity, Flame, Footprints, Droplets } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const MAX_OZ = 50;
const SLIDER_WIDTH = width - 80; 
const BOTTLE_HEIGHT = 340;

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const isModalOpen = useSharedValue(0);

  // === CONTROLE DA ANIMAÇÃO ===
  const toggleModal = (open) => {
    if (open) {
      setModalVisible(true);
      isModalOpen.value = withTiming(1, { 
        duration: 350, 
        easing: Easing.out(Easing.poly(4)) 
      });
    } else {
      isModalOpen.value = withTiming(0, { 
        duration: 300, 
        easing: Easing.in(Easing.poly(4)) 
      }, () => {
        runOnJS(setModalVisible)(false);
      });
    }
  };

  // === O SEGREDO: NASCENDO DO CANTO SUPERIOR DIREITO ===
  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: isModalOpen.value,
      transform: [
        // Vem do canto direito (width / 2.5) para o centro (0)
        { translateX: interpolate(isModalOpen.value, [0, 1], [width / 2.5, 0]) },
        // Vem do topo (-height / 2.5) e desce para o centro (0)
        { translateY: interpolate(isModalOpen.value, [0, 1], [-height / 2.5, 0]) },
        // Começa bem pequeno (0.1) e expande (1)
        { scale: interpolate(isModalOpen.value, [0, 1], [0.1, 1]) }
      ],
      // Começa como uma "bolinha" e vira o modal de tela cheia
      borderRadius: interpolate(isModalOpen.value, [0, 1], [200, 0])
    };
  });

  // === LÓGICA DO SLIDER E DA ÁGUA ===
  const translateX = useSharedValue(0);
  const context = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onBegin(() => { context.value = translateX.value; })
    .onUpdate((event) => {
      let nextValue = context.value + event.translationX;
      translateX.value = Math.max(0, Math.min(nextValue, SLIDER_WIDTH));
    });

  const waterStyle = useAnimatedStyle(() => ({ height: interpolate(translateX.value, [0, SLIDER_WIDTH], [0, BOTTLE_HEIGHT]) }));
  const trackFillStyle = useAnimatedStyle(() => ({ width: translateX.value }));
  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));
  const tooltipStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));

  const hugeTextProps = useAnimatedProps(() => ({ text: `${Math.floor((translateX.value / SLIDER_WIDTH) * MAX_OZ)}` }));
  const percentProps = useAnimatedProps(() => ({ text: `${Math.floor((translateX.value / SLIDER_WIDTH) * 100)}%` }));
  const tooltipProps = useAnimatedProps(() => ({ text: `${((translateX.value / SLIDER_WIDTH) * MAX_OZ).toFixed(1)}oz` }));

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#09090E' }}>
      
      {/* === DASHBOARD INICIAL === */}
      <ScrollView style={styles.dashboard} contentContainerStyle={{ paddingBottom: 100 }}>
        
        <View style={styles.dashHeader}>
          <View>
            <Text style={styles.greeting}>Dashboard</Text>
            <Text style={styles.userName}>Welcome, Guido</Text>
          </View>
          
          {/* === AQUI ESTÁ: BOTÃO NO CANTO SUPERIOR DIREITO === */}
          <Pressable onPress={() => toggleModal(true)} style={styles.topRightBtn}>
            <Droplets color="#3B82F6" size={24} />
          </Pressable>
        </View>

        {/* Grid de Cards (Apenas enfeite para a tela não ficar vazia) */}
        <View style={styles.grid}>
          <View style={[styles.card, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
            <Flame color="#EF4444" size={28} />
            <Text style={styles.cardValue}>450</Text>
            <Text style={styles.cardLabel}>Kcal</Text>
          </View>
          <View style={[styles.card, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
            <Footprints color="#10B981" size={28} />
            <Text style={styles.cardValue}>6k</Text>
            <Text style={styles.cardLabel}>Steps</Text>
          </View>
          <View style={[styles.card, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
            <Activity color="#F59E0B" size={28} />
            <Text style={styles.cardValue}>45</Text>
            <Text style={styles.cardLabel}>Active Min</Text>
          </View>
        </View>
        
        <View style={{ marginTop: 40, alignItems: 'center', opacity: 0.2 }}>
            <Activity color="#FFF" size={100} />
            <Text style={{ color: '#FFF', marginTop: 20 }}>Tap the blue drop on top right</Text>
        </View>

      </ScrollView>


      {/* === MODAL DA GARRAFA === */}
      {modalVisible && (
        <Animated.View style={[styles.modalOverlay, overlayStyle]}>
          <LinearGradient colors={['#0A0A14', '#0A0A14']} style={StyleSheet.absoluteFillObject} />

          <View style={styles.header}>
            {/* Botão de Fechar */}
            <Pressable onPress={() => toggleModal(false)} hitSlop={20}>
              <X color="#4B5563" size={28} />
            </Pressable>
          </View>

          <View style={styles.mainLayout}>
            <View style={styles.bottleSection}>
              <View style={styles.bottleCapContainer}>
                 <View style={styles.bottleSpout} />
                 <View style={styles.bottleCap} />
              </View>
              <View style={styles.bottleBody}>
                <Animated.View style={[styles.water, waterStyle]}>
                  <LinearGradient colors={['#3B82F6', '#2563EB']} style={{ flex: 1 }} />
                </Animated.View>
              </View>
            </View>

            <View style={styles.statusSection}>
              <View style={styles.statusBlock}>
                <AnimatedTextInput editable={false} animatedProps={percentProps} style={styles.percentText} />
                <Text style={styles.label}>Completed</Text>
              </View>
              <View style={[styles.statusBlock, { marginTop: 40, marginBottom: 40 }]}>
                <Text style={styles.goalText}>{MAX_OZ}oz</Text>
                <Text style={styles.label}>Goal</Text>
              </View>
              <View style={styles.statusBlock}>
                <AnimatedTextInput editable={false} animatedProps={hugeTextProps} style={styles.hugeText} />
                <Text style={styles.ozLabel}>oz</Text>
                <Text style={[styles.label, { marginTop: 5, fontSize: 11 }]}>Consumed so far</Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.sliderContainer}>
              <Animated.View style={[styles.tooltipContainer, tooltipStyle]}>
                <AnimatedTextInput editable={false} animatedProps={tooltipProps} style={styles.tooltipText} />
              </Animated.View>
              <GestureDetector gesture={gesture}>
                <View style={styles.trackHitbox}>
                  <View style={styles.trackBackground} />
                  <Animated.View style={[styles.trackFill, trackFillStyle]} />
                  <Animated.View style={[styles.thumb, thumbStyle]}>
                    <View style={styles.thumbInner} />
                  </Animated.View>
                </View>
              </GestureDetector>
            </View>
            <Text style={styles.instructionText}>Drank some water? Tap to add it.</Text>
            <View style={styles.addButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </View>
          </View>

        </Animated.View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  // === DASHBOARD ESTILOS ===
  dashboard: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  dashHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 },
  greeting: { color: '#888', fontSize: 16 },
  userName: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  
  // O botão no canto superior direito
  topRightBtn: { 
    width: 54, height: 54, 
    backgroundColor: 'rgba(59, 130, 246, 0.15)', // Azul clarinho transparente
    borderRadius: 27, 
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.3)'
  },
  
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  card: { width: '30%', height: 120, borderRadius: 20, padding: 15, justifyContent: 'space-between' },
  cardValue: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  cardLabel: { color: '#888', fontSize: 12, fontWeight: '600' },

  // === MODAL ESTILOS ===
  modalOverlay: { ...StyleSheet.absoluteFillObject, overflow: 'hidden', zIndex: 100 },
  header: { marginTop: 60, paddingHorizontal: 20, alignItems: 'flex-end' },
  mainLayout: { flexDirection: 'row', paddingHorizontal: 30, marginTop: 10 },
  
  bottleSection: { alignItems: 'flex-start', width: '45%' },
  bottleCapContainer: { flexDirection: 'row', alignItems: 'flex-end', marginLeft: 15 },
  bottleSpout: { width: 15, height: 35, backgroundColor: '#1E293B', borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  bottleCap: { width: 35, height: 20, backgroundColor: '#1E293B', borderTopRightRadius: 6 },
  bottleBody: { width: 140, height: BOTTLE_HEIGHT, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 2, borderColor: '#1E293B', borderRadius: 16, overflow: 'hidden', justifyContent: 'flex-end', marginTop: -2 },
  water: { width: '100%', position: 'absolute', bottom: 0 },

  statusSection: { flex: 1, alignItems: 'center', paddingTop: 10 },
  statusBlock: { alignItems: 'center' },
  label: { color: '#6B7280', fontSize: 13, fontWeight: '600' },
  
  percentText: { color: '#FFF', fontSize: 36, fontWeight: '800', padding: 0, margin: 0, width: 100, textAlign: 'center' },
  goalText: { color: '#FFF', fontSize: 26, fontWeight: '700' },
  hugeText: { color: '#FFF', fontSize: 90, fontWeight: '900', letterSpacing: -3, height: 100, padding: 0, margin: 0, textAlign: 'center', width: 160 },
  ozLabel: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginTop: -20 },

  bottomSection: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center' },
  sliderContainer: { width: SLIDER_WIDTH, height: 80, justifyContent: 'flex-end', marginBottom: 20 },
  tooltipContainer: { position: 'absolute', top: 0, left: -35, width: 90, height: 35, justifyContent: 'center', alignItems: 'center' },
  tooltipText: { color: '#3B82F6', fontSize: 20, fontWeight: '800', padding: 0, margin: 0, width: '100%', textAlign: 'center' },

  trackHitbox: { height: 40, justifyContent: 'center', width: '100%' },
  trackBackground: { position: 'absolute', width: '100%', height: 8, backgroundColor: '#1E293B', borderRadius: 4 },
  trackFill: { position: 'absolute', height: 8, backgroundColor: '#3B82F6', borderRadius: 4 },
  thumb: { position: 'absolute', left: -14, width: 28, height: 28, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 4, elevation: 5 },
  thumbInner: { width: 28, height: 28, backgroundColor: '#FFF', borderRadius: 14 },

  instructionText: { color: '#6B7280', fontSize: 14, marginBottom: 20 },
  addButton: { backgroundColor: '#3B82F6', width: '85%', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: '#FFF', fontSize: 18, fontWeight: '700' }
});
