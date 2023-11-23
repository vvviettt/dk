import { StyleSheet, Text, View,ScrollView ,TouchableOpacity,Image} from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import Footer from '../../component/layout/Footer'
import WSelectInput from '../../element/WSelectInput'
import WLicensePlatesInput from '../../element/WLicensePlatesInput'
import * as ImagePicker from 'expo-image-picker';
import {Font} from '../../assets/styles/Index'
import CarService from '../../services/api/car/CarService'
import {useSelector} from 'react-redux'
import Loading from '../../component/shared/Loading'
import {useToast} from 'react-native-toast-notifications'
import WToast from '../../element/WToast'
import {reConvertLicensePlate} from '../../services/utils/index'
import {convertAlert} from '../../component/shared/ConvertAlert'
import { CommonActions } from '@react-navigation/native';

const CarAddScreen = ({navigation}) => {
    const {token} = useSelector(state => state.auth)
    const [licensePlates,setLicensePlates] = React.useState('')
    const [category,setCategory] = React.useState()
    const [type,setType] = React.useState()
    const [year,setYear] = React.useState('')
    const [localPhotos,setLocalPhotos] = React.useState([])
    const [dataCategory,setDataCategory] = React.useState()
    const [dataType,setDataType] = React.useState()
    const [isLoading,setIsLoading] = React.useState(true)
    const [loadingOnType,setLoadingOnType] = React.useState(false)
    const [reRender,setReRender] = React.useState(true)
    const [listYear,setListYear] = React.useState()
    const [loadingSubmit,setLoadingSubmit] = React.useState(false)
    const toast = useToast();
    React.useEffect(()=>{
        const renderListYear =() =>{
            const now = new Date()
            const current_year = now.getFullYear()
            let lis_year=[]
            for (let i=current_year;i>=1900;i--){
                lis_year.push({
                    id:i,
                    name:i
                })
            }
            setListYear(lis_year)
        }
        renderListYear()
    },[])
    React.useEffect(() =>{
        if(token){
            setIsLoading(true);
            CarService.get_category()
            .then((res) =>{
                if (res.status == 1){
                    setDataCategory(res.data.rows)
                    setIsLoading(false);
                } else throw new Error(res.message)
            })
            .catch((err) =>{
                convertAlert('Thông báo',err.message);
                setIsLoading(false);
            })
        }else {
            setIsLoading(false)
        }
    },[token])
    console.log(category);
    React.useEffect(() =>{
        if(category){
            setLoadingOnType(true)
            setType(null)
            CarService.get_car_type({categoryId:category})
            .then((res) =>{
                if (res.status == 1){
                    setDataType(res.data.rows)
                    setLoadingOnType(false)
                }else throw new Error(res.message)
            })
            .catch((err) =>{
                convertAlert('Thông báo',err.message);
                setLoadingOnType(false)
            })
        }
    },[category])
    const handleAddImage = async()=>{
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
        });
        if (!result.cancelled) {
            setLocalPhotos([...localPhotos,result.uri])
        }
    }
    const handleDeleteImage = (index) =>{
        let arr =localPhotos
        arr.splice(index, 1);
        setLocalPhotos(arr)
        setReRender(!reRender)
    }
    const handleSubmit =()=>{
        setLoadingSubmit(true);
        let newImage=[];
        for (let i=0 ; i< localPhotos.length;i++){
            let localUri = localPhotos[i];
            let filename = localUri.split('/').pop();
          
            // Infer the type of the image
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
            newImage.push({ uri: localUri, name: filename, type })
        }
        const data ={
            license_plate : reConvertLicensePlate(licensePlates),
            manufacture_at : year ,
            type:type,
            photos:newImage,
        }
        CarService.add_new_car(data)
            .then((res) =>{
                if (res.status == 1 ){
                    toast.hideAll();
                    toast.show(
                        <WToast 
                            content={res.message} 
                            showTouch={false}
                            icon={require('../../assets/icons/SuccessIcon.png')}
                            iconStyle={{
                                width:24,
                                height:24,
                                marginRight:15,
                                marginTop:5
                            }}
                        />
                        ,{
                        type:'custom_type'
                    });
                    navigation.dispatch(
                        CommonActions.reset({
                          index: 1,
                          routes: [
                            { name: 'BottomNavigation' },
                            {
                              name: 'Car/List',
                            },
                          ],
                        })
                    )
                    setLoadingSubmit(false)
                }else throw new Error(res.message)
            })
            .catch((err) =>{
                convertAlert('Thông báo',err.message);
                setLoadingSubmit(false)
            })
    }
    return (
        <View style={{flex:1}}>
            <Header onGoBack={()=>navigation.goBack()} title='Thêm thông tin xe'/>
            {
                isLoading == true ?
                (
                    <Loading />
                ):(
                    <>
                        <ScrollView style={styles.scroll_view}>
                            <View style={styles.input_group}>
                                <WLicensePlatesInput 
                                    label='Biển số xe (Vui lòng nhập liền không dấu, không cách)' 
                                    group_style={styles.input_style}
                                    setText={(text)=>setLicensePlates(text)}
                                    text={licensePlates}
                                />
                                <WSelectInput 
                                    dataSelect={dataCategory}
                                    label='Loại phương tiện theo phí kiểm định'
                                    select_style={styles.input_style}
                                    onSelect={(id)=>setCategory(id)}
                                    value={category}
                                />
                                {
                                    loadingOnType ? (
                                        <Loading />
                                    ):(
                                        <WSelectInput 
                                            dataSelect={dataType}
                                            value={type}
                                            label='Loại phương tiện theo phí đường bộ'
                                            select_style={styles.input_style}
                                            onSelect={(id)=>setType(id)}
                                            messageIfDataNull='- Bạn cần phải chọn chủng loại phương tiện trước - '
                                        />
                                    )
                                }
                                {
                                    listYear ?
                                    (
                                        <WSelectInput 
                                            dataSelect={listYear}
                                            label='Năm sản xuất'
                                            select_style={styles.input_style}
                                            onSelect={(year)=>setYear(year)}
                                        />
                                    ):(
                                        <></>
                                    )
                                }
                                
                            </View>
                            <View style={styles.photo}>
                                <Text style={styles.photo_title}>Hình ảnh</Text>
                                <View style={styles.photo_group}>
                                    {
                                        localPhotos.map((image,index) =>
                                            
                                            <View style={styles.photo_group_items} key={image}>
                                                <Image 
                                                    source={{ uri: image }}
                                                    style={{
                                                        width:45,
                                                        height:45,
                                                        borderRadius:3,
                                                        resizeMode:'cover',
                                                    }}
                                                /> 
                                                <TouchableOpacity style={styles.btn_delete} onPress={()=>handleDeleteImage(index)}>
                                                    <Image 
                                                        source={require('../../assets/icons/DeleteIcon.png')}
                                                        style={{
                                                            width:14,
                                                            height:14
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    }
                                    <TouchableOpacity style={styles.btn_add} onPress={()=>handleAddImage()}>
                                        <Image 
                                            source={require('../../assets/icons/AddPhotoIcon.png')}
                                            style={{
                                                width:13.03,
                                                height:16,
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                        <Footer 
                            buttonOkContent={'Lưu'}
                            onClickButtonOk={handleSubmit}
                            footer_style={styles.footer_style}
                            disabled={loadingSubmit}
                            loading={loadingSubmit}
                        />
                    </>
                )
            }
        </View>
    )
}

export default CarAddScreen

const styles = StyleSheet.create({
    scroll_view:{
        flex:1,
        backgroundColor:'#FFFFFF',
    },
    input_group:{
        width:'100%',
        paddingHorizontal:15
    },
    input_style:{
        marginTop:30
    },  
    photo:{
        marginTop:30,
        paddingHorizontal:15,
    },
    photo_title:{
        fontFamily:Font.BeVietnamProBold,
        color:'#394B6A',
        fontSize:11,
        lineHeight:16,
        fontWeight:'700',
        textTransform:'uppercase'
    },
    photo_group:{
        flexDirection:'row',
        flexWrap:'wrap'
    },
    photo_group_items:{
        marginTop:15,
        marginRight:15,
    },
    btn_delete:{
       position:'absolute',
       right:-5,
       top:-5,
    },
    btn_add:{
        width:45,
        height:45,
        borderRadius:3,
        marginTop:15,
        borderColor:'#E1E9F6',
        borderWidth:1,
        borderStyle:'dashed',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#F6F9FF'
    },
    footer_style:{
        backgroundColor:'#FFFFFF'
    }
})