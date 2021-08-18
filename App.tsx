import React from 'react'
import { useWindowDimensions, View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Globe } from './Globe'

const Drawer = createDrawerNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        openByDefault={true}
        drawerContent={() => (
          <View
            style={{
              flex: 1,
              paddingVertical: 48,
              paddingHorizontal: 18,
              backgroundColor: 'green',
            }}
          >
            <Text style={{ fontSize: 50, color: 'red' }}> drawer </Text>
          </View>
        )}
        edgeWidth={0}
        drawerStyle={{ width: useWindowDimensions().width - 96 }}
        screenOptions={{ unmountOnBlur: true }}
      >
        <Drawer.Screen name="Main" component={Globe} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}
