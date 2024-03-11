/**
 * how to run in terminal 
 * node node page_loads_successfully_test.jsx http://localhost:5173/
 */

const { remote } = require('webdriverio');

(async () => {
  let browser = null; 

  try {
    const [, , url] = process.argv;

    browser = await remote({
      capabilities: {
        browserName: 'chrome'
      }
    });

    await browser.url(url);

    const title = await browser.getTitle();
    console.assert(title.includes('inventory'), 'Page title should contain "Inventory"');

    const success = true;
    return success;

  } catch (error) {
    console.error('Error:', error);
    return false; 
  } finally {
    if (browser) {
      await browser.deleteSession();
    }
  }
})();
