const debounce = (func, delay= 1000)=>{
  let timeOutId; 
  return (...args)=>{
    if(timeOutId){
      clearTimeout(timeOutId);
      document.querySelector('.tutorial').style.opacity = 0.2;
    }
    timeOutId = setTimeout(()=>{
      func.apply(null, args);
     }, delay);
  }
}
