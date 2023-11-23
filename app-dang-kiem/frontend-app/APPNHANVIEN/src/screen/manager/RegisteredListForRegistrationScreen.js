import { StyleSheet, Text, View, Image,TouchableOpacity, ScrollView,TextInput } from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import DateTimePicker from '../../component/shared/DateTimePicker'
import moment from 'moment';
import {converLicensePlate, convertNonPrice, convertPrice, formatDate} from '../../services/utils';
import {Font} from '../../assets/styles/Index';
import {useSelector} from 'react-redux';
import Loading from '../../component/shared/Loading';
import {convertAlert} from '../../component/shared/ConvertAlert';
import ManagerService from '../../services/api/manager/ManagerService';
import RegisForRegistrationBox from '../../component/shared/RegisForRegistrationBox';
import WModal from '../../element/WModal';
import {Searchbar,Button} from 'react-native-paper';
import NavigationService, {goBack} from '../../services/NavigationService';
import { CommonActions } from '@react-navigation/native';
import CheckNullData from '../../component/shared/CheckNullData';

const RegisteredListForRegistrationScreen = ({navigation,route}) => {
    const datedemo = new Date()
    const now = moment(datedemo).format('YYYY-MM-DD')
    
    const {token} = useSelector(state => state.auth)
    const [showCalender,setShowCalender] = React.useState(false)
    const [date,setDate] = React.useState(now)
    const [isLoading,setIsLoading] = React.useState(true)
    const [visible,setVisible] = React.useState(false);
    const [data,setData] = React.useState()
    const [select,setSelect] = React.useState()
    const [filteredDataSource,setFilteredDataSource] = React.useState()
    const [visibleStepTwo,setVisibleStepTwo] = React.useState(false)
    const [text,setText] = React.useState('')
    const [regisFee,setRegisFee] = React.useState()
    const [loadingSubmit,setLoadingSubmit] = React.useState(false)
    const [registryFee,setRegistryFee] = React.useState()
    const [anotherFee,setAnotherFee] = React.useState()

    const closeModal = () =>{
        setVisible(false);
    }

    const closeModalStepTwo = () => {
        setVisibleStepTwo(false)
    }

    const openStepTwo = () => {
        setVisible(false)
        setVisibleStepTwo(true)
    }

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

    const handleSubmit = () =>{
        const data = {
            id:select.id,
            fee_5:convertNonPrice(regisFee),
            fee_6:convertNonPrice(registryFee),
            fee_7:convertNonPrice(anotherFee),
        }
        setLoadingSubmit(true)
        ManagerService.handle_payment(data)
        .then((res)=>{
            if (res.status==1){
                setLoadingSubmit(false)
                navigation.dispatch(
                    CommonActions.reset({
                      index: 1,
                      routes: [
                        { name: 'BottomNavigation' },
                        {
                            name: 'PaidRegistrationList',
                            params: { 
                                day : date
                            },
                        },
                      ],
                    })
                )
                setVisible(false)
                setVisibleStepTwo(false)
            }else throw new Error(res.message)
        })
        .catch((err)=>{
            console.log(err);
            setLoadingSubmit(false)
            setVisible(false)
            setVisibleStepTwo(false)
            convertAlert('Thông báo',err.message)
        })
    }

    React.useEffect(()=>{
        if (token){
            setIsLoading(true)
            ManagerService.get_register_list_type(0,date)
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
            <Header onGoBack={()=>navigation.goBack()} title="DS đã đăng ký đăng kiểm" />
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
                                            onPressSuccess={()=>{
                                                setSelect(registry)
                                                setVisible(true)
                                            }}
                                            type={0}
                                            onPress={()=>NavigationService.navigate('RegistryDetail',{regisId:registry.id})}
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
                <WModal 
                    modalVisible={visible}
                    closeModal={closeModal}
                    handleConfirm={openStepTwo}
                    // modalContent='Xe có lỗi vi phạm chưa được xử lý, bạn có chắc chắn đăng ký đăng kiểm?'
                    component={(
                        <>
                            <View style={{
                                backgroundColor:'#FFFFFF',
                                borderRadius:6,
                                padding:22
                            }}>
                                <Text style={{
                                    fontFamily:Font.BeVietnamProRegular,
                                    fontSize:14,
                                    fontWeight:'400',
                                    lineHeight:22,
                                    textAlign:'center',
                                    color:'#2C3442',
                                }}>
                                    Bạn có chắc muốn xác nhận thanh toán phí và lệ phí đăng kiểm cho xe có biển kiểm soát 
                                    <Text style={{fontFamily:Font.BeVietnamProBold}}> {converLicensePlate(select?.license_plate)}</Text> đăng kiểm ngày 
                                    <Text style={{fontFamily:Font.BeVietnamProBold}}> {formatDate(select?.date)}</Text> không?
                                </Text>
                            </View>
                        </>
                    )}
                />
                <WModal 
                    modalVisible={visibleStepTwo}
                    closeModal={closeModalStepTwo}
                    handleConfirm={handleSubmit}
                    okBtnText='Lưu'
                    cancelBtnText='Hủy'
                    loading={loadingSubmit}
                    component={(
                        <>
                            <View style={{
                                backgroundColor:'#FFFFFF',
                                borderRadius:6,
                            }}>
                                <Text style={styles.modal_title}>Thu phí </Text>
                                <View style={styles.modal_select}>
                                    <Text style={styles.modal_select_title}>Phí đăng kiểm</Text>
                                    <TextInput
                                        value={regisFee}
                                        keyboardType="numeric"
                                        onChangeText={
                                            text=>{text !="" ? 
                                                setRegisFee(convertPrice(convertNonPrice(text))): setRegisFee("")}
                                        }
                                        style ={styles.modal_select_input}
                                    />
                                </View>
                                <View style={styles.modal_select}>
                                    <Text style={styles.modal_select_title}>Lệ phí đăng kiểm</Text>
                                    <TextInput
                                        value={registryFee}
                                        keyboardType="numeric"
                                        onChangeText={
                                            text=>{text !="" ? 
                                                setRegistryFee(convertPrice(convertNonPrice(text))): setRegistryFee("")}
                                        }
                                        style ={styles.modal_select_input}
                                    />
                                </View>  
                                <View style={styles.modal_select}>
                                    <Text style={styles.modal_select_title}>Phí khác</Text>
                                    <TextInput
                                        value={anotherFee}
                                        keyboardType="numeric"
                                        onChangeText={
                                            text=>{text !="" ? 
                                                setAnotherFee(convertPrice(convertNonPrice(text))): setAnotherFee("")}
                                        }
                                        style ={styles.modal_select_input}
                                    />
                                </View>         
                            </View>
                        </>
                    )}
                />
            </View>
        </View>
    )
}

export default RegisteredListForRegistrationScreen

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
    },
    modal_title:{
        fontFamily:Font.BeVietnamProBold,
        fontSize:16,
        lineHeight:22,
        color:'#2C3442',
        padding:20,
        paddingBottom:15,
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:1,
        marginBottom:20
    },
    modal_select:{
        paddingHorizontal:20,
        paddingBottom:20,
    },
    modal_select_title:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:13,
        lineHeight:20,
        color:'#5C5F62',
        marginBottom:6,
    },
    modal_select_input:{
        flexDirection:'row',
        paddingHorizontal:12,
        paddingVertical:6,
        alignItems:'center',
        justifyContent:'space-between',
        borderWidth:1,
        borderRadius:3,
        borderColor:'#E1E9F6'
    },
    modal_select_text:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:13,
        lineHeight:20,
        color:'#36383A',
        opacity: 0.5,
    }
})