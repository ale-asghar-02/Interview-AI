# 🤖 Interview AI

An AI-powered web application that analyzes your **resume**, **job description**, and **self-description** to generate a detailed **interview preparation report** and a **professional, job-tailored resume**.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Site-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://interview-ai-snowy.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)


## 📸 Screenshots

| Home | Interview Report | Generated Resume |
|------|------------------|------------------|
| ![Home](screenshots/home.avif) | ![Report](screenshots/report.avif) | ![Resume](screenshots/resume.avif) |


## ✨ Features

- 📄 **Resume Analysis**: Upload your existing resume (PDF) and compare it against the target job description.
- 💼 **Job Description Matching**: Identifies your strengths and skill gaps for the role.
- 🧠 **Self-Description Processing**: Uses your personal summary to personalize the output.
- 📊 **Interview Report Generation**: Produces a detailed preparation report with likely interview questions and improvement tips.
- 📝 **Professional Resume Generation**: Creates an optimized resume tailored to the job.


## 🔮 How It Works

1. The user uploads their **resume** (PDF).
2. The user enters the **job description**.
3. The user writes a short **self-description**.
4. The Gemini AI model analyzes all three inputs.
5. The app generates:
   - ✅ A personalized **interview report** with likely questions and tips
   - ✅ An optimized **resume** tailored to the job


## 🛠️ Tech Stack

<table width="100%">
  <tr>
    <th width="440px" align="left">Layer</th>
    <th width="440px" align="left">Technology</th>
  </tr>
  <tr>
    <td>Frontend</td>
    <td>React.js, Vite</td>
  </tr>
  <tr>
    <td>Backend</td>
    <td>Node.js, Express.js</td>
  </tr>
  <tr>
    <td>Database</td>
    <td>MongoDB Atlas</td>
  </tr>
  <tr>
    <td>AI</td>
    <td>Google Gemini API</td>
  </tr>
  <tr>
    <td>Deployment</td>
    <td>Vercel (frontend), Render (backend)</td>
  </tr>
</table>


## ⏳ Backend Status

The backend is hosted on a free tier and is currently in a paused state to save resources. If the app takes longer than usual to load, the server is simply waking up. It can be activated on demand through its health check endpoint whenever needed.


## 🌐 Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

Environment variables are configured in the hosting dashboards. Never commit `.env` files to GitHub.


## 🗺️ Future Improvements

- [ ] Download the generated resume as PDF
- [ ] Support PDF resume uploads
- [ ] Save and view past reports
- [ ] Mock interview mode


## 👨‍💻 Author

**Ali Asghar**

- GitHub: [@ale-asghar-02](https://github.com/ale-asghar-02)


## 📄 License

This project is open source and available under the [MIT License](LICENSE).