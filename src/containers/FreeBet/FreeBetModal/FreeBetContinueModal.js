import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal } from 'react-native'
import { Actions } from 'react-native-router-flux'

const { width, height } = Dimensions.get('window')

export default class FreeBetContinueModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return <Modal animationType='fade' visible={true} transparent={true}>
            <View style={styles.viewModalContainer}>
                <View style={[styles.viewModalBox]}>
                    <Text style={styles.continueBodyText1}>Chỉ còn 1 bước để nhận thưởng. Vui lòng đảm bảo thông tin được điền chính xác</Text>
                    <Text style={styles.continueBodyText2}>Chọn đóng cửa sổ này đồng nghĩa với việc bạn sẽ không thể nhận Thưởng Thành Viên Mới. Bạn có chắc chắn muốn đóng?</Text>

                    <View>
                        <TouchableOpacity
                            style={styles.freeBtn}
                            onPress={() => {
                                this.props.changeFreeBetContinueModal(false)


                                window.PiwikMenberCode('ClosePopup_Continue')
                            }}>
                            {/* 继续验证 */}
                            <Text style={[styles.freeBtnText, { color: '#fff' }]}>Tiếp Tục Xác Minh</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.freeBtn, { backgroundColor: '#fff' }]}
                            onPress={() => {
                                this.props.changeFreeBetContinueModal(false)
                                Actions.pop()

                                window.PiwikMenberCode('ClosePopup_SkipVerification')
                            }}>
                            {/* 关闭视窗 */}
                            <Text style={[styles.freeBtnText, { color: '#25AAE1' }]}>Đóng Cửa Sổ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    }
}

const styles = StyleSheet.create({
    viewModalContainer: {
        width,
        height,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .7)',
        alignItems: 'center',
    },
    viewModalBox: {
        backgroundColor: '#fff',
        width: width - 20,
        position: 'relative',
        borderRadius: 12,
        padding: 15
    },
    continueBodyText1: {
        textAlign: 'center',
        color: '#25AAE1',
        marginTop: 15,
        marginBottom: 20,
        fontWeight: 'bold',
        marginHorizontal: 15
    },
    continueBodyText2: {
        textAlign: 'center',
        color: '#000',
        marginBottom: 35,
        marginHorizontal: 15
    },
    freeBtn: {
        height: 46,
        backgroundColor: '#25AAE1',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#25AAE1'
    },
    freeBtnText: {
        color: '#fff',
        fontWeight: 'bold'
    },
})