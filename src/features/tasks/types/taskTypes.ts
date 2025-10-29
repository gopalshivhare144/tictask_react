export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Task {
  id: number
  title: string
  description: string
  taskDate: string
  completed: boolean
  priority: TaskPriority
  createdAt: string
  updatedAt: string
}

export interface TaskCreateRequest {
  title: string
  description: string
  priority: TaskPriority
  completed: boolean
  taskDate: string
}

export interface TaskUpdateRequest {
  title: string
  description: string
  priority: TaskPriority
  completed: boolean
  taskDate: string
}

export interface TaskResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    title: string;
    description: string;
    taskDate: string;
    completed: boolean;
    priority: TaskPriority;
    createdAt: string;
    updatedAt: string;
  }
}

export interface TaskListResponse {
  success: boolean
  message: string
  data: {
    content: Task[]
    page: number
    size: number
    totalElements: number
    totalPages: number
    last: boolean
  }
}

export interface TaskDeleteResponse {
  success: boolean
  message: string
}

export interface TasksByDateResponse {
  success: boolean
  message: string
  data: Task[]
}
