export interface SampleResume {
  id: string;
  name: string;
  role: string;
  badge: string;
  text: string;
}

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: 'fullstack-cs',
    name: 'Aarav Sharma',
    role: 'Full Stack & Software Engineering',
    badge: 'Senior CS Undergrad',
    text: `Aarav Sharma
Email: aarav.sharma.dev@gmail.com | Phone: +91 98765 43210
GitHub: github.com/aaravsharma-dev | LinkedIn: linkedin.com/in/aaravsharma

EDUCATION
Bachelor of Technology in Computer Science & Engineering
Delhi Technological University (DTU), New Delhi | Expected Graduation: May 2025
CGPA: 8.82 / 10.0
Relevant Coursework: Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems, Computer Networks, Distributed Systems

TECHNICAL SKILLS
- Programming Languages: JavaScript, TypeScript, Python, C++, SQL
- Frontend: React.js, Next.js, Redux Toolkit, Tailwind CSS, HTML5, CSS3
- Backend: Node.js, Express.js, RESTful APIs, WebSockets
- Databases: PostgreSQL, MongoDB, Redis
- Cloud & DevOps: Docker, AWS (S3, EC2), Git, GitHub Actions, Vercel
- Tools: Postman, VS Code, Linux, Jest

EXPERIENCE & INTERNSHIPS
Software Engineer Intern | CloudScale Technologies (Gurugram, India)
June 2024 – August 2024
- Engineered 8 reusable React UI components using TypeScript and Tailwind CSS, reducing frontend rendering cycle time by 22%.
- Developed RESTful API endpoints in Node.js/Express for customer onboarding, supporting 15,000+ daily active requests.
- Optimized PostgreSQL database queries using indexed B-trees, cutting average query execution latency from 320ms to 78ms.
- Wrote automated unit and integration tests using Jest and Supertest, boosting code test coverage from 64% to 88%.

PROJECTS
DevCollab: Real-Time Collaborative Workspace
Technologies: React, Node.js, Express, Socket.IO, PostgreSQL, Docker
- Built a multi-tenant collaborative document and code editor featuring live room collaboration and Markdown rendering.
- Integrated WebSockets with Socket.IO to achieve sub-40ms operational transformation synchronization across concurrent clients.
- Implemented JWT authentication and role-based access control (RBAC) protecting project workspaces.
- Containerized client and server services using Docker Compose for seamless reproducible deployments.

CampusPlace: Placement Management & Drive Portal
Technologies: Next.js, TypeScript, Supabase, Tailwind CSS
- Architected a centralized placement registration portal adopted by 650+ students across 4 university engineering departments.
- Implemented real-time application status tracking, automated eligibility filtering, and notification broadcasting.
- Integrated resume PDF parsing and verified applicant credentials using automated validation logic.

ACHIEVEMENTS & CERTIFICATIONS
- Secured 2nd Place out of 120 teams in Smart India Hackathon (College Internal Round, 2024).
- Solved 450+ Data Structures & Algorithms problems across LeetCode and GeeksforGeeks (LeetCode rating: 1820+).
- AWS Certified Cloud Practitioner (Earned Dec 2023).
- Active Open Source Contributor: Contributed bug fixes to 2 popular React open-source component libraries.`
  },
  {
    id: 'ai-ml-specialist',
    name: 'Priya Iyer',
    role: 'AI / ML & Data Science',
    badge: 'Pre-Final Year ML Specialist',
    text: `Priya Iyer
Email: priya.iyer.ai@gmail.com | Phone: +91 98123 76540
Portfolio: priyaiyer.dev | GitHub: github.com/priyaiyer-ml

EDUCATION
Bachelor of Technology in Artificial Intelligence & Data Science
Vellore Institute of Technology (VIT), Vellore | Expected Graduation: July 2025
CGPA: 9.15 / 10.0
Relevant Coursework: Machine Learning, Deep Learning, Natural Language Processing, Linear Algebra, Probability & Statistics, Big Data Analytics

TECHNICAL SKILLS
- Programming Languages: Python, SQL, C++, R
- Machine Learning & Deep Learning: PyTorch, TensorFlow, Scikit-Learn, Keras, OpenCV, Hugging Face Transformers
- Data Analysis & Tools: Pandas, NumPy, SciPy, Matplotlib, Seaborn, Tableau, Jupyter
- Backend & Cloud: FastAPI, Flask, Docker, AWS (SageMaker, S3), Git, MLflow
- Databases: PostgreSQL, MongoDB, ChromaDB (Vector DB)

EXPERIENCE & INTERNSHIPS
Machine Learning Research Intern | Center for Cognitive Computing
January 2024 – June 2024
- Fine-tuned BERT and RoBERTa models for multi-class domain-specific sentiment analysis on 50,000+ customer reviews.
- Developed an automated data preprocessing and tokenization pipeline reducing training ingestion pipeline time by 35%.
- Containerized ML inference APIs using FastAPI and Docker, achieving 95th percentile latency below 65ms per request.

PROJECTS
MedVision: Chest X-Ray Disease Classification System
Technologies: PyTorch, TorchVision, ResNet-50, FastAPI, Docker
- Trained a convolutional neural network with transfer learning on 110,000+ public chest X-ray images, achieving 92.4% AUC-ROC score across 8 thoracic pathologies.
- Implemented Grad-CAM class activation mapping to generate visual heatmaps explaining neural network decision boundaries to medical clinicians.
- Deployed a lightweight inference web interface allowing radiology technicians to upload DICOM and PNG images for instant second-opinion analysis.

DocuSense: RAG-based Multimodal Document Q&A Agent
Technologies: Python, LangChain, Hugging Face, ChromaDB, FastAPI
- Built a Retrieval-Augmented Generation (RAG) system answering technical queries from multi-page PDF research papers.
- Embedded documents using Hugging Face text embeddings stored in ChromaDB vector store with reciprocal rank fusion retrieval.
- Reduced hallucination rate by 40% through strict context grounding and citation verification.

ACHIEVEMENTS & CERTIFICATIONS
- Kaggle Notebooks Expert: Top 5% worldwide in Machine Learning Competitions.
- DeepLearning.AI Deep Learning Specialization (Andrew Ng) – Certified with Honors.
- 1st Place Winner at HackVIT 2024 for AI in Healthcare category ($1,500 prize).
- Published research paper preprint on Explainable AI in Medical Diagnostics.`
  },
  {
    id: 'cloud-devops',
    name: 'Rohan Deshmukh',
    role: 'Cloud Engineering & DevOps',
    badge: 'Final Year Cloud Enthusiast',
    text: `Rohan Deshmukh
Email: rohan.deshmukh.cloud@gmail.com | Phone: +91 97654 32189
LinkedIn: linkedin.com/in/rohandeshmukh | GitHub: github.com/rohandeshmukh-ops

EDUCATION
Bachelor of Engineering in Information Technology
Pune Institute of Computer Technology (PICT), Pune | Expected Graduation: June 2025
CGPA: 8.40 / 10.0
Coursework: Cloud Computing, Linux System Administration, Computer Networks, Software Engineering, Network Security

TECHNICAL SKILLS
- Cloud Platforms: Amazon Web Services (EC2, S3, RDS, Lambda, VPC, CloudFront), Google Cloud Platform
- DevOps & Infrastructure: Docker, Kubernetes, Terraform, Ansible, GitHub Actions, Jenkins, Helm
- Programming & Scripting: Bash, Python, Go, YAML, SQL
- Monitoring & Observability: Prometheus, Grafana, ELK Stack, Datadog
- Networking: TCP/IP, DNS, SSL/TLS, Reverse Proxies (Nginx), Load Balancing

EXPERIENCE & INTERNSHIPS
Cloud Operations Intern | NetSprint Systems (Pune)
May 2024 – July 2024
- Provisioned and managed AWS infrastructure using Terraform modules, reducing manual environment setup time by 70%.
- Configured automated GitHub Actions CI/CD pipelines deploying microservices into Kubernetes clusters across Dev and Staging environments.
- Set up Prometheus alerts and Grafana dashboards monitoring CPU, memory utilization, and HTTP 5xx error spikes across 12 services.

PROJECTS
KubeScale: Automated Kubernetes Cluster Autoscaler & Cost Analyzer
Technologies: Kubernetes, Go, Docker, Helm, Prometheus
- Developed a custom Kubernetes controller in Go that monitors pod queue metrics and scales worker nodes dynamically.
- Implemented spot instance scheduling algorithms, saving an estimated 35% on simulated cloud infrastructure costs.
- Packaged full observability stack into modular Helm charts for one-command deployment.

SecureFlow: Zero-Downtime Blue/Green Deployment Gateway
Technologies: Nginx, Docker, Python, AWS EC2, GitHub Actions
- Designed a blue/green deployment orchestration tool switching live production traffic without dropping in-flight TCP connections.
- Integrated automated health check validation and automated rollback mechanisms on deployment anomalies.

ACHIEVEMENTS & CERTIFICATIONS
- AWS Certified Solutions Architect – Associate (SAA-C03).
- HashiCorp Certified: Terraform Associate (003).
- Runner Up at Pune DevOps Days Hackathon 2024.`
  }
];
