Error building a project with expo-gl, on EAS

Local steps to reproduce:

    expo init --npm --yes
    expo install expo-gl expo-three react-native-unimodules # not sure if all three are needed
    $EDITOR App.js # import and instantiate <GLView />, not sure if needed
    npm run build # eas build --platform android --profile release
