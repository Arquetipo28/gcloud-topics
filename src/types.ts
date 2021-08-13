interface Topic {
  name: string
  regions?: string[]
  schema?: {
    id: string
    project?: string
    encoding?: string
  }
}