import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend('re_aQuzhAmu_58SptGNacxb6MfxsK3hooC5u')

const baseStyles = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;600&display=swap');
    .container { max-width: 600px; margin: 0 auto; background: #0a0a0a; border-radius: 16px; overflow: hidden; }
    .header { padding: 2rem; text-align: center; position: relative; }
    .content { padding: 2rem; color: #e0e0e0; font-family: 'Oswald', sans-serif; }
    .clapperboard { background: #f5c518; padding: 8px; border-radius: 50%; width: 40px; height: 40px; }
    .btn { padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; }
  </style>
`

const footer = `
  <div style="background: #1a1a1a; padding: 1rem; text-align: center; color: #666; font-size: 0.8rem; border-top: 1px solid #333;">
    © ${new Date().getFullYear()} CinemaHub. All rights reserved.
  </div>
`

const socialLinks = `
  <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #333; text-align: center;">
    <p style="color: #a0a0a0; margin-bottom: 1rem;">Follow the drama 🎭</p>
    <div style="display: flex; gap: 1rem; justify-content: center;">
      <a href="#" style="color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 8px; background: #222;">
        🎥 Instagram
      </a>
      <a href="#" style="color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 8px; background: #222;">
        🎞️ Facebook
      </a>
    </div>
  </div>
`

const templateGenerator = (type: string, body: any) => {
  switch(type) {
    case 'contact':
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyles}</head>
        <body style="margin: 0; padding: 30px 0; background: #1a1a1a;">
          <div class="container" style="box-shadow: 0 8px 32px rgba(229,9,20,0.1); border: 1px solid #e50914;">
            <div class="header" style="background: linear-gradient(135deg, #e50914 0%, #b20710 100%);">
              <img src="https://i.pinimg.com/236x/e4/c4/dd/e4c4ddf83131e3d993eb3813fb9b4556.jpg" alt="CinemaHub" style="height: 50px;">
              <h1 style="color: white; margin: 1rem 0 0; font-size: 2rem; text-transform: uppercase;">New Scene Alert</h1>
            </div>
            <div class="content">
              <div style="background: #1a1a1a; padding: 2rem; border-radius: 12px; border-left: 4px solid #e50914;">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
                  <div class="clapperboard">📨</div>
                  <h2 style="margin: 0; color: #ffffff; font-size: 1.5rem;">${body.name}</h2>
                </div>
                <div style="display: grid; gap: 1.5rem;">
                  <div>
                    <p style="color: #f5c518; margin: 0;">Subject</p>
                    <p style="color: #fff; margin: 0; font-size: 1.2rem;">${body.subject}</p>
                  </div>
                  <div>
                    <p style="color: #f5c518; margin: 0;">Message</p>
                    <div style="background: #2a2a2a; padding: 1rem; border-radius: 8px; margin-top: 0.5rem;">
                      <p style="margin: 0; white-space: pre-line;">${body.message}</p>
                    </div>
                  </div>
                </div>
              </div>
              ${socialLinks}
            </div>
            ${footer}
          </div>
        </body>
        </html>
      `

    case 'newStaff':
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyles}</head>
        <body style="margin: 0; padding: 30px 0; background: #1a1a1a;">
          <div class="container" style="box-shadow: 0 8px 32px rgba(245,197,24,0.1); border: 1px solid #f5c518;">
            <div class="header" style="background: linear-gradient(135deg, #f5c518 0%, #d4af37 100%);">
              <img src="https://i.pinimg.com/236x/e4/c4/dd/e4c4ddf83131e3d993eb3813fb9b4556.jpg" alt="CinemaHub" style="height: 50px;">
              <h1 style="color: #000; margin: 1rem 0 0; font-size: 2rem; text-transform: uppercase;">New Crew Member</h1>
            </div>
            <div class="content">
              <div style="background: #1a1a1a; padding: 2rem; border-radius: 12px; border-left: 4px solid #f5c518;">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
                  <div class="clapperboard">🎬</div>
                  <h2 style="margin: 0; color: #ffffff; font-size: 1.5rem;">Welcome ${body.staffName}!</h2>
                </div>
                <div style="display: grid; gap: 1.5rem;">
                  <div>
                    <p style="color: #f5c518; margin: 0;">Role</p>
                    <p style="color: #fff; margin: 0; font-size: 1.2rem;">${body.role}</p>
                  </div>
                  <div>
                    <p style="color: #f5c518; margin: 0;">Credentials</p>
                    <div style="background: #2a2a2a; padding: 1rem; border-radius: 8px; margin-top: 0.5rem;">
                      <p style="margin: 0;">Email: ${body.email}</p>
                      <p style="margin: 0.5rem 0 0;">Temporary Password: ${body.tempPassword}</p>
                    </div>
                  </div>
                </div>
              </div>
              ${socialLinks}
            </div>
            ${footer}
          </div>
        </body>
        </html>
      `

    case 'userSignup':
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyles}</head>
        <body style="margin: 0; padding: 30px 0; background: #1a1a1a;">
          <div class="container" style="box-shadow: 0 8px 32px rgba(0,150,255,0.1); border: 1px solid #0096ff;">
            <div class="header" style="background: linear-gradient(135deg, #0096ff 0%, #0047ab 100%);">
              <img src="https://i.pinimg.com/236x/e4/c4/dd/e4c4ddf83131e3d993eb3813fb9b4556.jpg" alt="CinemaHub" style="height: 50px;">
              <h1 style="color: white; margin: 1rem 0 0; font-size: 2rem; text-transform: uppercase;">Action! Account Created</h1>
            </div>
            <div class="content">
              <div style="background: #1a1a1a; padding: 2rem; border-radius: 12px; border-left: 4px solid #0096ff;">
                <div style="text-align: center; margin-bottom: 2rem;">
                  <div style="font-size: 3rem;">🎉</div>
                  <h2 style="margin: 1rem 0; color: #ffffff; font-size: 1.5rem;">Lights, Camera, Action ${body.name}!</h2>
                  <p style="color: #a0a0a0;">Your backstage pass to cinematic experiences</p>
                </div>
                <a href="${body.verifyLink}" class="btn" style="background: #0096ff; color: white; width: 100%; text-align: center;">
                  Verify Your Account
                </a>
              </div>
              ${socialLinks}
            </div>
            ${footer}
          </div>
        </body>
        </html>
      `

    case 'deleteStaff':
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyles}</head>
        <body style="margin: 0; padding: 30px 0; background: #1a1a1a;">
          <div class="container" style="box-shadow: 0 8px 32px rgba(255,69,0,0.1); border: 1px solid #ff4500;">
            <div class="header" style="background: linear-gradient(135deg, #ff4500 0%, #cc3300 100%);">
              <img src="https://i.pinimg.com/236x/e4/c4/dd/e4c4ddf83131e3d993eb3813fb9b4556.jpg" alt="CinemaHub" style="height: 50px;">
              <h1 style="color: white; margin: 1rem 0 0; font-size: 2rem; text-transform: uppercase;">Crew Update</h1>
            </div>
            <div class="content">
              <div style="background: #1a1a1a; padding: 2rem; border-radius: 12px; border-left: 4px solid #ff4500;">
                <div style="text-align: center; margin-bottom: 2rem;">
                  <div style="font-size: 3rem;">🎬</div>
                  <h2 style="margin: 1rem 0; color: #ffffff; font-size: 1.5rem;">Staff Access Removed</h2>
                  <p style="color: #a0a0a0;">${body.staffName}'s backstage pass has been revoked</p>
                </div>
                <div style="background: #2a2a2a; padding: 1rem; border-radius: 8px;">
                  <p style="margin: 0; color: #ff4500;">Effective Date: ${body.effectiveDate}</p>
                </div>
              </div>
              ${socialLinks}
            </div>
            ${footer}
          </div>
        </body>
        </html>
      `

    case 'movieStatus':
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyles}</head>
        <body style="margin: 0; padding: 30px 0; background: #1a1a1a;">
          <div class="container" style="box-shadow: 0 8px 32px rgba(0,255,0,0.1); border: 1px solid #00ff00;">
            <div class="header" style="background: linear-gradient(135deg, #00ff00 0%, #009900 100%);">
              <img src="https://i.pinimg.com/236x/e4/c4/dd/e4c4ddf83131e3d993eb3813fb9b4556.jpg" alt="CinemaHub" style="height: 50px;">
              <h1 style="color: #000; margin: 1rem 0 0; font-size: 2rem; text-transform: uppercase;">Reel Update</h1>
            </div>
            <div class="content">
              <div style="background: #1a1a1a; padding: 2rem; border-radius: 12px; border-left: 4px solid #00ff00;">
                <div style="text-align: center; margin-bottom: 2rem;">
                  <div style="font-size: 3rem;">🍿</div>
                  <h2 style="margin: 1rem 0; color: #ffffff; font-size: 1.5rem;">${body.movieTitle}</h2>
                  <p style="color: #a0a0a0;">Status changed to: <span style="color: #00ff00;">${body.newStatus}</span></p>
                </div>
                <div style="background: #2a2a2a; padding: 1rem; border-radius: 8px;">
                  <p style="margin: 0; color: #00ff00;">${body.statusMessage}</p>
                </div>
                ${body.ticketLink ? `
                <a href="${body.ticketLink}" class="btn" style="background: #00ff00; color: #000; margin-top: 2rem; width: 100%; text-align: center;">
                  Get Tickets Now
                </a>
                ` : ''}
              </div>
              ${socialLinks}
            </div>
            ${footer}
          </div>
        </body>
        </html>
      `

    default:
      return ''
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.type) {
      return NextResponse.json(
        { error: 'Missing email type' },
        { status: 400 }
      )
    }

    const htmlContent = templateGenerator(body.type, body)
    
    const { data, error } = await resend.emails.send({
      from: 'CinemaHub <onboarding@resend.dev>',
      to: [body.recipient],
      subject: body.subject,
      text: body.textContent,
      html: htmlContent
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}