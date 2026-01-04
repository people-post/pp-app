export class MainIconOperator {
  press(iconElement: Element): void {
    let e = iconElement.firstElementChild;
    if (!e) return;
    var t = e.firstElementChild as HTMLElement;  // main-menu-icon-top
    var m = t.nextElementSibling as HTMLElement; // main-menu-icon-middle
    var b = m.nextElementSibling as HTMLElement; // main-menu-icon-bottom

    if (!t || !m || !b) return;

    t.style.transform = "rotate(45deg)";
    t.style.webkitTransform = "rotate(45deg)";

    m.style.visibility = "hidden";

    b.style.transform = "rotate(-45deg)";
    b.style.webkitTransform = "rotate(-45deg)";

    t.style.animationName = "menuicon-top-transform";
    t.style.webkitAnimationName = "menuicon-top-transform";

    m.style.animationName = "menuicon-middle-transform";
    m.style.webkitAnimationName = "menuicon-middle-transform";

    b.style.animationName = "menuicon-bottom-transform";
    b.style.webkitAnimationName = "menuicon-bottom-transform";

    t.style.webkitAnimationDuration = "0.5s";
    m.style.webkitAnimationDuration = "0.5s";
    b.style.webkitAnimationDuration = "0.5s";
  }

  release(iconElement: Element, animated: boolean): void {
    let e = iconElement.firstElementChild;
    if (!e) return;
    var t = e.firstElementChild as HTMLElement;  // main-menu-icon-top
    var m = t.nextElementSibling as HTMLElement; // main-menu-icon-middle
    var b = m.nextElementSibling as HTMLElement; // main-menu-icon-bottom

    if (!t || !m || !b) return;

    t.style.transform = "translateY(-4px)";
    t.style.webkitTransform = "translateY(-4px)";

    m.style.visibility = "inherit";

    b.style.transform = "translateY(4px)";
    b.style.webkitTransform = "translateY(4px)";

    if (animated) {
      t.style.animationName = "menuicon-top-reverse-transform";
      t.style.webkitAnimationName = "menuicon-top-reverse-transform";
      t.style.webkitAnimationDuration = "0.5s";
      m.style.animationName = "menuicon-middle-reverse-transform";
      m.style.webkitAnimationName = "menuicon-middle-reverse-transform";
      m.style.webkitAnimationDuration = "0.5s";
      b.style.animationName = "menuicon-bottom-reverse-transform";
      b.style.webkitAnimationName = "menuicon-bottom-reverse-transform";
      b.style.webkitAnimationDuration = "0.5s";
    } else {
      t.style.animationName = "";
      t.style.webkitAnimationName = "";
      t.style.webkitAnimationDuration = "";
      m.style.animationName = "";
      m.style.webkitAnimationName = "";
      m.style.webkitAnimationDuration = "";
      b.style.animationName = "";
      b.style.webkitAnimationName = "";
      b.style.webkitAnimationDuration = "";
    }
  }
}

