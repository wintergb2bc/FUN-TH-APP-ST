import React from 'react'
import { Alert, StyleSheet, Text, Linking, Image, View, TouchableOpacity, Dimensions, FlatList, TextInput, Platform, Modal } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import * as Animatable from 'react-native-animatable'

const AnimatableImage = Animatable.Image
const AnimatableView = Animatable.View
const { width, height } = Dimensions.get('window')
const MaintenanceIcon = [
	{
		icon: require('./../../images/home/maintenance/maintenanceIcon1.png'),
		text: 'ห้องสนทนาสด',
		p: 'บริการ 24/7'
	},
	{
		icon: require('./../../images/home/maintenance/maintenanceIcon2.png'),
		text: 'อีเมล',
		p: 'cs.thai@fun88.com'
	},
	{
		icon: require('./../../images/home/maintenance/maintenanceIcon3.png'),
		text: 'สายด่วน',
		p: '(+66) 600 035 187'
	},
]

export default class Maintenance extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			retryAfter: this.props.retryAfter,
			hour: '',
			min: '',
			sec: ''
		}
	}

	componentDidMount() {
		this.makeNumInterval()
	}

	componentWillUnmount() {
		this.intervalNum && clearInterval(this.intervalNum)
	}

	makeNumInterval() {
		let retryAfter = this.state.retryAfter
		if (!(Boolean(Number(retryAfter)) && retryAfter > 0)) return
		function addZero(n) {
			return n < 10 ? '0' + n : n
		}

		this.intervalNum = setInterval(() => {
			if (retryAfter !== 0) {
				retryAfter--
				this.setState({
					retryAfter
				})
				let hour = addZero(Math.floor(Math.floor(retryAfter / 3600)))
				let min = addZero(Math.floor(retryAfter / 60 % 60))
				let sec = addZero(Math.floor(retryAfter % 60))
				this.setState({
					hour,
					min,
					sec
				})
			} else {
				this.intervalNum && clearInterval(this.intervalNum)
				window.changeMaintenance(false)
			}
		}, 1000)
	}

	leaveMaintenance(i, v) {
		if (i === 0) {
			this.props.changeMaintenanceStatus(false)
			Actions.LiveChat({
				liveUrl: true,
				fromPage: 'Maintenance'
			})
		} else if (i === 1) {
			let url = 'mailto:cs.thai@fun88.com?subject=Ch%C4%83m%20S%C3%B3c%20Kh%C3%A1ch%20H%C3%A0ng%20FUN88'
			Linking.canOpenURL(url).then(flag => {
				Linking.openURL(url)
			}).catch(err => {
				Alert.alert('แจ้งเตือน', 'Thiết bị của bạn không hỗ trợ chức năng này, vui lòng sử dụng ứng dụng email khác', [
					{ text: 'โอนย้าย' }
				])
			})
		} else {
			let url = 'tel:+66 600035187'
			Linking.canOpenURL(url).then(flag => {
				Linking.openURL(url)
			}).catch(err => {
				Alert.alert('แจ้งเตือน', `อุปกรณ์ของคุณไม่รองรับฟังก์ชันนี้ กรุณากดหมายเลขด้วยตนเอง ${v.p}`, [
					{ text: 'โอนย้าย' }
				])
			})
		}
	}

	render() {
		const { retryAfter, hour, min, sec } = this.state
		return <Modal animationType='fade' visible={true} transparent={true}>
			<View style={[styles.modalContainer]}>
				<View style={styles.modalBox}>
					<AnimatableImage
						source={require('./../../images/home/maintenance/maintenance.png')}
						resizeMode='stretch'
						style={styles.maintenance}
						animation={'pulse'}
						easing='ease-out'
						iterationCount='infinite'
					></AnimatableImage>
					<View style={styles.maintenanceBody}>
						<View style={styles.maintenanceBodyWrap}>
							<AnimatableView
								animation={'fadeInLeftBig'}
								delay={200}
								easing='ease-out'
								iterationCount='1'
							>
								<Text style={styles.maintenanceBodyText1}>แอป Fun88 อยู่ในระหว่างการปรับปรุงระบบ</Text>
								<Text style={styles.maintenanceBodyText2}>หากต้องการความช่วยเหลือ กรุณาติดต่อเราผ่านช่องทางต่อไปนี้</Text>
							</AnimatableView>


							<AnimatableView
								animation={'fadeInRightBig'}
								easing='ease-out'
								delay={200}
								iterationCount='1'
								style={styles.maintenanceIconBox}>
								{
									MaintenanceIcon.map((v, i) => {
										return <TouchableOpacity key={i} style={styles.maintenanceIconList} onPress={this.leaveMaintenance.bind(this, i * 1, v)}>
											<Image
												source={v.icon}
												resizeMode='stretch'
												style={styles.maintenanceIcon}
											></Image>
											<Text style={styles.maintenanceIconText}>{v.text}</Text>
											<Text style={[styles.maintenanceIconText, { color: '#666', marginTop: 2 }]}>{v.p}</Text>
										</TouchableOpacity>
									})
								}
							</AnimatableView>
						</View>

						{
							retryAfter >= 0 && <AnimatableView
								animation={'fadeInUpBig'}
								delay={200}
								easing='ease-out'
								iterationCount='1'
							>
								<View style={styles.timeBox}>
									<View style={styles.timeBox}>
										<Text style={styles.timeText1}>{hour}</Text>
									</View>
									<View style={styles.timeBox}>
										<Text style={styles.timeText3}>:</Text>
										<Text style={styles.timeText1}>{min}</Text>
										<Text style={styles.timeText3}>:</Text>
									</View>
									<View style={styles.timeBox}>
										<Text style={styles.timeText1}>{sec}</Text>
									</View>
								</View>
								<View style={styles.timeBox}>
									<View style={styles.timeBox}>
										<Text style={styles.timeText2}>ชั่วโมง</Text>
									</View>
									<View style={styles.timeBox}>
										<Text style={styles.timeText4}></Text>
										<Text style={styles.timeText2}>นาที</Text>
										<Text style={styles.timeText4}></Text>
									</View>
									<View style={styles.timeBox}>
										<Text style={styles.timeText2}>ที่สอง</Text>
									</View>
								</View>
							</AnimatableView>
						}

						<View style={styles.maintenanceBtn}>
							<Text style={styles.maintenanceBtnText}>เข้าสู่ระบบในภายหลัง</Text>
						</View>
					</View>
				</View>
			</View>
		</Modal>
	}
}

