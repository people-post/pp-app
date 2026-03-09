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
  }

  release(iconElement: Element, _animated: boolean): void {
    let e = iconElement.firstElementChild;
    if (!e) return;
    var t = e.firstElementChild as HTMLElement;  // main-menu-icon-top
    var m = t.nextElementSibling as HTMLElement; // main-menu-icon-middle
    var b = m.nextElementSibling as HTMLElement; // main-menu-icon-bottom

    if (!t || !m || !b) return;

    t.style.transform = "";
    t.style.webkitTransform = "";

    m.style.visibility = "inherit";

    b.style.transform = "";
    b.style.webkitTransform = "";
  }
}

