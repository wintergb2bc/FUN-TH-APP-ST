import { Alert, Platform } from 'react-native'
import Toast from '@/containers/Toast'
import { Actions } from 'react-native-router-flux'
/**
 * 让fetch也可以timeout
 *  timeout不是请求连接超时的含义，它表示请求的response时间，包括请求的连接、服务器处理及服务器响应回来的时间
 * fetch的timeout即使超时发生了，本次请求也不会被abort丢弃掉，它在后台仍然会发送到服务器端，只是本次请求的响应内容被丢弃而已
 * @param {Promise} fetch_promise    fetch请求返回的Promise
 * @param {number} [timeout=10000]   单位：毫秒，这里设置默认超时时间为10秒
 * @return 返回Promise
 */
function timeout_fetch(fetch_promise, timeout = 350000) {
    let timeout_fn = null

    //这是一个可以被reject的promise
    let timeout_promise = new Promise(function (resolve, reject) {
        timeout_fn = function () {
            // resolve('请求超时!!!') 
            resolve('Yêu cầu hết hạn')
        }
    })
    //这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
    let abortable_promise = Promise.race([
        fetch_promise,
        timeout_promise
    ])

    setTimeout(function () {
        timeout_fn()
    }, timeout)

    return abortable_promise
}

let apiversion = 'api-version=1.0&brand=Fun88&Platform=' + Platform.OS

/**
 * @param {string} url 接口地址
 * @param {string} method 请求方法：GET、POST，只能大写
 * @param {JSON} [params=''] body的请求参数，默认为空
 * @return 返回Promise
 */

function catchErr(responseData) {
    let error_details = responseData.error_details
    let error_detailsCode = error_details.Code

    let Message = ''
    if (error_details) {
        Message = error_details.Message || error_details.Description
    }

    Toast.hide()
    if (error_detailsCode === 'MEM00059') {
        Toast.fail(Message, 2)
    } else if (error_detailsCode === 'FRAUD0001') {
        Toast.fail(Message, 2)
        ApiPort.UserLogin && globalLogout()
    } else if (error_detailsCode === 'MEM00061') {
        Toast.fail(Message || 'Thành viên không hoạt động', 2)
    } else if (error_detailsCode === 'GEN0006') {
        if (ApiPort.UserLogin == true) {
            Toast.fail(Message || 'หมดเวลา กรุณาเข้าระบบอีกครั้ง ', 1.5, () => {
                globalLogout()
            })
            // Toast.fail('请重新登录,访问过期',3)
        }
    } else if (error_detailsCode === 'GEN0005') {
        if (ApiPort.UserLogin == true) {
            Toast.fail(Message || 'ระบบตรวจสอบพบว่ามีการล็อกอินซ้ำ กรุณาเข้าระบบอีกครั้ง ', 1.5, () => {
                globalLogout()
            })
        }
    } else if (error_detailsCode === 'GEN0002') {// ip限制
        !window.isShowRestrictedPage && Toast.fail(Message || 'จำกัดการเข้าถึง', 2)
        !window.isShowRestrictedPage && Actions.Restricted()
        window.isShowRestrictedPage = true
        ApiPort.UserLogin && globalLogout()
    } else if (error_detailsCode === 'GEN0001') { // Maintenance 维护
        let retryAfter = error_details.RetryAfter || ''
        Toast.fail(Message || 'กำลังปรับปรุงะบบ กรุณาลองอีกครั้งในภายหลัง', 1.5, () => {
            ApiPort.UserLogin && globalLogout()
            window.changeMaintenance && window.changeMaintenance(true, retryAfter)
        })
    } else {
        Toast.fail(Message, 1500)
    }
}

