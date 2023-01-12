import React from 'react'
import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, Modal, Image, Linking, Alert } from 'react-native'
import Toast from '@/containers/Toast'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import moment from 'moment'
import * as Animatable from 'react-native-animatable'

const { width, height } = Dimensions.get('window')
const AnimatableView = Animatable.View
const THBQRIcon = [
    {
        img: require('./../../../../images/finance/deposit/THBQRIcon/THBQR1.png'),
        text: 'ธ. ออมสิน',
    },
    {
        img: require('./../../../../images/finance/deposit/THBQRIcon/THBQR2.png'),
        text: 'ธ. กรุงเทพ',
    },
    {
        img: require('./../../../../images/finance/deposit/THBQRIcon/THBQR3.png'),
        text: 'ธ. กรุงไทย',
    },
    {
        img: require('./../../../../images/finance/deposit/THBQRIcon/THBQR4.png'),
        text: 'ธ. กรุงศรีอยุธยา',
    },
    {
        img: require('./../../../../images/finance/deposit/THBQRIcon/THBQR5.png'),
        text: 'ธ. กสิกรไทย',
    },
    {
        img: require('./../../../../images/finance/deposit/THBQRIcon/THBQR6.png'),
        text: 'ธ. ไทยพาณิชย์',
    },
    {
        img: require('./../../../../images/finance/deposit/THBQRIcon/THBQR7.png'),
        text: 'ธ. ทหารไทย',
    },
    {
        img: require('./../../../../images/finance/deposit/THBQRIcon/THBQR8.png'),
        text: 'ธ. เกียรตินาคิน',
    },
    {
        img: require('./../../../../images/finance/deposit/THBQRIcon/THBQR9.png'),
        text: 'ธ. เกียรตินาคิน',
    },
    {
        img: require('./../../../../images/finance/deposit/THBQRIcon/THBQR10.png'),
        text: 'ธ. ธนชาต',
    },
    {
        img: require('./../../../../images/finance/deposit/THBQRIcon/THBQR11.png'),
        text: 'ธ. ซีไอเอ็มบี ไทย',
    },
    {
        img: require('./../../../../images/finance/deposit/THBQRIcon/THBQR12.png'),
        text: 'ธ. นครหลวงไทย',
    },
    {
        img: require('./../../../../images/finance/deposit/THBQRIcon/THBQR13.png'),
        text: 'ธ. ยูโอบี',
    },
    {
        img: require('./../../../../images/finance/deposit/THBQRIcon/THBQR14.png'),
        text: 'ธ. ไอซีบีซี',
    },
    {
        img: require('./../../../../images/finance/deposit/THBQRIcon/THBQR15.png'),
        text: 'ธ. สแตนดาร์ด ชาร์เตอร์ด',
    },
    {
        img: require('./../../../../images/finance/deposit/THBQRIcon/THBQR16.png'),
        text: 'ธ. LH',
    },
    {
        img: require('./../../../../images/finance/deposit/THBQRIcon/THBQR17.png'),
        text: 'ธ.ก.ส',
    },
]
export default class THBQRBankList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {

    }


    render() {
        const { } = this.state

        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F4F4F4' : '#000' }]}>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {
                        THBQRIcon.map((v, i) => <View key={i} style={{
                            width: (width - 20) / 4,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 15
                        }}>
                            <Image source={v.img}
                                resizeMode='stretch'
                                style={{
                                    width: 40,
                                    height: 40,
                                    marginBottom: 8
                                }}
                            ></Image>
                            <Text style={{
                                fontSize: 12,
                                textAlign: 'center',
                                color: '#676767'
                            }}>{v.text}</Text>
                        </View>)
                    }
                </View>
            </ScrollView>
        </View>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: 'red',
        paddingHorizontal: 10,
        paddingTop: 25
    },
})