import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import { useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "expo-app-loading";
import { useNavigation } from "@react-navigation/native";

import { store } from "./store/redux/store";
import StartingScreen from "./screens/StartingScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SignUpScreen from "./screens/SignUpScreen";
import LoginScreen from "./screens/LoginScreen";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import Icon from "./Components/Icon";
import CustomBackButton from "./Components/CustomBackButton";
import SplashScreen from "./screens/SplashScreen";
import HomeScreen from "./screens/HomeScreen";
import CategoryScreen from "./screens/CategoryScreen";
import ExchangeScreen from "./screens/ExhcangeScreen";
import InboxScreen from "./screens/InboxScreen";
import FavouriteScreen from "./screens/FavouriteScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import CategoryDetailScreen from "./screens/CategoryDetailScreen";
import ChatScreen from "./screens/ChatScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import EditProductDetailScreen from "./screens/EditProductDetailScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import ForgetPasswordScreen from "./screens/ForgetPasswordScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const headerOptions = ({ navigation }) => ({
    headerTitle: "Back",
    headerTitleAlign: "left",
    headerTitleStyle: {
      fontSize: 18,
    },
  });

  const TabStack = () => (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "grey",
        tabBarLabelStyle: {
          marginBottom: 5,
          marginTop: -5,
        },
      }}
    >
      <Tab.Screen
        name="HomeStack"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon icon={focused ? "home" : "home-outline"} />
          ),
        }}
        component={HomeStack}
      />
      <Tab.Screen
        name="Category"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon icon={focused ? "grid" : "grid-outline"} />
          ),
        }}
        component={CategoryStack}
      />
      <Tab.Screen
        name="Exchange"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon icon={focused ? "duplicate" : "duplicate-outline"} />
          ),
        }}
        component={ExchangeStack}
      />
      <Tab.Screen
        name="Inbox"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon
              icon={focused ? "chatbox-ellipses" : "chatbox-ellipses-outline"}
            />
          ),
        }}
        component={InboxStack}
      />
      <Tab.Screen
        name="Profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon icon={focused ? "person" : "person-outline"} />
          ),
        }}
        component={ProfileStack}
      />
    </Tab.Navigator>
  );

  const HomeStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Favourite" component={FavouriteScreen} />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
        options={{
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="ProfileScreen"
        options={{}}
        component={ProfileScreen}
      />
      <Stack.Screen
        name="EditProductDetail"
        options={{}}
        component={EditProductDetailScreen}
      />
    </Stack.Navigator>
  );

  const CategoryStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="CategoryMain"
          component={CategoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CategoryDetail"
          component={CategoryDetailScreen}
          options={{
            headerTitle: "Category",
          }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="UserProfileScreen"
          component={UserProfileScreen}
          options={{
            title: "Profile",
          }}
        />
      </Stack.Navigator>
    );
  };

  const ExchangeStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="ExchangeScreen"
          options={{
            headerShown: false,
          }}
          component={ExchangeScreen}
        />
        <Stack.Screen
          name="ProfileScreen"
          options={{
            headerShown: false,
          }}
          component={ProfileScreen}
        />
      </Stack.Navigator>
    );
  };

  const InboxStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="InboxScreen"
          options={{
            headerShown: false,
          }}
          component={InboxScreen}
        />
        <Stack.Screen
          name="Chat"
          options={{
            headerShown: false,
          }}
          component={ChatScreen}
        />
      </Stack.Navigator>
    );
  };

  const ProfileStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="ProfileScreen"
          options={{
            headerShown: false,
          }}
          component={ProfileScreen}
        />
        <Stack.Screen
          name="EditProfile"
          options={{
            // headerShown: false,
            headerTitleAlign: "center",
          }}
          component={EditProfileScreen}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="EditProductDetail"
          options={{}}
          component={EditProductDetailScreen}
        />
      </Stack.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Provider store={store}>
        <Stack.Navigator>
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="StartingScreen"
            component={StartingScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SignUpScreen"
            component={SignUpScreen}
            options={(props) => headerOptions(props)}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={(props) => headerOptions(props)}
          />
          <Stack.Screen
            name="ForgetPasswordScreen"
            component={ForgetPasswordScreen}
            options={(props) => headerOptions(props)}
          />
          <Stack.Screen
            name="TabStack"
            component={TabStack}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
