# go-go-late


### 1、初始化 Firebase 
``` csharp
firebase init
```

### 2、挑選 Functions
![GITHUB](https://firebasestorage.googleapis.com/v0/b/go-go-late-209a6.appspot.com/o/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%202018-08-16%20%E4%B8%8B%E5%8D%8811.35.31.png?alt=media&token=5349b472-e0b3-44eb-8f07-bea5e534d4f2 "functions圖示")

### 3、挑選 你的專案
![GITHUB](https://firebasestorage.googleapis.com/v0/b/go-go-late-209a6.appspot.com/o/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%202018-08-16%20%E4%B8%8B%E5%8D%8811.41.01.png?alt=media&token=95ea5475-788d-449f-af05-4e853c61cbbd "functions圖示")

### 4、挑選JavaScript 以及安裝預設檔案
![GITHUB](https://firebasestorage.googleapis.com/v0/b/go-go-late-209a6.appspot.com/o/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%202018-08-16%20%E4%B8%8B%E5%8D%8811.42.40.png?alt=media&token=757d4413-7b39-43ab-b687-33765624be22 "functions圖示")

### 5、替換 functions/index.html

### 6、安裝需要的套件
``` csharp
npm install dotenv --save
npm install @line/bot-sdk --save
npm install firebase-functions --save
npm install firebase --save
npm install request --save
```

### 7、進到 functions 目錄下，建立 .env 設定檔

### 8、打開 [LINE Developers](https://developers.line.me/) 並 Create new channel。並將 Channel access token 及 Channel secret 分別填入 .env 設定檔。
``` csharp
channelAccessToken = "XXXXX"
channelSecret = "XXXXX"
```

### 8、打開 [Firebase](https://console.firebase.google.com/) 進到 專案設定 -> 一般，點擊"將 Firebase 加入您的網路應用程式"鈕，然後將 config 值分別填入 .env 設定檔。
``` csharp
apiKey = "XXXXX"
authDomain = "XXXXX"
databaseURL = "XXXXX"
projectId = "XXXXX"
storageBucket = "XXXXX"
messagingSenderId = "XXXXX"
```

### 9、本地端執行 Firebase Functions
``` csharp
firebase serve --only functions
```

### 10、執行成功
![GITHUB](https://firebasestorage.googleapis.com/v0/b/go-go-late-209a6.appspot.com/o/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%202018-08-17%20%E4%B8%8A%E5%8D%8812.07.43.png?alt=media&token=a2624de0-f8c7-400e-a2de-d22e0d9ba0cc "functions圖示")





