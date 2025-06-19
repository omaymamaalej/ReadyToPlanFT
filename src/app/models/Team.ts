import { Currency } from "../enumerations/currency.enum";

  export class Team {
   id:string | undefined;
   name:string | undefined;
    role:string| undefined;
   competance: string | undefined;
     email: string | undefined;
  salaire?: number;      // number pour Long côté TS
 currency: Currency | undefined ;
  }