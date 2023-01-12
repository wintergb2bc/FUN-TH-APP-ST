/*
 * @Author: Alan
 * @Date: 2021-03-24 10:02:19
 * @LastEditors: Alan
 * @LastEditTime: 2021-03-29 23:06:09
 * @Description: 地址联动选择
 * @FilePath: \Fun88-Sport-EUROCUP2021\components\EuroCup2021\Tabs\PromoTab\PromotionsAddress\Cascader.js
 */

import React from 'react';
import { ApiPortSB } from '../../../../containers/SbSports/lib/SPORTAPI';
import Select, { Option } from 'rc-select';
class CeshiContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			province: { key: '', value: '', children: '省' },
			city: { key: '', value: '', children: '市' },
			county: { key: '', value: '', children: '县' },
			provinces: [],
			cities: [],
			counties: [],
			editprovince: '',
			editdistrict: '',
			edittown: ''
		};
		this.AddressState = React.createRef();
	}

	componentDidMount() {
		if (this.props.pagetype != 'edit') {
			this.RewardUserProvince('default');
		}
	}

	handleChangeprovince(key, obj) {
		this.setState({
			province: obj
		});
		this.RewardUserDistricts(obj.value);
	}

	handleChangecity(key, obj) {
		this.setState({
			city: obj
		});
		this.RewardUserRewardTown(obj.value);
	}

	handleChangecounty(key, obj) {
		this.setState({
			county: obj
		});
	}

	/* ---------省----------- */
	RewardUserProvince = (status, edit, province, district, town) => {
		fetchRequestSB(ApiPortSB.AddressProvince, 'GET').then((res) => {
			if (res) {
				const { provinceId, provinceName } = res.provinceList[0];
				this.setState(
					{
						provinces: res.provinceList,
						editprovince: province,
						editdistrict: district,
						edittown: town
					},
					() => {
						if (edit) {
							console.log(this.state.province);
							console.log(res.provinceList);
							const { provinceId, provinceName } = res.provinceList.find(
								(item) => item.provinceName == province
							);
							let _province = { key: '0', value: provinceId, children: provinceName };
							this.setState({
								province: _province
							});
							this.RewardUserDistricts('', provinceId);
							return;
						}
						if (status != 'default') {
							this.setState({
								province: { key: '0', value: provinceId, children: provinceName }
							});
							this.RewardUserDistricts(provinceId);
						}
					}
				);
			}
		});
	};

	/* -------------市---------- */
	RewardUserDistricts = (provinceId, editid) => {
		let ID = editid ? editid : provinceId;
		fetchRequestSB(ApiPortSB.AddressDistrict + 'provinceId=' + ID + '&', 'GET').then((res) => {
			if (res) {
				this.setState(
					{
						cities: res.districtList
					},
					() => {
						if (editid) {
							const { editdistrict } = this.state;
							const { districtId, districtName } = res.districtList.find(
								(item) => item.districtName == editdistrict
							);
							let editdata = { key: '0', value: districtId, children: districtName };
							this.setState({
								city: editdata
							});
							this.RewardUserRewardTown('', districtId);
						} else {
							const { districtId, districtName } = res.districtList[0];
							this.setState({
								city: { key: '0', value: districtId, children: districtName }
							});
							this.RewardUserRewardTown(districtId);
						}
					}
				);
			}
		});
	};

	/* --------------县------------- */
	RewardUserRewardTown = (districtId, editid) => {
		let ID = editid ? editid : districtId;
		fetchRequestSB(ApiPortSB.AddressTown + 'districtId=' + ID + '&', 'GET').then((res) => {
			if (res) {
				this.setState(
					{
						counties: res.townList
					},
					() => {
						if (editid) {
							const { edittown } = this.state;
							const { townId, townName } = res.townList.find((item) => item.townName == edittown);
							this.setState({
								county: { key: '0', value: townId, children: townName }
							});
						} else {
							const { townId, townName } = res.townList[0];
							this.setState({
								county: { key: '0', value: townId, children: townName }
							});
						}
					}
				);
			}
		});
	};

	render() {
		console.log(this.state.provinces);
		const { provinces, cities, counties, province, city, county } = this.state;
		console.log(cities);
		let readOnly = this.props.pagetype == 'readOnly' ? true : false;

		return (
			<div>
				{provinces.length != 0 ? (
					<div className="Select">
						<Select
							size="large"
							value={province.children}
							onChange={this.handleChangeprovince.bind(this)}
							disabled={readOnly}
						>
							{provinces.map((data, index) => {
								return (
									<Option value={data.provinceId} key={index}>
										{data.provinceName}
									</Option>
								);
							})}
						</Select>
						<Select
							size="large"
							value={city.children}
							onChange={this.handleChangecity.bind(this)}
							disabled={!readOnly ? city.value == '' ? true : false : true}
						>
							{city.value == '' && <Option value={''}>请选择省份</Option>}
							{cities.map((data, index) => {
								return (
									<Option value={data.districtId} key={index}>
										{data.districtName}
									</Option>
								);
							})}
						</Select>
						<Select
							size="large"
							value={county.children}
							onChange={this.handleChangecounty.bind(this)}
							disabled={!readOnly ? county.value == '' ? true : false : true}
						>
							{county.value == '' && <Option value={''}>请选择市区</Option>}
							{counties.map((data, index) => {
								return (
									<Option value={data.townId} key={index}>
										{data.townName}
									</Option>
								);
							})}
						</Select>
					</div>
				) : null}
			</div>
		);
	}
}

export default CeshiContainer;
