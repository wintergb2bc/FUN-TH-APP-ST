import Toast from '@/containers/Toast'
import React from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions, Modal } from 'react-native'
import { Actions } from 'react-native-router-flux'

const { width, height } = Dimensions.get('window')


class UploadfileDemo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            imgObj: {
                img1: {
                    top: require('./../../../images/account/uploadfile/uploadfileDemo1.png'),
                    bottom: require('./../../../images/account/uploadfile/uploadfileDemo2.png'),
                    text: 'บัตรประจำตัวประชาชน​'
                },
                img2: {
                    top: require('./../../../images/account/uploadfile/uploadfileDemo3.png'),
                    bottom: require('./../../../images/account/uploadfile/uploadfileDemo4.png'),
                    text: 'สำเนาทะเบียนบ้าน​'
                },
                img3: {
                    top: require('./../../../images/account/uploadfile/uploadfileDemo9.png'),
                    bottom: require('./../../../images/account/uploadfile/uploadfileDemo10.png'),
                    text: ''
                },
                img4: {
                    top: require('./../../../images/account/uploadfile/uploadfileDemo5.png'),
                    bottom: require('./../../../images/account/uploadfile/uploadfileDemo6.png'),
                    text: ''
                },
                img5: {
                    top: require('./../../../images/account/uploadfile/uploadfileDemo7.jpg'),
                    bottom: require('./../../../images/account/uploadfile/uploadfileDemo8.jpg'),
                    text: ''
                },
            }
        }
    }

    componentDidMount() {
        const { docTypeId } = this.props
        const { imgObj } = this.state
        this.props.navigation.setParams({
            title: this.props.pageTitle
        })
    }




    render() {
        const { docTypeId } = this.props
        const { imgObj } = this.state
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F4F4F5' : '#000' }]}>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                {
                    Boolean(imgObj[`img${docTypeId}`].text && imgObj[`img${docTypeId}`].text.length > 0) &&
                    <Text style={{ color: '#707070', textAlign: 'center', marginBottom: 15 }}>{imgObj[`img${docTypeId}`].text}</Text>
                }
                <View style={styles.uploadfileDemoBox}>
                    <View style={[styles.uploadfileDemoIconBox]}>
                        <Image
                            resizeMode='stretch'
                            source={require('./../../../images/account/uploadfile/demo1.png')}
                            style={[styles.uploadfileDemoIcon]}></Image>
                        {
                            imgObj[`img${docTypeId}`] && imgObj[`img${docTypeId}`].top && <Image
                                resizeMode='stretch'
                                source={imgObj[`img${docTypeId}`].top}
                                style={[styles.uploadfileDemo]}></Image>
                        }
                    </View>


                    <View style={styles.demoList}>
                        <View style={styles.demoCircle}></View>
                        <Text style={styles.demoText}>ภาพถ่ายจะต้องมีความสว่างและชัดเจน</Text>
                    </View>
                    <View style={styles.demoList}>
                        <View style={styles.demoCircle}></View>
                        <Text style={styles.demoText}>ข้อมูลทั้งหมดของเอกสารจะต้องปรากฏให้เห็น</Text>
                    </View>
                    <View style={styles.demoList}>
                        <View style={styles.demoCircle}></View>
                        <Text style={styles.demoText}>เอกสารจะต้องถูกต้องและไม่หมดอายุ</Text>
                    </View>
                </View>

                <View style={styles.uploadfileDemoBox}>
                    <View style={[styles.uploadfileDemoIconBox]}>
                        <Image
                            resizeMode='stretch'
                            source={require('./../../../images/account/uploadfile/demo0.png')}
                            style={[styles.uploadfileDemoIcon]}></Image>
                        {
                            imgObj[`img${docTypeId}`] && imgObj[`img${docTypeId}`].bottom && <Image
                                resizeMode='stretch'
                                source={imgObj[`img${docTypeId}`].bottom}
                                style={[styles.uploadfileDemo]}></Image>
                        }
                    </View>


                    <View style={styles.demoList}>
                        <View style={styles.demoCircle}></View>
                        <Text style={styles.demoText}>การเบลอและตัดภาพ</Text>
                    </View>
                    <View style={styles.demoList}>
                        <View style={styles.demoCircle}></View>
                        <Text style={styles.demoText}>การขีดฆ่าข้อมูล</Text>
                    </View>
                    <View style={styles.demoList}>
                        <View style={styles.demoCircle}></View>
                        <Text style={styles.demoText}>ภาพย้อนกลับ / กลับทาง</Text>
                    </View>
                </View>

            </ScrollView>
        </View>
    }
}

export default UploadfileDemo

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        paddingTop: 20
    },
    uploadfileDemoBox: {
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: '#fff'
    },
    uploadfileDemo: {
        marginBottom: 25,
        width: width * .5,
        height: (width * .5) * .624
    },
    demoList: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    demoCircle: {
        width: 6,
        height: 6,
        backgroundColor: '#000',
        borderRadius: 1000,
        overflow: 'hidden',
        marginRight: 10
    },
    demoText: {
        color: '#000000'
    },
    uploadfileDemoIcon: {
        width: 25,
        height: 25,
        marginBottom: 12
    },
    uploadfileDemoIconBox: {
        alignItems: 'center',

    }
})