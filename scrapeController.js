const scrapers = require("./scraper");
const fs = require("fs");

const scrapeController = async (browserInstance) => {
  const url = "https://phongtro123.com/";
  const indexs = [1, 2, 3, 4]; // lay 4 phan tu dau tien
  try {
    // tạo browser mới
    let browser = await browserInstance;
    // gọi hàm cào ở file scrape
    const categories = await scrapers.scrapeCategory(browser, url);
    // lấy ra các phần tử có index trong mảng indexs
    const selectedCategories = categories.filter((category, index) => {
      return indexs.some((i) => i === index);
    });
    // let results1 = await scrapers.scraper(browser, selectedCategories[0].link);
    // fs.writeFile("chothuephongtro.json", JSON.stringify(results), (err) => {
    //   if (err) console.log("Ghi data vô file thất bại", err);
    //   console.log("Ghi data vô file thành công");
    // });
    let results2 = await scrapers.scraper(browser, selectedCategories[0].link);
    fs.writeFile("nhachothue.json", JSON.stringify(results2), (err) => {
      if (err) console.log("Ghi data vô file thất bại", err);
      console.log("Ghi data vô file thành công");
    });
    let results3 = await scrapers.scraper(browser, selectedCategories[0].link);
    fs.writeFile("chothuecanho.json", JSON.stringify(results3), (err) => {
      if (err) console.log("Ghi data vô file thất bại", err);
      console.log("Ghi data vô file thành công");
    });
    let results4 = await scrapers.scraper(browser, selectedCategories[0].link);
    fs.writeFile("chothuematbang.json", JSON.stringify(results4), (err) => {
      if (err) console.log("Ghi data vô file thất bại", err);
      console.log("Ghi data vô file thành công");
    });

    await browser.close();
  } catch (error) {
    console.log("Error: ", error);
  }
};

module.exports = scrapeController;
