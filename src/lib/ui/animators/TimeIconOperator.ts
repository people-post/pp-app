export class TimeIconOperator {
  press(iconElement: Element): void {
    let ee = iconElement.firstElementChild;
    if (!ee) return;
    ee = ee.firstElementChild as Element;     // time-menu-icon-circle
    let m = ee.nextElementSibling as HTMLElement; // time-menu-icon-hour

    if (!m) return;

    m.style.transform = "translateX(-4px) translateY(4px) rotate(90deg)";
    m.style.webkitTransform = "translateX(-4px) translateY(4px) rotate(90deg)";

    m.style.animationName = "timemenuicon-needle-transform";
    m.style.animationTimingFunction = "linear";
    m.style.webkitAnimationName = "timemenuicon-needle-transform";
    m.style.webkitAnimationDuration = "0.5s";
  }

  release(iconElement: Element, animated: boolean): void {
    let ee = iconElement.firstElementChild;
    if (!ee) return;
    ee = ee.firstElementChild as Element;     // time-menu-icon-circle
    let m = ee.nextElementSibling as HTMLElement; // time-menu-icon-hour

    if (!m) return;

    m.style.transform = "rotate(0deg)";
    m.style.webkitTransform = "rotate(0deg)";
    if (animated) {
      m.style.animationName = "timemenuicon-needle-reverse-transform";
      m.style.animationTimingFunction = "linear";
      m.style.webkitAnimationName = "timemenuicon-needle-reverse-transform";
      m.style.webkitAnimationDuration = "0.5s";
    } else {
      m.style.animationName = "";
      m.style.webkitAnimationName = "";
      m.style.webkitAnimationDuration = "";
    }
  }
}

