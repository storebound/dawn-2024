# Image Upload Page - Setup Checklist

## Information Needed from Premier NX

Contact: cxsolutions@premiernx.com

### 1. API Endpoint URL (Required)
- **Question:** What is the full URL for the `/upload-file` endpoint?
- **Example:** `https://api.premiernx.com/upload-file`
- **Current placeholder in code:** `https://api.premiernx.com/upload-file`
- **Location to update:** `sections/image-upload.liquid` line 8

### 2. CORS Configuration (Required)
- **Question:** Has `https://bydash.com` been whitelisted for API requests?
- **Why:** Browser security blocks cross-origin requests unless the API server explicitly allows them
- **Action needed:** Premier NX must add `bydash.com` to their CORS allowed origins

### 3. API Response Format Confirmation
- **Question:** Does the API response match this expected format?
```json
{
  "uploadUrl": "https://s3.<region>.amazonaws.com/<bucket>/<key>?X-Amz-..."
}
```
- **If different:** Let us know the actual response structure so we can update the code

### 4. Error Response Format
- **Question:** What error responses should we expect?
- **Examples we should handle:**
  - Invalid/expired token
  - Token already used
  - Rate limiting
  - Server errors
- **Current assumption:** Errors return JSON with a `message` field

### 5. HEIC/HEIF Support (Required for iPhone users)
- **Question:** Can your S3 bucket and processing pipeline handle HEIC/HEIF files?
- **Why:** iPhones default to HEIC format since iOS 11 (2017). Without HEIC support, iPhone users uploading photos directly from their camera roll will have issues.
- **Current implementation:** We now accept `image/heic` and `image/heif` in addition to JPEG, PNG, and GIF
- **Action needed:** Premier NX must confirm their backend can process HEIC files, or convert them to JPEG if needed

---

## Open Questions (Internal)

### Styling
- ✅ Upload page now uses theme color scheme, typography, and button styles
- Color scheme can be customized in theme editor (Settings → Color scheme)

### Error Messaging
- What should users do if their token expires?
- Current message: "Invalid upload link. Please request a new link from customer service."
- Is there a specific contact method or link we should provide?

### Success Behavior
- After successful upload, should the page:
  - Just show "Upload Complete" (current behavior)?
  - Redirect somewhere?
  - Show a "Return to chat" link?

### Analytics/Tracking
- Do we need to track upload attempts/successes?
- Any specific events to log?

---

## Deployment Checklist

- [ ] Get API endpoint URL from Premier NX
- [ ] Confirm CORS is configured for bydash.com
- [ ] Confirm HEIC/HEIF file support with Premier NX (required for iPhone users)
- [x] Add `sections/image-upload.liquid` to theme
- [x] Add `templates/page.image-upload.json` to theme
- [ ] Create page in Shopify Admin (Online Store → Pages)
- [ ] Set page visibility to "Hidden"
- [ ] Assign `page.image-upload` template to the page
- [ ] Test with a valid token from the chatbot
- [ ] Test error cases (no token, invalid token, oversized file)
- [ ] Test with iPhone HEIC photo upload

---

## File Reference

| File | Purpose |
|------|---------|
| `sections/image-upload.liquid` | Upload UI, styling, and JavaScript logic |
| `templates/page.image-upload.json` | Page template configuration |
| `initial-request-PremierNX_Image_Upload_Spec.md` | Original technical specification |

---

## Supported File Types

| Format | MIME Type | Notes |
|--------|-----------|-------|
| JPEG | `image/jpeg` | Standard photo format |
| PNG | `image/png` | Screenshots, graphics |
| GIF | `image/gif` | Animated images |
| HEIC | `image/heic` | iPhone default (iOS 11+) |
| HEIF | `image/heif` | High Efficiency Image Format |

**Max file size:** 10MB
**Min dimensions:** 256×256 px
**Max dimensions:** 10,000×10,000 px
