import { Component } from '@angular/core';

@Component({
  selector: 'app-list-business-plan',
  templateUrl: './list-business-plan.component.html',
  styleUrls: ['./list-business-plan.component.css']
})
export class ListBusinessPlanComponent {

  businessPlans = [
  {
    id: 1,
    companyName: 'novapack',
    companyStartDate: new Date('2025-03-24'),
    imageUrl: 'assets/images/your-image.png', // remplace par une vraie URL ou lien local
  },
  
  // Ajoute d'autres plans...
];

currentPage = 1;
totalPages = 1; // à ajuster selon ta logique
  page: number = 1;   // ← AJOUTE cette ligne

}
