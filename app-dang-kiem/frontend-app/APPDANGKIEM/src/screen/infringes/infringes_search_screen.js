import { StyleSheet, Text, View,ScrollView ,Image,TouchableOpacity} from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import {Font} from '../../assets/styles/Index';
import {Button} from 'react-native-paper';
import {TextInputMask} from 'react-native-masked-text';

const InfringesSearchScreen = ({navigation}) => {
    const [search,setSearch] = React.useState('')
    const handleSubmit = () =>{
        if (search.length == 0) alert('Không được để trống')
        else
        navigation.navigate('Infringes/Detail',{search})
    }
    function check(text){
        if (isNaN(text[3]))
        return true
        else return false
    }
    return (
        <View style={{flex:1}}>
            <Header onGoBack={()=>navigation.goBack()} title='Tra cứu lỗi vi phạm'/>
            <ScrollView style={{flex:1}}>
                <View style={styles.page_content}>
                    <Image 
                        source={require('../../assets/icons/SearchErrorIcon.png')}
                        style={{
                            width:128,
                            height:128,
                            resizeMode:'contain'
                        }}
                    />
                    <Text style={styles.title}>Vui lòng nhập biển kiểm soát để tra cứu</Text>
                    <View style={styles.search_style}>
                        <Image 
                            source={require('../../assets/icons/SearchIcon.png')}
                            style={{
                                width:14,
                                height:14,
                                position:'absolute',
                                left:20
                            }}
                        />
                        <TextInputMask
                            type={'custom'}
                            options={{
                            /**
                             * mask: (String | required | default '')
                             * the mask pattern
                             * 9 - accept digit.
                             * A - accept alpha.
                             * S - accept alphanumeric.
                             * * - accept all, EXCEPT white space.
                             */
                            mask: check(search) ?  '99AS - 99999999999999' : '99A - 999999999999999',
                            
                            }}
                            autoCapitalize = {"characters"}
                            value={search}
                            style={styles.input_style}
                            onChangeText={text => {
                                setSearch(text)
                            }}
                            placeholder='Ví dụ: 43D - 24232'
                        />
                    </View>
                    <TouchableOpacity style={styles.footer_btn} onPress={()=>{handleSubmit()}}>
                        <Button
                            mode="text"
                            button
                            disabled={false}
                            loading={false}
                            color={"white"}
                            >
                                tra cứu
                        </Button>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

export default InfringesSearchScreen

const styles = StyleSheet.create({
    page_content:{
        paddingHorizontal:30,
        width:'100%',
        alignItems:'center',
        marginTop:80,
    },
    title:{
        marginTop:20,
        fontFamily:Font.BeVietnamProRegular,
        fontSize:13,
        lineHeight:18,
        fontWeight:'400',
        color:'#394B6A',
        marginBottom:30
    },
    input_style:{
        width:'100%',
        paddingLeft:44,
    }, 
    search_style:{
        height:46,
        width:'100%',
        backgroundColor:'#FFFFFF',
        borderRadius:6,
        borderStyle:'solid',
        borderWidth:1,
        borderColor:'#E1E9F6',
        shadowColor: '#FFFFFF',
        marginBottom:15,
        alignItems:'center',
        justifyContent:'center'
    },
    search_input_style:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:13,
        lineHeight:18,
        fontWeight:'400',
        color:'#394B6A'
    },
    footer_btn:{
        width:'100%',
        height:44,
        borderRadius:6,
        backgroundColor:'#0F6AA9',
        alignItems:'center',
        justifyContent:'center',
        marginBottom:100,
    },
})