# 🔧 Setup Instructions for Registration & Login

## ✅ **What's Already Implemented:**

### 1. **API Endpoints** ✅
- `POST /api/providers/auth/register/doctor` - Doctor registration
- `POST /api/providers/auth/login` - Doctor login

### 2. **Components** ✅
- Registration form with validation
- Login form with API integration
- Dropdown component for specializations
- Authentication storage service

### 3. **Features** ✅
- Form validation (client-side)
- Loading states
- Error handling
- Navigation between login/register
- Token and user data storage

## 🔧 **What You Need to Configure:**

### **1. Update API Base URL (CRITICAL)**

**File:** `services/api.ts`  
**Line:** 2

```typescript
// Change this line:
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// To your actual API URL:
const API_BASE_URL = 'https://your-actual-api-domain.com';
```

**Options:**
- **Local Development:** `http://localhost:3000`
- **Local Network:** `http://192.168.1.100:3000` (your computer's IP)
- **Production:** `https://your-production-api.com`

### **2. Environment Variables (Optional)**

Create a `.env` file in your project root:

```env
EXPO_PUBLIC_API_URL=https://your-api-domain.com
```

### **3. API Response Format**

Make sure your backend API returns data in this format:

**Registration Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "civilId": "123456789",
    "specialization": "Cardiology",
    "licenseNumber": "MD123456",
    "experience": 5,
    "education": "MBBS",
    "hospital": "City Hospital",
    "address": "123 Main St",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

**Login Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "civilId": "123456789",
      "specialization": "Cardiology",
      "licenseNumber": "MD123456",
      "experience": 5,
      "education": "MBBS",
      "hospital": "City Hospital",
      "address": "123 Main St"
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message here"
}
```

## 🧪 **Testing Checklist:**

### **Registration Testing:**
- [ ] Fill out all required fields
- [ ] Test email validation
- [ ] Test phone number validation
- [ ] Test password confirmation
- [ ] Test specialization dropdown
- [ ] Submit form and verify API call
- [ ] Check success navigation to login

### **Login Testing:**
- [ ] Enter valid credentials
- [ ] Test with invalid credentials
- [ ] Verify token storage
- [ ] Check navigation to main app
- [ ] Test loading states

### **API Testing:**
- [ ] Verify API endpoints are accessible
- [ ] Test with Postman/Insomnia
- [ ] Check CORS configuration
- [ ] Verify response format matches expected

## 🚨 **Common Issues & Solutions:**

### **1. Network Error**
**Problem:** "Cannot connect to API"
**Solution:** 
- Check API base URL is correct
- Ensure API server is running
- Check firewall/network settings

### **2. CORS Error**
**Problem:** "CORS policy blocked request"
**Solution:**
- Configure CORS on your backend
- Add your app's domain to allowed origins

### **3. 404 Error**
**Problem:** "Endpoint not found"
**Solution:**
- Verify endpoint path is correct
- Check if API server has the routes configured

### **4. Validation Errors**
**Problem:** "Form validation failing"
**Solution:**
- Check required fields are filled
- Verify email format
- Ensure password meets requirements

## 🔒 **Security Considerations:**

### **Backend Requirements:**
- [ ] Input validation and sanitization
- [ ] Password hashing (bcrypt)
- [ ] JWT token generation
- [ ] Rate limiting
- [ ] HTTPS in production

### **Frontend Security:**
- [ ] Token storage in secure storage
- [ ] Input validation
- [ ] Error message sanitization
- [ ] Network request timeout

## 📱 **Mobile-Specific Setup:**

### **For Physical Device Testing:**
1. Find your computer's IP address
2. Update API URL to use IP instead of localhost
3. Ensure device and computer are on same network

### **For Production:**
1. Use HTTPS URLs
2. Configure proper domain
3. Set up SSL certificates

## 🚀 **Next Steps:**

1. **Update API URL** in `services/api.ts`
2. **Test API endpoints** with Postman
3. **Run the app** and test registration/login
4. **Configure backend** to match expected response format
5. **Deploy** when ready

## 📞 **Support:**

If you encounter issues:
1. Check the console for error messages
2. Verify API endpoints are working
3. Test with Postman first
4. Check network connectivity

---

**✅ Your registration and login system is ready to use!** 