import { Model, Types } from 'mongoose'

// Define the shape of the Blog document
export type TBlog = {
  title: string
  content: string
  author: Types.ObjectId
  isPublished: boolean
}

// Define the Blog model interface, extending Mongoose's Model type
export interface BlogModel extends Model<TBlog> {
  isBlogExistsFindById(id: string): Promise<TBlog>
  isBlogIsPrivate(id: string, author: Types.ObjectId): Promise<boolean>
}
