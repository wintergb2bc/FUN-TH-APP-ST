import React from 'react'
import { StyleSheet, View, Dimensions, Image, Platform } from 'react-native'
import { connect } from 'react-redux'
import { getBalanceInforAction } from '../../../actions/ReducerAction'
import { Actions } from 'react-native-router-flux'
import { WebView } from 'react-native-webview';
const { width, height } = Dimensions.get('window')
import LoadIngWebViewGif from './../../Common/LoadIngWebViewGif'
class LeaderboardContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loadD: true
        }
    }


    render() {
        const { loadD } = this.state
        const { leaderboardUrl } = this.props

        return <View style={styles.viewContainer}>
            <WebView
                onLoadStart={(e) => this.setState({ loadD: true })}
                onLoadEnd={(e) => this.setState({ loadD: false })}
                renderLoading={(e) => { }}
                source={{
                    uri: leaderboardUrl,
                    headers: {
                        'Authorization': ApiPort.Token ? ApiPort.Token : '',
                        'Content-Type': 'application/json charset=utf-8',
                        'Culture': 'th-th',
                    }
                }}
                mixedContentMode='always'
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction
                allowFileAccess
                scalesPageToFit={false}
                style={{ width, height, flex: 1 }}
                onNavigationStateChange={(even) => { }}
            />

            <LoadIngWebViewGif
                loadStatus={loadD}
            />
        </View>
    }
}

export default Leaderboard = connect(
    (state) => {
        return {
            balanceInforData: state.balanceInforData,
        }
    }, (dispatch) => {
        return {
            getBalanceInforAction: () => dispatch(getBalanceInforAction())
        }
    }
)(LeaderboardContainer)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#000'
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .8)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0
    },
})