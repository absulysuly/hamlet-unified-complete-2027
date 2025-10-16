import express from 'express';
import FacebookService from '../services/facebookService';

const router = express.Router();

let facebookService: FacebookService;

try {
  facebookService = new FacebookService();
} catch (error) {
  console.error('Failed to initialize Facebook service:', error);
}

router.get('/facebook/debug', async (req, res) => {
  try {
    if (!facebookService) {
      return res.status(500).json({
        error: 'Facebook service not initialized. Check environment variables.',
      });
    }

    const debugInfo = await facebookService.debugToken();
    res.json(debugInfo);
  } catch (error) {
    console.error('Error debugging Facebook token:', error);
    res.status(500).json({ error: 'Failed to debug Facebook token' });
  }
});

router.get('/facebook/pages/:pageId', async (req, res) => {
  try {
    if (!facebookService) {
      return res.status(500).json({ error: 'Facebook service not initialized' });
    }

    const { pageId } = req.params;
    const pageInfo = await facebookService.getPageInfo(pageId);
    res.json(pageInfo);
  } catch (error) {
    console.error('Error fetching page info:', error);
    res.status(500).json({ error: 'Failed to fetch page information' });
  }
});

router.get('/facebook/pages/:pageId/posts', async (req, res) => {
  try {
    if (!facebookService) {
      return res.status(500).json({ error: 'Facebook service not initialized' });
    }

    const { pageId } = req.params;
    const { limit = '25', format = 'standard' } = req.query;

    const pageData = await facebookService.getPagePosts(pageId, parseInt(limit as string));

    if (format === 'standard') {
      const standardizedPosts = facebookService.transformPostsToStandardFormat(pageData);
      res.json({
        page: {
          id: pageData.id,
          name: pageData.name,
          username: pageData.username,
          about: pageData.about,
          fan_count: pageData.fan_count,
        },
        posts: standardizedPosts,
      });
    } else {
      res.json(pageData);
    }
  } catch (error) {
    console.error('Error fetching page posts:', error);
    res.status(500).json({ error: 'Failed to fetch page posts' });
  }
});

router.post('/facebook/pages/posts', async (req, res) => {
  try {
    if (!facebookService) {
      return res.status(500).json({ error: 'Facebook service not initialized' });
    }

    const { pageIds, limit = 25 } = req.body;

    if (!pageIds || !Array.isArray(pageIds)) {
      return res.status(400).json({ error: 'pageIds array is required' });
    }

    const pagesData = await facebookService.getMultiplePagesPosts(pageIds, limit);

    const result: any = {};
    for (const [pageId, pageData] of Object.entries(pagesData)) {
      result[pageId] = {
        page: {
          id: pageData.id,
          name: pageData.name,
          username: pageData.username,
          about: pageData.about,
          fan_count: pageData.fan_count,
        },
        posts: facebookService.transformPostsToStandardFormat(pageData),
      };
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching multiple pages posts:', error);
    res.status(500).json({ error: 'Failed to fetch multiple pages posts' });
  }
});

router.get('/facebook/status', async (req, res) => {
  try {
    if (!facebookService) {
      return res.status(500).json({
        status: 'error',
        message:
          'Facebook service not initialized. Check FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, and FACEBOOK_ACCESS_TOKEN in .env file.',
      });
    }

    const debugInfo = await facebookService.debugToken();

    res.json({
      status: 'success',
      message: 'Facebook integration is working',
      tokenInfo: {
        isValid: debugInfo.data.is_valid,
        expiresAt: new Date(debugInfo.data.expires_at * 1000).toISOString(),
        appId: debugInfo.data.app_id,
        userId: debugInfo.data.user_id,
      },
    });
  } catch (error) {
    console.error('Facebook status check failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Facebook integration test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
