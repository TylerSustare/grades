export class AssignmentSubmission {
  email: string;
  files: string[]; // file location in firebase storage
  studentName: string;
  studentId: string;
  possibleScore: string;
  score: string;
  teacherComment: string;
  studentComment: string;
  constructor(properties: IAssignmentSubmission) {
    // all of these exist because firestore needs vanilla js objects and Object.assign() can't use undefined fields
    this.email = properties.email ?? '';
    this.studentComment = properties.studentComment ?? '';
    this.studentName = properties.studentName ?? '';
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
  studentName?: string;
  possibleScore?: string;
  score?: string;
  studentId?: string;
  teacherComment?: string;
  studentComment?: string;
}
