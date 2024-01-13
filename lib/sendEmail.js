import ReactDOMServer from "react-dom/server";

async function SENDMAIL(
  EmailTemplateComponent,
  receiverEmail,
  receiverName,
  EmailHeader,
  formData,
  EmailSubject
) {
  const getEmailHTML = () => {
    const emailTemplate = (
      <EmailTemplateComponent formData={formData} EmailHeader={EmailHeader} />
    );
    const htmlString = `
        <!DOCTYPE html>
        <html>
          <head></head>
          <body>
            ${ReactDOMServer.renderToStaticMarkup(emailTemplate)}
          </body>
        </html>
      `;
    return htmlString;
  };

  const emailHtml = getEmailHTML();

  const emailData = {
    sender: {
      name: receiverName,
      email: formData.Email,
    },
    to: [
      {
        email: receiverEmail,
        name: receiverName,
      },
    ],
    subject: EmailSubject,
    htmlContent: emailHtml,
  };
  const requestOptions = {
    method: "POST",
    headers: {
      accept: "application/json",
      // eslint-disable-next-line no-undef
      "api-key": process.env.NEXT_PUBLIC_REACT_APP_EMAILKEY,
      "content-type": "application/json",
    },
    body: JSON.stringify(emailData),
  };
  try {
    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      requestOptions
    );
    if (!response.ok) {
      throw new Error(`Email sending failed with status: ${response.status}`);
    }

    return "Email was sent successfully"; // Return success message
  } catch (error) {
    return error.message; // Return the error message
  }
}
export default SENDMAIL;
