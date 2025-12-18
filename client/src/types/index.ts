export interface User {
    _id: string;
    name: string;
    email: string;
    token?: string;
    createdEvents?: string[];
    joinedEvents?: string[];
}

export interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: number;
    imageUrl: string;
    creator: User | string;
    attendees: string[];
}
