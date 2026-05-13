import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import PizzaListScreen from './src/screens/PizzaListScreen';
import PizzaFormScreen from './src/screens/PizzaFormScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="List"
          screenOptions={{
            headerStyle: { backgroundColor: '#1a1a24' },
            headerTintColor: '#ff6b35',
            headerTitleStyle: { fontWeight: 'bold' },
            contentStyle: { backgroundColor: '#0f0f13' },
            animation: 'slide_from_right'
          }}
        >
          <Stack.Screen 
            name="List" 
            component={PizzaListScreen} 
            options={{ title: 'Меню', headerShown: false }}
          />
          <Stack.Screen 
            name="Form" 
            component={PizzaFormScreen} 
            options={{ title: 'Редактор піци' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