const styles = StyleSheet.create({
	modalContainer: {
		width,
		height,
		backgroundColor: 'rgba(0, 0, 0, .6)',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	modalBox: {
		width: .9 * width,
		overflow: 'hidden',
		borderRadius: 6
	},
	maintenance: {
		width: .9 * width,
		height: 0.9 * .454 * width,
	},
	maintenanceBody: {
		alignItems: 'center',
		paddingTop: 10,
		backgroundColor: '#fff'
	},
	maintenanceBodyText1: {
		color: '#25AAE1',
		fontWeight: 'bold',
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 5
	},
	maintenanceBodyText2: {
		textAlign: 'center'
	},
	maintenanceIconBox: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10
	},
	maintenanceIconList: {
		borderWidth: 1,
		borderColor: '#E3E3E3',
		borderRadius: 4,
		width: (width * .9 - 20) / 3.2,
		alignItems: 'center',
		paddingVertical: 6
	},
	maintenanceBodyWrap: {
		marginHorizontal: 10,
		marginBottom: 15
	},
	maintenanceIcon: {
		width: 30,
		height: 30
	},
	maintenanceIconText: {
		fontWeight: 'bold',
		fontSize: 10,
		textAlign: 'center',
		color: '#00ABE8'
	},
	maintenanceBtn: {
		backgroundColor: '#00ABE8',
		height: 44,
		alignItems: 'center',
		justifyContent: 'center',
		width: .9 * width,
		marginTop: 15
	},
	maintenanceBtnText: {
		color: '#fff',
		fontWeight: 'bold'
	},
	timeBox: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	timeText1: {
		color: '#25AAE2',
		fontWeight: 'bold',
		fontSize: 20,
		textAlign: 'center',
		width: 30
	},
	timeText2: {
		color: '#808080',
		textAlign: 'center',
		width: 30
	},
	timeText3: {
		color: '#808080',
		fontSize: 16,
		textAlign: 'center',
		width: 30,
		fontWeight: 'bold'
	},
	timeText4: {
		color: 'transparent',
		fontSize: 16,
		textAlign: 'center',
		width: 30
	}
})