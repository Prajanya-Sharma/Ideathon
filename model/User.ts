import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from 'uuid'

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isStudent:boolean
    isTeacher: boolean;
    isAdmin: boolean;
    reqTeacher: boolean;
    reqAdmin: boolean;
    sid_verification:boolean;
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@pec\.edu\.in$/, 'please use college email id'],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, 'Verification Code is required'],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Expiry is required'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isStudent: {
        type: Boolean,
        default: false,
    },
    isTeacher: {
        type: Boolean,
        default: false, // Default to false, only true if admin updates the field
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    reqTeacher: {
        type: Boolean,
        default: false,
    },
    reqAdmin: {
        type: Boolean,
        default: false,
    },
    sid_verification:{
        type:Boolean,
        default:false,
    }
});

UserSchema.post("save", async function (this: User) {
    if (this.isStudent) {
        
        try {
            const existingStudent = await StudentModel.findOne({ user_id: this._id });
            if (existingStudent) {
                console.log(`Student with user_id ${this._id} already exists.`);
                return; 
            }
            const studentId = `S-${uuidv4()}`;
            const newStudent = new StudentModel({
                user_id: this._id,
                email:this.email,
                name: this.username,
                student_id: studentId,
                semester: 1,
                branch: "Unknown",
                sid_verification: this.sid_verification,
                enrolledSubjectId: [],
                teacherSubjectMap: {},
                attendanceSubjectMap: {},
                clubsPartOf: [],
                interestedEvents: [],
                clubsHeadOf: [],
                profile: "",
                friends: []
            });

            await newStudent.save();
        } catch (error) {
            console.error("Error creating student:", error);
        }
    }

    if (this.reqTeacher) {
        try {
            const alreadyRequested = await RequestModel.findOne({user_id: this._id})

            if (alreadyRequested) {
                console.log("already requested for teacher")
                return;
            }

            const request = new RequestModel({
                user_id: this._id,
                for_teacher: true,
                for_admin: false,
            })

            await request.save();
        } catch (error) {
            console.error("Error making request for teacher:", error);
        }
    }

    if (this.reqAdmin) {
        try {
            const alreadyRequested = await RequestModel.findOne({user_id: this._id})

            if (alreadyRequested) {
                console.log("already requested for admin")
                return;
            }

            const request = new RequestModel({
                user_id: this._id,
                for_teacher: false,
                for_admin: true,
            })

            await request.save();
        } catch (error) {
            console.error("Error making request for admin:", error);
        }
    }
});


export interface Student extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    email?:string;
    name?:string;
    avatar?: string;
    student_id?: string;
    semester: number;
    phoneNumber?: number;
    branch: string;
    sid_verification: boolean;
    enrolledSubjectId: string[];
    subjectTeacherMap: Record<string, mongoose.Schema.Types.ObjectId>;
    attendanceSubjectMap: Record<number, string>;
    clubsPartOf: mongoose.Schema.Types.ObjectId[];
    interestedEvents: mongoose.Schema.Types.ObjectId[];
    clubsHeadOf: mongoose.Schema.Types.ObjectId[];
    profile?: string;
    friends: mongoose.Schema.Types.ObjectId[];
}


const StudentSchema: Schema<Student> = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    email:{
        type:String,required:false
    },
    name: { type: String, required: true },
    avatar: { type: String },
    student_id: { type: String, unique: true },
    semester: { type: Number, required: true },
    phoneNumber: { type: Number },
    branch: { type: String, required: true },
    sid_verification: { type: Boolean, default: false },
    enrolledSubjectId: [{ type: String }],
    subjectTeacherMap: {
        type: Map,
        of: Schema.Types.ObjectId,
    },
    attendanceSubjectMap: {
        type: Map,
        of: String,
    },
    clubsPartOf: [{ type: Schema.Types.ObjectId, ref: "Club" }],
    interestedEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    clubsHeadOf: [{ type: Schema.Types.ObjectId, ref: "Club" }],
    profile: {
        type: String,
        required: false,
    },
    friends: [{ type: Schema.Types.ObjectId, ref: "Student" }],
});


