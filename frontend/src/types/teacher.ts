export interface Teacher {
  id: number;
  firstname: string;
  lastname: string;
  homeAddress: string;
  phoneNumber: string;
  birthDate: Date;
  login: string;
  roleId: number;
  weekWorkHours: number;
  avatarUrl: string;
  preferredClassroomId?: number | null;
}
