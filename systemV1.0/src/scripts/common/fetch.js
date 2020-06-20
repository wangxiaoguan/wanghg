import { message } from "antd";
import { getToken } from "../utils/ProjectUtils";

export function postService(path, body, callback) {
  fetch(path, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer: ${getToken()}`,
    },
    credentials: "include",
    cache: "default",
    body: JSON.stringify(body),
  })
    .then(function (response) {
      if (response.status === 200) {
        response.json().then((json) => {
          return callback && callback(json);
        });
      } else if (response.status === 401) {
        message.error("系统错误");
      } else if (response.status === 403) {
        message.error("无权操作");
      } else {
        return callback(response.status);
      }
      return response.json().then((json) => {
        callback && callback(json);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
export function getService(path, callback) {
  fetch(path, {
    method: "GET",
    mode: "cors",
    credentials: "include",
    cache: "default",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer: ${getToken()}`,
    },
  })
    .then(function (response) {
      if (response.status === 200) {
        response.json().then((json) => {
          if (json.status === -999) {
            message.error("系统错误");
          } else if (json.errorCode === "A02B10001") {
            message.error(json.errorMsg);
          } else {
            return callback && callback(json);
          }
        });
      } else if (response.status === 401) {
        message.error("系统错误");
      } else if (response.status === 403) {
        message.error("无权操作");
      } else {
        return callback(response.status);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
export function postExportExcelService(path, query, fileName) {
  return new Promise((resolve, rej) => {
    fetch(path, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer: ${getToken()}`,
      },
      credentials: "include",
      cache: "default",
      dataType: "application/excel;charset=utf-8",
      body: JSON.stringify(query),
    })
      .then(function (response) {
        localStorage.setItem("selectedRowKeys", "");
        if (response.status === 403) {
          message.error("无权操作");
          resolve(false);
        } else if (response.status === 200) {
          response.blob().then((blob) => {
            if (blob.size < 500) {
              message.error("文件下载失败，请稍后再试");
              resolve(false);
              return;
            }
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            if (fileName == null) {
              fileName = "default_excel_name";
            }
            if (fileName === "学习笔记附件.zip") {
              a.download = fileName;
            } else {
              a.download = fileName + ".xls";
            }
            if (document.all) {
              a.click();
              resolve(false);
            } else {
              let evt = document.createEvent("MouseEvents");
              evt.initEvent("click", true, true);
              a.dispatchEvent(evt);
              resolve(false);
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
        resolve(false);
      });
  }).catch((err) => {
    console.log(err);
  });
}
export function getExportExcelService(path, fileName) {
  return new Promise((resolve, rej) => {
    fetch(path, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer: ${getToken()}`,
      },
      credentials: "include",
      cache: "default",
      dataType: "application/excel;charset=utf-8",
    }).then(function (response) {
      localStorage.setItem("selectedRowKeys", "");
      if (response.status === 403) {
        message.error("无权操作");
      } else if (response.status === 200) {
        response
          .blob()
          .then((blob) => {
            if (blob.size < 500) {
              message.error("文件下载失败，请稍后再试");
              return;
            }
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            if (fileName == null) {
              fileName = "default_excel_name";
            }
            a.download = fileName + ".xls";
            if (document.all) {
              a.click();
              resolve(false);
            } else {
              let evt = document.createEvent("MouseEvents");
              evt.initEvent("click", true, true);
              a.dispatchEvent(evt);
              resolve(false);
            }
          })
          .catch((error) => {
            console.log(error);
            resolve(false);
          });
      }
    });
  }).catch((err) => {
    console.log(err);
  });
}
export function getSearch(_URL, names) {
  let URL = _URL.split("?")[1];
  let queryResult = {};
  let reg = "";
  if (URL && names instanceof Array) {
    names.map(function (v, k) {
      reg = new RegExp("(^|&)" + v + "=([^&]*)(&|$)");
      let r = URL.match(reg);
      if (r != null) {
        queryResult[v] = r[2];
      }
    });
  } else {
  }
  return queryResult;
}
