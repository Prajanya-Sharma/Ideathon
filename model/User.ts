import mongoose, { Schema, Document, Model } from "mongoose";

type MarksStudentMap = {
    midsem: Record<string, number>;
    endsem: Record<string, number>;
};

export interface User extends Document {
    email: string;
    password: string;
    is_teacher: boolean;
    is_admin: boolean;
}

const UserSchema: Schema<User> = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    is_teacher: {
        type: Boolean,
        default: false,
    },
    is_admin: {
        type: Boolean,
        default: false,
    },
});

export interface Student extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    name: string;
    student_id: string;
    semester: number;
    phoneNumber?: number;
    branch: string;
    sid_verification: boolean;
    enrolledSubjectId: string[];
    teacherSubjectMap: Record<string, mongoose.Schema.Types.ObjectId>;
    attendanceSubjectMap: Record<number, string>;
    marksStudentMap: MarksStudentMap;
    clubsPartOf: mongoose.Schema.Types.ObjectId[];
    interestedEvents: mongoose.Schema.Types.ObjectId[];
    clubsHeadOf: mongoose.Schema.Types.ObjectId[];
}

const StudentSchema: Schema<Student> = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: { type: String, required: true },
    student_id: { type: String, required: true, unique: true },
    semester: { type: Number, required: true },
    phoneNumber: { type: Number },
    branch: { type: String, required: true },
    sid_verification: { type: Boolean, default: false },
    enrolledSubjectId: [{ type: String }],
    teacherSubjectMap: {
        type: Map,
        of: Schema.Types.ObjectId,
    },
    attendanceSubjectMap: {
        type: Map,
        of: String,
    },
    marksStudentMap: {
        midsem: {
            type: Map,
            of: Number,
        },
        endsem: {
            type: Map,
            of: Number,
        },
    },
    clubsPartOf: [{ type: Schema.Types.ObjectId, ref: "Club" }],
    interestedEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    clubsHeadOf: [{ type: Schema.Types.ObjectId, ref: "Club" }],
});

export interface Teacher extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    teacher_id: string;
    admin_verification: boolean;
    subjectTeaching: string[];
    StudentsMarksMap: Record<string, MarksStudentMap>;
}

const TeacherSchema: Schema<Teacher> = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    teacher_id: { type: String, required: true, unique: true },
    admin_verification: { type: Boolean, default: false },
    subjectTeaching: [{ type: String }],
    StudentsMarksMap: {
        type: Map,
        of: {
            midsem: {
                type: Map,
                of: Number,
            },
            endsem: {
                type: Map,
                of: Number,
            },
        },
    },
});

export interface Club extends Document {
    clubName: string;
    clubIdSecs: mongoose.Schema.Types.ObjectId[];
    clubMembers: mongoose.Schema.Types.ObjectId[];
    clubEvents: mongoose.Schema.Types.ObjectId[];
}

const ClubSchema: Schema<Club> = new Schema({
    clubName: { type: String, required: true, unique: true },
    clubIdSecs: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    clubMembers: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    clubEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
});
export interface Event extends Document {
    eventHostedBy: mongoose.Schema.Types.ObjectId;
    eventVenue: string;
    eventTime: Date;
    interestedMembersArr: mongoose.Schema.Types.ObjectId[];
    eventAttachments?: string[];
    heading: string;
    description: string;
    tags: string[];
}

const EventSchema: Schema<Event> = new Schema({
    eventHostedBy: {
        type: Schema.Types.ObjectId,
        ref:"Club"
    },
    eventVenue: { type: String, required: true },
    eventTime: { type: Date, required: true },
    interestedMembersArr: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    eventAttachments: [{ type: String }],
    heading: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
});

const UserModel: Model<User> =
    mongoose.models.User || mongoose.model<User>("User", UserSchema);

const StudentModel: Model<Student> =
    mongoose.models.Student || mongoose.model<Student>("Student", StudentSchema);

const TeacherModel: Model<Teacher> =
    mongoose.models.Teacher || mongoose.model<Teacher>("Teacher", TeacherSchema);

const ClubModel: Model<Club> =
    mongoose.models.Club || mongoose.model<Club>("Club", ClubSchema);

const EventModel: Model<Event> =
    mongoose.models.Event || mongoose.model<Event>("Event", EventSchema);

export {
    UserModel,
    StudentModel,
    TeacherModel,
    ClubModel,
    EventModel,
};
