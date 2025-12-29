import * as React from "react";

interface EmailTemplateProps {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  senderName,
  senderEmail,
  subject,
  message,
}) => (
  <div
    style={{
      backgroundColor: "#f6f9fc",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: "40px 20px",
    }}
  >
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        maxWidth: "600px",
        margin: "0 auto",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          backgroundColor: "#132b28", // สีธีมหลักของคุณ
          padding: "30px 40px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "#ffffff",
            fontSize: "24px",
            fontWeight: "bold",
            margin: 0,
            letterSpacing: "1px",
          }}
        >
          New Inquiry Received
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "14px",
            marginTop: "8px",
            margin: 0,
          }}
        >
          You have a new message from your website contact form.
        </p>
      </div>

      {/* Content Section */}
      <div style={{ padding: "40px" }}>
        {/* Sender Details */}
        <div style={{ marginBottom: "24px" }}>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: "12px",
              color: "#8898aa",
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
          >
            Sender Name
          </p>
          <p style={{ margin: "0", fontSize: "16px", color: "#333333" }}>
            {senderName}
          </p>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: "12px",
              color: "#8898aa",
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
          >
            Email Address
          </p>
          <a
            href={`mailto:${senderEmail}`}
            style={{
              margin: "0",
              fontSize: "16px",
              color: "#132b28",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            {senderEmail}
          </a>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: "12px",
              color: "#8898aa",
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
          >
            Subject
          </p>
          <p style={{ margin: "0", fontSize: "16px", color: "#333333" }}>
            {subject}
          </p>
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid #eaeaea",
            margin: "30px 0",
          }}
        />

        {/* Message Box */}
        <div>
          <p
            style={{
              margin: "0 0 12px",
              fontSize: "14px",
              color: "#666666",
              fontWeight: "bold",
            }}
          >
            Message:
          </p>
          <div
            style={{
              backgroundColor: "#f9fafb",
              borderLeft: "4px solid #132b28",
              padding: "20px",
              borderRadius: "4px",
              fontSize: "15px",
              lineHeight: "1.6",
              color: "#444444",
              whiteSpace: "pre-wrap", // รักษารูปแบบการขึ้นบรรทัดใหม่
            }}
          >
            {message}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div
        style={{
          backgroundColor: "#f9fafb",
          padding: "20px",
          textAlign: "center",
          borderTop: "1px solid #eaeaea",
        }}
      >
        <p style={{ margin: 0, fontSize: "12px", color: "#999999" }}>
          © {new Date().getFullYear()} Yoga By Niti. All rights reserved.
        </p>
      </div>
    </div>
  </div>
);
