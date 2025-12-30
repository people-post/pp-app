export class MainIconOperator {
  press(iconElement) {
    let e = iconElement.firstElementChild;
    var t = e.firstElementChild;  // main-menu-icon-top
    var m = t.nextElementSibling; // main-menu-icon-middle
    var b = m.nextElementSibling; // main-menu-icon-bottom

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

  release(iconElement, animated) {
    let e = iconElement.firstElementChild;
    var t = e.firstElementChild;  // main-menu-icon-top
    var m = t.nextElementSibling; // main-menu-icon-middle
    var b = m.nextElementSibling; // main-menu-icon-bottom

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
      t.style.animationName = null;
      t.style.webkitAnimationName = null;
      t.style.webkitAnimationDuration = null;
      m.style.animationName = null;
      m.style.webkitAnimationName = null;
      m.style.webkitAnimationDuration = null;
      b.style.animationName = null;
      b.style.webkitAnimationName = null;
      b.style.webkitAnimationDuration = null;
    }
  }
}
