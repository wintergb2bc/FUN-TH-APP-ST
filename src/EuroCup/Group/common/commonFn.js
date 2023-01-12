import React, { Component } from "react";
import { Actions } from "react-native-router-flux";
import { Toast } from "antd-mobile-rn";
import { Radar } from 'react-native-tcharts'
import { countryData } from './commonData'
// import Canvas from 'react-native-canvas';


export const doRadarSort = (key, code, TeamData) => { // 雷達圖排序
  const radar = TeamData && TeamData // 匹配數據
  const color = countryData[code] && countryData[code].bgColor // 匹配背景色
  let radarData = []

  if (radar) {
    radarData = [radar.averageBallPossessionNormalized, radar.goalsScoredNormalized, radar.freeKicksNormalized, radar.redYellowcards, radar.cornerKicksNormalized, radar.goalsConcededNormalized]

    const option = {
      r: 42, // 雷达图半径
      splitNumber: 5, // 雷达图轴线数量
      shape: 'polygon', // 雷达图形状
      startAngle: 90, // 角度
      fill: '#000',
      indicator: [{ // 轴线命名,最大值,文案颜色,数组长度即为轴线数量
        text: 'Kiểm Soát\nBóng Trung Bình',
        max: 9,
        min: 0,
        color: '#757575',
      }, {
        text: 'Bàn\nThắng',
        max: 9,
        min: 0,
        color: '#757575',
      }, {
        text: 'Đá\nPhạt',
        max: 9,
        min: 0,
        color: '#757575',
      }, {
        text: 'Thẻ Phạt',
        max: 9,
        min: 0,
        color: '#757575',
      }, {
        text: 'Phạt\nGóc',
        max: 9,
        min: 0,
        color: '#757575',
      }, {
        text: 'Thủng\nLưới',
        max: 9,
        min: 0,
        color: '#757575',
      }],
      axisLine: { // 轴线配置,是否显示以及轴线样式
        show: true,
        lineStyle: {
          color: '#eeeeee'
        }
      },
      splitLine: { // 網狀線顏色
        show: true,
        lineStyle: {
          color: '#dddddd',
          opacity: 0.5
        }
      },
      rich: { // 轴线文案定制化设置,包括多颜色以及换行
        default: {
          color: '#757575',
          fontSize: 9,
          textAlign: 'center',
          // fontWeight: 'bold'
        },
      },
      series: [{ // 雷达图数据
        data: radarData,
        itemStyle: {
          color: '#00a6ff',
          opacity: 0.5,
        },
        lineStyle: {
          color: '#00a6ff',
          opacity: 0.5,
        },
        areaStyle: {
          color: '#00a6ff',
          opacity: 0.5,
        }
      }]
    }

    return (
      <Radar style={{ padding: 10, fontSize: 8 }} width={100} height={100} option={option} />
    )
  }

}