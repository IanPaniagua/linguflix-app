import Header from '@/components/Header'
import VideoRow from '@/components/VideoRow'
import { Button } from '@/components/ui/button'

const sampleVideos = {
  basic: [
    {
      id: '1',
      title: 'Ordering Coffee',
      description: 'Learn how to order your favorite coffee in German with confidence.',
      thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Basic',
      duration: '5:30'
    },
    {
      id: '2',
      title: 'Public Transportation',
      description: 'Master the basics of using public transportation in German-speaking countries.',
      thumbnail: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Basic',
      duration: '6:45'
    },
    {
      id: '3',
      title: 'Grocery Shopping',
      description: 'Essential vocabulary for shopping at German supermarkets.',
      thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Basic',
      duration: '7:15'
    },
    {
      id: '4',
      title: 'Meeting Friends',
      description: 'Basic conversations for social situations with friends.',
      thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Basic',
      duration: '6:20'
    },
    {
      id: '5',
      title: 'Weather Talk',
      description: 'Learn to discuss weather in everyday conversations.',
      thumbnail: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Basic',
      duration: '5:45'
    },
    {
      id: '6',
      title: 'Restaurant Basics',
      description: 'Essential phrases for dining out in German restaurants.',
      thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Basic',
      duration: '8:00'
    },
    {
      id: '7',
      title: 'Asking Directions',
      description: 'Learn how to ask for and understand directions in German.',
      thumbnail: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Basic',
      duration: '6:30'
    },
    {
      id: '8',
      title: 'Hotel Check-in',
      description: 'Common phrases for checking into a hotel.',
      thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Basic',
      duration: '5:50'
    }
  ],
  intermediate: [
    {
      id: '9',
      title: 'Making Appointments',
      description: 'Learn how to schedule and manage appointments in German.',
      thumbnail: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Intermediate',
      duration: '8:15'
    },
    {
      id: '10',
      title: 'Shopping Conversations',
      description: 'Practice common shopping scenarios and vocabulary.',
      thumbnail: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Intermediate',
      duration: '7:20'
    },
    {
      id: '11',
      title: 'Doctor Visit',
      description: 'Medical vocabulary and common phrases for doctor appointments.',
      thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Intermediate',
      duration: '9:30'
    },
    {
      id: '12',
      title: 'Job Interview',
      description: 'Prepare for job interviews in German.',
      thumbnail: 'https://images.unsplash.com/photo-1560264280-88b68371db39?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Intermediate',
      duration: '10:15'
    },
    {
      id: '13',
      title: 'Apartment Hunting',
      description: 'Vocabulary and phrases for finding an apartment.',
      thumbnail: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Intermediate',
      duration: '8:45'
    },
    {
      id: '14',
      title: 'Phone Conversations',
      description: 'Master telephone conversations in German.',
      thumbnail: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Intermediate',
      duration: '7:50'
    },
    {
      id: '15',
      title: 'Banking Services',
      description: 'Learn about banking and financial services in German.',
      thumbnail: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Intermediate',
      duration: '8:30'
    },
    {
      id: '16',
      title: 'Social Events',
      description: 'Vocabulary for social gatherings and events.',
      thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Intermediate',
      duration: '7:45'
    }
  ],
  advanced: [
    {
      id: '17',
      title: 'Business Negotiations',
      description: 'Master advanced business German for professional settings.',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Advanced',
      duration: '12:00'
    },
    {
      id: '18',
      title: 'Cultural Discussions',
      description: 'Engage in deep conversations about German culture and society.',
      thumbnail: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Advanced',
      duration: '10:30'
    },
    {
      id: '19',
      title: 'Legal Terminology',
      description: 'Understanding legal terms and documents in German.',
      thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Advanced',
      duration: '11:45'
    },
    {
      id: '20',
      title: 'Academic Presentations',
      description: 'Learn to give academic presentations in German.',
      thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Advanced',
      duration: '13:20'
    },
    {
      id: '21',
      title: 'Political Debates',
      description: 'Advanced vocabulary for political discussions.',
      thumbnail: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Advanced',
      duration: '14:00'
    },
    {
      id: '22',
      title: 'Scientific Research',
      description: 'Technical and scientific terminology in German.',
      thumbnail: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Advanced',
      duration: '12:30'
    },
    {
      id: '23',
      title: 'Literature Analysis',
      description: 'Discussing German literature and poetry.',
      thumbnail: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Advanced',
      duration: '11:15'
    },
    {
      id: '24',
      title: 'Environmental Issues',
      description: 'Advanced discussions about environmental topics.',
      thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=384&h=216&q=80',
      level: 'Advanced',
      duration: '13:45'
    }
  ]
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        </div>
        
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Learn German through
              <span className="text-primary"> Immersive Videos</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Master German naturally with our curated collection of real-life scenario videos,
              perfect for every skill level.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Learning
            </Button>
          </div>
        </div>
      </section>

      {/* Video Sections */}
      <main className="flex-1 w-full">
        <div className="space-y-2">
          <VideoRow title="Basic Level - Start Your Journey" videos={sampleVideos.basic} />
          <VideoRow title="Intermediate Level - Build Confidence" videos={sampleVideos.intermediate} />
          <VideoRow title="Advanced Level - Master German" videos={sampleVideos.advanced} />
        </div>
      </main>
    </div>
  )
}
