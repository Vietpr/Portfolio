export interface Project {
  id: string;
  title: string;
  category: "professional" | "personal";
  description: string;
  solutions: string[];
  techStack: string[];
  github?: string;
}

export interface SkillSubGroup {
  label: string;
  items: string[];
}

export interface SkillCategory {
  title: string;
  subGroups: SkillSubGroup[];
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface WorkExperience {
  company: string;
  role: string;
  period: string;
  summary: string;
  contributions: string[];
}

export const personalInfo = {
  name: "Pham Van Viet",
  title: "AI Engineer",
  about:
    "I build intelligent systems that bridge cutting-edge AI research with real-world applications.\n\nMy work spans computer vision, generative AI, and large language models, from data preparation and model development to building reliable AI-powered systems. I also have hands-on experience deploying AI solutions on AWS.",
  email: "phamvietofficial@gmail.com",
};

export const skillCategories: SkillCategory[] = [
  {
    title: "Deep Learning & Vision",
    subGroups: [
      { label: "Frameworks", items: ["PyTorch", "TensorFlow", "Keras", "HuggingFace", "Transformers", "OpenCV"] },
      { label: "Computer Vision", items: ["YOLO", "SAM2", "Paddle (Det/Seg/OCR)"] },
      { label: "Pose & Geometry", items: ["6-DoF", "ArUco", "PnP", "RTM Pose"] },
      { label: "Machine Learning", items: ["Scikit-learn", "XGBoost", "Random Forest"] },
    ],
  },
  {
    title: "Cloud, MLOps & Data",
    subGroups: [
      { label: "Orchestration", items: ["Kubernetes (EKS)", "Docker"] },
      { label: "MLOps", items: ["AWS (SageMaker, ECS)", "CI/CD", "MLflow", "DVC"] },
      { label: "Optimization", items: ["ONNX", "TensorRT", "Model Quantization"] },
      { label: "Robotics", items: ["ROS2 (Real-time TF, RViz)"] },
    ],
  },
  {
    title: "Backend & RAG System",
    subGroups: [
      { label: "Core", items: ["Python (Expert)", "C++", "FastAPI"] },
      { label: "RAG & Search", items: ["BAAI/bge-m3", "Qwen Embedding", "LangChain"] },
      { label: "Vector DB", items: ["FAISS", "Milvus", "Qdrant", "Redis"] },
      { label: "Databases", items: ["PostgreSQL", "MySQL"] },
    ],
  },
];

export const workExperience: WorkExperience[] = [
  {
    company: "VTI Group",
    role: "AI Engineer",
    period: "Aug 2024 – Present",
    summary:
      "Responsible for researching, developing, and deploying production AI systems (Computer Vision & MLOps) for international clients.",
    contributions: [
      "Computer Vision & Robotics: Developed a 6-DoF Pose Estimation core using ArUco/AprilTag and OpenCV to calculate 2D-3D correspondences for autonomous landing scenarios.",
      "Signal Processing: Implemented and tuned a Kalman Filter to effectively smooth pose data and eliminate jitter from camera movement, ensuring stable coordinate tracking.",
      "System Integration: Integrated vision modules into ROS2, publishing real-time TF frames and pose topics to simulate drone control and visualization in RViz.",
      "AI Infrastructure: Architected a scalable training & deployment platform using FastAPI and Docker, standardizing the ML lifecycle and ensuring environment consistency.",
      "Performance Optimization: Refined OCR and geometric analysis algorithms for Japanese document processing, successfully boosting accuracy from 76.19% to 90.32%.",
    ],
  },
];

export const projects: Project[] = [
  // ── Professional Projects (VTI Group) ──────────────────
  {
    id: "precision-landing",
    title: "Autonomous Precision Landing System",
    category: "professional",
    description:
      "Developed a high-accuracy autonomous landing system powered by Computer Vision.",
    solutions: [
      "Built a 6-DoF pose estimation pipeline using ArUco/AprilTag and OpenCV (solvePnPRansac).",
      "Applied Kalman Filter (tuned Q, R matrices) for noise suppression and in-flight vibration handling.",
      "Integrated into ROS2, publishing real-time TF frames for drone control and RViz visualization.",
    ],
    techStack: ["Python", "OpenCV", "ROS2", "NumPy", "Kalman Filter"],
  },
  {
    id: "mlops-platform",
    title: "Internal AI Training & Deployment Platform",
    category: "professional",
    description:
      "Built a platform managing the full ML lifecycle from data ingestion to deployment.",
    solutions: [
      "Designed a high-performance FastAPI service architecture handling thousands of concurrent training requests.",
      "Standardized training environments with Docker, ensuring dev-to-prod consistency.",
      "Built automated data validation pipelines, reducing model error rates.",
    ],
    techStack: ["Python", "FastAPI", "Docker", "MySQL", "Redis", "ONNX"],
  },
  {
    id: "smart-meter",
    title: "Smart Meter Recognition System",
    category: "professional",
    description:
      "Recognition and reading system for multiple meter types (electric, water, LED displays).",
    solutions: [
      "Fine-tuned powerful model families: PaddleDetection, PaddleSeg, Paddle Keypoint, and SAM2.",
      "Optimized heavy models to ONNX format to reduce latency and model size.",
      "Deployed inference services on AWS ECS and orchestrated training via AWS SageMaker.",
    ],
    techStack: ["PyTorch", "ONNX", "SAM2", "PaddleDet/Seg/Keypoint", "AWS (SageMaker, ECS)", "Docker"],
  },
  {
    id: "doc-error-detection",
    title: "Japanese Document Error Detection",
    category: "professional",
    description:
      "Pipeline for detecting text errors on scanned documents, assisting manual correction workflows.",
    solutions: [
      "Combined YOLO with geometric analysis (pixel density, bounding box alignment) for error detection.",
      "Optimized algorithms boosting accuracy from 76.19% to 90.32% for critical error types.",
    ],
    techStack: ["Python", "YOLO", "PaddleOCR", "OpenCV", "Algorithm Optimization"],
  },
  // ── Personal Projects (R&D) ────────────────────────────
  {
    id: "legal-rag",
    title: "Vietnamese Legal RAG Assistant",
    category: "personal",
    description:
      "An intelligent Vietnamese legal Q&A system that eliminates LLM hallucination by combining precise retrieval with source-cited generation.",
    solutions: [
      "Hybrid Semantic Search: Used BAAI/bge-m3 for multilingual embedding, optimized for Vietnamese legal terminology.",
      "Custom Re-ranking: Combined Cosine Distance with Year Recency Bonus to prioritize the latest legal documents.",
      "Context Management: Implemented Deduplication and Chunk Expansion to preserve full context for the LLM.",
      "Smart Pipeline: Hierarchical PDF processing by Chapter/Article/Clause structure with rich metadata for optimal retrieval.",
    ],
    techStack: ["FastAPI", "Google Gemini 2.5 Flash", "BAAI/bge-m3", "ChromaDB", "PyMuPDF", "Docker"],
    github: "https://github.com/Vietpr/legal-rag-assistant",
  },
  {
    id: "agri-forecast",
    title: "Agriculture Temperature Forecasting",
    category: "personal",
    description:
      "Specialized temperature forecasting system for agriculture, optimizing planting schedules and resource management.",
    solutions: [
      "Benchmarked Linear Regression, SVR, and XGBoost — XGBoost with hyperparameter tuning achieved R² = 0.91 (Tempmax) and R² = 0.89 (Tempmin).",
      "Achieved lowest MSE (2.51) compared to traditional models.",
      "Applied Outlier Detection & Handling (Mean Imputation), Min-Max Scaling, and Correlation Analysis.",
    ],
    techStack: ["Python", "XGBoost", "Scikit-learn", "Pandas", "Matplotlib", "Seaborn"],
    github: "https://github.com/Vietpr/Temperature_Prediction_for_Agriculture",
  },
];

export const certifications: Certification[] = [
  {
    title: "Software Development Lifecycle Specialization",
    issuer: "University of Minnesota",
    date: "2024",
    link: "https://www.coursera.org/account/accomplishments/specialization/certificate/VS4DDRAESEMW",
  },
  {
    title: "Big Data Specialization",
    issuer: "University of California San Diego",
    date: "2024",
    link: "https://www.coursera.org/account/accomplishments/specialization/certificate/V9FEBFKJB5XE",
  },
  {
    title: "Generative AI and LLMs: Architecture and Data Preparation",
    issuer: "IBM",
    date: "2026",
    link: "https://www.coursera.org/account/accomplishments/certificate/IQF5HJ92Z632",
  },
  {
    title: "IBM Full Stack Software Developer",
    issuer: "IBM",
    date: "2024",
    link: "https://www.coursera.org/account/accomplishments/specialization/certificate/E8JOU8L2T78J",
  },
  {
    title: "Natural Language Processing",
    issuer: "DeepLearning.AI",
    date: "2024",
    link: "https://www.coursera.org/account/accomplishments/specialization/certificate/IRCNEL0ZAAGG",
  },
  {
    title: "IBM AI Enterprise Workflow",
    issuer: "IBM",
    date: "2025",
    link: "https://www.coursera.org/account/accomplishments/specialization/certificate/JNUQNFSUAA8O",
  },
  {
    title: "Applied Data Science with R",
    issuer: "IBM",
    date: "2024",
  },
];

export const socialLinks: SocialLink[] = [
  {
    platform: "GitHub",
    url: "https://github.com/Vietpr",
    icon: "github",
  },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/phamvietofficial/",
    icon: "linkedin",
  },
  {
    platform: "Email",
    url: "mailto:phamvietofficial@gmail.com",
    icon: "mail",
  },
];
