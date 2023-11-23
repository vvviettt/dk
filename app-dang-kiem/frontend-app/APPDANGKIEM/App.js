import { StyleSheet, Text, View,Alert,AppRegistry } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import IndexNavigation from "./src/navigation/IndexNavigation";
import { Provider } from 'react-redux';
import { persistor, store } from './src/store';
import { PersistGate } from 'redux-persist/integration/react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastProvider } from 'react-native-toast-notifications'
import { Provider as ModalProvider} from 'react-native-paper';

//
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {setHeaderConfigAxios} from "./src/services/https/apiConfig";
import NavigationService from "./src/services/NavigationService";
import {convertAlert} from "./src/component/shared/ConvertAlert";
import {registerRootComponent} from "expo";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

AppRegistry.registerComponent('main', () => App);
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
    const setHeader = async ()=>{
      let access_token = await AsyncStorage.getItem("access_token");
      setHeaderConfigAxios(access_token);
    }

    prepare();
    setHeader();
  }, []);

  
  const [expoPushToken, setExpoPushToken] = React.useState('');
  const notificationListener = React.useRef();
  const responseListener = React.useRef();
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    // This listener is fired whenever a notification is received while the app is foregrounded
        // notificationListener.current = Notifications.addNotificationReceivedListener(notification  => {
        //   dispatch(uploadNotification())
        // });
    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const detail= response.notification.request.content.data.detail
      console.log(detail);
      if (detail){
        if (detail.type == 1){
          NavigationService.navigate('Notification/Deadline',{notiId:detail.notiId})
        }
        if (detail.type == 2){
          NavigationService.navigate('Notification/Registry',{notiId:detail.notiId})
        }
        // if (detail.type == 3){
        //   NavigationService.navigate('NotificationDetailTwo',{notiId:detail.notiId})
        // }
        if (detail.type == 4){
          NavigationService.navigate('Notification/Infringes',{notiId:detail.notiId})
        }
        if (detail.type == 6 || detail.type == 7 ) {
          NavigationService.navigate('Notification/Status',{notiId:detail.notiId})
        }
      }
    });
    return () => {
      Notifications.removeNotificationSubscription(responseListener.current);
      Notifications.removeNotificationSubscription(notificationListener.current);
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
        convertAlert('Thông báo',"Vui lòng cho phép thông báo trong phần cài đặt để nhận được những thông báo mới nhất từ SMARTEST!");
        await AsyncStorage.setItem('push_token',"Null token")
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      await AsyncStorage.setItem('push_token',token)
      console.log(token);
    } else {
      convertAlert('Thông báo','Phải là điện thoại thật thì mới gửi được thông báo');
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
  },
});
