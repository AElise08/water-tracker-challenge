import React from 'react';
import { StyleSheet, View, Text, Dimensions, TextInput } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate, 
  useAnimatedProps,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const MAX_OZ = 50;
const SLIDER_WIDTH = width - 80; 
const BOTTLE_HEIGHT = 340;

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function App() {
  const translateX = useSharedValue(0);
  const context = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onBegin(() => {
      context.value = translateX.value;
    })
    .onUpdate((event) => {
      let nextValue = context.value + event.translationX;
      translateX.value = Math.max(0, Math.min(nextValue, SLIDER_WIDTH));
    });

  const waterStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(translateX.value, [0, SLIDER_WIDTH], [0, BOTTLE_HEIGHT]),
    };
  });

  const trackFillStyle = useAnimatedStyle(() => {
    return { width: translateX.value };
  });

  const thumbStyle = useAnimatedStyle(() => {
    return { transform: [{ translateX: translateX.value }] };
  });

  const tooltipStyle = useAnimatedStyle(() => {
    return { transform: [{ translateX: translateX.value }] };
  });

  // Props para os números sem travar o app
  const hugeTextProps = useAnimatedProps(() => {
    const oz = Math.floor((translateX.value / SLIDER_WIDTH) * MAX_OZ);
    return { text: `${oz}` };
  });

  const percentProps = useAnimatedProps(() => {
    const percent = Math.floor((translateX.value / SLIDER_WIDTH) * 100);
    return { text: `${percent}%` };
  });

  const tooltipProps = useAnimatedProps(() => {
    const exactOz = ((translateX.value / SLIDER_WIDTH) * MAX_OZ).toFixed(1);
    return { text: `${exactOz}oz` };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        
        <View style={styles.header}>
          <X color="#4B5563" size={28} />
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
              <AnimatedTextInput 
                editable={false} 
                animatedProps={percentProps} 
                style={styles.percentText} 
              />
              <Text style={styles.label}>Completed</Text>
            </View>

            <View style={[styles.statusBlock, { marginTop: 40, marginBottom: 40 }]}>
              <Text style={styles.goalText}>{MAX_OZ}oz</Text>
              <Text style={styles.label}>Goal</Text>
            </View>

            <View style={styles.statusBlock}>
              <AnimatedTextInput 
                editable={false} 
                animatedProps={hugeTextProps} 
                style={styles.hugeText} 
              />
              <Text style={styles.ozLabel}>oz</Text>
              <Text style={[styles.label, { marginTop: 5, fontSize: 11 }]}>Consumed so far</Text>
            </View>
          </View>

        </View>

        {/* BARRA (SLIDER) MELHORADA */}
        <View style={styles.bottomSection}>
          
          <View style={styles.sliderContainer}>
            
            <Animated.View style={[styles.tooltipContainer, tooltipStyle]}>
              <AnimatedTextInput 
                editable={false} 
                animatedProps={tooltipProps} 
                style={styles.tooltipText} 
              />
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

      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A14' },
  header: { marginTop: 60, paddingHorizontal: 20, alignItems: 'flex-end' },
  mainLayout: { flexDirection: 'row', paddingHorizontal: 30, marginTop: 10 },
  
  bottleSection: { alignItems: 'flex-start', width: '45%' },
  bottleCapContainer: { flexDirection: 'row', alignItems: 'flex-end', marginLeft: 15 },
  bottleSpout: { width: 15, height: 35, backgroundColor: '#1E293B', borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  bottleCap: { width: 35, height: 20, backgroundColor: '#1E293B', borderTopRightRadius: 6 },
  bottleBody: {
    width: 140, height: BOTTLE_HEIGHT, backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 2, borderColor: '#1E293B', borderRadius: 16, overflow: 'hidden',
    justifyContent: 'flex-end', marginTop: -2,
  },
  water: { width: '100%', position: 'absolute', bottom: 0 },

  statusSection: { flex: 1, alignItems: 'center', paddingTop: 10 },
  statusBlock: { alignItems: 'center' },
  label: { color: '#6B7280', fontSize: 13, fontWeight: '600' },
  
  // === AQUI ESTÁ A CORREÇÃO DOS NÚMEROS ===
  // Adicionei width fixo e textAlign center para as caixas nunca cortarem o texto
  percentText: { 
    color: '#FFF', fontSize: 36, fontWeight: '800', 
    padding: 0, margin: 0, width: 100, textAlign: 'center' 
  },
  goalText: { color: '#FFF', fontSize: 26, fontWeight: '700' },
  hugeText: { 
    color: '#FFF', fontSize: 90, fontWeight: '900', letterSpacing: -3, 
    height: 100, padding: 0, margin: 0, textAlign: 'center', width: 160 // Largura aumentada para não cortar o 40 ou 50
  },
  ozLabel: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginTop: -20 },

  bottomSection: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center' },
  sliderContainer: { width: SLIDER_WIDTH, height: 80, justifyContent: 'flex-end', marginBottom: 20 },
  
  // Aumentei a largura do balãozinho também para o "50.0oz" caber com folga
  tooltipContainer: { 
    position: 'absolute', top: 0, left: -35, 
    width: 90, height: 35, justifyContent: 'center', alignItems: 'center' 
  },
  tooltipText: { 
    color: '#3B82F6', fontSize: 20, fontWeight: '800', 
    padding: 0, margin: 0, width: '100%', textAlign: 'center' 
  },

  trackHitbox: { height: 40, justifyContent: 'center', width: '100%' },
  trackBackground: { position: 'absolute', width: '100%', height: 8, backgroundColor: '#1E293B', borderRadius: 4 },
  trackFill: { position: 'absolute', height: 8, backgroundColor: '#3B82F6', borderRadius: 4 },
  thumb: {
    position: 'absolute', left: -14, width: 28, height: 28,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 4, elevation: 5
  },
  thumbInner: { width: 28, height: 28, backgroundColor: '#FFF', borderRadius: 14 },

  instructionText: { color: '#6B7280', fontSize: 14, marginBottom: 20 },
  addButton: { backgroundColor: '#3B82F6', width: '85%', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: '#FFF', fontSize: 18, fontWeight: '700' }
});