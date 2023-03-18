import axios from "axios";
export class UploadAdapterPlugin {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve) => {
          this.sendRequest(file, resolve);
        })
    );
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  async sendRequest(file, resolve) {
    const data = new FormData();
    data.append("file-to-upload", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_API}/api/${
          import.meta.env.VITE_APP_PATH
        }/admin/upload`,
        data
      );

      resolve({
        default: res.data.imageUrl,
      });
    } catch (err) {
      console.dir(err.response);
    }
  }
}
