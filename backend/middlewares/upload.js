const multer = require('multer');
const path = require('path');

// Configure storage for existing uploads (candidate/school)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'general';
    
    if (file.fieldname === 'photo' || file.fieldname === 'logo') {
      folder = 'images';
    } else if (file.fieldname === 'cv') {
      folder = 'documents/cv';
    } else if (file.fieldname === 'latestDegreeFiles' || file.fieldname === 'schoolDocuments') {
      folder = 'documents/certificates';
    }
    
    cb(null, `uploads/${folder}`);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for existing uploads
const fileFilter = (req, file, cb) => {
  // Check file types
  if (file.fieldname === 'photo' || file.fieldname === 'logo') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for photos/logos'), false);
    }
  } else if (file.fieldname === 'cv') {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed for CV'), false);
    }
  } else {
    // For other documents, allow images, PDFs, and Word docs
    if (file.mimetype.startsWith('image/') || 
        file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'), false);
    }
  }
};

// Configure storage for job applications
const applicationStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    let folder = 'uploads/documents/';
    
    if (file.fieldname === 'resume') {
      folder += 'resumes/';
    } else if (file.fieldname === 'coverLetter') {
      folder += 'cover-letters/';
    }
    
    cb(null, folder);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for job applications
const applicationFileFilter = (req, file, cb) => {
  // Allowed file types for applications
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents are allowed'), false);
  }
};

// Configure storage for payment screenshots
const paymentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/payments/');
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'payment-screenshot-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for payment screenshots
const paymentFileFilter = (req, file, cb) => {
  // Only allow image files for screenshots
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for payment screenshots (JPG, PNG, etc.)'), false);
  }
};

// Create multer instances
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const uploadApplication = multer({
  storage: applicationStorage,
  fileFilter: applicationFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 2 // Max 2 files (resume + cover letter)
  }
});

// Create multer instance for payment screenshots
const uploadPaymentScreenshotMiddleware = multer({
  storage: paymentStorage,
  fileFilter: paymentFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for screenshots
  }
}).single('screenshot'); // 'screenshot' is the field name for the file

// Configure specific upload instances
const uploadCandidate = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'cv', maxCount: 1 },
  { name: 'latestDegreeFiles', maxCount: 10 }
]);

const uploadSchool = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'schoolDocuments', maxCount: 10 }
]);

const uploadJobApplication = uploadApplication.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 }
]);

module.exports = {
  uploadCandidate,
  uploadSchool,
  uploadJobApplication,
  uploadPaymentScreenshot: uploadPaymentScreenshotMiddleware
};