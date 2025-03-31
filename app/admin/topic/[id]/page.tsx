import TopicForm from './TopicForm'

export default async function Page({ params }: { params: any }) {
  const resolvedParams = params instanceof Promise ? await params : params
  const id = resolvedParams.id
  
  return <TopicForm id={id} />
} 