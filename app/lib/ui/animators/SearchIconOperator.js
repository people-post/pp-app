class SearchIconOperator {
  press(iconElement) {
    let ee = iconElement.firstElementChild;
    let c = ee.firstElementChild; // search-icon-circle
    let t = c.nextElementSibling; // search-icon-top-bar
    let b = t.nextElementSibling; // search-icon-bottom-bar

    c.style.transform = "translateX(2px) translateY(2px)";
    c.style.webkitTransform = "translateX(2px) translateY(2px)";

    t.style.transform = "translateX(-6px) translateY(-6px) rotate(45deg)";
    t.style.webkitTransform = "translateX(-6px) translateY(-6px) rotate(45deg)";

    b.style.transform = "translateX(-6px) translateY(-7px) rotate(-45deg)";
    b.style.webkitTransform =
        "translateX(-6px) translateY(-7px) rotate(-45deg)";

    c.style.animationName = "searchicon-circle-transform";
    c.style.webkitAnimationName = "searchicon-circle-transform";

    t.style.animationName = "searchicon-top-bar-transform";
    t.style.webkitAnimationName = "searchicon-top-bar-transform";

    b.style.animationName = "searchicon-bottom-bar-transform";
    b.style.webkitAnimationName = "searchicon-bottom-bar-transform";

    c.style.webkitAnimationDuration = "0.5s";
    t.style.webkitAnimationDuration = "0.5s";
    b.style.webkitAnimationDuration = "0.5s";
  }

  release(iconElement, animated) {
    let ee = iconElement.firstElementChild;
    let c = ee.firstElementChild; // search-icon-circle
    let t = c.nextElementSibling; // search-icon-top-bar
    let b = t.nextElementSibling; // search-icon-bottom-bar

    c.style.transform = "";
    c.style.webkitTransform = "";

    t.style.transform = "rotate(45deg)";
    t.style.webkitTransform = "rotate(45deg)";

    b.style.transform = "rotate(45deg)";
    b.style.webkitTransform = "rotate(45deg)";

    if (animated) {
      c.style.animationName = "searchicon-circle-reverse-transform";
      c.style.webkitAnimationName = "searchicon-circle-reverse-transform";

      t.style.animationName = "searchicon-top-bar-reverse-transform";
      t.style.webkitAnimationName = "searchicon-top-bar-reverse-transform";

      b.style.animationName = "searchicon-bottom-bar-reverse-transform";
      b.style.webkitAnimationName = "searchicon-bottom-bar-reverse-transform";

      c.style.webkitAnimationDuration = "0.5s";
      t.style.webkitAnimationDuration = "0.5s";
      b.style.webkitAnimationDuration = "0.5s";
    } else {
      c.style.animationName = null;
      c.style.webkitAnimationName = null;
      c.style.webkitAnimationDuration = null;
      t.style.animationName = null;
      t.style.webkitAnimationName = null;
      t.style.webkitAnimationDuration = null;
      b.style.animationName = null;
      b.style.webkitAnimationName = null;
      b.style.webkitAnimationDuration = null;
    }
  }
}
