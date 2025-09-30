# SXP Deployment Guide

## 🚀 Deployment to sxp.kervinapps.com

This guide covers deploying the SXP (Social Experiment Application) to `sxp.kervinapps.com`.

## 📋 Prerequisites

- Node.js 18+ installed
- Git configured
- Access to sxp.kervinapps.com domain
- Deployment platform access (Netlify, Vercel, etc.)

## 🛠️ Local Development Setup

### 1. Clone and Setup
```bash
# Clone the repository
git clone <your-sxp-repo-url>
cd sxp

# Install dependencies
npm install

# Copy environment variables
cp env.example .env.local

# Edit environment variables
nano .env.local
```

### 2. Environment Configuration
Update `.env.local` with your values:
```env
REACT_APP_NAME=SXP
REACT_APP_DOMAIN=sxp.kervinapps.com
REACT_APP_API_URL=https://api.sxp.kervinapps.com
REACT_APP_SENDGRID_API_KEY=your_sendgrid_key
REACT_APP_SENDGRID_FROM_EMAIL=noreply@sxp.kervinapps.com
```

### 3. Start Development Server
```bash
npm start
```
Visit: `http://localhost:3000`

## 🌐 Production Deployment

### Option 1: Netlify Deployment

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`

2. **Domain Configuration**
   - Add custom domain: `sxp.kervinapps.com`
   - Configure DNS settings
   - Enable HTTPS

3. **Environment Variables**
   - Add production environment variables in Netlify dashboard
   - Use the same variables from `.env.local`

### Option 2: Vercel Deployment

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Framework preset: Create React App

2. **Domain Configuration**
   - Add custom domain: `sxp.kervinapps.com`
   - Configure DNS settings

3. **Environment Variables**
   - Add environment variables in Vercel dashboard

### Option 3: Manual Deployment

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Deploy Build Folder**
   - Upload `build/` folder contents to your web server
   - Configure web server for SPA routing
   - Set up SSL certificate for HTTPS

## 🔧 Build Configuration

### Build Scripts
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "build:production": "NODE_ENV=production npm run build",
    "analyze": "npm run build && npx serve -s build"
  }
}
```

### Production Build
```bash
# Create production build
npm run build:production

# Test production build locally
npx serve -s build
```

## 📁 Project Structure for Deployment

```
sxp/
├── build/                 # Production build (generated)
├── public/                # Static assets
├── src/                   # Source code
├── netlify.toml          # Netlify configuration
├── env.example           # Environment variables template
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
```

## 🔐 Security Configuration

### HTTPS Configuration
- Ensure SSL certificate is properly configured
- Use HTTPS redirects
- Set secure headers

### Environment Variables Security
- Never commit `.env.local` to version control
- Use platform-specific environment variable management
- Rotate API keys regularly

## 📊 Monitoring and Analytics

### Performance Monitoring
- Configure web vitals tracking
- Set up error monitoring (Sentry, etc.)
- Monitor build and deployment status

### Analytics
- Google Analytics integration
- User behavior tracking
- Performance metrics

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+)
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

2. **Routing Issues**
   - Ensure SPA routing is configured
   - Check redirect rules in netlify.toml

3. **Environment Variables**
   - Verify all required variables are set
   - Check variable naming (REACT_APP_ prefix)

### Debug Commands
```bash
# Check build locally
npm run build
npx serve -s build

# Analyze bundle size
npm run analyze

# Check environment variables
npm run start
```

## 📞 Support

For deployment issues:
1. Check the build logs
2. Verify environment variables
3. Test locally with production build
4. Contact development team

---

**Deployment URL:** https://sxp.kervinapps.com
**Status:** Ready for deployment
