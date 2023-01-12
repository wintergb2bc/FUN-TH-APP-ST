import React from 'react'
import { StyleSheet, Text, View, ScrollView, Dimensions, ImageBackground, Modal, TouchableOpacity } from 'react-native'
import moment from 'moment'
import { toThousands } from '../../../actions/Reg'
import LoadIngImgActivityIndicator from './../../Common/LoadIngImgActivityIndicator'

const { width, height } = Dimensions.get('window')

export default class RebateRecordDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // rebates: this.props.rebates,
            // thumbnailMobileImage: this.props.thumbnailMobileImage,
            // rebateBanner: [],
            // gameLoadObj: {}
        }
    }

    getLoadImgStatus(i, flag) {
        this.state.gameLoadObj[`imgStatus${i}`] = flag
        this.setState({})
    }

    render() {
        const { thumbnailMobileImage, rebates, rebateBanner } = this.props
        const RewardHistoryText1Color = { color: window.isBlue ? '#727272' : '#fff' }
        const RewardHistoryText2Color = { color: window.isBlue ? '#25AAE1' : '#00AEEF' }
        return <Modal animationType='fade' transparent={true} visible={this.props.openDatailFlag}>
            <View style={styles.homeModalContainer}>
                <View style={{ height: height * .8, backgroundColor: '#F3F4F8', borderTopRightRadius: 20, borderTopLeftRadius: 20, overflow: 'hidden' }}>

                    <View style={{ backgroundColor: '#00ADEF', paddingTop: 30, paddingBottom: 20, alignItems: 'center' }}>
                        <TouchableOpacity style={{ position: 'absolute', left: 10, top: 16 }} onPress={() => {
                            this.props.openDatail(false)
                        }}>
                            <Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold' }}>X</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>สล็อต / ยิงปลา</Text>
                    </View>
                    <ScrollView
                        automaticallyAdjustContentInsets={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ padding: 10 }}>
                            {
                                Array.isArray(rebates) && rebates.length > 0 && rebates.map((v, i) => {
                                    return <View key={i} style={[styles.rewardHistory, { backgroundColor: window.isBlue ? '#fff' : '#212121' }]}>
                                        <View style={styles.rewardHistoryRow}>
                                            <View style={styles.rewardHistoryTextWrap}>
                                                <Text style={[styles.rewardHistoryText1, RewardHistoryText1Color]}>วันที่</Text>
                                                <Text style={[styles.rewardHistoryText2, RewardHistoryText2Color]}>{moment(v.applyDate).format('YYYY-MM-DD')}</Text>
                                            </View>
                                            <View style={styles.rewardHistoryTextWrap}>
                                                <Text style={[styles.rewardHistoryText1, RewardHistoryText1Color]}>ยอดหมุนเวียน</Text>
                                                <Text style={[styles.rewardHistoryText2, RewardHistoryText2Color]}>{toThousands(v.validTurnover)}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.rewardHistoryRow}>
                                            <View style={styles.rewardHistoryTextWrap}>
                                                <Text style={[styles.rewardHistoryText1, RewardHistoryText1Color]}>ประเภท</Text>
                                                <Text style={[styles.rewardHistoryText2, RewardHistoryText2Color]}>{v.rebateCategory}</Text>
                                            </View>
                                            <View style={styles.rewardHistoryTextWrap}>
                                                <Text style={[styles.rewardHistoryText1, RewardHistoryText1Color]}>เงินคืน</Text>
                                                <Text style={[styles.rewardHistoryText2, RewardHistoryText2Color]}>{toThousands(v.rebateAmount)}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.rewardHistoryRow}>
                                            <View style={styles.rewardHistoryTextWrap}>
                                                <Text style={[styles.rewardHistoryText1, RewardHistoryText1Color]}>อัตราเงินคืน</Text>
                                                <Text style={[styles.rewardHistoryText2, RewardHistoryText2Color]}>{v.rebateRate}% ({v.platform * 1 === 2 ? 'ทั้งหมด' : 'ทั้งหมด'})</Text>
                                            </View>
                                            <View style={styles.rewardHistoryTextWrap}>
                                                <Text style={[styles.rewardHistoryText1, RewardHistoryText1Color]}>รหัส</Text>
                                                <Text style={[styles.rewardHistoryText2, RewardHistoryText2Color]}>{v.playerRebateID}</Text>
                                            </View>
                                        </View>
                                    </View>
                                })
                            }
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        position: 'relative',
    },
    rebateCarousel: {
        height: 150,
        width
    },
    rebateTop: {
        height: .4 * width,
        width,
        backgroundColor: '#D5D5D5',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rebateTopText: {
        fontWeight: 'bold',
        color: '#727272',
        fontSize: 20
    },
    rewardHistory: {
        borderRadius: 5,
        marginBottom: 10,
        padding: 4,
        paddingHorizontal: 8
    },
    rewardHistoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4
    },
    rewardHistoryTextWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: (width - 40) / 2,
        flexWrap: 'wrap'
    },
    rewardHistoryText1: {
        fontSize: 12,
        width: 75,
    },
    rewardHistoryText2: {
        fontWeight: 'bold',
        width: ((width - 40) / 2) - 75,
        fontSize: 13
    },
    homeModalContainer: {
        width,
        height,
        backgroundColor: 'rgba(0, 0, 0, .6)',
        justifyContent: 'flex-end'
    },
})