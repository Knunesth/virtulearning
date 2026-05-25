import nodemailer from 'nodemailer';

// Cria o transportador do Nodemailer usando as credenciais do .env
const transporter = nodemailer.createTransport({
  service: 'gmail', // Usar o serviço do Gmail facilita tudo (não exige host/porta)
  auth: {
    user: process.env.EMAIL_USER, // Ex: seu.email@gmail.com
    pass: process.env.EMAIL_PASS, // Senha de App do Google (não é a senha normal)
  },
});

/**
 * Envia o email de verificação de conta
 */
export async function sendVerificationEmail(to: string, nome: string, token: string) {
  // O link real que o frontend vai interceptar e redirecionar
  const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"VirtuLearning" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verifique sua conta no VirtuLearning',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #333;">Olá, ${nome}!</h2>
        <p style="color: #555; line-height: 1.5;">Obrigado por se cadastrar na <strong>VirtuLearning</strong>. Para liberar seu acesso à plataforma, por favor verifique seu endereço de e-mail clicando no botão abaixo:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #facc15; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
            Verificar E-mail
          </a>
        </div>
        
        <p style="color: #777; font-size: 12px; margin-top: 20px;">
          Se o botão não funcionar, copie e cole o seguinte link no seu navegador:<br/>
          <a href="${verificationLink}" style="color: #2563eb;">${verificationLink}</a>
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`[MAILER] Falha ao enviar e-mail para ${to}:`, error);
    // Não estouramos o erro para não quebrar o fluxo de cadastro, 
    // mas o log acima ajuda a debugar se houver problema de credencial
  }
}
