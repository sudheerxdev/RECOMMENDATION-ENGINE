export interface LearningChannel {
  id: string;
  category: string;
  technology: string;
  name: string;
  focus: string;
  url: string;
}

export interface CodingPlatform {
  id: string;
  name: string;
  description: string;
  url: string;
  bestFor: string;
}

const createChannel = (
  id: string,
  category: string,
  technology: string,
  name: string,
  focus: string
): LearningChannel => ({
  id,
  category,
  technology,
  name,
  focus,
  url: `https://www.youtube.com/results?search_query=${encodeURIComponent(name)}`
});

const baseChannels: LearningChannel[] = [
  createChannel('ch-001', 'Languages', 'HTML/CSS', 'Kevin Powell', 'Modern CSS, layouts, and responsive design'),
  createChannel('ch-002', 'Languages', 'C', 'Jacob Sorber', 'C fundamentals and memory concepts'),
  createChannel('ch-003', 'Languages', 'C++', 'TheCherno', 'C++ deep dives and architecture'),
  createChannel('ch-004', 'Languages', 'Java', 'Telusko', 'Java and backend concepts'),
  createChannel('ch-005', 'Languages', 'C#', 'kudvenkat', 'C# and ASP.NET basics'),
  createChannel('ch-006', 'Languages', 'Python', 'Corey Schafer', 'Python fundamentals and tooling'),
  createChannel('ch-007', 'Languages', 'JavaScript', 'developedbyed', 'JavaScript and frontend projects'),
  createChannel('ch-008', 'Languages', 'SQL', 'Joey Blue', 'SQL foundations'),
  createChannel('ch-009', 'Languages', 'Golang', 'Jon Calhoun', 'Go programming and backend topics'),
  createChannel('ch-010', 'Languages', 'Swift', 'CodeWithChris', 'Swift and iOS basics'),
  createChannel('ch-011', 'Languages', 'Kotlin', 'Philipp Lackner', 'Kotlin and Android development'),
  createChannel('ch-012', 'Languages', 'PHP', 'Program With Gio', 'PHP modern development'),
  createChannel('ch-013', 'Languages', 'Ruby', 'Drifting Ruby', 'Ruby and Ruby patterns'),
  createChannel('ch-014', 'Languages', 'Rust', 'No Boilerplate', 'Rust essentials'),
  createChannel('ch-015', 'Languages', 'Lua', "Steve's teacher", 'Lua scripting basics'),
  createChannel('ch-016', 'Languages', 'Scala', 'DevInsideYou', 'Scala explained clearly'),
  createChannel('ch-017', 'Languages', 'Julia', 'The Julia Language', 'Julia data and compute workflows'),
  createChannel('ch-018', 'Languages', 'MATLAB', 'Joseph Delgadillo', 'MATLAB practical tutorials'),
  createChannel('ch-019', 'Languages', 'R', 'marinstatlectures', 'R and statistics workflows'),
  createChannel('ch-020', 'Languages', 'C++', 'javidx9', 'Game dev and practical C++'),
  createChannel('ch-021', 'Languages', 'C++', 'LearningLad', 'C++ syntax and OOP'),
  createChannel('ch-022', 'Languages', 'C++', 'Trevor Payne', 'Intermediate C++ topics'),
  createChannel('ch-023', 'Languages', 'JavaScript', 'Akshay Saini', 'JavaScript interview prep'),
  createChannel('ch-024', 'Languages', 'TypeScript', 'basarat', 'TypeScript language insights'),
  createChannel('ch-025', 'Languages', 'TypeScript', 'TypeScriptTV', 'Advanced TypeScript examples'),
  createChannel('ch-026', 'Languages', 'C#', 'Microsoft Developer [Bob Tabor]', 'C# from basics to advanced'),
  createChannel('ch-027', 'Languages', 'C#', 'dotnet [Scott/Kendra]', '.NET ecosystem and C# updates'),
  createChannel('ch-028', 'Languages', 'SQL', 'The Magic of SQL', 'Real SQL exercises'),
  createChannel('ch-029', 'Frameworks', 'Node.js', 'Traversy Media', 'Node.js backend builds'),
  createChannel('ch-030', 'Frameworks', 'React', 'Codevolution', 'React fundamentals and hooks'),
  createChannel('ch-031', 'Frameworks', 'React', 'Dave Gray', 'React project workflows'),
  createChannel('ch-032', 'Frameworks', 'React', 'Jack Herrington', 'React architecture and trends'),
  createChannel('ch-033', 'Frameworks', 'Next.js', 'Lama Dev', 'Next.js practical guides'),
  createChannel('ch-034', 'Frameworks', 'Vue', 'Vue Mastery', 'Vue ecosystem tutorials'),
  createChannel('ch-035', 'Frameworks', 'Svelte', 'Joy of Code', 'Svelte and SvelteKit'),
  createChannel('ch-036', 'Frameworks', 'Angular', 'Angular University', 'Angular deep technical guides'),
  createChannel('ch-037', 'Frameworks', 'Django', 'CodingEntrepreneurs', 'Django full stack examples'),
  createChannel('ch-038', 'Frameworks', 'Laravel', 'Laravel Daily', 'Laravel app development'),
  createChannel('ch-039', 'Frameworks', 'Blazor', 'James Montemagno', 'Blazor and .NET UI'),
  createChannel('ch-040', 'Frameworks', 'Spring', 'SpringSourceDev', 'Spring framework guides'),
  createChannel('ch-041', 'Frameworks', 'SpringBoot', 'amigoscode', 'Spring Boot API projects'),
  createChannel('ch-042', 'Frameworks', 'Ruby on Rails', 'GorailsTV', 'Rails production patterns'),
  createChannel('ch-043', 'Mobile', 'React Native', 'Codevolution', 'React Native basics'),
  createChannel('ch-044', 'Mobile', 'React Native', 'Hitesh Choudhary', 'React Native walkthroughs'),
  createChannel('ch-045', 'Mobile', 'Flutter', 'The Flutter Way', 'Flutter UI and architecture'),
  createChannel('ch-046', 'Mobile', 'Flutter', 'Tadas Petra', 'Flutter app exercises'),
  createChannel('ch-047', 'DSA', 'DSA', 'take U forward', 'DSA sheets and interview preparation'),
  createChannel('ch-048', 'DSA', 'DSA', 'mycodeschool', 'Classic data structures explanations'),
  createChannel('ch-049', 'DSA', 'DSA', 'Abdul Bari', 'Algorithms with intuition'),
  createChannel('ch-050', 'DSA', 'DSA', 'Kunal Kushwaha', 'DSA for interviews'),
  createChannel('ch-051', 'DSA', 'DSA', "Jenny's Lectures CS IT", 'CS fundamentals and DSA'),
  createChannel('ch-052', 'DSA', 'DSA', 'CodeWithHarry', 'DSA and language playlists'),
  createChannel('ch-053', 'Full Stack', 'Full Stack', 'Traversy Media', 'End-to-end project builds'),
  createChannel('ch-054', 'Full Stack', 'Full Stack', 'NetNinja', 'Full stack tutorials'),
  createChannel('ch-055', 'Full Stack', 'Full Stack', 'Dave Gray', 'Production project structure'),
  createChannel('ch-056', 'Projects', 'Projects', 'WebDevSimplified', 'Portfolio project ideas'),
  createChannel('ch-057', 'Projects', 'Projects', 'JavaScript King', 'JavaScript-based projects'),
  createChannel('ch-058', 'UI Design', 'UI Design', 'developedbyed', 'UI implementation'),
  createChannel('ch-059', 'UI Design', 'UI Design', 'DesignCourse', 'UI/UX and interaction design'),
  createChannel('ch-060', 'DevOps', 'Git', 'The Modern Coder', 'Git and collaboration flow'),
  createChannel('ch-061', 'DevOps', 'Linux', 'Learn Linux TV', 'Linux command-line mastery'),
  createChannel('ch-062', 'DevOps', 'DevOps', 'DevOpsToolkit', 'DevOps architecture and tools'),
  createChannel('ch-063', 'DevOps', 'CI/CD', 'TechWorld with Nana', 'CI/CD pipelines and release automation'),
  createChannel('ch-064', 'DevOps', 'Docker', 'Bret Fisher', 'Docker containers and best practices'),
  createChannel('ch-065', 'DevOps', 'Kubernetes', 'Kubesimplify', 'Kubernetes internals'),
  createChannel('ch-066', 'DevOps', 'Microservices', 'freeCodeCamp', 'Microservices concepts'),
  createChannel('ch-067', 'DevOps', 'Selenium', 'edureka!', 'Test automation with Selenium'),
  createChannel('ch-068', 'DevOps', 'Playwright', 'Jaydeep Karale', 'Playwright automation'),
  createChannel('ch-069', 'Cloud', 'AWS', 'amazonwebservices', 'Official AWS learning'),
  createChannel('ch-070', 'Cloud', 'Azure', 'Adam Marczak', 'Azure services and architecture'),
  createChannel('ch-071', 'Cloud', 'GCP', 'edureka!', 'Google Cloud workflows'),
  createChannel('ch-072', 'Cloud', 'Serverless', 'Serverless', 'Serverless architecture'),
  createChannel('ch-073', 'Cloud', 'Jenkins', 'DevOps Journey', 'Jenkins CI setup'),
  createChannel('ch-074', 'Cloud', 'Puppet', 'simplilearn', 'Infrastructure as code'),
  createChannel('ch-075', 'Cloud', 'Chef', 'simplilearn', 'Configuration management'),
  createChannel('ch-076', 'Cloud', 'Ansible', 'Learn Linux TV', 'Ansible automation'),
  createChannel('ch-077', 'Data Science', 'Mathematics', '3Blue1Brown', 'Math intuition for ML'),
  createChannel('ch-078', 'Data Science', 'Mathematics', 'ProfRobBob', 'Mathematical foundations'),
  createChannel('ch-079', 'Data Science', 'Mathematics', 'Ghrist Math', 'Higher math concepts'),
  createChannel('ch-080', 'Data Science', 'Mathematics', 'Numberphile', 'Math exploration'),
  createChannel('ch-081', 'Data Science', 'Machine Learning', 'sentdex', 'Hands-on ML in Python'),
  createChannel('ch-082', 'Data Science', 'Machine Learning', 'DeepLearningAI', 'ML and deep learning'),
  createChannel('ch-083', 'Data Science', 'Machine Learning', 'StatQuest', 'Statistics and ML clarity'),
  createChannel('ch-084', 'Data Science', 'Excel', 'ExcelIsFun', 'Excel for analysts'),
  createChannel('ch-085', 'Data Science', 'Excel', 'Kevin Stratvert', 'Excel productivity'),
  createChannel('ch-086', 'Data Science', 'Excel', 'Chandoo', 'Excel dashboards'),
  createChannel('ch-087', 'Data Science', 'Tableau', 'Tableau Tim', 'Tableau dashboards'),
  createChannel('ch-088', 'Data Science', 'PowerBI', 'Guy in a Cube', 'Power BI reporting'),
  createChannel('ch-089', 'Data Science', 'PowerBI', 'Chandoo', 'Power BI and analytics'),
  createChannel('ch-090', 'Data Science', 'Data Science', 'Krish Naik', 'Data science workflows'),
  createChannel('ch-091', 'Data Science', 'Data Science', 'Leila Gharani', 'Data and business analytics'),
  createChannel('ch-092', 'Data Science', 'Data Science', 'Socratica', 'Data science concepts'),
  createChannel('ch-093', 'Data Science', 'Data Analyst', 'Alex The Analyst', 'Data analyst career roadmap'),
  createChannel('ch-094', 'Data Science', 'Data Analyst', 'Luke Barousse', 'Analyst SQL/Python practice'),
  createChannel('ch-095', 'Data Science', 'Projects', 'Ken Jee', 'Data science projects'),
  createChannel('ch-096', 'Tools', 'Vim', 'ThePrimeagen', 'Vim and terminal productivity'),
  createChannel('ch-097', 'Tools', 'VS Code', 'Visual Studio Code', 'VS Code tips and updates'),
  createChannel('ch-098', 'Tools', 'Jupyter Notebook', 'Corey Schafer', 'Notebook productivity'),
  createChannel('ch-099', 'Special', 'General', 'Fireship', 'Programming in 100 seconds'),
  createChannel('ch-100', 'Special', 'Interviews', 'NeetCode', 'Interview coding prep'),
  createChannel('ch-101', 'Free Education', 'General', 'freeCodeCamp', 'Long-form free courses'),
  createChannel('ch-102', 'Free Education', 'General', 'Simplilearn', 'Certification and learning paths'),
  createChannel('ch-103', 'Free Education', 'General', 'edureka!', 'Tech training'),
  createChannel('ch-104', 'Most Valuable', 'General', 'TechWithTim', 'Practical coding projects'),
  createChannel('ch-105', 'Most Valuable', 'General', 'Programming with Mosh', 'Full developer paths'),
  createChannel('ch-106', 'Most Valuable', 'General', 'Traversy Media', 'Web dev and backend'),
  createChannel('ch-107', 'Most Valuable', 'General', 'BroCodez', 'Language explainers'),
  createChannel('ch-108', 'Most Valuable', 'General', 'thenewboston', 'Classic programming basics'),
  createChannel('ch-109', 'Most Valuable', 'General', 'Telusko', 'Java and interview prep'),
  createChannel('ch-110', 'Most Valuable', 'General', 'Derek Banas', 'Fast language summaries'),
  createChannel('ch-111', 'Most Valuable', 'General', 'CodeWithHarry', 'Beginner to advanced journeys'),
  createChannel('ch-112', 'Most Valuable', 'General', 'MySirG .com', 'Computer science basics'),
  createChannel('ch-113', 'Most Valuable', 'General', 'TechWorld with Nana', 'DevOps career stack'),
  createChannel('ch-114', 'Most Valuable', 'General', 'KodeKloud', 'DevOps labs')
];

