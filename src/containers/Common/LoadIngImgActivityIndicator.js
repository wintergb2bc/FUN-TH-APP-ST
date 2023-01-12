import React from 'react'
import { StyleSheet, ActivityIndicator } from 'react-native'
import * as Animatable from 'react-native-animatable'

const AnimatableView = Animatable.View
export default class LoadIngImgActivityIndicator extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return <AnimatableView
            animation={'fadeIn'}
            resizeMode='stretch'
            easing='ease-out'
            style={styles.activeLoadBoxIcon}>
            <ActivityIndicator size='small' color={window.isBlue ? '#00CEFF' : '#25AAE1'} style={styles.activeLoadIcon} />
        </AnimatableView>
    }
}

const styles = StyleSheet.create({
    activeLoadBoxIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, .6)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    activeLoadIcon: {
    }
})