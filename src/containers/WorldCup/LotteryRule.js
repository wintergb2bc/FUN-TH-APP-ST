import React from 'react'
import { StyleSheet, Text, View, Dimensions, ImageBackground,  Image, TouchableOpacity, ScrollView } from 'react-native'
import moment from 'moment'
import * as Animatable from 'react-native-animatable'
import Share from 'react-native-share'
const { width } = Dimensions.get('window')
import Video from 'react-native-video';


const AnimatableView = Animatable.View
export default class LotteryRule extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            contentOffsetY: 0
        }
    }

    onScrollPreferential(event) {
        let contentOffsetY = event.nativeEvent.contentOffset.y
        this.setState({
            contentOffsetY
        })
    }


    render() {
        const { contentOffsetY } = this.state
        return <ImageBackground
            resizeMode='stretch'
            source={require('./../../images/worldCup/BG_1.png')}
            style={[styles.viewContainer]}>
            <View style={styles.modalBoay}>
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    ref={view => { this.scrollView = view }}
                    onScroll={this.onScrollPreferential.bind(this)}
                    scrollEventThrottle={10}

                >
                    <View style={styles.lotteryInforTextBox}>
                        <Text style={styles.lotteryInforText}>1. Thời Gian Tham Gia: 21/11/2022 00:00 - 18/12/2022 23:59:59 (GMT +8). Khuyến mãi này dành cho tất cả thành viên Fun88 chơi với tiền VND.</Text>
                    </View>
                    <View style={styles.lotteryInforTextBox}>
                        <Text style={styles.lotteryInforText}>2. Cách tham gia:</Text>
                        <Text style={styles.lotteryInforText}> - Số lượt chơi sẽ dựa trên tổng số tiền gửi được chấp thuận của thành viên tích lũy trong ngày, tiền gửi tối thiểu là 300.000 VND, như bảng dưới đây</Text>
                    </View>


                    <View>
                        <View style={styles.lotteryTrBox}>
                            <View style={[styles.lotteryTr, styles.lotteryTr1,]}>
                                <Text style={[styles.lotteryTrText, styles.lotteryTrText6]}>Tiền Gửi ( VND)</Text>
                            </View>
                            <View style={[styles.lotteryTr, styles.lotteryTr2, styles.lotteryTr5]}>
                                <Text style={[styles.lotteryTrText, styles.lotteryTrText6]}>Lượt Chơi​</Text>
                            </View>

                            <View style={[styles.lotteryTr, styles.lotteryTr4, styles.lotteryTr5]}>
                                <Text style={[styles.lotteryTrText, styles.lotteryTrText6]}>Lượt Chơi Tối Đa</Text>
                            </View>
                        </View>

                        <View style={styles.lotteryBody}>
                            <View style={styles.lotteryTrBox1}>
                                <View style={[styles.lotteryTr0, styles.lotteryTr1]}>
                                    <Text style={[styles.lotteryTrText, styles.lotteryTrText1]}>300.000 – 999.000​</Text>
                                </View>
                                <View style={[styles.lotteryTr0, styles.lotteryTr1]}>
                                    <Text style={[styles.lotteryTrText, styles.lotteryTrText1]}>1.000.000 - 2.499.000​</Text>
                                </View>
                                <View style={[styles.lotteryTr0, styles.lotteryTr1]}>
                                    <Text style={[styles.lotteryTrText, styles.lotteryTrText1]}>2.500.000 - 4.999​.000</Text>
                                </View>
                                <View style={[styles.lotteryTr0, styles.lotteryTr1]}>
                                    <Text style={[styles.lotteryTrText, styles.lotteryTrText1]}>5.000.000 - 9.999.000​</Text>
                                </View>
                                <View style={[styles.lotteryTr0, styles.lotteryTr1]}>
                                    <Text style={[styles.lotteryTrText, styles.lotteryTrText1]}>Từ 10.000.000 trở lên </Text>
                                </View>
                            </View>

                            <View style={styles.lotteryTrBox1}>
                                <View style={[styles.lotteryTr0, styles.lotteryTr2]}>
                                    <Text style={[styles.lotteryTrText, styles.lotteryTrText1]}>1</Text>
                                </View>
                                <View style={[styles.lotteryTr0, styles.lotteryTr2]}>
                                    <Text style={[styles.lotteryTrText, styles.lotteryTrText1]}>2</Text>
                                </View>
                                <View style={[styles.lotteryTr0, styles.lotteryTr2]}>
                                    <Text style={[styles.lotteryTrText, styles.lotteryTrText1]}>3</Text>
                                </View>
                                <View style={[styles.lotteryTr0, styles.lotteryTr2]}>
                                    <Text style={[styles.lotteryTrText, styles.lotteryTrText1]}>4</Text>
                                </View>
                                <View style={[styles.lotteryTr0, styles.lotteryTr2]}>
                                    <Text style={[styles.lotteryTrText, styles.lotteryTrText1]}>5</Text>
                                </View>
                            </View>



                            <View style={[styles.lotteryTrBox2, styles.lotteryTr4, styles.lotteryTrBox3]}>
                                <Text style={[styles.lotteryTrText, styles.lotteryTrText1]}>5 Lượt/Ngày</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.lotteryInforTextBox}>
                        <Text style={styles.lotteryInforText}>Ví dụ: </Text>
                        <Text style={styles.lotteryInforText}>Vào ngày 21/11/2022, thành viên gửi tiền lần đầu thành công số tiền 300.000 VND, thành viên được 1 lượt chơi. Khi thành viên gửi tiền lần thứ 2 thành công số tiền 2.700.000 VND trong cùng ngày, tổng số tiền gửi trong ngày sẽ là 3.000.000 VND (300.000 +2.700.000) và thành viên được chơi số lần còn lại.</Text>
                    </View>
                    <View style={styles.lotteryInforTextBox}>
                        <Text style={styles.lotteryInforText}>- Thành viên chơi bằng cách nhấp vào quả bóng.</Text>
                        <Text style={styles.lotteryInforText}>- Số lần chơi chưa hoàn thành sẽ không được dùng vào ngày tiếp theo.</Text>
                    </View>
                    <View style={styles.lotteryInforTextBox}>
                        <Text style={styles.lotteryInforText}>3. Giải thưởng: Cược Miễn Phí, Điểm Thưởng, Quà Bí Ẩn</Text>
                    </View>
                    <View style={styles.lotteryInforTextBox}>
                        <Text style={styles.lotteryInforText}>4. Thời gian cộng thưởng:</Text>
                        <Text style={styles.lotteryInforText}>- Cược Miễn Phí (Ví Chính): Trong vòng 30 phút sau khi được thưởng. </Text>
                        <Text style={styles.lotteryInforText}>- Điểm Thưởng (Chương Trình Thưởng FUN88): Trong vòng 30 phút sau khi được thưởng.</Text>
                        <Text style={styles.lotteryInforText}>- Vật Phẩm: Trong vòng 30 ngày sau khi thông tin vận chuyển được xác nhận.</Text>
                    </View>
                    <View style={styles.lotteryInforTextBox}>
                        <Text style={styles.lotteryInforText}>5. Điểm Thưởng:</Text>
                        <Text style={styles.lotteryInforText}>Điểm Thưởng sẽ được tự động thêm vào Chương Trình Giải Thưởng FUN88 của thành viên sau khi nhận và sẽ hết hạn trong vòng ba mươi (30) ngày mà không được sử dụng</Text>
                    </View>
                    <View style={styles.lotteryInforTextBox}>
                        <Text style={styles.lotteryInforText}>6. Cược Miễn Phí:</Text>
                        <Text style={styles.lotteryInforText}>Cược miễn phí sẽ được tự động thêm vào Ví Chính của thành viên sau khi nhận và sẽ hết hạn nếu không được sử dụng trong vòng ba mươi (30) ngày. Thành viên cần hoàn thành 1 vòng cược trước khi cược miễn phí có thể được rút.</Text>
                    </View>
                    <View style={styles.lotteryInforTextBox}>
                        <Text style={styles.lotteryInforText}>7. Vật Phẩm:</Text>
                        <Text style={styles.lotteryInforText}>- Fun88 sẽ liên hệ với các thành viên chiến thắng trong vòng 7 ngày sau khi khuyến mãi kết thúc. Thành viên phải cung cấp đầy đủ thông tin nhận hàng chính xác: Tên người nhận, địa chỉ, số điện thoại, để được nhận quà.</Text>
                        <Text style={styles.lotteryInforText}>- Phần thưởng sẽ bị hủy nếu thành viên cung cấp thông tin không chính xác hoặc không liên lạc được.</Text>
                        <Text style={styles.lotteryInforText}>- Phần thưởng vật phẩm không thể được qui đổi sang tiền mặt, cược miễn phí, vòng quay miễn phí hoặc điểm thưởng.</Text>
                    </View>
                    <View style={styles.lotteryInforTextBox}>
                        <Text style={styles.lotteryInforText}>8. Điều Khoản và Điều Kiện Chung được áp dụng.</Text>
                    </View>
                </ScrollView>

                {
                    contentOffsetY > 0 && <TouchableOpacity
                        onPress={() => {
                            this.scrollView.scrollTo({ x: 0, y: 0, animated: true }, 1)
                        }}
                        style={styles.ArrowWrap}>
                        <Image resizeMode='stretch'
                            source={require('./../../images/worldCup/Icon-Arrow.png')}
                            style={styles.Arrow}></Image>
                        <Text style={styles.ArrowWrapTExt}>Về Đầu Trang​</Text>
                    </TouchableOpacity>
                }
            </View>
        </ImageBackground>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    modalBoay: {
        marginVertical: 20,
        marginHorizontal: 10,
        width: width - 20,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        borderRadius: 10,
        marginBottom: 40,
        padding: 20,
        flex: 1
    },
    ArrowWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(37, 174, 225, .7)',
        borderRadius: 100000,
        width: 50,
        paddingVertical: 10,
        position: 'absolute',
        right: 10,
        bottom: 10
    },
    Arrow: {
        height: 25,
        width: 25,
        marginBottom: 5
    },
    ArrowWrapTExt: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 10
    },
    lotteryInforTextBox: {
        marginBottom: 15
    },
    lotteryTrBox: {
        backgroundColor: '#012557',
        flexDirection: 'row',
    },
    lotteryTr: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lotteryTr1: {
        width: (width - 60) * .45,
    },
    lotteryTr2: {
        width: (width - 60) * .2,
    },
    lotteryTr3: {
        width: (width - 60) * .2,
    },
    lotteryTr4: {
        width: (width - 60) * .35,
    },
    lotteryTr5: {
        borderLeftWidth: 1,
        borderColor: 'gray'
    },
    lotteryTrText: {
        fontSize: 12,
        color: '#012557',
        textAlign: 'center'
    },
    lotteryTrText1: {
        color: '#012557'
    },
    lotteryTrBox1: {

    },
    lotteryTr0: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#012557',
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderLeftColor: '#012557'
    },
    lotteryBody: {
        flexDirection: 'row',
        marginBottom: 20
    },
    lotteryTrBox2: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 1,
        borderLeftColor: '#012557',
        borderBottomColor: '#012557',
        borderBottomWidth: 1,
    },
    lotteryTrBox3: {
        borderRightColor: '#012557',
        borderRightWidth: 1
    },
    lotteryInforText: {
        color: '#012557',
        width: width - 60,
        flexWrap: 'wrap'
    },
    lotteryTrText6: {
        color: '#FFFFFF'
    }
})