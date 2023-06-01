const scrapeCategory = (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      // tạo browser mới
      let page = await browser.newPage();
      console.log(">> Đã mở tag mới");
      // truy cập vào url
      await page.goto(url);
      console.log(">> Đang truy cập vào: ", url);
      // chờ cho đến khi selector div có id="webpage" xuất hiện
      await page.waitForSelector("#webpage");
      console.log(">> Website đã load xong: ", url);
      // lấy ra tất cả các thẻ a có class="#navbar-menu"
      const dataCategory = await page.$$eval(
        "#navbar-menu > ul > li",
        (elm) => {
          // lấy ra href của thẻ a
          dataCategory = elm.map((el) => {
            return {
              category: el.querySelector("a").innerText,
              link: el.querySelector("a").href,
            };
          });
          return dataCategory;
        }
      );
      // console.log("dataCategory: ", dataCategory);
      // đóng trang hiện tại
      await page.close();
      console.log(">> Đã đóng trang hiện tại");
      resolve(dataCategory);
    } catch (error) {
      console.log("Error: ", error);
      reject(error);
    }
  });

const scraper = (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      // tạo browser mới
      let newPage = await browser.newPage();
      console.log(">> Đã mở tab mới");
      // truy cập vào url
      await newPage.goto(url);
      console.log(">> Đang truy cập vào: ", url);
      // chờ cho đến khi selector div có id="main" xuất hiện
      await newPage.waitForSelector("#main");
      console.log(">> Đã load xong main: ", url);
      const scrapedData = {};
      // lay header data
      const headerData = await newPage.$eval("header", (elm) => {
        return {
          title: elm.querySelector("h1").innerText,
          description: elm.querySelector("p").innerText,
        };
      });
      // console.log("headerData: ", headerData);
      scrapedData.headerData = headerData;
      // lay link detail item
      const detailLinks = await newPage.$$eval(
        "#left-col > section.section-post-listing  ul > li",
        (elm) => {
          detailLinks = elm.map((el) => {
            return el.querySelector(".post-meta > h3 > a").href;
          });
          return detailLinks;
        }
      );

      // console.log("detailLinks: ", detailLinks);
      const scraperDetail = (detailLink) =>
        new Promise(async (resolve, reject) => {
          try {
            // tạo browser page detail mới
            let pageDetail = await browser.newPage();
            // console.log("Đã mở brower pageDetail");
            // truy cập vào url
            await pageDetail.goto(detailLink);
            console.log(">> Đang truy cập vào: ", detailLink);
            // chờ cho đến khi selector div có id="main" xuất hiện
            await pageDetail.waitForSelector("#main");
            console.log(">> Đã truy cập vào: ", detailLink);
            const detailData = {};
            // lay data anh
            const images = await pageDetail.$$eval(
              "#left-col > article > div.post-images > div > div.swiper-wrapper > div.swiper-slide > img",
              (elm) => {
                images = elm.map((el) => {
                  return el.src;
                });
                return images;
              }
            );
            detailData.images = images;
            // lay header data
            const headerData = await pageDetail.$eval(
              "header.page-header",
              (elm) => {
                return {
                  title: elm.querySelector("h1 > a").innerText,
                  star: elm
                    .querySelector("h1 > span")
                    ?.className?.replace(/^\D+/g, ""),
                  class: {
                    context: elm.querySelector("p").innerText,
                    classType: elm.querySelector("p > a > strong").innerText,
                  },
                  address: elm.querySelector("address").innerText,
                  attributes: {
                    price: elm.querySelector(
                      "div.post-attributes > .price > span"
                    ).innerText,
                    acreage: elm.querySelector(
                      "div.post-attributes > .acreage > span"
                    ).innerText,
                    published: elm.querySelector(
                      "div.post-attributes > .published > span"
                    ).innerText,
                    hashtag: elm.querySelector(
                      "div.post-attributes > .hashtag > span"
                    ).innerText,
                  },
                };
              }
            );
            // console.log("header", headerData);
            detailData.headerData = headerData;
            // lay thong tin mo ta
            const mainContentHeader = await pageDetail.$eval(
              "#left-col > article.the-post > section.post-main-content",
              (elm) => elm.querySelector("div.section-header > h2").innerText
            );
            const mainContentContent = await pageDetail.$$eval(
              "#left-col > article.the-post > section.post-main-content > .section-content > p",
              (elm) => elm.map((el) => el.innerText)
            );
            // console.log("mainContentHeader: ", mainContentHeader);
            // console.log("mainContentContent: ", mainContentContent);
            detailData.mainContent = {
              header: mainContentHeader,
              content: mainContentContent,
            };
            // lay dac diem tin dang
            const overviewHeader = await pageDetail.$eval(
              "#left-col > article.the-post > section.post-overview",
              (elm) => elm.querySelector("div.section-header > h3").innerText
            );
            const overviewContent = await pageDetail.$$eval(
              "#left-col > article.the-post > section.post-overview > .section-content > table.table > tbody > tr",
              (elm) =>
                elm.map((el) => ({
                  name: el.querySelector("td:first-child").innerText,
                  content: el.querySelector("td:last-child").innerText,
                }))
            );
            detailData.overview = {
              header: overviewHeader,
              content: overviewContent,
            };
            // lay thong tin lien he
            const contactHeader = await pageDetail.$eval(
              "#left-col > article.the-post > section.post-contact",
              (elm) => elm.querySelector("div.section-header > h3").innerText
            );
            const contactContent = await pageDetail.$$eval(
              "#left-col > article.the-post > section.post-contact > .section-content > table.table > tbody > tr",
              (elm) =>
                elm.map((el) => ({
                  name: el.querySelector("td:first-child").innerText,
                  content: el.querySelector("td:last-child").innerText,
                }))
            );
            detailData.contact = {
              header: contactHeader,
              content: contactContent,
            };
            resolve(detailData);
            // dong trang
            await pageDetail.close();
            console.log(">> Đã cào xong data trang hiện tại");
          } catch (error) {
            console.log("Error: ", error);
            reject(error);
          }
        });

      const detailsData = [];
      for (let detailLink of detailLinks) {
        const details = await scraperDetail(detailLink);
        detailsData.push(details);
      }

      scrapedData.body = await Promise.all(detailsData);

      console.log("\n+++ Hoàn tất cào data +++");

      resolve(scrapedData);
    } catch (error) {
      console.log("Error: ", error);
      reject(error);
    }
  });

module.exports = { scrapeCategory, scraper };
