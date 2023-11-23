import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as ModalProvider} from 'react-native-paper';
import { Provider } from 'react-redux';
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import IndexNavigation from "./src/navigation/IndexNavigation";
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './src/store';
import { ToastProvider } from 'react-native-toast-notifications'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React,{useCallback, useEffect, useState} from 'react';
import * as Clipboard from 'expo-clipboard';
import NavigationService from './src/services/NavigationService';
import {convertAlert} from './src/component/shared/ConvertAlert';



Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


export default function App() {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const _loadResourcesAsync = async () => {
    return await Font.loadAsync({
      BeVietnamProLight: require("./src/assets/fonts/BeVietnamPro-Light.ttf"),
      BeVietnamProBold: require("./src/assets/fonts/BeVietnamPro-Bold.ttf"),
      BeVietnamProMedium: require("./src/assets/fonts/BeVietnamPro-Medium.ttf"),
      BeVietnamProRegular: require("./src/assets/fonts/BeVietnamPro-Regular.ttf"),
      BeVietnamProSemiBold: require("./src/assets/fonts/BeVietnamPro-SemiBold.ttf"),
      iCielSamsungSharpSansBold_SMCPS: require("./src/assets/fonts/iCiel-SamsungSharpSans-Bold_SMCPS.ttf"),
      RobotoBold: require("./src/assets/fonts/Roboto-Bold.ttf"),
    });
  };

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await _loadResourcesAsync();
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsLoadingComplete(true);
      }
    }

    prepare();
  }, []);

  
  const [expoPushToken, setExpoPushToken] = React.useState('');
  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification.request.content.data);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const detail= response.notification.request.content.data.detail
      if (detail.type == 5){
        NavigationService.navigate('NotificationDetailOne',{notiId:detail.notiId})
      }
      if (detail.type == 8){
        NavigationService.navigate('NotificationDetailTwo',{notiId:detail.notiId})
      }
      if (detail.type == 9){
        NavigationService.navigate('AssigmentNotificationScreen',{notiId:detail.notiId})
      }
      if (detail.type == 10){
        NavigationService.navigate('ChangeAssigmentNotificationScreen',{notiId:detail.notiId})
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        convertAlert('Thông báo',"Vui lòng cho phép thông báo trong phần cài đặt để nhận được những thông báo mới nhất từ ứng dụng!");
        await AsyncStorage.setItem('push_token',"null token")
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      await AsyncStorage.setItem('push_token',token)
    }else {
      alert('Thông báo','Phải là điện thoại thật thì mới gửi được thông báo');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }


  const onLayoutRootView = useCallback(async () => {
    if (isLoadingComplete) {
      await SplashScreen.hideAsync();
    }
  }, [isLoadingComplete]);

  if (!isLoadingComplete) {
    return null;
  }
  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ModalProvider>
            <ToastProvider
                renderType={{
                  custom_type: (toast) => (
                    <>
                      {
                        toast.message
                      }
                    </>
                  )
                }}
                placement="top"
                offsetTop={30}
              >
              <IndexNavigation/>
            </ToastProvider>
          </ModalProvider>
        </PersistGate>
      </Provider>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
