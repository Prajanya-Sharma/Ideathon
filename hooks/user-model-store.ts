import { create } from "zustand";
import mongoose from "mongoose";
import {string} from "zod";

interface Event {
    _id: mongoose.Types.ObjectId,
    poster: string,
    heading: string,
    eventHostedBy: string,
    description: string,
    tags: string[],
    eventTime: Date,
    eventVenue: string,
    isInterested: boolean,
}

interface SingleEvent {
    _id: mongoose.Types.ObjectId;
    poster: string;
    heading: string;
    eventHostedBy: string;
    description: string;
    tags: string[];
    eventTime: Date;
    eventVenue: string;
    isInterested: boolean;
    interestedMembersArr: {
        _id: mongoose.Types.ObjectId;
        name: string;
        student_id: string;
        profile: string
    } [];
    eventAttachments: string[]
}

interface SingleClub {
    _id: mongoose.Types.ObjectId;
    clubName: string;
    clubLogo: string;
    clubIdSecs: {
        profile: string;
        user_id:string;
        student_id: string;
        name: string;
    }[];
    clubMembers: {
        profile: string;
        student_id: string;
        name: string;
    }[];
    clubEvents: {
        _id: mongoose.Types.ObjectId;
        heading: string;
        isInterested: boolean;
        eventTime: Date;
        eventVenue: string
    }[];
}

interface Club {
    _id: mongoose.Types.ObjectId;
    clubName: string;
    clubLogo: string;
}

interface EditClub {
    clubName: string;
    clubLogo: string;
    clubIdSecs: string[];
    clubMembers: string[];
    clubEvents: mongoose.Types.ObjectId[];
}

interface Profile {
    _id:mongoose.Types.ObjectId;
    name: string;
    student_id: string;
    semester: number;
    branch: string;
    profile: string;
    subjectMarks: {
        subjectId: string;
        allMarks: {
            examType: string;
            marks: number;
        }[];
    }[],
    clubsPartOf: {
        _id: mongoose.Types.ObjectId;
        clubName: string;
        clubLogo: string;
    }[]
}

interface Friends {
    _id: mongoose.Types.ObjectId;
    friends: {
        _id: mongoose.Types.ObjectId;
        name: string;
        student_id: string;
        profile: string;
    } [];
}

interface AddFriends {
    _id: mongoose.Types.ObjectId;
    name: string;
    student_id: string;
    profile: string;
}

interface RequestsSent {
    _id: mongoose.Types.ObjectId;
    from: mongoose.Types.ObjectId;
    to: {
        _id: mongoose.Types.ObjectId;
        name: string;
        student_id: string;
        profile: string;
    }
}

interface CurrentRequests {
    _id: mongoose.Types.ObjectId;
    to: mongoose.Types.ObjectId;
    from: {
        _id: mongoose.Types.ObjectId;
        name: string;
        student_id: string;
        profile: string;
    }
}

interface Requests {
    _id: mongoose.Types.ObjectId;
    user: {
        _id: mongoose.Types.ObjectId;
        email: string;
        username: string;
    }
}

interface Teacher {
    _id: mongoose.Types.ObjectId;
    user: {
        email: string;
        username: string;
    }
    teacher_id: string;
    subjectTeaching: {
        subject_code: string;
        subject_name: string;
    }[];
}

interface Subjects {
    _id: mongoose.Types.ObjectId;
    subjectTeaching: {
        subject_code: string;
        subject_name: string;
    }[];
}

interface Group {
    _id: mongoose.Types.ObjectId;
    groupName: string;
}

interface Student {
    name: string;
    student_id: string;
}

interface Resource {
    url: string;
    fileName: string;
}

interface ModelStore {
    resources: Resource[]|[];
    students: Student[]|[];
    groups: Group[]|[];
    subjects: Subjects|null;
    teachers: Teacher[]|[];
    requests: Requests[]|[];
    currentRequests: CurrentRequests[]|[];
    requestsSent: RequestsSent[]|[];
    addFriends: AddFriends[]|[];
    friends: Friends|null;
    editClub: EditClub|null;
    singleClub: SingleClub|null;
    allClubs: Club[];
    profile: Profile|null;
    allEvents: Event[];
    singleEvent:SingleEvent|null;
    isLoading: boolean;
    setResources: (resources: Resource[]) => void;
    setStudents: (students: Student[]) => void;
    setGroups: (groups: Group[]) => void;
    setSubjects: (subjects: Subjects) => void;
    setTeachers: (teachers: Teacher[]) => void;
    setRequests: (requests: Requests[]) => void;
    setCurrentRequests: (currentRequests: CurrentRequests[]) => void;
    setRequestsSent: (requestsSent: RequestsSent[]) => void;
    setAddFriends: (addFriends: AddFriends[]) => void;
    setFriends: (friends: Friends) => void;
    setProfile:(profile:Profile) => void;
    setSingleClub:(club:SingleClub) => void;
    setAllClub:(clubs:Club[])=>void;
    setEditClub:(club:EditClub) => void;
    setSingleEvent:(event:SingleEvent)=>void;
    setAllEvents: (events: Event[]) => void;
    setLoading: (loading: boolean) => void;
}

export const useModel = create<ModelStore>((set) => ({
    resources: [],
    students: [],
    groups: [],
    subjects: null,
    teachers: [],
    requests: [],
    currentRequests: [],
    requestsSent: [],
    addFriends: [],
    friends: null,
    allEvents: [],
    singleEvent:null,
    singleClub:null,
    allClubs: [],
    editClub:null,
    profile: null,
    isLoading: false,
    setResources: ((resources) => set({resources: resources})),
    setStudents: ((students) => set({students: students})),
    setGroups: ((groups) => set({groups: groups})),
    setSubjects: ((subjects) => set({ subjects: subjects })),
    setTeachers: ((teachers) => set({ teachers: teachers })),
    setRequests: ((requests) => set({ requests: requests })),
    setCurrentRequests: ((currentRequests) => set({currentRequests: currentRequests})),
    setRequestsSent: ((requestsSent) => set({requestsSent: requestsSent})),
    setAddFriends: ((addFriends) => set({addFriends: addFriends})),
    setFriends: ((friends) => set({friends: friends})),
    setProfile :((profile)=>set({profile:profile})),
    setSingleClub:((club)=> set({singleClub:club})),
    setAllClub:((clubs)=> set({allClubs:clubs})),
    setEditClub:((club)=> set({editClub:club})),
    setSingleEvent:((event)=>set({singleEvent:event})),
    setAllEvents: (events) => set({ allEvents: events }),
    setLoading: (loading) => set({ isLoading: loading }),
}));

