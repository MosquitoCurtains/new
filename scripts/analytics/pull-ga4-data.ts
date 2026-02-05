/**
 * GA4 Data Extraction Script
 * 
 * Pulls analytics data to inform page migration decisions:
 * - Top pages by pageviews
 * - Top landing pages (organic search)
 * - Pages in conversion paths
 * - Engagement metrics
 * 
 * Usage: npx ts-node scripts/analytics/pull-ga4-data.ts
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PROPERTY_ID = '280174022';
const CREDENTIALS_PATH = '/Users/jvmacmini/Downloads/mc-analytics-486504-f3b080fb39be.json';
const OUTPUT_DIR = path.join(__dirname, 'output');

// Initialize the client
const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: CREDENTIALS_PATH,
});

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Format date for GA4 API (YYYY-MM-DD)
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get date range for last 24 months
 */
function getLast24MonthsRange() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 2); // 24 months back
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}

/**
 * Save data to CSV file
 */
function saveToCSV(filename: string, headers: string[], rows: string[][]) {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, csvContent);
  console.log(`✅ Saved: ${filepath}`);
}

/**
 * 1. Top Pages by Pageviews (last 12 months)
 */
async function getTopPagesByPageviews() {
  console.log('\n📊 Fetching top pages by pageviews...');
  
  const { startDate, endDate } = getLast24MonthsRange();
  
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [
      { name: 'pagePath' },
      { name: 'pageTitle' },
    ],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' },
      { name: 'engagementRate' },
    ],
    orderBys: [
      { metric: { metricName: 'screenPageViews' }, desc: true },
    ],
    limit: 200,
  });

  const headers = ['Page Path', 'Page Title', 'Pageviews', 'Avg Session Duration (s)', 'Bounce Rate', 'Engagement Rate'];
  const rows: string[][] = [];

  response.rows?.forEach(row => {
    rows.push([
      row.dimensionValues?.[0]?.value || '',
      row.dimensionValues?.[1]?.value || '',
      row.metricValues?.[0]?.value || '0',
      row.metricValues?.[1]?.value || '0',
      row.metricValues?.[2]?.value || '0',
      row.metricValues?.[3]?.value || '0',
    ]);
  });

  saveToCSV('01-top-pages-by-pageviews.csv', headers, rows);
  console.log(`   Found ${rows.length} pages`);
  
  return rows;
}

/**
 * 2. Top Landing Pages (Organic Search Only)
 */
async function getTopLandingPagesOrganic() {
  console.log('\n🔍 Fetching top organic landing pages...');
  
  const { startDate, endDate } = getLast24MonthsRange();
  
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [
      { name: 'landingPage' },
      { name: 'sessionDefaultChannelGroup' },
    ],
    metrics: [
      { name: 'sessions' },
      { name: 'engagedSessions' },
      { name: 'conversions' },
      { name: 'engagementRate' },
    ],
    dimensionFilter: {
      filter: {
        fieldName: 'sessionDefaultChannelGroup',
        stringFilter: {
          matchType: 'EXACT',
          value: 'Organic Search',
        },
      },
    },
    orderBys: [
      { metric: { metricName: 'sessions' }, desc: true },
    ],
    limit: 200,
  });

  const headers = ['Landing Page', 'Channel', 'Sessions', 'Engaged Sessions', 'Conversions', 'Engagement Rate'];
  const rows: string[][] = [];

  response.rows?.forEach(row => {
    rows.push([
      row.dimensionValues?.[0]?.value || '',
      row.dimensionValues?.[1]?.value || '',
      row.metricValues?.[0]?.value || '0',
      row.metricValues?.[1]?.value || '0',
      row.metricValues?.[2]?.value || '0',
      row.metricValues?.[3]?.value || '0',
    ]);
  });

  saveToCSV('02-top-organic-landing-pages.csv', headers, rows);
  console.log(`   Found ${rows.length} organic landing pages`);
  
  return rows;
}

/**
 * 3. All Landing Pages (All Channels)
 */