const additionalByTechnology: Record<string, string[]> = {
  JavaScript: ['freeCodeCamp.org', 'Fun Fun Function', 'Coding Addict', 'Florin Pop', 'Code with Ania Kubow'],
  TypeScript: ['Matt Pocock', 'Ben Awad', 'Total TypeScript', 'ByteGrad'],
  Python: ['freeCodeCamp.org', 'Tech With Tim', 'Real Python', 'NeuralNine', 'ArjanCodes'],
  C: ['Neso Academy', 'CodeVault', 'C Programming Tutorials'],
  'C++': ['freeCodeCamp.org', 'CppCon', 'CodeBeauty', 'Neso Academy'],
  Java: ['Java Brains', 'Coding with John', 'Programming with Mosh', 'Durga Software Solutions'],
  'Node.js': ['Piyush Garg', 'Hitesh Choudhary', 'freeCodeCamp.org', 'Academind'],
  React: ['PedroTech', 'freeCodeCamp.org', 'Web Dev Simplified', 'Academind', 'Sonny Sangha'],
  'Next.js': ['Code with Antonio', 'Hitesh Choudhary', 'Web Dev Cody', 'JavaScript Mastery'],
  Angular: ['Fireship', 'Codevolution', 'Decoded Frontend'],
  Vue: ['Net Ninja', 'Academind', 'Codevolution'],
  Django: ['Dennis Ivy', 'Very Academy', 'freeCodeCamp.org'],
  Flutter: ['Academind', 'Flutter Mapp', 'Johannes Milke', 'Reso Coder'],
  'React Native': ['notJust.dev', 'Catalin Miron', 'Code with Beto'],
  SQL: ['Kudvenkat', 'Alex The Analyst', 'freeCodeCamp.org'],
  AWS: ['Cloud With Raj', 'Be A Better Dev', 'Stephane Maarek'],
  Azure: ['John Savill', 'Azure Academy', 'Krish Naik'],
  GCP: ['Google Cloud Tech', 'freeCodeCamp.org', 'A Cloud Guru'],
  Docker: ['TechWorld with Nana', 'freeCodeCamp.org', 'Programming with Mosh'],
  Kubernetes: ['KodeKloud', 'DevOps Directive', 'TechWorld with Nana'],
  Linux: ['NetworkChuck', 'DistroTube', 'LearnLinuxTV'],
  Git: ['Fireship', 'freeCodeCamp.org', 'GitKraken'],
  DevOps: ['KodeKloud', 'DevOps Journey', 'Abhishek Veeramalla', 'TechWorld with Nana'],
  DSA: ['NeetCode', 'Back To Back SWE', 'Errichto', 'William Fiset'],
  'Machine Learning': ['Yannic Kilcher', 'Krish Naik', 'CodeEmporium', 'Data School'],
  'Data Science': ['Data Professor', 'CampusX', 'freeCodeCamp.org'],
  'Power BI': ['Enterprise DNA', 'How to Power BI', 'Pragmatic Works']
};

