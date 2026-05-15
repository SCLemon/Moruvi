
import axios from "axios";
import jsCookie from "js-cookie";

const publicVapidKey = 'BDaELLgGYNHLi1choUSCQFtfKmP56DV1f7TJunGM_dqPRgQosEoflD4xEiLYG4DTypK4DWmdZ5H27XthqyYRm0g';

// 產生裝置指紋

// 註冊 ServiceWorker
async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    const existingReg = await navigator.serviceWorker.getRegistration();
    try{
      if(!existingReg) {
        await navigator.serviceWorker.register("/service-worker.js")
        return { type:'success', message: 'Service Worker 註冊成功'};
      }
      else {
        await existingReg.update();
        return { type:'success', message: 'Service Worker 更新成功'};
      }
    }
    catch(e){
      console.log(e)
      return { type:'error',message: 'Service Worker 註冊失敗'};
    }
  }
  else {
    return { type:'error',message: '本裝置不支援 Service Worker 訂閱服務'};
  }
}

// 進行裝置訂閱
async function subscribe() {

  const registerResult = await registerServiceWorker();
  if(registerResult.type == 'error') return registerResult;

  const reg = await navigator.serviceWorker.ready;

  const existing = await reg.pushManager.getSubscription();
  if (existing) await existing.unsubscribe();

  if (Notification.permission !== "granted") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted"){
      return { type:'error',message: '請開啟通知權限'};
    }
  }

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });

  // 傳給後端儲存
  try{
      const res = await axios.post("/api/ws/save-subscribe", {
        subscription: sub
      },
      {
        headers:{
          'x-user-token': jsCookie.get('authToken')
        }
      });
      return { type: res.data.type, message: res.data.message };
  }
  catch(e){
    return { type:'error',message: '推播訂閱失敗'};
  }

}

// 裝置訂閱狀態
async function checkSubscribed(){
  try{
    const res = await axios.get("/api/ws/check-subscribe",
    {
      headers:{
        'x-user-token': jsCookie.get('authToken')
      }
    });
    return res.data.subscribed;
  }
  catch(e){
    return false;
  }
}


function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export {
  registerServiceWorker, subscribe, checkSubscribed
}