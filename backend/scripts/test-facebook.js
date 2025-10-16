require('dotenv').config({ path: '../.env' });

const axios = require('axios');

async function testFacebookIntegration() {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;

  console.log('🔧 Testing Facebook Integration...\n');
  console.log('App ID:', appId);
  console.log('Access Token present:', !!accessToken);
  console.log('App Secret present:', !!appSecret);

  if (!accessToken || !appId || !appSecret) {
    console.error('❌ Missing required environment variables');
    return;
  }

  try {
    console.log('\n1. Testing token debug...');
    const debugResponse = await axios.get('https://graph.facebook.com/v19.0/debug_token', {
      params: {
        input_token: accessToken,
        access_token: `${appId}|${appSecret}`,
      },
    });

    const debugData = debugResponse.data.data;
    console.log('✅ Token is valid:', debugData.is_valid);
    console.log('📱 App ID:', debugData.app_id);
    console.log('👤 User ID:', debugData.user_id);
    console.log('⏰ Expires at:', new Date(debugData.expires_at * 1000).toLocaleString());
    console.log('Scopes:', debugData.scopes?.join(', '));

    console.log('\n2. Fetching managed pages...');
    const pagesResponse = await axios.get('https://graph.facebook.com/v19.0/me/accounts', {
      params: {
        access_token: accessToken,
        fields: 'id,name,username,access_token,category,fan_count',
      },
    });

    const pages = pagesResponse.data.data;
    console.log(`📄 Found ${pages.length} managed pages:`);

    pages.forEach((page, index) => {
      console.log(`\n   ${index + 1}. ${page.name}`);
      console.log(`      ID: ${page.id}`);
      console.log(`      Username: ${page.username || 'N/A'}`);
      console.log(`      Category: ${page.category}`);
      console.log(`      Fans: ${page.fan_count || 0}`);
    });

    if (pages.length > 0) {
      console.log('\n3. Testing posts for first page...');
      const firstPage = pages[0];
      const postsResponse = await axios.get(`https://graph.facebook.com/v19.0/${firstPage.id}/posts`, {
        params: {
          access_token: accessToken,
          fields: 'id,message,created_time,permalink_url,attachments{media_type,media}',
          limit: 3,
        },
      });

      const posts = postsResponse.data.data;
      console.log(`📝 Found ${posts.length} recent posts:`);

      posts.forEach((post, index) => {
        console.log(`\n   Post ${index + 1}:`);
        console.log(`      ID: ${post.id}`);
        console.log(`      Date: ${new Date(post.created_time).toLocaleString()}`);
        console.log(`      Message: ${post.message ? `${post.message.substring(0, 100)}...` : 'No message'}`);
        console.log(`      URL: ${post.permalink_url}`);
      });
    }

    console.log('\n🎉 Facebook integration test completed successfully!');
    console.log('\n📋 Recommended page IDs for your .env file:');
    pages.forEach(page => {
      const key = page.name.toUpperCase().replace(/[^A-Z0-9]+/g, '_');
      console.log(`   FACEBOOK_PAGE_${key}=${page.id}`);
    });
  } catch (error) {
    console.error('❌ Error testing Facebook integration:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data.error?.message);
    } else {
      console.error('   Message:', error.message);
    }
  }
}

testFacebookIntegration();