window.fetchRequest = (url, method, params = '', timeout = 350000) => {
    let header = {
        'Content-Type': 'application/json charset=utf-8',
        'Culture': 'th-th'
    }
    if (ApiPort.UserLogin) {
        header.Authorization = ApiPort.Token
    }

    if (params == '') { //如果网络请求中没有参数
        return new Promise(function (resolve, reject) {
            timeout_fetch(fetch(common_url + url + apiversion, {
                method: method,
                headers: header,
            }), timeout).then((response) => response.json()).then(responseData => {
                ///.     Toast.hide()
                let error_details = responseData.error_details
                if (error_details) {
                    catchErr(responseData)
                } else {
                    if (!responseData.isSuccess) {
                        if (responseData.message) {
                            Toast.fail(responseData.message, 1.5)
                            resolve(responseData)
                        } else {
                            if (responseData.result) {
                                let message = responseData.result.message
                                if (message) {
                                    Toast.fail(message, 1.5)
                                    resolve(responseData)
                                }
                            }

                            if (responseData.errorMessage) {
                                Toast.fail(responseData.errorMessage, 1.5)
                                resolve(responseData)
                            }
                        }
                    }
                    resolve(responseData)
                }
            }).catch((err) => {
                Toast.hide()
                return
                reject(err)
            })
        })
    } else { //如果网络请求中有参数
        return new Promise(function (resolve, reject) {
            timeout_fetch(fetch(params != 'HomeBanner' ? common_url + url + apiversion : url, {
                method: method,
                headers: header,
                body: JSON.stringify(params) //body参数，通常需要转换成字符串后服务器才能解析
            }), timeout).then((response) => response.json()).then(responseData => {
                ///.     Toast.hide()
                let error_details = responseData.error_details
                if (error_details) {
                    catchErr(responseData)
                } else {
                    if (!responseData.isSuccess) {
                        if (responseData.message) {
                            Toast.fail(responseData.message, 1.5)
                            resolve(responseData)
                        } else {
                            if (responseData.result) {
                                let message = responseData.result.message
                                if (message) {
                                    Toast.fail(message, 1.5)
                                    resolve(responseData)
                                }
                            }

                            if (responseData.errorMessage) {
                                Toast.fail(responseData.errorMessage, 1.5)
                                resolve(responseData)
                            }
                        }
                    }
                    resolve(responseData)
                }
            }).catch((err) => {
                Toast.hide()
                return
                reject(err)
            })
        })
    }
}




window.fetchCupRequest = (url, method, params = '', timeout = 350000) => {
    //let apiversionCup = `?login=${ApiPort.UserLogin ? 'after' : 'before'}`
    let apiversionCup = ``
    let header = {
        // 后端反馈不管是否登陆都需要此参数
        token: '71b512d06e0ada5e23e7a0f287908ac1',
        // 'Content-Type': 'application/json charset=utf-8',
        // 'Culture': 'th-th'
    }
    if (params == '') { //如果网络请求中没有参数
        return new Promise(function (resolve, reject) {
            timeout_fetch(fetch(worldCupUrl + url + apiversionCup, {
                method: method,
                headers: header,
            }), timeout).then((response) => response.json()).then(responseData => {
                ///.     Toast.hide()
                let error_details = responseData.error_details
                if (error_details) {
                    catchErr(responseData)
                } else {
                    if (!responseData.isSuccess) {
                        if (responseData.message) {
                            Toast.fail(responseData.message, 1.5)
                            resolve(responseData)
                        } else {
                            if (responseData.result) {
                                let message = responseData.result.message
                                if (message) {
                                    Toast.fail(message, 1.5)
                                    resolve(responseData)
                                }
                            }

                            if (responseData.errorMessage) {
                                Toast.fail(responseData.errorMessage, 1.5)
                                resolve(responseData)
                            }
                        }
                    }
                    resolve(responseData)
                }
            }).catch((err) => {
                Toast.hide()
                return
                reject(err)
            })
        })
    } else { //如果网络请求中有参数
        return new Promise(function (resolve, reject) {
            timeout_fetch(fetch(params != 'HomeBanner' ? worldCupUrl + url + apiversionCup : url, {
                method: method,
                headers: header,
                body: JSON.stringify(params) //body参数，通常需要转换成字符串后服务器才能解析
            }), timeout).then((response) => response.json()).then(responseData => {
                ///.     Toast.hide()
                let error_details = responseData.error_details
                if (error_details) {
                    catchErr(responseData)
                } else {
                    if (!responseData.isSuccess) {
                        if (responseData.message) {
                            Toast.fail(responseData.message, 1.5)
                            resolve(responseData)
                        } else {
                            if (responseData.result) {
                                let message = responseData.result.message
                                if (message) {
                                    Toast.fail(message, 1.5)
                                    resolve(responseData)
                                }
                            }

                            if (responseData.errorMessage) {
                                Toast.fail(responseData.errorMessage, 1.5)
                                resolve(responseData)
                            }
                        }
                    }
                    resolve(responseData)
                }
            }).catch((err) => {
                Toast.hide()
                return
                reject(err)
            })
        })
    }
}