import { StyleSheet, Text, View,ScrollView } from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import {Font} from '../../assets/styles/Index'
import ErrorContent from '../../component/shared/ErrorContent'
import CarService from '../../services/api/car/CarService'
import Loading from '../../component/shared/Loading'
import {reConvertLicensePlate} from '../../services/utils/index'
import {convertAlert} from '../../component/shared/ConvertAlert'
import CheckNullData from '../../component/shared/CheckNullData'

const InfringesDetailScreen = ({navigation,route}) => {
    const {search} = route.params
    const [searchText,setSearchText] = React.useState(reConvertLicensePlate(search))
    const [data,setData] = React.useState()
    const [isLoading,setIsLoading] = React.useState(true)
    React.useEffect(() =>{
        if(search){
            setIsLoading(true);
            CarService.get_err_by_licensePlate({licensePlate:searchText})
            .then((res) =>{
                setData(res.data)
                setIsLoading(false);
            })
            .catch((err) =>{
                convertAlert('Thông báo',err.message);
                setIsLoading(false);
            })
        }
    },[search])

    return (
        <View style={{flex:1}}>
            <Header onGoBack={()=>navigation.goBack()} title={'Tra cứu lỗi - '+searchText}/>
            {
                isLoading == true ?
                (
                    <Loading />
                ):(
                    <View style={styles.page_content}>
                        <View style={styles.car_infor}>
                            <View style={styles.car_infor_left}>
                                <Text style={styles.car_infor_title}>Biển kiểm soát</Text>
                                <Text style={styles.license_plates_style}>{search}</Text>
                            </View>
                            <View style={styles.car_infor_right}>
                                <Text style={styles.car_infor_title}>Số lỗi</Text>
                                <Text style={styles.number_error}>{data?.recordsTotal}</Text>
                            </View>
                        </View>
                        <ScrollView style={styles.scroll_view}>
                            <CheckNullData data={data}>
                                {
                                    data?.rows.map(e=>(
                                        <ErrorContent data={e} key={e.id}/>
                                    ))
                                }
                            </CheckNullData>
                        </ScrollView>
                    </View>
                )
            }
        </View>
    )
}

export default InfringesDetailScreen

const styles = StyleSheet.create({
    page_content:{
        width:'100%',
        flex:1,
    },
    car_infor:{
        width:'100%',
        paddingHorizontal:15,
        paddingVertical:20,
        backgroundColor:'#F7FAFF',
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:5,
        borderStyle:'solid',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    car_infor_left:{
        alignItems:'flex-start',
        width:'70%'
    },
    car_infor_right:{
        alignItems:'flex-end',
        width:'30%'
    },
    car_infor_title:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:12,
        lineHeight:18,
        fontWeight:'400',
        textTransform:'uppercase',
        color:'#394B6A'
    },
    license_plates_style:{
        fontFamily:Font.BeVietnamProSemiBold,
        fontSize:16,
        lineHeight:24,
        fontWeight:'600',
        textTransform:'uppercase',
        color:'#394B6A',
    },
    number_error:{
        fontFamily:Font.BeVietnamProBold,
        fontSize:16,
        lineHeight:24,
        fontWeight:'700',
        textTransform:'uppercase',
        color:'#BF0000',
    },
    scroll_view:{
        flex:1,
        backgroundColor:'#FFFFFF',
    }
})