(()=>{
  const banner=document.querySelector('#pwa-banner');
  const message=document.querySelector('#pwa-message');
  const action=document.querySelector('#pwa-action');
  const dismiss=document.querySelector('#pwa-dismiss');
  let installPrompt=null,registration=null;
  const show=(text,label,handler)=>{message.textContent=text;banner.hidden=false;action.hidden=!label;action.textContent=label||'';action.onclick=handler||null};
  dismiss.addEventListener('click',()=>banner.hidden=true);
  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();installPrompt=event;
    if(!sessionStorage.getItem('pwa-install-dismissed'))show('可將英文闖關樂園安裝到裝置，離線時也能練習。','安裝',async()=>{installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;banner.hidden=true});
  });
  window.addEventListener('appinstalled',()=>{banner.hidden=true;installPrompt=null});
  dismiss.addEventListener('click',()=>{if(installPrompt)sessionStorage.setItem('pwa-install-dismissed','1')});
  const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent)&&!window.MSStream;
  const isStandalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  if(isIOS&&!isStandalone&&!sessionStorage.getItem('pwa-ios-hint-dismissed')){
    show('在 iPhone 或 iPad 使用 Safari：點「分享」→「加入主畫面」，即可安裝。');
    dismiss.addEventListener('click',()=>sessionStorage.setItem('pwa-ios-hint-dismissed','1'));
  }
  if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
    navigator.serviceWorker.register(new URL('./sw.js',document.baseURI),{scope:new URL('./',document.baseURI).pathname}).then(reg=>{
      registration=reg;
      if(reg.waiting&&navigator.serviceWorker.controller)show('有可用更新，重新載入即可使用最新版。','立即更新',()=>reg.waiting.postMessage('SKIP_WAITING'));
      reg.addEventListener('updatefound',()=>{const worker=reg.installing;if(!worker)return;worker.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)show('有可用更新，重新載入即可使用最新版。','立即更新',()=>worker.postMessage('SKIP_WAITING'))})});
      // Check for a new version on each visit. The worker only activates after
      // the user chooses update, then the page reloads once under the new worker.
      reg.update().catch(()=>{});
    }).catch(error=>console.warn('Service worker 註冊失敗：',error));
    let refreshing=false;
    navigator.serviceWorker.addEventListener('controllerchange',()=>{if(refreshing)return;refreshing=true;location.reload()});
  }
})();
