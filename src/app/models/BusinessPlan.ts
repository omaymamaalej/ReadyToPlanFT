import { Country } from '../enumerations/country.enum';
import { Languages } from '../enumerations/languages.enum';
import * as dayjs from 'dayjs';

export class BusinessPlan {
  id: string;
  companyName: string;
  companyStartDate: dayjs.Dayjs;
  country: Country;
  languages: Languages;
  companyDescription: string;

  constructor(){
    this.id = '';
    this.companyName = '';
    this.companyStartDate = dayjs(); 
    this.country = Country.FRANCE; 
    this.languages =Languages.ENGLISH;
    this.companyDescription ='';
  }
}

export interface BusinessPlanDto {
  id: string;
  companyName: string;
  companyStartDate: dayjs.Dayjs;
  country: Country;
  languages: Languages;
  companyDescription: string;
  generatedPresentation?: string;
  // regeneratePresentation?: boolean;
}
