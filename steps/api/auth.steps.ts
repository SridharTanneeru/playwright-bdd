import { Given } from '@fixtures/fixture';  // Use the same import as other step files
import { APIHelper } from '../../utils/apiHelper';

Given('I have valid API credentials', async function() {
    const apiHelper = APIHelper.getInstance();
    const token = process.env.API_TOKEN || '';
    await apiHelper.init(token);
});