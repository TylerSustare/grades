/* eslint-disable @typescript-eslint/interface-name-prefix */
export class AssignmentSubmission {
  email: string;
  files: string[]; // file location in firebase storage
  studentFirstName: string;
  studentLastName: string;
  studentId: string;
  possibleScore: string;
  score: string;
  teacherComment: string;
  studentComment: string;
  constructor(properties: IAssignmentSubmission) {
    // all of these exist because firestore needs vanilla js objects and Object.assign() can't use undefined fields
    this.email = properties.email ?? '';
    this.studentComment = properties.studentComment ?? '';
    this.studentFirstName = properties.studentFirstName ?? '';
    this.studentLastName = properties.studentLastName ?? '';
    this.teacherComment = properties.teacherComment ?? '';
    this.score = properties.score ?? '';
    this.possibleScore = properties.possibleScore ?? '';
    this.files = properties.files ?? [];
    this.studentId = properties.studentId ?? '';
  }
}

export interface IAssignmentSubmission {
  email: string;
  files?: string[]; // file location in firebase storage
  studentFirstName?: string;
  studentLastName?: string;
  possibleScore?: string;
  score?: string;
  studentId?: string;
  teacherComment?: string;
  studentComment?: string;
}

export interface IUser {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
  lastLoggedIn?: Date;
}

export interface IFirebaseAssignment {
  dueAt: firebase.firestore.Timestamp;
  createdAt: firebase.firestore.Timestamp;
  name: string;
  isVisibleToStudents: boolean;
}

export interface IDisplayAssignment {
  dueAt: string;
  createdAt: string;
  name: string;
  isVisibleToStudents: boolean;
}

export interface IGroupAssignmentsByDueAtLocalDateString {
  [key: string]: IDisplayAssignment[];
}

export interface FileParams {
  classId: string;
  assignmentId: string;
  studentUid: string;
  file: File;
  fileId: string;
}

export interface FileUrlAndType {
  fileUrl: string;
  fileType: string | undefined;
}
