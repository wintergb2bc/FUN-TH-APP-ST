import React, { Component } from 'react'
import { StyleSheet, Text, View, Dimensions, Modal, TouchableOpacity } from "react-native";
import ModalDropdownArrow from './../Common/ModalDropdownArrow'
const { width, height } = Dimensions.get("window");
import { Picker } from '@react-native-picker/picker'


export default class DatePickerView extends Component {
    constructor(props) {
        super(props);
        const pickerData = this.props.pickerData
        const selectedValueIndex = this.props.selectedValueIndex
        this.state = {
            arrowFlag: false,
            pickerData,
            selectedValueIndex,
            selectedValue: pickerData[selectedValueIndex],
            isShowDataPicker: false
        }
    }


    onCanclePickerModal(value) {
        let { selectedValueIndex } = this.state
        this.setState({
            isShowDataPicker: false,
            arrowFlag: false
        })
        this.props.onCanclePickerModal(selectedValueIndex)
    }

    onValueChange(selectedValue, selectedValueIndex) {
        this.setState({
            selectedValue,
            selectedValueIndex
        })
    }

    render() {
        const {
            pickerData,
            selectedValue,
            isShowDataPicker,
            arrowFlag,
        } = this.state


        let {
            selectedValueIndex
        } = this.props

        return <View>
            <TouchableOpacity
                onPress={() => {
                    this.setState({
                        isShowDataPicker: true,
                        arrowFlag: true
                    })
                }}
                style={[styles.toreturnModalDropdown, styles.toreturnModalDropdownTextWrap, {
                    backgroundColor: window.isBlue ? '#fff' : '#0F0F0F',
                    borderColor: window.isBlue ? '#C9C9C9' : '#00CEFF'
                }]}>
                <Text style={[styles.toreturnModalDropdownText, { color: window.isBlue ? '#707070' : '#fff' }]}>
                    {
                        pickerData[selectedValueIndex].value
                    }
                </Text>
                <ModalDropdownArrow arrowFlag={arrowFlag} />
            </TouchableOpacity>

            <Modal
                animationType="none"
                transparent={true}
                visible={isShowDataPicker}
            >
                <View style={styles.viewModalContainer}>
                    <View style={styles.viewModalBox}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity style={styles.modalHeaderBtn} onPress={this.onCanclePickerModal.bind(this)}>
                                <Text style={styles.modalHeaderText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ backgroundColor: window.isBlue ? '#f1f1f1' : '#c7c7c7' }}>
                            <Picker
                                selectedValue={selectedValue}
                                onValueChange={this.onValueChange.bind(this)}>
                                {
                                    pickerData.map((v, i) => {
                                        return <Picker.Item
                                            key={i}
                                            label={v.label}
                                            value={v.value}
                                        />
                                    })
                                }
                            </Picker>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    }
}

const styles = StyleSheet.create({
    viewModalContainer: {
        width,
        height,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, .2)',
        position: 'relative'
    },
    viewModalBox: {
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    modalHeaderText: {
        color: '#26AAE2',
        fontSize: 18
    },
    modalHeaderBtn: {
        paddingHorizontal: 20,
        height: 44,
        justifyContent: 'center'
    },
    modalHeader: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#fff'
    },
    bettingDatePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: width - 20,
        backgroundColor: '#fff'
    },
    datePickerWrapView: {
        flexDirection: 'row',
        height: 40,
        width: (width - 20) / 2.08,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#DDDDDD'
    },
    calendarImg: {
        width: 20,
        height: 20,
        position: 'absolute',
        right: 8
    },
    toreturnModalDropdown: {
        height: 40,
        borderRadius: 4,
        marginTop: 8,
        borderWidth: 1,
        justifyContent: 'center',
        overflow: 'hidden'
    },
    toreturnDropdownStyle: {
        marginTop: 10,
        width: width - 20,
        shadowColor: '#DADADA',
        shadowRadius: 4,
        shadowOpacity: .6,
        shadowOffset: { width: 2, height: 2 },
        elevation: 4
    },
    toreturnModalDropdownTextWrap: {
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden'
    },
});