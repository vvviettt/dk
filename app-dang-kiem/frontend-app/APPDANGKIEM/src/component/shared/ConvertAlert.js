import {Alert} from "react-native"

export const convertAlert = (title,content) => {
    Alert.alert(title,
        content,
    [
        {
        text: 'OK',
        style: 'cancel',
        },
    ]);
}