import { StyleSheet, Dimensions,Platform } from "react-native"

const { width, height } = Dimensions.get("window")

export default StyleSheet.create({
    viewContainer: {
       flex: 1,
       backgroundColor: "rgba(0, 174, 239, .4)",
    },
    loginTouch1: {
        width: .4 * width,
        height: .206 * width,
        marginTop: 15
    },
    loginTouch2: {
        width: .45 * width,
        height: .206 * width,
        marginTop: 15
    },
    loginTouchOK1: {
        width: .4 * width,
        height: .232 * width
    },
    NumberAPPBox: {
        position: 'absolute',
        right: 15,
        zIndex: 1000,
        bottom: 40
    },
    NumberAPP: {
        fontSize: 12,
        color: '#fff',
        textAlign: 'center',
    },
    loginTouchOK2: {
        width: .2 * width,
        height: .2 * width
    },
    longinTouchInputText: {
        color: '#fff'
    },
    longinTouchInput: {
        backgroundColor: '#fff',
        width: width - 30,
        height: 40,
        paddingHorizontal: 10,
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#F2F2F2',
        borderRadius: 4
    },
    video: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        height:height,
    },
    validation:{
        display:'flex',
        justifyContent: 'center',
        alignItems:'center'
    },
    titleTxt: {
        color: '#fff',
        lineHeight:25,
        padding:10,
        textAlign: 'center',
        paddingHorizontal: 40
    },
    username: {
        color: '#fff',
        lineHeight:35,
        textAlign: 'center'
    },
    passInput: {
    //    borderBottomColor:'#119A72',
    //    borderBottomWidth:2,
        marginTop:15
    },
    onBtn: {
        backgroundColor:'#00AEEF',
        borderRadius:4,
        height: 40,
        width:width-30,
        marginTop:35
    },
    okBtnTxt: {
        color:'#fff',
        lineHeight:40,
        textAlign:'center'
    },
    patternTxt: {
        display:'flex',
        position:'absolute',
        width:width,
        alignItems: 'center',
        zIndex:-1
    },








    modalContainer: {
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .6)'
    },
    modalBox: {
        backgroundColor: '#EFEFEF',
        borderRadius: 6,
        width: width * .95,
        overflow: 'hidden'
    },
    modalTop: {
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#25AAE1'
    },
    modalTopText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    modalBody: {
        paddingTop: 20,
        paddingBottom: 15,
        paddingHorizontal: 20
    },
    modalBtnBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20
    },
    modalBtn: {
        height: 40,
        width: (width * .9 - 40),
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    },
    modalBtnText: {
        fontWeight: 'bold'
    },
    reasonText: {
        textAlign: 'center'
    },
})
