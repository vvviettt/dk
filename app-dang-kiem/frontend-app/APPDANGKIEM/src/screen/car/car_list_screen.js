import { StyleSheet, Text, View ,ScrollView} from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import {Font} from '../../assets/styles/Index'
import CarInformationBox from '../../component/shared/CarInformationBox'
import Footer from '../../component/layout/Footer'
import CarService from '../../services/api/car/CarService'
import {useSelector} from 'react-redux'
import Loading from '../../component/shared/Loading'
import {convertAlert} from '../../component/shared/ConvertAlert'
import CheckNullData from '../../component/shared/CheckNullData'


const CarListScreen = ({
    navigation
}) => {
    const [data,setData] = React.useState()
    const [isLoading,setIsLoading] = React.useState(true)
    const {token} = useSelector(state => state.auth)
    React.useEffect(() =>{
        if(token){
            setIsLoading(true);
            CarService.get_list_cus_car({})
            .then((res) =>{
                if (res.status==1){
                    setData(res.data)
                    setIsLoading(false);
                }
            })
            .catch((err) =>{
                convertAlert('Thông báo',err.message);
                setIsLoading(false);
            })
        }
    },[token])

    return (
        <View style={{flex:1}}>
            <Header onGoBack={()=>navigation.pop()} title='danh sách xe của bạn'/>
            {
                isLoading == true ?
                (
                    <Loading />
                ):
                (
                    <>
                        <ScrollView style={styles.scroll_view}>
                            <CheckNullData data={data}>
                                <Text style={styles.recordsTotal}>bạn có {data?.recordsTotal} xe</Text>
                                {
                                    data?.rows.map((car,index)=>(
                                        <CarInformationBox 
                                            data={car} 
                                            key={car.id} 
                                            style={styles.box_style}
                                            onPress={()=>navigation.navigate('Car/Detail',{carId:car.id})}
                                            carIndex={index}
                                        />
                                    ))
                                }
                            </CheckNullData>
                        </ScrollView>
                        <Footer 
                            buttonOkContent={'Thêm thông tin xe'}
                            onClickButtonOk={()=>navigation.navigate('Car/Add')}
                            disabled={false}
                        />
                    </>
                )
            }
        </View>
    )
}

export default CarListScreen

const styles = StyleSheet.create({
    scroll_view:{
        width:'100%',
        flex:1,
        paddingHorizontal:15,
        backgroundColor:'#eef2ff',
        paddingBottom:20
    },
    box_style:{
        marginTop:10
    },
    group:{
        marginTop:20
    },
    recordsTotal:{
        fontFamily:Font.BeVietnamProBold,
        fontWeight:'700',
        fontSize:12,
        lineHeight:18,
        color:'#394B6A',
        textTransform:'uppercase',
        marginTop:20
    },
    footer:{
        height:76,
        width:'100%',
        backgroundColor:'#eef2ff',
        paddingTop:8,
        paddingHorizontal:15,
    },
    footer_btn:{
        width:'100%',
        height:44,
        borderRadius:6,
        backgroundColor:'#0F6AA9',
        alignItems:'center',
        justifyContent:'center'
    },
    footer_text:{
        fontFamily:Font.BeVietnamProBold,
        fontSize:13,
        lineHeight:22,
        color:'#FFFFFF',
        textTransform:'uppercase'
    }
})