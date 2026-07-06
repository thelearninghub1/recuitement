const User = require('../../model/userModel');
const crypto = require('crypto');
const { sendEmail, sendEmailCandidates } = require('../../utils/sendEmail');
const generateToken = require('../../utils/generateToken');
const asyncHandler = require('../../middlewares/asyncHandler');
const fs = require('fs').promises;
const path = require('path');

// Send token response (UPDATED FOR COOKIES)
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  
  // Set token in cookie instead of sending in response body
  generateToken.setTokenCookie(res, token);

  res.status(statusCode).json({
    success: true,
    user: user.getProfile()
  });
};

// Helper function to handle file paths
const handleFileUploads = (req, targetField) => {
  if (!req.files || !req.files[targetField]) return null;
  
  const file = req.files[targetField][0];
  return file.filename; // Store only filename, path is determined by storage
};

// Helper function to delete old files
const deleteOldFile = async (filePath) => {
  try {
    if (filePath) {
      await fs.unlink(filePath);
    }
  } catch (error) {
    console.log('Error deleting old file:', error.message);
    // Don't fail the operation if file deletion fails
  }
};

// Helper function to parse JSON fields
const parseJSONField = (field) => {
  if (!field) return field;
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (e) {
      // If it's not valid JSON, return as is or empty array
      return field.startsWith('[') ? [] : field;
    }
  }
  return field;
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { email, password, role, ...data } = req.body;

  // Parse any JSON fields that might be sent as strings
  if (data.positionsInterested && typeof data.positionsInterested === 'string') {
    try {
      data.positionsInterested = JSON.parse(data.positionsInterested);
    } catch (e) {
      data.positionsInterested = data.positionsInterested.split(',').map(item => item.trim());
    }
  }

  if (data.curriculumTaught && typeof data.curriculumTaught === 'string') {
    try {
      data.curriculumTaught = JSON.parse(data.curriculumTaught);
    } catch (e) {
      data.curriculumTaught = data.curriculumTaught.split(',').map(item => item.trim());
    }
  }

  if (data.skills && typeof data.skills === 'string') {
    try {
      data.skills = JSON.parse(data.skills);
    } catch (e) {
      data.skills = data.skills.split(',').map(item => item.trim());
    }
  }

  if (data.languages && typeof data.languages === 'string') {
    try {
      data.languages = JSON.parse(data.languages);
    } catch (e) {
      data.languages = data.languages.split(',').map(item => item.trim());
    }
  }

  if (data.extras && typeof data.extras === 'string') {
    try {
      data.extras = JSON.parse(data.extras);
    } catch (e) {
      data.extras = data.extras.split(',').map(item => item.trim());
    }
  }

  // Parse school array fields
  if (data.schoolType && typeof data.schoolType === 'string') {
    try {
      data.schoolType = JSON.parse(data.schoolType);
    } catch (e) {
      data.schoolType = data.schoolType.split(',').map(item => item.trim());
    }
  }

  if (data.schoolLevel && typeof data.schoolLevel === 'string') {
    try {
      data.schoolLevel = JSON.parse(data.schoolLevel);
    } catch (e) {
      data.schoolLevel = data.schoolLevel.split(',').map(item => item.trim());
    }
  }

  if (data.curriculum && typeof data.curriculum === 'string') {
    try {
      data.curriculum = JSON.parse(data.curriculum);
    } catch (e) {
      data.curriculum = data.curriculum.split(',').map(item => item.trim());
    }
  }

  if (data.facilities && typeof data.facilities === 'string') {
    try {
      data.facilities = JSON.parse(data.facilities);
    } catch (e) {
      data.facilities = data.facilities.split(',').map(item => item.trim());
    }
  }

  if (data.accreditations && typeof data.accreditations === 'string') {
    try {
      data.accreditations = JSON.parse(data.accreditations);
    } catch (e) {
      data.accreditations = data.accreditations.split(',').map(item => item.trim());
    }
  }

  // Parse otherCertificates if it's a string
  if (data.otherCertificates && typeof data.otherCertificates === 'string') {
    try {
      data.otherCertificates = JSON.parse(data.otherCertificates);
    } catch (e) {
      data.otherCertificates = [];
    }
  }

  // Validation
  if (!email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: 'Email, password, and role are required'
    });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }

  // Validate allowed roles
  const allowedRoles = ['candidate', 'school', 'system-admin'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role specified'
    });
  }

  // Create user object based on role
  let userData = {
    email,
    password,
    role,
    profile: {
      firstName: data.firstName || data.contactPerson || 'User',
      lastName: data.lastName || '',
      mobile: data.mobile,
      isVerified: true,
      profileCompleted: true
    }
  };

  // Handle file uploads
  if (req.files) {
    if (role === 'candidate' && req.files.photo) {
      userData.profile.photo = req.files.photo[0].filename;
    }
    if (role === 'candidate' && req.files.cv) {
      userData.candidateData = userData.candidateData || {};
      userData.candidateData.cv = req.files.cv[0].filename;
    }
    if (role === 'school' && req.files.logo) {
      userData.schoolData = userData.schoolData || {};
      userData.schoolData.logo = req.files.logo[0].filename;
    }
    if (role === 'school' && req.files.schoolProfileCR) {
      userData.schoolData = userData.schoolData || {};
      // Handle multiple files
      userData.schoolData.schoolProfileCR = req.files.schoolProfileCR.map(file => file.filename);
    }
  }

  // Add role-specific data
  if (role === 'candidate') {
    userData.candidateData = {
      ...data,
      ...userData.candidateData,
      applicationId: data.applicationId || `APP${Date.now()}`
    };
  } else if (role === 'school') {
    // Build school data object with only the fields we want to keep
    userData.schoolData = {
      // School Basic Information
      schoolName: data.schoolName,
      schoolNameOther: data.schoolNameOther,
      schoolType: data.schoolType || [],
      schoolTypeOther: data.schoolTypeOther || '',
      schoolLevel: data.schoolLevel || [],
      curriculum: data.curriculum || [], // Will store sub-values
      establishedYear: data.establishedYear,
      studentCapacity: data.studentCapacity,
      currentStudents: data.currentStudents,
      
      // Location Information
      country: data.country,
      city: data.city,
      cityOther: data.cityOther,
      address: data.address,
      website: data.website,
      
      // Contact Information
      contactPerson: data.contactPerson,
      contactPosition: data.contactPosition,
      principalName: data.principalName,
      email: data.email, // Use the main email
      telephone: data.telephone,
      alternativeContact: data.alternativeContact,
      
      // Staffing Requirements - Only expectedTeachers kept
      expectedTeachers: data.expectedTeachers,
      
      // Facilities
      facilities: data.facilities || [],
      facilitiesOther: data.facilitiesOther,
      
      // Accreditations
      accreditations: data.accreditations || [],
      accreditationsOther: data.accreditationsOther,
      
      // Additional Information
      schoolDescription: data.schoolDescription,
      otherPartnershipInstitutions: data.otherPartnershipInstitutions || data.partnershipInterest,
      additionalInfo: data.additionalInfo,
      
      // School Tracking
      schoolId: data.schoolId || `SCH${Date.now()}`,
      
      ...userData.schoolData
    };
  } else if (role === 'system-admin') {
    userData.adminData = data.adminData || { permissions: ['full_access'] };
  }

  const user = await User.create(userData);

  // Send welcome email with HTML formatting
  try {
    let subject, htmlMessage, textMessage;

    if (role === 'candidate') {
      subject = 'Thank you for registering with TheTeachingPath';
      
      // HTML formatted message (modern, beautiful design)
      htmlMessage = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to TheTeachingPath</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
              line-height: 1.5;
              color: #1e293b;
              background-color: #f0f4f8;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .card {
              background-color: #ffffff;
              border-radius: 24px;
              overflow: hidden;
              box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px 30px;
              text-align: center;
              position: relative;
            }
            .header::after {
              content: "✧";
              position: absolute;
              bottom: -15px;
              left: 50%;
              transform: translateX(-50%);
              width: 30px;
              height: 30px;
              background: white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              color: #764ba2;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 32px;
              font-weight: 700;
              letter-spacing: -0.5px;
            }
            .header p {
              color: rgba(255,255,255,0.9);
              margin: 8px 0 0;
              font-size: 14px;
            }
            .content {
              padding: 40px 32px 32px;
            }
            .greeting {
              font-size: 24px;
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 24px;
              background: linear-gradient(120deg, #1e293b, #4f46e5);
              background-clip: text;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .message-text {
              color: #475569;
              margin-bottom: 16px;
              font-size: 16px;
              line-height: 1.6;
            }
            .message-text strong {
              color: #667eea;
              font-weight: 600;
            }
            .highlight-badge {
              background: linear-gradient(105deg, #eef2ff 0%, #e0e7ff 100%);
              border-radius: 12px;
              padding: 16px 20px;
              margin: 24px 0;
              border-left: 4px solid #667eea;
            }
            .highlight-badge p {
              margin: 0;
              color: #4338ca;
              font-weight: 500;
              font-size: 14px;
            }
            .details-card {
              background: #f8fafc;
              border-radius: 20px;
              padding: 20px;
              margin: 28px 0;
              border: 1px solid #e2e8f0;
            }
            .details-card h3 {
              margin: 0 0 16px 0;
              color: #1e293b;
              font-size: 16px;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .detail-row {
              display: flex;
              padding: 10px 0;
              border-bottom: 1px solid #e2e8f0;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .detail-label {
              font-weight: 600;
              color: #475569;
              width: 120px;
              flex-shrink: 0;
            }
            .detail-value {
              color: #1e293b;
              flex: 1;
              word-break: break-word;
            }
            .closing {
              margin: 28px 0 20px;
              font-size: 16px;
              color: #475569;
            }
            .signature {
              margin-top: 28px;
              padding-top: 24px;
              border-top: 2px solid #f1f5f9;
              color: #475569;
            }
            .signature strong {
              color: #667eea;
            }
            .footer {
              background-color: #f8fafc;
              padding: 20px 32px;
              text-align: center;
              border-top: 1px solid #e2e8f0;
            }
            .footer p {
              margin: 0;
              font-size: 12px;
              color: #94a3b8;
            }
            .footer p:first-child {
              margin-bottom: 6px;
            }
            @media only screen and (max-width: 480px) {
              .content {
                padding: 28px 20px;
              }
              .detail-row {
                flex-direction: column;
              }
              .detail-label {
                width: 100%;
                margin-bottom: 4px;
              }
              .greeting {
                font-size: 22px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="card">
              <div class="header">
                <h1>The Teaching Path</h1>
                <p>Global Educator Network</p>
              </div>
              <div class="content">
                <div class="greeting">
                  Dear ${user.profile?.firstName || 'Teacher'},
                </div>
                
                <div class="message-text">
                  <strong>✨ Thank you for your interest.</strong> We are thrilled that you are with us.
                </div>
                
                <div class="message-text">
                  Our organization links talented educators with exciting career prospects around the globe. 
                  Your profile will be assessed by our team in order to find an appropriate placement for you.
                </div>
                
                <div class="highlight-badge">
                  <p>🌍 Connecting educators with global opportunities</p>
                </div>
                
                <div class="details-card">
                  <h3>📋 Registration Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">Application ID:</span>
                    <span class="detail-value">${user.candidateData?.applicationId || 'N/A'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${user.email || 'Not provided'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Role:</span>
                    <span class="detail-value">🎓 Teaching Candidate</span>
                  </div>
                     <div class="detail-row">
                    <span class="detail-label">Whatsapp Support:</span>
                    <span class="detail-value">+966 50 386 5055</span>
                  </div>
                </div>
                
                <div class="closing">
                  Feel free to contact us whenever you wish.
                </div>
                
                <div class="signature">
                  Best regards,<br>
                  <strong>The Recruitment Team</strong><br>
                  TheTeachingPath
                </div>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} TheTeachingPath. All rights reserved.</p>
                <p>This is an automated message, please do not reply directly to this email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
      
      // Plain text fallback
      textMessage = `Dear ${user.profile?.firstName || 'Teacher'},

Thank you for your interest. We are thrilled that you are with us.

Our organization links talented educators with exciting career prospects around the globe. Your profile will be assessed by our team in order to find an appropriate placement for you.

Registration Details:
Application ID: ${user.candidateData?.applicationId || 'N/A'}
Email: ${user.email || 'Not provided'}
Role: Teaching Candidate

Feel free to contact us whenever you wish.

Best regards,
The Recruitment Team
TheTeachingPath`;
      
      // Send using Candidate email sender (jobs@theteachingpath.com)
      await sendEmailCandidates({
        email: user.email,
        subject: subject,
        message: textMessage,
        html: htmlMessage
      });
      
      console.log(`✅ Welcome email sent to candidate ${user.email} from jobs@theteachingpath.com`);
      
    } else if (role === 'school') {
      subject = 'Thank you for registering with TheTeachingPath';
      
      htmlMessage = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to TheTeachingPath</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
              line-height: 1.5;
              color: #1e293b;
              background-color: #f0f4f8;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .card {
              background-color: #ffffff;
              border-radius: 24px;
              overflow: hidden;
              box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #059669 0%, #10b981 100%);
              padding: 40px 30px;
              text-align: center;
              position: relative;
            }
            .header::after {
              content: "🏫";
              position: absolute;
              bottom: -15px;
              left: 50%;
              transform: translateX(-50%);
              width: 30px;
              height: 30px;
              background: white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 32px;
              font-weight: 700;
              letter-spacing: -0.5px;
            }
            .header p {
              color: rgba(255,255,255,0.9);
              margin: 8px 0 0;
              font-size: 14px;
            }
            .content {
              padding: 40px 32px 32px;
            }
            .greeting {
              font-size: 24px;
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 24px;
              background: linear-gradient(120deg, #1e293b, #059669);
              background-clip: text;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .message-text {
              color: #475569;
              margin-bottom: 16px;
              font-size: 16px;
              line-height: 1.6;
            }
            .message-text strong {
              color: #059669;
              font-weight: 600;
            }
            .highlight-badge {
              background: linear-gradient(105deg, #ecfdf5 0%, #d1fae5 100%);
              border-radius: 12px;
              padding: 16px 20px;
              margin: 24px 0;
              border-left: 4px solid #10b981;
            }
            .highlight-badge p {
              margin: 0;
              color: #065f46;
              font-weight: 500;
              font-size: 14px;
            }
            .details-card {
              background: #f8fafc;
              border-radius: 20px;
              padding: 20px;
              margin: 28px 0;
              border: 1px solid #e2e8f0;
            }
            .details-card h3 {
              margin: 0 0 16px 0;
              color: #1e293b;
              font-size: 16px;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .detail-row {
              display: flex;
              padding: 10px 0;
              border-bottom: 1px solid #e2e8f0;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .detail-label {
              font-weight: 600;
              color: #475569;
              width: 120px;
              flex-shrink: 0;
            }
            .detail-value {
              color: #1e293b;
              flex: 1;
              word-break: break-word;
            }
            .closing {
              margin: 28px 0 20px;
              font-size: 16px;
              color: #475569;
            }
            .signature {
              margin-top: 28px;
              padding-top: 24px;
              border-top: 2px solid #f1f5f9;
              color: #475569;
            }
            .signature strong {
              color: #059669;
            }
            .footer {
              background-color: #f8fafc;
              padding: 20px 32px;
              text-align: center;
              border-top: 1px solid #e2e8f0;
            }
            .footer p {
              margin: 0;
              font-size: 12px;
              color: #94a3b8;
            }
            .footer p:first-child {
              margin-bottom: 6px;
            }
            @media only screen and (max-width: 480px) {
              .content {
                padding: 28px 20px;
              }
              .detail-row {
                flex-direction: column;
              }
              .detail-label {
                width: 100%;
                margin-bottom: 4px;
              }
              .greeting {
                font-size: 22px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="card">
              <div class="header">
                <h1>The Teaching Path</h1>
                <p>Global Educator Network</p>
              </div>
              <div class="content">
                <div class="greeting">
                  Dear ${user.schoolData?.contactPerson || user.schoolData?.schoolName || 'School Partner'},
                </div>
                
                <div class="message-text">
                  <strong>✨ Thank you for your interest.</strong> We are thrilled that you are with us.
                </div>
                
                <div class="message-text">
                  Our organization links talented educators with exciting career prospects around the globe. 
                  Your institution's profile will be assessed by our team in order to find appropriate teaching 
                  candidates for your staffing needs.
                </div>
                
                <div class="highlight-badge">
                  <p>🤝 Partnering with schools to find exceptional educators</p>
                </div>
                
                <div class="details-card">
                  <h3>🏫 Registration Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">School Name:</span>
                    <span class="detail-value">${user.schoolData?.schoolName || user.schoolData?.schoolNameOther || 'Not provided'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">School ID:</span>
                    <span class="detail-value">${user.schoolData?.schoolId || 'N/A'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${user.email || 'Not provided'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Role:</span>
                    <span class="detail-value">🏢 School Partner</span>
                  </div>
                     </div>
                     <div class="detail-row">
                    <span class="detail-label">Whatsapp Support:</span>
                    <span class="detail-value">+966 50 386 5055</span>
                  </div>
                </div>
                
                <div class="closing">
                  Feel free to contact us whenever you wish.
                </div>
                
                <div class="signature">
                  Best regards,<br>
                  <strong>The Recruitment Team</strong><br>
                  TheTeachingPath
                </div>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} TheTeachingPath. All rights reserved.</p>
                <p>This is an automated message, please do not reply directly to this email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
      
      textMessage = `Dear ${user.schoolData?.contactPerson || user.schoolData?.schoolName || 'School Partner'},

Thank you for your interest. We are thrilled that you are with us.

Our organization links talented educators with exciting career prospects around the globe. Your institution's profile will be assessed by our team in order to find appropriate teaching candidates for your staffing needs.

Registration Details:
School Name: ${user.schoolData?.schoolName || user.schoolData?.schoolNameOther || 'Not provided'}
School ID: ${user.schoolData?.schoolId || 'N/A'}
Email: ${user.email || 'Not provided'}
Role: School Partner

Feel free to contact us whenever you wish.

Best regards,
The Recruitment Team
TheTeachingPath`;
      
      // Send using School email sender (info@theteachingpath.com)
      await sendEmail({
        email: user.email,
        subject: subject,
        message: textMessage,
        html: htmlMessage
      });
      
      console.log(`✅ Welcome email sent to school ${user.email} from info@theteachingpath.com`);
    }

    if (subject && (htmlMessage || textMessage)) {
      console.log(`✅ Welcome email sent successfully to: ${user.email}`);
    } else {
      console.log(`⚠️ No email content generated for role: ${role}`);
    }
  } catch (error) {
    console.error('❌ Welcome email sending failed:', error.message);
    console.error('Error details:', error);
    // Don't fail registration if email fails - log but continue
  }

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  if (user.status !== 'active') {
    return res.status(401).json({
      success: false,
      message: 'Account is inactive. Please contact support.'
    });
  }

  await user.updateLastLogin();
  sendTokenResponse(user, 200, res);
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  // Add null check for req.user
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  const user = await User.findById(req.user.id);
  
  if (!user) {
    return res.status(404).json({ 
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    user: user.getProfile()
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/updateprofile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  // Add null check for req.user
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  const user = await User.findById(req.user.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const { role } = user;
  const data = req.body;

  // Parse JSON fields (similar to registration)
  // Candidate-specific array fields
  if (data.positionsInterested && typeof data.positionsInterested === 'string') {
    try {
      data.positionsInterested = JSON.parse(data.positionsInterested);
    } catch (e) {
      data.positionsInterested = data.positionsInterested.split(',').map(item => item.trim());
    }
  }

  if (data.curriculumTaught && typeof data.curriculumTaught === 'string') {
    try {
      data.curriculumTaught = JSON.parse(data.curriculumTaught);
    } catch (e) {
      data.curriculumTaught = data.curriculumTaught.split(',').map(item => item.trim());
    }
  }

  if (data.skills && typeof data.skills === 'string') {
    try {
      data.skills = JSON.parse(data.skills);
    } catch (e) {
      data.skills = data.skills.split(',').map(item => item.trim());
    }
  }

  if (data.languages && typeof data.languages === 'string') {
    try {
      data.languages = JSON.parse(data.languages);
    } catch (e) {
      data.languages = data.languages.split(',').map(item => item.trim());
    }
  }

  if (data.extras && typeof data.extras === 'string') {
    try {
      data.extras = JSON.parse(data.extras);
    } catch (e) {
      data.extras = data.extras.split(',').map(item => item.trim());
    }
  }

  // School-specific array fields
  if (data.schoolType && typeof data.schoolType === 'string') {
    try {
      data.schoolType = JSON.parse(data.schoolType);
    } catch (e) {
      data.schoolType = data.schoolType.split(',').map(item => item.trim());
    }
  }

  if (data.schoolLevel && typeof data.schoolLevel === 'string') {
    try {
      data.schoolLevel = JSON.parse(data.schoolLevel);
    } catch (e) {
      data.schoolLevel = data.schoolLevel.split(',').map(item => item.trim());
    }
  }

  if (data.curriculum && typeof data.curriculum === 'string') {
    try {
      data.curriculum = JSON.parse(data.curriculum);
    } catch (e) {
      data.curriculum = data.curriculum.split(',').map(item => item.trim());
    }
  }

  if (data.facilities && typeof data.facilities === 'string') {
    try {
      data.facilities = JSON.parse(data.facilities);
    } catch (e) {
      data.facilities = data.facilities.split(',').map(item => item.trim());
    }
  }

  if (data.accreditations && typeof data.accreditations === 'string') {
    try {
      data.accreditations = JSON.parse(data.accreditations);
    } catch (e) {
      data.accreditations = data.accreditations.split(',').map(item => item.trim());
    }
  }

  if (data.otherCertificates && typeof data.otherCertificates === 'string') {
    try {
      data.otherCertificates = JSON.parse(data.otherCertificates);
    } catch (e) {
      data.otherCertificates = [];
    }
  }

  // Handle file uploads and delete old files
  if (req.files) {
    // Profile photo (both roles can update)
    if (req.files.photo) {
      // Delete old photo if exists
      if (user.profile.photo) {
        const oldPhotoPath = path.join('uploads/images', user.profile.photo);
        await deleteOldFile(oldPhotoPath);
      }
      user.profile.photo = req.files.photo[0].filename;
    }

    // Candidate-specific file uploads
    if (role === 'candidate') {
      if (req.files.cv) {
        // Delete old CV if exists
        if (user.candidateData?.cv) {
          const oldCvPath = path.join('uploads/documents/cv', user.candidateData.cv);
          await deleteOldFile(oldCvPath);
        }
        user.candidateData = user.candidateData || {};
        user.candidateData.cv = req.files.cv[0].filename;
      }
    }

    // School-specific file uploads
    if (role === 'school') {
      if (req.files.logo) {
        // Delete old logo if exists
        if (user.schoolData?.logo) {
          const oldLogoPath = path.join('uploads/images', user.schoolData.logo);
          await deleteOldFile(oldLogoPath);
        }
        user.schoolData = user.schoolData || {};
        user.schoolData.logo = req.files.logo[0].filename;
      }

      if (req.files.schoolProfileCR) {
        // Delete old school profile/CR files
        if (user.schoolData?.schoolProfileCR && user.schoolData.schoolProfileCR.length > 0) {
          for (const file of user.schoolData.schoolProfileCR) {
            const oldFilePath = path.join('uploads/documents', file);
            await deleteOldFile(oldFilePath);
          }
        }
        user.schoolData = user.schoolData || {};
        user.schoolData.schoolProfileCR = req.files.schoolProfileCR.map(file => file.filename);
      }
    }
  }

  // Update profile fields (common to both roles)
  if (data.firstName !== undefined) user.profile.firstName = data.firstName;
  if (data.lastName !== undefined) user.profile.lastName = data.lastName;
  if (data.mobile !== undefined) user.profile.mobile = data.mobile;
  
  // Check if profile is completed (can be updated based on custom logic)
  if (data.profileCompleted !== undefined) {
    user.profile.profileCompleted = data.profileCompleted;
  }

  // Update role-specific data
  if (role === 'candidate') {
    // Initialize candidateData if it doesn't exist
    if (!user.candidateData) user.candidateData = {};
    
    // Candidate fields mapping
    const candidateFields = [
      'dateOfBirth', 'gender', 'nationality', 'maritalStatus',
      'currentLocation', 'expectedSalary', 'noticePeriod',
      'yearsOfExperience', 'teachingExperience', 'currentEmployer',
      'positionsInterested', 'curriculumTaught', 'preferredLocations',
      'skills', 'languages', 'extras', 'highestQualification',
      'certifications', 'otherCertificates', 'linkedinProfile',
      'portfolioWebsite', 'bio', 'applicationId'
    ];
    
    candidateFields.forEach(field => {
      if (data[field] !== undefined) {
        user.candidateData[field] = data[field];
      }
    });
  } 
  else if (role === 'school') {
    // Initialize schoolData if it doesn't exist
    if (!user.schoolData) user.schoolData = {};
    
    // School Basic Information
    if (data.schoolName !== undefined) user.schoolData.schoolName = data.schoolName;
    if (data.schoolNameOther !== undefined) user.schoolData.schoolNameOther = data.schoolNameOther;
    if (data.schoolType !== undefined) user.schoolData.schoolType = data.schoolType;
    if (data.schoolTypeOther !== undefined) user.schoolData.schoolTypeOther = data.schoolTypeOther;
    if (data.schoolLevel !== undefined) user.schoolData.schoolLevel = data.schoolLevel;
    if (data.curriculum !== undefined) user.schoolData.curriculum = data.curriculum;
    if (data.establishedYear !== undefined) user.schoolData.establishedYear = data.establishedYear;
    if (data.studentCapacity !== undefined) user.schoolData.studentCapacity = data.studentCapacity;
    if (data.currentStudents !== undefined) user.schoolData.currentStudents = data.currentStudents;
    
    // Location Information
    if (data.country !== undefined) user.schoolData.country = data.country;
    if (data.city !== undefined) user.schoolData.city = data.city;
    if (data.cityOther !== undefined) user.schoolData.cityOther = data.cityOther;
    if (data.address !== undefined) user.schoolData.address = data.address;
    if (data.website !== undefined) user.schoolData.website = data.website;
    
    // Contact Information
    if (data.contactPerson !== undefined) user.schoolData.contactPerson = data.contactPerson;
    if (data.contactPosition !== undefined) user.schoolData.contactPosition = data.contactPosition;
    if (data.principalName !== undefined) user.schoolData.principalName = data.principalName;
    if (data.telephone !== undefined) user.schoolData.telephone = data.telephone;
    if (data.alternativeContact !== undefined) user.schoolData.alternativeContact = data.alternativeContact;
    
    // Staffing Requirements
    if (data.expectedTeachers !== undefined) user.schoolData.expectedTeachers = data.expectedTeachers;
    
    // Facilities
    if (data.facilities !== undefined) user.schoolData.facilities = data.facilities;
    if (data.facilitiesOther !== undefined) user.schoolData.facilitiesOther = data.facilitiesOther;
    
    // Accreditations
    if (data.accreditations !== undefined) user.schoolData.accreditations = data.accreditations;
    if (data.accreditationsOther !== undefined) user.schoolData.accreditationsOther = data.accreditationsOther;
    
    // Additional Information
    if (data.schoolDescription !== undefined) user.schoolData.schoolDescription = data.schoolDescription;
    if (data.otherPartnershipInstitutions !== undefined) user.schoolData.otherPartnershipInstitutions = data.otherPartnershipInstitutions;
    if (data.additionalInfo !== undefined) user.schoolData.additionalInfo = data.additionalInfo;
    
    // Don't allow updating schoolId as it's an identifier
  } 
  else if (role === 'system-admin') {
    // Initialize adminData if it doesn't exist
    if (!user.adminData) user.adminData = {};
    
    if (data.permissions !== undefined) user.adminData.permissions = data.permissions;
    if (data.department !== undefined) user.adminData.department = data.department;
    if (data.position !== undefined) user.adminData.position = data.position;
  }

  // Update email if provided (with validation)
  if (data.email && data.email !== user.email) {
    // Check if email already exists
    const emailExists = await User.findOne({ email: data.email, _id: { $ne: user._id } });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    user.email = data.email;
  }

  console.log('Updating school data:', {
    schoolName: data.schoolName,
    address: data.address,
    city: data.city,
    country: data.country
  });
  
  // Save the updated user
  await user.save();
  
  console.log('Updated user schoolData:', user.schoolData);

  // Return updated profile
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: user.getProfile()
  });
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res) => {
  // Add null check for req.user
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  const user = await User.findById(req.user.id).select('+password');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal whether email exists or not
    return res.status(200).json({
      success: true,
      message: 'If the email exists, a password reset link has been sent'
    });
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    // Determine which email sender to use based on user role
    if (user.role === 'candidate') {
      await sendEmailCandidates({
        email: user.email,
        subject: 'Password Reset Request - The Teaching Path',
        message: `You have requested to reset your password. Please click the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`
      });
      console.log(`✅ Password reset email sent to candidate ${user.email} from jobs@theteachingpath.com`);
    } else {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request - The Teaching Path',
        message: `You have requested to reset your password. Please click the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`
      });
      console.log(`✅ Password reset email sent to ${user.role} ${user.email} from info@theteachingpath.com`);
    }

    res.status(200).json({
      success: true,
      message: 'If the email exists, a password reset link has been sent'
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.status(500).json({
      success: false,
      message: 'Email could not be sent. Please try again later.'
    });
  }
});

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: resetPasswordToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token'
    });
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Logout user (UPDATED FOR COOKIES)
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
  // Clear the token cookie
  res.cookie('token', null, {
    expires: new Date(Date.now() + 10 * 1000), // Expire in 10 seconds
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res) => {

  const users = await User.find()
  
  res.status(200).json({
    success: true,
    users
  });
});

// @desc    Get single user (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res) => {
  // Add null check for req.user
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    user: user.getProfile()
  });
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  // Add null check for req.user
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  if (req.params.id === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'You cannot delete your own account'
    });
  }

  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Delete associated files
  if (user.profile.photo) {
    const photoPath = path.join('uploads/images', user.profile.photo);
    await deleteOldFile(photoPath);
  }

  if (user.role === 'candidate' && user.candidateData?.cv) {
    const cvPath = path.join('uploads/documents/cv', user.candidateData.cv);
    await deleteOldFile(cvPath);
  }

  if (user.role === 'school' && user.schoolData?.logo) {
    const logoPath = path.join('uploads/images', user.schoolData.logo);
    await deleteOldFile(logoPath);
  }

  // Delete school profile/CR files if they exist
  if (user.role === 'school' && user.schoolData?.schoolProfileCR && user.schoolData.schoolProfileCR.length > 0) {
    for (const file of user.schoolData.schoolProfileCR) {
      const filePath = path.join('uploads/documents', file);
      await deleteOldFile(filePath);
    }
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

// @desc    Get user stats (Admin only)
// @route   GET /api/users/stats/dashboard
// @access  Private/Admin
exports.getUserStats = asyncHandler(async (req, res) => {
  // Add null check for req.user
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  const [
    totalUsers,
    totalCandidates,
    totalSchools,
    totalAdmins,
    activeUsers,
    recentRegistrations
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'candidate' }),
    User.countDocuments({ role: 'school' }),
    User.countDocuments({ role: 'system-admin' }),
    User.countDocuments({ status: 'active' }),
    User.countDocuments({ 
      createdAt: { 
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
      }
    })
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalCandidates,
      totalSchools,
      totalAdmins,
      activeUsers,
      recentRegistrations
    }
  });
});