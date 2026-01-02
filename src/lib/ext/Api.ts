export class Api {
  #createRequestObject(): XMLHttpRequest | null {
    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      return new XMLHttpRequest();
    } else {
      // code for IE6, IE5
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new (window as any).ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        // Ignore error
      }
    }
    alert("We are sorry, but your browser doesn't support XML handling!");
    return null;
  }

  asyncFormPost(
    url: string,
    data: unknown,
    onOk: (responseText: string) => void,
    onErr: (responseText: string) => void,
    onProg: ((loaded: number) => void) | null = null
  ): void {
    const xhr = this.#createRequestObject();
    if (!xhr) return;
    xhr.open("POST", url, true);
    xhr.withCredentials = true;
    // xhr.setRequestHeader("Content-Type",
    //                         "application/x-www-form-urlencoded");
    if (onProg) {
      xhr.upload.addEventListener('progress', (e) => onProg(e.loaded));
    }
    xhr.onload = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 400) {
          onErr(xhr.responseText);
        } else if (xhr.status === 200) {
          onOk(xhr.responseText);
        }
      }
    };
    xhr.onerror = () => onErr(xhr.responseText);
    xhr.send(data as XMLHttpRequestBodyInit | null);
  }

  asyncJsonPost(
    url: string,
    data: unknown,
    onOk: (responseText: string) => void,
    onErr: (responseText: string) => void,
    onProg: ((loaded: number) => void) | null = null
  ): void {
    const xhr = this.#createRequestObject();
    if (!xhr) return;
    xhr.open("POST", url, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Content-Type", "application/json");
    if (onProg) {
      xhr.upload.addEventListener('progress', (e) => onProg(e.loaded));
    }
    xhr.onload = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 400) {
          onErr(xhr.responseText);
        } else if (xhr.status === 200) {
          onOk(xhr.responseText);
        }
      }
    };
    xhr.onerror = () => onErr(xhr.responseText);
    xhr.send(JSON.stringify(data));
  }

  asyncCall(
    url: string,
    onOk: (responseText: string) => void,
    onErr: (responseText: string) => void
  ): void {
    const xhr = this.#createRequestObject();
    if (!xhr) return;
    xhr.open("GET", url, true);
    xhr.withCredentials = true;
    xhr.onload = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        onOk(xhr.responseText);
      } else {
        onErr(xhr.responseText);
      }
    };
    xhr.onerror = () => onErr(xhr.responseText);
    xhr.send();
  }
}

