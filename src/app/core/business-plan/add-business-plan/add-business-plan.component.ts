import { Component } from '@angular/core';
import { NbComponentStatus } from '@nebular/theme';

@Component({
  selector: 'app-add-business-plan',
  templateUrl: './add-business-plan.component.html',
  styleUrls: ['./add-business-plan.component.css']
})
export class AddBusinessPlanComponent {

  // statuses: NbComponentStatus[] = [ 'primary'];

  starRate = 2;
  heartRate = 4;
  radioGroupValue = 'This is value 2';

}
