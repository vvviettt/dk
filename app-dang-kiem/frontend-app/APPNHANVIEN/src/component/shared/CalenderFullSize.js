import { StyleSheet, Text, View,Image ,TouchableOpacity} from 'react-native'
import {Calendar, LocaleConfig} from 'react-native-calendars';
import React from 'react'
import {Font} from '../../assets/styles/Index';
import NavigationService from '../../services/NavigationService';

LocaleConfig.locales['vn'] = {
    monthNames: [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12'
    ],
    dayNames: ['Chủ nhật','Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
    dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    today: "Hôm nay"
  };
LocaleConfig.defaultLocale = 'vn';
const CalenderFullSize = ({
    style,
    listDate,
    onPressDate,
    dateSelect,
}) => {
    const [listPlan,setListPlan] = React.useState()
    // React.useEffect(()=>{
    //     let demo ={}
    //     for (let i = 0 ; i< listDate?.length;i++){
    //         let obj ={
    //             [listDate[i].date]:{marked: true}
    //         }
    //         demo = Object.assign({},obj,demo)
    //     }
    //     setListPlan(demo)
    // },[])
    React.useEffect(()=>{
        let demo ={}
        for (let i = 0 ; i< listDate?.length;i++){
            let obj ={
                [listDate[i].date]:{marked: true}
            }
            demo = Object.assign({},obj,demo)
        }
        demo ={...demo,...{[dateSelect]:{selected: true}}}
        setListPlan(demo)
    },[dateSelect])

    return (
        <View style={[style,styles.group]} >
            <Calendar
                scrollEnabled={true}
                // current={dateSelect}
                // initialDate={dateSelect}
                // date={dateSelect}
                onDayPress={day => {
                    onPressDate(day.dateString)
                    // console.log(day.dateString);
                }}
                // Enable the option to swipe between months. Default = false
                enableSwipeMonths={true}
                renderArrow={direction => 
                    (
                        <>
                            {
                                direction=='left' ? 
                                <Image source={require('../../assets/icons/ArrowLeftIcon.png')}
                                    style={{
                                        width:16.68,
                                        height:10
                                    }}
                                />
                                :
                                <Image source={require('../../assets/icons/ArrowRightIcon.png')}
                                    style={{
                                        width:16.68,
                                        height:10
                                    }}
                                />
                            }
                        </>
                    )
                }
                firstDay={1}
                showScrollIndicator={true}
                markedDates={listPlan}
                renderHeader={date => {
                    return(
                        <TouchableOpacity onPress={()=>console.log('calender')}>
                            <Text style={styles.calender_title_style}>Tháng {date.getMonth()+1}/{date.getFullYear()}</Text>
                        </TouchableOpacity>
                    )
                }}
                style={styles.calender_style}
                theme={{
                    selectedDayBackgroundColor:'#00B94A',
                    dotColor:'#EA513C',
                    // todayBackgroundColor:'#00B94A',
                    // todayTextColor:'#FFFFFF',
                    // todayDotColor:'#FFFFFF',
                    selectedDotColor:'#FFFFFF',
                    'stylesheet.calendar.header': {
                        // dayText:{
                        //     fontFamily:Font.RobotoBold,
                        //     color:'#394B6A',
                        //     fontSize:11,
                        //     fontWeight:'700',
                        //     lineHeight:16
                        // },
                        week: {
                            marginTop: 5,
                            borderBottomColor:'#E1E9F6',
                            borderBottomWidth:1,
                            borderStyle:'solid',
                            flexDirection:'row',
                            justifyContent:'space-between',
                        },
                    },
                }}
            />
        </View>
    )
}

export default CalenderFullSize

const styles = StyleSheet.create({
    group:{
        width:'100%',
    },
    title:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:12,
        lineHeight:18,
        fontWeight:'500',
        color:'#394B6A',
        marginBottom:10,
        textTransform:'uppercase',
    },
    calender_style:{
        borderRadius:6,
        shadowColor: '#0000000D',
        shadowOffset: {width: 2, height: 8},
        shadowOpacity: 0,
        shadowRadius: 0,
    },
    calender_title_style:{
        fontFamily:Font.BeVietnamProBold,
        fontSize:12,
        lineHeight:18,
        fontWeight:'700',
        color:'#394B6A',
    },
    decription:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:15,
        alignItems:'center',
    },
    decription_group:{
        flexDirection:'row',
        alignItems:'center',
    },
    decription_btn:{
        width:10,
        height:10,
        borderRadius:2,
        marginRight:10,
    },
    decription_content:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:12,
        lineHeight:13,
        fontWeight:'400',
        color:'#394B6A',
    },
})