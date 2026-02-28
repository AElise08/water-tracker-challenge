# 💧 Water Tracker - React Native Animation Challenge

Este repositório contém uma animação fluida em React Native, focado no comportamento de um *Bottom Sheet / Number Slider* interativo.

## 🎯 Objetivo
Reproduzir a animação de "preenchimento" de líquido controlada por um slider contínuo, priorizando a fluidez e a performance na UI Thread (60fps), com alvo principal no ecossistema **iOS**.

## 🛠 Tecnologias Utilizadas
* **React Native** (via **Expo**)
* **React Native Reanimated (v3)**: Para animações baseadas em física (Springs) e atualizações assíncronas de UI.
* **React Native Gesture Handler**: Para captura precisa do gesto de pan (arraste) sem bloqueio da thread JS.

## 🧠 Decisões Técnicas Principais

1. **Textos em 60FPS (AnimatedTextInput):**
   Para evitar engasgos (stutters) durante a atualização rápida dos números (porcentagem e *oz*), utilizei o componente `TextInput` animado via `useAnimatedProps`. Isso garante que o React não re-renderize a árvore de componentes a cada pixel arrastado, mantendo a contagem fluida e nativa.

2. **Física da Animação (Spring Physics):**
   A altura do líquido não cresce de forma linear. Utilizei `withSpring` atrelado à interpolação do Slider para criar um efeito de inércia, dando a sensação de "peso" ao líquido quando o slider é movido rapidamente.

3. **Gesto Contínuo (Context Saving):**
   O `Gesture.Pan()` foi configurado salvando o `context.value` no `onBegin`. Isso impede que a bolinha do slider "pule" caso o usuário solte o dedo e volte a arrastar a partir do meio da barra.

4. **Design Over-Delivery:**
   Embora o foco fosse apenas a animação, aproveitei o poder do Reanimated para clonar a ideia do design original que usei como inspiração.
   
## 🚀 Como testar
O projeto foi empacotado para rodar perfeitamente no **Expo Go**.
1. Clone o repositório.
2. Rode `npm install`.
3. Rode `npx expo start`.
4. Leia o QR Code com a câmera do iOS usando o app Expo Go.