class TimeIconOperator {
  press(iconElement) {
    let ee = iconElement.firstElementChild;
    ee = ee.firstElementChild;     // time-menu-icon-circle
    let m = ee.nextElementSibling; // time-menu-icon-hour

    m.style.transform = "translateX(-4px) translateY(4px) rotate(90deg)";
    m.style.webkitTransform = "translateX(-4px) translateY(4px) rotate(90deg)";

    m.style.animationName = "timemenuicon-needle-transform";
    m.style.animationTimingFunction = "linear";
    m.style.webkitAnimationName = "timemenuicon-needle-transform";
    m.style.webkitAnimationDuration = "0.5s";
  }

  release(iconElement, animated) {
    let ee = iconElement.firstElementChild;
    ee = ee.firstElementChild;     // time-menu-icon-circle
    let m = ee.nextElementSibling; // time-menu-icon-hour
    m.style.transform = "rotate(0deg)";
    m.style.webkitTransform = "rotate(0deg)";
    if (animated) {
      m.style.animationName = "timemenuicon-needle-reverse-transform";
      m.style.animationTimingFunction = "linear";
      m.style.webkitAnimationName = "timemenuicon-needle-reverse-transform";
      m.style.webkitAnimationDuration = "0.5s";
    } else {
      m.style.animationName = null;
      m.style.webkitAnimationName = null;
      m.style.webkitAnimationDuration = null;
    }
  }
}
