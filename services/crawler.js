import puppeteer from 'puppeteer';

// Function to crawl a given URL
export const crawlWebsite = async (url) => {
  console.log(`🔍 Starting to crawl website: ${url}`);

  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']  // Add these arguments
  });
  const page = await browser.newPage();

  try {
    // Navigate to URL
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Extract page content
    const content = await page.content();
    const extractedText = await page.evaluate(() => {
      return document.body.innerText;
    });

    await browser.close();
    console.log('✅ Crawling complete successfully!');
    
    return { 
      success: true, 
      url,
      content,
      extractedText
    };
  } catch (err) {
    console.error(`❌ Error crawling website: ${err.message}`);
    await browser.close();
    throw new Error(`Failed to crawl ${url}: ${err.message}`);
  }
};