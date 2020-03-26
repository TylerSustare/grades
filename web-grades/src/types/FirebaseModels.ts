export class AssignmentSubmission {
  email: string;
  file: string; // file location in firebase storage
  studentName: string;
  possibleScore: number;
  score: number;
  teacherComment: string;
  studentComment: string;
  constructor(options: any) {
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        this[key] = options[key];
      }
    }
  }
}
