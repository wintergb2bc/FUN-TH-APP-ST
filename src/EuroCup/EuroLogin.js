import React from "react";

const { width, height } = Dimensions.get("window");
import ReactNative, {
    StyleSheet,
    Text,
    Image,
    View,
    Platform,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Linking,
    NativeModules,
    Alert,
    UIManager,
    Modal
} from "react-native";
import { Actions } from "react-native-router-flux";
import Touch from 'react-native-touch-once';

class EuroLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showActive: false
        }
    }

    componentDidMount() {
        this.setState({showActive: true})
    }

    componentWillUnmount() { }


    loginPop(key) {
        key && Actions.LoginModal({ types: key == 1? 'login': 'register' })

        this.setState({showActive: false})
        this.props.EuroLogin(false)
    }

    render() {
        return <View style={{ flex: 1 }}>
            <Modal
                animationType="none"
                transparent={true}
                visible={this.state.showActive}
                onRequestClose={() => { }}
            >
                <View style={styles.modalMaster}>
                    <Image
                        style={{ width: width, height: width * 0.462 }}
                        source={require('../images/euroSoprt/loginImg.png')}
                    />
                    <View style={[styles.modalView, { backgroundColor: isBlue ? '#fff' : '#212121' }]}>
                        <Text style={{ color: isBlue ? '#58585B' : '#e2e2e2', fontSize: 16, lineHeight: 22 }}>Tự Hào Là Nhà Cái Hàng Đầu Châu Á. Đối Tác</Text>
                        <Text style={{ color: isBlue ? '#58585B' : '#e2e2e2', fontSize: 16, lineHeight: 22 }}>Chính Thức Của Tottenham Hotspurs, </Text>
                        <Text style={{ color: isBlue ? '#58585B' : '#e2e2e2', fontSize: 16, lineHeight: 22 }}>Newcastle và Đội Tuyển OG Dota 2.</Text>
                        <Touch
                            onPress={() => { this.loginPop(1) }}
                            style={{ width: width - 15, backgroundColor: '#00AEEF', borderRadius: 2, marginTop: 15, }}
                        >
                            <Text style={{ lineHeight: 40, color: '#fff', textAlign: 'center' }}>ĐĂNG NHẬP</Text>
                        </Touch>
                        <Touch
                            onPress={() => { this.loginPop(2) }}
                            style={{ width: width - 15, backgroundColor: '#33BC63', borderRadius: 2, marginTop: 15, }}
                        >
                            <Text style={{ lineHeight: 40, color: '#fff', textAlign: 'center' }}>THAM GIA NGAY</Text>
                        </Touch>
                        <Touch
                            onPress={() => { this.loginPop() }}
                            style={{ width: width - 15, marginTop: 30, }}
                        >
                            <Text style={{ color: '#25AEE1', textAlign: 'center', fontSize: 15, textDecorationLine: 'underline' }}>Tiếp Tục Trải Nghiệm Thử</Text>
                        </Touch>
                    </View>
                </View>
            </Modal>
        </View>
    }
}

const styles = StyleSheet.create({
    modalMaster: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0,0.5)',
    },
    modalView: {
        width: width,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        paddingTop: 20,
        paddingBottom: 30,
    }
})

export default EuroLogin