async function getAllLandingPages() {
  console.log('\n🌐 Fetching all landing pages by channel...');
  
  const { startDate, endDate } = getLast24MonthsRange();
  
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [
      { name: 'landingPage' },
      { name: 'sessionDefaultChannelGroup' },
    ],
    metrics: [
      { name: 'sessions' },
      { name: 'engagedSessions' },
      { name: 'conversions' },
    ],
    orderBys: [
      { metric: { metricName: 'sessions' }, desc: true },
    ],
    limit: 500,
  });

  const headers = ['Landing Page', 'Channel', 'Sessions', 'Engaged Sessions', 'Conversions'];
  const rows: string[][] = [];

  response.rows?.forEach(row => {
    rows.push([
      row.dimensionValues?.[0]?.value || '',
      row.dimensionValues?.[1]?.value || '',
      row.metricValues?.[0]?.value || '0',
      row.metricValues?.[1]?.value || '0',
      row.metricValues?.[2]?.value || '0',
    ]);
  });

  saveToCSV('03-all-landing-pages-by-channel.csv', headers, rows);
  console.log(`   Found ${rows.length} landing page/channel combinations`);
  
  return rows;
}

/**
 * 4. Page Path Analysis (for planning pages specifically)
 */
async function getPlanningPageAnalysis() {
  console.log('\n📋 Fetching /plan-screen-porch/ pages analysis...');
  
  const { startDate, endDate } = getLast24MonthsRange();
  
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [
      { name: 'pagePath' },
      { name: 'pageTitle' },
    ],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'engagementRate' },
      { name: 'conversions' },
    ],
    dimensionFilter: {
      filter: {
        fieldName: 'pagePath',
        stringFilter: {
          matchType: 'BEGINS_WITH',
          value: '/plan-screen-porch',
        },
      },
    },
    orderBys: [
      { metric: { metricName: 'screenPageViews' }, desc: true },
    ],
    limit: 100,
  });

  const headers = ['Page Path', 'Page Title', 'Pageviews', 'Avg Session Duration (s)', 'Engagement Rate', 'Conversions'];
  const rows: string[][] = [];

  response.rows?.forEach(row => {
    rows.push([
      row.dimensionValues?.[0]?.value || '',
      row.dimensionValues?.[1]?.value || '',
      row.metricValues?.[0]?.value || '0',
      row.metricValues?.[1]?.value || '0',
      row.metricValues?.[2]?.value || '0',
      row.metricValues?.[3]?.value || '0',
    ]);
  });

  saveToCSV('04-plan-screen-porch-pages.csv', headers, rows);
  console.log(`   Found ${rows.length} planning pages`);
  
  return rows;
}

/**
 * 5. Conversion Path Analysis
 */
async function getConversionPaths() {
  console.log('\n💰 Fetching pages with conversions...');
  
  const { startDate, endDate } = getLast24MonthsRange();
  
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [
      { name: 'pagePath' },
    ],
    metrics: [
      { name: 'conversions' },
      { name: 'screenPageViews' },
      { name: 'engagedSessions' },
    ],
    orderBys: [
      { metric: { metricName: 'conversions' }, desc: true },
    ],
    limit: 100,
  });

  const headers = ['Page Path', 'Conversions', 'Pageviews', 'Engaged Sessions'];
  const rows: string[][] = [];

  response.rows?.forEach(row => {
    const conversions = parseInt(row.metricValues?.[0]?.value || '0');
    if (conversions > 0) {
      rows.push([
        row.dimensionValues?.[0]?.value || '',
        row.metricValues?.[0]?.value || '0',
        row.metricValues?.[1]?.value || '0',
        row.metricValues?.[2]?.value || '0',
      ]);
    }
  });

  saveToCSV('05-pages-with-conversions.csv', headers, rows);
  console.log(`   Found ${rows.length} pages with conversions`);
  
  return rows;
}

/**
 * 6. Blog/Content Pages Analysis
 */
