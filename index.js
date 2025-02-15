import puppet from 'puppeteer-core';

async function run(){
    let browser;
    try{
        const auth = 'brd-customer-hl_4709c740-zone-scraping_browser1:d5qrp8g0osv3'
        const browserWSEndpoint = `wss://${auth}@brd.superproxy.io:9222`;

        browser = await puppet.connect({
            browserWSEndpoint: browserWSEndpoint
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(2 * 60 * 1000);  // 2 minutes timeout for navigation

        await page.goto('https://www.amazon.com/Best-Sellers/zgbs', { waitUntil: 'domcontentloaded' });

        // Ensure the page is fully loaded
        await page.waitForSelector('body', { timeout: 60000 });  // Wait for the body to ensure content is loaded

        const selector = '.a-carousel';
        
        // Wait for the carousel to appear
        await page.waitForSelector(selector, { timeout: 60000 });

        // Get the element and extract the inner HTML or text
        const el = await page.$(selector);
        const text = await el.evaluate(e => e.textContent); // Use textContent for cleaner data

        // Structure the data in JSON format
        const jsonData = {
            carouselContent: text.trim() // Trim the text content for cleaner output
        };

        console.log(JSON.stringify(jsonData, null, 2)); // Output the JSON data

        return;
    } catch (e) {
        console.error('scrape failed', e);
    } finally {
        await browser?.close();
    }
}

run();