import React from 'react'
import { StyleSheet, Text, View, Dimensions, TextInput, ImageBackground } from 'react-native'
import Toast from '@/containers/Toast'
import { Actions } from 'react-native-router-flux'
import Touch from 'react-native-touch-once'
import { EmailReg, emailFun } from '../../actions/Reg'

const { width } = Dimensions.get('window')
class ForgetUsername extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '', //郵箱
            isSuccess: false
        }
    }

    postRegist() {
        window.PiwikMenberCode('Navigation', 'Submit', 'Submit_ForgetUN')
        let { email } = this.state //註冊訊息


        if (email == '') {
            Toast.fail('ไม่สามารถเว้นช่องอีเมล์ได้', 2)
            return
        } else if (!EmailReg.test(email)) {
            Toast.fail('รูปแบบอีเมล์ไม่ถูกต้อง', 2)
            return
        }
        Toast.loading('กำลังโหลด', 2000)

        fetchRequest(ApiPort.ForgetUsername + '?email=' + email + '&', 'GET').then(data => {
            Toast.hide()
            if (data.isSuccess == false) {
                Toast.fail(data.message, 2)
            } else {
                this.setState({
                    isSuccess: true
                })
                let message = data.result.message
                message && Toast.success(message, 2)
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    handleUseremail = email => {
        this.setState({
            email: email.trim()
        })
    }

    render() {
        return <ImageBackground
            source={require('./../../images/login/login_bg.png')}
            resizeMode='stretch'
            style={styles.viewContainer}>
            {
                this.state.isSuccess ?
                    <View>
                        <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10, textAlign: 'center', marginTop: 25 }}>{this.state.email}</Text>
                        <Text style={{ color: '#fff', fontSize: 14, textAlign: 'center' }}>เราได้ส่งอีเมลถึงคุณ กรุณาตรวจสอบ</Text>

                        <Touch onPress={() => {
                            Actions.pop()
                        }} style={{ marginTop: 30 }}>
                            <View style={styles.success}>
                                <Text style={{ color: 'white' }}>ยืนยัน</Text>
                            </View>
                        </Touch>
                    </View>
                    :
                    <View>
                        <Text style={styles.inputText}>อีเมล</Text>
                        <TextInput
                            value={this.state.email}
                            onChangeText={this.handleUseremail}
                            labelNumber={4}
                            placeholder='กรอกอีเมล'
                            placeholderTextColor='#DDDDDD'
                            maxLength={50}
                            style={[
                                styles.input
                            ]}
                        />

                        <Text style={{ color: '#FFFFFF', fontSize: 12 }}>คำเตือน! กรุณากรอกอีเมลที่คุณใช้สมัคร</Text>

                        <Touch onPress={() => {
                            this.postRegist()
                        }}
                            style={{ marginTop: 20 }}>
                            <View style={styles.success}>
                                <Text style={{ color: 'white' }}>ยืนยัน</Text>
                            </View>
                        </Touch>

                    </View>
            }
        </ImageBackground>
    }
}

export default ForgetUsername
const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#000',
        paddingHorizontal: 15,
        paddingTop: 20
    },
    inputText: {
        color: '#fff',
        textAlign: 'left',
        alignSelf: 'flex-start'
    },
    success: {
        width: width - 70,
        marginHorizontal: 20,
        backgroundColor: '#00AEEF',
        borderColor: '#00AEEF',
        padding: 10,
        // borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 17,
        borderRadius: 6,
        marginTop: 20
    },
    ErrorText: {
        color: 'red',
        width: '100%',
        textAlign: 'left',
        marginBottom: 5
    },
    input: {
        width: width - 30,
        backgroundColor: '#fff',
        textAlign: 'left',
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 10,
        marginBottom: 8,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#F2F2F2',
        paddingLeft: 10,
        color: '#000',
        borderRadius: 4
    }
})