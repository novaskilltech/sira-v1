import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir: './tests/e2e', timeout: 60000, expect: { timeout: 12000 }, workers: 1,
 reporter: [['list'], ['json',{outputFile:'reports/e2e-results.json'}]],
 use: { baseURL: 'http://127.0.0.1:4173', viewport:{width:834,height:1194}, trace:'retain-on-failure', screenshot:'only-on-failure' },
 webServer: { command:'npm run preview -- --port 4173 --host 127.0.0.1', url:'http://127.0.0.1:4173', reuseExistingServer:true, timeout:60000 },
});
