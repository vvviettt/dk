import { Image, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
// import MapView, {Marker} from 'react-native-maps';
import React from 'react'
import Header from '../../component/layout/Header';
import {Button, Searchbar} from 'react-native-paper';
import {Font} from '../../assets/styles/Index';
import { debounce } from "lodash";
import MapService from '../../services/api/MapService.js/MapService';
import {convertAlert} from '../../component/shared/ConvertAlert';
import Loading from '../../component/shared/Loading';
import config from '../../config';

const MapPage = ({navigation,route}) => {
    const {licensePlates,date,carId,time,address,nameScreen,registryId} = route.params

    const [loading,setLoading] = React.useState(false)
    const [isLoading,setIsLoading] = React.useState(false)
    const [isLoadingImage,setIsLoadingImage] = React.useState(false)
    const [open, setOpen] = React.useState(false);
    const [predictions,setPredictions] = React.useState()
    const [text,setText] = React.useState(address)
    const [image,setImage] = React.useState()
    const [mapRegion,setMapRegion] = React.useState({
        latitude: 16.048660316245975,
        longitude: 108.21574442088604,
        latitudeDelta: 0.21688808266279125,
        longitudeDelta: 0.15441477298736572,
    })
    const [markers,setMarkers] = React.useState([
        {
            latitude: 16.0119633,
            longitude: 108.1837542,
            title:"Trung tâm đăng kiểm SMART TEST",
            description:'58 Trường Sơn, Quận Cẩm Lệ, TP. Đà Nẵng',
        },
    ])
    const [markerChoose,setMarkerChoose] = React.useState();
    React.useState(()=>{
        if (text != "" && text){
            MapService.get_place_by_name(text)
            .then(res => {
                setMarkerChoose(res.data.results[0])
                setOpen(false)
            })
            .catch(err => {
                convertAlert("Thông báo","Vui lòng nhập")
                setOpen(false)
            })
            MapService.auto_complete(text)
            .then(res => {
                setIsLoading(false)
                setPredictions(res.data.predictions)
                // console.log(res.data);
            })
            .catch(err => {
                setIsLoading(false)
                convertAlert("Thông báo","Có lỗi gì đó xảy ra")
            })
        }
        return ()=>{}
    },[])
    console.log(time);
    const onClickButtonOk = () =>{
        if (text && markerChoose && text!= ""){
            if (
                text == markerChoose.formatted_address
            )navigation.navigate(nameScreen,{
                addressMap:text,
                licensePlates:licensePlates,
                date:date,
                carId:carId,
                registryId:registryId,
                origins:markerChoose.geometry.location.lat+','+markerChoose.geometry.location.lng,
                time:time,
            })
            else{
                convertAlert("Thông báo","Vui lòng xác nhận địa chỉ")
            }
        }
        else{
            convertAlert("Thông báo","Vui lòng chọn địa chỉ")
        }
    }

    const debounceDropDown = React.useCallback(debounce((nextValue) =>{
        setIsLoading(true)
        MapService.auto_complete(nextValue)
        .then(res => {
            setIsLoading(false)
            setPredictions(res.data.predictions)
            // console.log(res.data);
        })
        .catch(err => {
            setIsLoading(false)
            convertAlert("Thông báo","Có lỗi gì đó xảy ra")
        })
    }, 1000), [])

    const location = (prediction) => {
        MapService.get_place_by_id(prediction.place_id)
        .then(res => {
            setText(res.data.result.formatted_address)
            setMarkerChoose(res.data.result)
            // setIsLoadingImage(true)
            // MapService.get_image_distance(res.data.result.geometry.location.lat + ',' + res.data.result.geometry.location.lng)
            // .then(res => {
            //     setImage(res.data)
            //     setIsLoadingImage(false)
            // })
            setOpen(false)
        })
        .catch(err => {
            convertAlert("Thông báo","Có lỗi gì đó xảy ra")
            setOpen(false)
        })
    }

    const handleSubmit = () =>{
        MapService.get_place_by_name(text)
        .then(res => {
            setMarkerChoose(res.data.results[0])
            setText(res.data.results[0].formatted_address)
            setOpen(false)
        })
        .catch(err => {
            convertAlert("Thông báo","Vui lòng nhập")
            setOpen(false)
        })
    }

    const searchFilterFunction = (text) =>{
        setText(text)
        debounceDropDown(text)
    }

    return (
        <TouchableWithoutFeedback
            onPress={() => Keyboard.dismiss()}
            style={{flex:1}}
        >
            <View style={{flex:1,backgroundColor:'#FFFFFF'}}>
                <Header onGoBack={()=>navigation.goBack()} title='Chọn địa chỉ trên bản đồ'/>
                <Searchbar
                    placeholder="Tìm kiếm"
                    onChangeText={searchFilterFunction}
                    onPressIn={()=>{setOpen(true)}}
                    onSubmitEditing={()=>{handleSubmit()}}
                    value={text}
                    style={{
                        borderBottomColor:"#E1E9F6",
                        borderBottomWidth:1
                    }}
                />
                {
                    open == true ? (
                        <View style={styles.drop_down}>
                            <ScrollView style={styles.ScrollView}>
                                {
                                    isLoading == false ? 
                                    predictions?.map((prediction,index)=>(
                                        <TouchableOpacity onPress={()=>{
                                            location(prediction)
                                        }} key={index}>
                                            <Text style={styles.drop_text}>{prediction.description}</Text>
                                        </TouchableOpacity>
                                    ))
                                    :(
                                        <Loading/>
                                    )
                                }

                            </ScrollView>
                        </View>
                    ):(
                        <></>
                    )
                }
                {/* <MapView 
                    // provider={PROVIDER_GOOGLE}
                    style={styles.map} 
                    region={mapRegion}
                    moveOnMarkerPress={true}
                >
                    {markers.map((marker,index)=>(
                        <Marker
                            description={marker.title}
                            key={index}
                            coordinate={{ latitude : marker.latitude , longitude : marker.longitude }}
                            title={marker.title}                          
                            />
                    ))}
                    {
                        markerChoose != null ? (
                            <Marker 
                                coordinate={{ latitude : markerChoose?.geometry.location.lat , longitude : markerChoose?.geometry.location.lng }}
                                title={markerChoose?.formatted_address}
                                // image = {
                                //     <Image 
                                //         source={require('../../assets/icons/icon_app_map.png')}
                                //         style={{
                                //             width:20,
                                //             height:20,
                                //             resizeMode:'cover',
                                //         }}
                                //     />
                                // }
                            />
                        ):(
                            <></>
                        )
                    }
                </MapView> */}
                <View style={styles.map}>
                    {
                        markerChoose !=null ? (
                            <Image 
                                source={{uri:`https://rsapi.goong.io/staticmap/route?origin=${markers[0].latitude+ ',' + markers[0].longitude}&destination=${markerChoose?.geometry.location.lat + ',' + markerChoose?.geometry.location.lng}&vehicle=car&api_key=${config.API_KEY}`}}
                                style={{
                                    flex:1,
                                    resizeMode:'cover'
                                }}
                                loadingIndicatorSource = {
                                    <Loading />
                                }
                            />
                        ):(
                            <></>
                        )
                    }
                </View>
                <View style={styles.footer}>
                    <Text style={styles.footer_text} maxFontSizeMultiplier = {2}>{text ? text : "Chọn vị trí"}</Text>
                    <TouchableOpacity disabled={loading} style={styles.footer_btn} onPress={()=>onClickButtonOk()}>
                        <Button
                            mode="text"
                            button
                            loading={loading}
                            color={"white"}
                        >
                        CHỌN 
                        </Button>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default MapPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex:1,
        // backgroundColor:"#FFFFFF"ftg7
    },
    drop_down:{
        position:"relative",
        borderColor:'#E1E9F6',
        borderWidth:1,
        width:"100%",
        height:250,
    },
    drop_text:{
        color:'#2C3442',
        padding:15,
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:1,
    },
    ScrollView:{
        flex:1,
        // borderColor:'#E1E9F6',
        // borderWidth:1,
    },  
    search:{
        padding:0,
    },
    search_text:{
        borderWidth:0,
        padding:0,
        borderColor:"#FFFFFF",
        borderRadius:0,
    },
    footer:{
        backgroundColor:"#FFFFFF",
        paddingHorizontal:15,
        paddingTop:12,
        paddingBottom:20,
        height:124,
        borderTopColor:'#E1E9F6',
        borderTopWidth:1,
    },
    footer_text:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:13,
        lineHeight:18,
        color:'#2C3442',
        fontWeight:'400',
        marginBottom:8,
    },
    footer_btn:{
        width:'100%',
        height:44,
        borderRadius:6,
        backgroundColor:'#0F6AA9',
        alignItems:'center',
        justifyContent:'center'
    },
})