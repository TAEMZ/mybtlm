## Quick Fix for Ad Set & Ads Sync Workflows

**Problem:** The IF condition uses `isNotEmpty` which treats `0` as NOT empty, so empty arrays `{data: []}` route to TRUE instead of FALSE.

**Solution:** Change the IF node condition in n8n UI:

### **In "Ad Set Sync" workflow:**

1. Click on **"Has Ad Sets?"** (IF node)
2. Change condition to:
   - **Type:** Number
   - **Value 1:** `{{ $json.data.length }}`
   - **Operation:** larger
   - **Value 2:** `0`

### **In "Ads Sync" workflow:**

1. Click on **"Has Ads?"** (IF node)
2. Change condition to:
   - **Type:** Number
   - **Value 1:** `{{ $json.data.length }}`
   - **Operation:** larger
   - **Value 2:** `0`

**This will properly route empty arrays to the FALSE branch (Respond immediately with 0 items synced).**

---

## Why This Works:

- `0 > 0` = **FALSE** → Empty array routes to Respond ✅
- `5 > 0` = **TRUE** → Has data, processes normally ✅
