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
        page.setDefaultNavigationTimeout(2 * 60 * 1000); 

        await page.goto('https://www.amazon.com');

        const body = await page.$('body');

        const html = await page.evaluate(() =>
            document.documentElement.outerHTML
        );

        console.log(html);

        return;

    } catch(e){
        console.error('scrape failed', e);
    } finally{
        await browser?.close();
    }
}

run();
