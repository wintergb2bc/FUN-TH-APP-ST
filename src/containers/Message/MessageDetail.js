import React from 'react'
import { StyleSheet, Text, View, Dimensions, ImageBackground, Platform, ScrollView } from 'react-native'
import moment from 'moment'
import LoadIngWebViewGif from './../Common/LoadIngWebViewGif'
import * as Animatable from 'react-native-animatable'
import { WebView } from 'react-native-webview';
import HTMLView from 'react-native-htmlview';
const { width } = Dimensions.get('window')
const AnimatableView = Animatable.View
import RenderHtml from 'react-native-render-html';
export default class MessageDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            news: this.props.news,
            flag: this.props.flag,
            time: this.props.time,
            loadD: true
        }
    }

    render() {
        const { loadD, news, flag, time } = this.state
        let webViewSource = flag ? news.AppContent : news.Content
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F' }]}>
            <View style={styles.newsTopWrap}>
                {
                    this.props.img ? <ImageBackground
                        resizeMode='stretch'
                        source={this.props.img}
                        style={styles.inboxMessagesListItemImg}>
                    </ImageBackground>
                        :
                        <View style={styles.newsCircle}></View>
                }
                <View style={styles.newsTopTextWrap}>
                    <Text style={[styles.newstTopic, { color: window.isBlue ? '#000' : '#fff', width: width - 60 }]}>{flag ? news.AppTitle : news.Topic}</Text>
                    <Text style={[styles.UpdatedAt, { color: window.isBlue ? 'rgba(0, 0, 0, .4)' : 'rgba(255, 255, 255, .4)' }]}>{time}</Text>
                </View>
            </View>


            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >

                {
                    webViewSource && <AnimatableView
                        animation={'slideInUp'}
                        easing='ease-out'
                        iterationCount='1'
                        style={{
                            width: width - 20,
                            marginHorizontal: 10
                        }}
                    >
                        {
                            ['http', 'https'].includes(webViewSource.split(':')[0].toLocaleLowerCase())
                                ?
                                (
                                    <WebView
                                        source={['http', 'https'].includes(webViewSource.split(':')[0].toLocaleLowerCase()) ? { uri: webViewSource } : { html: webViewSource }}
                                        mixedContentMode='always'
                                        javaScriptEnabled={true}
                                        domStorageEnabled={true}
                                        allowsInlineMediaPlayback
                                        mediaPlaybackRequiresUserAction
                                        allowFileAccess
                                        scalesPageToFit={false}
                                        onLoadStart={(e) => this.setState({ loadD: true })}
                                        onLoadEnd={(e) => this.setState({ loadD: false })}
                                        injectedJavaScript={`document.head.innerHTML='<meta name='viewport' content='width=device-width, initial-scale=1.0 user-scalable=no'>'`}
                                    />

                                )
                                :
                                <RenderHtml
                                    contentWidth={width - 20}
                                    baseFontStyle={{ color: "#fff", lineHeight: 22 }}
                                    source={{ html: webViewSource }}
                                />
                        }
                    </AnimatableView>
                }

                {
                    ['http', 'https'].includes(webViewSource.split(':')[0].toLocaleLowerCase()) && <LoadIngWebViewGif loadStatus={loadD} />
                }
            </ScrollView>
        </View>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    newsTopWrap: {
        borderBottomWidth: 1,
        borderBottomColor: '#707070',
        paddingVertical: 15,
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
    },
    inboxMessagesListItemImg: {
        width: 30,
        height: 26,
        marginRight: 10
    },
    newsCircle: {
        width: 40,
        height: 40,
        backgroundColor: '#D5D5D5',
        borderRadius: 100,
        marginRight: 10
    },
    newsTopTextWrap: {
        flexWrap: 'wrap',
        width: width - 60
    },
    newstTopic: {
        fontWeight: 'bold',
        flexWrap: 'wrap'
    },
    UpdatedAt: {
        fontSize: 13
    },
    htmlView: {
        paddingHorizontal: 10,
        paddingTop: 25
    }
})