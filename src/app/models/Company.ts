import { Country } from "../enumerations/country.enum";
import { Currency } from "../enumerations/currency.enum";

export class Company {
    id: string;
    enterpriseName: string;
    country: Country;
    phoneNumber: number;
    description: string;
    amount: number;
    currency: Currency;
    aiPresentation: string; 

  constructor(){
    this.id = '';
    this.enterpriseName = '';
    this.country = Country.FRANCE; 
    this.phoneNumber =0;
    this.description ='';
    this.amount =0;
    this.currency = Currency.EUR;
    this.aiPresentation = '';

  }


      

}