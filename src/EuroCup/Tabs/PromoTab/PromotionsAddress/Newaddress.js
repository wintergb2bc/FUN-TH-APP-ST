/*
 * @Author: Alan
 * @Date: 2021-03-18 19:37:39
 * @LastEditors: Alan
 * @LastEditTime: 2021-03-31 14:09:55
 * @Description: 添加新的寄送地址
 * @FilePath: \Fun88-Sport-EUROCUP2021\components\EuroCup2021\Tabs\PromoTab\PromotionsAddress\Newaddress.js
 */

import React from 'react';
import Router from 'next/router';
import Input from '@/Input';
import Modal from '@/Modal';
import Toast from '@/Toast';
import { ApiPortSB } from '../../../../containers/SbSports/lib/SPORTAPI';
import Service from '@/Header/Service';
import Cascader from './Cascader';
let _name = /^[\u4E00-\u9FA5]{1,4}$/;
let _phoneNumber = /^1[3-9]\d{9}$/;
let _email = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
let _address = /^[\u4E00-\u9FA5A-Za-z\d\-\_]{5,60}$/;
let _postalCode = /[1-9][0-9]{5}/;
class PromotionsAddressform extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			defaultAddress: true,
			ShowDeletPopup: false,
			recipientFirstName: '',
			recipientLastName: '',
			postalCode: '',
			contactNo: '',
			email: '',
			address: '',
			NameError: '',
			PhoneNumberError: '',
			EmailError: '',
			AddressError: '',
			PostalCodeError: '',
			Fetchtype: 'POST',
			promoid: '',
			addressid: 0
		};
		this.AddressState = React.createRef();
	}

	componentDidMount() {
		const { type, addresskey, id } = Router.router.query;
		this.setState({
			pagetype: type,
			promoid: id
		});
		/* ---------------------如果是编辑模式 进入此处---------------------- */
		let Addressdata = JSON.parse(localStorage.getItem('Address'));
		if ((type == 'edit' || type == 'readOnly') && Addressdata && Addressdata != '') {
			const {
				address,
				defaultAddress,
				email,
				firstName,
				id,
				lastName,
				phoneNumber,
				postalCode,
				province,
				town,
				district
			} = Addressdata.find((item) => item.id == addresskey);
			this.setState({
				Fetchtype: 'PUT',
				address: address,
				defaultAddress: defaultAddress,
				email: email,
				recipientFirstName: firstName,
				addressid: id,
				recipientLastName: lastName,
				contactNo: phoneNumber,
				postalCode: postalCode,
				province: province,
				district: district,
				town: town,
				houseNumber: '---',
				village: '---',
				zone: '---'
			});
			this.AddressState.current &&
				this.AddressState.current.RewardUserProvince('', true, province, district, town);
		}
	}

	/**
	 * @description:  添加一个新的地址和编辑地址公用一个方法
	 * @param {String}  recipientFirstName 姓氏
	 * @param {String}  recipientLastName  名字
 	 * @param {String}  address            详细地址
	 * @param {String}  email			   邮箱
	 * @param {Number}  postalCode		   邮编
	 * @param {Number}  contactNo          手机号
	 * @param {Number}  provinceId		   省份
	 * @param {Number}  districtId         市区
	 * @param {Number}  townId             县
	 * @param {Boolean}  defaultAddress	   设置为默认地址
	 * @return {Object}
	*/

	NewShippingAddress = () => {
		/* ----------联动地址 省 市 县------------ */
		const { province, city, county } = this.AddressState.current.state;
		const {
			defaultAddress,
			recipientFirstName,
			recipientLastName,
			postalCode,
			contactNo,
			email,
			address,
			Fetchtype,
			promoid,
			addressid
		} = this.state;

		if (!this.CheckUserData()) return;

		let postData = {
			id: addressid,
			recipientFirstName: recipientFirstName,
			recipientLastName: recipientLastName,
			postalCode: postalCode,
			contactNo: contactNo,
			email: email,
			provinceId: province.value,
			districtId: city.value,
			townId: county.value,
			address: address,
			defaultAddress: defaultAddress,
			villageId: 0,
			houseNumber: '---',
			zone: '---',
			village: '---'
		};
		Toast.loading('请稍候...');
		fetchRequestSB(ApiPortSB.ShippingAddress, Fetchtype, postData)
			.then((res) => {
				console.log(res);
				if (res) {
					if (res.isSuccess) {
						this.props.ShippingAddress();
						setTimeout(() => {
							Router.push(
								{
									pathname: `/promotions/[details]?id=${promoid}`,
									query: {
										details: 'addresslist',
										id: promoid
									}
								},
								`/promotions/addresslist?id=${promoid}`
							);
						}, 1000);
					} else {
						Toast.error(res.message);
					}
				}
				Toast.destroy();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	/**
	 * @description: 删除地址
	 * @param {Number} id 地址的唯一id
	 * @return {Object}
	*/

	DeleteAddress = (id) => {
		const hide = Toast.loading('请稍候...');
		fetchRequestSB(ApiPortSB.DeleteShippingAddress + `/${id}?`, 'DELETE')
			.then((res) => {
				console.log(res);
				if (res) {
					if (res.isSuccess) {
						this.props.ShippingAddress();
						setTimeout(() => {
							Router.push(
								{
									pathname: `/promotions/[details]?id=${this.state.promoid}`,
									query: {
										details: 'addresslist',
										id: this.state.promoid
									}
								},
								`/promotions/addresslist?id=${this.state.promoid}`
							);
						});
					} else {
						Toast.error(res.message);
					}
				}
				hide();
			})
			.catch((error) => {
				console.log(error);
			});
	};
	render() {
		const {
			defaultAddress,
			ShowDeletPopup,
			recipientFirstName,
			recipientLastName,
			postalCode,
			contactNo,
			email,
			address,
			NameError,
			PhoneNumberError,
			EmailError,
			AddressError,
			PostalCodeError,
			addressid,
			pagetype
		} = this.state;
		let ErrorCheckPass =
			NameError == '' &&
			PhoneNumberError == '' &&
			EmailError == '' &&
			AddressError == '' &&
			PostalCodeError == '';
		let CheckdataFail =
			recipientFirstName == '' ||
			recipientLastName == '' ||
			postalCode == '' ||
			contactNo == '' ||
			email == '' ||
			address == '';

		let noreadOnly = pagetype != 'readOnly';
		return (
			<div className="PromotionsAddressform">
				<div className="TopNote">
					注意：邮件人姓名必须是真实姓名{noreadOnly ? (
						''
					) : (
						<span>
							. 若您需要更改地址， 请联系
							<u className="skyblue">
								<Service islink={true} />
							</u>。
						</span>
					)}
				</div>
				{/* -------------------用户名----------------- */}
				<div className="infolist">
					<label>用户名</label>
					<div className="flex justify-between">
						<Input
							size="large"
							placeholder="姓氏"
							value={recipientFirstName}
							readOnly={!noreadOnly}
							onChange={(e) => {
								this.setState({
									recipientFirstName: e.target.value
								});
								if (!!_name.test(e.target.value) && !!_name.test(recipientLastName)) {
									this.setState({
										NameError: ''
									});
								}
							}}
						/>
						<Input
							size="large"
							placeholder="名字"
							value={recipientLastName}
							readOnly={!noreadOnly}
							onChange={(e) => {
								this.setState({
									recipientLastName: e.target.value
								});
								if (!!_name.test(recipientFirstName) && !!_name.test(e.target.value)) {
									this.setState({
										NameError: ''
									});
								}
							}}
						/>
					</div>
					{NameError != '' && <p className="error">{NameError}</p>}
				</div>
				{/* -------------------联系电话----------------- */}
				<div className="infolist">
					<label>联系电话</label>
					<Input
						size="large"
						placeholder="+86 联系电话"
						value={contactNo}
						readOnly={!noreadOnly}
						onChange={(e) => {
							this.setState({
								contactNo: e.target.value
							});
							if (!!_phoneNumber.test(e.target.value)) {
								this.setState({
									PhoneNumberError: ''
								});
							}
						}}
					/>
					{PhoneNumberError != '' && <p className="error">{PhoneNumberError}</p>}
				</div>
				{/* -------------------邮箱地址----------------- */}
				<div className="infolist">
					<label>邮箱地址</label>
					<Input
						size="large"
						placeholder="例：xiaomin123@gmail.com"
						value={email}
						readOnly={!noreadOnly}
						onChange={(e) => {
							this.setState({
								email: e.target.value
							});
							if (!!_email.test(email)) {
								this.setState({
									EmailError: ''
								});
							}
						}}
					/>
					{EmailError != '' && <p className="error">{EmailError}</p>}
				</div>
				{/* -------------------详细地址----------------- */}
				<div className="infolist">
					<label>详细地址</label>
					<Input
						size="large"
						placeholder="详细地址"
						value={address}
						readOnly={!noreadOnly}
						onChange={(e) => {
							this.setState({
								address: e.target.value
							});
							if (!!_address.test(address)) {
								this.setState({
									AddressError: ''
								});
							}
						}}
					/>

					{AddressError != '' && <p className="error">{AddressError}</p>}
					{/* --------地址联动选择-------- */}
					<Cascader ref={this.AddressState} pagetype={pagetype} />
				</div>
				{/* -------------------邮政编码----------------- */}
				<div className="infolist">
					<label>邮政编码</label>
					<Input
						size="large"
						placeholder="邮政编码"
						value={postalCode}
						readOnly={!noreadOnly}
						onChange={(e) => {
							this.setState({
								postalCode: e.target.value
							});
							if (!!_postalCode.test(postalCode)) {
								this.setState({
									PostalCodeError: ''
								});
							}
						}}
					/>
					{PostalCodeError != '' && <p className="error">{PostalCodeError}</p>}
				</div>
				{/* -------------------设为默认运送地址----------------- */}
				{noreadOnly && (
					<div className="agree">
						{!defaultAddress ? (
							<div
								className="not"
								onClick={() => {
									this.setState({
										defaultAddress: true
									});
								}}
							/>
						) : (
							<img
								src="/ec2021/img/ec2021/svg/agree.svg"
								onClick={() => {
									this.setState({
										defaultAddress: false
									});
								}}
							/>
						)}
						将此资料设为默认运送地址
					</div>
				)}

				{pagetype == 'edit' ? (
					<div className="BtnEnd">
						<div
							className="delet"
							onClick={() => {
								this.setState({
									ShowDeletPopup: true
								});
							}}
						>
							删除
						</div>
						<div
							className="done"
							onClick={() => {
								this.NewShippingAddress();
							}}
						>
							完成编辑
						</div>
					</div>
				) : (
					noreadOnly && (
						<div
							className="done"
							id={ErrorCheckPass && !CheckdataFail ? '' : 'Error'}
							onClick={() => {
								this.NewShippingAddress();
							}}
						>
							保存
						</div>
					)
				)}
				{/* ------------------会员删除地址----------------- */}
				<Modal closable={false} className="Proms" title="确认删除" visible={ShowDeletPopup}>
					<p className="txt">您真的要删除此运送资料？</p>
					<div className="flex justify-around">
						<div
							className="Btn-Common"
							onClick={() => {
								this.DeleteAddress(addressid);
							}}
						>
							删除
						</div>
						<div
							className="Btn-Common active"
							onClick={() => {
								this.setState({
									ShowDeletPopup: false
								});
							}}
						>
							保留
						</div>
					</div>
				</Modal>
			</div>
		);
	}
	/* ----------------------------检测数据的有效性----------------------- */
	CheckUserData = () => {
		const { recipientFirstName, recipientLastName, contactNo, email, address, postalCode } = this.state;
		if (!_name.test(recipientFirstName) || !_name.test(recipientLastName)) {
			this.setState({
				NameError: '请输入真实姓名'
			});
			return false;
		} else {
			this.setState({
				NameError: ''
			});
		}
		if (!_phoneNumber.test(contactNo)) {
			this.setState({
				PhoneNumberError: '联系电话格式错误'
			});
			return false;
		} else {
			this.setState({
				PhoneNumberError: ''
			});
		}
		if (!_email.test(email)) {
			this.setState({
				EmailError: '邮箱地址格式错误'
			});
			return false;
		} else {
			this.setState({
				EmailError: ''
			});
		}
		if (!_address.test(address)) {
			this.setState({
				AddressError: '详细地址格式错误'
			});
			return false;
		} else {
			this.setState({
				AddressError: ''
			});
		}
		if (!_postalCode.test(postalCode)) {
			this.setState({
				PostalCodeError: '邮政编码格式错误'
			});
			return false;
		} else {
			this.setState({
				PostalCodeError: ''
			});
		}
		this.setState({
			PassCheck: true
		});
		return true;
	};
}

export default PromotionsAddressform;
