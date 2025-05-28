import { Country } from '../enumerations/country.enum';
import { Languages } from '../enumerations/languages.enum';
import { Currency } from '../enumerations/currency.enum';
import * as dayjs from 'dayjs';

export class BusinessPlan {
  id: string;
  companyName: string;
  companyStartDate: dayjs.Dayjs;
  country: Country;
  languages: Languages;
  companyDescription: string;
  anticipatedProjectSize: number;
  currency: Currency;

  constructor(){
    this.id = '';
    this.companyName = '';
    this.companyStartDate = dayjs(); 
    this.country = Country.FRANCE; 
    this.languages =Languages.ENGLISH;
    this.companyDescription ='';
    this.anticipatedProjectSize =0;
    this.currency = Currency.EUR;
  }
}

export interface BusinessPlanDto {
  id: string;
  companyName: string;
  companyStartDate: dayjs.Dayjs;
  country: Country;
  languages: Languages;
  companyDescription: string;
  anticipatedProjectSize: number;
  currency: Currency;
  generatedPresentation?: string;
  regeneratePresentation?: boolean;
}
