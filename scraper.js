const scrapeCategory = (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      // tạo browser mới
      let page = await browser.newPage();
      console.log("1 Đã mở brower mới");
      // truy cập vào url
      await page.goto(url);
      console.log("Đang truy cập vào: ", url);
      // chờ cho đến khi selector div có id="webpage" xuất hiện
      await page.waitForSelector("#webpage");
      console.log("Đã truy cập vào: ", url);
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
      console.log("Đã đóng trang hiện tại");
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
      console.log("2 Đã mở brower mới");
      // truy cập vào url
      await newPage.goto(url);
      console.log("Đang truy cập vào: ", url);
      // chờ cho đến khi selector div có id="main" xuất hiện
      await newPage.waitForSelector("#main");
      console.log("Đã truy cập vào: ", url);
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

      console.log("detailLinks: ", detailLinks);
      const scraperDetail = (detailLink) =>
        new Promise(async (resolve, reject) => {
          try {
            // tạo browser page detail mới
            let pageDetail = await browser.newPage();
            console.log("Đã mở brower pageDetail");
            // truy cập vào url
            await pageDetail.goto(detailLink);
            console.log("Đang truy cập vào: ", detailLink);
            // chờ cho đến khi selector div có id="main" xuất hiện
            await pageDetail.waitForSelector("#main");
            console.log("Đã truy cập vào: ", detailLink);
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
                  star: elm.querySelector("h1 > span").className,
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
            console.log("header", headerData);
            // dong trang
            await pageDetail.close();
            console.log("Đã đóng trang hiện tại ");
          } catch (error) {
            console.log("Error: ", error);
            reject(error);
          }
        });

      for (let detailLink of detailLinks) {
        await scraperDetail(detailLink);
      }

      await browser.close();
      console.log("Đã đóng trang hiện tại");
    } catch (error) {
      console.log("Error: ", error);
      reject(error);
    }
  });

module.exports = { scrapeCategory, scraper };
