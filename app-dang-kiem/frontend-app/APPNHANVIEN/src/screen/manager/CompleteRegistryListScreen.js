import { StyleSheet, Text, View, Image,TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import DateTimePicker from '../../component/shared/DateTimePicker'
import moment from 'moment';
import {formatDate} from '../../services/utils';
import {Font} from '../../assets/styles/Index';
import {useSelector} from 'react-redux';
import Loading from '../../component/shared/Loading';
import {convertAlert} from '../../component/shared/ConvertAlert';
import ManagerService from '../../services/api/manager/ManagerService';
import RegisForRegistrationBox from '../../component/shared/RegisForRegistrationBox';
import {Searchbar} from 'react-native-paper';
import NavigationService from '../../services/NavigationService';
import CheckNullData from '../../component/shared/CheckNullData';

const CompleteRegistryListScreen = ({navigation,route}) => {
    const datedemo = new Date()
    const now = moment(datedemo).format('YYYY-MM-DD')
    const {token} = useSelector(state => state.auth)
    const {day} = route.params 
    const [showCalender,setShowCalender] = React.useState(false)
    const [date,setDate] = React.useState(day ? day : now)
    const [isLoading,setIsLoading] = React.useState(true)
    const [data,setData] = React.useState()
    const [filteredDataSource,setFilteredDataSource] = React.useState()
    const [text,setText] = React.useState('')

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text != '') {
            const newData = data.filter(function (item) {
                const itemName = item.owner_name
                ? item.owner_name.toUpperCase()
                : ''.toUpperCase();
                const itemData = item.license_plate
                ? item.license_plate.toUpperCase()
                : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1 || itemName.indexOf(textData) > -1 ;
            });
            setFilteredDataSource(newData);
            setText(text);
        } else {
          // Inserted text is blank
          // Update FilteredDataSource with masterDataSource
          setFilteredDataSource(data);
          setText(text);
        }
    };


    React.useEffect(()=>{
        if (token){
            setIsLoading(true)
            ManagerService.get_register_list_type(2,date)
            .then((res) =>{
                if (res.status==1){
                    setData(res.data.registries)
                    setFilteredDataSource(res.data.registries)
                    setIsLoading(false);
                }else{
                    throw new Error(res.message)
                }
            })
            .catch((err) =>{
                convertAlert('Thông báo',err.message);
                setIsLoading(false);
            })
        }
        return () => {}
    },[date])
    return (
        <View style={{flex:1 ,backgroundColor:'#FFFFFF'}}>
            <Header onGoBack={()=>navigation.goBack()} title="DS Đã hoàn thành" />
            <View style={{flex:1}}>
                <TouchableOpacity onPress={()=>setShowCalender(true)} style={styles.calender}>
                    <Image
                        source={require('../../assets/icons/CalenderIcon.png')}
                        style={{
                            width:14,
                            height:14,
                        }}
                    />
                    <Text style={styles.calender_title}>{formatDate(date)}</Text>
                </TouchableOpacity>
                <Searchbar
                    placeholder="Nhập biển số xe/chủ xe"
                    onChangeText={searchFilterFunction}
                    value={text}
                />
                <ScrollView style={styles.scrollView}>
                    {
                        isLoading ? (
                            <Loading />
                        ):(
                            <CheckNullData data={filteredDataSource}>
                                {
                                    filteredDataSource?.length == 0 ? (
                                        <Text style={styles.dataNull}>Không có dữ liệu</Text>
                                    ):(
                                        <></>
                                    )
                                }
                                {
                                    filteredDataSource?.map((registry)=>(
                                        <RegisForRegistrationBox
                                            key={registry.id}
                                            data={registry}
                                            type={2}
                                            onPress={()=>NavigationService.navigate('CompleteRegistryDetail',{regisId:registry.id})}
                                        />
                                    ))
                                }
                            </CheckNullData>
                        )
                    }
                </ScrollView>
                <DateTimePicker 
                    isVisible={showCalender} 
                    setVisible={()=>setShowCalender(false)}  
                    date={moment(date).format("YYYY-MM-DD")}
                    setDate={(date)=>setDate(date)}
                />
            </View>
        </View>
    )
}

export default CompleteRegistryListScreen

const styles = StyleSheet.create({
    calender:{
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'center',
        paddingVertical:15,
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:1,
    },
    calender_title:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:13,
        lineHeight:18,
        color:'#394B6A',
        marginLeft:10,
    },
    scrollView:{
        flex:1,
    },
    dataNull:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:18,
        lineHeight:28,
        color:'#394B6A',
        textAlign:'center',
        marginTop:30,
    }
})