export class BadgeClass {
  //#hasBadgePermission: boolean = false;
  #lastN = 0;

  checkPermission(): void {
    navigator.permissions
      .query({ name: 'notifications' as PermissionName })
      .then(
        (permissionStatus) => this.#onPermissionStateFound(permissionStatus.state, true),
        (e) => console.log('Permission query error: ' + e)
      );
  }

  updateBadge(n: number): void {
    if (n !== this.#lastN) {
      if (n > 0) {
        this.#setBadge(n);
      } else {
        this.#clearBadge();
      }
    }
  }

  #setBadge(n: number): void {
    this.#lastN = n;
    if (!('setAppBadge' in navigator)) {
      console.log('setAppBadge not available');
      return;
    }

    (navigator as { setAppBadge?: (n: number) => Promise<void> })
      .setAppBadge?.(n)
      .catch((e) => console.log('Failed to set app badge: ' + e));
  }

  #clearBadge(): void {
    if (!('clearAppBadge' in navigator)) {
      console.log('clearAppBadge not available');
      return;
    }

    (navigator as { clearAppBadge?: () => Promise<void> })
      .clearAppBadge?.()
      .catch((e) => console.log('Failed to clear app badge: ' + e));
  }

  #requestPermission(): void {
    if (!('Notification' in window)) {
      console.log('No Notification support');
      return;
    }
    Notification.requestPermission().then(
      (permission) => this.#onPermissionStateFound(permission),
      (e) => console.log('Request permission error: ' + e)
    );
  }

  #onPermissionStateFound(state: string, autoRrequest = false): void {
    switch (state) {
      case 'granted':
        // You can use the Badging API
        //this.#hasBadgePermission = true;
        break;
      case 'denied':
        // The user has denied the permission
        //this.#hasBadgePermission = false;
        break;
      default:
        // The user has not yet granted or denied the permission
        if (autoRrequest) {
          this.#requestPermission();
        }
        break;
    }
  }
}

export const Badge = new BadgeClass();

