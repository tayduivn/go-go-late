'use strict';

require("dotenv").config();


const line = require('@line/bot-sdk');
const functions = require('firebase-functions');
const firebase = require("firebase");
var request = require("request");


// create LINE SDK config from env variables
const config = {
    channelAccessToken: process.env.channelAccessToken,
    channelSecret: process.env.channelSecret
}

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId
};

firebase.initializeApp(firebaseConfig);


// create LINE SDK client
const client = new line.Client(config);


exports.MyAPI = functions.https.onRequest((req, res) => {
    req.body.events.map(handleEvent);
    res.status(200).end();
});

// event handler
function handleEvent(event) {

    if (event.type !== 'message' || event.message.type !== 'text') {
        // ignore non-text-message event
        return Promise.resolve(null);
    }

    var userID = event.source.userId;

    console.log(`won test 1 ==> type(${event.message.type}) ${event.message.text}`);

    switch (event.message.text) {
        case '上班打卡':

            punchTimeCard(event, true);
            break;
        case '下班打卡':

            punchTimeCard(event, false);
            break;
        case '設定帳號':

            setActionAndReplayMessage(event, "SetAccount", "請輸入帳號");
            break;
        case '設定密碼':

            setActionAndReplayMessage(event, "SetPassword", "請輸入密碼");
            break;
        case '關於':

            setActionAndReplayMessage(event, "SetPassword", "關於遲到救星\n\n主要在幫助你進到公司後，離遲到時間只剩下幾秒鐘，而電腦還來不及開啟時，遲到救星就是你的救星。\n\n只要輕鬆點擊『打卡』鈕，就可以讓你今天有個美好的開始。");
            break;
        case '設定':

            showSettingMenu(event);
            break;
        default:

            // 處理使用者的 Action
            firebase.database().ref('/'+ userID).once("value", function(snapshot) {

                if(snapshot.val().Action == "SetAccount") {

                    firebase.database().ref('/'+ userID).update({"UserAccount": event.message.text});

                    setActionAndReplayMessage(event, "none", `已將你的帳號設定為：\n${event.message.text}`);
                } else if(snapshot.val().Action == "SetPassword") {

                    firebase.database().ref('/'+ userID).update({"UserPassword": event.message.text});

                    setActionAndReplayMessage(event, "none", `已將你的密碼設定為：\n${event.message.text}`);
                } else {

                    setActionAndReplayMessage(event, "none", event.message.text);
                }
            });

            break;
    }
}

function setActionAndReplayMessage(event, action, message) {

    var userID = event.source.userId;

    firebase.database().ref('/'+ userID).update({"Action": action});

    var echo = { type: 'text', text: message };

    return client.replyMessage(event.replyToken, echo);
}


function punchTimeCard(event, isCheckIn) {

    var userID = event.source.userId;

    firebase.database().ref('/'+ userID).once("value", function(snapshot) {

        if(!snapshot.hasChild("UserAccount")) {

            return setActionAndReplayMessage(event, "none", '請先設定帳號');
        } else if(!snapshot.hasChild("UserPassword")) {

            return setActionAndReplayMessage(event, "none", '請先設定密碼');
        } else {

            var UserAccount = snapshot.val().UserAccount;
            var UserPassword = snapshot.val().UserPassword;
            console.log(`won test 1 ==> UserAccount(${UserAccount}) UserPassword(${UserPassword})`);

            if(typeof(UserAccount) == 'undefined') {

                return setActionAndReplayMessage(event, "none", '請先設定帳號');
            } else if(typeof(UserPassword) == 'undefined') {

                return setActionAndReplayMessage(event, "none", '請先設定密碼');
            } else if(UserAccount != "" && UserPassword != "") {

                actionPost(event, UserAccount, UserPassword, isCheckIn);
            }
        }
    });
}

