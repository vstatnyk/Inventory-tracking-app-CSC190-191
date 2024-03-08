/**
 * how to run in terminal 
 * node navigation_to_inventory_page_test.jsx 'http://localhost:5173/' username password
 */
const { remote } = require('webdriverio');

(async () => {
  let browser = null; 

  try {
    const [, , url, email, password] = process.argv;

    browser = await remote({
      capabilities: {
        browserName: 'chrome'
      }
    });

    await browser.url(url);


    const emailField = await browser.$('[id="username"]');
    const passwordField = await browser.$('[id="password"]');
    const loginButton = await browser.$('button[type="submit"]');

    await emailField.setValue(email);
    await passwordField.setValue(password);
    await loginButton.click();

    await browser.waitUntil(async () => {
      const url = await browser.getUrl();
      return !url.includes('login'); /
    }, { timeout: 5000 });

    await browser.pause(5000);

    const inventoryLink = await browser.$('=Inventory');

    await inventoryLink.waitForExist({ timeout: 5000 });

    await inventoryLink.waitForClickable({ timeout: 5000 });

    await inventoryLink.click();

    await browser.waitUntil(async () => {
      const url = await browser.getUrl();
      return url.includes('inventory'); 
    }, { timeout: 5000 });

    const title = await browser.getTitle();
    console.assert(title.includes('SMCMVCD inventory'), 'Current page should be the inventory page');

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