export interface Teacher extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    teacher_id: string;
    subjectTeaching: {
        subject_code: string;
        subject_name: string;
    }[];
}

const TeacherSchema: Schema<Teacher> = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    teacher_id: { type: String, required: true, unique: true },
    subjectTeaching: [
        {
            subject_name: { type: String, required: true },
            subject_code: { type: String, required: true },
        },
    ]
});

export interface Club extends Document {
    clubName: string;
    clubLogo?: string;
    clubIdSecs: string[];
    clubMembers: string[];
    clubEvents: mongoose.Schema.Types.ObjectId[];
}

const ClubSchema: Schema<Club> = new Schema({
    clubName: { type: String, required: true, unique: true },
    clubLogo: { type: String },
    clubIdSecs: [{ type: String, ref: "Student" }],
    clubMembers: [{ type: String, ref: "Student" }],
    clubEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
});
export interface Event extends Document {
    eventHostedBy: mongoose.Schema.Types.ObjectId;
    eventCoordinates: {
        lat: number;
        lng: number;
    };
    eventVenue: string;
    eventTime: Date;
    interestedMembersArr: mongoose.Schema.Types.ObjectId[];
    eventAttachments?: string[];
    poster: string;
    heading: string;
    description: string;
    tags: string[];
}

const EventSchema: Schema<Event> = new Schema({
    eventHostedBy: {
        type: Schema.Types.ObjectId,
        ref: "Club",
    },
    eventCoordinates: {
        lat: { type: Number },
        lng: { type: Number },
    },
    eventVenue: { type: String, required: true },
    eventTime: { type: Date, required: true },
    interestedMembersArr: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    eventAttachments: [{ type: String }],
    poster: { type: String, required: true },
    heading: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
});



export interface Subject extends Document {
  subjectId: string;
  allMarks: {
    examType: string;
    studentMarks: {
      student_id: string;
      marks: number;
    }[];
  }[];
}

const SubjectSchema: Schema<Subject> = new Schema({
    subjectId: { type: String, required: true },
    allMarks: {
      type: [
        {
          examType: { type: String, required: true },
          studentMarks: [
            {
              student_id: { type: String, required: true },
              marks: { type: Number, required: true },
            },
          ],
        },
      ],
      default: [],
    },
  });



export interface Attendance extends Document {
    subjectId: string;
    teacherId: mongoose.Schema.Types.ObjectId;
    totalClasses: number;
    dateStudentMap: {
        date: string;
        studentsPresent: string[];
        lectureCount: number;
    }[];
    groupName: string;
    students: string[];
}

const AttendanceSchema: Schema<Attendance> = new Schema({
    subjectId: { type: String, required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true }, // teacher ki user id
    totalClasses: { type: Number, required: true },
    dateStudentMap: [{
        date: { type: String, required: true },
        studentsPresent: [{ type: String }],
        lectureCount: { type: Number, required: true },
    }],
    groupName: { type: String, required: true },
    students: [ { type: String, ref: "Student" }],
});


interface Resource extends Document {
    subjectId: string;
    files: {
        url: string;
        fileName: string;
    }[];
}

const ResourceSchema: Schema<Resource> = new Schema({
    subjectId: { type: String, required: true },
    files: [{
        url: { type: String, required: true },
        fileName: { type: String, required: true },
    }],
})


export interface Request extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    for_teacher: boolean;
    for_admin: boolean;
}

const RequestSchema: Schema<Request> = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: "User" },
    for_teacher: {type: "boolean", default: false},
    for_admin: {type: "boolean", default: false},
})



export interface FriendRequest extends Document {
    from: mongoose.Schema.Types.ObjectId;
    to: mongoose.Schema.Types.ObjectId;
}