function actionPost(event, UserAccount, UserPassword, isCheckIn) {

    var jar = request.jar();
    jar.setCookie(request.cookie("ASP.NET_SessionId=cfqqquke51de22ynulfdmtmp"), "http://checkin.taiwantaxi.com.tw/HRMS/checkin/checkin.aspx");

    var milliseconds = new Date().getTime() + '.00';

    var options;
    // 上班打卡
    if(isCheckIn == true) {

        options = {
            method: 'POST',
            url: 'http://checkin.taiwantaxi.com.tw/HRMS/checkin/checkin.aspx',
            headers: { 'content-type': 'multipart/form-data; boundary=---011000010111000001101001' },
            formData: {
                __EVENTTARGET: "",
                __EVENTARGUMENT: "",
                __VIEWSTATE: '/wEPDwUKLTI0NjI3NTIwNWQYAQUJR3JpZFZpZXcxD2dknSflqiP7PpSQ7GJc7dU+2ZHmE7tWoWhvhviqUy2huvE=',
                __VIEWSTATEGENERATOR: 'DD6A8FF8',
                hfAccount: UserAccount, // 帳號
                hfPasswd: UserPassword, // 密碼
                hfCheckflag: '1',
                hfServerTime: milliseconds,
                BtnCheckIn: '上班打卡'
            },
            jar: 'JAR'
        };
    // 下班打卡
    } else {

        options = {
            method: 'POST',
            url: 'http://checkin.taiwantaxi.com.tw/HRMS/checkin/checkin.aspx',
            headers: { 'content-type': 'multipart/form-data; boundary=---011000010111000001101001' },
            formData: {
                __EVENTTARGET: "",
                __EVENTARGUMENT: "",
                __VIEWSTATE: '/wEPDwUKLTI0NjI3NTIwNWQYAQUJR3JpZFZpZXcxD2dknSflqiP7PpSQ7GJc7dU+2ZHmE7tWoWhvhviqUy2huvE=',
                __VIEWSTATEGENERATOR: 'DD6A8FF8',
                hfAccount: UserAccount,
                hfPasswd: UserPassword,
                hfCheckflag: '0',
                hfServerTime: milliseconds,
                BtnCheckOut: '下班打卡'
            },
            jar: 'JAR'
        };
    }

    request(options, function (error, response, body) {

        if (error) throw new Error(error);

        if(body.indexOf("上班打卡時間：") > -1) {

            var echo = [
                {
                    "type": "sticker",
                    "packageId": "1",
                    "stickerId": "2571"
                },
                {
                    "type": 'text', text: `上班打卡成功\n你的帳號：${UserAccount}`
                }
            ];
            client.replyMessage(event.replyToken, echo);
        } else if(body.indexOf("下班打卡時間：") > -1) {

            var echo = [
                {
                    "type": "sticker",
                    "packageId": "1",
                    "stickerId": "2571"
                },
                {
                    "type": 'text', text: `下班打卡成功\n你的帳號：${UserAccount}`
                }
            ];
            client.replyMessage(event.replyToken, echo);
        } else {

            var echo = [
                {
                    "type": "sticker",
                    "packageId": "1",
                    "stickerId": "2592"
                },
                {
                    "type": 'text', text: `打卡失敗\n你的帳號：${UserAccount}\n你的密碼：${UserPassword}`
                }
            ];
            client.replyMessage(event.replyToken, echo);
        }
    });
}

function showSettingMenu(event) {

    var echo = {
        "type": "template",
        "altText": "this is a buttons template",
        "template": {
            "type": "buttons",
            "actions": [
                {
                    "type": "message",
                    "label": "設定帳號",
                    "text": "設定帳號"
                },
                {
                    "type": "message",
                    "label": "設定密碼",
                    "text": "設定密碼"
                }
            ],
            "thumbnailImageUrl": "https://img.technews.tw/wp-content/uploads/2017/03/02140321/55688-app-taxi.jpg",
            "text": "設定"
        }
    };
    client.replyMessage(event.replyToken, echo);
}
