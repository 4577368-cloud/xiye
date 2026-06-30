import { chromium } from 'playwright';

interface ScrapedTool {
  name: string;
  url: string;
  monthlyVisits: string;
  growthRate: string;
  description: string;
  tags: string[];
}

export async function scrapeToolifyTrending() {
  console.log('🚀 Starting Toolify scraper...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    console.log('🌐 Navigating to Toolify trending page...');
    await page.goto('https://www.toolify.ai/Best-trending-AI-Tools', { waitUntil: 'networkidle' });

    // Wait for the table to be visible
    await page.waitForSelector('table', { timeout: 30000 });

    console.log('🔍 Parsing table data...');
    const tools: ScrapedTool[] = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr'));
      return rows.map(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 6) return null;

        const nameAnchor = cells[1].querySelector('a');
        const name = nameAnchor?.textContent?.trim() || '';
        const url = nameAnchor?.getAttribute('href') ? `https://www.toolify.ai${nameAnchor.getAttribute('href')}` : '';
        
        const monthlyVisits = cells[2].textContent?.trim() || '';
        const growthRate = cells[3].textContent?.trim() || '';
        const description = cells[5].textContent?.trim() || '';
        
        // Extract tags from the description or specific cell if available
        // Toolify often puts tags in the description or a separate column
        const tags = description.split(',').map(t => t.trim()).filter(t => t.length > 0);

        return {
          name,
          url,
          monthlyVisits,
          growthRate,
          description,
          tags
        };
      }).filter((tool): tool is ScrapedTool => tool !== null);
    });

    console.log(`✅ Successfully scraped ${tools.length} tools.`);
    return tools;
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// For local testing
if (require.main === module) {
  scrapeToolifyTrending().then(data => {
    console.log('--- Scraped Data Preview ---');
    console.log(JSON.stringify(data.slice(0, 3), null, 2));
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
