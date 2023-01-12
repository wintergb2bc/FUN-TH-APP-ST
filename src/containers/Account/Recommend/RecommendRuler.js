import React from 'react'
import { StyleSheet, Text, View, ImageBackground, Dimensions, ScrollView, TouchableOpacity, Image, Modal } from 'react-native'
import Toast from '@/containers/Toast'
import LinearGradient from 'react-native-linear-gradient'
import { connect } from 'react-redux'
import { getMemberInforAction, getQueleaActiveCampaignInforAction, changeHomeRegistLoginModalAction } from './../../../actions/ReducerAction'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { RecommendStepDetail, RecommendFaq, RecommendRules } from './RecommendData'
import * as Animatable from 'react-native-animatable'
import { Actions } from 'react-native-router-flux'
const { width, height } = Dimensions.get('window')
const AnimatableText = Animatable.Text

export default class RecommendRuler extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }


    render() {
        const { queleaActiveCampaign, bannerData, bannerIndex, isShowRecommendRules } = this.state
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F4F4F4' : '#000' }]}>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ paddingBottom: 40 }}>
                    <Text style={[styles.recommendComTitle, { color: window.isBlue ? '#000' : '#fff' }]}>วิธีเข้าร่วม</Text>
                    <View>
                        {
                            RecommendRules.map((v, i) => {
                                return v == 'img'
                                    ?
                                    <View style={styles.recommendFaceIcon1Box}>
                                        <Image
                                            resizeMode='stretch'
                                            style={styles.recommendFaceIcon1}
                                            source={require('./../../../images/account/recommend/recommendFaceIcon9.png')}
                                        ></Image></View>
                                    :
                                    <View key={i} style={styles.recommendRulesBox}>
                                        <Text style={[styles.recommendRulesText, styles.recommendRulesText1, { color: window.isBlue ? '#161616' : '#fff' }]}>{v}</Text>
                                    </View>
                            })
                        }
                    </View>
                </View>

            </ScrollView>
        </View>
    }
}



const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        paddingHorizontal: 10,
       // paddingTop: 20
    },
    containerStyle: {
        paddingVertical: 2,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 5
    },
    recommendMailBoxText: {
        fontSize: 16,
        color: '#161616'
    },
    recommendMailText: {
        color: '#16161680',
        marginBottom: 20,
        marginTop: 5,
    },
    recommendFaceBox: {
        flexDirection: 'row',
        padding: 10,
        marginHorizontal: 15,
        width: width - 70,
        backgroundColor: '#fff',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 5,
        shadowColor: '#d6d6d6',
        elevation: 4,
    },
    recommendFace: {
        width: (width - 90) * .25,
        height: (width - 90) * .25,
    },
    recommendFaceBoxText: {
        width: (width - 90) * .75,
        flexWrap: 'wrap',
        paddingLeft: 10
    },
    recommendFaceIcon: {
        width: 20,
        height: 20,
        marginRight: 8
    },
    recommendFaceIcon1: {
        width: (width - 20) * .8,
        height: (width - 20) * .8 * 1.234
    },
    recommendFaceIcon1Box: {
        alignItems: 'center',
        alignItems: 'center',
        marginVertical: 20
    },
    recommendRulesBox: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    recommendRulesText: {},
    recommendComTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 45,
        marginTop: 10
    },
})