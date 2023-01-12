const patchPostMessageFunction = function () {
    var originalPostMessage = window.postMessage

    var patchedPostMessage = function (message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer)
    }

    patchedPostMessage.toString = function () {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
    }

    window.postMessage = patchedPostMessage
}

const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')()'


return <View style={styles.viewContainer}>
    {
        <WebView
            onLoadStart={(e) => this.setState({ loadD: false })}
            onLoadEnd={(e) => this.setState({ loadD: true, loadone: 2 })}
            source={{
                uri: `${VietIntroAFriendUrl}?firstname=${name}&email=${email}`,
                headers: {
                    'Authorization': ApiPort.Token,
                    'Content-Type': 'application/json charset=utf-8',
                    'Culture': 'th-th',
                }
            }}
            mixedContentMode='always'
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scalesPageToFit={false}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction
            allowFileAccess
            style={{ width, height }}
            injectedJavaScript={patchPostMessageJsCode}
            onMessage={event => {
                if (event.nativeEvent && event.nativeEvent.data) {
                    let action = event.nativeEvent.data
                    action && Actions[action]()
                }
            }}
        />
    }





    <ModalDropdown
        animated={true}
        defaultValue={balanceInfor[0].name}
        ref={el => this.modalDropdown = el}
        renderRow={this.createWalletList.bind(this)}
        renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => <View></View>} //下拉列表border
    >
    </ModalDropdown>