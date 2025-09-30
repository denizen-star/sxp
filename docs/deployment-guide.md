# SXP Deployment Guide

## 🚀 Production Deployment to sxp.kervinapps.com

This guide covers deploying the SXP (Social Experiment Application) to production.

## 📋 Prerequisites

### **Required Access**
- GitHub repository access
- Domain control for `sxp.kervinapps.com`
- Deployment platform account (Netlify/Vercel)
- Environment variables and API keys

### **Required Services**
- **SendGrid** - For email functionality
- **Database** - PostgreSQL or similar
- **CDN** - For static asset delivery
- **SSL Certificate** - For HTTPS

## 🌐 Deployment Options

### **Option 1: Netlify (Recommended)**

#### **Step 1: Connect Repository**
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Select the `sxp` repository

#### **Step 2: Build Configuration**
- **Build command:** `npm run build`
- **Publish directory:** `build`
- **Node version:** 18

#### **Step 3: Environment Variables**
Add these environment variables in Netlify dashboard:

```env
REACT_APP_NAME=SXP
REACT_APP_DOMAIN=sxp.kervinapps.com
REACT_APP_API_URL=https://api.sxp.kervinapps.com
REACT_APP_SENDGRID_API_KEY=your_sendgrid_key
REACT_APP_SENDGRID_FROM_EMAIL=noreply@sxp.kervinapps.com
NODE_ENV=production
```

#### **Step 4: Custom Domain**
1. Go to Site settings > Domain management
2. Add custom domain: `sxp.kervinapps.com`
3. Configure DNS settings:
   - **A Record:** `@` → Netlify IP
   - **CNAME:** `www` → `sxp.netlify.app`

#### **Step 5: SSL Certificate**
- Netlify automatically provides SSL certificates
- Enable "Force HTTPS" in Site settings

---

### **Option 2: Vercel**

#### **Step 1: Connect Repository**
1. Go to [Vercel](https://vercel.com)
2. Click "Import Project"
3. Connect your GitHub repository
4. Select the `sxp` repository

#### **Step 2: Framework Configuration**
- **Framework Preset:** Create React App
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

#### **Step 3: Environment Variables**
Add environment variables in Vercel dashboard:

```env
REACT_APP_NAME=SXP
REACT_APP_DOMAIN=sxp.kervinapps.com
REACT_APP_API_URL=https://api.sxp.kervinapps.com
REACT_APP_SENDGRID_API_KEY=your_sendgrid_key
REACT_APP_SENDGRID_FROM_EMAIL=noreply@sxp.kervinapps.com
```

#### **Step 4: Custom Domain**
1. Go to Project settings > Domains
2. Add domain: `sxp.kervinapps.com`
3. Configure DNS:
   - **A Record:** `@` → Vercel IP
   - **CNAME:** `www` → `cname.vercel-dns.com`

---

### **Option 3: Manual Deployment**

#### **Step 1: Build the Application**
```bash
# Create production build
npm run build

# Test build locally
npx serve -s build
```

#### **Step 2: Server Setup**
```bash
# Install Node.js on server
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2
```

#### **Step 3: Deploy Files**
```bash
# Upload build folder to server
scp -r build/* user@server:/var/www/sxp/

# Configure web server (Nginx)
sudo nano /etc/nginx/sites-available/sxp.kervinapps.com
```

#### **Step 4: Nginx Configuration**
```nginx
server {
    listen 80;
    server_name sxp.kervinapps.com www.sxp.kervinapps.com;
    
    root /var/www/sxp;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🔧 Environment Configuration

### **Production Environment Variables**

Create `.env.production`:
```env
# Application
REACT_APP_NAME=SXP
REACT_APP_VERSION=1.0.0
REACT_APP_DOMAIN=sxp.kervinapps.com

# API Configuration
REACT_APP_API_URL=https://api.sxp.kervinapps.com
REACT_APP_API_VERSION=v1

# Authentication
REACT_APP_AUTH_DOMAIN=sxp.kervinapps.com
REACT_APP_AUTH_CLIENT_ID=your_production_auth_client_id

# SendGrid
REACT_APP_SENDGRID_API_KEY=your_production_sendgrid_key
REACT_APP_SENDGRID_FROM_EMAIL=noreply@sxp.kervinapps.com

# Analytics
REACT_APP_GA_TRACKING_ID=your_ga_tracking_id

# Production
REACT_APP_DEBUG=false
REACT_APP_LOG_LEVEL=error
NODE_ENV=production
```

### **Security Configuration**

#### **HTTPS Configuration**
- Ensure SSL certificate is properly configured
- Use HTTPS redirects
- Set secure headers

#### **Environment Variables Security**
- Never commit `.env.production` to version control
- Use platform-specific environment variable management
- Rotate API keys regularly

## 📊 Monitoring and Analytics

### **Performance Monitoring**
- Configure web vitals tracking
- Set up error monitoring (Sentry, etc.)
- Monitor build and deployment status

### **Analytics Setup**
```javascript
// Add to src/index.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## 🚨 Troubleshooting

### **Common Deployment Issues**

#### **Build Failures**
```bash
# Check Node.js version
node --version

# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **Environment Variables Not Working**
- Verify variable names start with `REACT_APP_`
- Check for typos in variable names
- Ensure variables are set in deployment platform

#### **Routing Issues**
- Ensure SPA routing is configured
- Check redirect rules in netlify.toml
- Verify web server configuration

#### **SSL Certificate Issues**
- Check domain DNS settings
- Verify certificate is properly installed
- Test HTTPS redirect

### **Debug Commands**
```bash
# Check build locally
npm run build
npx serve -s build

# Analyze bundle size
npm run analyze

# Check environment variables
npm run start
```

## 🔄 CI/CD Pipeline

### **GitHub Actions (Optional)**
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './build'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
```

## 📈 Performance Optimization

### **Build Optimization**
```bash
# Analyze bundle size
npm run analyze

# Optimize images
npm install --save-dev imagemin imagemin-webp

# Enable gzip compression
# Configure in web server or CDN
```

### **Caching Strategy**
- Static assets: 1 year
- HTML files: No cache
- API responses: Appropriate cache headers

## 🔐 Security Checklist

### **Pre-Deployment Security**
- [ ] Environment variables secured
- [ ] API keys rotated
- [ ] Dependencies updated
- [ ] Security audit passed
- [ ] HTTPS configured
- [ ] CORS settings configured
- [ ] Rate limiting enabled

### **Post-Deployment Security**
- [ ] SSL certificate valid
- [ ] Security headers set
- [ ] Error monitoring active
- [ ] Log monitoring active
- [ ] Backup strategy in place

## 📞 Support

### **Deployment Issues**
1. Check build logs in deployment platform
2. Verify environment variables
3. Test locally with production build
4. Contact development team

### **Monitoring**
- **Uptime:** Monitor application availability
- **Performance:** Track page load times
- **Errors:** Monitor for JavaScript errors
- **Analytics:** Track user engagement

---

**Deployment URL:** https://sxp.kervinapps.com
**Status:** Ready for deployment
**Last Updated:** December 19, 2024
