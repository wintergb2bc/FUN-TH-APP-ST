import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import * as Animatable from 'react-native-animatable'
import LinearGradient from 'react-native-linear-gradient'

const { width } = Dimensions.get('window')

const AnimatableView = Animatable.View

export const SlideLong = {
    0: {
        opacity: 0,
        translateX: -(width - 20) / 2
    },
    // .5: {
    // 	opacity: 1,
    // 	translateX: (width - 20) / 2
    // },
    1: {
        opacity: 1,
        translateX: width - 20
    }
};

export default class LoadingBone extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return <AnimatableView
            animation={SlideLong}
            easing='ease-out'
            iterationCount='infinite'
            duration={1200}
        >
            <LinearGradient
                colors={['#e0e0e0', '#d0d0d0', '#e0e0e0']}
                start={{ y: 0, x: 0 }}
                end={{ y: 0, x: 1 }}
                style={styles.boneView}
            ></LinearGradient>
        </AnimatableView>
    }
}

const styles = StyleSheet.create({
    boneView: {
        width: (width - 20) / 2,
        height: 1000,
        borderRadius: 10
    }
})