import axios from "axios";

export function useCheckToken() {
  const AUTH_TOKEN = document.cookie.replace(
    /(?:(?:^|.*;\s*)hexHomeWorkToken\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  axios.defaults.headers.common.Authorization = AUTH_TOKEN;
}
