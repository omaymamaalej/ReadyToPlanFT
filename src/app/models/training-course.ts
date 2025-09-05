import { Languages } from "../enumerations/languages.enum";
import { Level } from "../enumerations/level.enum";
import { LocationType } from "../enumerations/locationType.enum";
import { StudyClass } from "../enumerations/studyClass.enum";
import { TargetAudience } from "../enumerations/targetAudience.enum";

export class TrainingCourse  {
  id: string;
  title: string;
  summary: string;
  targetAudience: TargetAudience;
  instructor: string;
  studyClass: StudyClass;
  level: Level;
  locationType: LocationType;
  duration: string;
  languages: Languages;
  presentation: string;
  publicPresentation: boolean; 
  satisfaction: number;
  createdBy: string;          
  createdByLogin: string;     
  createdDate: Date;          

  constructor(){
    this.id = '';
    this.title = '';
    this.summary = '';
    this.targetAudience = TargetAudience.TEACHERS;
    this.instructor = '';
    this.studyClass = StudyClass.MASTER2;
    this.level = Level.BEGINNER;
    this.locationType = LocationType.SITE;
    this.duration = '';
    this.languages = Languages.ENGLISH;
    this.presentation = '';
    this.publicPresentation = false;
    this.satisfaction = 0; 
    this.createdBy = '';      
    this.createdByLogin = ''; 
    this.createdDate = new Date(); 
  }
}

export interface TrainingCourseDto {
  id: string;
  title: string;
  summary: string;
  targetAudience: TargetAudience;
  instructor: string;
  studyClass: StudyClass;
  level: Level;
  locationType: LocationType; 
  duration: string;
  languages: Languages;
  presentation: string;
  publicPresentation: boolean; 
  satisfaction: number;
  createdBy: string;          
  createdByLogin: string;     
  createdDate: Date;          
}