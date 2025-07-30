const wrapper = document.querySelector(".wrapper")


function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}


function scaleToFit() {
  const baseWidth = 1140;
  const baseHeight = 640;

  const width = isMobile() ? screen.width : window.innerWidth;
  const height = isMobile() ? screen.height : window.innerHeight;

  const scaleX = width / baseWidth;
  const scaleY = height / baseHeight;
  const scale = Math.min(scaleX, scaleY);
  

  wrapper.style.transform = `scale(${scale})`;
  wrapper.style.top = `${(window.innerHeight - (scale * baseHeight))/2}px`
  
  if (isMobile()) {
    wrapper.style.transformOrigin = 'top left';
  } else {
    wrapper.style.transformOrigin = 'top center';
  }

}

  window.addEventListener('load', scaleToFit);
  window.addEventListener('resize', scaleToFit);
window.addEventListener("orientationchange", scaleToFit);