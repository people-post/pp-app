export class SearchIconOperator {
  press(iconElement: Element): void {
    let ee = iconElement.firstElementChild;
    if (!ee) return;
    let c = ee.firstElementChild as HTMLElement; // circle
    let t = c.nextElementSibling as HTMLElement; // top-bar
    let b = t.nextElementSibling as HTMLElement; // bottom-bar

    if (!c || !t || !b) return;

    c.style.transform = "translateX(2px) translateY(2px)";
    c.style.webkitTransform = "translateX(2px) translateY(2px)";

    t.style.transform = "translateX(-6px) translateY(-6px) rotate(45deg)";
    t.style.webkitTransform = "translateX(-6px) translateY(-6px) rotate(45deg)";

    b.style.transform = "translateX(-6px) translateY(-7px) rotate(-45deg)";
    b.style.webkitTransform =
        "translateX(-6px) translateY(-7px) rotate(-45deg)";
  }

  release(iconElement: Element, _animated: boolean): void {
    let ee = iconElement.firstElementChild;
    if (!ee) return;
    let c = ee.firstElementChild as HTMLElement; // circle
    let t = c.nextElementSibling as HTMLElement; // top-bar
    let b = t.nextElementSibling as HTMLElement; // bottom-bar

    if (!c || !t || !b) return;

    c.style.transform = "";
    c.style.webkitTransform = "";

    // The SVG bars are drawn at 45deg in SVG coordinates, so resetting
    // the CSS transform to "" restores the natural drawn position (no extra rotation needed).
    t.style.transform = "";
    t.style.webkitTransform = "";

    b.style.transform = "";
    b.style.webkitTransform = "";
  }
}

