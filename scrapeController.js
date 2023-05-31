const scrapers = require("./scraper");

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
    await scrapers.scraper(browser, selectedCategories[0].link);
    console.log(selectedCategories);
  } catch (error) {
    console.log("Error: ", error);
  }
};

module.exports = scrapeController;
