export interface Video {
  id: string
  title: string
  description: string
  duration: number // in seconds
  url: string
  type: "mp4" | "youtube"
  thumbnail?: string
  resources?: {
    pdf?: {
      url: string
      title: string
    }
    exam?: {
      id: string
      title: string
      questions: {
        id: number
        question: string
        options: string[]
        correctAnswer: number
      }[]
      timeLimit: number
    }
  }
  metadata?: {
    questionCount?: number
    minutesRequired?: number
  }
}

export interface CourseSection {
  id: string
  title: string
  videos: Video[]
}

export const courseSections: CourseSection[] = [
  {
    id: "week-1-4",
    title: "Week 1-4",
    videos: [
      {
        id: "intro",
        title: "Introduction",
        description: "Advanced story telling techniques for writers: Personas, Characters & Plots",
        duration: 600, // 10 minutes
        url: "/qu2.mp4",
        type: "mp4",
        thumbnail: "https://cdn.pixabay.com/photo/2016/03/27/18/31/book-1283468_1280.jpg",
        metadata: {
          minutesRequired: 10,
        },
      },
      {
        id: "course-overview-1",
        title: "Course Overview",
        description: "Overview of the course structure and what you will learn",
        duration: 600, // 10 minutes
        url: "/qu1.mp4",
        type: "mp4",
        thumbnail: "https://cdn.pixabay.com/photo/2016/03/27/18/31/book-1283468_1280.jpg",
        metadata: {
          questionCount: 0,
          minutesRequired: 10,
        },
      },
      {
        id: "exercise-1",
        title: "Course Exercise / Reference Files",
        description: "Practice exercises and reference materials",
        duration: 900, // 15 minutes
        url: "/qu2.mp4",
        type: "mp4",
        thumbnail: "https://cdn.pixabay.com/photo/2016/03/27/18/31/book-1283468_1280.jpg",
        resources: {
          pdf: {
            url: "/quran.pdf",
            title: "Course Exercise / Reference Files - Resources",
          },
        },
      },
      {
        id: "code-editor",
        title: "Code Editor Installation (Optional if you have one)",
        description: "Setting up your development environment",
        duration: 720, // 12 minutes
        url: "/qu1.mp4",
        type: "mp4",
        thumbnail: "https://cdn.pixabay.com/photo/2016/03/27/18/31/book-1283468_1280.jpg",
      },
      {
        id: "embedding",
        title: "Embedding PHP in HTML",
        description: "Learn how to embed PHP code in HTML files",
        duration: 840, // 14 minutes
        url: "youtube.com/watch?v=DvBnNa85-Mc",
        type: "youtube",
        thumbnail: "https://cdn.pixabay.com/photo/2016/03/27/18/31/book-1283468_1280.jpg",
      },
    ],
  },
  {
    id: "week-5-8",
    title: "Week 5-8",
    videos: [
      {
        id: "defining-functions",
        title: "Defining Functions",
        description: "Advanced story telling techniques for writers: Personas, Characters & Plots",
        duration: 780, // 13 minutes
        url: "/qu1.mp4",
        type: "mp4",
        thumbnail: "https://cdn.pixabay.com/photo/2016/03/27/18/31/book-1283468_1280.jpg",
        resources: {
          pdf: {
            url: "/quran.pdf",
            title: "Functions Reference Guide",
          },
        },
      },
      {
        id: "function-parameters",
        title: "Function Parameters",
        description: "Understanding how to use function parameters effectively",
        duration: 660, // 11 minutes
        url: "/qu2.mp4",
        type: "mp4",
        thumbnail: "https://cdn.pixabay.com/photo/2016/03/27/18/31/book-1283468_1280.jpg",
        resources: {
          exam: {
            id: "function-parameters-quiz",
            title: "Function Parameters Quiz",
            questions: [
              {
                id: 1,
                question: "What is a parameter in a function?",
                options: [
                  "A variable that is declared outside the function",
                  "A variable that is passed to a function",
                  "A return value from a function",
                  "A global variable",
                ],
                correctAnswer: 1,
              },
              {
                id: 2,
                question: "How do you pass a value by reference in PHP?",
                options: [
                  "Use the & symbol before the parameter name",
                  "Use the ref keyword",
                  "All parameters are passed by reference by default",
                  "Use the * symbol before the parameter name",
                ],
                correctAnswer: 0,
              },
            ],
            timeLimit: 300, // 5 minutes
          },
        },
      },
      {
        id: "return-values",
        title: "Return Values From Functions",
        description: "How to return and use values from functions",
        duration: 900, // 15 minutes
        url: "/qu3.mp4",
        type: "mp4",
        thumbnail: "https://cdn.pixabay.com/photo/2016/03/27/18/31/book-1283468_1280.jpg",
        metadata: {
          questionCount: 2,
          minutesRequired: 15,
        },
        resources: {
          exam: {
            id: "return-values-quiz",
            title: "Return Values Quiz",
            questions: [
              {
                id: 1,
                question: "What keyword is used to return a value from a function?",
                options: ["return", "output", "yield", "send"],
                correctAnswer: 0,
              },
              {
                id: 2,
                question: "What happens if you don't use a return statement in a function?",
                options: [
                  "The function returns null",
                  "The function returns undefined",
                  "The function returns void",
                  "The function returns false",
                ],
                correctAnswer: 0,
              },
              {
                id: 3,
                question: "Can a function return multiple values?",
                options: [
                  "No, a function can only return one value",
                  "Yes, by returning an array or object",
                  "Yes, by using the multiple keyword",
                  "Yes, by using the yield keyword",
                ],
                correctAnswer: 1,
              },
            ],
            timeLimit: 450, // 7.5 minutes
          },
        },
      },
      {
        id: "global-variables",
        title: "Global Variable and Scope",
        description: "Understanding variable scope in programming",
        duration: 720, // 12 minutes
        url: "/qu1.mp4",
        type: "mp4",
        thumbnail: "https://cdn.pixabay.com/photo/2016/03/27/18/31/book-1283468_1280.jpg",
      },
      {
        id: "constants",
        title: "Constants",
        description: "Working with constant values in your code",
        duration: 540, // 9 minutes
        url: "/qu2.mp4",
        type: "mp4",
        thumbnail: "https://cdn.pixabay.com/photo/2016/03/27/18/31/book-1283468_1280.jpg",
      },
    ],
  },
]