const extraChannels = Object.entries(additionalByTechnology).flatMap(([technology, channels], technologyIndex) =>
  channels.map((name, channelIndex) =>
    createChannel(
      `ch-extra-${technologyIndex + 1}-${channelIndex + 1}`,
      'Extended',
      technology,
      name,
      `${technology} practical tutorials`
    )
  )
);

const dedupeChannels = (channels: LearningChannel[]) => {
  const seen = new Set<string>();
  const deduped: LearningChannel[] = [];

  channels.forEach((channel) => {
    const key = `${channel.technology.toLowerCase()}::${channel.name.toLowerCase()}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    deduped.push(channel);
  });

  return deduped;
};

export const LEARNING_CHANNELS = dedupeChannels([...baseChannels, ...extraChannels]).map((channel, index) => ({
  ...channel,
  id: `yt-${String(index + 1).padStart(3, '0')}`
}));

export const CODING_PLATFORMS: CodingPlatform[] = [
  {
    id: 'platform-01',
    name: 'LeetCode',
    description: 'Top coding interview preparation platform with company-tagged questions.',
    bestFor: 'Interviews and algorithm speed',
    url: 'https://leetcode.com/'
  },
  {
    id: 'platform-02',
    name: 'GeeksforGeeks',
    description: 'Large collection of DSA, CS core subjects, and interview content.',
    bestFor: 'CS fundamentals and DSA concepts',
    url: 'https://www.geeksforgeeks.org/'
  },
  {
    id: 'platform-03',
    name: 'CodeChef',
    description: 'Competitive programming contests with beginner-friendly divisions.',
    bestFor: 'Contest experience and speed coding',
    url: 'https://www.codechef.com/'
  },
  {
    id: 'platform-04',
    name: 'Coding Ninjas',
    description: 'Structured interview prep paths, coding tasks, and learning tracks.',
    bestFor: 'Structured preparation',
    url: 'https://www.codingninjas.com/codestudio'
  },
  {
    id: 'platform-05',
    name: 'Codeforces',
    description: 'Global competitive programming rounds and rating progression.',
    bestFor: 'Advanced competitive programming',
    url: 'https://codeforces.com/'
  },
  {
    id: 'platform-06',
    name: 'CSES',
    description: 'Well-organized problem sets by topic and difficulty.',
    bestFor: 'Topic-wise algorithm mastery',
    url: 'https://cses.fi/problemset/'
  },
  {
    id: 'platform-07',
    name: 'HackerRank',
    description: 'Practice tracks for languages, SQL, and interview preparation.',
    bestFor: 'Language + SQL drills',
    url: 'https://www.hackerrank.com/'
  },
  {
    id: 'platform-08',
    name: 'AtCoder',
    description: 'Japanese competitive programming contests with strong pedagogy.',
    bestFor: 'Math-heavy and clean contest practice',
    url: 'https://atcoder.jp/'
  }
];
