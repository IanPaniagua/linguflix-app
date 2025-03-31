import TopicForm from './TopicForm'

export default function Page({ params }: { params: { id: string } }) {
  return <TopicForm id={params.id} />
} 