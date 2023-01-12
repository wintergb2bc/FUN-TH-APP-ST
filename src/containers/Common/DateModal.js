import React, { Component } from 'react'
import { StyleSheet, Text, TextInput, View, Dimensions, Modal, TouchableOpacity } from "react-native";
const { width, height } = Dimensions.get("window");
import { DatePicker } from "react-native-common-date-picker";
import moment from 'moment'

{/* <DateModal
dateModalVisible={dateModalVisible}
type={'MM-DD-YYYY'}
minDate={'1920/1/1'}
maxDate={new Date()}
confirmText={'确定'}
toolBarConfirmStyle={{ color: '#2e4d2e', fontWeight: 'bold' }}
cancelText={'×'}
toolBarCancelStyle={{ color: '#2e4d2e', fontSize: 30 }}
titleText={'日期选择'}
titleStyle={{ color: '#2e4d2e', fontWeight: 'bold' }}
confirm={this.dateSelect}
cancel={() => { this.setState({ dateModalVisible: false }) }}
/> */}



export default class DateModal extends Component {


    constructor(props) {
        super(props);
        this.state = {

        }
    }

    dateSelect = (e) => {
        this.props.confirm(e)
    }

    dateClose = () => {
        this.props.cancel()
    }

    render() {
        const {
            dateModalVisible,
            type,
            minDate,
            maxDate,
            confirmText,
            toolBarConfirmStyle,
            cancelText,
            toolBarCancelStyle,
            titleText,
            titleStyle,
            confirm,
            cancel,
        } = this.props

        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={dateModalVisible}
            >
                <View style={styles.dateModalActive}>
                    <TouchableOpacity style={styles.maskView} onPress={cancel} />
                    <View style={styles.dateModalCenter}>
                        <DatePicker
                        locale={'th'}
                            type={type ? type : 'DD-MM-YYYY'}
                            minDate={minDate ? moment(minDate).format('YYYY-MM-DD') : '1920-01-01'}
                            maxDate={maxDate ? moment(maxDate).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD')}
                            confirmText={confirmText ? confirmText : 'Chọn'}
                            toolBarConfirmStyle={toolBarConfirmStyle ? toolBarConfirmStyle : { color: '#2e4d2e', fontWeight: 'bold' }}
                            cancelText={cancelText ? cancelText : '×  '}
                            toolBarCancelStyle={toolBarCancelStyle ? toolBarCancelStyle : { color: '#2e4d2e', fontSize: 30 }}
                            titleText={titleText ? titleText : 'Chọn thời gian'}
                            titleStyle={titleStyle ? titleStyle : { color: '#2e4d2e', fontWeight: 'bold' }}
                            confirm={confirm}
                            cancel={cancel}
                        />
                    </View>
                </View>

            </Modal>

        )
    }


}

const styles = StyleSheet.create({
    maskView: {
        width: width,
        height: height,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
    },
    dateModalActive: {
        width: width,
        height: height,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, .3)',
    },
    dateModalCenter: {
        width: width,
        backgroundColor: '#fff',
        height: 280,
    },
});