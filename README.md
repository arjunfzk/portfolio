# Portfolio Website

Personal portfolio website with terminal-style introduction and interactive project showcase.

## Features

### Personalized URL Greetings

The terminal greeting can be personalized based on the URL path. This is useful for sharing your portfolio with specific contacts or companies.

#### URL Formats

**Format 1: With Name**
```
yoursite.com/firstname_companyname
```

**Format 2: Company Only**
```
yoursite.com/_companyname
```

#### Examples

**With Name:**
- `yoursite.com/john_google` → "Hi **John** at **Google**, I am Arjun."
- `yoursite.com/sarah_microsoft` → "Hi **Sarah** at **Microsoft**, I am Arjun."
- `yoursite.com/alex-smith_acme-corp` → "Hi **Alex Smith** at **Acme Corp**, I am Arjun."

**Company Only:**
- `yoursite.com/_google` → "Hi **Brilliant Minds** at **Google**, I am Arjun."
- `yoursite.com/_acme-corp` → "Hi **Brilliant Minds** at **Acme Corp**, I am Arjun."

*Note: Names are automatically capitalized and highlighted. Hyphens in the URL are converted to spaces.*

#### Behavior

1. **Initial Visit with Personalized URL**: Shows personalized greeting
2. **Page Refresh**: Maintains personalized greeting (URL persists)
3. **Clicking Home/Logo**: Resets to default greeting and navigates to root URL
4. **Browser Back/Forward**: Updates greeting based on current URL
5. **Direct Visit to Root**: Shows default greeting

#### Implementation Details

- **Two URL patterns supported:**
  - `/[name]_[company]` - Personalized with name
  - `/_[company]` - Company only (uses "Brilliant Minds")
- **Auto-capitalization:** First letters are automatically capitalized
- **Visual highlighting:** Names and companies are styled with bright cyan color and glow effect
- **Hyphen support:** Hyphens are automatically converted to spaces (e.g., `alex-smith` → `Alex Smith`)
- **Navigation:** Clicking home/logo resets to default greeting
- **History:** Browser back/forward properly managed

#### Use Cases

- **Networking**: Share personalized links when applying to companies
- **Email Outreach**: Include personalized URLs in cold emails to recruiters
- **Job Applications**: Make your portfolio memorable with a personalized touch
- **Follow-ups**: Send customized links after meetings or interviews

## Local Development

To test the personalized URL feature locally, you need to run a local server that supports SPA routing:

### Option 1: Using the Included Python Server (Recommended)

```bash
python3 server.py
```

Then visit:
- `http://localhost:8080/` - Default greeting
- `http://localhost:8080/john_google` - Personalized with name
- `http://localhost:8080/_google` - Company only greeting

### Option 2: Using Node.js http-server

```bash
npx http-server -p 8080 -c-1
```

### Option 3: Using Python's Simple HTTP Server

```bash
python3 -m http.server 8080
```

**Note:** Opening `index.html` directly in a browser (file://) will not work with personalized URLs because browser security restrictions prevent reading the full path.

## Deployment (GitHub Pages)

This portfolio is configured to work with GitHub Pages and custom domains. The routing is handled by:

1. **404.html**: Catches any non-existent paths and redirects to index.html
2. **sessionStorage**: Preserves the original URL during the redirect
3. **script.js**: Restores the URL and displays the personalized greeting

### GitHub Pages Setup

1. Push all files including `404.html` to your repository
2. Enable GitHub Pages in repository settings
3. Point your custom domain (Namecheap) to GitHub Pages:
   - Add a CNAME record pointing to `<your-username>.github.io`
   - Ensure the `CNAME` file in the repository contains your domain name

The personalized URLs will work automatically once deployed!