async function getBlogPagesAnalysis() {
  console.log('\n📝 Fetching blog/content pages analysis...');
  
  const { startDate, endDate } = getLast24MonthsRange();
  
  // Get pages that look like blog posts (long slugs, specific patterns)
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [
      { name: 'pagePath' },
      { name: 'pageTitle' },
    ],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'engagementRate' },
    ],
    orderBys: [
      { metric: { metricName: 'screenPageViews' }, desc: true },
    ],
    limit: 500,
  });

  // Filter for likely blog/article pages
  const blogPatterns = [
    '/history-of',
    '/lasting-effects',
    '/summary-of',
    '/how-to-cope',
    '/gazebos-then',
    '/teaching-children',
    '/dear-martha',
    '/where-is-the-mosquito',
    '/air-lines-explore',
    '/why-do-mosquitoes',
    '/finally-a-new',
    '/is-your-porch',
    '/a-very-cool-project',
    '/a-new-mulligan',
    '/mosquito-enclosures-for-decks',
    '/bond-sales',
    '/blog',
  ];

  const headers = ['Page Path', 'Page Title', 'Pageviews', 'Avg Session Duration (s)', 'Engagement Rate'];
  const rows: string[][] = [];

  response.rows?.forEach(row => {
    const pagePath = row.dimensionValues?.[0]?.value || '';
    const isBlogPage = blogPatterns.some(pattern => pagePath.includes(pattern));
    
    if (isBlogPage) {
      rows.push([
        pagePath,
        row.dimensionValues?.[1]?.value || '',
        row.metricValues?.[0]?.value || '0',
        row.metricValues?.[1]?.value || '0',
        row.metricValues?.[2]?.value || '0',
      ]);
    }
  });

  saveToCSV('06-blog-content-pages.csv', headers, rows);
  console.log(`   Found ${rows.length} blog/content pages`);
  
  return rows;
}

/**
 * 7. Product/Category Pages Performance
 */
async function getProductPagesAnalysis() {
  console.log('\n🛍️ Fetching product/category pages analysis...');
  
  const { startDate, endDate } = getLast24MonthsRange();
  
  // Product and category page patterns
  const productPatterns = [
    '/screened-porch',
    '/screen-patio',
    '/garage-door-screens',
    '/pergola-screen-curtains',
    '/gazebo-screen-curtains',
    '/screened-in-decks',
    '/awning-screen-enclosures',
    '/industrial-netting',
    '/clear-vinyl-plastic-patio-enclosures',
    '/boat-screens',
    '/french-door-screens',
    '/tent',
    '/yardistry',
    '/outdoor-projection',
    '/theater-scrims',
    '/hvac',
    '/pollen',
    '/roll-up-shade',
    '/mosquito-netting',
    '/raw-netting',
  ];

  const [response] = await analyticsDataClient.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [
      { name: 'pagePath' },
      { name: 'pageTitle' },
    ],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'sessions' },
      { name: 'engagementRate' },
      { name: 'conversions' },
    ],
    orderBys: [
      { metric: { metricName: 'screenPageViews' }, desc: true },
    ],
    limit: 500,
  });

  const headers = ['Page Path', 'Page Title', 'Pageviews', 'Sessions', 'Engagement Rate', 'Conversions'];
  const rows: string[][] = [];

  response.rows?.forEach(row => {
    const pagePath = row.dimensionValues?.[0]?.value || '';
    const isProductPage = productPatterns.some(pattern => pagePath.includes(pattern));
    
    if (isProductPage) {
      rows.push([
        pagePath,
        row.dimensionValues?.[1]?.value || '',
        row.metricValues?.[0]?.value || '0',
        row.metricValues?.[1]?.value || '0',
        row.metricValues?.[2]?.value || '0',
        row.metricValues?.[3]?.value || '0',
      ]);
    }
  });

  saveToCSV('07-product-category-pages.csv', headers, rows);
  console.log(`   Found ${rows.length} product/category pages`);
  
  return rows;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 GA4 Data Extraction for Mosquito Curtains Migration');
  console.log('=========================================================');
  console.log(`Property ID: ${PROPERTY_ID}`);
  console.log(`Date Range: Last 24 months`);
  console.log(`Output Directory: ${OUTPUT_DIR}`);
  
  try {
    // Run all reports
    await getTopPagesByPageviews();
    await getTopLandingPagesOrganic();
    await getAllLandingPages();
    await getPlanningPageAnalysis();
    await getConversionPaths();
    await getBlogPagesAnalysis();
    await getProductPagesAnalysis();
    
    console.log('\n=========================================================');
    console.log('✅ All reports generated successfully!');
    console.log(`📁 Check output files in: ${OUTPUT_DIR}`);
    console.log('\nFiles created:');
    console.log('  01-top-pages-by-pageviews.csv');
    console.log('  02-top-organic-landing-pages.csv');
    console.log('  03-all-landing-pages-by-channel.csv');
    console.log('  04-plan-screen-porch-pages.csv');
    console.log('  05-pages-with-conversions.csv');
    console.log('  06-blog-content-pages.csv');
    console.log('  07-product-category-pages.csv');
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();
