import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { Currency } from 'src/app/enumerations/currency.enum';
import { Team } from 'src/app/models/Team';
import { AiGenerationService } from 'src/app/services/ai-generation.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.css']
})
export class TeamDetailComponent implements OnInit {
  
  @Input() memberToEdit?: Team;
  @Input() companyId!: string;

  currencies = Object.values(Currency);
  memberForm!: FormGroup;
  roles = ['CEO', 'Developer', 'Designer', 'Manager'];

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    protected dialogRef: NbDialogRef<TeamDetailComponent>,
    private aiService: AiGenerationService
  ) { }

  ngOnInit(): void {
    this.memberForm = this.fb.group({
      name: [this.memberToEdit?.name || '', Validators.required],
      role: [this.memberToEdit?.role || '', Validators.required],
      competance: [this.memberToEdit?.competance || '', Validators.required],
      email: ['', [Validators.email]],   
      salaire: [null, [Validators.min(0)]],
      currency: ['']
    });
  }


  submit(): void {
    if (this.memberForm.invalid) return;

    const member: Team = {
      ...this.memberForm.value,
      id: this.memberToEdit?.id
    };

    if (this.memberToEdit?.id) {
      this.teamService.update(this.memberToEdit.id, member).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      // ⬇️ ICI on envoie aussi le companyId
      this.teamService.create(member, this.companyId).subscribe(() => {

        this.dialogRef.close(true);
      });
    }
  }



  cancel(): void {
    this.dialogRef.close();
  }
}