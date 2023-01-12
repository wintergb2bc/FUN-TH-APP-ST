
import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import * as Animatable from 'react-native-animatable'

const AnimatableView = Animatable.View
const AnimatableImage = Animatable.Image

export default class ModalDropdownArrow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const { arrowFlag, flag, style = {}, specialFlag, img } = this.props
        return (
            img ?
                <AnimatableImage
                    transition={['borderTopColor', 'rotate', 'marginTop', 'marginBottom']}
                    style={[
                        {
                            width: 20,
                            height: 20,
                            transform: [{ rotate: `${!arrowFlag ? 180 : 0}deg` }],
                        },
                    ]}
                    resizeMode='stretch'
                    source={require('./../../images/game/arrowTop.png')}
                />
                :
                <AnimatableView
                    transition={['borderTopColor', 'rotate', 'marginTop', 'marginBottom']}
                    style={[
                        styles.toreturnModalDropdownArrow,
                        {
                            transform: [{ rotate: `${arrowFlag ? 180 : 0}deg` }],
                            marginTop: arrowFlag ? 0 : 6,
                            marginBottom: arrowFlag ? 6 : 0,
                            borderTopColor: specialFlag ? ('#25AAE1') : (
                                flag ? '#fff' : (window.isBlue ? (arrowFlag ? '#25AAE1' : '#4B4B4B') : (arrowFlag ? '#25AAE1' : '#fff'))
                            )
                        },
                        style
                    ]} />
        )
    }
}

const styles = StyleSheet.create({
    toreturnModalDropdownArrow: {
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: 6,
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: 'transparent',
        // borderTopColor: '#25AAE1'
    }
})