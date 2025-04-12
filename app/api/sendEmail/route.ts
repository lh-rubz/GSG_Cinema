import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend('re_aQuzhAmu_58SptGNacxb6MfxsK3hooC5u')

const baseStyles = `
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #eeeeee;
    }
    .logo {
      height: 50px;
      margin-bottom: 15px;
    }
    .content {
      padding: 20px 0;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #2563eb;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eeeeee;
      font-size: 12px;
      color: #666666;
      text-align: center;
    }
  </style>
`

const footer = `
  <div class="footer">
    <p>© ${new Date().getFullYear()} CinemaHub. All rights reserved.</p>
    <p>If you didn't request this email, please ignore it.</p>
  </div>
`

const templates = {
  contact: (data: {
    name: string
    email: string
    subject: string
    message: string
  }) => `
    <!DOCTYPE html>
    <html>
    <head>${baseStyles}</head>
    <body>
      <div class="header">
        <img src="https://i.pinimg.com/236x/e4/c4/dd/e4c4ddf83131e3d993eb3813fb9b4556.jpg" alt="CinemaHub" class="logo">
        <h1>New Contact Message</h1>
      </div>
      <div class="content">
        <p><strong>From:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <div style="margin-top: 20px; padding: 15px; background: #f8f8f8; border-radius: 4px;">
          <p>${data.message.replace(/\n/g, '<br>')}</p>
        </div>
      </div>
      ${footer}
    </body>
    </html>
  `,

  userWelcome: (data: {
    name: string
    email: string
    verifyLink: string
  }) => `
    <!DOCTYPE html>
    <html>
    <head>${baseStyles}</head>
    <body>
      <div class="header">
        <img src="https://i.pinimg.com/236x/e4/c4/dd/e4c4ddf83131e3d993eb3813fb9b4556.jpg" alt="CinemaHub" class="logo">
        <h1>Welcome to CinemaHub</h1>
      </div>
      <div class="content">
        <p>Hello ${data.name},</p>
        <p>Thank you for creating an account with CinemaHub. To get started, please verify your email address:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${data.verifyLink}" class="button">Verify Email</a>
        </p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all;">${data.verifyLink}</p>
      </div>
      ${footer}
    </body>
    </html>
  `,

  staffWelcome: (data: {
    name: string
    email: string
    tempPassword: string
    role: string
  }) => `
    <!DOCTYPE html>
    <html>
    <head>${baseStyles}</head>
    <body>
      <div class="header">
        <img src="https://i.pinimg.com/236x/e4/c4/dd/e4c4ddf83131e3d993eb3813fb9b4556.jpg" alt="CinemaHub" class="logo">
        <h1>Welcome to the CinemaHub Team</h1>
      </div>
      <div class="content">
        <p>Dear ${data.name},</p>
        <p>You have been added as a <strong>${data.role}</strong> to CinemaHub. Below are your login credentials:</p>
        
        <div style="margin: 25px 0; padding: 15px; background: #f8f8f8; border-radius: 4px;">
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Temporary Password:</strong> ${data.tempPassword}</p>
        </div>
        
        <p>For security reasons, please change your password after your first login.</p>
        <p style="text-align: center; margin-top: 30px;">
          <a href="https://cinemahub.com/login" class="button">Login to Your Account</a>
        </p>
      </div>
      ${footer}
    </body>
    </html>
  `
}

// Type validation
type EmailType = keyof typeof templates

interface EmailRequest {
  type: EmailType
  recipient: string
  subject?: string
  [key: string]: any // Additional dynamic properties
}

export async function POST(request: Request) {
  try {
    const body: EmailRequest = await request.json()

    // Validate required fields
    if (!body.type || !body.recipient) {
      return NextResponse.json(
        { error: 'Missing required fields: type and recipient are required' },
        { status: 400 }
      )
    }

    // Validate email type
    if (!templates[body.type]) {
      return NextResponse.json(
        { error: 'Invalid email type specified' },
        { status: 400 }
      )
    }

    // Generate HTML content
    const htmlContent = templates[body.type](body as any)
    const defaultSubject = {
      contact: 'New Contact Message',
      userWelcome: 'Welcome to CinemaHub!',
      staffWelcome: 'Your CinemaHub Staff Account'
    }[body.type]

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: "habuelrub@gmail.com",
      subject: body.subject || defaultSubject,
      html: htmlContent,
    })

    if (error) {
      console.error('Email sending failed:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, emailId: data?.id })

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}