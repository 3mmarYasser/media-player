export interface Comment {
  id: number
  name: string
  date: string
  content: string
  avatar?: string
}

export const courseComments: Comment[] = [
  {
    id: 1,
    name: "Ahmed Hassan",
    date: "Oct 10, 2023",
    content: 
      "This course has been incredibly helpful for understanding SEO fundamentals. The instructor explains complex concepts in a way that's easy to grasp, and the practical examples made it easy to apply to my own website.",
    avatar: "https://ui-avatars.com/api/?name=Ahmed+Hassan&background=0D8ABC&color=fff",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    date: "Oct 15, 2023",
    content:
      "I've taken several SEO courses before, but this one stands out. The section on keyword research was particularly valuable, and I've already seen my site's rankings improve after implementing the techniques taught here.",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=E91E63&color=fff",
  },
  {
    id: 3,
    name: "Michael Chen",
    date: "Nov 2, 2023",
    content:
      "Great course overall. The technical SEO section was exactly what I needed. I would have appreciated more content on local SEO strategies, but that's a minor critique for an otherwise excellent learning experience.",
    avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=4CAF50&color=fff",
  },
  {
    id: 4,
    name: "Fatima Al-Zahra",
    date: "Nov 18, 2023",
    content:
      "As someone who runs a small business, this course was perfect for me. The instructor breaks down complex SEO concepts into actionable steps. I especially enjoyed the section on content optimization strategies.",
    avatar: "https://ui-avatars.com/api/?name=Fatima+Al-Zahra&background=9C27B0&color=fff",
  },
  {
    id: 5,
    name: "David Wilson",
    date: "Dec 5, 2023",
    content:
      "This course provided a solid foundation in SEO. The practical exercises after each section really helped reinforce the concepts. Would definitely recommend to anyone looking to improve their website's visibility.",
    avatar: "https://ui-avatars.com/api/?name=David+Wilson&background=FF9800&color=fff",
  }
] 