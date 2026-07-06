const sendEmail = require('../utils/sendEmail');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Send email to admin - Use 'message' field instead of 'html'
    await sendEmail({
      email: 'ithelearninghub@gmail.com',
      subject: `New Contact Form Message from ${name}`,
      message: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Message:
${message}
      `
    });

    // Send auto-reply to user - Use 'message' field instead of 'html'
    await sendEmail({
      email: email,
      subject: 'Thank you for contacting TeachingPath',
      message: `
Thank You for Reaching Out!

Dear ${name},

We have received your message and will get back to you within 24-48 hours.

Best regards,
The TeachingPath Team
      `
    });

    res.status(200).json({
      success: true,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.'
    });
  }
};