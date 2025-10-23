# Personalized URL Greeting Guide

## Overview
Your portfolio now supports personalized greetings based on URL paths, perfect for networking, job applications, and cold outreach.

## Quick Examples

### With Name
```
yourdomain.com/john_google
```
**Shows:** "Hi **John** at **Google**, I am Arjun."

### Company Only
```
yourdomain.com/_google
```
**Shows:** "Hi **Brilliant Minds** at **Google**, I am Arjun."

---

## Features

### ✨ Auto-Capitalization
All names are automatically capitalized properly:
- `john` → `John`
- `john-smith` → `John Smith`
- `google` → `Google`
- `acme-corp` → `Acme Corp`

### 🎨 Visual Highlighting
Names and companies appear in **bright cyan** with a subtle glow effect, making them stand out in the terminal.

### 🔄 Smart Navigation
- **Refresh page**: Greeting persists
- **Click logo/home**: Returns to default greeting
- **Browser back/forward**: Updates greeting appropriately

---

## URL Patterns

### Pattern 1: Named Contact
Format: `/firstname_companyname`

Examples:
- `/sarah_microsoft`
- `/alex-smith_anthropic`
- `/priya_openai`

Result: "Hi [Name] at [Company], I am Arjun."

### Pattern 2: Anonymous/Company
Format: `/_companyname`

Examples:
- `/_microsoft`
- `/_anthropic`
- `/_openai`

Result: "Hi Brilliant Minds at [Company], I am Arjun."

---

## Use Cases

### 🎯 Job Applications
```
Cover Letter: "Check out my portfolio at yourdomain.com/hiring-manager_company"
```

### 📧 Cold Email to Recruiters
```
Email: "I'd love to chat about opportunities at Google.
Portfolio: yourdomain.com/_google"
```

### 🤝 Networking Events
```
Business Card QR Code → yourdomain.com/firstname_company
```

### 💼 LinkedIn Outreach
```
Message: "Hi Sarah! Here's my work: yourdomain.com/sarah_microsoft"
```

---

## Technical Details

### How It Works

1. **User visits:** `yourdomain.com/john_google`
2. **GitHub Pages 404:** Redirects to `404.html`
3. **404.html:** Saves path to sessionStorage, redirects to root
4. **index.html loads:** Runs normally
5. **script.js:**
   - Reads path from sessionStorage
   - Restores URL using `history.replaceState()`
   - Parses name and company
   - Capitalizes first letters
   - Displays personalized greeting with highlighting

### Supported Characters
- Letters (a-z, A-Z)
- Numbers (0-9)
- Hyphens (-) - converted to spaces

### Edge Cases Handled
- Multiple hyphens: `john-paul-smith` → `John Paul Smith`
- Numbers in names: `alex2_google` → `Alex2 at Google`
- Case insensitive: `JOHN_GOOGLE` → `John at Google`

---

## Testing Locally

### Start Development Server
```bash
python3 server.py
```

### Test URLs
```bash
# Default
http://localhost:8080/

# With name
http://localhost:8080/john_google
http://localhost:8080/sarah-smith_anthropic

# Company only
http://localhost:8080/_openai
http://localhost:8080/_acme-corp
```

---

## Deployment Checklist

Before pushing to GitHub Pages:

- [x] `404.html` exists
- [x] `script.js` updated
- [x] `styles.css` has `.personalized-name` class
- [ ] Test all URL patterns locally
- [ ] Commit and push changes
- [ ] Test on live site

### Post-Deployment Test
1. Visit `yourdomain.com/john_google`
2. Verify greeting shows "Hi **John** at **Google**, I am Arjun."
3. Verify names are highlighted in bright cyan
4. Refresh - greeting should persist
5. Click logo - should return to default
6. Test company-only: `yourdomain.com/_google`

---

## Examples for Different Scenarios

### For FAANG Companies
```
yourdomain.com/jane_google
yourdomain.com/mark_meta
yourdomain.com/priya_amazon
yourdomain.com/alex_netflix
yourdomain.com/_apple
```

### For Startups
```
yourdomain.com/sarah_anthropic
yourdomain.com/john_openai
yourdomain.com/_perplexity
yourdomain.com/_mistral
```

### For Agencies/Consulting
```
yourdomain.com/_mckinsey
yourdomain.com/_bain
yourdomain.com/partner-name_bcg
```

---

## Tips for Maximum Impact

1. **Use it in cover letters**: Shows attention to detail
2. **Include in email signatures**: Professional and memorable
3. **Add to LinkedIn messages**: Personalized touch
4. **Print on business cards**: Use QR codes
5. **Share in Slack/Discord**: Direct, personalized links

---

## Troubleshooting

### Greeting not showing?
- Check URL format: Must be `/name_company` or `/_company`
- Ensure 404.html is deployed
- Clear browser cache

### Names not capitalized?
- Should work automatically
- Check browser console for errors

### Not working locally?
- Don't open file:// directly
- Use a local server (see README)

---

## Color Reference

**Default Text:** `#f0f0f0` (off-white)
**Personalized Names:** `#22d3ee` (bright cyan)
**Section Headers:** `#FF9933` (orange)
**Terminal Prompt:** `#06d6a0` (green)

---

## Support

For issues or questions:
1. Check browser console for errors
2. Verify URL pattern is correct
3. Test with simplified names (no special characters)
4. Ensure JavaScript is enabled

