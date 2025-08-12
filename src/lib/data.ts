import type { Course, Category, Certificate } from './types';

export const categories: Category[] = [
  { name: 'All Courses', slug: 'ai-fundamentals' },
  { name: 'Robotics Engineering', slug: 'robotics-engineering' },
  { name: 'Machine Learning', slug: 'machine-learning' },
];

export const courses: Course[] = [
  {
    id: 'intro-to-ai',
    title: 'Introduction to Artificial Intelligence',
    description: 'A beginner-friendly overview of AI concepts and history.',
    longDescription: 'This course provides a comprehensive introduction to the fundamental concepts of Artificial Intelligence. You will learn about the history of AI, its key subfields like machine learning and natural language processing, and understand the ethical considerations surrounding AI development. No prior experience required.',
    instructor: 'aalok tomer',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'abstract artificial intelligence',
    category: categories[0],
    tags: ['Beginner', 'AI', 'Theory'],
    lessons: [
      { id: 'l1', title: 'What is AI?', duration: '10 min', content: 'History and definition of AI.' },
      { id: 'l2', title: 'Types of AI', duration: '15 min', content: 'Exploring narrow, general, and superintelligence.' },
      { id: 'l3', title: 'Ethical Considerations', duration: '20 min', content: 'Bias, fairness, and the future of AI.' },
    ],
  },
  {
    id: 'robot-kinematics',
    title: 'Robot Kinematics and Dynamics',
    description: 'Learn the principles of robot motion and mechanics.',
    longDescription: 'Dive deep into the mechanics of robotic systems. This course covers forward and inverse kinematics, manipulator Jacobians, and dynamic modeling of robots. Essential for anyone looking to design or control robotic arms.',
    instructor: 'aalok tomer',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'robotic arm',
    category: categories[1],
    tags: ['Intermediate', 'Robotics', 'Engineering'],
    lessons: [
      { id: 'l1', title: 'Coordinate Transformations', duration: '25 min', content: 'Understanding frames and transformations.' },
      { id: 'l2', title: 'Forward Kinematics', duration: '30 min', content: 'Calculating end-effector position.' },
      { id: 'l3', title: 'Inverse Kinematics', duration: '35 min', content: 'Finding joint angles for a desired pose.' },
    ],
  },
  {
    id: 'deep-learning',
    title: 'Deep Learning Specialization',
    description: 'Master neural networks and build your own deep learning models.',
    longDescription: 'Join the deep learning revolution. This specialization will guide you through the foundations of neural networks, convolutional networks for image recognition, and recurrent networks for sequence data. You will complete several hands-on projects.',
    instructor: 'aalok tomer',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'neural network',
    category: categories[2],
    tags: ['Advanced', 'Machine Learning', 'AI'],
    lessons: [
      { id: 'l1', title: 'Intro to Neural Networks', duration: '20 min', content: 'The basics of neurons and layers.' },
      { id: 'l2', title: 'Convolutional Neural Networks', duration: '40 min', content: 'For image processing tasks.' },
      { id: 'l3', title: 'Recurrent Neural Networks', duration: '40 min', content: 'For text and time-series data.' },
    ],
  },
  {
    id: 'autonomous-navigation',
    title: 'Autonomous Robot Navigation',
    description: 'Implement navigation algorithms for self-driving robots.',
    longDescription: 'Learn how to make robots see, think, and move in the real world. This course covers sensor fusion, localization (SLAM), path planning (A*), and control algorithms for autonomous mobile robots.',
    instructor: 'aalok tomer',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'autonomous robot',
    category: categories[1],
    tags: ['Advanced', 'Robotics', 'AI'],
    lessons: [
      { id: 'l1', title: 'Sensors for Robotics', duration: '20 min', content: 'LIDAR, cameras, and IMUs.' },
      { id: 'l2', title: 'SLAM Algorithms', duration: '45 min', content: 'Simultaneous Localization and Mapping.' },
      { id: 'l3', title: 'Path Planning', duration: '30 min', content: 'From A* to Dijkstra.' },
    ],
  },
   {
    id: 'ml-foundations',
    title: 'Foundations of Machine Learning',
    description: 'Understand the core principles behind machine learning.',
    longDescription: 'This course builds a solid foundation in machine learning. Topics include supervised and unsupervised learning, linear regression, logistic regression, support vector machines, and decision trees. A balance of theory and practical application.',
    instructor: 'aalok tomer',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'data visualization',
    category: categories[2],
    tags: ['Intermediate', 'Machine Learning', 'Theory'],
    lessons: [
      { id: 'l1', title: 'Supervised vs. Unsupervised', duration: '15 min', content: 'Core paradigms of ML.' },
      { id: 'l2', title: 'Linear Regression', duration: '30 min', content: 'Predicting continuous values.' },
      { id: 'l3', title: 'Classification Algorithms', duration: '35 min', content: 'From logistic regression to SVMs.' },
    ],
  },
  {
    id: 'ai-ethics',
    title: 'AI Ethics and Safety',
    description: 'Explore the ethical challenges and safety in AI systems.',
    longDescription: 'As AI becomes more powerful, understanding its ethical implications is crucial. This course delves into issues of bias, accountability, transparency, and the societal impact of AI technologies, preparing you to develop responsible AI.',
    instructor: 'aalok tomer',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'abstract ethics',
    category: categories[0],
    tags: ['Beginner', 'AI', 'Ethics'],
    lessons: [
      { id: 'l1', title: 'Bias in AI', duration: '25 min', content: 'Sources of bias and mitigation techniques.' },
      { id: 'l2', title: 'AI Safety', duration: '25 min', content: 'Ensuring AI systems behave as intended.' },
      { id: 'l3', title: 'Future of AI Governance', duration: '20 min', content: 'Policies and regulations.' },
    ],
  },
];

export const certificates: Certificate[] = [
    {
        id: 'cert-1',
        courseTitle: 'Introduction to Artificial Intelligence',
        dateIssued: '2023-10-26',
    },
    {
        id: 'cert-2',
        courseTitle: 'Robot Kinematics and Dynamics',
        dateIssued: '2023-11-15',
    },
    {
        id: 'cert-3',
        courseTitle: 'Deep Learning Specialization',
        dateIssued: '2024-01-05',
    }
]
