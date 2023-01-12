import React, { Component } from "react";
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform
} from "react-native";
import FastImage from 'react-native-fast-image'
import * as Animatable from "react-native-animatable";
import Touch from 'react-native-touch-once'
const { width, height } = Dimensions.get("window");
const imgs = [require("./../../../images/home/lottery/Freebet/angpao.gif")];
const range = count => {
  const array = [];
  for (let i = 0; i < count; i++) {
    array.push(i);
  }
  return array;
};

export default class Rain extends Component {
  constructor(props) {
    super(props);

    this.state = {
      parentWidth: 0,
      parentHeight: 0,
      prizes: [], // 獎品清單
      warmPrompt: '',//温馨提示
      winPrompt: '',//中将提示
      noWinPrompt: '',//没中奖提示
      TurntableCallBack: '',//转盘返回信息
    };
  }

  // 避免因父組件影響而重新渲染
  shouldComponentUpdate(nextProps, nextState) {
    const { resetRain = false } = this.props;
    return resetRain !== nextProps.resetRain;
  }

  handleViewRef = ref => this.view = ref;

  _onLayout = event => {
    this.setState({
      parentWidth: width,
      parentHeight: height,
    });
  };

  _FailAnimation = ({ style, duration, delay, startY, speed, children }) => {
    return (
      <Animatable.View //下落动画
        ref={this.handleViewRef}
        style={style}
        duration={duration}
        delay={delay}
        animation={{
          from: { translateY: startY },
          to: { translateY: height + speed }
        }}
        easing={t => Math.pow(t, 1.2)}
        iterationCount="infinite"
        useNativeDriver
      >
        {children}
      </Animatable.View>
    );
  };

  _SwingAnimation = ({ delay, duration, children }) => {
    const translateX = Math.random() * -100;
    return (
      <Animatable.View //左右摇摆动画
        animation={{
          0: {
            translateX: translateX,
            rotate: "0deg"
          },
          0.5: {
            translateX: 0,
            rotate: "-100deg"
          },
          1: {
            translateX: -1 * translateX,
            rotate: "100deg"
          }
        }}
        delay={delay}
        duration={duration}
        direction="alternate"
        easing="ease-in-out"
        iterationCount="infinite"
        useNativeDriver
      >
        {children}
      </Animatable.View>
    );
  };

  _imgRandom = imgs => {
    // let r = Math.ceil(Math.random() * imgs.length);
    return (
      <Touch
        onPress={() => {
          this.props.SnatchPrize();
        }}
        style={{ width: 64, height: 96 }}
        hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
      >
        <FastImage
          resizeMode="contain"
          resizeMethod="auto"
          source={imgs[0]}
          style={{ width: 78, height: 78 }}
        />
      </Touch>
    );
  };

  onSpinEvent(warmPrompt, winPrompt, noWinPrompt, TurntableCallBack) { //弹窗提示
    PiwikEvent('Engagement Event', 'Click', 'Angpao_CNY2022')

    //温馨提示，中奖提示，没中奖提示，转盘api返回
    this.setState({ warmPrompt, winPrompt, noWinPrompt, TurntableCallBack }, () => {
      // this.PlayerLuckySpinDetail()
      window.PlayerLuckySpinDetail && window.PlayerLuckySpinDetail()
    })
  }

  render() {
    let FailAnimation = this._FailAnimation;


    const {
      count = Platform.OS === "android" ? 10 : 4, //一次下落的数量
      duration = 10000, //时长
      startY = -150, //起始下落距顶部位置
      speed = 500
    } = this.props;


    return (
      <>
        {
          range(count).map(i => (
            <FailAnimation
              key={i}
              startY={startY}
              speed={speed}
              style={{
                position: "absolute",
                left: Math.floor(Math.random() * (width - 60)),
                zIndex: 1,
              }}
              duration={duration}
              delay={i * 1000}
            >
              {this._imgRandom(imgs)}
            </FailAnimation>
          ))
        }
      </>
    );
  }
}

