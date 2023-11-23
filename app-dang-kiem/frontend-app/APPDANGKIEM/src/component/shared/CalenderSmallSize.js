import { StyleSheet, Text, View ,Image,TouchableOpacity} from 'react-native'
import React from 'react'
import {Font} from '../../assets/styles/Index';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment'

const CalenderSmallSize = ({
    calenderStyle,
    selectedDate,
    onChangeSelectedDate,
    listDate
}) => {
    const [list,setList] = React.useState(listDate)
    function getMarkDay(){
        let demo =[]
        for (let i = 0 ; i< list?.length;i++){
            let obj ={
                date: list[i].date,
                dots: [
                    {
                        color: '#EA513C',
                    },
                ],
            }
            demo.push(obj)
        }
        return demo
    }
    return (
        <View style={[styles.calender,calenderStyle]}>
            <CalendarStrip
                locale={
                {
                    name: 'vn',
                    config: {
                    months: [
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
                    weekdays: ['Chủ nhật','Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
                    weekdaysShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                    }
                }
                }
                scrollable
                style={styles.calender_style}
                calendarHeaderStyle={styles.calendarHeaderStyle}
                dateNumberStyle={styles.dateNameStyle}
                dateNameStyle={styles.dateNameStyle}
                highlightDateNameStyle={styles.highlightDateNameStyle}
                highlightDateNumberStyle={styles.highlightDateNumberStyle}
                dayContainerStyle={{
                    justifyContent:'space-between',
                }}
                scrollerPaging
                markedDates={getMarkDay()}
                onDateSelected={(date)=>{
                    onChangeSelectedDate(moment(date).format('YYYY-MM-DD'))
                }}
                selectedDate={selectedDate}
            />
        </View>
    )
}

export default CalenderSmallSize

const styles = StyleSheet.create({
    calender:{

    },
    calender_style:{
        height:138,
        backgroundColor:'#FFFFFF',
        borderBottomRightRadius:6,
        borderBottomLeftRadius:6,
        shadowColor: '#0000000D',
        shadowOffset: {width: 2, height: 8},
        shadowOpacity: 0,
        shadowRadius: 0,
    },
    calendarHeaderStyle:{
        marginTop:25,
        alignItems:'flex-start',
        fontFamily:Font.BeVietnamProBold,
        fontSize:16,
        lineHeight:24,
        fontWeight:'700',
        color:'#2C3442',
    },
    dateNumberStyle:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:13,
        lineHeight:16,
        fontWeight:'400',
        color:'#2C3442',
        padding:5,
    },
    dateNameStyle:{
        fontFamily:Font.RobotoBold,
        fontSize:11,
        lineHeight:16,
        fontWeight:'700',
        color:'#394B6A',
    },
    highlightDateNameStyle:{
        fontFamily:Font.RobotoBold,
        fontSize:11,
        lineHeight:16,
        fontWeight:'700',
        color:'#394B6A',
    },
    highlightDateNumberStyle:{
        width:23,
        height:23,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#00B94A',
        color:'#FFFFFF',
        borderRadius:2,
    },
})