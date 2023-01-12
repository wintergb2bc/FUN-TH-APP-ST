import React from 'react'
import { StyleSheet, Text, View, Dimensions, TextInput, ImageBackground } from 'react-native'
import Toast from '@/containers/Toast'
import { Actions } from 'react-native-router-flux'
import Touch from 'react-native-touch-once'
import LinearGradient from 'react-native-linear-gradient'
import { namereg, EmailReg } from '../../actions/Reg'
const { width } = Dimensions.get('window')
class ForgetPassword extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '', //用戶名
            email: '', //郵箱
            isSuccess: false
        }
    }

    postRegist() {
        window.PiwikMenberCode('Navigation', 'Submit', 'Submit_ForgetPW')
        let { email, name } = this.state //註冊訊息

        if (email == '') {
            Toast.fail('ไม่สามารถเว้นช่องอีเมล์ได้', 2)
            return
        } else if (!EmailReg.test(email)) {
            Toast.fail('รูปแบบอีเมล์ไม่ถูกต้อง', 2)
            return
        }


        if (name == '') {
            Toast.fail('ไม่สามารถเว้นช่องยูสเซอร์เนมได้', 2)
            return
        }
        // else if (!namereg.test(name)) {
        //     Toast.fail('ยูสเซอร์เนมต้องมีขั้นต่ำ 6 ตัวอักษร แต่ไม่มากกว่า 14 ตัวอักษร', 2)
        //     return
        // } else if (name.length < 6 || name.length > 14) {
        //     Toast.fail(`อนุญาตให้ใช้ตัวอักษร 'A-Z', 'a-z' หรือตัวเลข '0-9' เท่านั้น`, 2)
        //     return
        // }


        Toast.loading('กำลังโหลด', 2000)
        let body = {
            "memberCode": name,
            "email": email,
            "ipAddress": ""
        }


        fetchRequest(ApiPort.ForgetPassword + '?', 'POST', body).then(data => {
            Toast.hide()
            if (data.isSuccess) {
                let message = data.result.message
                message && Toast.success(message, 2)
                this.setState({
                    isSuccess: true
                })
            } else {
                let result = data.result
                let errorMessage = result.errorMessage
                if (errorMessage) {
                    Toast.fail(errorMessage, 2)
                }
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

    handleUsername = name => {
        this.setState({ name: name.trim() })
    }

    render() {
        const { isSuccess } = this.state
        return <ImageBackground
            source={require('./../../images/login/login_bg.png')}
            resizeMode='stretch'
            style={styles.viewContainer}>
            {
                isSuccess ? <View>
                    <Text style={{ color: '#fff', fontSize: 14, marginBottom: 10, textAlign: 'center', marginTop: 25 }}>{this.state.email}</Text>
                    <Text style={{ color: '#fff', fontSize: 14, textAlign: 'center', paddingHorizontal: 20 }}>เราเพิ่งส่งอีเมลไปยังอีเมลของคุณ โปรดยืนยันอีเมลของคุณและทำตามคำแนะนำเพื่อรีเซตรหัสผ่านของคุณ</Text>

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
                        <View>
                            <Text style={styles.inputText}>อีเมล</Text>
                            <TextInput
                                value={this.state.email}
                                onChangeText={this.handleUseremail}
                                labelNumber={4}
                                placeholder='กรอกอีเมล'
                                placeholderTextColor='#DDDDDD'
                                style={[
                                    styles.input
                                ]}
                            />

                            <Text style={{ color: '#FFFFFF', fontSize: 12 }}>คำเตือน! กรุณากรอกอีเมลที่คุณใช้สมัคร</Text>
                        </View>

                        <View style={{ marginTop: 15 }}>
                            <Text style={styles.inputText}>ยูสเซอร์เนม</Text>
                            <TextInput
                                value={this.state.name}
                                onChangeText={this.handleUsername}
                                labelNumber={4}
                                placeholderTextColor='#DDDDDD'
                                placeholder='กรอกยูสเซอร์เนม'
                                style={[
                                    styles.input
                                ]}
                            />
                        </View>

                        <Touch
                            onPress={this.postRegist.bind(this)}
                            style={{ marginTop: 20 }}
                        >
                            <View style={styles.success}>
                                <Text style={{ color: 'white' }}>ยืนยัน</Text>
                            </View>
                        </Touch>
                    </View>
            }

            <View>
            </View>
        </ImageBackground>
    }
}
export default ForgetPassword
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