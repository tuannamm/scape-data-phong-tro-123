const puppeteer = require("puppeteer");

const startBrowser = async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      // có hiện ui của Chromium hay không
      headless: true,
      // Chrome sử dụng multiple layers của sandbox để tránh những nội dung web không đáng tin cậy
      args: ["--disable-setuid-sandbox"],
      // bỏ qua lỗi liên quan đến bảo mật của https
      ignoreHTTPSErrors: true,
    });
  } catch {
    console.log("Can not create browser instance => : ", err);
  }
  return browser;
};

module.exports = startBrowser;
