
export class User {
   
   
    id: string | null;
    login?: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string;
    activated?: boolean;
    langKey?: string;
    authorities?: string[];
    createdBy?: string;
    createdDate?: Date;
    lastModifiedBy?: string;
    lastModifiedDate?: Date;

     constructor() {
        this.id ='';
        this.login = '';
        this.firstName = '';
        this.lastName ='';
        this.email='';
        this.activated= false;
        this.langKey= '';
        this.authorities= [];
        this.createdBy= '';
        this.createdDate= new Date;
        this.lastModifiedBy= '';
        this.lastModifiedDate= new Date;
    
       
       
    
      }
}



