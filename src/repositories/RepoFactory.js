import CourseRequestRepo    from "@/repositories/CourseRequestRepo"
import FolderRequestRepo    from "@/repositories/FolderRequestRepo"
import CourseRepo           from "@/repositories/CoursesRepo"
import FolderRepo           from "@/repositories/FoldersRepo"
import FileRepo             from "@/repositories/FileRepo"
import AuthRepo             from "@/repositories/AuthRepo"
import UserRepo             from "@/repositories/UserRepo"

const repositories = {
    courseRequests: CourseRequestRepo, 
    folderRequests: FolderRequestRepo, 
    courses: CourseRepo,
    folders: FolderRepo,
    files: FileRepo,   
    auth: AuthRepo, 
    users: UserRepo, 
}

export const RepoFactory = {
    get: name => repositories[name]
}