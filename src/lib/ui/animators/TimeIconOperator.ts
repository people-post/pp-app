export class TimeIconOperator {
  press(iconElement: Element): void {
    let ee = iconElement.firstElementChild;
    if (!ee) return;
    ee = ee.firstElementChild as Element;     // time-menu-icon-circle
    let m = ee.nextElementSibling as HTMLElement; // time-menu-icon-hour

    if (!m) return;

    m.style.transform = "translateX(-4px) translateY(4px) rotate(90deg)";
    m.style.webkitTransform = "translateX(-4px) translateY(4px) rotate(90deg)";
  }

  release(iconElement: Element, _animated: boolean): void {
    let ee = iconElement.firstElementChild;
    if (!ee) return;
    ee = ee.firstElementChild as Element;     // time-menu-icon-circle
    let m = ee.nextElementSibling as HTMLElement; // time-menu-icon-hour

    if (!m) return;

    m.style.transform = "";
    m.style.webkitTransform = "";
  }
}

