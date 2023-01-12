
import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

export default class RedStar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const { style = {} } = this.state
        return <Text style={[styles.starText, style]}> *</Text>
    }
}

const styles = StyleSheet.create({
    starText: {
        color: '#FF0000',
        fontSize: 14,
        position: 'absolute',
        top: -5,
        right: -4
    }
})