const FriendRequestSchema: Schema<FriendRequest> = new Schema({
    from: {type: Schema.Types.ObjectId, ref: "Student" },
    to: {type: Schema.Types.ObjectId, ref: "Student" },
})


export interface Issue extends Document {
    title: string;
    description: string;
    attachments: string[];
    author: mongoose.Schema.Types.ObjectId;
    votes: mongoose.Schema.Types.ObjectId[];
}

const IssueSchema: Schema<Issue> = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    attachments: [{ type: String }],
    author: { type: Schema.Types.ObjectId, ref: "Student" }, //userId
    votes: [{ type: Schema.Types.ObjectId, ref: "Student" }], //userId
}, {timestamps: true})


export interface StudyRequest extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    subjectId: string;
    subjectName: string;
    description: string;
    attachments: string[];
    price: number;
    applied: mongoose.Schema.Types.ObjectId[]; // id of people who applied
    accepted: boolean;
}

const StudyRequestSchema: Schema<StudyRequest> = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    subjectId: { type: String, required: true },
    subjectName: { type: String, required: true },
    description: { type: String, required: true },
    attachments: [{ type: String }],
    price: { type: Number, required: true },
    applied: [{ type: Schema.Types.ObjectId }],
    accepted: { type: Boolean, default: false,  required: true },
})


export interface RequestToTeach extends Document {
    studyRequestId: mongoose.Schema.Types.ObjectId;
    user_id: mongoose.Schema.Types.ObjectId;
    description: string;
    attachments: string[];
    phoneNumber: number;
}

const RequestToTeachSchema: Schema<RequestToTeach> = new Schema({
    studyRequestId: { type: Schema.Types.ObjectId, ref: "StudyRequest" },
    user_id: { type: Schema.Types.ObjectId, ref: "Student" },
    description: { type: String, required: true },
    attachments: [{ type: String }],
    phoneNumber: { type: Number, required: true },
})


export interface AcceptedStudyRequest extends Document {
    studyRequestId: mongoose.Schema.Types.ObjectId;
    studentId: mongoose.Schema.Types.ObjectId;
    teacherId: mongoose.Schema.Types.ObjectId;
    subjectId: string;
    subjectName: string;
    description: string;
    studentAttachments: string[];
    teacherAttachments: string[];
    teacherPhoneNumber: number;
    studentPhoneNumber: number;
    roomId: string;
}

const AcceptedStudyRequestSchema: Schema<AcceptedStudyRequest> = new Schema({
    studyRequestId: { type: Schema.Types.ObjectId, ref: "StudyRequest", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "Student" },
    teacherId: { type: Schema.Types.ObjectId, ref: "Student" },
    subjectId: { type: String, required: true },
    subjectName: { type: String, required: true },
    description: { type: String, required: true },
    studentAttachments: [ { type: String } ],
    teacherAttachments: [ { type: String } ],
    teacherPhoneNumber: { type: Number, required: true },
    studentPhoneNumber: { type: Number, required: true },
    roomId: { type: String, required: true },
})

export interface Announcement extends Document {
    announcementText: string;
    department: string;
}

const AnnouncementModelSchema: Schema<Announcement> = new Schema({
    announcementText: { type: String, required: true },
    department: { type: String, required: true }
}, {timestamps: true})

interface Eventai {
    title: string;
    description: string;
}

interface Markai {
    subject: string;
    marks: string;
}

interface Generalai {
    title: string;
    description: string;
}

interface Info {
    events?: Eventai[];
    marks?: Markai[];
    general?: Generalai[];
}

export interface AiChatBot extends Document {
    Info: Info;
}

const EventSchemaAI = new Schema<Eventai>({
    title: { type: String, required: true },
    description: { type: String, required: true },
});

const MarkSchemaAI = new Schema<Markai>({
    subject: { type: String, required: true },
    marks: { type: String, required: true },
});

