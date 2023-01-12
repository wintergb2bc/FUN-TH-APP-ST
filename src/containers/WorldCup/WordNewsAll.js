import React from 'react'
import { StyleSheet, Text, View, Dimensions, ImageBackground, ScrollView, Platform, TouchableOpacity, Image } from 'react-native'
import moment from 'moment'
import * as Animatable from 'react-native-animatable'
import Share from 'react-native-share'
const { width, height } = Dimensions.get('window')
import Video from 'react-native-video';
import Carousel, { Pagination } from 'react-native-snap-carousel'
import Toast from '@/containers/Toast'
import { Actions } from 'react-native-router-flux'
const AnimatableView = Animatable.View
export default class WordNewsAll extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            newsList: this.props.newsList,
            bannerIndex: 0,
            isShowMoreNews: false
        }
    }

    renderNewsPage(item) {
        let isShowPlayerIcon = item.item.isShowPlayerIcon
        return <TouchableOpacity key={item.index} style={[styles.carouselImg]}
            onPress={this.getWorldCupNewsDetail.bind(this, item.item)}
        >
            {
                isShowPlayerIcon && <View style={styles.IconVideoBox}>
                    <Image style={styles.IconVideo}
                        resizeMode='stretch'
                        source={require('./../../images/worldCup/Icon-Video.png')}></Image>
                </View>
            }

            <View style={styles.newOverly}>
                {
                    item.item.title.length > 0 && <Text style={styles.newOverlyText}>{item.item.title}</Text>
                }
            </View>
            <Image
                resizeMode='stretch'
                style={styles.carouselImg}
                defaultSource={require('./../../images/worldCup/Default-Banner-Games_VN.jpg')}
                source={{ uri: item.item.thumbnail }} />
        </TouchableOpacity>
    }

    getWorldCupNewsDetail(v) {
        Toast.loading('กำลังโหลดข้อมูล...', 20000)
        fetchCupRequest(ApiPort.GetWorldCupNews + '/' + v.id, 'GET').then(res => {
            Toast.hide()
            if (res.data) {
                let flag = Object.keys(res.data)
                if (!(Array.isArray(flag) && flag.length)) return
                Actions.WordNewsDetails({
                    newsDetails: res.data,
                    id: v.id
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    render() {
        const { newsList, bannerIndex, isShowMoreNews } = this.state
        const { } = newsList
        return <ImageBackground style={styles.viewBg}
            resizeMode='stretch'
            source={require('./../../images/worldCup/BG_1.png')} >
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >

                {
                    (Array.isArray(newsList) && newsList.length > 0) ?
                        <View style={{ flexDirection: 'row' }}>
                            <Carousel
                                data={newsList.filter(v => v.sticky)}
                                renderItem={this.renderNewsPage.bind(this)}
                                sliderWidth={width}
                                itemWidth={width - 52}
                                inactiveSlideScale={1}
                                autoplay={true}
                                loop={true}
                                autoplayDelay={500}
                                autoplayInterval={4000}
                                onSnapToItem={index => { this.setState({ bannerIndex: index }) }}
                            />
                            <Pagination
                                dotsLength={newsList.filter(v => v.sticky).length}
                                activeDotIndex={bannerIndex}
                                containerStyle={styles.containerStyle}
                                dotStyle={styles.dotStyle}
                                inactiveDotStyle={styles.inactiveDotStyle}
                                inactiveDotOpacity={1}
                                inactiveDotScale={0.6}
                            />
                        </View>
                        :
                        <Image
                            resizeMode='stretch'
                            style={[styles.carouselImg, styles.carouselImg1]}
                            source={require('./../../images/worldCup/Default-Banner-Games_VN.jpg')}
                        />
                }


                <View style={styles.newsBox}>
                    <Text style={styles.textTag}>Gợi Ý</Text>
                    {
                        Array.isArray(newsList) && newsList.length > 0 && <View>
                            {
                                (isShowMoreNews ? newsList.filter(v => !v.sticky) : newsList.filter(v => !v.sticky).slice(0, 6)).map((v, i) => <TouchableOpacity
                                    onPress={this.getWorldCupNewsDetail.bind(this, v)}
                                    style={styles.newsList}
                                    key={i}>
                                    <View style={styles.newsListImgBox}>
                                        <Image resizeMode='stretch'
                                            source={{ uri: v.thumbnail }}
                                            style={styles.newsListImg}></Image>
                                    </View>

                                    <View style={styles.newsListTextBox}>
                                        <Text style={styles.newsListText1}>{v.title}</Text>
                                        <Text style={styles.newsListText2}>{moment(v.updatedDate).format('YYYY-MM-DD hh:mm:ss')}</Text>
                                    </View>

                                    {
                                        v.isShowPlayerIcon &&
                                        <View style={[styles.IconVideoBox, styles.IconVideoBox1]}>
                                            <Image style={[styles.IconVideo, styles.IconVideo1]}
                                                resizeMode='stretch'
                                                source={require('./../../images/worldCup/Icon-Video.png')}></Image>
                                        </View>
                                    }
                                </TouchableOpacity>)
                            }

                            {
                                newsList.length > 6 && !isShowMoreNews && <TouchableOpacity style={styles.moreNewsBtn} onPress={() => {
                                    this.setState({
                                        isShowMoreNews: !isShowMoreNews
                                    })
                                }}>
                                    <Text style={styles.moreNewsBtnText}>Tải Thêm</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    }
                </View>

            </ScrollView>
        </ImageBackground>
    }
}

const styles = StyleSheet.create({
    viewBg: {
        width,
        flex: 1,
        paddingTop: 15,
    },
    containerStyle: {
        paddingVertical: 2,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -25
    },
    dotStyle: {
        width: 10,
        height: 5,
        borderRadius: 5,
        backgroundColor: '#FFE786'
    },
    inactiveDotStyle: {
        width: 5,
        backgroundColor: '#B8B8B8'
    },
    carouselImg: {
        width: width - 60,
        height: (width - 60) * .45,
        borderRadius: 6
    },
    carouselImg1: {
        width
    },
    moreNewsBtn: {
        width: width - 20,
        height: 48,
        backgroundColor: '#FFE05C',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 60
    },
    moreNewsBtnText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    newsListImg: {
        width: (width - 20) * .35,
        height: 80,
        borderRadius: 8,
        overflow: 'hidden'
    },
    newsListTextBox: {
        justifyContent: 'space-between',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, .3)',
        width: (width - 20) * .65 - 15,
    },
    newsListText1: {
        color: '#FFFFFF',
        fontSize: 13,
        flexWrap: 'wrap',
    },
    newsListText2: {
        color: 'rgba(255, 255, 255, .6)',
        fontSize: 11
    },
    newsListImgBox: {
        width: (width - 20) * .35,
        height: 80,
        borderRadius: 8,
        overflow: 'hidden'
    },
    moreNewsBtnText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    IconVideoBox: {
        borderRadius: 1000,
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, .5)',
        top: 20,
        left: 20,
        zIndex: 100000
    },
    IconVideo: {
        width: 30,
        height: 30
    },
    IconVideoBox1: {
        left: 8,
        top: 8,
        width: 30,
        height: 30
    },
    IconVideo1: {
        width: 15,
        height: 15
    },
    newsList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    textTag: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15
    },
    newsBox: {
        width: width - 20,
        marginTop: 40,
        marginHorizontal: 10
    },
    newOverlyText: {
        color: '#fff',
        flexWrap: 'wrap',
        width: width - 120,
    },
    newOverly: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, .4)',
        zIndex: 1000,
        justifyContent: 'flex-end',
        padding: 15
    },
})