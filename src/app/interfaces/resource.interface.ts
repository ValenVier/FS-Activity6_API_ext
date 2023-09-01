import { User } from "./user.interface";

export interface Resource {
    "page": number;
    "per_page": number;
    "total": number;
    "total_pages": number;
    "results": User[];
}