const GeneralSchemaAI = new Schema<Generalai>({
    title: { type: String, required: true },
    description: { type: String, required: true },
});

const AiChatBotSchema: Schema<AiChatBot> = new Schema({
    Info: {
        events: [EventSchemaAI],
        marks: [MarkSchemaAI],
        general: [GeneralSchemaAI],
    }},
    { collection: 'aiChatBot' }
);

export interface TeacherAnnouncement extends Document {
    teacherId: mongoose.Schema.Types.ObjectId;
    announcementText: string;
    subjectCode: string;
}

const TeacherAnnouncementSchema: Schema<TeacherAnnouncement> = new Schema({
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    announcementText: { type: String, required: true },
    subjectCode: { type: String, required: true }
}, {timestamps: true});

const AnnouncementModel: Model<Announcement> = 
    mongoose.models.Announcement || mongoose.model<Announcement>("Announcement", AnnouncementModelSchema)

const TeacherAnnouncementModel: Model<TeacherAnnouncement> =
    mongoose.models.TeacherAnnouncement || mongoose.model<TeacherAnnouncement>("TeacherAnnouncement", TeacherAnnouncementSchema)
    
const aiChatBotModel: Model<AiChatBot> =
    mongoose.models.aiChatBot || mongoose.model<AiChatBot>("aiChatBot", AiChatBotSchema);

const UserModel: Model<User> =
    mongoose.models.User || mongoose.model<User>("User", UserSchema);

const StudentModel: Model<Student> =
    mongoose.models.Student || mongoose.model<Student>("Student", StudentSchema);

const TeacherModel: Model<Teacher> =
    mongoose.models.Teacher || mongoose.model<Teacher>("Teacher", TeacherSchema);

const ClubModel: Model<Club> =
    mongoose.models.Club|| mongoose.model<Club>("Club", ClubSchema);

const EventModel: Model<Event> =
    mongoose.models.Event || mongoose.model<Event>("Event", EventSchema);

const SubjectModel : Model<Subject>=
    mongoose.models.Subject || mongoose.model<Subject>("Subject",SubjectSchema);

const AttendanceModel: Model<Attendance> =
    mongoose.models.Attendance || mongoose.model<Attendance>("Attendance", AttendanceSchema);

const RequestModel: Model<Request> =
    mongoose.models.Request || mongoose.model<Request>("Request", RequestSchema);

const FriendRequestModel: Model<FriendRequest> =
    mongoose.models.FriendRequest || mongoose.model<FriendRequest>("FriendRequest", FriendRequestSchema);

const ResourceModel: Model<Resource> =
    mongoose.models.Resource || mongoose.model<Resource>("Resource", ResourceSchema);

const IssueModel: Model<Issue> =
    mongoose.models.Issue || mongoose.model<Issue>("Issue", IssueSchema);

const StudyRequestModel: Model<StudyRequest> =
    mongoose.models.StudyRequest || mongoose.model<StudyRequest>("StudyRequest", StudyRequestSchema);

const RequestToTeachModel: Model<RequestToTeach> =
    mongoose.models.RequestToTeach || mongoose.model<RequestToTeach>("RequestToTeach", RequestToTeachSchema);

const AcceptedStudyRequestModel: Model<AcceptedStudyRequest> =
    mongoose.models.AcceptedStudyRequest || mongoose.model<AcceptedStudyRequest>("AcceptedStudyRequest", AcceptedStudyRequestSchema);

export {
    TeacherAnnouncementModel,
    UserModel,
    StudentModel,
    TeacherModel,
    ClubModel,
    EventModel,
    SubjectModel,
    AttendanceModel,
    RequestModel,
    FriendRequestModel,
    aiChatBotModel,
    ResourceModel,
    IssueModel,
    StudyRequestModel,
    RequestToTeachModel,
    AcceptedStudyRequestModel,
    AnnouncementModel,
};
