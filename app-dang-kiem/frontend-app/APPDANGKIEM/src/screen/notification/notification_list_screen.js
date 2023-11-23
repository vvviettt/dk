import { StyleSheet, View,ScrollView } from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import NotificationBox from '../../component/shared/NotificationBox'
import {useSelector} from 'react-redux'
import NotificationService from '../../services/api/notification/NotificationService'
import Loading from '../../component/shared/Loading'
import {convertAlert} from '../../component/shared/ConvertAlert'
import CheckNullData from '../../component/shared/CheckNullData'

const NotificationListScreen = ({navigation}) => {
    const {token,haveNotification} = useSelector(state => state.auth)
    const [isLoading,setIsLoading] = React.useState(true)
    const [isLoadMore,setIsLoadMore] = React.useState(false);
    const [page,setPage] = React.useState()
    const [total,setTotal] = React.useState()
    const [listNoti,setListNoti] = React.useState({})
    const loadmore = ()=>{
        if(total == 10){
            setIsLoadMore(true);
            NotificationService.get_notifications({limit:10,page:page})
            .then((res) =>{
                if (res.status==1){
                    setPage(page+1);
                    setTotal(res.data.recordsTotal)
                    setListNoti([...listNoti,...res.data.rows])
                    setIsLoadMore(false);
                }else throw new Error(res.message)
            })
            .catch((err) =>{
                convertAlert('Thông báo',err.message);
                setIsLoading(false);
                // NavigationService.reset('Auth');
            })
        }
    
    }
    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        return layoutMeasurement.height + contentOffset.y +20 >= contentSize.height;
    }; 
    React.useEffect(() =>{
        if(token){
            setIsLoading(true);
            NotificationService.get_notifications({})
            .then((res) =>{
                if (res.status==1){
                    setPage(2);
                    setTotal(res.data.recordsTotal)
                    setListNoti(res.data.rows)
                    setIsLoading(false);
                }else throw new Error(res.message)
            })
            .catch((err) =>{
                convertAlert('Thông báo',err.message);
                setIsLoading(false);
                // NavigationService.reset('Auth');
            })
        }
    },[haveNotification])
    return (
        <View style={{flex:1,backgroundColor:'#FFFFFF'}}>
            <Header showBtnGoback={false} title='Thông báo'/>
            <ScrollView
                onScroll={({nativeEvent}) => {
                    if (isCloseToBottom(nativeEvent)) {
                        loadmore();
                    }
                }}
                onScrollAnimationEnd={loadmore}
            >
                {
                    isLoading == true ? 
                    (
                        <Loading />
                    ):(
                        <>
                            <CheckNullData data={listNoti}>
                                {
                                    listNoti?.map((e,index)=>
                                        <NotificationBox
                                            key={index}
                                            data={e}
                                            onPress={()=>{
                                                if (e.type == 1) navigation.navigate('Notification/Deadline',{notiId:e.id})
                                                if (e.type == 2) navigation.navigate('Notification/Registry',{notiId:e.id})
                                                if (e.type == 3) {}
                                                if (e.type == 4) navigation.navigate('Notification/Infringes',{notiId:e.id})
                                                if (e.type == 6 || e.type == 7 ) navigation.navigate('Notification/Status',{notiId:e.id})
                                            }}
                                        />
                                    )
                                }
                            </CheckNullData>
                            {
                                isLoadMore? 
                                    <Loading/>:
                                <></>
                            }
                        </>
                    )
                }
            </ScrollView>
        </View>
    )
}

export default NotificationListScreen

const styles = StyleSheet.create({})