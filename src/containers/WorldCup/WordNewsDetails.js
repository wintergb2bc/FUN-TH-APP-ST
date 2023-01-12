import React from 'react'
import { StyleSheet, Text, View, Dimensions, ImageBackground, ScrollView, Platform, TouchableOpacity, Image } from 'react-native'
import moment from 'moment'
import * as Animatable from 'react-native-animatable'
import Share from 'react-native-share'
const { width, height } = Dimensions.get('window')
import Video from 'react-native-video';
import HTMLView from 'react-native-htmlview';
import Toast from '@/containers/Toast'
import { Actions } from 'react-native-router-flux'

const AnimatableView = Animatable.View
export default class WordNewsDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            newsDetails: this.props.newsDetails,
            isPlayVideo: false,
            isPaused: true,
            relatedNews: '',
            isShowMoreNews: false
        }
    }

    componentDidMount() {
        this.getWorldCupNewsRelated()
    }

    shareUrl(id) {
        Toast.loading('กำลังโหลดข้อมูล...', 20000)
        fetchRequest(ApiPort.GetWC22Deeplink + `?newsId=${id}&`, 'GET').then(res => {
            Toast.hide()
            if (res.isSuccess) {
                if (!Share) {
                    Toast.fail('Chia sẻ không thành công, vui lòng thử lại')
                    return
                }
                const shareOptions = {
                    title: 'chia sẻ với mọi người',
                    url: res.result,
                    failOnCancel: false,
                }
                return Share.open(shareOptions)
            }
        }).catch(err => {
            Toast.hide()
        })
        window.PiwikMenberCode('Engagement_Event', 'Click', 'Share_News_WCPage2022')

    }

    playVideo() {
        this.setState({
            isPlayVideo: true,
            isPaused: false
        })
    }


    getWorldCupNewsRelated(v) {
        fetchCupRequest(ApiPort.GetWorldCupNews + '/' + this.props.id + '/related_number', 'GET').then(res => {
            Toast.hide()
            this.setState({
                relatedNews: res.data.relatedNews
            })
        }).catch(err => {
            Toast.hide()
        })
    }

    getWorldCupNewsDetail(v) {
        Toast.loading('กำลังโหลดข้อมูล...', 20000)
        fetchCupRequest(ApiPort.GetWorldCupNews + '/' + v.id, 'GET').then(res => {
            Toast.hide()
            if (res.data) {
                //Actions.pop()

                this.setState({
                    isPlayVideo: false,
                    isPaused: true
                })

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
        const { newsDetails, isPlayVideo, isPaused, relatedNews, isShowMoreNews } = this.state
        const { body, video, thumbnail, updatedDate, title, id } = newsDetails
        return <View style={[styles.viewContainer]} >
            <ImageBackground
                style={styles.viewBg}
                resizeMode='stretch'
                source={require('./../../images/worldCup/BG_1.png')}
            >
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    {
                        video.length > 0 ?
                            <View style={styles.videoBox}>
                                <Video
                                    source={{
                                        uri: video,
                                        mainVer: 1,
                                        patchVer: 0,
                                        type: 'm3u8',
                                        isNetwork: true,
                                    }}
                                    rate={1.0}
                                    controls={isPlayVideo}
                                    poster={"url"}
                                    muted={false}
                                    onLoad={() => { }}
                                    resizeMode={"cover"}
                                    repeat={false}
                                    style={styles.video}
                                    playWhenInactive={true}
                                    ref={ref => {
                                        this.video = ref
                                    }}
                                    paused={isPaused}
                                    onEnd={() => {
                                        this.setState({
                                            isPlayVideo: false,
                                            isPaused: true
                                        }, () => {
                                            this.video.seek(0)
                                        })
                                    }}
                                    WaitsToMinimizeStalling={false}
                                    onLoadStart={() => { }}
                                ></Video>

                                {
                                    !isPlayVideo && <View style={styles.IconVideoBox}>
                                        <TouchableOpacity onPress={this.playVideo.bind(this)}>
                                            <Image style={styles.IconVideo}
                                                resizeMode='stretch'
                                                source={require('./../../images/worldCup/Btn_Play.png')}></Image>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                            :
                            (
                                thumbnail.length > 0 && <Image
                                    style={styles.thumbnail}
                                    resizeMode='stretch'
                                    defaultSource={require('./../../images/worldCup/Default-Banner-Games_VN.jpg')}
                                    source={{ uri: thumbnail }}></Image>
                            )
                    }
                    <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
                        <View>
                            <Text style={styles.newsTitle}>{title}</Text>
                            <View style={styles.shareBox}>
                                <Text style={styles.newsListText2}>{moment(updatedDate).format('YYYY-MM-DD hh:mm:ss')}</Text>
                                <TouchableOpacity style={styles.viewShare} onPress={this.shareUrl.bind(this, id)}>
                                    <Image
                                        style={styles.viewShare}
                                        resizeMode='stretch'
                                        source={require('./../../images/worldCup/Btn_Share.png')}></Image>
                                </TouchableOpacity>
                            </View>
                        </View>


                        {
                            body.length > 0 && <HTMLView
                                value={body}
                                style={styles.htmlView}
                                stylesheet={styless}
                            ></HTMLView>
                        }

                        {
                            Array.isArray(relatedNews) && relatedNews.length > 0 && <View style={styles.newsBox}>
                                <Text style={styles.textTag}>Gợi Ý</Text>
                                {
                                    <View>
                                        {
                                            (isShowMoreNews ? relatedNews : relatedNews.slice(0, 6)).map((v, i) => <TouchableOpacity
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
                                            relatedNews.length > 6 && !isShowMoreNews && <TouchableOpacity style={styles.moreNewsBtn} onPress={() => {
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
                        }
                    </View>
                </ScrollView>
            </ImageBackground>
        </View>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    newsTitle: {
        color: '#FFFFFF',
        fontSize: 16
    },
    newsListText2: {
        color: '#9E9E9E'
    },
    viewBg: {
        width,
        flex: 1,
        height,

    },
    viewShare: {
        width: 50,
        height: 50 * .6
    },
    shareBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 15,
        marginBottom: 20
    },
    videoBox: {
        width,
        height: 200,
    },
    video: {
        width,
        height: 200,
    },
    IconVideoBox: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, .6)',
        zIndex: 100000
    },
    IconVideo: {
        width: 40,
        height: 40
    },
    webview: {
        width,
        height: height * .4,
        backgroundColor: 'red'
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
    IconVideo: {
        width: 30,
        height: 30
    },
    IconVideoBox1: {
        left: 8,
        top: 8,
        width: 28,
        height: 28,
        borderRadius: 6
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
        marginTop: 25,
    },
    webviewBox: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, .3)',
    },
    htmlView: {
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, .3)',
        paddingBottom: 15,
        overflow: 'hidden',
    },
    thumbnail: {
        width,
        height: width * .5625
    }
})

const styless = StyleSheet.create({
    span: {
        color: '#fff'
    },
    p: {
        color: '#fff'
    },
    img: {
        width: 0,
        height: 0
    }
});