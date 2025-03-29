import nodemailer from 'nodemailer';
import { ContactMessage } from '@shared/schema';

// For email sending functionality, we need email credentials
// In production, these would come from environment variables
let transporter: nodemailer.Transporter;

// Initialize email transporter
export function initializeEmailService(username?: string, password?: string) {
  // If we have SMTP credentials, set up a real transporter
  if (username && password) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: username,
        pass: password
      }
    });
    return true;
  }
  
  // Otherwise, log that we need credentials
  console.log('Email service not initialized. Missing SMTP credentials.');
  return false;
}

// Send contact form submission to company email
export async function sendContactEmail(contact: ContactMessage): Promise<boolean> {
  if (!transporter) {
    console.log('Email service not initialized. Email not sent.');
    return false;
  }

  try {
    const mailOptions = {
      from: 'noreply@floctettechnologies.com',
      to: 'floctettechnologies@gmail.com',
      subject: `New Contact Form Submission: ${contact.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Subject:</strong> ${contact.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${contact.message}</p>
        <p><em>This message was sent from the Floctet Technologies website at ${new Date().toLocaleString()}</em></p>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

// Send service request notification to company email
export async function sendServiceRequestEmail(serviceRequest: any): Promise<boolean> {
  if (!transporter) {
    console.log('Email service not initialized. Email not sent.');
    return false;
  }

  try {
    const mailOptions = {
      from: 'noreply@floctettechnologies.com',
      to: 'floctettechnologies@gmail.com',
      subject: `New Service Request: ${serviceRequest.serviceType}`,
      html: `
        <h2>New Service Request</h2>
        <p><strong>Name:</strong> ${serviceRequest.name}</p>
        <p><strong>Email:</strong> ${serviceRequest.email}</p>
        <p><strong>Phone:</strong> ${serviceRequest.phone || 'Not provided'}</p>
        <p><strong>Service Type:</strong> ${serviceRequest.serviceType}</p>
        <p><strong>Description:</strong></p>
        <p>${serviceRequest.description}</p>
        <p><strong>Budget Range:</strong> ${serviceRequest.minBudget || 'Not specified'} - ${serviceRequest.maxBudget || 'Not specified'}</p>
        <p><em>This request was submitted from the Floctet Technologies website at ${new Date().toLocaleString()}</em></p>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}