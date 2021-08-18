import { createDrawerNavigator } from '@react-navigation/drawer'
import React from 'react'
import { useWindowDimensions, View, Text } from 'react-native'
import { Globe } from './Globe'

const Drawer = createDrawerNavigator()
const drawerMarginRight = 96
export const Navigation = () => (
  <Drawer.Navigator
    openByDefault={true}
    drawerContent={(props) => (
      <View
        style={{ flex: 1, paddingVertical: 48, paddingHorizontal: 18, backgroundColor: 'green' }}
      >
        <Text style={{ fontSize: 50, color: 'red' }}> ok </Text>
      </View>
    )}
    edgeWidth={0}
    drawerStyle={{
      width: useWindowDimensions().width - drawerMarginRight,
    }}
    screenOptions={{
      unmountOnBlur: true,
    }}
  >
    <Drawer.Screen name="Main" component={Globe} />
  </Drawer.Navigator>
)
